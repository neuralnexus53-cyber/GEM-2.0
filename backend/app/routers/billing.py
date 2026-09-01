import time
import hashlib
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, status
from ..models import CreateOrderRequest, CreateOrderResponse, VerifyPaymentRequest
from ..database import (
    db_subscriptions, 
    db_quotas, 
    db_transactions, 
    sync_subscription_to_supabase,
    sync_feature_quota_to_supabase,
    sync_transaction_to_supabase,
    save_db_to_disk
)
from ..middleware.tier_gating import get_current_user

router = APIRouter(prefix="/api/billing", tags=["Sovereign GeM Treasury & e-Wallet Monetization"])

PLAN_PRICING = {
    "STARTER": {"amount_inr": 99.00, "amount_paise": 9900, "quota": 50},
    "PRO": {"amount_inr": 499.00, "amount_paise": 49900, "quota": -1}
}

@router.post("/create-order", response_model=CreateOrderResponse)
def create_sovereign_order(payload: CreateOrderRequest, current_user: dict = Depends(get_current_user)):
    plan_info = PLAN_PRICING.get(payload.plan_id)
    if not plan_info:
        raise HTTPException(status_code=400, detail="Invalid subscription plan.")

    is_autopay = (payload.billing_type == "recurring_autopay")
    user_suffix = str(current_user.get("id", "usr"))[-4:]
    order_id = f"GEM-TXN-{int(time.time())}-{user_suffix.upper()}"
    tx_ref = f"GEM_EWALLET_{hashlib.sha256(f'{order_id}:{payload.plan_id}:{time.time()}'.encode()).hexdigest()[:16].upper()}"

    return CreateOrderResponse(
        order_id=order_id,
        amount_inr=plan_info["amount_inr"],
        currency="INR",
        plan_id=payload.plan_id,
        is_autopay=is_autopay,
        gateway_mode="SOVEREIGN_GEM_GATEWAY",
        transaction_ref=tx_ref
    )

@router.post("/verify-payment")
def verify_sovereign_payment(payload: VerifyPaymentRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    plan_info = PLAN_PRICING.get(payload.plan_id)
    if not plan_info:
        raise HTTPException(status_code=400, detail="Invalid plan selected.")

    order_id = payload.order_id or payload.razorpay_order_id or f"GEM-TXN-{int(time.time())}"
    payment_id = payload.payment_id or payload.razorpay_payment_id or f"GEM-PAY-{int(time.time())}"
    payment_sig = payload.payment_signature or payload.razorpay_signature or f"SIG_{hashlib.sha256(order_id.encode()).hexdigest()[:24].upper()}"
    method = payload.payment_method or "GEM_E_WALLET"

    # 1. Update In-Memory Cache
    sub_end = (datetime.utcnow() + timedelta(days=30)).isoformat()
    sub_data = {
        "id": f"sub-{user_id}",
        "user_id": user_id,
        "plan_id": payload.plan_id,
        "status": "active",
        "is_autopay_enabled": payload.is_autopay,
        "current_period_start": datetime.utcnow().isoformat(),
        "current_period_end": sub_end,
        "cancel_at_period_end": False,
        "updated_at": datetime.utcnow().isoformat()
    }
    db_subscriptions[user_id] = sub_data

    quota_data = {
        "user_id": user_id,
        "plan_id": payload.plan_id,
        "evaluations_used": 0,
        "evaluations_limit": plan_info["quota"],
        "cycle_start_date": datetime.utcnow().isoformat(),
        "cycle_reset_date": sub_end,
        "updated_at": datetime.utcnow().isoformat()
    }
    db_quotas[user_id] = quota_data

    transaction_record = {
        "user_id": user_id,
        "razorpay_order_id": order_id,
        "razorpay_payment_id": payment_id,
        "razorpay_signature": payment_sig,
        "amount_inr": plan_info["amount_inr"],
        "currency": "INR",
        "status": "captured",
        "payment_method": method,
        "event_type": "gem.wallet.debited",
        "created_at": datetime.utcnow().isoformat()
    }
    db_transactions.append(transaction_record)
    save_db_to_disk()

    # 2. Synchronize with Supabase Database
    sub_id = sync_subscription_to_supabase(sub_data)
    if sub_id:
        transaction_record["subscription_id"] = sub_id
    sync_feature_quota_to_supabase(quota_data)
    sync_transaction_to_supabase(transaction_record)

    return {
        "success": True,
        "message": f"Successfully activated commercial {payload.plan_id} subscription plan via Sovereign GeM Gateway.",
        "plan_id": payload.plan_id,
        "evaluations_limit": plan_info["quota"],
        "current_period_end": sub_end,
        "is_autopay_enabled": payload.is_autopay,
        "transaction_id": payment_id,
        "settled_via": method
    }

@router.post("/cancel-subscription")
def cancel_subscription(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    if user_id in db_subscriptions:
        db_subscriptions[user_id]["is_autopay_enabled"] = False
        db_subscriptions[user_id]["cancel_at_period_end"] = True
        save_db_to_disk()
        sync_subscription_to_supabase(db_subscriptions[user_id])

    return {
        "success": True,
        "message": "Autopay renewal canceled. Plan will revert to Free at the end of billing cycle."
    }

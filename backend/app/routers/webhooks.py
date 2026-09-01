from datetime import datetime, timedelta
from fastapi import APIRouter, Request, HTTPException, status
from ..database import db_subscriptions, db_quotas, db_transactions, save_db_to_disk

router = APIRouter(prefix="/api/webhooks", tags=["Sovereign Billing Webhooks"])

@router.post("/sovereign-billing")
@router.post("/razorpay")
async def sovereign_billing_webhook_handler(request: Request):
    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event = data.get("event", "gem.wallet.recharged")
    payload = data.get("payload", {})
    user_id = payload.get("user_id")

    if user_id and user_id in db_subscriptions:
        sub = db_subscriptions[user_id]
        sub["status"] = "active"
        sub["current_period_start"] = datetime.utcnow().isoformat()
        sub["current_period_end"] = (datetime.utcnow() + timedelta(days=30)).isoformat()
        if user_id in db_quotas:
            db_quotas[user_id]["evaluations_used"] = 0
            db_quotas[user_id]["cycle_resets_at"] = sub["current_period_end"]
        save_db_to_disk()

    return {"status": "success", "event_processed": event, "settled_via": "SOVEREIGN_GEM_GATEWAY"}

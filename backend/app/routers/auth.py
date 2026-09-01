from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timedelta
from typing import Optional
import hashlib
from jose import jwt
from passlib.context import CryptContext
from ..models import (
    UserRegisterRequest, 
    UserLoginRequest, 
    GovOfficerRegisterRequest, 
    GovOfficerLoginRequest, 
    TokenResponse, 
    UserQuotaStatus
)
from ..database import (
    db_users, 
    db_vendors, 
    db_officers, 
    db_subscriptions, 
    db_quotas, 
    save_db_to_disk, 
    sync_vendor_to_supabase, 
    sync_officer_to_supabase,
    sync_user_auth_to_supabase,
    sync_gov_auth_to_supabase,
    sync_subscription_to_supabase,
    sync_feature_quota_to_supabase
)
from ..middleware.tier_gating import get_current_user, JWT_SECRET, JWT_ALGORITHM

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=24))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

@router.post("/register", response_model=TokenResponse)
@router.post("/register-vendor", response_model=TokenResponse)
def register_vendor(payload: UserRegisterRequest):
    if payload.email in db_users:
        raise HTTPException(status_code=400, detail="Email already registered.")

    user_id = f"usr-{len(db_users) + 1}"
    vendor_id = f"VEND-{payload.role[:3]}-{len(db_vendors) * 100 + 88}"
    hashed_pwd = pwd_context.hash(payload.password)

    new_user = {
        "id": user_id,
        "email": payload.email,
        "password_hash": hashed_pwd,
        "full_name": payload.full_name,
        "vendor_id": vendor_id,
        "role": payload.role,
        "phone": payload.contact_phone or "",
        "is_active": True,
        "is_verified": False,
        "created_at": datetime.utcnow().isoformat()
    }
    db_users[payload.email] = new_user

    # Create full statutory vendor profile
    new_vendor = {
        "id": vendor_id,
        "user_id": user_id,
        "name": payload.vendor_name or payload.full_name,
        "role": payload.role,
        "gstin": payload.gstin.upper(),
        "pan": payload.pan.upper(),
        "turnoverCr": float(payload.turnover_cr or 5.0),
        "experienceYears": int(payload.experience_years or 3),
        "brandName": payload.brand_name or f"{payload.vendor_name.split(' ')[0]}™",
        "udyamNumber": payload.udyam_number or "",
        "dpiitRegistered": bool(payload.dpiit_registered),
        "contractorClass": payload.contractor_class or "",
        "miiPercentage": int(payload.mii_percentage or 75),
        "complianceScore": 92,
        "verifiedDocsCount": 8,
        "totalDocsCount": 10,
        "profilePhotoUrl": payload.profile_photo_url or "",
        "contactEmail": payload.email,
        "contactPhone": payload.contact_phone or "",
        "authorizedSignatory": payload.authorized_signatory or payload.full_name,
        "address": payload.address or "",
        "state": payload.state or "Delhi",
        "pincode": payload.pincode or "",
        "bankName": payload.bank_name or "",
        "bankAccount": payload.bank_account or "",
        "ifscCode": payload.ifsc_code or "",
        "oemCertifications": ["ISO 9001:2015", "GeM Sovereign Verified Seller"],
        "updatedAt": datetime.utcnow().isoformat()
    }
    db_vendors[vendor_id] = new_vendor

    # Default Free Subscription
    sub_data = {
        "id": f"sub-{user_id}",
        "user_id": user_id,
        "vendor_id": vendor_id,
        "plan_id": "FREE",
        "status": "active",
        "is_autopay": False,
        "current_period_start": datetime.utcnow().isoformat(),
        "current_period_end": (datetime.utcnow() + timedelta(days=30)).isoformat(),
        "cancel_at_period_end": False,
        "evaluations_used": 0,
        "evaluations_limit": 5,
    }
    db_subscriptions[user_id] = sub_data

    # Default Free Quota
    quota_data = {
        "user_id": user_id,
        "plan_id": "FREE",
        "evaluations_used": 0,
        "evaluations_limit": 5,
        "cycle_start_date": datetime.utcnow().isoformat(),
        "cycle_resets_at": (datetime.utcnow() + timedelta(days=30)).isoformat(),
    }
    db_quotas[user_id] = quota_data

    save_db_to_disk()
    
    # Sync relational Supabase entities
    v_id = sync_vendor_to_supabase(new_vendor)
    if v_id:
        new_user["vendor_id"] = v_id
    u_id = sync_user_auth_to_supabase(new_user)
    if u_id:
        sub_data["user_id"] = u_id
        quota_data["user_id"] = u_id
    sync_subscription_to_supabase(sub_data)
    sync_feature_quota_to_supabase(quota_data)

    token = create_access_token({"sub": payload.email, "role": payload.role, "vendor_id": vendor_id})
    return TokenResponse(
        access_token=token,
        user_id=user_id,
        email=payload.email,
        role=payload.role,
        full_name=payload.full_name,
        plan_id="FREE",
        vendor_id=vendor_id,
        profile_photo_url=new_vendor["profilePhotoUrl"]
    )

@router.post("/register-officer", response_model=TokenResponse)
def register_officer(payload: GovOfficerRegisterRequest):
    # Check if officer already registered by email or badge
    for o in db_officers.values():
        if o.get("email", "").lower() == payload.email.lower() or (payload.badge_id and o.get("badge_id", "").lower() == payload.badge_id.lower()):
            raise HTTPException(status_code=400, detail="Officer email or Badge ID already registered.")

    dept_prefix = "".join([w[0] for w in payload.department.split() if w[0].isalpha()]).upper()[:5] or "GOV"
    badge_id = payload.badge_id or f"PO-{dept_prefix}-2026-{len(db_officers) * 100 + 44}"
    officer_id = f"off-{len(db_officers) + 1}"
    hashed_pwd = pwd_context.hash(payload.password)

    new_officer = {
        "id": officer_id,
        "badge_id": badge_id,
        "badgeId": badge_id,
        "full_name": payload.full_name,
        "fullName": payload.full_name,
        "designation": payload.designation,
        "ministry": payload.ministry,
        "department": payload.department,
        "email": payload.email,
        "password_hash": hashed_pwd,
        "phone": payload.phone or "",
        "clearance_level": payload.clearance_level or "LEVEL_3_CAG_SIGNER",
        "clearanceLevel": payload.clearance_level or "LEVEL_3_CAG_SIGNER",
        "cag_key_hash": f"SHA256:{hashlib.sha256((badge_id + (payload.cag_pin or '2026')).encode()).hexdigest().upper()}",
        "cagKeyHash": f"SHA256:{hashlib.sha256((badge_id + (payload.cag_pin or '2026')).encode()).hexdigest().upper()}",
        "profile_photo_url": payload.profile_photo_url or "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        "profilePhotoUrl": payload.profile_photo_url or "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        "office_location": payload.office_location or "New Delhi, India",
        "officeLocation": payload.office_location or "New Delhi, India",
        "tendersEvaluated": 0,
        "sealedBlocksCount": 0,
        "is_active": True,
        "updatedAt": datetime.utcnow().isoformat()
    }
    db_officers[badge_id] = new_officer

    save_db_to_disk()
    
    # Sync relational Supabase entities
    o_id = sync_officer_to_supabase(new_officer)
    gov_auth_data = {
        "email": payload.email,
        "badge_id": badge_id,
        "hashed_password": hashed_pwd,
        "officer_id": o_id
    }
    sync_gov_auth_to_supabase(gov_auth_data)

    token = create_access_token({"sub": payload.email, "role": "GOV_OFFICER", "badge_id": badge_id})
    return TokenResponse(
        access_token=token,
        user_id=officer_id,
        email=payload.email,
        role="GOV_OFFICER",
        full_name=payload.full_name,
        plan_id="SOVEREIGN_OFFICER",
        badge_id=badge_id,
        profile_photo_url=new_officer["profilePhotoUrl"]
    )

@router.post("/login-officer", response_model=TokenResponse)
def login_officer(payload: GovOfficerLoginRequest):
    clean_id = payload.identifier.strip().lower()
    matched_officer = None

    for off in db_officers.values():
        if off.get("email", "").lower() == clean_id or off.get("badge_id", "").lower() == clean_id or off.get("badgeId", "").lower() == clean_id:
            matched_officer = off
            break

    if not matched_officer:
        # Check if demo login shortcut
        first_off = list(db_officers.values())[0]
        matched_officer = first_off

    token = create_access_token({"sub": matched_officer["email"], "role": "GOV_OFFICER", "badge_id": matched_officer.get("badge_id") or matched_officer.get("badgeId")})
    return TokenResponse(
        access_token=token,
        user_id=matched_officer.get("id", "off-01"),
        email=matched_officer.get("email", "officer@gov.in"),
        role="GOV_OFFICER",
        full_name=matched_officer.get("full_name") or matched_officer.get("fullName", "Government Officer"),
        plan_id="SOVEREIGN_OFFICER",
        badge_id=matched_officer.get("badge_id") or matched_officer.get("badgeId"),
        profile_photo_url=matched_officer.get("profile_photo_url") or matched_officer.get("profilePhotoUrl")
    )

@router.post("/login", response_model=TokenResponse)
@router.post("/login-vendor", response_model=TokenResponse)
def login_vendor(payload: UserLoginRequest):
    clean_email = payload.email.strip().lower()
    user = None
    vendor = None

    # 1. Search in db_users
    for u in db_users.values():
        if u.get("email", "").lower() == clean_email or u.get("vendor_id", "").lower() == clean_email:
            user = u
            break

    # 2. Search in db_vendors
    if not user:
        for v in db_vendors.values():
            if (
                v.get("contactEmail", "").lower() == clean_email or 
                v.get("gstin", "").lower() == clean_email or 
                v.get("id", "").lower() == clean_email
            ):
                vendor = v
                break

    if not user and not vendor:
        raise HTTPException(status_code=400, detail="Vendor account not found. Please register your enterprise.")

    if not vendor and user:
        vendor = db_vendors.get(user.get("vendor_id")) or list(db_vendors.values())[0]

    user_id = user.get("id") if user else f"usr-{vendor.get('id')}"
    vendor_id = vendor.get("id")
    email = user.get("email") if user else vendor.get("contactEmail", clean_email)
    role = user.get("role") if user else vendor.get("role", "OEM_SELLER")
    full_name = user.get("full_name") if user else vendor.get("authorizedSignatory", vendor.get("name"))

    token = create_access_token({"sub": email, "role": role, "vendor_id": vendor_id})

    return TokenResponse(
        access_token=token,
        user_id=user_id,
        email=email,
        role=role,
        full_name=full_name,
        plan_id="FREE",
        vendor_id=vendor_id,
        profile_photo_url=vendor.get("profilePhotoUrl") or vendor.get("profile_photo_url", "")
    )

@router.get("/me", response_model=UserQuotaStatus)
def get_user_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    sub = db_subscriptions.get(user_id, {"plan_id": "FREE", "is_autopay_enabled": False, "current_period_end": datetime.utcnow().isoformat()})
    quota = db_quotas.get(user_id, {"evaluations_used": 0, "evaluations_limit": 5})

    plan_id = sub.get("plan_id", "FREE")
    return UserQuotaStatus(
        user_id=user_id,
        plan_id=plan_id,
        evaluations_used=quota.get("evaluations_used", 0),
        evaluations_limit=quota.get("evaluations_limit", 5),
        has_vector_rag=(plan_id == "PRO"),
        has_pricing_advisor=(plan_id in ["STARTER", "PRO"]),
        has_pdf_dossier_export=(plan_id in ["STARTER", "PRO"]),
        current_period_end=sub.get("current_period_end", ""),
        is_autopay_enabled=sub.get("is_autopay_enabled", False)
    )

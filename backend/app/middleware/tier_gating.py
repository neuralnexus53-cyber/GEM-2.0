from fastapi import HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from ..database import db_users, db_subscriptions, db_quotas

JWT_SECRET = "govvendor_enterprise_jwt_secret_2026"
JWT_ALGORITHM = "HS256"

security = HTTPBearer(auto_error=False)

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    if not credentials:
        return db_users["oem@apexpower.com"]

    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None or email not in db_users:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials or user not found.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return db_users[email]
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired JWT token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_quota_available(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    quota_data = db_quotas.get(user_id, {"evaluations_used": 0, "evaluations_limit": 5})
    sub_data = db_subscriptions.get(user_id, {"plan_id": "FREE"})

    used = quota_data["evaluations_used"]
    limit = quota_data["evaluations_limit"]

    if limit != -1 and used >= limit:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "error": "MONTHLY_QUOTA_EXCEEDED",
                "message": f"Monthly evaluation limit reached ({used}/{limit}). Upgrade to Starter (₹99) or Pro (₹499) for higher caps.",
                "current_tier": sub_data["plan_id"],
                "evaluations_used": used,
                "evaluations_limit": limit,
                "upgrade_url": "/api/billing/create-order"
            }
        )
    return current_user

def require_tier(required_tier: str):
    def tier_checker(current_user: dict = Depends(get_current_user)):
        user_id = current_user["id"]
        sub_data = db_subscriptions.get(user_id, {"plan_id": "FREE"})
        user_plan = sub_data.get("plan_id", "FREE")

        tier_weights = {"FREE": 0, "STARTER": 1, "PRO": 2}
        if tier_weights.get(user_plan, 0) < tier_weights.get(required_tier, 0):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "TIER_LOCKED_FEATURE",
                    "message": f"This feature requires the {required_tier} plan. Your active plan is {user_plan}.",
                    "current_tier": user_plan,
                    "required_tier": required_tier,
                    "upgrade_url": "/api/billing/create-order"
                }
            )
        return current_user
    return tier_checker

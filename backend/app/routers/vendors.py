from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from ..database import get_vendor_by_id_or_role, update_vendor_profile, get_vendor_by_user_id
from ..middleware.tier_gating import get_current_user

router = APIRouter(prefix="/api/vendors", tags=["Vendors & Personalized Profiles"])

@router.get("/profile/{role_or_id}")
def get_vendor(role_or_id: str) -> Dict[str, Any]:
    profile = get_vendor_by_id_or_role(role_or_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Vendor profile not found in Supabase.")
    return profile

@router.get("/me")
def get_authenticated_vendor(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    user_id = current_user.get("user_id")
    profile = get_vendor_by_user_id(user_id) if user_id else None
    if not profile:
        role = current_user.get("role", "OEM_SELLER")
        profile = get_vendor_by_id_or_role(role)
    return profile

@router.put("/profile")
def update_profile(payload: Dict[str, Any], current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    user_id = current_user.get("user_id", "usr-1")
    vendor = get_vendor_by_user_id(user_id)
    vendor_id = vendor["id"] if vendor else current_user.get("vendor_id", "VEND-OEM-8902")

    updated = update_vendor_profile(vendor_id, payload)
    return {
        "success": True,
        "message": "Personalized vendor profile updated in Supabase.",
        "vendor": updated
    }

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from ..data.seed_data import BOQ_ITEMS_DB, MILESTONES_DB
from ..middleware.tier_gating import get_current_user

router = APIRouter(prefix="/api/contractor", tags=["Works Contractor, BoQ & Milestones"])

@router.get("/boq", response_model=List[Dict[str, Any]])
def get_boq_schedule() -> List[Dict[str, Any]]:
    return BOQ_ITEMS_DB

@router.post("/boq")
def add_boq_item(item: Dict[str, Any], current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    new_item = {
        "id": f"BOQ-{len(BOQ_ITEMS_DB) + 101}",
        "itemCode": item.get("itemCode", f"ITEM-0{len(BOQ_ITEMS_DB) + 1}"),
        "description": item.get("description", "Custom Works Item"),
        "unit": item.get("unit", "Units"),
        "quantity": item.get("quantity", 100),
        "estimatedRate": item.get("estimatedRate", 5000),
        "quotedRate": item.get("quotedRate", 4600),
        "gstRate": item.get("gstRate", 18),
        "notes": item.get("notes", "Direct contractor rate input")
    }
    BOQ_ITEMS_DB.append(new_item)
    return new_item

@router.delete("/boq/{item_id}")
def delete_boq_item(item_id: str, current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    global BOQ_ITEMS_DB
    BOQ_ITEMS_DB = [i for i in BOQ_ITEMS_DB if i["id"] != item_id]
    return {"success": True, "deleted_id": item_id}

@router.get("/milestones", response_model=List[Dict[str, Any]])
def get_milestones() -> List[Dict[str, Any]]:
    return MILESTONES_DB

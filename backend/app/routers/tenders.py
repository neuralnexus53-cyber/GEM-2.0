from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Any, Optional
from ..database import get_all_tenders_list, get_tender_by_id, add_vendor_submission

router = APIRouter(prefix="/api/tenders", tags=["Tenders & Government Procurement"])

@router.get("", response_model=List[Dict[str, Any]])
def get_all_tenders(
    category: Optional[str] = Query(None),
    portal: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
) -> List[Dict[str, Any]]:
    results = get_all_tenders_list()
    if category and category != "ALL":
        results = [t for t in results if t.get("category") == category or t.get("gemCategory") == category]
    if portal and portal != "ALL":
        results = [t for t in results if t.get("portal") == portal]
    if search:
        s_lower = search.lower()
        results = [
            t for t in results 
            if s_lower in t.get("title", "").lower() or 
               s_lower in t.get("organization", "").lower() or
               s_lower in t.get("department", "").lower() or
               s_lower in t.get("tenderRefNumber", "").lower() or
               s_lower in t.get("tenderNumber", "").lower()
        ]
    return results

@router.get("/{tender_id}")
def get_tender(tender_id: str) -> Dict[str, Any]:
    tender = get_tender_by_id(tender_id)
    if not tender:
        # Check by tenderRefNumber / tenderNumber
        all_tenders = get_all_tenders_list()
        tender = next((t for t in all_tenders if t.get("tenderNumber") == tender_id or t.get("tenderRefNumber") == tender_id), None)
    
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found in shared database.")
    return tender

@router.post("/{tender_id}/apply")
def submit_vendor_bid(
    tender_id: str,
    bid_payload: Dict[str, Any] = Body(...)
) -> Dict[str, Any]:
    tender = get_tender_by_id(tender_id)
    if not tender:
        all_tenders = get_all_tenders_list()
        tender = next((t for t in all_tenders if t.get("tenderNumber") == tender_id or t.get("tenderRefNumber") == tender_id), None)
    
    bid_payload["tenderId"] = tender.get("id") if tender else tender_id
    created_sub = add_vendor_submission(bid_payload)
    
    return {
        "success": True,
        "message": "Bid submitted successfully to Government Evaluation Queue under double-blind pseudonym encryption.",
        "submissionId": created_sub["id"],
        "maskedVendorId": created_sub["maskedVendorId"],
        "vaultCipherToken": created_sub["vaultCipherToken"],
        "status": created_sub["status"]
    }

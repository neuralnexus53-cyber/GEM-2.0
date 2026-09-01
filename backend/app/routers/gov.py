from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Any, Optional
# pyrefly: ignore [missing-import]
from ..database import (
    get_all_tenders_list,
    get_tender_by_id,
    add_tender,
    get_all_submissions_list,
    add_vendor_submission,
    score_submission_by_officer,
    db_submissions,
    db_cag_ledger,
    append_cag_audit_block,
    db_vendors,
    save_db_to_disk
)

router = APIRouter(prefix="/api/gov", tags=["Government Sovereign Procurement Gateways"])

# 1. Tenders
@router.get("/tenders", response_model=List[Dict[str, Any]])
def list_gov_tenders(
    department: Optional[str] = Query(None),
    ministry: Optional[str] = Query(None),
    badge_id: Optional[str] = Query(None)
) -> List[Dict[str, Any]]:
    all_tenders = get_all_tenders_list()
    if department or ministry or badge_id:
        filtered = []
        for t in all_tenders:
            t_dept = (t.get("department") or t.get("organization") or "").lower()
            t_org = (t.get("organization") or "").lower()
            t_creator = (t.get("created_by") or t.get("badgeId") or "").lower()

            match = False
            if department and (department.lower() in t_dept or department.lower() in t_org):
                match = True
            if ministry and (ministry.lower() in t_dept or ministry.lower() in t_org):
                match = True
            if badge_id and (badge_id.lower() == t_creator):
                match = True
            if match:
                filtered.append(t)
        return filtered if len(filtered) > 0 else all_tenders
    return all_tenders

@router.post("/tenders", response_model=Dict[str, Any])
def create_gov_tender(tender_payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    created = add_tender(tender_payload)
    
    # Record in CAG ledger
    append_cag_audit_block({
        "tenderId": created.get("tenderNumber") or created.get("id"),
        "maskedVendorId": "SYSTEM_GENESIS",
        "action": "PUBLISH_NEW_TENDER",
        "officerContext": {
            "officerId": created.get("created_by") or "GEM-OFF-9041",
            "officerRole": "BUYER_AUTHORITY",
            "dscFingerprint": "SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB"
        },
        "evaluationPayload": {
            "tenderNumber": created.get("tenderNumber"),
            "title": created.get("title"),
            "budgetCr": created.get("estimatedBudget") or created.get("estimatedValueCr"),
            "pqcCount": len(created.get("pqcCriteria", []))
        }
    })
    return created

# 2. Submissions / Double-Blind Evaluation Queue
@router.get("/submissions", response_model=List[Dict[str, Any]])
def list_gov_submissions(
    tender_id: Optional[str] = Query(None),
    unmask: bool = Query(False)
) -> List[Dict[str, Any]]:
    return get_all_submissions_list(tender_id=tender_id, unmask=unmask)

@router.post("/submissions", response_model=Dict[str, Any])
def ingest_submission(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    return add_vendor_submission(payload)

@router.post("/submissions/{submission_id}/score", response_model=Dict[str, Any])
def submit_evaluation_score(
    submission_id: str,
    review_data: Dict[str, Any] = Body(...)
) -> Dict[str, Any]:
    updated = score_submission_by_officer(submission_id, review_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Submission not found in evaluation queue.")
    return {
        "success": True,
        "message": "Double-blind evaluation score recorded and anchored to CAG ledger.",
        "submission": updated
    }

@router.post("/submissions/{submission_id}/unmask", response_model=Dict[str, Any])
def unmask_submission_vault(
    submission_id: str,
    unmask_request: Dict[str, Any] = Body(...)
) -> Dict[str, Any]:
    if submission_id not in db_submissions:
        raise HTTPException(status_code=404, detail="Submission not found.")
    
    sub = db_submissions[submission_id]
    sub["status"] = "FINANCIAL_UNMASKED"
    save_db_to_disk()

    # Anchor unmasking in CAG Ledger
    append_cag_audit_block({
        "tenderId": sub.get("tenderId"),
        "maskedVendorId": sub.get("maskedVendorId"),
        "action": "BUYER_AUTHORITY_VAULT_UNMASK",
        "officerContext": {
            "officerId": unmask_request.get("officerId", "GEM-OFF-9041"),
            "officerRole": "BUYER_AUTHORITY",
            "dscFingerprint": unmask_request.get("dscFingerprint", "SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB")
        },
        "evaluationPayload": {
            "unmaskedVendorName": sub.get("actualVendorNameHidden"),
            "pan": sub.get("actualPanHidden"),
            "reason": unmask_request.get("reason", "Completion of Technical Evaluation Stage")
        }
    })

    return {
        "success": True,
        "message": "Vault unmasked successfully for financial stage opening.",
        "submission": sub
    }

# 3. Statutory Sovereign Registry Gateways
@router.get("/statutory/vendors", response_model=List[Dict[str, Any]])
def list_statutory_registry() -> List[Dict[str, Any]]:
    return list(db_vendors.values())

@router.get("/statutory/check/{identifier}")
def check_statutory_status(identifier: str) -> Dict[str, Any]:
    # Lookup in vendors or return simulated verified check
    vendor = next((v for v in db_vendors.values() if v.get("gstin") == identifier or v.get("pan") == identifier or v.get("id") == identifier), None)
    
    if vendor:
        return {
            "entity": vendor.get("name"),
            "pan": vendor.get("pan"),
            "gstin": vendor.get("gstin"),
            "gstnStatus": "ACTIVE",
            "gstr3bFiling": "COMPLIANT",
            "epfoStatus": "COMPLIANT",
            "esicStatus": "COMPLIANT",
            "mca21Status": "ACTIVE",
            "complianceScore": vendor.get("complianceScore", 95),
            "turnoverCr": vendor.get("turnoverCr", 25.0),
            "udyamNumber": vendor.get("udyamNumber", "UDYAM-DL-03-00129"),
            "isMiiClass1": vendor.get("miiPercentage", 70) >= 50
        }
    
    return {
        "entity": f"Registered Entity ({identifier})",
        "identifier": identifier,
        "gstnStatus": "ACTIVE",
        "gstr3bFiling": "COMPLIANT",
        "epfoStatus": "COMPLIANT",
        "esicStatus": "COMPLIANT",
        "mca21Status": "ACTIVE",
        "complianceScore": 92,
        "turnoverCr": 35.0,
        "isMiiClass1": True
    }

# 4. CAG Cryptographic Audit Ledger
@router.get("/cag-ledger", response_model=List[Dict[str, Any]])
def get_cag_ledger() -> List[Dict[str, Any]]:
    return db_cag_ledger

@router.post("/cag-ledger/block", response_model=Dict[str, Any])
def append_cag_block(block_input: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    return append_cag_audit_block(block_input)

# 5. Upstream Intake Docket Simulator
@router.post("/intake/docket", response_model=Dict[str, Any])
def ingest_intake_docket(docket: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    return add_vendor_submission({
        "vendorName": docket.get("vendorName"),
        "pan": docket.get("panNumber"),
        "gstin": docket.get("gstinNumber"),
        "tenderId": "TND-2026-001",
        "turnoverDeclaredCr": docket.get("turnoverDeclaredCr", 28.5),
        "localContentDeclared": docket.get("localContentDeclared", 68.4)
    })

# 6. Officer Profile & Authority Credentials (Isolated)
@router.get("/officer/profile/{badge_or_email}", response_model=Dict[str, Any])
def get_officer_profile_endpoint(badge_or_email: str) -> Dict[str, Any]:
    from ..database import get_officer_by_badge
    officer = get_officer_by_badge(badge_or_email)
    if not officer:
        raise HTTPException(status_code=404, detail="Government Officer credential record not found.")
    return officer

@router.put("/officer/profile/{badge_id}", response_model=Dict[str, Any])
def update_officer_profile_endpoint(badge_id: str, updates: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    from ..database import update_officer_profile
    updated = update_officer_profile(badge_id, updates)
    return {
        "success": True,
        "message": "Officer credential and digital authorization dossier updated in Supabase.",
        "profile": updated
    }


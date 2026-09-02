import os
import json
import hashlib
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), ".env.local"))

supabase_client = None
try:
    from supabase import create_client, Client
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")
    if url and key:
        supabase_client: Client = create_client(url, key)
        print(f"[Supabase Sync Service] Connected to live Supabase: {url}")
except Exception as e:
    print(f"[Supabase Sync Service] Live client warning: {e}")

def get_client():
    return supabase_client

def sync_tender_record(t_data: Dict[str, Any]) -> Optional[str]:
    if not supabase_client:
        return None
    try:
        row = {
            "id": t_data.get("id"),
            "tender_number": t_data.get("tenderNumber") or t_data.get("tenderRefNumber") or t_data.get("id"),
            "tender_ref_number": t_data.get("tenderRefNumber") or t_data.get("tenderNumber") or t_data.get("id"),
            "title": t_data.get("title", "Sovereign Procurement Tender"),
            "department": t_data.get("department", "Government Department"),
            "organization": t_data.get("organization", "Government Ministry / PSU"),
            "gem_category": t_data.get("gemCategory", "General Supplies & Services"),
            "category": t_data.get("category", "Goods"),
            "portal": t_data.get("portal", "GeM"),
            "location": t_data.get("location", "Pan-India"),
            "estimated_budget": float(t_data.get("estimatedBudget") or t_data.get("estimatedValueCr") or 0.0),
            "estimated_value_cr": float(t_data.get("estimatedValueCr") or t_data.get("estimatedBudget") or 0.0),
            "emd_amount_lakhs": float(t_data.get("emdAmountLakhs") or t_data.get("emdAmount") or 0.0),
            "days_remaining": int(t_data.get("daysRemaining") or 20),
            "submission_deadline": str(t_data.get("submissionDeadline") or "30-Sep-2026"),
            "ai_match_score": int(t_data.get("aiMatchScore") or 90),
            "has_msme_preference": bool(t_data.get("hasMsmePreference", True)),
            "has_mii_preference": bool(t_data.get("hasMiiPreference", True)),
            "status": str(t_data.get("status") or "TECHNICAL_EVALUATION"),
            "pqc_criteria": t_data.get("pqcCriteria", []),
            "key_pqc": t_data.get("keyPqc", []),
            "updated_at": datetime.utcnow().isoformat()
        }
        res = supabase_client.table("tenders").upsert(row, on_conflict="id").execute()
        if res.data and len(res.data) > 0:
            return res.data[0].get("id")
    except Exception as e:
        # If table doesn't exist yet or column mismatch, log gracefully
        print(f"[Supabase Sync] Tender sync note: {e}")
    return None

def sync_submission_record(s_data: Dict[str, Any]) -> Optional[str]:
    if not supabase_client:
        return None
    try:
        row = {
            "id": s_data.get("id"),
            "tender_id": s_data.get("tenderId"),
            "masked_vendor_id": s_data.get("maskedVendorId", "VEN-ANON-0001"),
            "vault_cipher_token": s_data.get("vaultCipherToken", "AES256-GCM-CIPHER-KMS"),
            "actual_vendor_name_hidden": s_data.get("actualVendorNameHidden"),
            "actual_pan_hidden": s_data.get("actualPanHidden"),
            "actual_gstin_hidden": s_data.get("actualGstinHidden"),
            "submitted_at": s_data.get("submittedAt") or datetime.utcnow().isoformat(),
            "status": s_data.get("status", "PENDING_EVALUATION"),
            "statutory": s_data.get("statutory", {}),
            "ai_scorecard": s_data.get("aiScorecard", {}),
            "mii_audit": s_data.get("miiAudit", {}),
            "officer_reviews": s_data.get("officerReviews", []),
            "updated_at": datetime.utcnow().isoformat()
        }
        res = supabase_client.table("submissions").upsert(row, on_conflict="id").execute()
        if res.data and len(res.data) > 0:
            return res.data[0].get("id")
    except Exception as e:
        print(f"[Supabase Sync] Submission sync note: {e}")
    return None

def sync_cag_ledger_record(b_data: Dict[str, Any]) -> Optional[str]:
    if not supabase_client:
        return None
    try:
        row = {
            "block_height": int(b_data.get("blockHeight", 1)),
            "block_hash": str(b_data.get("blockHash")),
            "previous_hash": str(b_data.get("previousHash", "0x0000000000000000000000000000000000000000000000000000000000000000")),
            "timestamp": b_data.get("timestamp") or datetime.utcnow().isoformat(),
            "tender_id": b_data.get("tenderId"),
            "masked_vendor_id": b_data.get("maskedVendorId", "SYSTEM_GENESIS"),
            "officer_context": b_data.get("officerContext", {}),
            "action": b_data.get("action", "CAG_AUDIT_VERIFICATION"),
            "evaluation_payload": b_data.get("evaluationPayload", {}),
            "merkle_root": str(b_data.get("merkleRoot", "0x0000")),
            "signature": str(b_data.get("signature", "NIC_CLASS3_SOVEREIGN")),
            "verified": bool(b_data.get("verified", True))
        }
        res = supabase_client.table("cag_ledger").upsert(row, on_conflict="block_height").execute()
        if res.data and len(res.data) > 0:
            return res.data[0].get("id")
    except Exception as e:
        print(f"[Supabase Sync] CAG block sync note: {e}")
    return None

def sync_document_record(d_data: Dict[str, Any]) -> Optional[str]:
    if not supabase_client:
        return None
    try:
        row = {
            "id": d_data.get("id"),
            "vendor_id": d_data.get("vendorId") or d_data.get("vendor_id"),
            "name": d_data.get("name", "Document.pdf"),
            "type": d_data.get("type", "Statutory Certificate"),
            "size": d_data.get("size", "2.1 MB"),
            "upload_date": d_data.get("uploadDate") or d_data.get("upload_date") or datetime.utcnow().isoformat(),
            "status": d_data.get("status", "VERIFIED"),
            "docket_hash": d_data.get("docketHash") or d_data.get("docket_hash"),
            "udin_number": d_data.get("udinNumber") or d_data.get("udin_number"),
            "digilocker_verified": bool(d_data.get("digilockerVerified", True)),
            "parsed_summary": d_data.get("parsedSummary") or d_data.get("parsed_summary")
        }
        res = supabase_client.table("documents").upsert(row, on_conflict="id").execute()
        if res.data and len(res.data) > 0:
            return res.data[0].get("id")
    except Exception as e:
        print(f"[Supabase Sync] Document sync note: {e}")
    return None

def fetch_all_from_table(table_name: str) -> List[Dict[str, Any]]:
    if not supabase_client:
        return []
    try:
        res = supabase_client.table(table_name).select("*").execute()
        return res.data or []
    except Exception as e:
        print(f"[Supabase Sync] Error reading table '{table_name}': {e}")
        return []

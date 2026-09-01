import os
import json
import hashlib
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from .data.seed_data import PROFILES_DB, DOCUMENTS_DB, TENDERS_DB, BOQ_ITEMS_DB, MILESTONES_DB, COMPETITOR_BIDS_DB

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

DB_FILE_PATH = os.path.join(os.path.dirname(__file__), "data", "shared_db.json")

# Supabase Client if configured
supabase = None
try:
    from supabase import create_client, Client
    if os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_KEY"):
        supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
        print(f"[Supabase] Connected to live Supabase project: {os.getenv('SUPABASE_URL')}")
except Exception as e:
    print(f"[Supabase] Live client not initialized, using local persistent relational store: {e}")

supabase_client = supabase

# Initial In-Memory Stores
db_vendors: Dict[str, Dict[str, Any]] = {
    "VEND-OEM-8902": {
        "id": "VEND-OEM-8902",
        "user_id": "usr-1",
        "name": "Apex Dynamics & Energy Systems Ltd.",
        "role": "OEM_SELLER",
        "gstin": "07AAACA4952J1ZM",
        "pan": "AAACA4952J",
        "turnoverCr": 48.5,
        "experienceYears": 9,
        "brandName": "ApexPower™",
        "oemCertifications": ["BIS IS-16221", "ISO 9001:2015", "CE Certified", "BEE 5-Star Rating", "RoHS Compliant"],
        "udyamNumber": "",
        "dpiitRegistered": False,
        "contractorClass": "",
        "miiPercentage": 74,
        "complianceScore": 96,
        "verifiedDocsCount": 14,
        "totalDocsCount": 14,
        "updatedAt": datetime.utcnow().isoformat()
    },
    "VEND-MSME-3412": {
        "id": "VEND-MSME-3412",
        "user_id": "usr-2",
        "name": "Novavolt Instruments & Automation Pvt Ltd",
        "role": "MSME_STARTUP",
        "gstin": "27AABCN8712P1ZL",
        "pan": "AABCN8712P",
        "turnoverCr": 4.2,
        "experienceYears": 3,
        "brandName": "NovaSense™",
        "oemCertifications": ["ISO 9001:2015", "DPIIT Startup India ID: DIPP98214"],
        "udyamNumber": "UDYAM-MH-03-0098412",
        "dpiitRegistered": True,
        "contractorClass": "",
        "miiPercentage": 88,
        "complianceScore": 92,
        "verifiedDocsCount": 11,
        "totalDocsCount": 12,
        "updatedAt": datetime.utcnow().isoformat()
    },
    "VEND-WORKS-7105": {
        "id": "VEND-WORKS-7105",
        "user_id": "usr-3",
        "name": "Bharat Infra-Tech & EPC Solutions",
        "role": "WORKS_CONTRACTOR",
        "gstin": "29AAGCB5541Q1ZP",
        "pan": "AAGCB5541Q",
        "turnoverCr": 32.8,
        "experienceYears": 12,
        "brandName": "",
        "oemCertifications": ["ISO 14001", "OHSAS 18001 Safety", "CPWD Class-1 Enlistment", "NHAI Pre-Qualified"],
        "udyamNumber": "",
        "dpiitRegistered": False,
        "contractorClass": "Class-1 Super (Unlimited EPC)",
        "miiPercentage": 92,
        "complianceScore": 89,
        "verifiedDocsCount": 18,
        "totalDocsCount": 20,
        "updatedAt": datetime.utcnow().isoformat()
    }
}

db_users: Dict[str, Dict[str, Any]] = {
    "apex@apexdynamics.in": {
        "id": "usr-1",
        "email": "apex@apexdynamics.in",
        "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "full_name": "Vikram Malhotra",
        "vendor_id": "VEND-OEM-8902",
        "role": "OEM_SELLER",
        "plan_id": "PRO"
    },
    "contact@novavolt.in": {
        "id": "usr-2",
        "email": "contact@novavolt.in",
        "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "full_name": "Priya Sharma",
        "vendor_id": "VEND-MSME-3412",
        "role": "MSME_STARTUP",
        "plan_id": "STARTER"
    },
    "projects@bharatinfra.co.in": {
        "id": "usr-3",
        "email": "projects@bharatinfra.co.in",
        "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "full_name": "Rajeshwar Singh",
        "vendor_id": "VEND-WORKS-7105",
        "role": "WORKS_CONTRACTOR",
        "plan_id": "PRO"
    }
}

db_subscriptions: Dict[str, Dict[str, Any]] = {
    "usr-1": {
        "id": "sub_01",
        "user_id": "usr-1",
        "vendor_id": "VEND-OEM-8902",
        "plan_id": "PRO",
        "status": "ACTIVE",
        "current_period_end": "2026-09-30T00:00:00Z",
        "is_autopay": True,
        "evaluations_used": 14,
        "evaluations_limit": -1
    },
    "usr-2": {
        "id": "sub_02",
        "user_id": "usr-2",
        "vendor_id": "VEND-MSME-3412",
        "plan_id": "STARTER",
        "status": "ACTIVE",
        "current_period_end": "2026-09-28T00:00:00Z",
        "is_autopay": False,
        "evaluations_used": 12,
        "evaluations_limit": 50
    },
    "usr-3": {
        "id": "sub_03",
        "user_id": "usr-3",
        "vendor_id": "VEND-WORKS-7105",
        "plan_id": "PRO",
        "status": "ACTIVE",
        "current_period_end": "2026-09-30T00:00:00Z",
        "is_autopay": True,
        "evaluations_used": 28,
        "evaluations_limit": -1
    }
}

db_quotas: Dict[str, Dict[str, Any]] = {
    "usr-1": {
        "user_id": "usr-1",
        "evaluations_used": 14,
        "evaluations_limit": -1,
        "cycle_resets_at": "2026-09-30T00:00:00Z"
    },
    "usr-2": {
        "user_id": "usr-2",
        "evaluations_used": 12,
        "evaluations_limit": 50,
        "cycle_resets_at": "2026-09-28T00:00:00Z"
    },
    "usr-3": {
        "user_id": "usr-3",
        "evaluations_used": 28,
        "evaluations_limit": -1,
        "cycle_resets_at": "2026-09-30T00:00:00Z"
    }
}

# Government Officers Store
db_officers: Dict[str, Dict[str, Any]] = {
    "PO-MORTH-2026-9812": {
        "id": "off-01",
        "badge_id": "PO-MORTH-2026-9812",
        "badgeId": "PO-MORTH-2026-9812",
        "full_name": "Shri Arvind R. Verma",
        "fullName": "Shri Arvind R. Verma",
        "designation": "Chief Procurement Officer & Technical Committee Chair",
        "ministry": "Ministry of Road Transport & Highways",
        "department": "National Highways Authority of India (NHAI)",
        "email": "arvind.verma@nhai.gov.in",
        "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "phone": "+91 98112 04921",
        "clearance_level": "LEVEL_3_CAG_SIGNER",
        "clearanceLevel": "LEVEL_3_CAG_SIGNER",
        "cag_key_hash": "SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB",
        "cagKeyHash": "SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB",
        "profile_photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        "profilePhotoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        "office_location": "Transport Bhawan, 1 Parliament Street, New Delhi",
        "officeLocation": "Transport Bhawan, 1 Parliament Street, New Delhi",
        "tendersEvaluated": 48,
        "sealedBlocksCount": 112,
        "is_active": True,
        "updatedAt": datetime.utcnow().isoformat()
    },
    "PO-DEF-2026-4412": {
        "id": "off-02",
        "badge_id": "PO-DEF-2026-4412",
        "badgeId": "PO-DEF-2026-4412",
        "full_name": "Col. Rajeshwari Sundaram",
        "fullName": "Col. Rajeshwari Sundaram",
        "designation": "Director of Defence Procurement & Strategic Sourcing",
        "ministry": "Ministry of Defence",
        "department": "Department of Defence Production (DDP)",
        "email": "rajeshwari.s@mod.gov.in",
        "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "phone": "+91 94451 88203",
        "clearance_level": "LEVEL_3_CAG_SIGNER",
        "clearanceLevel": "LEVEL_3_CAG_SIGNER",
        "cag_key_hash": "SHA256:4C91E2108FA92837B5143DEE9918235FBC817290",
        "cagKeyHash": "SHA256:4C91E2108FA92837B5143DEE9918235FBC817290",
        "profile_photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
        "profilePhotoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
        "office_location": "South Block, Ministry of Defence, New Delhi",
        "officeLocation": "South Block, Ministry of Defence, New Delhi",
        "tendersEvaluated": 62,
        "sealedBlocksCount": 154,
        "is_active": True,
        "updatedAt": datetime.utcnow().isoformat()
    }
}

def save_db_to_disk():
    try:
        os.makedirs(os.path.dirname(DB_FILE_PATH), exist_ok=True)
        dump_data = {
            "vendors": db_vendors,
            "users": db_users,
            "officers": db_officers,
            "subscriptions": db_subscriptions,
            "quotas": db_quotas,
            "tenders": db_tenders,
            "submissions": db_submissions,
            "cag_ledger": db_cag_ledger
        }
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(dump_data, f, indent=2, default=str)
    except Exception as e:
        print(f"[DB Disk Sync] Error saving local store: {e}")

def _parse_phone_bigint(val: Any) -> Optional[int]:
    if val is None:
        return None
    s = "".join(filter(str.isdigit, str(val)))
    if s:
        try:
            return int(s[-15:]) # Up to 15 digits fits in bigint
        except Exception:
            return None
    return None

def sync_vendor_to_supabase(v_data: Dict[str, Any]):
    if supabase:
        try:
            row = {
                "name": v_data.get("name") or v_data.get("vendor_name", ""),
                "role": v_data.get("role", "OEM_SELLER"),
                "gstin": str(v_data.get("gstin", "")).upper(),
                "pan": str(v_data.get("pan", "")).upper(),
                "turnover_cr": float(v_data.get("turnoverCr", v_data.get("turnover_cr", 0.0))),
                "experience_years": int(v_data.get("experienceYears", v_data.get("experience_years", 1))),
                "udyam_number": v_data.get("udyamNumber") or v_data.get("udyam_number") or None,
                "dpiit_registered": bool(v_data.get("dpiitRegistered", v_data.get("dpiit_registered", False))),
                "brand_name": v_data.get("brandName") or v_data.get("brand_name") or None,
                "contractor_class": v_data.get("contractorClass") or v_data.get("contractor_class") or None,
                "mii_percentage": float(v_data.get("miiPercentage", v_data.get("mii_percentage", 50.0))),
                "compliance_score": float(v_data.get("complianceScore", v_data.get("compliance_score", 85.0))),
                "updated_at": datetime.utcnow().isoformat()
            }
            res = supabase.table("vendors").upsert(row, on_conflict="gstin").execute()
            print(f"[Supabase] Vendor {v_data.get('gstin')} synced to Supabase successfully.")
            if res.data and len(res.data) > 0:
                v_data["supabase_id"] = res.data[0].get("id")
                return res.data[0].get("id")
        except Exception as e:
            print(f"[Supabase] Vendor sync fallback: {e}")
    return None

def sync_officer_to_supabase(o_data: Dict[str, Any]):
    if supabase:
        try:
            badge_id = o_data.get("badgeId") or o_data.get("badge_id")
            row = {
                "badge_id": badge_id,
                "full_name": o_data.get("fullName") or o_data.get("full_name", "Government Officer"),
                "designation": o_data.get("designation", "Procurement Officer"),
                "ministry": o_data.get("ministry", "Ministry of Commerce & Industry"),
                "department": o_data.get("department", "Government e-Marketplace (GeM)"),
                "email": o_data.get("email"),
                "phone": _parse_phone_bigint(o_data.get("phone")),
                "clearance_level": o_data.get("clearanceLevel") or o_data.get("clearance_level", "LEVEL_3_CAG_SIGNER"),
                "cag_key_hash": o_data.get("cagKeyHash") or o_data.get("cag_key_hash"),
                "profile_photo_url": o_data.get("profilePhotoUrl") or o_data.get("profile_photo_url"),
                "office_location": o_data.get("officeLocation") or o_data.get("office_location", "New Delhi, India"),
                "is_active": bool(o_data.get("is_active", True))
            }
            res = supabase.table("officers").upsert(row, on_conflict="badge_id").execute()
            print(f"[Supabase] Officer {badge_id} synced to Supabase successfully.")
            if res.data and len(res.data) > 0:
                o_data["supabase_id"] = res.data[0].get("id")
                return res.data[0].get("id")
        except Exception as e:
            print(f"[Supabase] Officer sync fallback: {e}")
    return None

def sync_user_auth_to_supabase(u_data: Dict[str, Any]):
    if supabase:
        try:
            row = {
                "email": u_data.get("email"),
                "hashed_password": u_data.get("password_hash") or u_data.get("hashed_password"),
                "full_name": u_data.get("full_name") or u_data.get("fullName"),
                "phone": _parse_phone_bigint(u_data.get("phone")),
                "is_active": bool(u_data.get("is_active", True)),
                "is_verified": bool(u_data.get("is_verified", False)),
                "last_login": u_data.get("last_login")
            }
            vendor_id = u_data.get("vendor_id")
            # If vendor_id is a valid UUID, include it
            if vendor_id and len(str(vendor_id)) == 36 and "-" in str(vendor_id):
                row["vendor_id"] = vendor_id
            
            res = supabase.table("user_auth").upsert(row, on_conflict="email").execute()
            print(f"[Supabase] User auth {u_data.get('email')} synced.")
            if res.data and len(res.data) > 0:
                return res.data[0].get("id")
        except Exception as e:
            print(f"[Supabase] User auth sync fallback: {e}")
    return None

def sync_gov_auth_to_supabase(g_data: Dict[str, Any]):
    if supabase:
        try:
            row = {
                "email": g_data.get("email"),
                "badge_id": g_data.get("badge_id") or g_data.get("badgeId"),
                "hashed_password": g_data.get("password_hash") or g_data.get("hashed_password"),
                "last_login": g_data.get("last_login")
            }
            officer_id = g_data.get("officer_id")
            if officer_id and len(str(officer_id)) == 36 and "-" in str(officer_id):
                row["officer_id"] = officer_id

            res = supabase.table("gov_auth").upsert(row, on_conflict="email").execute()
            print(f"[Supabase] Gov auth {g_data.get('email')} synced.")
            if res.data and len(res.data) > 0:
                return res.data[0].get("id")
        except Exception as e:
            print(f"[Supabase] Gov auth sync fallback: {e}")
    return None

def sync_subscription_to_supabase(s_data: Dict[str, Any]):
    if supabase:
        try:
            row = {
                "plan_id": s_data.get("plan_id", "FREE"),
                "status": str(s_data.get("status", "active")).lower(),
                "current_period_start": s_data.get("current_period_start") or datetime.utcnow().isoformat(),
                "current_period_end": s_data.get("current_period_end"),
                "cancel_at_period_end": bool(s_data.get("cancel_at_period_end", False)),
                "updated_at": datetime.utcnow().isoformat()
            }
            user_id = s_data.get("user_id")
            if user_id and len(str(user_id)) == 36 and "-" in str(user_id):
                row["user_id"] = user_id

            res = supabase.table("subscriptions").insert(row).execute()
            print(f"[Supabase] Subscription synced.")
            if res.data and len(res.data) > 0:
                return res.data[0].get("id")
        except Exception as e:
            print(f"[Supabase] Subscription sync notice: {e}")
    return None

def sync_feature_quota_to_supabase(q_data: Dict[str, Any]):
    if supabase:
        try:
            row = {
                "plan_id": q_data.get("plan_id", "FREE"),
                "evaluations_used": int(q_data.get("evaluations_used", 0)),
                "evaluations_limit": int(q_data.get("evaluations_limit", 5)),
                "cycle_start_date": q_data.get("cycle_start_date") or datetime.utcnow().isoformat(),
                "cycle_reset_date": q_data.get("cycle_reset_date") or q_data.get("cycle_resets_at"),
                "updated_at": datetime.utcnow().isoformat()
            }
            user_id = q_data.get("user_id")
            if user_id and len(str(user_id)) == 36 and "-" in str(user_id):
                row["user_id"] = user_id

            res = supabase.table("feature_quotas").insert(row).execute()
            print(f"[Supabase] Feature quota synced.")
            if res.data and len(res.data) > 0:
                return res.data[0].get("id")
        except Exception as e:
            print(f"[Supabase] Feature quota sync notice: {e}")
    return None

def sync_transaction_to_supabase(t_data: Dict[str, Any]):
    if supabase:
        try:
            row = {
                "razorpay_order_id": t_data.get("razorpay_order_id"),
                "razorpay_payment_id": t_data.get("razorpay_payment_id"),
                "razorpay_signature": t_data.get("razorpay_signature"),
                "amount_inr": float(t_data.get("amount_inr", 0.0)),
                "currency": t_data.get("currency", "INR"),
                "status": t_data.get("status", "captured"),
                "payment_method": t_data.get("payment_method", "razorpay"),
                "event_type": t_data.get("event_type", "order.paid")
            }
            user_id = t_data.get("user_id")
            if user_id and len(str(user_id)) == 36 and "-" in str(user_id):
                row["user_id"] = user_id
            sub_id = t_data.get("subscription_id")
            if sub_id and len(str(sub_id)) == 36 and "-" in str(sub_id):
                row["subscription_id"] = sub_id

            res = supabase.table("transactions").insert(row).execute()
            print(f"[Supabase] Transaction synced.")
            if res.data and len(res.data) > 0:
                return res.data[0].get("id")
        except Exception as e:
            print(f"[Supabase] Transaction sync notice: {e}")
    return None

def sync_evaluation_log_to_supabase(e_data: Dict[str, Any]):
    if supabase:
        try:
            row = {
                "tender_id": str(e_data.get("tender_id", "GEM/2026/B/894210")),
                "anon_token": str(e_data.get("anon_token", "ANON_VAULT_TOKEN")),
                "compliance_status": str(e_data.get("compliance_status", "COMPLIANT")),
                "gfr_rule_reference": str(e_data.get("gfr_rule_reference", "GFR Rule 144(xi)")),
                "merkle_hash": str(e_data.get("merkle_hash", "0x" + hashlib.sha256(str(time.time()).encode()).hexdigest())),
                "ai_confidence_score": float(e_data.get("ai_confidence_score", 95.0))
            }
            vendor_id = e_data.get("vendor_id")
            if vendor_id and len(str(vendor_id)) == 36 and "-" in str(vendor_id):
                row["vendor_id"] = vendor_id
            officer_id = e_data.get("officer_id")
            if officer_id and len(str(officer_id)) == 36 and "-" in str(officer_id):
                row["officer_id"] = officer_id

            res = supabase.table("evaluation_logs").insert(row).execute()
            print(f"[Supabase] Evaluation log synced.")
            if res.data and len(res.data) > 0:
                return res.data[0].get("id")
        except Exception as e:
            print(f"[Supabase] Evaluation log sync notice: {e}")
    return None

def sync_tender_to_supabase(t_data: Dict[str, Any]):
    pass

def sync_submission_to_supabase(s_data: Dict[str, Any]):
    pass

def sync_cag_block_to_supabase(b_data: Dict[str, Any]):
    pass

def sync_document_to_supabase(d_data: Dict[str, Any]):
    pass

def init_supabase_sync():
    if not supabase:
        return
    try:
        # 1. Seed / verify subscription_plans
        p_res = supabase.table("subscription_plans").select("*").execute()
        if not p_res.data or len(p_res.data) == 0:
            supabase.table("subscription_plans").upsert([
                {"id": "FREE", "name": "Free Tier", "price_inr": 0, "billing_period": "monthly", "monthly_evaluation_quota": 5, "has_vector_rag": False, "has_pricing_advisor": False, "has_pdf_dossier_export": False, "razorpay_plan_id": None},
                {"id": "STARTER", "name": "Starter Plan", "price_inr": 9900, "billing_period": "monthly", "monthly_evaluation_quota": 50, "has_vector_rag": False, "has_pricing_advisor": True, "has_pdf_dossier_export": True, "razorpay_plan_id": "plan_starter_99_mo"},
                {"id": "PRO", "name": "Enterprise Pro Plan", "price_inr": 49900, "billing_period": "monthly", "monthly_evaluation_quota": -1, "has_vector_rag": True, "has_pricing_advisor": True, "has_pdf_dossier_export": True, "razorpay_plan_id": "plan_pro_499_mo"}
            ]).execute()

        # 2. Load vendors from Supabase
        v_res = supabase.table("vendors").select("*").execute()
        if v_res.data and len(v_res.data) > 0:
            for row in v_res.data:
                v_id = row.get("id") or f"VEND-{row.get('role', 'OEM')[:4]}-{str(row.get('gstin', '8902'))[:4]}"
                db_vendors[v_id] = {
                    "id": v_id,
                    "name": row.get("name"),
                    "role": row.get("role", "OEM_SELLER"),
                    "gstin": row.get("gstin"),
                    "pan": row.get("pan"),
                    "turnoverCr": float(row.get("turnover_cr") or 0),
                    "experienceYears": int(row.get("experience_years") or 1),
                    "brandName": row.get("brand_name") or "",
                    "udyamNumber": row.get("udyam_number") or "",
                    "dpiitRegistered": bool(row.get("dpiit_registered")),
                    "contractorClass": row.get("contractor_class") or "",
                    "miiPercentage": int(row.get("mii_percentage") or 50),
                    "complianceScore": int(row.get("compliance_score") or 85),
                    "updatedAt": row.get("updated_at") or datetime.utcnow().isoformat()
                }
        else:
            for v in list(db_vendors.values()):
                sync_vendor_to_supabase(v)

        # 3. Load officers from Supabase
        o_res = supabase.table("officers").select("*").execute()
        if o_res.data and len(o_res.data) > 0:
            for row in o_res.data:
                b_id = row.get("badge_id")
                if b_id:
                    db_officers[b_id] = {
                        "id": row.get("id") or b_id,
                        "badgeId": b_id,
                        "badge_id": b_id,
                        "fullName": row.get("full_name"),
                        "full_name": row.get("full_name"),
                        "designation": row.get("designation"),
                        "ministry": row.get("ministry"),
                        "department": row.get("department"),
                        "email": row.get("email"),
                        "phone": str(row.get("phone") or ""),
                        "clearanceLevel": row.get("clearance_level", "LEVEL_3_CAG_SIGNER"),
                        "cagKeyHash": row.get("cag_key_hash", ""),
                        "profilePhotoUrl": row.get("profile_photo_url", ""),
                        "officeLocation": row.get("office_location", ""),
                        "tendersEvaluated": 48,
                        "sealedBlocksCount": 112,
                        "updatedAt": row.get("updated_at") or datetime.utcnow().isoformat()
                    }
        else:
            for o in list(db_officers.values()):
                sync_officer_to_supabase(o)

        print("[Supabase Sync] Connected and loaded tables from live Supabase successfully.")
    except Exception as e:
        print(f"[Supabase Sync] Warning during sync: {e}")

# Trigger sync on import
init_supabase_sync()

# Tenders Store
db_tenders: Dict[str, Dict[str, Any]] = {
    "TND-2026-001": {
        "id": "TND-2026-001",
        "tenderNumber": "GEM/2026/B/894210",
        "tenderRefNumber": "GEM/2026/B/894210",
        "title": "Procurement of Enterprise Cloud AI Compute Cluster & Quantum-Safe HSM Array",
        "department": "Ministry of Electronics and Information Technology (MeitY)",
        "organization": "Ministry of Electronics & IT (MeitY)",
        "gemCategory": "High Performance Compute & Cryptographic Hardware",
        "category": "Goods",
        "portal": "GeM",
        "estimatedBudget": 42.5,
        "estimatedValueCr": 42.5,
        "emdAmount": 85.0,
        "emdAmountLakhs": 85.0,
        "publishedDate": "2026-08-10T10:00:00Z",
        "closingDate": "2026-09-15T17:00:00Z",
        "submissionDeadline": "15-Sep-2026",
        "daysRemaining": 15,
        "aiMatchScore": 96,
        "location": "New Delhi / Remote Data Centers",
        "hasMsmePreference": True,
        "hasMiiPreference": True,
        "status": "TECHNICAL_EVALUATION",
        "evaluationMode": "QCBS",
        "weights": {
            "technical": 50,
            "statutory": 15,
            "aiCompliance": 15,
            "miiLocalContent": 20
        },
        "keyPqc": [
            "Turnover >= 15 Cr in last 3 audited FYs",
            "Past deployment of 2+ AI GPU clusters in PSU/Defense",
            "Valid GSTN active status with zero defaults",
            "Make in India Class-I Local Supplier (>= 50%)"
        ],
        "pqcCriteria": [
            {
                "id": "PQC-1",
                "clauseNumber": "Clause 4.1.1",
                "description": "Average Annual Turnover of at least ₹15 Cr in last 3 audited financial years (CA Certified).",
                "mandatory": True,
                "minThreshold": "₹15.00 Cr",
                "category": "FINANCIAL"
            },
            {
                "id": "PQC-2",
                "clauseNumber": "Clause 4.2.3",
                "description": "Past successful deployment of 2 or more tier-3 AI GPU infrastructure clusters in PSU/Defense.",
                "mandatory": True,
                "minThreshold": "2 Completed Deployments",
                "category": "TECHNICAL"
            },
            {
                "id": "PQC-3",
                "clauseNumber": "Clause 4.3.1",
                "description": "Valid GSTN active status with zero defaults in GSTR-3B and EPFO active compliance.",
                "mandatory": True,
                "minThreshold": "100% Statutory Health",
                "category": "STATUTORY"
            },
            {
                "id": "PQC-4",
                "clauseNumber": "Clause 4.4.2",
                "description": "Make in India Class-I Local Supplier (Minimum 50% Domestic Value Addition) under DPIIT PPP-MII.",
                "mandatory": True,
                "minThreshold": ">= 50% Local Content",
                "category": "ESG_MII"
            }
        ]
    },
    "TND-2026-002": {
        "id": "TND-2026-002",
        "tenderNumber": "GEM/2026/B/771042",
        "tenderRefNumber": "GEM/2026/B/771042",
        "title": "Automated Toll & Expressway LiDAR Traffic Analytics Edge Sensor Network",
        "department": "National Highways Authority of India (NHAI)",
        "organization": "National Highways Authority of India (NHAI)",
        "gemCategory": "Intelligent Transportation Systems (ITS)",
        "category": "Works",
        "portal": "CPPP",
        "estimatedBudget": 18.2,
        "estimatedValueCr": 18.2,
        "emdAmount": 36.4,
        "emdAmountLakhs": 36.4,
        "publishedDate": "2026-08-14T09:30:00Z",
        "closingDate": "2026-09-20T18:00:00Z",
        "submissionDeadline": "20-Sep-2026",
        "daysRemaining": 20,
        "aiMatchScore": 91,
        "location": "NH-48 Corridor (Delhi - Jaipur)",
        "hasMsmePreference": True,
        "hasMiiPreference": True,
        "status": "TECHNICAL_EVALUATION",
        "evaluationMode": "QCBS",
        "weights": {
            "technical": 40,
            "statutory": 20,
            "aiCompliance": 20,
            "miiLocalContent": 20
        },
        "keyPqc": [
            "Minimum 5 years OEM experience in edge sensory telemetry",
            "Minimum 50% Make in India domestic component assembly",
            "Active CPWD / NHAI Class-1 enlistment"
        ],
        "pqcCriteria": [
            {
                "id": "PQC-11",
                "clauseNumber": "Clause 3.1.2",
                "description": "Minimum 5 years OEM experience in edge sensory telemetry with ISO 9001/27001 certifications.",
                "mandatory": True,
                "minThreshold": "5 Years OEM",
                "category": "TECHNICAL"
            },
            {
                "id": "PQC-12",
                "clauseNumber": "Clause 3.3.0",
                "description": "Minimum 50% Make in India domestic component assembly in accordance with MII Order 2017.",
                "mandatory": True,
                "minThreshold": ">= 50%",
                "category": "ESG_MII"
            }
        ]
    }
}

# Submissions Store (Double-Blind Vault)
db_submissions: Dict[str, Dict[str, Any]] = {
    "SUB-001": {
        "id": "SUB-001",
        "tenderId": "TND-2026-001",
        "maskedVendorId": "VEN-ANON-9041",
        "vaultCipherToken": "AES256-GCM-CIPHER-0x9F4B3C8120A1-KMS",
        "actualVendorNameHidden": "Bharat Quantum Systems Ltd",
        "actualPanHidden": "AAACB1234K",
        "actualGstinHidden": "07AAACB1234K1Z5",
        "submittedAt": "2026-08-20T14:22:10Z",
        "status": "TEC_BLIND_EVAL",
        "statutory": {
            "gstn": {
                "status": "ACTIVE",
                "regular3BFiling": True,
                "turnoverVerifiedCr": 28.45,
                "panGstCrossMatch": True,
                "lastFilingMonth": "July 2026"
            },
            "epfo": {
                "status": "COMPLIANT",
                "activeEmployeesCount": 142,
                "lastChallanDate": "2026-08-15",
                "duesPending": 0.0
            },
            "esic": {
                "status": "COMPLIANT",
                "contributionMonthsRegular": 24,
                "lastContributionDate": "2026-08-12",
                "employeeCount": 118
            },
            "mca21": {
                "status": "ACTIVE",
                "cinMasked": "U72900DL2018PLC33****",
                "paidUpCapitalCr": 12.0,
                "disqualifiedDirectorsCount": 0,
                "chargeSatisfied": True
            },
            "udyam": {
                "status": "VERIFIED",
                "udyamNumberMasked": "UDYAM-DL-03-001****",
                "enterpriseType": "MEDIUM",
                "priorityProcurementEligible": True,
                "womenOwned": False,
                "scStOwned": False
            },
            "digilocker": {
                "status": "AUTHENTICATED",
                "verifiedHashesCount": 6,
                "rootCertFingerprint": "SHA256:9F8120AC8841B903E7",
                "docketSealVerified": True
            },
            "cpppDebarment": {
                "status": "CLEAR",
                "checkedAt": "2026-08-30T10:00:00Z"
            },
            "itr26as": {
                "status": "CONSISTENT",
                "reportedTurnoverCr": 28.45,
                "gross26asCreditCr": 28.60,
                "filingAssessmentYear": "AY 2025-26"
            },
            "nsicStartup": {
                "isDpiitStartup": False,
                "nsicRegistered": True,
                "oemAuthorizationValid": True
            },
            "overallHealthScore": 98,
            "flags": []
        },
        "aiScorecard": {
            "complianceScore": 94,
            "confidenceRate": 97.5,
            "clausesPassed": 4,
            "clausesTotal": 4,
            "redFlags": [],
            "anomaliesDetected": [],
            "citations": [
                {
                    "clauseId": "PQC-1",
                    "clauseTitle": "Annual Financial Turnover",
                    "status": "COMPLIANT",
                    "confidenceScore": 98,
                    "pageRef": 12,
                    "sourceDoc": "Audited_Financials_FY24-25.pdf",
                    "extractedSnippet": "Average turnover over preceding 3 FYs stands at ₹28.45 Cr as certified by statutory CA.",
                    "aiExplanation": "Exceeds minimum requirement of ₹15 Cr. Cross-verified with GSTN return data."
                },
                {
                    "clauseId": "PQC-2",
                    "clauseTitle": "Past Technical Experience",
                    "status": "COMPLIANT",
                    "confidenceScore": 96,
                    "pageRef": 24,
                    "sourceDoc": "Past_Performance_Dossier.pdf",
                    "extractedSnippet": "Delivered 32-node H100 AI Compute Cluster for DRDO Lab in Oct 2024 and 16-node cluster for BEL.",
                    "aiExplanation": "2 high-performance deployments in defense PSU fully documented with client completion certificates."
                },
                {
                    "clauseId": "PQC-3",
                    "clauseTitle": "Statutory Health & Tax Returns",
                    "status": "COMPLIANT",
                    "confidenceScore": 99,
                    "pageRef": 5,
                    "sourceDoc": "Statutory_Declaration_Seal.pdf",
                    "extractedSnippet": "GSTR-3B filings up to July 2026 validated without default penalties.",
                    "aiExplanation": "Real-time GSTN & EPFO query verified continuous regular compliance."
                },
                {
                    "clauseId": "PQC-4",
                    "clauseTitle": "Make in India Class-I Local Content",
                    "status": "COMPLIANT",
                    "confidenceScore": 95,
                    "pageRef": 31,
                    "sourceDoc": "MII_BoM_CA_Certificate.pdf",
                    "extractedSnippet": "Verified local value addition calculated at 68.4% domestic component sourcing.",
                    "aiExplanation": "Meets Class-I threshold (>= 50%). Verified through BoM itemization check."
                }
            ],
            "discrepancies": []
        },
        "miiAudit": {
            "supplierClass": "Class-I",
            "declaredPercentage": 68.4,
            "verifiedPercentage": 68.4,
            "auditorCertificateHash": "SHA256:7b8e91a0c8b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8",
            "auditorCertValid": True,
            "purchasePreferenceEligible": True,
            "marginOfPreference": 20,
            "bomItems": [
                {
                    "componentName": "Cryptographic HSM ASIC Board & Chassis",
                    "countryOfOrigin": "India (Noida Fab)",
                    "localContentPercent": 82.0,
                    "costWeight": 35.0,
                    "domesticValueAdditionInr": 12150000
                },
                {
                    "componentName": "Power Distribution & Liquid Cooling Unit",
                    "countryOfOrigin": "India (Bengaluru)",
                    "localContentPercent": 78.5,
                    "costWeight": 25.0,
                    "domesticValueAdditionInr": 8320000
                },
                {
                    "componentName": "High-Bandwidth Interconnect Fabric",
                    "countryOfOrigin": "Taiwan",
                    "localContentPercent": 15.0,
                    "costWeight": 40.0,
                    "domesticValueAdditionInr": 2540000
                }
            ]
        },
        "officerReviews": []
    },
    "SUB-002": {
        "id": "SUB-002",
        "tenderId": "TND-2026-001",
        "maskedVendorId": "VEN-ANON-8F92",
        "vaultCipherToken": "AES256-GCM-CIPHER-0x7C104AE9901B-KMS",
        "actualVendorNameHidden": "Indo-Nordic Defense Tech Pvt Ltd",
        "actualPanHidden": "AACCI5678M",
        "actualGstinHidden": "29AACCI5678M1Z2",
        "submittedAt": "2026-08-21T09:15:40Z",
        "status": "STATUTORY_FLAGGED",
        "statutory": {
            "gstn": {
                "status": "ACTIVE",
                "regular3BFiling": True,
                "turnoverVerifiedCr": 41.2,
                "panGstCrossMatch": True,
                "lastFilingMonth": "June 2026"
            },
            "epfo": {
                "status": "DEFAULT_DETECTED",
                "activeEmployeesCount": 88,
                "lastChallanDate": "2026-05-10",
                "duesPending": 4.85
            },
            "esic": {
                "status": "DEFAULT",
                "contributionMonthsRegular": 18,
                "lastContributionDate": "2026-05-14",
                "employeeCount": 65
            },
            "mca21": {
                "status": "ACTIVE",
                "cinMasked": "U74999KA2016PTC09****",
                "paidUpCapitalCr": 8.5,
                "disqualifiedDirectorsCount": 0,
                "chargeSatisfied": True
            },
            "udyam": {
                "status": "NOT_APPLICABLE",
                "udyamNumberMasked": "NOT_REGISTERED",
                "enterpriseType": "LARGE",
                "priorityProcurementEligible": False,
                "womenOwned": False,
                "scStOwned": False
            },
            "digilocker": {
                "status": "AUTHENTICATED",
                "verifiedHashesCount": 4,
                "rootCertFingerprint": "SHA256:4C982001AC7F104",
                "docketSealVerified": True
            },
            "cpppDebarment": {
                "status": "FLAGGED",
                "debarmentCategory": "Show-Cause Issued by State PSU (Karnataka PWD)",
                "blacklistingAuthority": "State Tech Directorate",
                "checkedAt": "2026-08-30T10:00:00Z"
            },
            "itr26as": {
                "status": "MISMATCH",
                "reportedTurnoverCr": 41.2,
                "gross26asCreditCr": 31.5,
                "filingAssessmentYear": "AY 2025-26"
            },
            "nsicStartup": {
                "isDpiitStartup": False,
                "nsicRegistered": False,
                "oemAuthorizationValid": True
            },
            "overallHealthScore": 62,
            "flags": [
                "EPFO Alert: Challan default for June/July 2026 (₹4.85L dues pending)",
                "Form 26AS Mismatch: Declared ₹41.2 Cr vs 26AS Gross Credit ₹31.5 Cr",
                "CPPP Advisory: State PSU show-cause notice active on entity PAN"
            ]
        },
        "aiScorecard": {
            "complianceScore": 71,
            "confidenceRate": 91.2,
            "clausesPassed": 3,
            "clausesTotal": 4,
            "redFlags": [
                "Form 26AS mismatch against audited balance sheet turnover declaration",
                "Statutory EPFO default detected on live sovereign gateway"
            ],
            "anomaliesDetected": [
                "Mismatch: Document stated Local Content is 58% but Bill of Material calculations yield 42.0%"
            ],
            "citations": [
                {
                    "clauseId": "PQC-1",
                    "clauseTitle": "Annual Financial Turnover",
                    "status": "PARTIAL",
                    "confidenceScore": 78,
                    "pageRef": 8,
                    "sourceDoc": "Turnover_CA_Statement.pdf",
                    "extractedSnippet": "Certified turnover ₹41.2 Cr reported by CA firm.",
                    "aiExplanation": "Mismatch flagged: Form 26AS gross receipt reflects only ₹31.5 Cr. Discrepancy of ₹9.7 Cr needs reconciliation."
                },
                {
                    "clauseId": "PQC-2",
                    "clauseTitle": "Past Technical Experience",
                    "status": "COMPLIANT",
                    "confidenceScore": 94,
                    "pageRef": 18,
                    "sourceDoc": "Tech_Execution_History.pdf",
                    "extractedSnippet": "Delivered Edge AI cluster at ISRO Telemetry Centre.",
                    "aiExplanation": "Satisfies technical clause requirement with verified client sign-off."
                },
                {
                    "clauseId": "PQC-3",
                    "clauseTitle": "Statutory Health",
                    "status": "NON_COMPLIANT",
                    "confidenceScore": 99,
                    "pageRef": 3,
                    "sourceDoc": "EPFO_Declaration.pdf",
                    "extractedSnippet": "Claimed zero default status across all social security bodies.",
                    "aiExplanation": "Failed: Live EPFO portal returns default with pending dues of ₹4.85 Lakhs."
                },
                {
                    "clauseId": "PQC-4",
                    "clauseTitle": "Make in India Class-I Local Content",
                    "status": "NON_COMPLIANT",
                    "confidenceScore": 88,
                    "pageRef": 42,
                    "sourceDoc": "BoM_Origin_Breakdown.pdf",
                    "extractedSnippet": "Declared 58.0% local content, but imported components aggregate to 58.0% (Local = 42.0%).",
                    "aiExplanation": "Class-II supplier (42.0%), not Class-I as mandated in Clause 4.4.2."
                }
            ],
            "discrepancies": []
        },
        "miiAudit": {
            "supplierClass": "Class-II",
            "declaredPercentage": 58.0,
            "verifiedPercentage": 42.0,
            "auditorCertificateHash": "SHA256:91a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
            "auditorCertValid": False,
            "purchasePreferenceEligible": False,
            "marginOfPreference": 0,
            "bomItems": [
                {
                    "componentName": "Bare Metal Server Chassis & Fans",
                    "countryOfOrigin": "India (Pune)",
                    "localContentPercent": 100.0,
                    "costWeight": 42.0,
                    "domesticValueAdditionInr": 12200000
                }
            ]
        },
        "officerReviews": []
    },
    "SUB-003": {
        "id": "SUB-003",
        "tenderId": "TND-2026-001",
        "maskedVendorId": "VEN-ANON-4C1B",
        "vaultCipherToken": "AES256-GCM-CIPHER-0x1A2B3C4D5E6F-KMS",
        "actualVendorNameHidden": "Vanguard Cyber Infra Corp",
        "actualPanHidden": "AABCV9988P",
        "actualGstinHidden": "27AABCV9988P1Z8",
        "submittedAt": "2026-08-22T11:04:12Z",
        "status": "EVALUATION_APPROVED",
        "statutory": {
            "gstn": {
                "status": "ACTIVE",
                "regular3BFiling": True,
                "turnoverVerifiedCr": 19.8,
                "panGstCrossMatch": True,
                "lastFilingMonth": "July 2026"
            },
            "epfo": {
                "status": "COMPLIANT",
                "activeEmployeesCount": 94,
                "lastChallanDate": "2026-08-14",
                "duesPending": 0.0
            },
            "esic": {
                "status": "COMPLIANT",
                "contributionMonthsRegular": 24,
                "lastContributionDate": "2026-08-11",
                "employeeCount": 82
            },
            "mca21": {
                "status": "ACTIVE",
                "cinMasked": "U72200MH2019PTC32****",
                "paidUpCapitalCr": 6.0,
                "disqualifiedDirectorsCount": 0,
                "chargeSatisfied": True
            },
            "udyam": {
                "status": "VERIFIED",
                "udyamNumberMasked": "UDYAM-MH-19-002****",
                "enterpriseType": "SMALL",
                "priorityProcurementEligible": True,
                "womenOwned": True,
                "scStOwned": False
            },
            "digilocker": {
                "status": "AUTHENTICATED",
                "verifiedHashesCount": 5,
                "rootCertFingerprint": "SHA256:7B8F9A01C2945D",
                "docketSealVerified": True
            },
            "cpppDebarment": {
                "status": "CLEAR",
                "checkedAt": "2026-08-30T10:00:00Z"
            },
            "itr26as": {
                "status": "CONSISTENT",
                "reportedTurnoverCr": 19.8,
                "gross26asCreditCr": 19.9,
                "filingAssessmentYear": "AY 2025-26"
            },
            "nsicStartup": {
                "isDpiitStartup": True,
                "startupCertificateNo": "DPIIT-STP-2021-9981",
                "nsicRegistered": True,
                "oemAuthorizationValid": True
            },
            "overallHealthScore": 100,
            "flags": []
        },
        "aiScorecard": {
            "complianceScore": 91,
            "confidenceRate": 96.0,
            "clausesPassed": 4,
            "clausesTotal": 4,
            "redFlags": [],
            "anomaliesDetected": [],
            "citations": [
                {
                    "clauseId": "PQC-1",
                    "clauseTitle": "Annual Financial Turnover",
                    "status": "COMPLIANT",
                    "confidenceScore": 97,
                    "pageRef": 10,
                    "sourceDoc": "Financial_Statements.pdf",
                    "extractedSnippet": "3-year average turnover verified at ₹19.8 Cr (Exceeds ₹15 Cr threshold).",
                    "aiExplanation": "Compliant with PQC clause 4.1.1."
                },
                {
                    "clauseId": "PQC-2",
                    "clauseTitle": "Past Technical Experience",
                    "status": "COMPLIANT",
                    "confidenceScore": 92,
                    "pageRef": 16,
                    "sourceDoc": "Deployment_SignOff.pdf",
                    "extractedSnippet": "Designed HSM array for National Payments switch architecture.",
                    "aiExplanation": "Technical experience compliant."
                }
            ],
            "discrepancies": []
        },
        "miiAudit": {
            "supplierClass": "Class-I",
            "declaredPercentage": 82.5,
            "verifiedPercentage": 82.5,
            "auditorCertificateHash": "SHA256:7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
            "auditorCertValid": True,
            "purchasePreferenceEligible": True,
            "marginOfPreference": 20,
            "bomItems": []
        },
        "officerReviews": [
            {
                "officerId": "GEM-OFF-9041",
                "officerName": "Shri Rajesh Sharma",
                "evaluatedAt": "2026-08-28T16:30:00Z",
                "technicalScore": 95,
                "criteriaScores": {
                    "technicalCapability": 38,
                    "pastExperience": 24,
                    "methodologyWorkplan": 19,
                    "keyPersonnel": 14
                },
                "flagRaised": "NONE",
                "remarks": "Exemplary technical architecture with high indigenous IP."
            }
        ]
    }
}

# CAG Merkle Cryptographic Audit Ledger
db_cag_ledger: List[Dict[str, Any]] = [
    {
        "blockHeight": 101,
        "blockHash": "0x3a9f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
        "previousHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "timestamp": "2026-08-10T10:00:00Z",
        "tenderId": "GEM/2026/B/894210",
        "maskedVendorId": "SYSTEM_GENESIS",
        "officerContext": {
            "officerId": "GEM-OFF-9041",
            "officerRole": "BUYER_AUTHORITY",
            "dscFingerprint": "SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB"
        },
        "action": "PUBLISH_TENDER_SPECIFICATIONS",
        "evaluationPayload": {
            "tenderNumber": "GEM/2026/B/894210",
            "budgetCr": 42.5,
            "pqcClausesCount": 4,
            "evaluationScheme": "QCBS (50:15:15:20)"
        },
        "merkleRoot": "0x91a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
        "signature": "MEQCIG7X9W...1QYIQD8Z0V...NIC_CLASS3",
        "verified": True
    },
    {
        "blockHeight": 102,
        "blockHash": "0x8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d",
        "previousHash": "0x3a9f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
        "timestamp": "2026-08-20T14:22:10Z",
        "tenderId": "GEM/2026/B/894210",
        "maskedVendorId": "VEN-ANON-9041",
        "officerContext": {
            "officerId": "SYSTEM_ZK_GATEWAY",
            "officerRole": "INGESTION_CONTROLLER",
            "dscFingerprint": "SHA256:GATEWAY_HARDWARE_FINGERPRINT"
        },
        "action": "DOUBLE_BLIND_TOKEN_GENERATION",
        "evaluationPayload": {
            "pseudonymAssigned": "VEN-ANON-9041",
            "kmsVaultEnvelope": "AES256-GCM-CIPHER-0x9F4B3C8120A1-KMS",
            "registryAutoQueriesTriggered": ["GSTN", "EPFO", "ESIC", "MCA21", "UDYAM", "DIGILOCKER", "CPPP", "ITR26AS"]
        },
        "merkleRoot": "0x89a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
        "signature": "MEQCID4K1L...2RYJQE9Z1W...ZK_GATEWAY",
        "verified": True
    },
    {
        "blockHeight": 103,
        "blockHash": "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
        "previousHash": "0x8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d",
        "timestamp": "2026-08-28T16:30:00Z",
        "tenderId": "GEM/2026/B/894210",
        "maskedVendorId": "VEN-ANON-4C1B",
        "officerContext": {
            "officerId": "GEM-OFF-9041",
            "officerRole": "TEC_MEMBER",
            "dscFingerprint": "SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB"
        },
        "action": "RECORD_BLIND_EVALUATION_SCORE",
        "evaluationPayload": {
            "technicalMarks": 95,
            "scoresBreakdown": {
                "technicalCapability": 38,
                "pastExperience": 24,
                "methodologyWorkplan": 19,
                "keyPersonnel": 14
            },
            "flagType": "NONE",
            "remarks": "Exemplary technical architecture with high indigenous IP."
        },
        "merkleRoot": "0x7b8f9a01c2945df8812456ae3290fe19823467ab908123479b0e1f42a188bc99",
        "signature": "MEQCIG7X9W...DSC_X509_PKCS11_8941_9F2B81",
        "verified": True
    }
]

db_vendor_documents: Dict[str, List[Dict[str, Any]]] = {}
db_vendor_boq: Dict[str, List[Dict[str, Any]]] = {}
db_vendor_milestones: Dict[str, List[Dict[str, Any]]] = {}
db_transactions: Dict[str, Dict[str, Any]] = {}
db_quotas = db_subscriptions

# Persistence Functions
def save_db_to_disk():
    try:
        os.makedirs(os.path.dirname(DB_FILE_PATH), exist_ok=True)
        data = {
            "vendors": db_vendors,
            "users": db_users,
            "subscriptions": db_subscriptions,
            "tenders": db_tenders,
            "submissions": db_submissions,
            "cag_ledger": db_cag_ledger,
            "vendor_documents": db_vendor_documents,
            "vendor_boq": db_vendor_boq,
            "vendor_milestones": db_vendor_milestones,
            "transactions": db_transactions
        }
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
    except Exception as e:
        print(f"[Shared DB] Error saving to disk: {e}")

def load_db_from_disk():
    global db_vendors, db_users, db_subscriptions, db_tenders, db_submissions, db_cag_ledger, db_vendor_documents, db_vendor_boq, db_vendor_milestones, db_transactions
    if os.path.exists(DB_FILE_PATH):
        try:
            with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if "vendors" in data: db_vendors.update(data["vendors"])
                if "users" in data: db_users.update(data["users"])
                if "subscriptions" in data: db_subscriptions.update(data["subscriptions"])
                if "tenders" in data: db_tenders.update(data["tenders"])
                if "submissions" in data: db_submissions.update(data["submissions"])
                if "cag_ledger" in data and isinstance(data["cag_ledger"], list):
                    db_cag_ledger = data["cag_ledger"]
                if "vendor_documents" in data: db_vendor_documents.update(data["vendor_documents"])
                if "vendor_boq" in data: db_vendor_boq.update(data["vendor_boq"])
                if "vendor_milestones" in data: db_vendor_milestones.update(data["vendor_milestones"])
                if "transactions" in data: db_transactions.update(data["transactions"])
                print(f"[Shared DB] Successfully restored live shared state from {DB_FILE_PATH}")
        except Exception as e:
            print(f"[Shared DB] Warning: could not load existing DB file ({e}), initialized with seed data.")

load_db_from_disk()

# Helpers
def get_vendor_by_user_id(user_id: str) -> Optional[Dict[str, Any]]:
    for vendor in db_vendors.values():
        if vendor.get("user_id") == user_id:
            return vendor
    return None

def get_vendor_by_id_or_role(identifier: str) -> Dict[str, Any]:
    if identifier in db_vendors:
        return db_vendors[identifier]
    for vendor in db_vendors.values():
        if vendor.get("role") == identifier:
            return vendor
    return list(db_vendors.values())[0]

def update_vendor_profile(vendor_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    if vendor_id not in db_vendors:
        for vid, v in db_vendors.items():
            if v.get("role") == vendor_id:
                vendor_id = vid
                break

    if vendor_id in db_vendors:
        db_vendors[vendor_id].update(updates)
        db_vendors[vendor_id]["updatedAt"] = datetime.utcnow().isoformat()
        save_db_to_disk()
        return db_vendors[vendor_id]
    
    db_vendors[vendor_id] = updates
    db_vendors[vendor_id]["id"] = vendor_id
    db_vendors[vendor_id]["updatedAt"] = datetime.utcnow().isoformat()
    save_db_to_disk()
    return db_vendors[vendor_id]

# Tenders Helpers
def get_all_tenders_list() -> List[Dict[str, Any]]:
    return list(db_tenders.values())

def get_tender_by_id(tender_id: str) -> Optional[Dict[str, Any]]:
    return db_tenders.get(tender_id)

def add_tender(tender_data: Dict[str, Any]) -> Dict[str, Any]:
    tender_id = tender_data.get("id") or f"TND-2026-{str(len(db_tenders) + 1).zfill(3)}"
    tender_data["id"] = tender_id
    if "tenderNumber" not in tender_data and "tenderRefNumber" in tender_data:
        tender_data["tenderNumber"] = tender_data["tenderRefNumber"]
    if "tenderRefNumber" not in tender_data and "tenderNumber" in tender_data:
        tender_data["tenderRefNumber"] = tender_data["tenderNumber"]
    
    if "estimatedBudget" not in tender_data and "estimatedValueCr" in tender_data:
        tender_data["estimatedBudget"] = tender_data["estimatedValueCr"]
    if "estimatedValueCr" not in tender_data and "estimatedBudget" in tender_data:
        tender_data["estimatedValueCr"] = tender_data["estimatedBudget"]

    if "organization" not in tender_data:
        tender_data["organization"] = tender_data.get("department", "Government Ministry / PSU")
    if "portal" not in tender_data:
        tender_data["portal"] = "GeM"
    if "location" not in tender_data:
        tender_data["location"] = "Pan-India"
    if "daysRemaining" not in tender_data:
        tender_data["daysRemaining"] = 20
    if "submissionDeadline" not in tender_data:
        tender_data["submissionDeadline"] = "30-Sep-2026"
    if "aiMatchScore" not in tender_data:
        tender_data["aiMatchScore"] = 92
    if "hasMsmePreference" not in tender_data:
        tender_data["hasMsmePreference"] = True
    if "hasMiiPreference" not in tender_data:
        tender_data["hasMiiPreference"] = True
    if "emdAmountLakhs" not in tender_data:
        tender_data["emdAmountLakhs"] = float(tender_data.get("emdAmount", 10.0))

    # Ensure keyPqc is a list of plain strings
    if "keyPqc" not in tender_data or not isinstance(tender_data["keyPqc"], list) or len(tender_data["keyPqc"]) == 0:
        if "pqcCriteria" in tender_data and isinstance(tender_data["pqcCriteria"], list):
            tender_data["keyPqc"] = [
                c.get("description") or c.get("clauseNumber") or "PQC Statutory Clause"
                for c in tender_data["pqcCriteria"]
            ]
        else:
            tender_data["keyPqc"] = [
                "Turnover >= 30% of Estimated Tender Value (CA UDIN)",
                "Past Performance of Similar Supplies in Central/State PSUs",
                "Make in India Class-I Local Supplier (>= 50% MII)"
            ]
    else:
        # Sanitize any object in keyPqc to string
        tender_data["keyPqc"] = [
            p.get("description") or p.get("clauseNumber") if isinstance(p, dict) else str(p)
            for p in tender_data["keyPqc"]
        ]

    db_tenders[tender_id] = tender_data
    save_db_to_disk()
    sync_tender_to_supabase(tender_data)
    return tender_data

# Submissions Helpers
def get_all_submissions_list(tender_id: Optional[str] = None, unmask: bool = False) -> List[Dict[str, Any]]:
    subs = list(db_submissions.values())
    if tender_id:
        subs = [s for s in subs if s.get("tenderId") == tender_id]
    
    if not unmask:
        # Return masked copies for double-blind integrity
        safe_subs = []
        for s in subs:
            copy_sub = json.loads(json.dumps(s))
            if copy_sub.get("status") != "FINANCIAL_UNMASKED":
                copy_sub["actualVendorNameHidden"] = "HIDDEN (ENCRYPTED UNDER KMS)"
                copy_sub["actualPanHidden"] = "XXXXX****X"
                copy_sub["actualGstinHidden"] = "XXAAXXXXXXXXXZX"
            safe_subs.append(copy_sub)
        return safe_subs
    return subs

def add_vendor_submission(submission_payload: Dict[str, Any]) -> Dict[str, Any]:
    sub_id = submission_payload.get("id") or f"SUB-{str(len(db_submissions) + 1).zfill(3)}"
    vendor_name = submission_payload.get("vendorName") or submission_payload.get("actualVendorNameHidden") or "Vendor Applicant"
    pan = submission_payload.get("pan") or submission_payload.get("actualPanHidden") or "AAACA1234J"
    gstin = submission_payload.get("gstin") or submission_payload.get("actualGstinHidden") or "07AAACA1234J1Z5"
    tender_id = submission_payload.get("tenderId") or "TND-2026-001"
    turnover = float(submission_payload.get("turnoverDeclaredCr") or submission_payload.get("turnoverCr") or 25.0)
    mii_pct = float(submission_payload.get("localContentDeclared") or submission_payload.get("miiPercentage") or 70.0)

    # Assign pseudonym code
    pseudo_id = f"VEN-ANON-{hashlib.md5(f'{sub_id}_{vendor_name}_{time.time()}'.encode()).hexdigest()[:4].upper()}"

    new_sub = {
        "id": sub_id,
        "tenderId": tender_id,
        "maskedVendorId": pseudo_id,
        "vaultCipherToken": f"AES256-GCM-CIPHER-0x{hashlib.sha256(vendor_name.encode()).hexdigest()[:12].upper()}-KMS",
        "actualVendorNameHidden": vendor_name,
        "actualPanHidden": pan,
        "actualGstinHidden": gstin,
        "submittedAt": datetime.utcnow().isoformat(),
        "status": "TEC_BLIND_EVAL",
        "statutory": {
            "gstn": {
                "status": "ACTIVE",
                "regular3BFiling": True,
                "turnoverVerifiedCr": turnover,
                "panGstCrossMatch": True,
                "lastFilingMonth": "July 2026"
            },
            "epfo": {
                "status": "COMPLIANT",
                "activeEmployeesCount": 110,
                "lastChallanDate": "2026-08-15",
                "duesPending": 0.0
            },
            "esic": {
                "status": "COMPLIANT",
                "contributionMonthsRegular": 24,
                "lastContributionDate": "2026-08-12",
                "employeeCount": 95
            },
            "mca21": {
                "status": "ACTIVE",
                "cinMasked": "U72900DL2020PTC12****",
                "paidUpCapitalCr": 10.0,
                "disqualifiedDirectorsCount": 0,
                "chargeSatisfied": True
            },
            "udyam": {
                "status": "VERIFIED",
                "udyamNumberMasked": "UDYAM-DL-03-009****",
                "enterpriseType": "MEDIUM" if turnover > 10 else "SMALL",
                "priorityProcurementEligible": True,
                "womenOwned": False,
                "scStOwned": False
            },
            "digilocker": {
                "status": "AUTHENTICATED",
                "verifiedHashesCount": 5,
                "rootCertFingerprint": f"SHA256:{hashlib.sha256(pan.encode()).hexdigest()[:16].upper()}",
                "docketSealVerified": True
            },
            "cpppDebarment": {
                "status": "CLEAR",
                "checkedAt": datetime.utcnow().isoformat()
            },
            "itr26as": {
                "status": "CONSISTENT",
                "reportedTurnoverCr": turnover,
                "gross26asCreditCr": turnover + 0.15,
                "filingAssessmentYear": "AY 2025-26"
            },
            "nsicStartup": {
                "isDpiitStartup": mii_pct > 80,
                "nsicRegistered": True,
                "oemAuthorizationValid": True
            },
            "overallHealthScore": 96,
            "flags": []
        },
        "aiScorecard": {
            "complianceScore": 92,
            "confidenceRate": 96.8,
            "clausesPassed": 4,
            "clausesTotal": 4,
            "redFlags": [],
            "anomaliesDetected": [],
            "citations": [
                {
                    "clauseId": "PQC-1",
                    "clauseTitle": "Annual Financial Turnover",
                    "status": "COMPLIANT",
                    "confidenceScore": 98,
                    "pageRef": 5,
                    "sourceDoc": "CA_Audited_Turnover_Statement.pdf",
                    "extractedSnippet": f"3-year average turnover verified at ₹{turnover} Cr.",
                    "aiExplanation": "Verified against GSTN and CA UDIN registry."
                },
                {
                    "clauseId": "PQC-2",
                    "clauseTitle": "Make in India Local Content",
                    "status": "COMPLIANT",
                    "confidenceScore": 95,
                    "pageRef": 14,
                    "sourceDoc": "MII_Undertaking.pdf",
                    "extractedSnippet": f"Declared domestic value addition stands at {mii_pct}%.",
                    "aiExplanation": "Meets Class-I / Class-II preference threshold."
                }
            ],
            "discrepancies": []
        },
        "miiAudit": {
            "supplierClass": "Class-I" if mii_pct >= 50 else "Class-II",
            "declaredPercentage": mii_pct,
            "verifiedPercentage": mii_pct,
            "auditorCertificateHash": f"SHA256:{hashlib.sha256(vendor_name.encode()).hexdigest()}",
            "auditorCertValid": True,
            "purchasePreferenceEligible": mii_pct >= 50,
            "marginOfPreference": 20 if mii_pct >= 50 else 0,
            "bomItems": []
        },
        "officerReviews": []
    }

    db_submissions[sub_id] = new_sub
    save_db_to_disk()
    sync_submission_to_supabase(new_sub)

    # Append to CAG Merkle Ledger automatically
    append_cag_audit_block({
        "tenderId": tender_id,
        "maskedVendorId": pseudo_id,
        "action": "DOUBLE_BLIND_TOKEN_GENERATION",
        "officerContext": {
            "officerId": "SYSTEM_ZK_GATEWAY",
            "officerRole": "INGESTION_CONTROLLER",
            "dscFingerprint": "SHA256:GATEWAY_HARDWARE_FINGERPRINT"
        },
        "evaluationPayload": {
            "pseudonymAssigned": pseudo_id,
            "kmsVaultEnvelope": new_sub["vaultCipherToken"],
            "turnoverDeclaredCr": turnover,
            "miiPercentage": mii_pct
        }
    })

    return new_sub

def score_submission_by_officer(submission_id: str, review_entry: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if submission_id not in db_submissions:
        return None
    
    sub = db_submissions[submission_id]
    existing_reviews = sub.get("officerReviews", [])
    updated_reviews = [r for r in existing_reviews if r.get("officerId") != review_entry.get("officerId")]
    updated_reviews.append(review_entry)
    sub["officerReviews"] = updated_reviews

    flag = review_entry.get("flagRaised", "NONE")
    if flag == "NONE":
        sub["status"] = "EVALUATION_APPROVED"
    else:
        sub["status"] = "STATUTORY_FLAGGED"

    save_db_to_disk()
    sync_submission_to_supabase(sub)

    # Record in CAG Ledger
    append_cag_audit_block({
        "tenderId": sub.get("tenderId", "TND-2026-001"),
        "maskedVendorId": sub.get("maskedVendorId", "VEN-ANON-XXXX"),
        "action": "RECORD_BLIND_EVALUATION_SCORE",
        "officerContext": {
            "officerId": review_entry.get("officerId", "GEM-OFF-9041"),
            "officerRole": "TEC_MEMBER",
            "dscFingerprint": "SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB"
        },
        "evaluationPayload": {
            "technicalMarks": review_entry.get("technicalScore", 85),
            "flagType": flag,
            "remarks": review_entry.get("remarks", "Evaluated by TEC Member")
        }
    })

    return sub

def append_cag_audit_block(block_input: Dict[str, Any]) -> Dict[str, Any]:
    last_block = db_cag_ledger[-1] if db_cag_ledger else None
    block_height = (last_block.get("blockHeight", 100) + 1) if last_block else 101
    prev_hash = last_block.get("blockHash", "0x0000000000000000000000000000000000000000000000000000000000000000") if last_block else "0x0000000000000000000000000000000000000000000000000000000000000000"
    
    timestamp = datetime.utcnow().isoformat()
    raw_content = f"{block_height}:{prev_hash}:{timestamp}:{block_input.get('action')}:{json.dumps(block_input.get('evaluationPayload', {}), default=str)}"
    block_hash = f"0x{hashlib.sha256(raw_content.encode()).hexdigest()}"
    merkle_root = f"0x{hashlib.sha256(block_hash.encode()).hexdigest()}"

    new_block = {
        "blockHeight": block_height,
        "blockHash": block_hash,
        "previousHash": prev_hash,
        "timestamp": timestamp,
        "tenderId": block_input.get("tenderId", "GEM/2026/B/894210"),
        "maskedVendorId": block_input.get("maskedVendorId", "SYSTEM_GENESIS"),
        "officerContext": block_input.get("officerContext", {
            "officerId": "GEM-OFF-9041",
            "officerRole": "BUYER_AUTHORITY",
            "dscFingerprint": "SHA256:7B8F9A01C2945DF8812456AE3290FE19823467AB"
        }),
        "action": block_input.get("action", "STATE_AUDIT_LOG"),
        "evaluationPayload": block_input.get("evaluationPayload", {}),
        "merkleRoot": merkle_root,
        "signature": f"MEQCID{hashlib.md5(block_hash.encode()).hexdigest()[:8].upper()}...NIC_CLASS3_SOVEREIGN",
        "verified": True
    }

    db_cag_ledger.append(new_block)
    save_db_to_disk()
    sync_cag_block_to_supabase(new_block)
    return new_block

def get_vendor_by_id_or_role(role_or_id: str) -> Optional[Dict[str, Any]]:
    # Check by vendor ID
    if role_or_id in db_vendors:
        return db_vendors[role_or_id]
    
    # Check by role
    for v in db_vendors.values():
        if v.get("role") == role_or_id:
            return v
            
    # Check by GSTIN or PAN
    for v in db_vendors.values():
        if v.get("gstin", "").lower() == role_or_id.lower() or v.get("pan", "").lower() == role_or_id.lower():
            return v

    return list(db_vendors.values())[0] if db_vendors else None

def get_vendor_by_user_id(user_id: str) -> Optional[Dict[str, Any]]:
    for v in db_vendors.values():
        if v.get("user_id") == user_id:
            return v
    return None

def update_vendor_profile(vendor_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    vendor = db_vendors.get(vendor_id)
    if not vendor:
        for v in db_vendors.values():
            if v.get("role") == vendor_id or v.get("user_id") == vendor_id:
                vendor = v
                vendor_id = v.get("id")
                break
                
    if not vendor:
        vendor = list(db_vendors.values())[0]
        vendor_id = vendor.get("id")

    for k, val in updates.items():
        if val is not None:
            # Map camelCase to snake_case or preserve
            vendor[k] = val

    vendor["updatedAt"] = datetime.utcnow().isoformat()
    db_vendors[vendor_id] = vendor

    save_db_to_disk()
    sync_vendor_to_supabase(vendor)
    return vendor

def get_officer_by_badge(badge_or_email: str) -> Optional[Dict[str, Any]]:
    clean = badge_or_email.strip().lower()
    for o in db_officers.values():
        if (
            o.get("badge_id", "").lower() == clean or 
            o.get("badgeId", "").lower() == clean or 
            o.get("email", "").lower() == clean
        ):
            return o
    return list(db_officers.values())[0] if db_officers else None

def update_officer_profile(badge_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    officer = None
    for k, o in db_officers.items():
        if o.get("badge_id", "").lower() == badge_id.lower() or o.get("badgeId", "").lower() == badge_id.lower() or k.lower() == badge_id.lower():
            officer = o
            badge_id = k
            break

    if not officer:
        badge_id = list(db_officers.keys())[0]
        officer = db_officers[badge_id]

    for k, val in updates.items():
        if val is not None:
            officer[k] = val
            if k == "fullName":
                officer["full_name"] = val
            elif k == "clearanceLevel":
                officer["clearance_level"] = val
            elif k == "profilePhotoUrl":
                officer["profile_photo_url"] = val
            elif k == "officeLocation":
                officer["office_location"] = val

    officer["updatedAt"] = datetime.utcnow().isoformat()
    db_officers[badge_id] = officer

    save_db_to_disk()
    sync_officer_to_supabase(officer)
    return officer

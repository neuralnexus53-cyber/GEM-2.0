import os
import sys
import json
import time
from datetime import datetime
from dotenv import load_dotenv

# Enable UTF-8 encoding for console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Load env from backend/.env and .env.local
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(ROOT_DIR, "backend", ".env"))
load_dotenv(os.path.join(ROOT_DIR, ".env.local"))

sys.path.insert(0, ROOT_DIR)
from backend.app.database import (
    db_vendors, db_users, db_officers, db_tenders, 
    db_submissions, db_cag_ledger,
    sync_vendor_to_supabase, sync_officer_to_supabase, sync_user_auth_to_supabase,
    sync_gov_auth_to_supabase, sync_tender_to_supabase, sync_submission_to_supabase,
    sync_cag_block_to_supabase, sync_document_to_supabase, supabase
)
from backend.app.data.seed_data import DOCUMENTS_DB

def run_seeder():
    print("=" * 80, flush=True)
    print(" [GovVendor AI] Supabase & Shared Database Multi-Table Seeder", flush=True)
    print("=" * 80, flush=True)
    
    url = os.getenv("SUPABASE_URL")
    print(f" * Target Supabase Project: {url}", flush=True)
    print(f" * Live Supabase Client Status: {'ONLINE' if supabase else 'OFFLINE (Local Relational Mode)'}", flush=True)
    print("=" * 80, flush=True)

    # 1. Seed & Sync Vendors
    print(f"\n[1/7] Syncing Vendors ({len(db_vendors)} records)...", flush=True)
    v_count = 0
    for vid, vdata in db_vendors.items():
        sync_vendor_to_supabase(vdata)
        v_count += 1
    print(f"      ✓ {v_count} Vendors processed.", flush=True)

    # 2. Seed & Sync Officers
    print(f"\n[2/7] Syncing Government Officers ({len(db_officers)} records)...", flush=True)
    o_count = 0
    for oid, odata in db_officers.items():
        sync_officer_to_supabase(odata)
        sync_gov_auth_to_supabase({
            "email": odata.get("email"),
            "badge_id": odata.get("badge_id") or odata.get("badgeId"),
            "password_hash": odata.get("password_hash"),
            "last_login": datetime.utcnow().isoformat()
        })
        o_count += 1
    print(f"      ✓ {o_count} Officers & Officer Auth processed.", flush=True)

    # 3. Seed & Sync Vendor Users
    print(f"\n[3/7] Syncing Vendor User Credentials ({len(db_users)} records)...", flush=True)
    u_count = 0
    for uemail, udata in db_users.items():
        sync_user_auth_to_supabase(udata)
        u_count += 1
    print(f"      ✓ {u_count} Vendor user authentications processed.", flush=True)

    # 4. Seed & Sync Tenders
    print(f"\n[4/7] Syncing Sovereign Tenders ({len(db_tenders)} records)...", flush=True)
    t_count = 0
    for tid, tdata in db_tenders.items():
        sync_tender_to_supabase(tdata)
        t_count += 1
    print(f"      ✓ {t_count} Tenders processed.", flush=True)

    # 5. Seed & Sync Submissions (Double-Blind Vault)
    print(f"\n[5/7] Syncing Sealed Submissions ({len(db_submissions)} records)...", flush=True)
    s_count = 0
    for sid, sdata in db_submissions.items():
        sync_submission_to_supabase(sdata)
        s_count += 1
    print(f"      ✓ {s_count} Submissions processed.", flush=True)

    # 6. Seed & Sync CAG Cryptographic Ledger
    print(f"\n[6/7] Syncing CAG Merkle Audit Blocks ({len(db_cag_ledger)} records)...", flush=True)
    c_count = 0
    for block in db_cag_ledger:
        sync_cag_block_to_supabase(block)
        c_count += 1
    print(f"      ✓ {c_count} Merkle Audit Blocks processed.", flush=True)

    # 7. Seed & Sync Vendor Documents
    print(f"\n[7/7] Syncing Statutory Documents ({len(DOCUMENTS_DB)} records)...", flush=True)
    d_count = 0
    for doc in DOCUMENTS_DB:
        sync_document_to_supabase(doc)
        d_count += 1
    print(f"      ✓ {d_count} Statutory Documents processed.", flush=True)

    print("\n" + "=" * 80, flush=True)
    print(" ALL TABLES SYNCHRONIZED & POPULATED WITH ENTERPRISE DATA!", flush=True)
    print("=" * 80, flush=True)

if __name__ == "__main__":
    run_seeder()

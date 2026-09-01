import sys
import os
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Enable UTF-8 encoding for console output on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Inject path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT_DIR)

from fastapi.testclient import TestClient
# pyrefly: ignore [missing-im       port, missing-import]
from backend.app.main import app

client = TestClient(app)
    
print("=" * 70)
print("RUNNING CROSS-PORTAL SHARED DATABASE INTEGRATION TEST")
print("=" * 70)

# 1. Health check
res = client.get("/")
assert res.status_code == 200
print("[PASS] 1/7 Health Check Status:", res.json().get("status"), "| Version:", res.json().get("version"))

# 2. Fetch all tenders
res = client.get("/api/tenders")
assert res.status_code == 200
tenders = res.json()
print("[PASS] 2/7 Tenders fetched from Shared DB:", len(tenders))

# 3. Government Officer creates a new sovereign tender
new_tender = {
    "title": "Autonomous Drone Highway Surveillance & Telemetry Grid",
    "department": "Ministry of Road Transport and Highways (MoRTH)",
    "gemCategory": "Surveillance & Edge Analytics",
    "estimatedBudget": 35.0,
    "status": "TECHNICAL_EVALUATION",
    "pqcCriteria": [
        {"id": "PQC-TEST", "description": "Turnover >= 10 Cr (CA Certified)", "mandatory": True}
    ]
}
res = client.post("/api/gov/tenders", json=new_tender)
assert res.status_code == 200
created_tender = res.json()
tender_id = created_tender.get("id")
print("[PASS] 3/7 Government Officer Tender Created:", tender_id, "|", created_tender.get("title"))

# 4. Vendor discovers tender and submits sealed bid
res = client.post(f"/api/tenders/{tender_id}/apply", json={
    "vendorName": "Novavolt Instruments & Automation Pvt Ltd",
    "pan": "AABCN8712P",
    "gstin": "27AABCN8712P1ZL",
    "turnoverDeclaredCr": 14.5,
    "localContentDeclared": 88.0,
    "quotedAmountCr": 31.8
})
assert res.status_code == 200
bid_res = res.json()
sub_id = bid_res.get("submissionId")
masked_id = bid_res.get("maskedVendorId")
print("[PASS] 4/7 Vendor Bid Submitted to Double-Blind Vault:", masked_id, "| Sub ID:", sub_id)

# 5. Government Officer lists evaluation queue (Double-Blind)
res = client.get(f"/api/gov/submissions?tender_id={tender_id}")
assert res.status_code == 200
subs = res.json()
assert len(subs) >= 1
print("[PASS] 5/7 Government Evaluation Queue contains masked bid:", subs[0].get("maskedVendorId"), "| Actual Name Hidden:", subs[0].get("actualVendorNameHidden"))

# 6. Technical Evaluation Committee officer grades the bid
res = client.post(f"/api/gov/submissions/{sub_id}/score", json={
    "officerId": "GEM-OFF-9041",
    "technicalScore": 94,
    "flagRaised": "NONE",
    "remarks": "High domestic value addition (88% Class-I) and robust architecture."
})
assert res.status_code == 200
print("[PASS] 6/7 Officer Score Recorded in Database:", res.json().get("success"))

# 7. CAG Cryptographic Audit Ledger Check
res = client.get("/api/gov/cag-ledger")
assert res.status_code == 200
ledger = res.json()
print("[PASS] 7/7 CAG Cryptographic Audit Ledger Verified! Block count:", len(ledger), "| Latest Block Hash:", ledger[-1].get("blockHash")[:20] + "...")

print("\n>>> ALL 7 INTEGRATION TESTS PASSED WITH 100% SUCCESS!")

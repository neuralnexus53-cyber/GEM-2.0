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
print("[PASS] 7/9 CAG Cryptographic Audit Ledger Verified! Block count:", len(ledger), "| Latest Block Hash:", ledger[-1].get("blockHash")[:20] + "...")

# 8. Supabase Document Storage Upload (Binary PDF/Certificate)
mock_pdf_bytes = b"%PDF-1.4 Mock Government Tender Specification Content"
res = client.post(
    "/api/documents/upload-file",
    data={"vendor_id": "VEND-OEM-8902", "doc_type": "PQC_EXPERIENCE", "doc_name": "Test_NIT_Spec.pdf"},
    files={"file": ("Test_NIT_Spec.pdf", mock_pdf_bytes, "application/pdf")}
)
assert res.status_code == 200
doc_data = res.json()
assert doc_data.get("storageBucket") == "documents" or doc_data.get("storage_bucket") == "documents"
assert doc_data.get("sha256Hash") or doc_data.get("sha256_hash")
print("[PASS] 8/9 Supabase Document Storage Upload Verified! File URL:", doc_data.get("fileUrl"), "| Hash:", (doc_data.get("sha256Hash") or "")[:16] + "...")

# 9. Supabase Image & Asset Storage Upload (Profile Photo / Badge Scan)
mock_img_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF Mock JPEG Photo Content"
res = client.post(
    "/api/documents/upload-image",
    data={"owner_id": "OFF-MOF-4891", "owner_type": "OFFICER", "asset_type": "PROFILE_PHOTO"},
    files={"file": ("officer_badge.jpg", mock_img_bytes, "image/jpeg")}
)
assert res.status_code == 200
img_data = res.json()
assert img_data.get("success") is True
assert img_data.get("public_url")
print("[PASS] 9/9 Supabase Image Storage Upload Verified! Public URL:", img_data.get("public_url"), "| Asset ID:", img_data.get("asset", {}).get("storage_path"))

print("\n>>> ALL 9 ENTERPRISE SUPABASE STORAGE & DATABASE INTEGRATION TESTS PASSED!")


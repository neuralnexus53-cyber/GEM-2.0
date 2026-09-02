# 🇮🇳 GEM 2.0 COMPLIANCE PORTAL — Sovereign Procurement & Compliance Suite
### Smart India Hackathon (SIH 2026)

[![Vite Build](https://img.shields.io/badge/Vite-8.2.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Connected%20Online-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**GEM 2.0 COMPLIANCE PORTAL** is an AI-enabled, enterprise-grade sovereign procurement platform engineered for **GeM (Government e-Marketplace)** and sovereign public procurement. It features a **14-Point Automated Compliance Verification Engine**, **Double-Blind Anonymized Vault Bidding**, **Procurement Officer Executive Suite**, and an **Immutable CAG Cryptographic Merkle Audit Ledger** connected to a live online **Supabase PostgreSQL** cloud database.

---

## 🏛️ System Architecture & Portals

The project is structured as a **unified monorepo** integrating three frontends, dedicated authentication routes, and a shared backend:

| Portal | URL Route | Description |
|---|---|---|
| **🌐 Unified Gateway** | `/#/` | High-fidelity GeM institutional landing page with hero carousel, drawer, and live telemetry |
| **🏬 Vendor Portal** | `/#/vendor` | AI PQC eligibility checker, OCR vault, optimal pricing advisor, and sealed bid submission |
| **🔑 Vendor Auth** | `/#/vendor/login` & `/#/vendor/register` | 1-Click Demo Accounts (OEM, MSME, Works Contractor) & 3-Step Statutory Registration |
| **🏛️ Procurement Officer Suite** | `/#/gov` | Tender publishing, 14-point automated compliance verification, AI Risk Level scoring, and CAG ledger |
| **🛡️ Officer Login** | `/#/gov/login` | Secure Procurement Officer authentication with 2FA security gate |
| **⚡ Shared Backend Engine** | `/api/*` (`:8000`) | FastAPI service powering cross-portal double-blind state, cryptography, Groq AI, and Supabase |

---

## 🚀 The 14-Point Automated Compliance Verification Framework

1. **7+ Sovereign Portal Integrations**: Direct API verification with **GSTN**, **MCA-21**, **CBDT**, **MSME Udyam**, **EPFO**, **ESIC**, **DigiLocker**, and **CPPP Debarment**.
2. **Udyam / MSME Status**: Verification of Micro/Small/Medium classification and statutory order concessions.
3. **GST Registration & Returns**: Active GSTIN check with 24-month **GSTR-3B / GSTR-1** return filing compliance.
4. **PAN & Income Tax Compliance**: CBDT PAN check, 3-year **ITR-V** records, and **Form 26AS** turnover matching.
5. **Make-in-India (MII) Local Content**: Automated calculation of local content %, **Class-I (>= 50%)** / **Class-II (20-50%)** categorization.
6. **EPFO & ESIC Workforce Compliance**: Active **ECR** challan receipt validation and social security payment status.
7. **Startup India, NSIC & OEM MAF**: DPIIT Startup certificate validation and Manufacturer Authorization Form (**MAF**) cryptographic check.
8. **DigiLocker Verification**: Document URI verification with **SHA-256 cryptographic checksum matching**.
9. **Blacklisting & Debarment Status**: Instant alert check against **GeM Debarment register**, **CPPP blacklist**, and **CVC vigilance**.
10. **Tender-Specific Compliance**: Turnover threshold checks, solvency certificates, and EMD exemption validation.
11. **AI Anomaly & Discrepancy Detector**: LLM-driven scanner flagging font discrepancies, UDIN mismatches, or missing annexures.
12. **Overall Compliance Score & Risk Level**: `0-100%` score with color-coded **`LOW`**, **`MEDIUM`**, **`HIGH`**, or **`CRITICAL`** Risk Level badge.
13. **AI-Generated Procurement Officer Action Recommendation**:
    - 🟢 `ACCEPT BID WITH HIGH CONFIDENCE`
    - 🟡 `CONDITIONAL CLARIFICATION REQUIRED (ISSUE SHOW CAUSE)`
    - 🔴 `REJECT BID — CRITICAL NON-COMPLIANCE DETECTED`
14. **Immutable CAG Cryptographic Merkle Audit Ledger**: Tamper-proof SHA-256 blocks for every verification step.

---

## 📁 Repository Structure

```
SIH PROJECT/
├── src/                          # Unified Frontend Monorepo
│   ├── pages/
│   │   ├── LandingPage.tsx       # High-Fidelity GeM 2.0 Landing Page
│   │   ├── VendorLoginPage.tsx   # Vendor Login & 1-Click Demo Switcher
│   │   ├── VendorRegisterPage.tsx# 3-Step Vendor Registration
│   │   └── GovLoginPage.tsx      # Procurement Officer Secure Login
│   ├── vendor/                   # Vendor Portal (AI Scrutiny, OCR, Marketplace)
│   ├── gov/                      # Procurement Officer Suite (14-Point Checks, CAG Ledger)
│   ├── App.tsx                   # HashRouter (/, /vendor, /gov, auth routes)
│   ├── main.tsx                  # React 19 Entry Point
│   └── index.css                 # Global Design Tokens & Tailwind CSS
├── backend/                      # Shared Python FastAPI Backend
│   └── app/
│       ├── main.py               # API Entry Point & CORS Setup
│       ├── database.py           # Shared Database Controller (Supabase + Local Fallback)
│       ├── routers/              # Modular Endpoints (auth, gov, tenders, rag, etc.)
│       └── data/                 # Shared Relational State (shared_db.json)
├── public/
│   └── images/                   # GeM Banner Graphics, Logo & Category Assets
├── api/
│   └── index.py                  # Vercel Serverless Entry Point
├── .github/workflows/
│   └── deploy.yml                # Automated GitHub Pages CI/CD Action
├── vercel.json                   # Vercel Deployment Configuration
├── vite.config.ts                # Vite 8 Config (Base Path: /SIH2026/)
├── package.json                  # Unified Node.js Dependencies
├── run_all.py                    # One-Click Local Orchestrator
└── test_integration.py           # 7/7 Cross-Portal E2E Test Suite
```

---

## 🛠️ Local Development & Quickstart

```powershell
# One-Click Startup
python run_all.py
```

- 🌐 **Landing Page**: [http://localhost:5173](http://localhost:5173)
  - Landing: `http://localhost:5173/#/`
  - Vendor Portal: `http://localhost:5173/#/vendor`
  - Vendor Login: `http://localhost:5173/#/vendor/login`
  - Vendor Register: `http://localhost:5173/#/vendor/register`
  - Procurement Officer: `http://localhost:5173/#/gov`
  - Officer Login: `http://localhost:5173/#/gov/login`
- ⚡ **Interactive Swagger API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 Running Integration Tests

```powershell
python test_integration.py
```

**Result: 7/7 Cross-Portal Integration Tests Passed with 100% Success!**

---

## 👥 Team & Attribution

- **Project**: Smart India Hackathon (SIH 2026)
- **Problem Category**: AI in Governance & Public Procurement Compliance
- **Repository**: [`neuralnexus53-cyber/GEM-2.0`](https://github.com/neuralnexus53-cyber/GEM-2.0)
- **License**: MIT

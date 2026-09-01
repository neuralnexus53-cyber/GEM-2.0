from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, billing, webhooks, evaluation, vendors, documents, tenders, rag, contractor, marketplace, gov

app = FastAPI(
    title="GovVendor AI Sovereign Procurement Suite",
    description="Unified Enterprise Government & Vendor Procurement Engine with Double-Blind Vault & Shared Relational Database",
    version="5.0.0"
)

# Explicit CORS configuration for all deployment targets
origins = [
    # Local development
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:4000",
    # GitHub Pages (production frontend)
    "https://neuralnexus53.github.io",
    "https://neuralnexus53.github.io/SIH2026",
    # Vercel (if frontend is also on Vercel)
    "https://sih2026.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All Cross-Portal & Sovereign Routers
app.include_router(gov.router)
app.include_router(auth.router)
app.include_router(billing.router)
app.include_router(webhooks.router)
app.include_router(evaluation.router)
app.include_router(vendors.router)
app.include_router(documents.router)
app.include_router(tenders.router)
app.include_router(rag.router)
app.include_router(contractor.router)
app.include_router(marketplace.router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "GovVendor AI Unified Sovereign Backend",
        "version": "5.0.0",
        "portals": {
            "government_portal": "Connected via /api/gov/* (Port 3000)",
            "vendor_portal": "Connected via /api/* (Port 5173)",
            "shared_database": "Active (Local JSON / Supabase Relational Bridge)"
        },
        "endpoints": [
            "/api/gov/tenders",
            "/api/gov/submissions",
            "/api/gov/statutory/vendors",
            "/api/gov/cag-ledger",
            "/api/vendors",
            "/api/documents",
            "/api/tenders",
            "/api/evaluation",
            "/api/rag",
            "/api/contractor",
            "/api/marketplace",
            "/api/auth",
            "/api/billing"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)

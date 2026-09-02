from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, billing, webhooks, evaluation, vendors, documents, tenders, rag, contractor, marketplace, gov

app = FastAPI(
    title="GovVendor AI Sovereign Procurement Suite",
    description="Unified Enterprise Government & Vendor Procurement Engine with Double-Blind Vault & Shared Relational Database",
    version="5.0.0"
)

# Explicit CORS configuration for all deployment targets (Local, Vercel, GitHub Pages)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r".*",
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

def get_health_response():
    return {
        "status": "online",
        "service": "GovVendor AI Unified Sovereign Backend",
        "version": "5.0.0",
        "portals": {
            "government_portal": "Connected via /api/gov/*",
            "vendor_portal": "Connected via /api/*",
            "docs": "/docs or /api/docs"
        }
    }

@app.get("/")
def health_check_root():
    return get_health_response()

@app.get("/api")
@app.get("/api/")
@app.get("/api/health")
@app.get("/health")
def health_check_api():
    return get_health_response()

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

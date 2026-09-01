from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from ..data.seed_data import CONTRACT_CLAUSES_DB
from ..middleware.tier_gating import require_tier

router = APIRouter(prefix="/api/rag", tags=["Atlas Vector Clause Risk (RAG)"])

@router.get("/clauses/{tender_id}", response_model=List[Dict[str, Any]])
def get_flagged_contract_clauses(
    tender_id: str,
    current_user: dict = Depends(require_tier("PRO"))
) -> List[Dict[str, Any]]:
    return CONTRACT_CLAUSES_DB

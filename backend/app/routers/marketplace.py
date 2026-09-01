from fastapi import APIRouter
from typing import List, Dict, Any
from ..data.seed_data import COMPETITOR_BIDS_DB, REGIONAL_DEMAND_DB

router = APIRouter(prefix="/api/marketplace", tags=["Marketplace Intelligence & Competitor Data"])

@router.get("/competitor-bids", response_model=List[Dict[str, Any]])
def get_competitor_bids() -> List[Dict[str, Any]]:
    return COMPETITOR_BIDS_DB

@router.get("/win-rate-curve")
def get_win_rate_curve() -> List[Dict[str, Any]]:
    return [
        { "discount": "0%", "winRate": 10, "margin": 24 },
        { "discount": "-3%", "winRate": 22, "margin": 21 },
        { "discount": "-6%", "winRate": 42, "margin": 18 },
        { "discount": "-9%", "winRate": 64, "margin": 15 },
        { "discount": "-12%", "winRate": 82, "margin": 12 },
        { "discount": "-15%", "winRate": 94, "margin": 9 },
        { "discount": "-18%", "winRate": 98, "margin": 6 },
    ]

@router.get("/regional-demand", response_model=List[Dict[str, Any]])
def get_regional_demand_indices() -> List[Dict[str, Any]]:
    return REGIONAL_DEMAND_DB

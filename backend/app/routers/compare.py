import logging
from fastapi import APIRouter, Depends
from app.repositories.dependency import get_travel_service
from app.services.travel_service import TravelService
from app.models.schemas import CompareRequest, StateComparisonReport

logger = logging.getLogger("app.routers.compare")
router = APIRouter(prefix="/api/compare", tags=["Comparison Tools"])

@router.post("", response_model=StateComparisonReport, summary="Compare multiple states side-by-side")
async def compare_states(
    req: CompareRequest,
    travel_service: TravelService = Depends(get_travel_service)
):
    """Compare multiple states side-by-side on climate, budget levels, travel scores, accessibility, and transit."""
    logger.info(f"Executing POST /api/compare for states: {req.states}")
    return travel_service.compare_states(req.states)

import logging
from typing import List
from fastapi import APIRouter, Depends, Query
from app.repositories.dependency import get_travel_service
from app.services.travel_service import TravelService
from app.models.schemas import StateData

logger = logging.getLogger("app.routers.search")
router = APIRouter(prefix="/api/search", tags=["Search Operations"])

@router.get("", response_model=List[StateData], summary="Search state profiles by keyword")
async def search_profiles(
    q: str = Query(..., min_length=2, description="Search term for state name, destination, cuisine, or festival", example="biryani"),
    travel_service: TravelService = Depends(get_travel_service)
):
    """Perform a case-insensitive search across state names, capitals, sights, cuisines, and festivals."""
    logger.info(f"Executing GET /api/search?q={q}")
    return travel_service.search_states(q)

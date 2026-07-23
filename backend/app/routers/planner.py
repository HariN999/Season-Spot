import logging
from fastapi import APIRouter, Depends
from app.ai.dependency import get_itinerary_service
from app.ai.itinerary_service import ItineraryService
from app.models.schemas import ItineraryRequest, ItineraryPlan

logger = logging.getLogger("app.routers.planner")
router = APIRouter(prefix="/api/planner", tags=["AI Itinerary Planner"])

@router.post("/itinerary", response_model=ItineraryPlan, summary="Generate a personalized AI travel itinerary")
async def generate_plan(
    req: ItineraryRequest,
    itinerary_service: ItineraryService = Depends(get_itinerary_service)
):
    """Generates a structured, validated, knowledge-grounded travel itinerary using Gemini AI and state profile details."""
    logger.info(f"Executing POST /api/planner/itinerary for state: {req.state}")
    return itinerary_service.generate_itinerary(
        state_name=req.state,
        season_name=req.season,
        trip_type=req.tripType,
        budget=req.budget,
        duration=req.duration
    )

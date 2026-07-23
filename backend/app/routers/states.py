import logging
from typing import List
from fastapi import APIRouter, Depends
from app.repositories.dependency import get_travel_service
from app.services.travel_service import TravelService
from app.models.schemas import StateData, SeasonData

logger = logging.getLogger("app.routers.states")
router = APIRouter(prefix="/api/states", tags=["States Profile Registry"])

@router.get("", response_model=List[str], summary="Retrieve all available state names")
async def get_states(travel_service: TravelService = Depends(get_travel_service)):
    """Retrieve a sorted list of all Indian state names registered in the knowledge base."""
    logger.info("Executing GET /api/states")
    return travel_service.repo.get_state_names()

@router.get("/{state}", response_model=StateData, summary="Retrieve a complete state profile")
async def get_state_profile(state: str, travel_service: TravelService = Depends(get_travel_service)):
    """Retrieve the complete, deterministic structured profile of an Indian state by its name."""
    logger.info(f"Executing GET /api/states/{state}")
    return travel_service.get_state(state)

@router.get("/{state}/seasons", response_model=List[str], summary="Retrieve available seasons for a state")
async def get_state_seasons(state: str, travel_service: TravelService = Depends(get_travel_service)):
    """Retrieve list of available seasonal profile keys (e.g. Winter, Spring, Summer, Monsoon)."""
    logger.info(f"Executing GET /api/states/{state}/seasons")
    return travel_service.get_available_seasons(state)

@router.get("/{state}/seasons/{season}", response_model=SeasonData, summary="Retrieve seasonal insights for a state")
async def get_state_season_details(
    state: str, 
    season: str, 
    travel_service: TravelService = Depends(get_travel_service)
):
    """Retrieve detailed, season-specific climate, dining, and destination insights for a state."""
    logger.info(f"Executing GET /api/states/{state}/seasons/{season}")
    return travel_service.get_season(state, season)

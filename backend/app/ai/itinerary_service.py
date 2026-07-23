import logging
from typing import Any
from app.ai.providers.base import BaseAIProvider
from app.ai.prompt_builder import PromptBuilder
from app.ai.response_parser import ResponseParser
from app.ai.response_validator import ResponseValidator
from app.services.travel_service import TravelService
from app.models.schemas import StateData, ItineraryPlan
from app.utils.exceptions import InvalidAIResponse, StateNotFound

logger = logging.getLogger("app.ai.itinerary_service")

class ItineraryService:
    def __init__(
        self,
        travel_service: TravelService,
        ai_provider: BaseAIProvider,
        prompt_builder: PromptBuilder,
        cache: Any
    ):
        self.travel_service = travel_service
        self.ai_provider = ai_provider
        self.prompt_builder = prompt_builder
        self.cache = cache

    def generate_itinerary(
        self,
        state_name: str,
        season_name: str,
        trip_type: str,
        budget: str,
        duration: str
    ) -> ItineraryPlan:
        """Generates a validated knowledge-grounded travel itinerary using Gemini AI.
        
        Integrates validation checking, single retry loop, and a local deterministic fallback plan.
        """
        logger.info(f"Initiating itinerary generation for: {state_name} ({season_name})")
        
        # 0. Check cache hit
        cache_key = f"{state_name.lower().strip()}_{season_name.lower().strip()}_{trip_type.lower().strip()}_{budget.lower().strip()}_{duration.lower().strip()}"
        if cached_plan := self.cache.get(cache_key):
            logger.info(f"Cache Hit! Returning cached plan for {state_name}.")
            return cached_plan

        # 1. Retrieve verified knowledge database details
        state_data = self.travel_service.get_state(state_name)
        
        # Parse expected travel days count
        try:
            expected_days = int(duration.split()[0])
        except Exception:
            expected_days = 3

        # 2. Build template prompt
        prompt = self.prompt_builder.build_itinerary_prompt(
            state_data=state_data,
            season_name=season_name,
            trip_type=trip_type,
            budget=budget,
            duration=duration
        )

        # 3. Call AI, Parse and Validate (up to 2 attempts total)
        for attempt in range(1, 3):
            try:
                logger.info(f"AI Generation attempt {attempt} for {state_name}")
                raw_text = self.ai_provider.generate(prompt)
                parsed_data = ResponseParser.parse_json(raw_text)
                
                # If validation succeeds, return result immediately
                validated = ResponseValidator.validate_response(
                    data=parsed_data,
                    model_cls=ItineraryPlan,
                    expected_days=expected_days
                )
                logger.info(f"Itinerary validation successful on attempt {attempt}.")
                self.cache.set(cache_key, validated)
                return validated
                
            except Exception as e:
                logger.warning(f"Itinerary attempt {attempt} failed: {str(e)}")
                if attempt == 2:
                    logger.error("AI reasoning validation failed on all attempts. Activating local fallback itinerary.")
                    return self._generate_fallback_itinerary(state_data, season_name, expected_days)

        # Catch-all safety fallback
        return self._generate_fallback_itinerary(state_data, season_name, expected_days)

    def _generate_fallback_itinerary(
        self,
        state_data: StateData,
        season_name: str,
        days: int
    ) -> ItineraryPlan:
        """Generates a structured, fact-grounded backup itinerary entirely locally from the database."""
        logger.info(f"Generating deterministic local fallback itinerary for {state_data.name} ({season_name})")
        plan = {}
        
        sights = [loc.name for loc in state_data.topDestinations]
        foods = [food.name for food in state_data.cuisine]
        
        for d in range(1, days + 1):
            sight = sights[(d - 1) % len(sights)] if sights else "cultural landmarks"
            food = foods[(d - 1) % len(foods)] if foods else "traditional dishes"
            
            if d == 1:
                plan[f"day{d}"] = f"Arrive in {state_data.capital}. Afternoon visit to the historic {sight}. Complete the evening with a relaxing local dinner featuring traditional {food}."
            elif d == days:
                plan[f"day{d}"] = f"Check out and souvenir shopping. Explore local handicraft galleries. Final culinary farewell featuring authentic {food} before departure."
            else:
                plan[f"day{d}"] = f"Day {d} morning excursion to {sight}. Experience local artisanal markets and sample popular regional snack {food}."
                
        return ItineraryPlan(plan=plan)

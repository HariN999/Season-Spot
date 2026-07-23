from fastapi import Depends
from app.repositories.dependency import get_travel_service
from app.services.travel_service import TravelService
from app.ai.providers.base import BaseAIProvider
from app.ai.providers.gemini import GeminiAIProvider
from app.ai.prompt_loader import PromptLoader
from app.ai.prompt_builder import PromptBuilder
from app.ai.itinerary_service import ItineraryService

from app.services.cache import LRUCacheWithTTL

# Singletons for prompt loader, builder and provider
prompt_loader = PromptLoader()
prompt_builder = PromptBuilder(prompt_loader)
gemini_provider = GeminiAIProvider()
itinerary_cache = LRUCacheWithTTL(capacity=100, ttl_seconds=3600)

def get_ai_provider() -> BaseAIProvider:
    """Dependency injection provider for the active AI Provider implementation."""
    return gemini_provider

def get_prompt_builder() -> PromptBuilder:
    """Dependency injection provider for the prompt builder wrapper."""
    return prompt_builder

def get_itinerary_cache() -> LRUCacheWithTTL:
    """Dependency injection provider for the global itinerary cache."""
    return itinerary_cache

def get_itinerary_service(
    travel_service: TravelService = Depends(get_travel_service),
    ai_provider: BaseAIProvider = Depends(get_ai_provider),
    builder: PromptBuilder = Depends(get_prompt_builder),
    cache: LRUCacheWithTTL = Depends(get_itinerary_cache)
) -> ItineraryService:
    """Dependency injection provider for the Itinerary Service orchestrator."""
    return ItineraryService(travel_service, ai_provider, builder, cache)

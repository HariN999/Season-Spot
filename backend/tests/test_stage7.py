import time
import pytest
from app.services.cache import LRUCacheWithTTL
from app.ai.itinerary_service import ItineraryService
from tests.test_stage4 import MockSuccessAIProvider, MockTransientAIProvider
from app.repositories.dependency import get_state_repository
from app.services.travel_service import TravelService
from app.ai.prompt_builder import PromptBuilder
from app.ai.prompt_loader import PromptLoader
from app.models.schemas import ItineraryPlan

@pytest.fixture
def travel_service():
    repo = get_state_repository()
    repo.load_all()
    return TravelService(repo)

@pytest.fixture
def prompt_builder():
    loader = PromptLoader()
    return PromptBuilder(loader)

def test_cache_hit_miss_counters():
    cache = LRUCacheWithTTL(capacity=5, ttl_seconds=10)
    cache.clear()
    
    # Empty cache lookup should be a miss
    val = cache.get("key1")
    assert val is None
    assert cache.misses == 1
    assert cache.hits == 0

    # Set value
    cache.set("key1", "test_value")
    
    # Retrieve value should be a hit
    val2 = cache.get("key1")
    assert val2 == "test_value"
    assert cache.hits == 1
    assert cache.misses == 1
    assert cache.hit_ratio == 0.5

def test_cache_lru_eviction():
    # Capacity = 2
    cache = LRUCacheWithTTL(capacity=2, ttl_seconds=10)
    cache.clear()

    cache.set("k1", "v1")
    cache.set("k2", "v2")
    
    # Access k1 to make it recently used
    cache.get("k1")

    # Set k3, which should evict k2 (since k1 was just accessed)
    cache.set("k3", "v3")

    assert cache.get("k1") == "v1"
    assert cache.get("k2") is None # Evicted
    assert cache.get("k3") == "v3"
    assert cache.evictions == 1

def test_cache_ttl_expiration():
    # TTL = 1 second
    cache = LRUCacheWithTTL(capacity=5, ttl_seconds=1)
    cache.clear()

    cache.set("k1", "expired_val")
    
    # Wait 1.1s for expiration
    time.sleep(1.1)
    
    assert cache.get("k1") is None
    assert cache.misses == 1

def test_itinerary_service_caching_flow(travel_service, prompt_builder):
    ai_provider = MockTransientAIProvider()
    cache = LRUCacheWithTTL(capacity=5, ttl_seconds=10)
    service = ItineraryService(travel_service, ai_provider, prompt_builder, cache)

    # First request: AI provider is called (calls == 2, first call failed and then succeeded on retry)
    res1 = service.generate_itinerary("Andhra Pradesh", "Winter", "Adventure", "Affordable", "3 Days")
    assert res1.plan["day1"] == "Success on retry"
    assert ai_provider.calls == 2

    # Second request: Serves directly from cache, AI provider is NOT called again
    res2 = service.generate_itinerary("Andhra Pradesh", "Winter", "Adventure", "Affordable", "3 Days")
    assert res2.plan["day1"] == "Success on retry"
    assert ai_provider.calls == 2 # Remains 2!
    assert cache.hits == 1

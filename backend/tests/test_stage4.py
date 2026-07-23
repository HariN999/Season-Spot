import pytest
from app.ai.prompt_loader import PromptLoader
from app.ai.prompt_builder import PromptBuilder
from app.ai.response_parser import ResponseParser
from app.ai.response_validator import ResponseValidator
from app.ai.itinerary_service import ItineraryService
from app.ai.providers.base import BaseAIProvider
from app.repositories.dependency import get_state_repository
from app.services.travel_service import TravelService
from app.models.schemas import ItineraryPlan
from app.utils.exceptions import PromptTemplateNotFound, InvalidAIResponse, AIProviderError

# --- MOCK AI PROVIDERS FOR UNIT TESTING ---
class MockSuccessAIProvider(BaseAIProvider):
    def generate(self, prompt: str) -> str:
        return '```json\n{"plan": {"day1": "Visit Araku", "day2": "Eat Gongura Pachadi", "day3": "Explore Belum Caves"}}\n```'

    def health_check(self) -> bool:
        return True

class MockFailureAIProvider(BaseAIProvider):
    def generate(self, prompt: str) -> str:
        return "invalid non-json text response from model"

    def health_check(self) -> bool:
        return False

class MockTransientAIProvider(BaseAIProvider):
    def __init__(self):
        self.calls = 0

    def generate(self, prompt: str) -> str:
        self.calls += 1
        if self.calls == 1:
            return "bad json"
        return '{"plan": {"day1": "Success on retry", "day2": "Yes", "day3": "Perfect"}}'

    def health_check(self) -> bool:
        return True

@pytest.fixture
def travel_service():
    repo = get_state_repository()
    repo.load_all()
    return TravelService(repo)

@pytest.fixture
def prompt_builder():
    loader = PromptLoader()
    return PromptBuilder(loader)

def test_prompt_loader_success():
    loader = PromptLoader()
    template = loader.load_template("itinerary")
    assert "Verified Context" in template
    assert "User Preferences" in template

def test_prompt_loader_missing():
    loader = PromptLoader()
    with pytest.raises(PromptTemplateNotFound):
        loader.load_template("imaginary_template_file")

def test_prompt_builder_rendering(travel_service, prompt_builder):
    state_data = travel_service.get_state("Andhra Pradesh")
    prompt = prompt_builder.build_itinerary_prompt(
        state_data=state_data,
        season_name="Winter",
        trip_type="Nature & Scenic",
        budget="Affordable",
        duration="3 Days"
    )
    assert "Andhra Pradesh" in prompt
    assert "Winter" in prompt
    assert "Araku Valley" in prompt
    assert '"day1":' in prompt
    assert '"day3":' in prompt

def test_response_parser_cleaning():
    raw_block = "```json\n{\n  \"plan\": {\"day1\": \"Visit Charminar\"}\n}\n```"
    parsed = ResponseParser.parse_json(raw_block)
    assert parsed == {"plan": {"day1": "Visit Charminar"}}

    raw_raw = "{\"plan\": {\"day1\": \"Visit Kovalam\"}}"
    parsed_raw = ResponseParser.parse_json(raw_raw)
    assert parsed_raw == {"plan": {"day1": "Visit Kovalam"}}

def test_response_parser_failure():
    with pytest.raises(InvalidAIResponse):
        ResponseParser.parse_json("not valid json string {")

def test_response_validator_success():
    valid_data = {"plan": {"day1": "Activities", "day2": "Activities 2"}}
    validated = ResponseValidator.validate_response(valid_data, ItineraryPlan, expected_days=2)
    assert validated.plan["day2"] == "Activities 2"

def test_response_validator_failure():
    # Missing required key 'day2' for a 2-day expected request
    invalid_data = {"plan": {"day1": "Activities"}}
    with pytest.raises(InvalidAIResponse):
        ResponseValidator.validate_response(invalid_data, ItineraryPlan, expected_days=2)

def test_itinerary_service_success_flow(travel_service, prompt_builder):
    ai_provider = MockSuccessAIProvider()
    service = ItineraryService(travel_service, ai_provider, prompt_builder)
    
    result = service.generate_itinerary("Andhra Pradesh", "Winter", "Adventure", "Affordable", "3 Days")
    assert isinstance(result, ItineraryPlan)
    assert "Araku" in result.plan["day1"]
    assert "Gongura" in result.plan["day2"]

def test_itinerary_service_transient_retry_success(travel_service, prompt_builder):
    ai_provider = MockTransientAIProvider()
    service = ItineraryService(travel_service, ai_provider, prompt_builder)
    
    result = service.generate_itinerary("Andhra Pradesh", "Winter", "Adventure", "Affordable", "3 Days")
    assert isinstance(result, ItineraryPlan)
    assert result.plan["day1"] == "Success on retry"

def test_itinerary_service_fallback_flow(travel_service, prompt_builder):
    ai_provider = MockFailureAIProvider()
    service = ItineraryService(travel_service, ai_provider, prompt_builder)
    
    # Even if AI returns completely bad structures, it should fall back to deterministic local plan
    result = service.generate_itinerary("Andhra Pradesh", "Winter", "Adventure", "Affordable", "3 Days")
    assert isinstance(result, ItineraryPlan)
    assert "day1" in result.plan
    assert "day3" in result.plan
    assert "Amaravati" in result.plan["day1"]  # Matches capital of AP

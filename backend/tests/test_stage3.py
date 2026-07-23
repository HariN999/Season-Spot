import pytest
from app.repositories.dependency import get_state_repository
from app.services.travel_service import TravelService
from app.utils.exceptions import StateNotFound, SeasonNotFound, ValidationException

@pytest.fixture
def travel_service():
    repo = get_state_repository()
    repo.load_all()
    return TravelService(repo)

def test_get_state_success(travel_service):
    kerala = travel_service.get_state("Kerala")
    assert kerala.name == "Kerala"
    assert kerala.capital == "Thiruvananthapuram"

def test_get_state_not_found(travel_service):
    with pytest.raises(StateNotFound):
        travel_service.get_state("Atlantis")

def test_get_seasons_and_season_data(travel_service):
    seasons = travel_service.get_available_seasons("Telangana")
    assert "Winter" in seasons
    assert "Monsoon" in seasons
    
    winter_data = travel_service.get_season("Telangana", "Winter")
    assert winter_data.suitabilityScore == 9.8
    assert "Nihari" in winter_data.food[0].name

def test_get_season_not_found(travel_service):
    with pytest.raises(SeasonNotFound):
        travel_service.get_season("Kerala", "Autumn")

def test_search_states(travel_service):
    # Search by state name
    kerala_search = travel_service.search_states("kerala")
    assert len(kerala_search) == 1
    assert kerala_search[0].name == "Kerala"
    
    # Search by destination
    charminar_search = travel_service.search_states("Charminar")
    assert len(charminar_search) == 1
    assert charminar_search[0].name == "Telangana"

    # Search by cuisine item
    biryani_search = travel_service.search_states("Biryani")
    assert len(biryani_search) == 1
    assert biryani_search[0].name == "Telangana"

    # Search by festival
    onam_search = travel_service.search_states("Onam")
    assert len(onam_search) == 1
    assert onam_search[0].name == "Kerala"

def test_filtering_mechanisms(travel_service):
    all_states = travel_service.get_all_states()
    
    # Filter by budget
    affordable = travel_service.filter_by_budget(all_states, "Affordable")
    assert len(affordable) == 1
    assert affordable[0].name == "Andhra Pradesh"
    
    # Filter by highly recommended season
    monsoon_rec = travel_service.filter_by_season(all_states, "Monsoon", min_score=8.5)
    assert len(monsoon_rec) == 1
    assert monsoon_rec[0].name == "Kerala"  # Kerala suitability is 9.0 in Monsoon

    # Filter by travel style vibe
    heritage_vibe = travel_service.filter_by_travel_style(all_states, "Heritage")
    assert len(heritage_vibe) == 2  # Andhra Pradesh and Telangana both have Heritage vibes in seasonal profiles

def test_compare_states_success(travel_service):
    report = travel_service.compare_states(["Kerala", "Telangana"])
    assert "Kerala" in report.comparison
    assert "Telangana" in report.comparison
    assert report.comparison["Kerala"].capital == "Thiruvananthapuram"
    assert report.comparison["Telangana"].capital == "Hyderabad"

def test_compare_states_validation(travel_service):
    with pytest.raises(ValidationException):
        travel_service.compare_states(["Kerala"])

def test_calculate_weighted_travel_score(travel_service):
    # Baseline for Andhra Pradesh is 8.6, budget level is Affordable (score gets boosted by weight)
    weighted_score = travel_service.calculate_travel_score("Andhra Pradesh", {"budgetWeight": 1.0})
    assert weighted_score > 8.6

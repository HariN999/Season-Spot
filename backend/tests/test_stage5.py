import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ai.dependency import get_ai_provider
from tests.test_stage4 import MockSuccessAIProvider

client = TestClient(app)

@pytest.fixture(autouse=True)
def configure_test_dependencies():
    # Load knowledge base repository
    from app.repositories.dependency import state_repository
    state_repository.load_all()
    
    # Override AI Provider dependency during tests to avoid real HTTP network requests
    app.dependency_overrides[get_ai_provider] = lambda: MockSuccessAIProvider()
    yield
    app.dependency_overrides.clear()

def test_health_endpoints():
    r1 = client.get("/health")
    assert r1.status_code == 200
    assert r1.json()["status"] == "healthy"

    r2 = client.get("/health/knowledge")
    assert r2.status_code == 200
    assert r2.json()["total_states"] >= 3

    r3 = client.get("/health/ai")
    assert r3.status_code == 200
    assert r3.json()["status"] == "healthy"

def test_api_states_list():
    response = client.get("/api/states")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert "Kerala" in response.json()

def test_api_state_profile_detail():
    response = client.get("/api/states/Kerala")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Kerala"
    assert data["capital"] == "Thiruvananthapuram"

def test_api_state_profile_not_found():
    response = client.get("/api/states/Atlantis")
    assert response.status_code == 404
    assert "not found" in response.json()["error"]["message"]

def test_api_state_season_details():
    response = client.get("/api/states/Kerala/seasons/Winter")
    assert response.status_code == 200
    assert response.json()["vibe"] == "Backwaters & Beaches"

def test_api_state_season_not_found():
    response = client.get("/api/states/Kerala/seasons/Autumn")
    assert response.status_code == 404
    assert "not found" in response.json()["error"]["message"]

def test_api_search_endpoint():
    response = client.get("/api/search?q=biryani")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert any(s["name"] == "Telangana" for s in results)

def test_api_search_validation_error():
    # Search term shorter than 2 chars should fail validation
    response = client.get("/api/search?q=x")
    assert response.status_code == 422
    assert "Validation Error" in response.json()["error"]["message"]

def test_api_compare_endpoint():
    payload = {"states": ["Kerala", "Telangana"]}
    response = client.post("/api/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Kerala" in data["comparison"]
    assert "Telangana" in data["comparison"]
    assert data["comparison"]["Kerala"]["capital"] == "Thiruvananthapuram"

def test_api_compare_validation_error():
    # Only 1 state fails min_length validation rule
    payload = {"states": ["Kerala"]}
    response = client.post("/api/compare", json=payload)
    assert response.status_code == 422
    assert "Validation Error" in response.json()["error"]["message"]

def test_api_planner_itinerary_endpoint():
    payload = {
        "state": "Andhra Pradesh",
        "season": "Winter",
        "tripType": "Adventure",
        "budget": "Affordable",
        "duration": "3 Days"
    }
    response = client.post("/api/planner/itinerary", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "day1" in data["plan"]
    assert "Araku" in data["plan"]["day1"]

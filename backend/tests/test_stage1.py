import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.config import settings

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Season-Spot FastAPI Backend Running!"}

def test_config_loader():
    assert settings.port == 5000
    assert settings.host == "0.0.0.0"
    assert settings.gemini_api_key is not None
    assert len(settings.gemini_api_key) > 0

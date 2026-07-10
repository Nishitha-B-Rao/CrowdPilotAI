import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.ai_service import AIService
from app.models.schemas import AIRecommendation

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "ok"

def test_copilot_recommendation_endpoint_success():
    payload = {"context": "Test incident at Gate A"}
    response = client.post("/api/v1/copilot/recommendation", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "observation" in data
    assert "recommendation" in data
    assert "priority" in data
    assert data["priority"] == "high" # From our mock

def test_copilot_recommendation_endpoint_invalid_payload():
    payload = {"wrong_field": "Test"}
    response = client.post("/api/v1/copilot/recommendation", json=payload)
    assert response.status_code == 422 # Validation error

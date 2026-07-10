import pytest
from app.services.ai_service import AIService
from app.repositories.vector_repo import VectorRepository

def test_vector_repo_retrieve():
    repo = VectorRepository()
    res = repo.retrieve_context("query")
    assert "Historical context for: query" in res

def test_vector_repo_unavailable():
    repo = VectorRepository()
    repo.connected = False
    with pytest.raises(Exception, match="Vector DB unavailable"):
        repo.retrieve_context("query")

def test_ai_service_generate_recommendation():
    repo = VectorRepository()
    service = AIService(vector_repo=repo)
    # Ensure it uses the fallback mock if API key isn't set, which is the default for offline tests
    res = service.generate_recommendation("High density at Gate B")
    assert res.observation == "Context matched: High density at Gate B"
    assert "High density at Gate B" in res.reasoning[1]
    assert res.priority == "high"

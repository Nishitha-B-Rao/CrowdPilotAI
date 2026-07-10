import pytest
from app.services.ai_service import AIService
from app.repositories.vector_repo import VectorRepository

def test_process_incidents_summarization():
    """Test that process_incidents correctly summarizes CSV data without failing."""
    repo = VectorRepository()
    service = AIService(vector_repo=repo)
    # Ensure client is None to trigger mock behavior
    service.client = None 

    csv_data = """time,gate_id,description
14:00,Gate A,Medical emergency in section 102
14:05,Gate B,Broken turnstile
"""
    
    # Should not throw exception and should fall back to mock response since client is None
    result = service.process_incidents(csv_data)
    
    assert "incidents" in result
    assert len(result["incidents"]) > 0
    
    # The first mock item should be returned
    assert result["incidents"][0]["priority"] == "low"

def test_process_incidents_bad_csv():
    """Test that process_incidents handles completely malformed CSV strings gracefully."""
    repo = VectorRepository()
    service = AIService(vector_repo=repo)
    service.client = None
    
    bad_csv = "This is not a valid CSV\nRow 2"
    result = service.process_incidents(bad_csv)
    
    assert "incidents" in result

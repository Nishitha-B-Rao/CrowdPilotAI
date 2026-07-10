import pytest
import io
from unittest.mock import patch, MagicMock
from fastapi import UploadFile
from app.services.data_processing_service import DataProcessingService
from app.services.ai_service import AIService
from app.repositories.vector_repo import VectorRepository
from fastapi import HTTPException

@pytest.mark.asyncio
async def test_csv_validation_missing_columns():
    """Test CSV Validation - Missing required columns"""
    csv_content = b"gate,occupancy\nGate A,85\n"
    file = UploadFile(filename="test.csv", file=io.BytesIO(csv_content))
    
    with pytest.raises(HTTPException) as excinfo:
        await DataProcessingService.process_crowd_csv(file)
    assert excinfo.value.status_code == 400
    assert "CSV missing required columns" in excinfo.value.detail

@pytest.mark.asyncio
async def test_data_processing():
    """Test Data Processing - Correct aggregation via Pandas"""
    csv_content = b"gate_id,occupancy,queue_time\nGate A,85,15\nGate B,90,20\n"
    file = UploadFile(filename="test.csv", file=io.BytesIO(csv_content))
    
    state = await DataProcessingService.process_crowd_csv(file)
    assert state.total_occupancy > 0
    assert state.avg_queue_time > 0
    assert state.active_incidents >= 0

def test_ai_prompt_generation_mock():
    """Test AI Prompt Generation and Mock Fallback"""
    repo = VectorRepository()
    service = AIService(vector_repo=repo)
    # Ensure client is None to trigger mock behavior
    service.client = None 
    
    result = service.generate_recommendation('{"test": "data"}')
    assert result.priority == "high"
    assert "Context matched" in result.observation
    assert "test" in result.observation

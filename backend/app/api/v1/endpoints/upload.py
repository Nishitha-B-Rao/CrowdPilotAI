from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.data_processing_service import DataProcessingService
from app.models.telemetry import StadiumState

router = APIRouter()

@router.post("/csv", response_model=StadiumState)
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload a CSV containing crowd metrics.
    Automatically parses the CSV, validates it, and updates the live stadium state.
    """
    try:
        updated_state = await DataProcessingService.process_crowd_csv(file)
        return updated_state
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

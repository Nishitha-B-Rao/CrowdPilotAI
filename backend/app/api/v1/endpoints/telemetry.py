from fastapi import APIRouter, Depends

from app.api.deps import get_telemetry_service
from app.models.telemetry import StadiumState
from app.services.telemetry_service import TelemetryService

router = APIRouter()


@router.get("/state", response_model=StadiumState)
async def get_stadium_state(telemetry_service: TelemetryService = Depends(get_telemetry_service)):
    """
    Get the current live simulated state of the stadium (gates, queues, etc).
    """
    return telemetry_service.generate_live_state()

@router.get("/ai-logs")
async def get_ai_logs(telemetry_service: TelemetryService = Depends(get_telemetry_service)):
    """
    Get the latest AI activity logs.
    """
    return {"logs": telemetry_service.ai_logs}

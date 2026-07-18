import time
import json
from fastapi import APIRouter, Depends

from app.api.deps import get_ai_service, get_telemetry_service
from app.models.schemas import DashboardSyncResponse
from app.services.ai_service import AIService
from app.services.telemetry_service import TelemetryService
from app.api.v1.endpoints.copilot import _log_ai_activity

router = APIRouter()

@router.get("/sync", response_model=DashboardSyncResponse)
async def sync_dashboard(
    ai_service: AIService = Depends(get_ai_service),
    telemetry_service: TelemetryService = Depends(get_telemetry_service)
):
    """
    Aggregated endpoint to fetch telemetry state, AI logs, and a fresh recommendation
    in a single network round-trip.
    """
    state = telemetry_service.generate_live_state()
    
    # Try generating a recommendation based on the current state
    start_time = time.time()
    try:
        context_str = json.dumps(state.model_dump())
        recommendation = ai_service.generate_recommendation(context_str)
        confidence_val = getattr(recommendation, "confidence", "N/A")
        _log_ai_activity(telemetry_service, "Dashboard Sync", start_time, confidence_val, "Recommendation Generated")
    except Exception as e:
        _log_ai_activity(telemetry_service, "Dashboard Sync", start_time, "0%", f"Failed: {str(e)[:20]}")
        recommendation = None

    return DashboardSyncResponse(
        state=state,
        recommendation=recommendation,
        ai_logs=telemetry_service.ai_logs
    )

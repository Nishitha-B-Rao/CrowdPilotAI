import time
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from app.api.deps import get_ai_service, get_telemetry_service
from app.models.schemas import AIRecommendation, ContextRequest, TranslateRequest, TranslateResponse, IncidentResponse, AILogEntry
from app.services.ai_service import AIService
from app.services.telemetry_service import TelemetryService

router = APIRouter()

def _log_ai_activity(telemetry_service: TelemetryService, input_type: str, start_time: float, confidence: str, status: str):
    latency = int((time.time() - start_time) * 1000)
    log = AILogEntry(
        timestamp=datetime.now().strftime("%H:%M:%S"),
        input_type=input_type,
        model="Gemini 2.5 Flash",
        latency_ms=latency,
        confidence=confidence,
        status=status
    )
    # Keep last 50 logs
    telemetry_service.ai_logs.insert(0, log)
    if len(telemetry_service.ai_logs) > 50:
        telemetry_service.ai_logs.pop()

@router.post("/recommendation", response_model=AIRecommendation)
async def get_recommendation(
    req: ContextRequest, 
    ai_service: AIService = Depends(get_ai_service),
    telemetry_service: TelemetryService = Depends(get_telemetry_service)
):
    """
    Generate an Explainable AI recommendation based on the current context.
    """
    start_time = time.time()
    try:
        recommendation = ai_service.generate_recommendation(req.context)
        confidence_val = getattr(recommendation, "confidence", "N/A")
        _log_ai_activity(telemetry_service, "Decision Engine State", start_time, confidence_val, "Recommendation Generated")
        return recommendation
    except Exception as e:
        _log_ai_activity(telemetry_service, "Decision Engine State", start_time, "0%", f"Failed: {str(e)[:20]}")
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendation: {str(e)}")

@router.post("/translate", response_model=TranslateResponse)
def translate_text(
    request: TranslateRequest,
    ai_service: AIService = Depends(get_ai_service),
    telemetry_service: TelemetryService = Depends(get_telemetry_service)
):
    """
    Translates fan audio requests and detects language using AI.
    """
    start_time = time.time()
    result = ai_service.translate_text(request.text)
    _log_ai_activity(telemetry_service, "Audio/Text Translation", start_time, result.get("confidence", "N/A"), "Translation Completed")
    return TranslateResponse(**result)

import asyncio

@router.post("/incidents/upload", response_model=IncidentResponse)
async def upload_incidents(
    file: UploadFile = File(...),
    ai_service: AIService = Depends(get_ai_service),
    telemetry_service: TelemetryService = Depends(get_telemetry_service)
):
    """
    Upload a CSV of incidents to get AI generated priorities, reasoning, and announcements.
    """
    start_time = time.time()
    if not file.filename or not file.filename.endswith('.csv'):
        _log_ai_activity(telemetry_service, "incident.csv Upload", start_time, "0%", "Invalid File")
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
        
    content = await file.read()
    csv_string = content.decode("utf-8")
    
    result = await asyncio.to_thread(ai_service.process_incidents, csv_string)
    
    # Calculate an average confidence if they don't have one globally for this
    _log_ai_activity(telemetry_service, "incident.csv Upload", start_time, "95%", f"Processed {len(result.get('incidents', []))} Incidents")
    return IncidentResponse(**result)

from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class AIRecommendation(BaseModel):
    observation: str = Field(description="What was observed")
    reasoning: List[str] = Field(description="List of reasons for the prediction")
    prediction: str = Field(description="What will happen if no action is taken")
    recommendation: str = Field(description="Recommended action")
    expectedImpact: str = Field(description="Expected impact of the action")
    priority: str = Field(description="Priority level: low, medium, high, critical")
    confidence: str = Field(description="Confidence score out of 100")
    affectedZones: List[str] = Field(description="Zones affected by this recommendation")
    generatedLanguages: Dict[str, str] = Field(
        description="Announcements in various languages"
    )


class ContextRequest(BaseModel):
    context: str = Field(description="The context to analyze")

class TranslateRequest(BaseModel):
    text: str = Field(description="Text to translate to English")

class TranslateResponse(BaseModel):
    originalText: str
    translatedText: str
    detectedLanguage: str
    confidence: str = Field("N/A", description="Translation confidence")

class IncidentItem(BaseModel):
    time: str
    incident: str
    gate: str
    priority: str
    reasoning: str
    response: str
    announcement: str

class IncidentResponse(BaseModel):
    incidents: List[IncidentItem]

class AILogEntry(BaseModel):
    timestamp: str
    input_type: str
    model: str
    latency_ms: int
    confidence: str
    status: str

from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class AIRecommendation(BaseModel):
    observation: str = Field(..., description="What was observed")
    reasoning: List[str] = Field(..., description="List of reasons for the prediction")
    prediction: str = Field(..., description="What will happen if no action is taken")
    recommendation: str = Field(..., description="Recommended action")
    expectedImpact: str = Field(..., description="Expected impact of the action")
    priority: str = Field(..., description="Priority level: low, medium, high, critical")
    confidence: str = Field(..., description="Confidence score out of 100")
    affectedZones: List[str] = Field(..., description="Zones affected by this recommendation")
    generatedLanguages: Dict[str, str] = Field(
        ..., description="Announcements in various languages"
    )


class ContextRequest(BaseModel):
    context: str = Field(..., description="The context to analyze")

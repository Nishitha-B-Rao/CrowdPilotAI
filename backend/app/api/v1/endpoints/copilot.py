from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_ai_service
from app.models.schemas import AIRecommendation, ContextRequest
from app.services.ai_service import AIService

router = APIRouter()


@router.post("/recommendation", response_model=AIRecommendation)
async def get_recommendation(req: ContextRequest, ai_service: AIService = Depends(get_ai_service)):
    """
    Generate an Explainable AI recommendation based on the current context.
    """
    try:
        recommendation = ai_service.generate_recommendation(req.context)
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendation: {str(e)}")

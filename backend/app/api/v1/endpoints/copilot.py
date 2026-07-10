from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_ai_service
from app.models.schemas import AIRecommendation, ContextRequest, TranslateRequest, TranslateResponse
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

@router.post("/translate", response_model=TranslateResponse)
async def translate_text(req: TranslateRequest, ai_service: AIService = Depends(get_ai_service)):
    """
    Translate text to English using Vertex AI.
    """
    try:
        translation = ai_service.translate_text(req.text)
        return translation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to translate: {str(e)}")

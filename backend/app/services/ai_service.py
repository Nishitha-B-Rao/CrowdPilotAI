import json
from typing import Optional

import google.generativeai as genai

from app.core.config import settings
from app.models.schemas import AIRecommendation
from app.repositories.vector_repo import VectorRepository


class AIService:
    def __init__(self, vector_repo: VectorRepository):
        self.vector_repo = vector_repo
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(
                "gemini-1.5-flash", generation_config={"response_mime_type": "application/json"}
            )
        else:
            self.model = None

    def generate_recommendation(self, context: str) -> AIRecommendation:
        """
        Generate an explainable AI recommendation utilizing RAG context.
        """
        rag_context = self.vector_repo.retrieve_context(context)

        prompt = f"""
        You are an expert software architect and senior full-stack engineer building an AI decision support system for stadium volunteers at the FIFA World Cup 2026.
        
        Based on the following live context and historical data, generate an Explainable AI recommendation.
        Context: {context}
        Historical RAG Data: {rag_context}
        
        Output strictly as JSON matching this schema:
        {{
          "observation": "What was observed",
          "reasoning": ["Reason 1", "Reason 2"],
          "prediction": "What will happen next",
          "recommendation": "What action should be taken",
          "expectedImpact": "What the result of the action will be",
          "priority": "low|medium|high|critical",
          "confidence": "e.g., 92%",
          "affectedZones": ["Gate C", "Gate D"],
          "generatedLanguages": {{
             "en": "English announcement"
          }}
        }}
        """

        if not self.model:
            # Return fallback for testing without API Key
            return AIRecommendation(
                observation="Context matched: " + context,
                reasoning=["Mock reason due to missing API key.", rag_context],
                prediction="Mock prediction.",
                recommendation="Mock recommendation.",
                expectedImpact="Mock impact.",
                priority="high",
                confidence="90%",
                affectedZones=["Zone A"],
                generatedLanguages={"en": "Mock announcement."},
            )

        try:
            response = self.model.generate_content(prompt)
            response_dict = json.loads(response.text)
            return AIRecommendation(**response_dict)
        except Exception as e:
            raise ValueError(f"AI Generation failed: {e}")

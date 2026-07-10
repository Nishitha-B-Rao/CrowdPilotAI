import json
from typing import Optional

from google import genai
from google.genai import types

from app.core.config import settings
from app.models.schemas import AIRecommendation
from app.repositories.vector_repo import VectorRepository


class AIService:
    client: Optional[genai.Client]
    
    def __init__(self, vector_repo: VectorRepository):
        self.vector_repo = vector_repo
        if settings.GCP_PROJECT_ID:
            self.client = genai.Client(
                vertexai=True,
                project=settings.GCP_PROJECT_ID,
                location=settings.GCP_LOCATION
            )
        elif settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            self.client = None

    def generate_recommendation(self, context: str) -> AIRecommendation:
        """
        Generate an explainable AI recommendation utilizing RAG context.
        """
        rag_context = self.vector_repo.retrieve_context(context)

        prompt = f"""
        You are an expert software architect and senior operations manager building an AI decision support system for stadium volunteers at the FIFA World Cup 2026.
        
        Analyze the following live stadium telemetry context and generate an Explainable AI recommendation to prevent congestion or resolve bottlenecks.
        
        LIVE TELEMETRY CONTEXT (JSON string):
        {context}
        
        HISTORICAL RAG DATA: 
        {rag_context}
        
        Look for any gates with high occupancy (e.g. > 80%) or long queue times. If a gate is overcrowded, recommend redirecting fans to a nearby gate with lower occupancy.
        
        Output strictly as JSON matching this schema:
        {{
          "observation": "What was observed (e.g. Gate C is at 92% capacity)",
          "reasoning": ["Reason 1", "Reason 2", "Reason 3"],
          "prediction": "What will happen next if nothing is done",
          "recommendation": "What action should be taken right now",
          "expectedImpact": "What the result of the action will be",
          "priority": "low|medium|high|critical",
          "confidence": "e.g., 92%",
          "affectedZones": ["Gate C", "Gate D"],
          "generatedLanguages": {{
             "en": "English announcement"
          }}
        }}
        """

        if not self.client:
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
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            response_dict = json.loads(response.text)
            return AIRecommendation(**response_dict)
        except Exception as e:
            # Fallback if API fails (e.g. 429 Rate Limit)
            return AIRecommendation(
                observation="Live Telemetry captured, but AI Analysis is temporarily rate-limited.",
                reasoning=[
                    f"API Error encountered: {str(e)[:100]}...",
                    "Please wait a few moments before requesting another AI insight.",
                    "The telemetry data continues to stream live on the dashboard."
                ],
                prediction="AI cannot predict the exact outcome while rate limited.",
                recommendation="Monitor the top metrics manually or try again in 1 minute.",
                expectedImpact="Manual operations mode active.",
                priority="medium",
                confidence="N/A",
                affectedZones=["All Zones"],
                generatedLanguages={"en": "AI services are temporarily rate-limited."}
            )

    def translate_text(self, text: str) -> dict:
        """
        Translate the provided text to English and detect source language.
        """
        prompt = f"""
        You are a highly accurate translation API.
        Identify the language of the following text, and translate it to English.
        Text: "{text}"
        
        Output strictly as JSON matching this schema:
        {{
          "originalText": "The original text",
          "translatedText": "The English translation",
          "detectedLanguage": "The name of the detected source language (e.g. Spanish, French, Japanese)",
          "confidence": "e.g., 98%"
        }}
        """

        if not self.client:
            return {
                "originalText": text,
                "translatedText": "Mock translation: Hello, where is the nearest restroom?",
                "detectedLanguage": "Mock Language",
                "confidence": "99%"
            }
            
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            return json.loads(response.text)
        except Exception as e:
            return {
                "originalText": text,
                "translatedText": f"Translation failed: {str(e)[:50]}",
                "detectedLanguage": "Unknown",
                "confidence": "0%"
            }

    def process_incidents(self, csv_data: str) -> dict:
        """
        Process a CSV string of incidents and generate AI responses.
        """
        prompt = f"""
        You are a highly experienced stadium operations manager and AI copilot.
        I am giving you a CSV of reported incidents in the stadium.
        
        CSV DATA:
        {csv_data}
        
        For each incident in the CSV, determine the correct priority (low, medium, high, critical),
        provide the reasoning, determine the correct operational response, and generate a brief public announcement (or "N/A" if none is needed).
        
        Output strictly as JSON matching this schema:
        {{
          "incidents": [
            {{
              "time": "Time of incident",
              "incident": "Type of incident",
              "gate": "Location",
              "priority": "low|medium|high|critical",
              "reasoning": "Why this priority and response was chosen",
              "response": "The action to take",
              "announcement": "Public announcement text if any, else N/A"
            }}
          ]
        }}
        """

        if not self.client:
            return {
                "incidents": [
                    {
                        "time": "10:00",
                        "incident": "Mock API Key Missing",
                        "gate": "A",
                        "priority": "low",
                        "reasoning": "No API key configured.",
                        "response": "Provide GCP credentials.",
                        "announcement": "N/A"
                    }
                ]
            }

        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            return json.loads(response.text)
        except Exception as e:
            return {
                "incidents": []
            }

from fastapi import Depends

from app.repositories.vector_repo import VectorRepository
from app.services.ai_service import AIService


from app.services.telemetry_service import TelemetryService


def get_vector_repo() -> VectorRepository:
    """Dependency provider for Vector Repository."""
    return VectorRepository()


def get_ai_service(vector_repo: VectorRepository = Depends(get_vector_repo)) -> AIService:
    """Dependency provider for AI Service."""
    return AIService(vector_repo=vector_repo)


# Singleton telemetry service to maintain state
_telemetry_service = TelemetryService()

def get_telemetry_service() -> TelemetryService:
    return _telemetry_service

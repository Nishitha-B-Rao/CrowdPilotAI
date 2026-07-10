from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import copilot, telemetry
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for CrowdPilot AI - Stadium Operations Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(copilot.router, prefix=f"{settings.API_V1_STR}/copilot", tags=["copilot"])
app.include_router(telemetry.router, prefix=f"{settings.API_V1_STR}/telemetry", tags=["telemetry"])


@app.get("/")
def root():
    return {"status": "ok", "message": f"{settings.PROJECT_NAME} Backend is running."}

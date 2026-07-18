from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import copilot, telemetry, upload, dashboard
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for CrowdPilot AI - Stadium Operations Platform",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
    return response

app.include_router(copilot.router, prefix=f"{settings.API_V1_STR}/copilot", tags=["copilot"])
app.include_router(telemetry.router, prefix=f"{settings.API_V1_STR}/telemetry", tags=["telemetry"])
app.include_router(upload.router, prefix=f"{settings.API_V1_STR}/upload", tags=["upload"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])


@app.get("/")
def root():
    return {"status": "ok", "message": f"{settings.PROJECT_NAME} Backend is running."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

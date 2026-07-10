from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "CrowdPilot AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Secrets & API Keys
    SECRET_KEY: str = "supersecret_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    GEMINI_API_KEY: str = ""
    GCP_PROJECT_ID: str = ""
    GCP_LOCATION: str = "us-central1"

    class Config:
        env_file = ".env"


settings = Settings()

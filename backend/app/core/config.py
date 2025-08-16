# app/core/config.py
# Environment-backed settings (Pydantic BaseSettings)
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "prompt-platform"
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    REDIS_URL: str = Field(..., env="REDIS_URL")
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(10080, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    GOOGLE_CLIENT_ID: str | None = Field(None, env="GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str | None = Field(None, env="GOOGLE_CLIENT_SECRET")
    OPENAI_API_KEY: str | None = Field(None, env="OPENAI_API_KEY")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

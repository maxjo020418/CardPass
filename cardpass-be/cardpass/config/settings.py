from functools import lru_cache
from pathlib import Path
from typing import List, Optional

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", env_prefix="CARDPASS_")

    project_name: str = Field(default="CardPass API")
    environment: str = Field(default="local")
    domain: str = Field(default="localhost")

    database_url: str = Field(default="postgresql+asyncpg://postgres:postgres@localhost:5432/cardpass")

    jwt_secret: str = Field(default="super-secret-change-me")
    access_ttl_minutes: int = Field(default=15, ge=5, le=120)
    refresh_ttl_days: int = Field(default=14, ge=1, le=90)
    refresh_cookie_name: str = Field(default="cardpass_refresh_token")

    cors_origins: List[AnyHttpUrl] = Field(default_factory=list)

    webhook_secret: str = Field(default="change-me")
    rpc_endpoint: Optional[str] = None

    challenge_ttl_seconds: int = Field(default=300, ge=60, le=900)
    challenge_message_prefix: str = Field(default="CardPass wants you to sign in")

    rate_limit_per_minute: int = Field(default=30, ge=1)

    log_level: str = Field(default="INFO")
    root_path: str = Field(default="")


@lru_cache
def get_settings() -> Settings:
    # Ensure settings module is only instantiated once per process
    return Settings()


settings = get_settings()

"""Application configuration using environment variables."""

from __future__ import annotations

from functools import lru_cache
from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings loaded from environment variables or `.env` files."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    aws_region: Optional[str] = Field(default=None, alias="AWS_REGION")
    aws_profile: Optional[str] = Field(default=None, alias="AWS_PROFILE")
    aws_access_key_id: Optional[str] = Field(default=None, alias="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: Optional[str] = Field(default=None, alias="AWS_SECRET_ACCESS_KEY")
    aws_session_token: Optional[str] = Field(default=None, alias="AWS_SESSION_TOKEN")
    aws_endpoint_url: Optional[str] = Field(default=None, alias="AWS_ENDPOINT_URL")

    dashboard_bucket: Optional[str] = Field(default=None, alias="DASHBOARD_BUCKET")
    dashboard_key: Optional[str] = Field(default=None, alias="DASHBOARD_KEY")

    api_title: str = Field(default="Corrosion Intelligence API", alias="API_TITLE")
    api_version: str = Field(default="0.1.0", alias="API_VERSION")
    cors_allowed_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173"], alias="CORS_ALLOWED_ORIGINS"
    )

    @field_validator("cors_allowed_origins", mode="before")
    @classmethod
    def _normalize_cors_origins(cls, value: object) -> list[str]:
        """Allow comma-separated or list-style configuration for CORS origins."""

        if value is None or value == "":
            return ["http://localhost:5173"]

        if isinstance(value, str):
            if value.strip() == "*":
                return ["*"]

            return [origin.strip() for origin in value.split(",") if origin.strip()]

        if isinstance(value, (list, tuple, set)):
            return [str(origin).strip() for origin in value if str(origin).strip()]

        raise TypeError("cors_allowed_origins must be a string or list of strings")


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""

    return Settings()


settings = get_settings()

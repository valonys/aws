"""FastAPI application entry point."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import dashboard


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""

    app = FastAPI(title=settings.api_title, version=settings.api_version)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(dashboard.router)

    @app.get("/health", tags=["health"], summary="API health check")
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()

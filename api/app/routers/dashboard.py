"""API routes for dashboard data."""

from __future__ import annotations

from fastapi import APIRouter

from ..schemas.dashboard import DashboardResponse
from ..services.dashboard import get_dashboard_payload

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", summary="Retrieve dashboard data", response_model=DashboardResponse)
def read_dashboard() -> DashboardResponse:
    """Return the dashboard payload consumed by the React UI."""

    return get_dashboard_payload()

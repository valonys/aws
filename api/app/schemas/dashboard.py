"""Pydantic models describing dashboard payloads."""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DashboardSummary(BaseModel):
    """Aggregate dashboard metrics."""

    assets_monitored: int = Field(ge=0, description="Number of monitored assets")
    anomalies_detected: int = Field(ge=0, description="Detected anomalies count")
    reports_generated: int = Field(ge=0, description="Generated reports count")

    model_config = ConfigDict(populate_by_name=True)


class DashboardFinding(BaseModel):
    """Single corrosion finding entry."""

    id: str = Field(description="Unique identifier for the finding")
    severity: str = Field(description="Severity label supplied by the model")
    severity_rank: int = Field(ge=0, description="Numeric severity ordering")
    description: str = Field(description="Narrative describing the issue")
    location: Optional[str] = Field(default=None, description="Location or page reference")

    model_config = ConfigDict(populate_by_name=True)


class DashboardResponse(BaseModel):
    """Payload returned by the dashboard endpoint."""

    summary: DashboardSummary
    findings: list[DashboardFinding]
    error: Optional[str] = Field(default=None, description="Optional error context")

    model_config = ConfigDict(populate_by_name=True)


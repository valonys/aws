"""Service layer for dashboard endpoints."""

from __future__ import annotations

import json
from typing import Any, Tuple

from botocore.exceptions import BotoCoreError, ClientError
from pydantic import ValidationError

from ..aws import get_client
from ..config import settings
from ..schemas.dashboard import DashboardFinding, DashboardResponse, DashboardSummary

_DEFAULT_DASHBOARD = DashboardResponse(
    summary=DashboardSummary(
        assets_monitored=128,
        anomalies_detected=6,
        reports_generated=18,
    ),
    findings=[
        DashboardFinding(
            id="IMG_012_P04_03",
            severity="CRITICAL",
            severity_rank=1,
            description="Severe pitting corrosion detected along the lower flange.",
            location="Page 4",
        ),
        DashboardFinding(
            id="IMG_045_P07_01",
            severity="HIGH",
            severity_rank=2,
            description="Accelerated wall loss observed near weld seam.",
            location="Page 7",
        ),
    ],
)


def _load_dashboard_from_s3() -> Tuple[dict[str, Any], str | None]:
    """Load dashboard data from S3 if configuration is available."""

    if not settings.dashboard_bucket or not settings.dashboard_key:
        return {}, None

    s3_client = get_client("s3")
    try:
        response = s3_client.get_object(Bucket=settings.dashboard_bucket, Key=settings.dashboard_key)
    except (ClientError, BotoCoreError) as exc:  # pragma: no cover - defensive logging point
        return {}, str(exc)

    body = response.get("Body")
    if body is None:
        return {}, None

    data = body.read()
    if isinstance(data, bytes):
        raw_payload = data.decode("utf-8")
    else:
        raw_payload = data

    if not raw_payload:
        return {}, "Dashboard object is empty."

    try:
        return json.loads(raw_payload), None
    except json.JSONDecodeError as exc:  # pragma: no cover - guard against malformed data
        return {}, f"Invalid dashboard JSON: {exc}"


def get_dashboard_payload() -> DashboardResponse:
    """Return dashboard data from AWS or fallback defaults."""

    payload_data, error_message = _load_dashboard_from_s3()

    if payload_data:
        try:
            payload = DashboardResponse.model_validate(payload_data)
        except ValidationError as exc:
            payload = _DEFAULT_DASHBOARD.model_copy(deep=True)
            error_message = error_message or f"Invalid dashboard payload: {exc.errors()}"
    else:
        payload = _DEFAULT_DASHBOARD.model_copy(deep=True)
        if error_message is None:
            error_message = "Dashboard data not configured; using defaults."

    payload.findings.sort(key=lambda finding: finding.severity_rank)

    if error_message:
        payload = payload.model_copy(update={"error": error_message})

    return payload

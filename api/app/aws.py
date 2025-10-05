"""Utilities for configuring AWS SDK clients."""

from __future__ import annotations

from functools import lru_cache
from typing import Any, Dict, Optional

import boto3
from botocore.config import Config as BotoConfig

from .config import settings


@lru_cache
def get_boto3_session() -> boto3.session.Session:
    """Return a boto3 session configured from environment variables."""

    session_kwargs: Dict[str, Any] = {}
    if settings.aws_profile:
        session_kwargs["profile_name"] = settings.aws_profile
    if settings.aws_region:
        session_kwargs["region_name"] = settings.aws_region

    # Allow explicit credentials when supplied, otherwise fall back to shared config/metadata chain.
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        session_kwargs.update(
            {
                "aws_access_key_id": settings.aws_access_key_id,
                "aws_secret_access_key": settings.aws_secret_access_key,
            }
        )
        if settings.aws_session_token:
            session_kwargs["aws_session_token"] = settings.aws_session_token

    return boto3.session.Session(**session_kwargs)


def get_client(service_name: str, *, endpoint_url: Optional[str] = None, config: Optional[BotoConfig] = None):
    """Create a boto3 client for the given service."""

    client_kwargs: Dict[str, Any] = {"service_name": service_name}
    if config is not None:
        client_kwargs["config"] = config

    session = get_boto3_session()
    if endpoint_url or settings.aws_endpoint_url:
        client_kwargs["endpoint_url"] = endpoint_url or settings.aws_endpoint_url

    return session.client(**client_kwargs)

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from enum import Enum


class ContentType(str, Enum):
    """Types of content that can be processed"""
    TEXT = "text"
    IMAGE = "image"
    DOCUMENT = "document"


class ContentModeration(BaseModel):
    """Schema for content moderation results"""
    content_id: str
    content_type: ContentType
    is_flagged: bool
    categories: Dict[str, float] = Field(default_factory=dict, description="Moderation categories with confidence scores")
    reason: Optional[str] = None


class ContentValidation(BaseModel):
    """Schema for content validation results"""
    content_id: str
    content_type: ContentType
    is_valid: bool
    validation_errors: List[str] = Field(default_factory=list)


class GuardrailsConfig(BaseModel):
    """Configuration for guardrails"""
    enable_moderation: bool = True
    enable_validation: bool = True
    moderation_threshold: float = 0.8
    allowed_content_types: List[ContentType] = [ContentType.TEXT, ContentType.IMAGE, ContentType.DOCUMENT]
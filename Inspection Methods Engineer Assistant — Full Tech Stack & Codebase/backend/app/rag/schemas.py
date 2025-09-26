from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class Document(BaseModel):
    """Schema for a document in the RAG system"""
    content: str
    source: str
    metadata: Dict[str, Any] = {}


class QueryRequest(BaseModel):
    """Schema for a query request"""
    query: str
    filters: Optional[Dict[str, Any]] = None


class QueryResponse(BaseModel):
    """Schema for a query response"""
    answer: str
    sources: Optional[List[Document]] = None


class IngestRequest(BaseModel):
    """Schema for an ingestion request"""
    documents: List[Document]
    collection_name: Optional[str] = "default"


class IngestResponse(BaseModel):
    """Schema for an ingestion response"""
    success: bool
    message: str
    document_ids: Optional[List[str]] = None
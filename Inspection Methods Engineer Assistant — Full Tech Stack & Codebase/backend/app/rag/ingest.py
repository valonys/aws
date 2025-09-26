from typing import List, Dict, Any, Optional
from app.deps import get_chroma_client
from app.rag.schemas import Document, IngestResponse
from app.config import settings

from groq import Groq
import uuid


def ingest_documents(documents: List[Document], collection_name: str = "default") -> IngestResponse:
    """Ingest documents into the vector database"""
    try:
        # Initialize Groq client for embeddings
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        # Get ChromaDB client
        chroma_client = get_chroma_client()
        
        # Get or create collection
        collection = chroma_client.get_or_create_collection(name=collection_name)
        
        # Prepare documents for ingestion
        document_ids = []
        document_texts = []
        document_metadatas = []
        
        for doc in documents:
            doc_id = str(uuid.uuid4())
            document_ids.append(doc_id)
            document_texts.append(doc.content)
            
            # Combine source and metadata
            metadata = doc.metadata.copy()
            metadata["source"] = doc.source
            document_metadatas.append(metadata)
        
        # Add documents to collection without embeddings since Groq doesn't support embeddings
        # ChromaDB will use its default embedding function
        collection.add(
            ids=document_ids,
            metadatas=document_metadatas,
            documents=document_texts
        )
        
        return IngestResponse(
            success=True,
            message=f"Successfully ingested {len(documents)} documents",
            document_ids=document_ids
        )
        
    except Exception as e:
        return IngestResponse(
            success=False,
            message=f"Error ingesting documents: {str(e)}"
        )
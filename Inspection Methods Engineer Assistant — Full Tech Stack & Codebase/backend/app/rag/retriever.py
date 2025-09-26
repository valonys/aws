from typing import List, Dict, Any, Optional
from app.deps import get_chroma_client
from app.config import settings

from groq import Groq


def retrieve_relevant_documents(query: str, collection_name: str = "default", top_k: int = 5) -> List[Dict[str, Any]]:
    """Retrieve relevant documents from the vector database"""
    # Initialize Groq client for embeddings
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    # Get ChromaDB client
    chroma_client = get_chroma_client()
    
    # Get collection
    collection = chroma_client.get_collection(name=collection_name)
    
    # Get collection
    collection = chroma_client.get_collection(name=collection_name)
    
    # Use text-based search instead of embeddings since Groq doesn't support embeddings
    # This is a simplified approach - in production you'd use a proper embedding service
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        include=["documents", "metadatas"]
    )
    
    # Format the results
    documents = []
    for i in range(len(results["documents"][0])):
        doc = {
            "content": results["documents"][0][i],
            "source": results["metadatas"][0][i].get("source", "Unknown"),
            "metadata": {k: v for k, v in results["metadatas"][0][i].items() if k != "source"}
        }
        documents.append(doc)
    
    return documents
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from app.config import settings
from app.deps import get_db
from app.rag.schemas import QueryRequest, QueryResponse
from app.agents.inspection_agent import InspectionAgent
from app.vision.vision_analysis import analyze_image
from app.monitoring.metrics import record_query_metrics

app = FastAPI(
    title="Inspection Methods Engineer Assistant API",
    description="API for the Inspection Methods Engineer Assistant",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to the Inspection Methods Engineer Assistant API"}


@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """Process a query using the RAG system"""
    try:
        # Record metrics for monitoring
        record_query_metrics(request.query)
        
        # Process the query using the RAG system
        agent = InspectionAgent()
        response = agent.process_query(request.query)
        
        return QueryResponse(answer=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-image")
async def process_image(image_url: str):
    """Analyze an image using vision capabilities"""
    try:
        analysis_result = analyze_image(image_url)
        return {"analysis": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
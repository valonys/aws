from fastapi import FastAPI, HTTPException, Depends, Header
from typing import List, Dict, Any, Optional
import os
import json
from pathlib import Path

app = FastAPI(
    title="MCP Server",
    description="MCP server exposing standards/catalog tools",
    version="0.1.0",
)

# Simulated data paths
DATA_DIR = Path(__file__).parent / "data"
STANDARDS_FILE = DATA_DIR / "standards.json"
CATALOG_FILE = DATA_DIR / "catalog.json"
PROCEDURES_FILE = DATA_DIR / "procedures.json"
TOOLS_FILE = DATA_DIR / "tools.json"

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)

# Create empty data files if they don't exist
for file_path in [STANDARDS_FILE, CATALOG_FILE, PROCEDURES_FILE, TOOLS_FILE]:
    if not file_path.exists():
        with open(file_path, "w") as f:
            json.dump({"results": []}, f)


def verify_license(x_license_key: Optional[str] = Header(None)):
    """Verify the license key"""
    expected_key = os.environ.get("MCP_LICENSE_KEY")
    
    if not expected_key:
        # If no license key is set in the environment, skip verification
        return True
    
    if not x_license_key or x_license_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid or missing license key")
    
    return True


@app.get("/")
async def root():
    return {"message": "Welcome to the MCP Server API"}


@app.get("/api/standards/search")
async def search_standards(query: str, _=Depends(verify_license)):
    """Search for standards based on keywords"""
    try:
        with open(STANDARDS_FILE, "r") as f:
            data = json.load(f)
        
        # Filter standards based on query
        results = []
        for standard in data.get("results", []):
            # Simple search implementation
            if query.lower() in standard.get("title", "").lower() or \
               query.lower() in standard.get("description", "").lower() or \
               query.lower() in standard.get("id", "").lower():
                results.append(standard)
        
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/standards/{standard_id}")
async def get_standard_details(standard_id: str, _=Depends(verify_license)):
    """Get detailed information about a specific standard"""
    try:
        with open(STANDARDS_FILE, "r") as f:
            data = json.load(f)
        
        # Find the standard by ID
        for standard in data.get("results", []):
            if standard.get("id") == standard_id:
                return standard
        
        raise HTTPException(status_code=404, detail=f"Standard with ID {standard_id} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/catalog/search")
async def search_catalog(query: str, _=Depends(verify_license)):
    """Search the catalog for inspection tools and equipment"""
    try:
        with open(CATALOG_FILE, "r") as f:
            data = json.load(f)
        
        # Filter catalog items based on query
        results = []
        for item in data.get("results", []):
            # Simple search implementation
            if query.lower() in item.get("name", "").lower() or \
               query.lower() in item.get("description", "").lower() or \
               query.lower() in item.get("category", "").lower():
                results.append(item)
        
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/procedures/{procedure_id}")
async def get_inspection_procedure(procedure_id: str, _=Depends(verify_license)):
    """Get a specific inspection procedure"""
    try:
        with open(PROCEDURES_FILE, "r") as f:
            data = json.load(f)
        
        # Find the procedure by ID
        for procedure in data.get("results", []):
            if procedure.get("id") == procedure_id:
                return procedure
        
        raise HTTPException(status_code=404, detail=f"Procedure with ID {procedure_id} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/standards/catalog")
async def get_standards_catalog(_=Depends(verify_license)):
    """Get the full standards catalog"""
    try:
        with open(STANDARDS_FILE, "r") as f:
            data = json.load(f)
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/tools")
async def get_inspection_tools(_=Depends(verify_license)):
    """Get a list of available inspection tools"""
    try:
        with open(TOOLS_FILE, "r") as f:
            data = json.load(f)
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
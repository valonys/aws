from typing import Dict, Any, Callable

from app.deps import get_mcp_client


def get_available_tools() -> Dict[str, Callable]:
    """Get a dictionary of available tools for the agent"""
    return {
        "search_standards": search_standards,
        "get_standard_details": get_standard_details,
        "search_catalog": search_catalog,
        "get_inspection_procedure": get_inspection_procedure,
    }


def search_standards(params: Dict[str, Any]) -> Dict[str, Any]:
    """Search for standards based on keywords"""
    mcp_client = get_mcp_client()
    query = params.get("query", "")
    
    # Call the MCP client to search for standards
    results = mcp_client.search_standards(query)
    
    return {
        "standards": results
    }


def get_standard_details(params: Dict[str, Any]) -> Dict[str, Any]:
    """Get detailed information about a specific standard"""
    mcp_client = get_mcp_client()
    standard_id = params.get("standard_id", "")
    
    # Call the MCP client to get standard details
    details = mcp_client.get_standard_details(standard_id)
    
    return {
        "details": details
    }


def search_catalog(params: Dict[str, Any]) -> Dict[str, Any]:
    """Search the catalog for inspection tools and equipment"""
    mcp_client = get_mcp_client()
    query = params.get("query", "")
    
    # Call the MCP client to search the catalog
    results = mcp_client.search_catalog(query)
    
    return {
        "catalog_items": results
    }


def get_inspection_procedure(params: Dict[str, Any]) -> Dict[str, Any]:
    """Get a specific inspection procedure"""
    mcp_client = get_mcp_client()
    procedure_id = params.get("procedure_id", "")
    
    # Call the MCP client to get the inspection procedure
    procedure = mcp_client.get_inspection_procedure(procedure_id)
    
    return {
        "procedure": procedure
    }
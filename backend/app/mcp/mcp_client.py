from typing import Dict, Any, List, Optional
import requests


class MCPClient:
    """Client for interacting with the MCP server"""
    
    def __init__(self, host: str, port: int, license_key: Optional[str] = None):
        """Initialize the MCP client"""
        self.base_url = f"http://{host}:{port}"
        self.license_key = license_key
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        
        if license_key:
            self.headers["X-License-Key"] = license_key
    
    def search_standards(self, query: str) -> List[Dict[str, Any]]:
        """Search for standards based on keywords"""
        endpoint = f"{self.base_url}/api/standards/search"
        params = {"query": query}
        
        response = requests.get(endpoint, params=params, headers=self.headers)
        response.raise_for_status()
        
        return response.json()["results"]
    
    def get_standard_details(self, standard_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific standard"""
        endpoint = f"{self.base_url}/api/standards/{standard_id}"
        
        response = requests.get(endpoint, headers=self.headers)
        response.raise_for_status()
        
        return response.json()
    
    def search_catalog(self, query: str) -> List[Dict[str, Any]]:
        """Search the catalog for inspection tools and equipment"""
        endpoint = f"{self.base_url}/api/catalog/search"
        params = {"query": query}
        
        response = requests.get(endpoint, params=params, headers=self.headers)
        response.raise_for_status()
        
        return response.json()["results"]
    
    def get_inspection_procedure(self, procedure_id: str) -> Dict[str, Any]:
        """Get a specific inspection procedure"""
        endpoint = f"{self.base_url}/api/procedures/{procedure_id}"
        
        response = requests.get(endpoint, headers=self.headers)
        response.raise_for_status()
        
        return response.json()
    
    def get_standards_catalog(self) -> Dict[str, Any]:
        """Get the full standards catalog"""
        endpoint = f"{self.base_url}/api/standards/catalog"
        
        response = requests.get(endpoint, headers=self.headers)
        response.raise_for_status()
        
        return response.json()
    
    def get_inspection_tools(self) -> List[Dict[str, Any]]:
        """Get a list of available inspection tools"""
        endpoint = f"{self.base_url}/api/tools"
        
        response = requests.get(endpoint, headers=self.headers)
        response.raise_for_status()
        
        return response.json()["tools"]
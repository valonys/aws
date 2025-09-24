from typing import Dict, List, Any, Optional
from groq import Groq

from app.config import settings
from app.rag.retriever import retrieve_relevant_documents
from app.agents.tools_registry import get_available_tools


class InspectionAgent:
    """Agent for handling inspection-related queries"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.tools = get_available_tools()
    
    def process_query(self, query: str) -> str:
        """Process a user query and return a response"""
        # Retrieve relevant documents from the RAG system
        relevant_docs = retrieve_relevant_documents(query)
        
        # Prepare the context for the LLM
        context = self._prepare_context(query, relevant_docs)
        
        # Generate a response using the LLM
        response = self._generate_response(context)
        
        return response
    
    def _prepare_context(self, query: str, documents: List[Dict[str, Any]]) -> str:
        """Prepare the context for the LLM based on the query and retrieved documents"""
        context = f"User Query: {query}\n\nRelevant Information:\n"
        
        for i, doc in enumerate(documents):
            context += f"Document {i+1}: {doc['content']}\nSource: {doc['source']}\n\n"
        
        return context
    
    def _generate_response(self, context: str) -> str:
        """Generate a response using the LLM"""
        messages = [
            {"role": "system", "content": "You are an expert Inspection Methods Engineer Assistant. "
                                       "Your goal is to provide accurate and helpful information about inspection methods, "
                                       "standards, and procedures. Use the provided context to inform your responses."},
            {"role": "user", "content": context}
        ]
        
        # Call the Groq API
        response = self.client.chat.completions.create(
            model="llama3-8b-8192",
            messages=messages,
            temperature=0.3,
            max_tokens=1000,
        )
        
        return response.choices[0].message.content
    
    def execute_tool(self, tool_name: str, tool_input: Dict[str, Any]) -> Any:
        """Execute a tool by name with the given input"""
        if tool_name not in self.tools:
            raise ValueError(f"Tool '{tool_name}' not found")
        
        tool = self.tools[tool_name]
        return tool(tool_input)
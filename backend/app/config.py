import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file in project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))


class Settings:
    def __init__(self):
        # API Keys
        self.GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
        self.LANGWATCH_API_KEY: Optional[str] = os.getenv("LANGWATCH_API_KEY")
        
        # Database Configuration
        self.POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
        self.POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
        self.POSTGRES_DB: str = os.getenv("POSTGRES_DB", "inspection_assistant")
        self.POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
        self.POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))
        self.DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
        
        # Vector DB Configuration
        self.CHROMA_HOST: str = os.getenv("CHROMA_HOST", "chroma")
        self.CHROMA_PORT: int = int(os.getenv("CHROMA_PORT", "8000"))
        
        # MCP Server Configuration
        self.MCP_SERVER_HOST: str = os.getenv("MCP_SERVER_HOST", "mcp-server")
        self.MCP_SERVER_PORT: int = int(os.getenv("MCP_SERVER_PORT", "8000"))
        self.MCP_LICENSE_KEY: Optional[str] = os.getenv("MCP_LICENSE_KEY")
        
        # Application Configuration
        self.LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
        
        # Grafana Configuration
        self.GRAFANA_ADMIN_PASSWORD: Optional[str] = os.getenv("GRAFANA_ADMIN_PASSWORD", "admin")
        
        # Construct DATABASE_URL if not provided
        if not self.DATABASE_URL:
            self.DATABASE_URL = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"


settings = Settings()
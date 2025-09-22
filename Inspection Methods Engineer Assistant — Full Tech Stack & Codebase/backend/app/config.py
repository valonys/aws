import os
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file in project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))


class Settings(BaseSettings):
    # API Keys
    GROQ_API_KEY: str
    LANGWATCH_API_KEY: Optional[str] = None
    
    # Database Configuration
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "inspection_assistant"
    POSTGRES_HOST: str = "localhost"  # Changed from "postgres" to "localhost"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: Optional[str] = None
    
    # Vector DB Configuration
    CHROMA_HOST: str = "chroma"
    CHROMA_PORT: int = 8000
    
    # MCP Server Configuration
    MCP_SERVER_HOST: str = "mcp-server"
    MCP_SERVER_PORT: int = 8000
    MCP_LICENSE_KEY: Optional[str] = None
    
    # Application Configuration
    LOG_LEVEL: str = "INFO"
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Construct DATABASE_URL if not provided
        if not self.DATABASE_URL:
            self.DATABASE_URL = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"


settings = Settings()
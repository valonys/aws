from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from app.config import settings

# Create SQLAlchemy engine and session
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency for getting a database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_chroma_client():
    """Dependency for getting a ChromaDB client"""
    from chromadb import Client
    from chromadb.config import Settings as ChromaSettings
    
    chroma_client = Client(ChromaSettings(
        chroma_api_impl="rest",
        chroma_server_host=settings.CHROMA_HOST,
        chroma_server_http_port=settings.CHROMA_PORT
    ))
    
    return chroma_client


def get_mcp_client():
    """Dependency for getting an MCP client"""
    from app.mcp.mcp_client import MCPClient
    
    mcp_client = MCPClient(
        host=settings.MCP_SERVER_HOST,
        port=settings.MCP_SERVER_PORT,
        license_key=settings.MCP_LICENSE_KEY
    )
    
    return mcp_client
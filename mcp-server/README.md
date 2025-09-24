# MCP Server

This is the MCP (Methods, Catalog, and Procedures) server component of the Inspection Methods Engineer Assistant. It provides APIs for accessing inspection standards, catalogs, and procedures.

## Features

- Standards search and retrieval
- Catalog search for inspection tools and equipment
- Inspection procedures access
- License key verification

## API Endpoints

- `/api/standards/search` - Search for standards based on keywords
- `/api/standards/{standard_id}` - Get detailed information about a specific standard
- `/api/catalog/search` - Search the catalog for inspection tools and equipment
- `/api/procedures/{procedure_id}` - Get a specific inspection procedure
- `/api/standards/catalog` - Get the full standards catalog
- `/api/tools` - Get a list of available inspection tools

## Configuration

The server requires a license key for API access, which should be set in the environment variable `MCP_LICENSE_KEY`.

## Development

```bash
# Install dependencies
pip install -e .

# Run the server
uvicorn server:app --reload
```

## Docker

The server is containerized using Docker and can be run as part of the full stack using docker-compose.

```bash
docker compose up mcp-server
```
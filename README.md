# Corrosion Intelligence Platform

This repository houses the Corrosion Intelligence UI and API prototypes.

## Architecture

- **api/** – FastAPI application that brokers requests to AWS services.
- **ui/** – React application (Vite) that consumes the API.

## Backend expectations

The backend is responsible for:

1. Authenticating with AWS via standard credential providers (`aws configure`, IAM roles, or environment variables).
2. Serving corrosion dashboard data via HTTP endpoints for the UI.
3. Remaining stateless so it can be deployed on AWS App Runner, ECS, or other container platforms.

## Local development

### API

See [`api/README.md`](api/README.md) for detailed instructions.

Quick start:

```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### UI

See [`ui/README.md`](ui/README.md) for setup instructions.

```bash
cd ui
npm install
cp .env.example .env
npm run dev
```

With both services running, open the UI dev server and confirm that dashboard widgets load data from the API.

## Deployment notes

- Configure environment variables using your container platform's secret manager.
- Grant the API IAM permissions for the required S3 (or other AWS) resources.
- Enable HTTPS termination at the load balancer or service level (App Runner/ECS).

## Repository hygiene

- Never commit real AWS credentials.
- Use the provided `.env.example` files as documentation only.

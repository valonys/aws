# Corrosion Intelligence API

This directory contains a FastAPI service that fronts AWS data sources for the React UI.

## Features

- `GET /health` – lightweight health check for monitoring.
- `GET /dashboard/` – retrieves dashboard metrics and findings from Amazon S3.
  - Responds with typed JSON validated by Pydantic models (`summary`, `findings`, optional `error`).
- AWS SDK configuration via environment variables, shared credentials (`~/.aws`), or IAM roles.

## Getting started

1. Create a virtual environment and install dependencies:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. Copy the sample environment file and configure AWS details:

   ```bash
   cp .env.example .env
   ```

   Update the file with your preferred credential source:

   - Set `AWS_PROFILE` if you manage credentials with `aws configure`.
   - Or provide `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and optional `AWS_SESSION_TOKEN`.
   - Optionally set `DASHBOARD_BUCKET` and `DASHBOARD_KEY` to load JSON data from S3.

3. Run the development server:

   ```bash
   uvicorn app.main:app --reload
   ```

4. Test the endpoints:

   - http://localhost:8000/health
   - http://localhost:8000/dashboard/

## AWS permissions

The service requires read access to the S3 object referenced by `DASHBOARD_BUCKET` and `DASHBOARD_KEY`. Assign the minimal IAM policy, for example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::<your-bucket>/<your-key>"
    }
  ]
}
```

## Environment variables

| Variable | Description |
| --- | --- |
| `AWS_REGION` | AWS region to target. Optional when the profile specifies a region. |
| `AWS_PROFILE` | Named profile from `~/.aws/config`. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` | Explicit credentials (optional). |
| `AWS_ENDPOINT_URL` | Custom endpoint (e.g., LocalStack) for testing. |
| `DASHBOARD_BUCKET` | S3 bucket containing dashboard JSON data. |
| `DASHBOARD_KEY` | Object key for the dashboard JSON payload. |
| `API_TITLE` | Overrides the FastAPI title. |
| `API_VERSION` | Overrides the FastAPI version string. |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed browser origins (default: `http://localhost:5173`). |

## Running with Docker (optional)

A minimal development container can be started with:

```bash
docker run --rm -it \
  -p 8000:8000 \
  -v $(pwd):/app \
  --env-file .env \
  public.ecr.aws/docker/library/python:3.11-slim \
  bash -c "cd /app && pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port 8000"
```

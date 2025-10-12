# Corrosion Intelligence UI

This React application consumes the FastAPI backend located in `../api`.

## Prerequisites

- Node.js 18+
- Yarn or npm

## Environment configuration

The UI reads configuration from environment variables using Vite's `import.meta.env` object.

1. Copy the sample environment file and adjust values as needed:

   ```bash
   cp .env.example .env
   ```

2. Ensure the API base URL is reachable from the browser (defaults to `http://localhost:8000`). If you host the UI on a
   different origin, add it to `CORS_ALLOWED_ORIGINS` in `../api/.env` so browsers can call the API successfully.

## AWS credentials

The UI relies on the API to communicate with AWS. Provide credentials to the backend using one of the following approaches:

- **AWS CLI profiles** – run `aws configure` to store credentials in `~/.aws/credentials` and `~/.aws/config`. Set `AWS_PROFILE` in the API `.env` file to select a profile.
- **IAM roles** – when running inside AWS (e.g., EC2, ECS, or App Runner), attach an IAM role with the required permissions. The backend will automatically use the role's temporary credentials.
- **Environment variables / `.env` files** – populate the API `.env` file with `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and optional `AWS_SESSION_TOKEN`. The backend loads `.env` via `pydantic-settings`.

> **Important:** never commit real credentials. Use the provided `.env.example` files for documentation and keep actual secrets in `.env`, AWS Secrets Manager, or your deployment platform's secret store.

## Development workflow

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Ensure the FastAPI server is running (see `../api/README.md`) so API requests succeed.

## Replacing legacy mock data

The `src/data/dashboard.ts` module now calls the API's `/dashboard/` endpoint and normalizes the response. Remove any local mock data imports and use the exported `fetchDashboardData` helper in your React components:

```ts
import { useEffect, useState } from "react";
import { fetchDashboardData, DashboardResponse } from "../data/dashboard";

export function DashboardView() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    fetchDashboardData().then(setData).catch((error) => console.error(error));
  }, []);

  // render from `data`
}
```

## DocVision single-file analysis UI

The `src/docvision` directory contains a self-contained React experience for uploading PDFs/PPTX files, extracting their
contents with `pdfjs-dist`, `jszip`, `fast-xml-parser`, and optional OCR via `tesseract.js`, and forwarding structured
prompts to multimodal LLM providers (OpenAI, Gemini, xAI Grok, Alibaba Qwen). The entry point is the `DocVisionApp`
component, exported from `src/docvision/index.ts`.

Key characteristics:

- **Modular data pipeline** – parsing, OCR, prompt construction, and provider adapters live in dedicated modules to keep the
  React tree lightweight.
- **Resilient UX** – drag-and-drop uploads, removable file list, timestamped activity log, and inline progress banner make it
  easier to understand extraction steps and troubleshoot failures.
- **Provider flexibility** – API keys persist in local storage only; adapters use simple `fetch` calls so you can swap in
  official SDKs or proxy calls through your backend for CORS control.

To embed it in the existing UI, import the component where appropriate (for instance, a new route or tab) and ensure the
dependencies are installed:

```bash
npm install pdfjs-dist tesseract.js jszip fast-xml-parser
```

```tsx
import { DocVisionApp } from "./docvision";

export default function AnalysisRoute() {
  return <DocVisionApp />;
}
```

# VaLTwin InspectorEngineer UI

This package contains the TypeScript + React single-page application for the VaLTwin inspection platform. It translates the Streamlit prototype direction into a production-ready web UI with the requested brand styling, AWS orchestration hooks, and AI copilot experience.

## Features

- **Modern layout** – Responsive dashboard with navigation sidebar, executive metrics, and actionable workstream tracking.
- **Brand styling** – Tw Cen MT typography, hero logo placement on the top-left with the "AI Beyond Compare" tagline, and rich gradients for a polished command-center feel.
- **AI copilot** – Conversational panel seeded with operator/copilot dialogue and avatars to demonstrate the inspection workflow.
- **AWS awareness** – Callouts for App Runner deployment region, IAM role context, and CTA for syncing with AWS services.
- **Maintainable codebase** – Vite + TypeScript tooling, ESLint/Prettier configuration, and componentized architecture.

## Getting Started

```bash
cd ui
npm install
npm run dev
```

Visit `http://localhost:5173` to view the dashboard. The development server supports hot module replacement for rapid iteration.

### Build for Production

```bash
npm run build
npm run preview
```

The build output is emitted to `dist/` and can be served from AWS S3 + CloudFront, an App Runner service, or containerized alongside backend APIs.

## Project Structure

```
ui/
├── src/
│   ├── components/    # Presentation components and layout sections
│   ├── data/          # Mock data models until AWS integrations are wired
│   ├── styles/        # Global theme and responsive utilities
│   └── App.tsx        # Main layout composition
├── public/            # (optional) Static assets
├── index.html         # Font imports and root mounting point
└── package.json       # Tooling (Vite, React, TypeScript, ESLint, Prettier)
```

## Next Steps

1. Replace mock data in `src/data/dashboard.ts` with API calls to your FastAPI backend or AWS AppSync endpoints.
2. Wire the **Sync with AWS** CTA to trigger inspection data refresh through API Gateway or App Runner services.
3. Integrate authentication (e.g., Amazon Cognito) and role-based access control for inspection teams.
4. Extend the Copilot panel with real-time Bedrock/SageMaker inference using WebSockets or server-sent events.
5. Capture analytics via Amazon Pinpoint or CloudWatch RUM to monitor operator engagement.

With AWS credentials available, you can build deployment automation through GitHub Actions to containerize this UI and ship to App Runner or ECS Fargate in line with the broader platform roadmap.

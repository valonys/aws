# Corrosion Intelligence Platform – Repository Guide

This repository is currently in the planning phase for the Corrosion Intelligence Platform. The initial workstream is captured in [`PROTOTYPE_ITERATION_PLAN.md`](PROTOTYPE_ITERATION_PLAN.md). As implementation begins, this README provides orientation for new contributors and outlines the expected project structure, key subsystems, and recommended next steps for onboarding.

## Repository Layout

```
/
├── PROTOTYPE_ITERATION_PLAN.md   # Iteration roadmap and deliverables
└── README.md                     # Repository orientation for new contributors
```

Additional directories (e.g., `api/`, `ui/`, `infrastructure/`) will be introduced as features from the iteration plan are implemented.

## Implementation Status

- **`ui/` – VaLTwin InspectorEngineer UI**: Production-ready React + TypeScript dashboard aligned with the Streamlit prototype guidance. It includes AWS-aware callouts, AI copilot interactions, and polished theming. Refer to [`ui/README.md`](ui/README.md) for local development and integration notes.

## Planned Architecture Overview

The project targets an end‑to‑end platform for analyzing corrosion findings, generating reports, and delivering them through a web UI. The iteration plan identifies four major workstreams:

1. **Report Layout & Rendering** – Extend report generation to produce image‑first finding cards, synchronize UI and PDF outputs, and enrich `render_blocks` with new block types (`image`, `metric`, `callout`, `li`).
2. **Model Strategy** – Start with Retrieval‑Augmented Generation (RAG) using existing structured report data, with a decision point for potential fine‑tuning using AWS Bedrock or SageMaker if stricter tone/taxonomy control is needed.
3. **Deployment** – Prepare a low/medium‑scale AWS deployment path (App Runner or ECS Fargate) with containerized FastAPI and Streamlit services, CI/CD, and monitoring guardrails.
4. **UI/UX Polish** – Address Streamlit deprecations, implement expandable findings, severity badges, avatars, and general accessibility/readability improvements.

## Working Expectations

- **Backend & Report Generation**: Python services (FastAPI) will orchestrate ingestion, RAG prompts, and PDF creation. Expect modules dedicated to report rendering (`enhanced_report_generator.py`) and PDF output.
- **Frontend/UI**: Streamlit will serve the operator dashboard, with components for image‑first cards, expanders, and chat interactions.
- **ML Components**: Retrieval pipelines will leverage existing datasets. Optional fine‑tuning would involve Bedrock models or SageMaker vision classifiers.
- **Infrastructure**: Containerized services deployed via App Runner or ECS. GitHub Actions will handle build/push/deploy workflows.

## Getting Started

1. **Review the Iteration Plan** – Understand immediate deliverables, acceptance criteria, and milestones.
2. **Establish Development Environments** – Set up Python environments for backend/UI work, along with AWS credentials for experimentation with Bedrock/SageMaker.
3. **Prototype Report Blocks** – Begin drafting data structures for the new `render_blocks` elements and ensure parity between UI and PDF renderers.
4. **Experiment with RAG Prompts** – Assemble a mini‑corpus from historical reports to validate grounding strategies before considering fine‑tuning.
5. **Plan Deployment Templates** – Draft Dockerfiles and IaC skeletons (e.g., Terraform modules) aligned with the App Runner or ECS strategy.

## Suggested Learning Path

- **Streamlit Layout & State Management** – Focus on responsive two‑column layouts, expanders, and session state.
- **Report Rendering & PDF Generation** – Study libraries like PyMuPDF or ReportLab to support the enhanced PDF layout.
- **AWS Bedrock & SageMaker Basics** – Understand capabilities, pricing, and deployment patterns to make the RAG vs. fine‑tuning decision.
- **AWS Deployment Services** – Compare App Runner and ECS Fargate for containerized applications, including networking, IAM, and cost considerations.
- **CI/CD with GitHub Actions** – Prepare reusable workflows for building and deploying Docker images.

## Next Steps for Contributors

- Align with stakeholders on the preferred deployment path (App Runner vs. ECS).
- Gather anonymized historical reports to populate the evaluation corpus.
- Begin implementing the `render_blocks` enhancements and coordinating UI/PDF parity.
- Set up cost monitoring (CloudWatch, Budgets) early to avoid surprises during the pilot.

For any questions, consult the iteration plan or reach out to project leads to confirm priorities and data availability.

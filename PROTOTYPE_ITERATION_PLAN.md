# Prototype Iteration Plan – Corrosion Intelligence Platform

Last updated: {{DATE}}

## Goals
- Improve report presentation: image-first findings with clear descriptions.
- Decide if a specialized fine‑tuned model is needed (Bedrock / SageMaker).
- Prepare a low–medium scale deployment path on AWS with cost awareness.
- Polish overall UI/UX: expanders, toggles, avatars; fix deprecations.

---

## 1 Report Layout – Image‑First Findings With Clear Descriptions

### What to ship
- Per‑image finding cards:
  - Thumbnail + unique ID (e.g., `IMG_012_P04_03`) and page number.
  - Severity badge (CRITICAL/HIGH/MEDIUM/LOW) and corrosion type.
  - Key observations (bulleted), confidence score, and location.
  - “Related images” expander: similar/nearby frames on same page.
- Grouping & order:
  - Group by page. Within a page, order by severity (CRITICAL → LOW).
  - “Highlights” section: top 3 high‑severity findings at the top.
- Cross‑references:
  - Jump‑to anchor in UI and linkable anchors in PDF (same image IDs).

### PDF support (render_blocks)
- Extend `render_blocks` to include:
  - `image` (with caption), `metric` (label/value), `callout` (highlight), `li` (bullets).
- Update PDF renderer to place image on left, description on right; wrap long text; avoid truncation.

### Acceptance criteria
- 100% of images have an ID, severity, type, and at least 2–3 observations.
- UI and PDF both display the same per‑image cards.
- No truncation in PDF; headings, captions, and bullets are legible.

### Action items
- Add new block types in `enhanced_report_generator.py` and map them in the PDF renderer.
- In Streamlit, switch to a two‑column layout (image | details) with severity‑sorted sections.
- Implement anchors and “related images” expander.

---

## 2 Model Strategy – RAG vs. Fine‑Tuned Model on Bedrock

### Start with RAG + prompt engineering
- Ground LLM responses with structured report data (sections, findings, images) to reduce hallucinations.
- Enforce schema‑aware prompts (e.g., “use only fields from executive_summary, findings_matrix, image_gallery”).

### When to fine‑tune
- If summaries must follow a strict enterprise tone/template beyond RAG, or if corrosion taxonomy needs domain‑specific language.

### Options
- Bedrock text models (summarization/style):
  - Prefer Amazon Titan Text for customization where available.
  - Dataset: 100–1,000 curated report → summary pairs (exec summaries, risk notes).
- Vision classification (optional, for corrosion type/severity cues):
  - Train small detector/classifier in SageMaker (YOLOv8/Detectron2) using extracted images.
  - Host as SageMaker real‑time endpoint; keep Nova/Titan for narrative.

### Evaluation
- Text: ROUGE/BERTScore against curated summaries; style adherence rubric.
- Vision: precision/recall per corrosion type; confusion matrix.
- Gate: If RAG meets thresholds, defer fine‑tuning to later.

### Cost sketch (pilot)
- Bedrock text inference (Nova/Titan): <$100/mo at light usage.
- SageMaker real‑time endpoint (small instance): ~$40–$80/mo.
- One‑off customization jobs: from a few hundred to a few thousand depending on volume.

### Action items
- Build a labeled mini‑corpus from past reports (anonymized if needed).
- Add an evaluation notebook and CI check for summary quality and vision tagging.
- Decide go/no‑go for fine‑tuning after RAG baseline.

---

## 3 Deployment – Low/Medium‑Scale Pilot on AWS

### Option A (fastest): AWS App Runner
- Containerize API (FastAPI) and UI (Streamlit). One service each or combined.
- Pros: TLS, autoscaling, GitHub CI/CD; minimal ops.
- Cost: ~ $30–$80/mo at idle/low load.

### Option B (more control): ECS Fargate + ALB
- Services: `api` (FastAPI), `ui` (Streamlit), optional `worker` for async jobs.
- VPC private subnets; NAT for egress; ALB for routing; Cognito for auth.
- Cost: ~ $50–$150/mo at low load.

### Shared components
- S3 + CloudFront for static assets; CloudWatch Logs & Metrics; optional X‑Ray.
- IAM roles per service; WAF (optional) on ALB.
- Secrets: AWS Secrets Manager / Parameter Store.

### CI/CD
- GitHub Actions → build Docker → ECR → deploy to App Runner/ECS.
- Staging and prod with environment configs; canary deploys.

### Guardrails
- CloudWatch Alarms & Budgets; tagging for cost allocation; lifecycle policies for S3.

### Action items
- Author Dockerfiles for API/UI; add health endpoints.
- Create IaC (SAM/CDK/Terraform) or minimal console setup for the pilot.
- Add GitHub Actions workflows for build/push/deploy.

---

## 4 UI/UX – Expanders, Arrows, Avatars, Deprecations

### Fixes & polish
- Replace deprecated Streamlit usage:
  - `use_container_width` → `width='stretch'` or `width='content'` per warnings.
  - Pandas `Styler.applymap` → `Styler.map`.
- Expanders & arrows:
  - Keep nesting shallow (≤2 levels); consistent titles like “Image IMG_012_P04_03 — HIGH”.
  - Persist open/closed state via `st.session_state`.
- Chat avatars (from DigiTwin repo):
  - Add assistant avatar (DigiTwin) and user avatar/initials in chat bubbles.
  - Show small muted caption (context: general/report; model used).
- Accessibility & readability:
  - Increase heading sizes; consistent spacing; severity color tokens (🟥 🟧 🟨 🟩).
  - Keyboard focus visible on expanders and buttons.

### Action items
- Sweep the UI for deprecations, replace params accordingly.
- Implement avatars and bubble styling in the chat tab.
- Align spacing, font sizes, and color tokens across tabs.

---

## Milestones & Ownership
- M1 (Week 1): Image‑first cards + render_blocks; minimal deployment (App Runner).
- M2 (Week 2): RAG hardening; evaluation harness; UI/UX polish (expanders, avatars).
- M3 (Week 3): Optional fine‑tune decision; ECS path if needed; user pilot.

## Risks & Mitigations
- Textract format issues → PyMuPDF fallback (already in place); log and surface errors.
- Hallucinations → stricter grounding + schema prompts; response validators.
- Cost creep → budgets/alarms; smallest viable instances; turn off unused endpoints.

## Quick Checklist
- [ ] Per‑image cards (UI + PDF) with anchors.
- [ ] Enhanced render_blocks (`image`, `metric`, `callout`).
- [ ] RAG prompts grounded to schema; eval notebook added.
- [ ] App Runner deployment + GitHub Actions CI/CD.
- [ ] UI: deprecations fixed; expanders polished; avatars added.

---

Questions or approvals needed:
- Confirm preferred deployment path (App Runner vs ECS) for the pilot.
- Approve use of DigiTwin avatars in production UI.
- Provide sample curated reports (anonymized) for RAG/eval and optional fine‑tuning.

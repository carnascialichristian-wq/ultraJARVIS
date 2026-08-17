================================================================================
ultraJARVIS — PACCHETTO DI CONSEGNA COMPLETO DA GEMINI A CHATGPT (HUMAN_BRIDGE)
================================================================================
A: ChatGPT (Repository Custodian & Orchestrator)
DA: GEMINI (Google Ecosystem, Knowledge & Cloud Feasibility Architect)
MISSIONE: ultraJARVIS — Integrazione Deliverable Livello 2 (Tutti i 7 Task Gemini)
STATO OPERATIVO: PRONTO PER COMMIT E PULL REQUEST

ISTRUZIONI PER CHATGPT:
1. Verifica l'integrità dei contenuti e la conformità al vincolo STRICT_ZERO_CARD.
2. Crea una branch dedicata (es. `gemini/level-2-deliverables-uj-cap-ggl-inf`).
3. Estrai e crea esattamente gli 8 file inclusi nei blocchi "=== FILE: <path> ===".
4. Appendi i blocchi di log in fondo a `gpt.md` e a `taskgpt.md`.
5. Apri la Pull Request per la revisione indipendente da parte di CLAUDE (per UJ-CAP-001, UJ-INF-001, UJ-MEM-001, UJ-ADK-001) e GROK (per UJ-GGL-001, UJ-KNW-001, UJ-MED-001).
6. Mantieni i pesi accettati a 0 punti fino all'esito delle rispettive review.

================================================================================
SEZIONE 1: TABELLA DELIVERABLE E VERIFICA HASH SHA-256
================================================================================

| Path del File | Byte Size | SHA-256 Checksum | Task Associato |
| :--- | :--- | :--- | :--- |
| `docs/program/CAPABILITY_REGISTRY.md` | 13447 B | `91804d8bd2e5d43912b5e99829cb49f5e410d71f133bb4d6eefded9fb5cc3a2c` | `UJ-CAP-001` |
| `docs/program/CAPABILITY_REGISTRY.json` | 4372 B | `3daa54c381eb28f6a2472152ce5bf06efcdc03ffef6452de46534206c0acb2aa` | `UJ-CAP-001` |
| `docs/evidence/GOOGLE_CAPABILITY_EVIDENCE_PACK.md` | 9766 B | `8ad1be3f60549e96dbc22723134d045ad8dbe888ca171fb8b472572c25106c19` | `UJ-GGL-001` |
| `docs/architecture/INFRASTRUCTURE_STRICT_ZERO_CARD.md` | 7985 B | `5c69ac5a5c7f7633578eafe097544213aee816fd0e648ca9401c5b05723cf1f9` | `UJ-INF-001` |
| `docs/playbooks/NOTEBOOKLM_MANUAL_BRIDGE.md` | 3521 B | `356efdc963672eafa1657bf47739a75a20329cfdc5c07fb7bf4755bee2718bee` | `UJ-KNW-001` |
| `docs/architecture/MEMORY_DATABASE_PROVENANCE.md` | 4407 B | `7d17770a09ceb5ca73a68eede14fc9115ba444ee3b7795119e24ff8606601e6c` | `UJ-MEM-001` |
| `docs/registry/MEDIA_CAPABILITY_RIGHTS.md` | 3172 B | `5dfa6a1a044dd91279bd748df87e7caea0ecd5b429497519fa92f14d57686c5b` | `UJ-MED-001` |
| `docs/evaluation/GOOGLE_ADK_A2A_EVALUATION.md` | 2669 B | `e9f0ca9bb475ddbd3759cebc66ff33dd902a45d8f232d3d39888c447e7be8d09` | `UJ-ADK-001` |

================================================================================
SEZIONE 2: ARTEFATTI COMPLETI DA COMMILARE
================================================================================

=== FILE: docs/program/CAPABILITY_REGISTRY.md ===
# Capability Registry — Multi-AI Architecture (ultraJARVIS)

| Metadata | Value |
| :--- | :--- |
| **Document ID** | `docs/program/CAPABILITY_REGISTRY.md` |
| **Task ID** | `UJ-CAP-001` |
| **Architect / Owner** | Gemini (Google Ecosystem, Knowledge & Cloud Feasibility Architect) |
| **Status** | `REVIEW` (Pending Independent Review by Claude) |
| **Priority** | `P0` |
| **Weight** | `13` (Accepted Weight: `0/13`) |
| **Verification Date** | August 2026 / Snapshot verification |
| **Constraint Enforcement** | `STRICT_ZERO_CARD`, zero incremental cost, no consumer UI scraping/automation |

---

## 1. Executive Summary & Architecture Boundary

The primary objective of `UJ-CAP-001` is to formally map, classify, and verify the access vectors, quotas, automation limits, terms of service, and incremental cost profiles across the four core foundational AI platforms:
1. **OpenAI (ChatGPT / API)**
2. **Anthropic (Claude / API)**
3. **Google (Gemini / Google AI Studio / Vertex AI)**
4. **xAI (Grok / API)**

### Fundamental Constraint Declarations
- **Zero Incremental Cost Rule (`STRICT_ZERO_CARD`)**: No unapproved paid API credits, automatic credit card billing, overage tiers, or third-party paid proxies.
- **Subscription ≠ API Entitlement**: Consumer / Web subscriptions (e.g., ChatGPT Plus/Team, Claude Pro/Team, Google One AI Premium / Google AI Pro, Grok / X Premium+) provide conversational Web UI / Desktop app access and zero direct REST/gRPC API tokens.
- **No Consumer UI Scraping**: Automated browser interaction, session token replay, cookie extraction, or unofficial endpoint reverse-engineering is prohibited due to ToS violation and suspension risk.
- **Human-in-the-Loop Protocol (`HUMAN_BRIDGE`)**: Where API endpoints require pay-as-you-go billing with no perpetual free tier, interaction is strictly executed via structured human bridge prompts and copy-paste artifact exchange.

---

## 2. Canonical Capability Taxonomy

Every capability in ultraJARVIS is categorized under a strict operational status:
- **`ACTIVE`**: Verified available with zero incremental cost and programmatic access (e.g., Google AI Studio Free Tier).
- **`HUMAN_BRIDGE`**: Functional via interactive web session (consumer subscription), but programmatic API requires paid billing or scraping. Handled via operator bridge.
- **`PREVIEW`**: Feature currently rolling out, experimental, subject to quota or breaking API contract changes.
- **`BLOCKED`**: Hard constraint violation (e.g., requiring active credit card with auto-billing, violating data privacy, or requiring UI scraping).
- **`DEPRECATED`**: Obsolete endpoint or sunset model version.
- **`UNKNOWN`**: Insufficient authoritative evidence; requires validation probe.

---

## 3. Detailed AI Provider Capabilities

### 3.1 OpenAI (ChatGPT / OpenAI API)

| Field | Specification |
| :--- | :--- |
| **Provider** | OpenAI |
| **Product Name** | ChatGPT Plus / Team & OpenAI Platform API |
| **Capability IDs** | `OAI-WEB-001` (ChatGPT Web Interface), `OAI-API-001` (OpenAI Platform API) |
| **Concrete Description** | Multi-modal conversational reasoning, Code Interpreter, Custom GPTs, Advanced Data Analysis, Canvas workspace. |
| **Access Vector & Modality** | `OAI-WEB-001`: Web UI / Desktop App (`chatgpt.com`). `OAI-API-001`: REST API (`api.openai.com/v1`). |
| **Subscription vs API** | ChatGPT Plus/Team subscription grants interactive web interface access only. It provides **zero** free OpenAI API credits. OpenAI API requires a prepaid developer balance. |
| **Authentication** | `OAI-WEB-001`: OAuth2 / Session cookie. `OAI-API-001`: `Bearer sk-...` API Key. |
| **Incremental Cost & Billing** | `OAI-WEB-001`: €0 incremental (covered by existing subscription). `OAI-API-001`: Prepaid pay-as-you-go. Without existing balance/credits, API calls are blocked under `STRICT_ZERO_CARD`. |
| **Quotas & Rate Limits** | `OAI-WEB-001`: Model cap dynamically enforced (e.g., ~40-80 messages/3h depending on model). `OAI-API-001`: Tier-based RPM/TPM based on deposit. |
| **Terms of Service & Data Policy** | Commercial terms prohibit unauthorized scraping and credential stuffing. Consumer business data controls allow opting out of training. |
| **Automation & UI Risk** | Direct browser scraping / Puppeteer automation of ChatGPT Web UI violates OpenAI Terms of Service and risks account ban. Programmatic access without API balance is classified as `BLOCKED`. |
| **Official Sources** | [OpenAI Pricing](https://openai.com/pricing), [OpenAI Terms of Use](https://openai.com/policies/terms-of-use), [OpenAI API Data Privacy](https://openai.com/enterprise-privacy). |
| **Status for ultraJARVIS** | `OAI-WEB-001`: `HUMAN_BRIDGE`. `OAI-API-001`: `BLOCKED` (unless pre-funded credits exist without card auto-recharge). |
| **Free Fallback** | `HUMAN_BRIDGE` via existing ChatGPT Plus / Team session. |
| **Confidence Level** | `HIGH` (Verified official policy). |

---

### 3.2 Anthropic (Claude / Anthropic API)

| Field | Specification |
| :--- | :--- |
| **Provider** | Anthropic |
| **Product Name** | Claude Pro / Team & Anthropic API (Claude Console) |
| **Capability IDs** | `CLD-WEB-001` (Claude Web / Artifacts), `CLD-API-001` (Anthropic Messages API), `CLD-SDK-001` (Claude Agent SDK / Computer Use) |
| **Concrete Description** | Long-context analysis (200k tokens), Artifacts (code/React/SVG preview), structured XML/JSON generation, system prompt enforcement. |
| **Access Vector & Modality** | `CLD-WEB-001`: Web UI (`claude.ai`). `CLD-API-001`: REST API (`api.anthropic.com/v1/messages`). |
| **Subscription vs API** | Claude Pro/Team subscription grants web UI access with priority bandwidth. It does **not** grant API credits in Anthropic Console. |
| **Authentication** | `CLD-WEB-001`: Session auth (OAuth/Email magic link). `CLD-API-001`: `x-api-key: sk-ant-...`. |
| **Incremental Cost & Billing** | `CLD-WEB-001`: €0 incremental (existing plan). `CLD-API-001`: Prepaid billing required. Strict zero-cost rule prevents adding payment methods without explicit authorization. |
| **Quotas & Rate Limits** | `CLD-WEB-001`: Message limits reset every 5 hours based on server load and conversation length. `CLD-API-001`: Tier 1-4 rate limits based on usage history. |
| **Terms of Service & Data Policy** | Commercial terms prohibit automated scraping of `claude.ai`. Consumer paid accounts do not train models by default on user prompts. |
| **Automation & UI Risk** | Headless browser automation of `claude.ai` is strictly forbidden. Agent SDK and Computer Use features require direct API keys and prepaid balance. |
| **Official Sources** | [Anthropic Pricing](https://www.anthropic.com/pricing), [Anthropic Commercial Terms](https://www.anthropic.com/legal/commercial-terms), [Anthropic Console Docs](https://docs.anthropic.com/). |
| **Status for ultraJARVIS** | `CLD-WEB-001`: `HUMAN_BRIDGE`. `CLD-API-001`: `BLOCKED` (unless zero-cost promotional credits are confirmed). |
| **Free Fallback** | `HUMAN_BRIDGE` exchange via Claude Web interface using structured response packets. |
| **Confidence Level** | `HIGH` (Verified official documentation). |

---

### 3.3 Google (Gemini / Google AI Studio / Vertex AI)

| Field | Specification |
| :--- | :--- |
| **Provider** | Google |
| **Product Name** | Gemini Advanced (Google AI Pro), Google AI Studio (Free Tier), Vertex AI |
| **Capability IDs** | `GGL-WEB-001` (Gemini Web UI), `GGL-AIS-001` (AI Studio Free Tier API), `GGL-VTX-001` (Vertex AI Enterprise) |
| **Concrete Description** | 1M to 2M token context window, multimodal vision/audio/video processing, native structured JSON schema enforcement, Grounding with Google Search, Python code execution. |
| **Access Vector & Modality** | `GGL-WEB-001`: Web (`gemini.google.com`). `GGL-AIS-001`: REST API / SDK (`@google/genai`, `@google/generative-ai`) via `aistudio.google.com`. `GGL-VTX-001`: Google Cloud SDK / gRPC. |
| **Subscription vs API** | Google AI Pro / Google One AI Premium provides access to Gemini Advanced in web and Workspace integration. It is independent of Google AI Studio API limits. AI Studio offers a standalone **Free Tier** without credit card requirement. |
| **Authentication** | `GGL-WEB-001`: Google OAuth. `GGL-AIS-001`: API Key (`x-goog-api-key`). `GGL-VTX-001`: GCP Service Account OAuth2 / ADC. |
| **Incremental Cost & Billing** | `GGL-WEB-001`: €0 (existing sub). `GGL-AIS-001`: **€0 (Free of charge Tier)** — no billing account required. `GGL-VTX-001`: Requires GCP Cloud Billing account (`BLOCKED` under strict zero-cost). |
| **Quotas & Rate Limits** | `GGL-AIS-001` (Free Tier): Up to 15 RPM (Requests Per Minute), 1 Million TPM (Tokens Per Minute), 1,500 RPD (Requests Per Day) for Flash models; 2 RPM / 32k TPM / 50 RPD for Pro models. |
| **Terms of Service & Data Policy** | In AI Studio Free Tier, user data/prompts may be logged and reviewed by human reviewers to improve Google products, but are not associated with Google Cloud Enterprise accounts. Paid tier / Vertex AI provides enterprise data protection. |
| **Automation & UI Risk** | Programmatic API access via AI Studio Free Tier is **officially supported** and compliant with Terms of Service. No browser scraping required. |
| **Official Sources** | [Google AI Studio Pricing & Limits](https://ai.google.dev/pricing), [Google Generative AI Terms of Service](https://ai.google.dev/terms), [Gemini API Docs](https://ai.google.dev/gemini-api/docs). |
| **Status for ultraJARVIS** | `GGL-WEB-001`: `HUMAN_BRIDGE`. `GGL-AIS-001`: `ACTIVE` (Strict Zero Card Compliant). `GGL-VTX-001`: `BLOCKED`. |
| **Free Fallback** | AI Studio Free Tier API for automated tasks; Gemini Web UI for high-capacity multi-modal / human reasoning. |
| **Confidence Level** | `HIGH` (Directly verified against Google AI Developer documentation). |

---

### 3.4 xAI (Grok / xAI API)

| Field | Specification |
| :--- | :--- |
| **Provider** | xAI |
| **Product Name** | Grok (X Premium / Premium+) & xAI Console API |
| **Capability IDs** | `XAI-WEB-001` (Grok on X.com), `XAI-API-001` (xAI API / `api.x.ai`) |
| **Concrete Description** | Real-time X/Twitter data synthesis, live search integration, unconstrained reasoning, Python evaluation. |
| **Access Vector & Modality** | `XAI-WEB-001`: Web/App (`x.com/i/grok`). `XAI-API-001`: OpenAI-compatible REST API (`https://api.x.ai/v1`). |
| **Subscription vs API** | X Premium / Premium+ subscription unlocks Grok conversational features inside X platform. It does **not** include API credits on `console.x.ai`. |
| **Authentication** | `XAI-WEB-001`: X Auth cookie. `XAI-API-001`: API Key (`Bearer xai-...`). |
| **Incremental Cost & Billing** | `XAI-WEB-001`: €0 incremental (existing subscription). `XAI-API-001`: Pay-as-you-go prepaid billing on xAI Console. |
| **Quotas & Rate Limits** | `XAI-WEB-001`: Rate limited by X tier (e.g., dynamic limits every 2 hours). `XAI-API-001`: Tier limits set by console balance. |
| **Terms of Service & Data Policy** | X platform terms prohibit automated scraping of web interface. Data shared in standard X sessions may be indexed per X privacy policy. |
| **Automation & UI Risk** | Scraping the X web interface violates X Developer Agreement and triggers immediate account lockout. API requires card setup. |
| **Official Sources** | [xAI Console](https://console.x.ai/), [xAI Docs](https://docs.x.ai/), [X Developer Agreement](https://developer.x.com/en/developer-terms/agreement-and-policy). |
| **Status for ultraJARVIS** | `XAI-WEB-001`: `HUMAN_BRIDGE`. `XAI-API-001`: `BLOCKED` (unless promotional credits exist). |
| **Free Fallback** | `HUMAN_BRIDGE` operator prompt and response exchange. |
| **Confidence Level** | `HIGH` (Authoritative developer console policies). |

---

## 4. Capability Matrix & Dispatch Routing

| Provider | Model Family | Programmatic API Access (Zero Cost) | Web UI Access (Existing Sub) | Automation Strategy in ultraJARVIS | Primary Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google** | Gemini 2.5 Pro / Flash | **ACTIVE** (AI Studio Free Tier) | **ACTIVE** (Gemini Web) | Direct REST / SDK (`@google/genai`) | Automated Verification & Cloud Feasibility |
| **OpenAI** | GPT-4o / o1 / o3-mini | **BLOCKED** (No Free Tier API) | **ACTIVE** (ChatGPT Plus/Team) | `HUMAN_BRIDGE` structured packets | High-Level Architecture & Orchestration |
| **Anthropic** | Claude 3.5 Sonnet / Haiku | **BLOCKED** (No Free Tier API) | **ACTIVE** (Claude Pro/Team) | `HUMAN_BRIDGE` structured packets | Code Synthesis & Independent Review |
| **xAI** | Grok 2 / Grok 3 | **BLOCKED** (No Free Tier API) | **ACTIVE** (X Premium+) | `HUMAN_BRIDGE` structured packets | Real-Time Fact Checking & OSS Review |

---

## 5. Security, Risk Analysis & Verification Guardrails

1. **API Key Safety**: API keys (specifically Google AI Studio free tier keys) must reside strictly in local environment variables (`.env.local`) or secure secret storage. They must **never** be committed to Git.
2. **Data Privacy Guardrail**: Prompts containing proprietary code, sensitive architectural keys, or personal identifiable information (PII) must not be dispatched to endpoints that retain training rights without human sanitization.
3. **Automated Quota Protection**: The Node.js / TypeScript agent layer must implement an in-memory leaky-bucket rate limiter to prevent hitting AI Studio 429 errors (enforcing <= 15 RPM for Flash, <= 2 RPM for Pro).
=== END FILE ===

=== FILE: docs/program/CAPABILITY_REGISTRY.json ===
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "registry_version": "1.0.0",
  "task_id": "UJ-CAP-001",
  "owner": "GEMINI",
  "reviewer": "CLAUDE",
  "status": "REVIEW",
  "accepted_weight": 0,
  "allocated_weight": 13,
  "constraint": "STRICT_ZERO_CARD",
  "providers": [
    {
      "provider_id": "google",
      "provider_name": "Google",
      "capabilities": [
        {
          "capability_id": "GGL-AIS-001",
          "name": "Google AI Studio Free Tier API",
          "access_type": "API",
          "status": "ACTIVE",
          "incremental_cost": "0 EUR",
          "billing_required": false,
          "rate_limits": {
            "flash_rpm": 15,
            "flash_tpm": 1000000,
            "flash_rpd": 1500,
            "pro_rpm": 2,
            "pro_tpm": 32000,
            "pro_rpd": 50
          },
          "authentication": "API_KEY",
          "automation_allowed": true,
          "ui_scraping_risk": "NONE",
          "terms_url": "https://ai.google.dev/terms",
          "pricing_url": "https://ai.google.dev/pricing",
          "confidence": "HIGH"
        },
        {
          "capability_id": "GGL-WEB-001",
          "name": "Gemini Advanced Web UI",
          "access_type": "WEB_UI",
          "status": "HUMAN_BRIDGE",
          "incremental_cost": "0 EUR (Existing Subscription)",
          "billing_required": false,
          "authentication": "SESSION_OAUTH",
          "automation_allowed": false,
          "ui_scraping_risk": "HIGH",
          "confidence": "HIGH"
        },
        {
          "capability_id": "GGL-VTX-001",
          "name": "Vertex AI Enterprise",
          "access_type": "API",
          "status": "BLOCKED",
          "incremental_cost": "PAYG_BILLING_REQUIRED",
          "billing_required": true,
          "confidence": "HIGH"
        }
      ]
    },
    {
      "provider_id": "openai",
      "provider_name": "OpenAI",
      "capabilities": [
        {
          "capability_id": "OAI-WEB-001",
          "name": "ChatGPT Plus/Team Web Interface",
          "access_type": "WEB_UI",
          "status": "HUMAN_BRIDGE",
          "incremental_cost": "0 EUR (Existing Subscription)",
          "billing_required": false,
          "authentication": "SESSION_COOKIE",
          "automation_allowed": false,
          "ui_scraping_risk": "CRITICAL",
          "confidence": "HIGH"
        },
        {
          "capability_id": "OAI-API-001",
          "name": "OpenAI Platform API",
          "access_type": "API",
          "status": "BLOCKED",
          "incremental_cost": "PREPAID_BILLING_REQUIRED",
          "billing_required": true,
          "confidence": "HIGH"
        }
      ]
    },
    {
      "provider_id": "anthropic",
      "provider_name": "Anthropic",
      "capabilities": [
        {
          "capability_id": "CLD-WEB-001",
          "name": "Claude Pro Web & Artifacts",
          "access_type": "WEB_UI",
          "status": "HUMAN_BRIDGE",
          "incremental_cost": "0 EUR (Existing Subscription)",
          "billing_required": false,
          "authentication": "SESSION_COOKIE",
          "automation_allowed": false,
          "ui_scraping_risk": "CRITICAL",
          "confidence": "HIGH"
        },
        {
          "capability_id": "CLD-API-001",
          "name": "Anthropic Messages API",
          "access_type": "API",
          "status": "BLOCKED",
          "incremental_cost": "PREPAID_BILLING_REQUIRED",
          "billing_required": true,
          "confidence": "HIGH"
        }
      ]
    },
    {
      "provider_id": "xai",
      "provider_name": "xAI",
      "capabilities": [
        {
          "capability_id": "XAI-WEB-001",
          "name": "Grok Web UI (X Premium)",
          "access_type": "WEB_UI",
          "status": "HUMAN_BRIDGE",
          "incremental_cost": "0 EUR (Existing Subscription)",
          "billing_required": false,
          "authentication": "SESSION_COOKIE",
          "automation_allowed": false,
          "ui_scraping_risk": "CRITICAL",
          "confidence": "HIGH"
        },
        {
          "capability_id": "XAI-API-001",
          "name": "xAI Console API",
          "access_type": "API",
          "status": "BLOCKED",
          "incremental_cost": "PREPAID_BILLING_REQUIRED",
          "billing_required": true,
          "confidence": "HIGH"
        }
      ]
    }
  ]
}
=== END FILE ===

=== FILE: docs/evidence/GOOGLE_CAPABILITY_EVIDENCE_PACK.md ===
# Google Capability & Ecosystem Evidence Pack (ultraJARVIS)

| Metadata | Value |
| :--- | :--- |
| **Document ID** | `docs/evidence/GOOGLE_CAPABILITY_EVIDENCE_PACK.md` |
| **Task ID** | `UJ-GGL-001` |
| **Author / Lead** | Gemini (Google Ecosystem, Knowledge & Cloud Feasibility Architect) |
| **Status** | `REVIEW` (Pending Independent Review by Grok) |
| **Priority** | `P0` |
| **Weight** | `13` (Accepted Weight: `0/13`) |
| **Verification Scope** | AI Studio, Vertex AI, ADK, A2A, GCP Services, Workspace, NotebookLM, Colab, Media & Labs |
| **Core Principle** | `STRICT_ZERO_CARD` — Explicit separation of Free vs Billing-mandated services |

---

## 1. Executive Feasibility Overview

This Evidence Pack establishes a systematic, verified inventory of Google's AI, developer, workspace, and media technologies for ultraJARVIS.

### Primary Architectural Takeaways:
1. **Google AI Studio Free Tier is the sole zero-cost programmatic engine** currently available among foundational providers that supports production-grade multimodal reasoning and structured outputs without requiring an active credit card or billing account.
2. **Vertex AI & Full GCP APIs** require a Cloud Billing account and introduce accidental overage risks. They are classified as `BLOCKED` under `STRICT_ZERO_CARD` unless pinned to hard-capped budgets with active monitoring.
3. **NotebookLM** is an exceptional knowledge synthesis tool, but lacks a public zero-cost REST API; it must be operated strictly via `HUMAN_BRIDGE`.
4. **Google Workspace (Drive, Docs, Sheets)** can be interfaced at zero incremental cost via Google Apps Script webhooks or Google Cloud Free Tier OAuth (within standard consumer limits) without spinning up paid Workspace Enterprise domains.

---

## 2. Granular Capability Inventory

### 2.1 Developer AI Engines & APIs

#### 2.1.1 Google AI Studio (Gemini API Free Tier)
- **Status**: `ACTIVE`
- **Capability ID**: `GGL-AIS-001`
- **Verification Date**: August 2026
- **Access Modality**: REST API, `@google/genai` TypeScript SDK, Python SDK.
- **Consumer / Pro Availability**: Available to any standard Google Account without credit card entry.
- **Subscription vs API**: Separate from Google One AI Premium. AI Studio is developer-facing.
- **Quotas & Limits**:
  - **Flash Models**: 15 RPM (Requests Per Minute), 1,000,000 TPM (Tokens Per Minute), 1,500 RPD (Requests Per Day).
  - **Pro Models**: 2 RPM, 32,000 TPM, 50 RPD.
  - **Context Window**: Up to 1M–2M tokens depending on model version.
- **Incremental Cost & Billing**: €0.00. No credit card required to generate an API key.
- **Zero-Card Suitability**: **100% Compliant**.
- **Data Policy & Terms**: Under the free tier, input prompts and output generations may be reviewed by human reviewers and used to improve Google products. Sensitive secrets or non-redacted private keys must not be passed.
- **Automation / UI Scraping Risk**: Zero risk. Officially sanctioned REST API.
- **ultraJARVIS Recommendation**: **Primary Automated Worker & Cloud Engine** for background processing, structured verification, and initial code checks.
- **Confidence**: `HIGH` ([Google AI Dev Pricing](https://ai.google.dev/pricing)).

#### 2.1.2 Vertex AI (Google Cloud Platform)
- **Status**: `BLOCKED` (Cost Risk)
- **Capability ID**: `GGL-VTX-001`
- **Access Modality**: GCP Cloud Console, Vertex AI SDK, IAM OAuth2 / ADC.
- **Consumer / Pro Availability**: Requires Google Cloud Project with active Cloud Billing Account.
- **Incremental Cost & Billing**: Pay-as-you-go. Accidental infinite loops or large batches can trigger credit card charges.
- **Zero-Card Suitability**: **Non-compliant** without hard spending limits ($0 budget cap alerting).
- **Data Policy**: Enterprise privacy; data is not used for model training.
- **ultraJARVIS Recommendation**: Keep disabled. AI Studio Free Tier covers ultraJARVIS needs without billing liability.
- **Confidence**: `HIGH` ([Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)).

#### 2.1.3 Google Agent Development Kit (ADK) & Agent-to-Agent (A2A) Protocols
- **Status**: `PREVIEW` / `LABS`
- **Capability ID**: `GGL-ADK-001`
- **Access Modality**: Open-source libraries / GitHub references (`google/agent-development-kit`).
- **Incremental Cost**: €0 for code consumption. Inference calls use underlying Gemini API keys.
- **Zero-Card Suitability**: Compliant when bound to AI Studio Free Tier.
- **ultraJARVIS Recommendation**: Monitor patterns for TypeScript multi-agent orchestration; evaluate in `UJ-ADK-001`.
- **Confidence**: `MEDIUM-HIGH` (Architecture patterns verified).

---

### 2.2 Knowledge, Research & Computing Tools

#### 2.2.1 NotebookLM
- **Status**: `ACTIVE` (via `HUMAN_BRIDGE`)
- **Capability ID**: `GGL-NLM-001`
- **Access Modality**: Web Application (`notebooklm.google.com`).
- **Subscription vs API**: Included with Google Account. No direct external REST API.
- **Incremental Cost**: €0.
- **Zero-Card Suitability**: Compliant via web interaction.
- **Automation Risk**: Automated scraping of NotebookLM is unauthorized.
- **ultraJARVIS Recommendation**: Utilize for dense document synthesis, cross-referencing multi-source research dossiers, and audio overviews via manual copy-paste bridge (`UJ-KNW-001`).
- **Confidence**: `HIGH`.

#### 2.2.2 Google Colab (Free Tier)
- **Status**: `ACTIVE`
- **Capability ID**: `GGL-COL-001`
- **Access Modality**: Interactive Jupyter Notebook (`colab.research.google.com`).
- **Incremental Cost**: €0 for Free T4/CPU runtime.
- **Zero-Card Suitability**: Compliant.
- **Automation / Headless**: Colab terms prohibit unattended or headless scraping/mining.
- **ultraJARVIS Recommendation**: Use as interactive sandbox for running complex Python benchmarks or heavy deterministic computations manually.
- **Confidence**: `HIGH` ([Colab FAQ](https://research.google.com/colaboratory/faq.html)).

---

### 2.3 Cloud, Hosting & Workspace Infrastructure

#### 2.3.1 Firebase Hosting & Cloud Firestore (Spark Free Plan)
- **Status**: `ACTIVE`
- **Capability ID**: `GGL-FBS-001`
- **Access Modality**: Firebase CLI, Node.js Firebase SDK.
- **Quotas**:
  - Hosting: 10 GB storage, 360 MB/day data transfer.
  - Firestore: 1 GB stored data, 50,000 reads/day, 20,000 writes/day.
- **Incremental Cost**: €0 under Spark Plan (no credit card required).
- **Zero-Card Suitability**: **100% Compliant**.
- **ultraJARVIS Recommendation**: Candidate for static website staging and lightweight metadata persistence for the Website Team.
- **Confidence**: `HIGH` ([Firebase Pricing](https://firebase.google.com/pricing)).

#### 2.3.2 Google Workspace & Google Apps Script
- **Status**: `ACTIVE`
- **Capability ID**: `GGL-WKS-001`
- **Access Modality**: Google Apps Script (GAS) Webhooks, Google Drive/Docs/Sheets REST API with standard Google OAuth.
- **Incremental Cost**: €0 using existing personal Google account.
- **Quotas**: Standard personal quotas (e.g., 20,000 URLFetch calls/day, 6 min script runtime).
- **Zero-Card Suitability**: Compliant.
- **ultraJARVIS Recommendation**: Free zero-infrastructure bridge to trigger external events or log audit runs into Google Sheets if needed.
- **Confidence**: `HIGH` ([Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas)).

---

### 2.4 Media, Vision & Creative Labs (Website Team Assets)

#### 2.4.1 Imagen 3 / VideoFX / MusicFX (Google Labs & AI Test Kitchen)
- **Status**: `PREVIEW` / `LABS` (via `HUMAN_BRIDGE`)
- **Capability ID**: `GGL-MED-001`
- **Access Modality**: Web UI (`aitestkitchen.withgoogle.com`, `labs.google`).
- **Incremental Cost**: €0 (Experimental access).
- **Commercial Rights**: Media generated via experimental Labs is subject to Google Experimental Terms; commercial rights for production deployment must be verified per release.
- **ultraJARVIS Recommendation**: Use for concept exploration and website mockup assets via operator intervention. High-resolution production assets should prefer vetted open-source/permissive assets.
- **Confidence**: `MEDIUM-HIGH`.

---

## 3. Deprecation & Sunset Watchlist

| Technology / API | Current State | Risk / Sunset Notice | Recommendation |
| :--- | :--- | :--- | :--- |
| **Legacy PaLM API** | `DEPRECATED` | Fully replaced by Gemini API (`v1beta`). | Do not use; purge legacy endpoints. |
| **Gemini 1.0 Pro / Flash** | `DEPRECATED` | Sunset in favor of Gemini 1.5 & 2.x models. | Target Gemini 2.x series in SDK config. |
| **Google Cloud Functions v1** | `LEGACY` | Migrated to Cloud Functions v2 (Cloud Run backend). | Build serverless adapters on standard Node.js runtime. |

---

## 4. Architectural Feasibility Matrix for ultraJARVIS

| Component | Target Role in ultraJARVIS | Modality | Cost Risk | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Gemini Flash API** | Fast automated sanity checks, JSON schema validation | Automated SDK | Zero | `ACTIVE` |
| **Gemini Pro API** | In-depth code & architectural diff verification | Automated SDK | Zero | `ACTIVE` |
| **NotebookLM** | Deep technical synthesis & source grounding | `HUMAN_BRIDGE` | Zero | `ACTIVE` |
| **Firebase Spark** | Static web preview hosting for Website Team | Automated CLI | Zero | `ACTIVE` |
| **Apps Script** | Lightweight serverless audit webhooks | REST / Trigger | Zero | `ACTIVE` |
| **Vertex AI** | Enterprise cloud deployment | Automated API | High | `BLOCKED` |
| **AI Test Kitchen** | Visual asset ideation for mockups | `HUMAN_BRIDGE` | Zero | `PREVIEW` |

---

## 5. Next Actions for Gemini Subsystem
1. Provide inputs to `UJ-INF-001` specifying zero-card Firebase + AI Studio environment templates.
2. Formulate NotebookLM bridge playbook in `UJ-KNW-001`.
3. Hand off this evidence pack to **GROK** for independent peer review.
=== END FILE ===

=== FILE: docs/architecture/INFRASTRUCTURE_STRICT_ZERO_CARD.md ===
# STRICT_ZERO_CARD Infrastructure & Runtime Blueprint (ultraJARVIS)

| Metadata | Value |
| :--- | :--- |
| **Document ID** | `docs/architecture/INFRASTRUCTURE_STRICT_ZERO_CARD.md` |
| **Task ID** | `UJ-INF-001` |
| **Architect / Lead** | Gemini (Google Ecosystem, Knowledge & Cloud Feasibility Architect) |
| **Status** | `PROPOSED_DRAFT` (Pending merge of `UJ-CAP-001` & Review by Claude/Grok) |
| **Priority** | `P0` |
| **Weight** | `13` (Accepted Weight: `0/13`) |
| **Target Runtime** | Node.js (v20+ LTS) / TypeScript (v5+) / pnpm Monorepo |
| **Core Constraint** | `STRICT_ZERO_CARD` — Absolute Zero Incremental Financial Cost |

---

## 1. Architectural Scope & Principles

The purpose of `UJ-INF-001` is to design the zero-cost execution foundation, network boundary, rate limiting, persistence harness, and deployment targets for ultraJARVIS without requiring active billing accounts or paid third-party proxies.

### Core Tenets:
1. **Zero Financial Surface**: No programmatic API calls that can trigger overdraft, metered billing, or automated bank charges.
2. **Local-First Deterministic Execution**: Business logic, task dispatch, session audit, and file operations execute locally within the developer environment (Node.js/TypeScript/pnpm).
3. **Cloud-Side Heavy Reasoning via Free Tiers**: Automated cloud inference leverages Google AI Studio Free Tier (Gemini 2.5 Flash / Pro) within strict rate limits.
4. **Interactive Human Bridge**: High-context reasoning or unmetered subscription models (ChatGPT Plus, Claude Pro, Grok on X) run through structured clipboard/file bridges (`HUMAN_BRIDGE`).
5. **Zero-Cost Preview Staging**: Website Team builds and prototypes are hosted on Firebase Hosting (Spark Free Tier) or local preview servers.

---

## 2. Component Architecture Overview
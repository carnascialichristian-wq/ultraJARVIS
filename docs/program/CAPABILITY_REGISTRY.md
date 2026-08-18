# ultraJARVIS — Multi-Provider Capability Registry

Registry schema: ultrajarvis.capability-registry/v1
Registry version: 1.1.0
Last verification: 2026-08-18T10:28:31Z

> Routing evidence only: this file does not change BACKLOG.json, task status, accepted weight, reviewer gates or dependent blockers.

## Hard stops

- STRICT_ZERO_CARD: no incremental cost, billing activation, paid credits, secrets/session tokens, consumer UI automation or data above C1.
- Provider quotas, model IDs, prices, privacy terms, regions and availability are dynamic; no static entry is a universal guarantee.
- Google values use dated official pages where stated, but account-specific limits require a fresh AI Studio/project check.

## Provider matrix

| Provider | Count | Candidate routes | Caveat |
|---|---:|---|---|
| OpenAI | 4 | CAP-OAI-001, CAP-OAI-003, CAP-OAI-004 | Fresh entitlement/terms check required. |
| Anthropic | 4 | CAP-ANT-001, CAP-ANT-003, CAP-ANT-004 | Fresh entitlement/terms check required. |
| Google | 8 | CAP-GGL-001, CAP-GGL-002, CAP-GGL-003, CAP-GGL-005, CAP-GGL-006, CAP-GGL-007, CAP-GGL-008 | Dynamic project/account limits and regional terms. |
| xAI | 3 | CAP-XAI-001, CAP-XAI-003 | Fresh entitlement/terms check required. |

## Capability records

## OpenAI

### CAP-OAI-001 — ChatGPT Consumer Interactive Interface (GPT-4o / GPT-4.5 / o3-mini)

- Provider/product: **OpenAI / ChatGPT Web UI**
- Status: **HUMAN_BRIDGE**
- Access: `https://chatgpt.com` / `WEB_UI`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Manual prompt transfer via human operator (Human Bridge Protocol).
- Primary source: https://openai.com/chatgpt/pricing
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-OAI-002 — OpenAI REST API (Chat Completions / Responses / Embeddings)

- Provider/product: **OpenAI / OpenAI Developer Platform**
- Status: **BLOCKED**
- Access: `https://api.openai.com/v1` / `API`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Route tasks to zero-card providers or human bridge operator.
- Primary source: https://platform.openai.com/docs/guides/rate-limits
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-OAI-003 — ChatGPT Historical Chat Data Export

- Provider/product: **OpenAI / ChatGPT Data Controls**
- Status: **HUMAN_BRIDGE**
- Access: `https://chatgpt.com/#settings/DataControls` / `MANUAL_EXPORT`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Manual operator download and ingestion into ultraJARVIS offline corpus.
- Primary source: https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-OAI-004 — Custom GPT Integration and Actions

- Provider/product: **OpenAI / ChatGPT Custom GPTs / Actions**
- Status: **HUMAN_BRIDGE**
- Access: `https://chatgpt.com/gpts` / `WEB_UI`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Manual interaction via ChatGPT UI by human operator.
- Primary source: https://openai.com/index/introducing-gpts/
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.

## Anthropic

### CAP-ANT-001 — Claude Consumer Interactive Interface (Claude 3.5 Sonnet / Claude 3.7 Sonnet / Opus)

- Provider/product: **Anthropic / Claude Web UI & Artifacts**
- Status: **HUMAN_BRIDGE**
- Access: `https://claude.ai` / `WEB_UI`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Manual prompt transfer via human operator (Human Bridge Protocol).
- Primary source: https://support.anthropic.com/en/articles/8325612-does-claude-ai-have-any-message-limits
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-ANT-002 — Anthropic Messages REST API

- Provider/product: **Anthropic / Anthropic API**
- Status: **BLOCKED**
- Access: `https://api.anthropic.com/v1/messages` / `API`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Route tasks through Human Bridge to Claude.ai or zero-cost API providers.
- Primary source: https://docs.anthropic.com/en/api/rate-limits
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-ANT-003 — Claude Projects Document Context & Knowledge Base

- Provider/product: **Anthropic / Claude Projects & Artifacts Knowledge**
- Status: **HUMAN_BRIDGE**
- Access: `https://claude.ai/projects` / `HUMAN_BRIDGE`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Human operator manually uploads repository context documents into Claude Project.
- Primary source: https://support.anthropic.com/en/articles/9517075-what-are-projects
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-ANT-004 — Anthropic Model Context Protocol Client/Server Local Integration

- Provider/product: **Anthropic / Model Context Protocol (MCP)**
- Status: **PREVIEW**
- Access: `Local stdio / SSE transport` / `SDK`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Direct CLI script execution without MCP bridge.
- Primary source: https://modelcontextprotocol.io/
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.

## Google

### CAP-GGL-001 — Google Gemini Developer API Free Tier (gemini-2.5-flash / gemini-2.5-pro / gemini-3.7-flash)

- Provider/product: **Google / Gemini Developer API (Free Tier)**
- Status: **ACTIVE**
- Access: `https://generativelanguage.googleapis.com/v1beta` / `API`
- Account/region: Eligibility and active limits are account/project/region specific; verify in AI Studio.
- Billing/cost: NO_BILLING — billing activation is a hard stop for STRICT_ZERO_CARD.; 0.00 USD only while the project is unpaid and within the current free quota.
- Model/tier: Unpaid/free quota for an eligible Google Cloud project; exact model access is dynamic.
- Quota: Check active limits in AI Studio; limits are model-specific, not guaranteed and can vary with capacity.
- Period/scope: RPM/TPM plus RPD; RPD resets at midnight Pacific Time. / Per project.
- Privacy/data: Google API terms distinguish unpaid and paid services. Unpaid-service content may be used to improve products and may receive human review; the terms state that for EEA/Switzerland/UK users paid-service data-use terms apply to all services, including free access. Verify current terms and region before sending C1 data.
- Fallback: HUMAN_BRIDGE with redacted C1-safe prompts; otherwise BLOCKED.
- Primary source: https://ai.google.dev/gemini-api/docs/rate-limits
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Official Google rate-limit, pricing and API-terms pages checked; no account-specific quota snapshot available.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-GGL-002 — Google AI Studio Interactive Prompting & Model Playground

- Provider/product: **Google / Google AI Studio Web Playground**
- Status: **HUMAN_BRIDGE**
- Access: `https://aistudio.google.com` / `WEB_UI`
- Account/region: Developer account; 180+ regions
- Billing/cost: NO_BILLING; 0.00 USD
- Model/tier: AI Studio Playground
- Quota: UNKNOWN/DYNAMIC — do not infer a fixed quota from a homepage or model name.
- Period/scope: UNKNOWN — do not infer API quotas from the UI. / Account/session specific.
- Privacy/data: Use only redacted C1-safe content; current UI terms and account controls must be checked.
- Fallback: Manual HUMAN_BRIDGE only; no headless browser, cookies or session tokens.
- Primary source: https://aistudio.google.com/
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Official entry point recorded; interactive entitlement not account-verified.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-GGL-003 — Gemini Consumer Interface (gemini.google.com / Advanced)

- Provider/product: **Google / Google Gemini Consumer Web App**
- Status: **HUMAN_BRIDGE**
- Access: `https://gemini.google.com` / `WEB_UI`
- Account/region: Free Consumer Account / Google One AI Premium (19.99/mo); Global
- Billing/cost: NO_BILLING_FOR_FREE_TIER_PREEXISTING_FOR_ADVANCED; 0.00 USD (utilizing free tier or pre-existing Google One subscription)
- Model/tier: Gemini 2.5 / 3.x Consumer Engine
- Quota: UNKNOWN/DYNAMIC — do not infer a fixed quota from a homepage or model name.
- Period/scope: UNKNOWN — consumer limits are dynamic. / Account/session specific.
- Privacy/data: Consumer account controls and current terms govern data use; no universal training/retention claim.
- Fallback: Manual HUMAN_BRIDGE only; no UI automation or session-token handling.
- Primary source: https://gemini.google.com/
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Consumer entry point recorded; exact entitlement/data controls not independently verified.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-GGL-004 — Vertex AI Enterprise Foundation Models & Model Garden

- Provider/product: **Google / Google Cloud Vertex AI**
- Status: **BLOCKED**
- Access: `https://cloud.google.com/vertex-ai` / `API`
- Account/region: Google Cloud Platform Project (Multi-region)
- Billing/cost: BILLING_REQUIRED_OR_ACCOUNT_DEPENDENT — blocked unless separately authorized.; Not permitted under STRICT_ZERO_CARD.
- Model/tier: Vertex AI Pay-as-you-go
- Quota: UNKNOWN/DYNAMIC — do not infer a fixed quota from a homepage or model name.
- Period/scope: Per minute / Monthly invoice / Per GCP Project / Region
- Privacy/data: Enterprise terms and project configuration must be verified; no access proposed.
- Fallback: Use CAP-GGL-001 only if an eligible unpaid project remains within free quota.
- Primary source: https://cloud.google.com/vertex-ai/generative-ai/docs/quotas
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Blocked paid/cloud route; no billing or project mutation performed.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-GGL-005 — NotebookLM Document Grounding & Audio Overview

- Provider/product: **Google / Google NotebookLM**
- Status: **HUMAN_BRIDGE**
- Access: `https://notebooklm.google.com` / `WEB_UI`
- Account/region: Consumer / Workspace / Education; 180+ regions
- Billing/cost: NO_BILLING; 0.00 USD (Free web service)
- Model/tier: NotebookLM Core Runtime (Gemini 2.5 / 3.x backend)
- Quota: UNKNOWN/DYNAMIC — do not infer a fixed quota from a homepage or model name.
- Period/scope: UNKNOWN / Account/plan specific.
- Privacy/data: Grounding, retention, training and export behavior are product/plan/region dependent; verify current support terms before C1.
- Fallback: Manual HUMAN_BRIDGE with redacted documents; no automated upload/account access.
- Primary source: https://support.google.com/notebooklm/
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Official support entry point recorded; fixed quota/privacy claims not accepted.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-GGL-006 — Google Apps Script Serverless Automation & Workspace Triggers

- Provider/product: **Google / Google Apps Script**
- Status: **ACTIVE**
- Access: `https://script.google.com` / `API`
- Account/region: Consumer and Workspace quotas differ; verify account type.
- Billing/cost: NO_BILLING_FOR_DOCUMENTED_QUOTA_ONLY; 0.00 USD for documented no-cost quota use; external services/plans may differ.
- Model/tier: Apps Script per-user runtime and service quotas.
- Quota: Examples for consumer accounts: 90 min/day trigger runtime, 20,000 URL Fetch/day, 100 email recipients/day, 6 min/execution, 30 simultaneous executions/user; values can change.
- Period/scope: Per user; many quotas reset 24 hours after first request. / Per user/service.
- Privacy/data: Workspace/Google account policies apply; no secrets, cookies or consumer-session automation.
- Fallback: Run local node.js / python scripts on host machine.
- Primary source: https://developers.google.com/apps-script/guides/services/quotas
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Official Apps Script quota page checked; exact Workspace quota not snapshot-verified.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-GGL-007 — Google Colab Hosted Jupyter Python Computing (Free Tier)

- Provider/product: **Google / Google Colaboratory (Colab)**
- Status: **HUMAN_BRIDGE**
- Access: `https://colab.research.google.com` / `WEB_UI`
- Account/region: Free Tier; Global
- Billing/cost: NO_BILLING; 0.00 USD (No card required)
- Model/tier: Free Hosted VM (Dynamic CPU / T4 GPU / TPU allocation)
- Quota: UNKNOWN/DYNAMIC — do not infer a fixed quota from a homepage or model name.
- Period/scope: UNKNOWN/DYNAMIC / Account/session
- Privacy/data: Do not upload secrets or data above C1; runtime storage is ephemeral and VMs may be deleted.
- Fallback: Local deterministic Node/TypeScript path.
- Primary source: https://research.google.com/colaboratory/faq.html
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Official Colab FAQ checked; free resources are not guaranteed/unlimited and limits fluctuate.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-GGL-008 — Firebase Spark Plan (No-Cost Firestore & Auth Backend)

- Provider/product: **Google / Firebase Spark Plan**
- Status: **ACTIVE**
- Access: `https://firebase.google.com` / `API`
- Account/region: Spark plan only; project-level quotas. Blaze/paid features are outside STRICT_ZERO_CARD.
- Billing/cost: NO_PAYMENT_METHOD_FOR_SPARK; Blaze is a hard stop unless separately authorized.; 0.00 USD on Spark within documented no-cost limits and eligible services.
- Model/tier: Firebase Spark no-cost plan; Firestore no-cost quotas are project-level.
- Quota: Firestore examples: 1 GiB stored, 10 GiB/month outbound transfer, 20,000 writes/day, 50,000 reads/day, 20,000 deletes/day; verify current pricing.
- Period/scope: Daily quotas and monthly transfer/storage limits. / Project-level.
- Privacy/data: Project data policy/security rules remain the owner's responsibility; no secrets or production data introduced.
- Fallback: Local JSON/file-backed adapter with deterministic tests.
- Primary source: https://firebase.google.com/pricing
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Official Firebase pricing page checked; Spark/Blaze boundary and project-level scope recorded.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.

## xAI

### CAP-XAI-001 — Grok Interactive Web Interface on X / grok.com (Grok 2 / Grok 3)

- Provider/product: **xAI / Grok Web UI on X**
- Status: **HUMAN_BRIDGE**
- Access: `https://x.com/i/grok or https://grok.com` / `WEB_UI`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Human operator executes queries manually in Grok UI (Human Bridge Protocol).
- Primary source: https://help.x.com/en/using-x/grok
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-XAI-002 — xAI REST API (grok-2 / grok-2-mini / grok-3)

- Provider/product: **xAI / xAI Developer Platform**
- Status: **BLOCKED**
- Access: `https://api.x.ai/v1` / `API`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Route tasks through Human Bridge to Grok UI or registered zero-cost engines.
- Primary source: https://docs.x.ai/docs/overview
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.
### CAP-XAI-003 — Grok Real-Time Web & Social Information Retrieval

- Provider/product: **xAI / Grok Real-Time Search & Reasoning**
- Status: **HUMAN_BRIDGE**
- Access: `https://x.com/i/grok` / `HUMAN_BRIDGE`
- Account/region: Account, plan and region dependent; no universal entitlement asserted.
- Billing/cost: UNKNOWN_OR_ACCOUNT_DEPENDENT — treat any billing/paid-credit requirement as BLOCKED.; UNKNOWN until entitlement and billing state are verified; paid paths are forbidden by STRICT_ZERO_CARD.
- Model/tier: Provider/account/model entitlement is dynamic; verify before use.
- Quota: DYNAMIC_OR_UNKNOWN — no fixed provider limit is asserted here.
- Period/scope: UNKNOWN — verify the current account/plan. / Provider/account/project specific.
- Privacy/data: Provider, account, region and plan terms govern retention/training. No universal claim is accepted; verify current primary terms before sending C1 data.
- Fallback: Human operator executes search queries and copies grounding citations.
- Primary source: https://help.x.com/en/using-x/grok
- Verified: 2026-08-18T10:28:31Z
- Verification scope: Routing/catalog evidence only; exact account entitlement, active quota, model availability, region terms and billing state require a fresh check.
- Strict-zero guard: Use only an existing no-cost path with billing disabled. Paid credits, billing activation, consumer UI automation, cookies, session tokens and secrets are forbidden.

## Acceptance gate

- Proposed task: UJ-CAP-001 — REVIEW, not DONE.
- Reviewer: Claude. Accepted weight remains 0/13 until independent review and Council import.

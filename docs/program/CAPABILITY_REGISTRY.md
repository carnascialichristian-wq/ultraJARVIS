# ultraJARVIS Multi-Provider Capability Registry

Document: UJ-DOC-CAP-001  
Schema: ultrajarvis.capability-registry/v1  
Registry version: 1.1.1  
Verification date: 2026-08-18T13:35:00Z  
Governing source commit: 3611b1b400cf57b5021bab228a3de9470d6eca5c

## Admission boundary

This is a routing and evidence catalog. It does not change BACKLOG.json, task status, accepted weight, reviewer gates or dependent blockers. A capability is not dispatchable merely because a product exists or a no-cost label appears on a pricing page.

- STRICT_ZERO_CARD: no paid API, billing activation, overage, secret, consumer UI automation or data above C1.
- Account/project quotas, regions, model access, privacy terms and commercial rights are dynamic and must be rechecked at dispatch.
- ACTIVE is not assigned to a Google route without live account/project evidence. Google API-like routes below are UNKNOWN, HUMAN_BRIDGE or BLOCKED until their gates pass.
- The non-Google rows were preserved from Gemini's inventory but were not independently reverified in this correction; they are catalog context, not acceptance evidence.

## Status taxonomy

| Status | Meaning |
|---|---|
| ACTIVE | Verified zero-cost route with current account/project evidence. |
| HUMAN_BRIDGE | Manual human interaction or export only; no UI automation. |
| PREVIEW | Provider labels the surface preview, but no production or entitlement approval follows. |
| UNKNOWN | Documentation or catalog exists, but account, terms, quota or policy evidence is incomplete. |
| BLOCKED | Violates the zero-card boundary or requires an unapproved paid/billing path. |

## Provider summary

| Provider | Count | Capability IDs |
|---|---:|---|
| OpenAI | 4 | CAP-OAI-001, CAP-OAI-002, CAP-OAI-003, CAP-OAI-004 |
| Anthropic | 4 | CAP-ANT-001, CAP-ANT-002, CAP-ANT-003, CAP-ANT-004 |
| Google | 8 | CAP-GGL-001, CAP-GGL-002, CAP-GGL-003, CAP-GGL-004, CAP-GGL-005, CAP-GGL-006, CAP-GGL-007, CAP-GGL-008 |
| xAI | 3 | CAP-XAI-001, CAP-XAI-002, CAP-XAI-003 |

## Capability matrix

| ID | Provider | Product | Access | Status | Cost posture | Billing gate | Quota/evidence summary | Source |
|---|---|---|---|---|---|---|---|---|
| CAP-OAI-001 | OpenAI | ChatGPT Web UI | WEB_UI | HUMAN_BRIDGE | 0.00 USD (utilizing existing consumer subscription or free account tier) | NO_BILLING_FOR_FREE_TIER_EXISTING_SUB_FOR_PLUS | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://openai.com/chatgpt/pricing) |
| CAP-OAI-002 | OpenAI | OpenAI Developer Platform | API | BLOCKED | PAY_PER_USE (Requires funded prepaid credits or active credit card) | CREDIT_CARD_REQUIRED | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://platform.openai.com/docs/guides/rate-limits) |
| CAP-OAI-003 | OpenAI | ChatGPT Data Controls | MANUAL_EXPORT | HUMAN_BRIDGE | 0.00 USD | NO_BILLING | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data) |
| CAP-OAI-004 | OpenAI | ChatGPT Custom GPTs / Actions | WEB_UI | HUMAN_BRIDGE | 0.00 USD beyond subscription | EXISTING_SUBSCRIPTION_NO_API_BILLING | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://openai.com/index/introducing-gpts/) |
| CAP-ANT-001 | Anthropic | Claude Web UI & Artifacts | WEB_UI | HUMAN_BRIDGE | 0.00 USD (utilizing existing consumer subscription or free account tier) | NO_BILLING_FOR_FREE_TIER_EXISTING_SUB_FOR_PRO | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://support.anthropic.com/en/articles/8325612-does-claude-ai-have-any-message-limits) |
| CAP-ANT-002 | Anthropic | Anthropic Messages API | API | BLOCKED | PAY_PER_USE (Requires pre-purchased credits or linked payment card) | CREDIT_CARD_REQUIRED | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://docs.anthropic.com/en/api/rate-limits) |
| CAP-ANT-003 | Anthropic | Claude Projects | HUMAN_BRIDGE | HUMAN_BRIDGE | 0.00 USD beyond subscription | EXISTING_SUBSCRIPTION_NO_API_BILLING | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://support.anthropic.com/en/articles/9517075-what-are-projects) |
| CAP-ANT-004 | Anthropic | Model Context Protocol (MCP) | SDK | PREVIEW | 0.00 USD (Open Source Software) | NO_BILLING | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://modelcontextprotocol.io/) |
| CAP-GGL-001 | Google | Gemini Developer API (Free Tier) | API | UNKNOWN | 0.00 USD only while an eligible project remains Free/unbilled and within its current quota; live billing state is unverified | UNKNOWN — a live AI Studio/project check is required; paid fallback is forbidden | Model/project/account-specific RPM/TPM/RPD; current values must be read in AI Studio and are not guaranteed. | [source](https://ai.google.dev/gemini-api/docs/rate-limits) |
| CAP-GGL-002 | Google | Google AI Studio Web Playground | WEB_UI | HUMAN_BRIDGE | No new spend authorized; account/project billing state is unverified | UNKNOWN — verify the linked project before any API-related dispatch | UNKNOWN — do not infer API limits from the web UI. | [source](https://aistudio.google.com) |
| CAP-GGL-003 | Google | Google Gemini Consumer Web App | WEB_UI | HUMAN_BRIDGE | Existing free or already-paid consumer entitlement only; no new subscription or billing action authorized | EXISTING_ACCOUNT_ONLY — current plan and account controls were not inspected | DYNAMIC_OR_UNKNOWN — consumer limits were not independently reverified. | [source](https://gemini.google.com) |
| CAP-GGL-004 | Google | Google Cloud Vertex AI | API | BLOCKED | Pay-per-use; not permitted under STRICT_ZERO_CARD | BILLING_REQUIRED_OR_ACCOUNT_DEPENDENT | Cloud quotas and billing behavior are account/project/region dependent; no live project was queried. | [source](https://cloud.google.com/vertex-ai/pricing) |
| CAP-GGL-005 | Google | Google NotebookLM | WEB_UI | HUMAN_BRIDGE | No-cost access may exist, but account, plan and region were not inspected | UNKNOWN — verify current consumer/Workspace terms | UNKNOWN — fixed notebook, source and query limits were not established from a dated primary source. | [source](https://support.google.com/notebooklm/) |
| CAP-GGL-006 | Google | Google Apps Script | API | UNKNOWN | The cited table documents core quotas without a separate per-call API price; account type and product boundary are unverified | UNKNOWN — verify account type and any connected Workspace/Cloud service | Official examples include 6 min/execution, consumer 90 min/day trigger runtime, 20,000 URL Fetch/day, 100 email recipients/day, and 30 simultaneous executions/user; Workspace values differ and quotas may change. | [source](https://developers.google.com/apps-script/guides/services/quotas) |
| CAP-GGL-007 | Google | Google Colaboratory (Colab) | WEB_UI | HUMAN_BRIDGE | Free resources are not guaranteed; no paid Colab tier is authorized | UNKNOWN — no billing or account state was inspected | Free resources, idle timeout, maximum VM lifetime, hardware and usage limits vary and are not fixed guarantees. | [source](https://research.google.com/colaboratory/faq.html) |
| CAP-GGL-008 | Google | Firebase Spark Plan | API | UNKNOWN | Spark no-cost quotas require no payment method; features or usage outside those documented quotas may require Blaze billing | UNKNOWN — verify the project is Spark-only and not linked to Cloud Billing | Cloud Firestore examples: 1 GiB stored, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day and 10 GiB/month outbound transfer; these are project-level no-cost quotas. | [source](https://firebase.google.com/pricing) |
| CAP-XAI-001 | xAI | Grok Web UI on X | WEB_UI | HUMAN_BRIDGE | 0.00 USD (utilizing existing X Premium subscription) | EXISTING_SUBSCRIPTION_NO_API_BILLING | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://help.x.com/en/using-x/grok) |
| CAP-XAI-002 | xAI | xAI Developer Platform | API | BLOCKED | PAY_PER_USE (Requires payment card / purchased balance) | CREDIT_CARD_REQUIRED | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://docs.x.ai/docs/overview) |
| CAP-XAI-003 | xAI | Grok Real-Time Search & Reasoning | HUMAN_BRIDGE | HUMAN_BRIDGE | 0.00 USD beyond subscription | EXISTING_SUBSCRIPTION_NO_API_BILLING | DYNAMIC_OR_UNKNOWN — not independently reverified in this correction. | [source](https://help.x.com/en/using-x/grok) |

## Google records — corrected evidence view

### CAP-GGL-001 — Gemini Developer API (Free Tier)
- Status: UNKNOWN; access mode: API.
- Cost/billing: 0.00 USD only while an eligible project remains Free/unbilled and within its current quota; live billing state is unverified; UNKNOWN — a live AI Studio/project check is required; paid fallback is forbidden.
- Account/region: Account, project, model and region dependent; no live entitlement snapshot supplied.
- Quota: Model/project/account-specific RPM/TPM/RPD; current values must be read in AI Studio and are not guaranteed. Scope: Per Google Cloud project, subject to current account/project configuration.. Period: Per-minute and daily windows; describe the reset as Pacific time without hard-coding a UTC offset..
- Privacy/data: Google's Gemini API Additional Terms describe Unpaid Services content use and possible human review. They state that the Paid Services data-use section applies to all Services for users in the EEA, Switzerland or the UK even when access is free. Verify the current account, project tier, region and terms; send only redacted C0/C1 material.
- Guard: No consumer UI automation; automatic API dispatch is not admitted until the live gate passes.
- Fallback: HUMAN_BRIDGE or local processing; never enable billing as a fallback.
- Source: https://ai.google.dev/gemini-api/docs/rate-limits; checked 2026-08-18T13:35:00Z.
- Confidence score: 0.5. Official documentation checked on 2026-08-18; live account/project state was not checked.

### CAP-GGL-002 — Google AI Studio Web Playground
- Status: HUMAN_BRIDGE; access mode: WEB_UI.
- Cost/billing: No new spend authorized; account/project billing state is unverified; UNKNOWN — verify the linked project before any API-related dispatch.
- Account/region: Account, project, rollout and region dependent.
- Quota: UNKNOWN — do not infer API limits from the web UI. Scope: Account/project specific. Period: UNKNOWN.
- Privacy/data: Current account/project terms govern data handling. Use only redacted C0/C1 material until the exact terms and storage behavior are checked.
- Guard: HIGH_RISK_FORBIDDEN: Automated headless browser control of the AI Studio UI is prohibited.
- Fallback: Manual copy/paste through HUMAN_BRIDGE; no headless browser, cookies or session tokens.
- Source: https://aistudio.google.com; checked 2026-08-18T13:35:00Z.
- Confidence score: 0.5. Official documentation checked on 2026-08-18; live account/project state was not checked.

### CAP-GGL-003 — Google Gemini Consumer Web App
- Status: HUMAN_BRIDGE; access mode: WEB_UI.
- Cost/billing: Existing free or already-paid consumer entitlement only; no new subscription or billing action authorized; EXISTING_ACCOUNT_ONLY — current plan and account controls were not inspected.
- Account/region: Free Consumer Account / Google One AI Premium (19.99/mo); Global (including Italy/EEA).
- Quota: DYNAMIC_OR_UNKNOWN — consumer limits were not independently reverified. Scope: Consumer account/session specific. Period: UNKNOWN.
- Privacy/data: Consumer account, region and current terms control data handling; no universal training or retention claim is made in this correction.
- Guard: HIGH_RISK_FORBIDDEN: Automated browser interaction, session hijacking, or reverse-engineered client calls violate Google Terms of Service.
- Fallback: Manual prompt transfer via human operator (Human Bridge Protocol).
- Source: https://gemini.google.com; checked 2026-08-18T13:35:00Z.
- Confidence score: 0.5. Official documentation checked on 2026-08-18; live account/project state was not checked.

### CAP-GGL-004 — Google Cloud Vertex AI
- Status: BLOCKED; access mode: API.
- Cost/billing: Pay-per-use; not permitted under STRICT_ZERO_CARD; BILLING_REQUIRED_OR_ACCOUNT_DEPENDENT.
- Account/region: Google Cloud Platform Project (Multi-region).
- Quota: Cloud quotas and billing behavior are account/project/region dependent; no live project was queried. Scope: GCP project/region specific. Period: UNKNOWN.
- Privacy/data: Not evaluated for acceptance; pricing or quota pages do not by themselves prove an enterprise SLA, training exclusion or commercial-rights grant.
- Guard: N/A (Standard Cloud API)
- Fallback: Route to Google AI Studio Free Tier (CAP-GGL-001) or Human Bridge.
- Source: https://cloud.google.com/vertex-ai/pricing; checked 2026-08-18T13:35:00Z.
- Confidence score: 0.5. Official documentation checked on 2026-08-18; live account/project state was not checked.

### CAP-GGL-005 — Google NotebookLM
- Status: HUMAN_BRIDGE; access mode: WEB_UI.
- Cost/billing: No-cost access may exist, but account, plan and region were not inspected; UNKNOWN — verify current consumer/Workspace terms.
- Account/region: Consumer, Workspace, Education and region eligibility are not verified.
- Quota: UNKNOWN — fixed notebook, source and query limits were not established from a dated primary source. Scope: Account/plan specific. Period: UNKNOWN.
- Privacy/data: The NotebookLM support homepage is insufficient to prove a universal training exclusion. Attach the exact dated privacy/FAQ article and applicable account terms; until then use only C0/C1 redacted material.
- Guard: HIGH_RISK_FORBIDDEN: Automated headless browser scraping of NotebookLM is prohibited under Google Terms of Service.
- Fallback: Manual HUMAN_BRIDGE or local retrieval; no automated upload or account access.
- Source: https://support.google.com/notebooklm/; checked 2026-08-18T13:35:00Z.
- Confidence score: 0.5. Official documentation checked on 2026-08-18; live account/project state was not checked.

### CAP-GGL-006 — Google Apps Script
- Status: UNKNOWN; access mode: API.
- Cost/billing: The cited table documents core quotas without a separate per-call API price; account type and product boundary are unverified; UNKNOWN — verify account type and any connected Workspace/Cloud service.
- Account/region: Consumer Google Account (@gmail.com) / Google Workspace (@domain.com); Global.
- Quota: Official examples include 6 min/execution, consumer 90 min/day trigger runtime, 20,000 URL Fetch/day, 100 email recipients/day, and 30 simultaneous executions/user; Workspace values differ and quotas may change. Scope: Per user/account type and service.. Period: Per-user quotas generally reset 24 hours after the first request; verify the current table..
- Privacy/data: OAuth grants, triggers and document access are account-scoped side effects; quota/pricing evidence does not prove a privacy boundary or authorize a write.
- Guard: Programmatic execution exists, but every trigger, webhook, OAuth grant or external write needs a separate scoped approval.
- Fallback: Local scheduler or local script with no external write.
- Source: https://developers.google.com/apps-script/guides/services/quotas; checked 2026-08-18T13:35:00Z.
- Confidence score: 0.5. Official documentation checked on 2026-08-18; live account/project state was not checked.

### CAP-GGL-007 — Google Colaboratory (Colab)
- Status: HUMAN_BRIDGE; access mode: WEB_UI.
- Cost/billing: Free resources are not guaranteed; no paid Colab tier is authorized; UNKNOWN — no billing or account state was inspected.
- Account/region: Free Tier; Global (including Italy/EEA).
- Quota: Free resources, idle timeout, maximum VM lifetime, hardware and usage limits vary and are not fixed guarantees. Scope: Account/session and current availability. Period: UNKNOWN.
- Privacy/data: Colab/Drive account terms and authorization govern data handling; the FAQ does not establish a universal privacy or retention guarantee.
- Guard: HIGH_RISK_FORBIDDEN: Automated headless execution, background proxy tunneling, torrenting, or scraping violates Colab ToS and results in runtime ban.
- Fallback: Local execution; no background, headless or multi-account automation.
- Source: https://research.google.com/colaboratory/faq.html; checked 2026-08-18T13:35:00Z.
- Confidence score: 0.5. Official documentation checked on 2026-08-18; live account/project state was not checked.

### CAP-GGL-008 — Firebase Spark Plan
- Status: UNKNOWN; access mode: API.
- Cost/billing: Spark no-cost quotas require no payment method; features or usage outside those documented quotas may require Blaze billing; UNKNOWN — verify the project is Spark-only and not linked to Cloud Billing.
- Account/region: Spark Plan (No cost); Global (multi-region).
- Quota: Cloud Firestore examples: 1 GiB stored, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day and 10 GiB/month outbound transfer; these are project-level no-cost quotas. Scope: Firebase project; exactly one free Cloud Firestore database per project.. Period: Daily quotas reset around midnight Pacific time; verify current documentation..
- Privacy/data: Pricing and Firestore quota pages do not establish a universal training exclusion, DPA configuration or security-rules posture. Verify terms and project settings before storing anything above C1.
- Guard: No Firebase call was performed; any data write requires a separate scoped card and approval.
- Fallback: Local SQLite, JSON or other local persistence.
- Source: https://firebase.google.com/pricing; checked 2026-08-18T13:35:00Z.
- Confidence score: 0.5. Official documentation checked on 2026-08-18; live account/project state was not checked.

## Routing rules

- No Google programmatic dispatch is approved by this registry. CAP-GGL-001, CAP-GGL-006 and CAP-GGL-008 remain UNKNOWN until their account/project and side-effect gates are proven.
- CAP-GGL-002, CAP-GGL-003, CAP-GGL-005 and CAP-GGL-007 are HUMAN_BRIDGE routes only; no cookies, headless browsers, scraping or session-token handling.
- CAP-GGL-004 is BLOCKED because Vertex AI is a billing-dependent cloud route under STRICT_ZERO_CARD.
- NotebookLM privacy, Firebase data isolation, EEA/API-client eligibility, preview availability and commercial/media rights remain evidence gates, not approvals.
- The registry keeps UJ-CAP-001 and UJ-GGL-001 at REVIEW with accepted weight 0/13; no downstream task is unlocked.

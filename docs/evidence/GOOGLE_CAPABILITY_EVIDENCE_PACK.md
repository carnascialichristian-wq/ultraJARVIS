# ultraJARVIS — Google Capability Evidence Pack

- Document: UJ-EVD-GGL-001
- Task: UJ-GGL-001
- Status: REVIEW (not accepted)
- Verified at: 2026-08-18T10:28:31Z
- Source commit named by Gemini: 3611b1b400cf57b5021bab228a3de9470d6eca5c
- Data class: C0/C1 only

> Corrected candidate. It records UNKNOWN/HUMAN_BRIDGE/BLOCKED instead of inventing account-specific quotas, privacy guarantees, commercial rights or fixed product limits.

## 1. Policy gate

- No Google API call, paid request, billing activation, account creation or production write was performed.
- No consumer browser automation, cookies, session tokens, scraping or secrets are permitted.
- This pack does not unlock dependent tasks. Accepted weight remains 0/13.

## 2. Evidence rules

- A rate-limit page is not an account quota snapshot.
- Product names do not prove access, quota, preview status or commercial rights.
- Re-check primary pages and the actual account/project immediately before use.
- Italy is in the EEA; Google API terms contain region-specific data-use language, so broad free-tier wording cannot be applied to an EEA account without reading current terms.

## 3. Official source register

| Source | What it supports |
|---|---|
| [Gemini API rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) | RPM/TPM/RPD, project scope, reset behavior, variability and AI Studio check. |
| [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) | Free/paid distinction and model/pricing context. |
| [Gemini API terms](https://ai.google.dev/gemini-api/terms) | Unpaid review/improvement language and EEA/CH/UK caveat. |
| [Gemini models](https://ai.google.dev/gemini-api/docs/models) | Dynamic model catalog only; no entitlement inference. |
| [AI Studio](https://aistudio.google.com/) | Human-bridge entry point and active-limit check. |
| [Vertex quotas](https://cloud.google.com/vertex-ai/generative-ai/docs/quotas) | Blocked cloud route; no project quota queried. |
| [ADK docs](https://google.github.io/adk-docs/) | SDK reference only; no free quota claim. |
| [A2A protocol](https://a2a-protocol.org/) | Separate protocol; not Gemini Live. |
| [Gemini Live API](https://ai.google.dev/gemini-api/docs/live) | Separate live/audio reference; no free quota claim. |
| [NotebookLM support](https://support.google.com/notebooklm/) | Support entry point; fixed limits/privacy remain UNKNOWN. |
| [Colab FAQ](https://research.google.com/colaboratory/faq.html) | Free-resource variability, no guarantee, idle deletion/lifetime controls. |
| [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas) | Per-user quotas, reset semantics and examples. |
| [Firebase pricing](https://firebase.google.com/pricing) | Spark/Blaze boundary and Firestore no-cost examples. |

## 4. Findings

### 4.1 Gemini Developer API — CAP-GGL-001

- ACTIVE only for an eligible unpaid project with billing disabled and a current free-quota check.
- Limits are model-specific RPM/TPM/RPD, project-scoped rather than API-key-scoped, not guaranteed, and may be more restricted for preview/experimental models. Exact values must be checked in AI Studio.
- RPD reset is documented at midnight Pacific Time. No numeric quota is asserted for this account.
- Cost is zero only while the project remains unpaid and within current free quota. Billing activation is a hard stop.
- Terms distinguish unpaid and paid services: unpaid content may be used to improve products and may receive human review; for EEA/Switzerland/UK users paid-service data-use terms apply to all services, including free access. Verify current account/region terms before C1.
- A model name such as gemini-3.7-flash does not prove access, quota, preview status or rights.

### 4.2 AI Studio — CAP-GGL-002

- HUMAN_BRIDGE only; manual redacted prompts and documented controls.
- Do not infer API limits from the UI; account/model/region limits remain UNKNOWN.

### 4.3 Consumer Gemini — CAP-GGL-003

- HUMAN_BRIDGE only. No UI automation, scraping, cookies, session tokens or reverse-engineered endpoints.
- Consumer quotas/data controls are account/region/plan dependent and unasserted.

### 4.4 Vertex AI — CAP-GGL-004

- BLOCKED under STRICT_ZERO_CARD: billing/project entitlement is not authorized.
- No billing, project mutation or paid call was performed.

### 4.5 ADK, A2A and Live — separate capabilities

- ADK is an SDK/integration reference; A2A is a separate protocol; Gemini Live API is a separate live/audio product.
- No free quota, paid entitlement, deployment, external tool execution or commercial-rights claim is made.
- Status remains PREVIEW/UNKNOWN pending focused primary-source and repository review.

### 4.6 NotebookLM — CAP-GGL-005

- HUMAN_BRIDGE; fixed notebook/chat/audio limits, training/privacy and export guarantees are UNKNOWN without the current support article plus account view.
- Do not upload C2+ or sensitive personal data.

### 4.7 Colab — CAP-GGL-007

- Free resources are not guaranteed or unlimited; usage limits fluctuate; VMs may be deleted idle and maximum lifetime is enforced.
- The original fixed 12 hours claim is removed. Colab is not a guaranteed compute backend.

### 4.8 Apps Script — CAP-GGL-006

- Official consumer examples: 90 min/day trigger runtime, 20,000 URL Fetch/day, 100 email recipients/day, 6 min/execution and 30 simultaneous executions/user.
- Consumer and Workspace quotas differ, can change, and many reset 24 hours after first request; not a universal midnight reset.
- Only documented no-cost quota use is eligible.

### 4.9 Firebase Spark — CAP-GGL-008

- Spark is the no-cost route; Blaze/paid features are a hard stop.
- Firestore examples: 1 GiB stored, 10 GiB/month outbound, 20,000 writes/day, 50,000 reads/day, 20,000 deletes/day.
- These are project-level/current-pricing examples, not a claim that all Firebase services are free.

### 4.10 Labs/media

- Imagen, Veo and image previews are names, not proof of entitlement or commercial rights.
- Availability, preview status, quotas, regional access and rights remain UNKNOWN until the exact current model/terms page and account entitlement are checked.

## 5. Routing table

| Route | Status | Zero-cost posture | Missing proof |
|---|---|---|---|
| Gemini API free/unpaid | ACTIVE | Unpaid + current project quota only | AI Studio snapshot, region/account terms |
| AI Studio | HUMAN_BRIDGE | Manual only | Current account controls |
| Vertex AI | BLOCKED | Billing prohibited | Separate authorization |
| NotebookLM | HUMAN_BRIDGE | Manual/redacted | Current support limits/privacy |
| Colab | HUMAN_BRIDGE | Manual/non-guaranteed | Current account limits |
| Apps Script | ACTIVE | Documented no-cost quotas | Account type/current page |
| Firebase Spark | ACTIVE | Spark only/project quotas | Project plan/security review |
| Live/A2A/ADK/media | PREVIEW/UNKNOWN | No automatic activation | Focused source/entitlement review |

## 6. Original-resend corrections

- Original response IDs used UJ-RESP-...; repository schema requires UJ-RESPONSE-....
- Original packets used strings/wrong object shapes, wrong task_ledger_delta type, and incompatible verification/policy/handoff fields.
- Original line-wrapped registry JSON failed direct parse until whitespace repair.
- Original artifact hashes/byte counts did not match extracted final bytes and had no final newline.
- Fixed universal quota/privacy/rights claims were narrowed or marked dynamic/UNKNOWN.

## 7. Review gate

- Reviewer: Grok.
- Packet: docs/program/packets/UJ-RESP-GGL-001-GEMINI.json.
- Proposed status: REVIEW; accepted weight 0/13; dependents remain blocked.

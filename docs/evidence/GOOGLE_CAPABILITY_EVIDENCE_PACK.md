# ultraJARVIS — Google Capability Evidence Pack (corrected)

- Document: UJ-EVD-GGL-001
- Task: UJ-GGL-001
- Status: REVIEW; accepted weight remains 0/13
- Corrected at: 2026-08-18T13:35:00Z
- Governing source commit: 3611b1b400cf57b5021bab228a3de9470d6eca5c
- Data class: C0/C1 only

## Scope and policy boundary

This pack is evidence for routing review. It is not an architecture approval, billing authorization, account login, external write approval or downstream-task unlock.

- No Google API call, paid request, billing activation, account creation, project mutation, consumer UI automation, cookie/session handling or secret access was performed.
- A 429/RESOURCE_EXHAUSTED response is not proof of a particular billing state. A zero-cost route requires a current project/account check and a disabled paid fallback.
- Consumer surfaces are HUMAN_BRIDGE only. ADK/A2A/local code are not model entitlements. Preview labels do not grant production or commercial rights.
- Unpaid-service privacy language is not universal. For Italy/EEA, the current Google API terms and the exact account/client context must be checked before dispatch.

## Official source register

- [Gemini API rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) — current tier/account/project limits, AI Studio view, variability and reset context.
- [Gemini API terms](https://ai.google.dev/gemini-api/terms) — Unpaid/Paid Services data-use wording and EEA/Switzerland/UK treatment.
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) — free/paid product context; not an account snapshot.
- [Gemini models](https://ai.google.dev/gemini-api/docs/models) — model catalog only; no entitlement or commercial-rights inference.
- [AI Studio](https://aistudio.google.com/) — manual entry point and live project-limit location.
- [Vertex quotas](https://cloud.google.com/vertex-ai/generative-ai/docs/quotas) — paid cloud route reference; no project queried.
- [ADK docs](https://google.github.io/adk-docs/) — framework reference; no free model entitlement.
- [A2A protocol](https://a2a-protocol.org/) — separate protocol; no Google quota or external-write authorization.
- [Gemini Live API](https://ai.google.dev/gemini-api/docs/live) — separate live/audio product; availability and limits remain account/model dependent.
- [NotebookLM support](https://support.google.com/notebooklm/) — support entry point only; exact privacy/limits citation still missing.
- [Colab FAQ](https://research.google.com/colaboratory/faq.html) — free resources are variable and not guaranteed.
- [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas) — per-user quotas, reset semantics and examples.
- [Firebase pricing](https://firebase.google.com/pricing) and [Firestore quotas](https://firebase.google.com/docs/firestore/quotas) — Spark boundary and Firestore no-cost examples.
- [Google Labs](https://labs.google.com/) — product entry point only; rollout, terms and rights remain unverified.

## Corrected capability findings

### Gemini Developer API

- Status: UNKNOWN candidate, not ACTIVE approval.
- The official rate-limit page describes model/tier/account/project-dependent limits, exposes current limits in AI Studio and warns that published limits are not guaranteed. Current project quota and billing state were not inspected.
- Zero-cost use is conditional on a demonstrably unpaid project within its current quota. Do not enable billing or automatic paid fallback.
- The API terms describe Unpaid Services content use and possible human review. They state that the Paid Services data-use section applies to all Services for EEA, Switzerland and UK users even when access is free. Send only redacted C0/C1 material until the exact terms and account context are checked.

### Google AI Studio

- Status: HUMAN_BRIDGE only. Use manual, redacted prompts; do not infer API quotas from the UI and do not automate the consumer session.
- Account, project, region, storage and data-use terms remain unverified.

### Vertex AI

- Status: BLOCKED under STRICT_ZERO_CARD because it is a billing-dependent cloud route.
- No claim is made here about enterprise training exclusion, DPA configuration, commercial rights or a particular quota.

### ADK and A2A

- ADK is a framework reference; A2A is a separate protocol. Neither proves free Gemini model access, account entitlement, quota, privacy isolation or permission to execute external tools.
- Local protocol/framework research only. Any network call, model call, tool execution or external write requires its own scoped card and evidence.

### Gemini Live API

- Status: PREVIEW/UNKNOWN for this program. It is a separate live/audio surface; model access, regions, quotas, terms, data handling and commercial/media rights were not verified for the account.
- No WebSocket call, audio/video processing or production approval was performed.

### NotebookLM

- Status: HUMAN_BRIDGE only; fixed limits, export guarantees and privacy/training treatment remain UNKNOWN.
- The support homepage alone does not support a universal training-exclusion claim. Attach the exact dated privacy/FAQ article plus applicable consumer or Workspace terms before using it for C1 material. Until then use only redacted C0/C1 content.

### Colab

- Status: HUMAN_BRIDGE only. Google says free resources are not guaranteed or unlimited, usage limits fluctuate, and idle timeout, maximum VM lifetime and available hardware vary.
- No fixed 30–90 minute idle claim is retained. No background, headless, proxy-tunnel or multi-account automation is authorized.

### Firebase Spark / Cloud Firestore

- Status: UNKNOWN/evidence only; no project plan or billing-link snapshot was supplied.
- Firebase pricing documents Spark no-cost use without a payment method for documented services, but features or usage outside those quotas may require Blaze. Firestore documents one free database per project, 1 GiB stored data, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day and 10 GiB/month outbound transfer; quotas are project-level and reset around midnight Pacific time.
- These numbers do not make all Firebase services free and do not prove a privacy/DPA/security-rules configuration. Any write needs a separate scoped card and approval.

### Apps Script / Workspace

- Status: UNKNOWN/evidence only; account type and side-effect authorization were not inspected.
- The current quota table is per user, account-type dependent, subject to change and generally resets 24 hours after the first request. Consumer examples include 6 minutes/execution, 90 minutes/day trigger runtime, 20,000 URL Fetch/day, 100 email recipients/day and 30 simultaneous executions/user; Workspace values differ.
- A trigger, webhook, OAuth grant, document write, email or external request is a side effect even when the documented quota has no separate usage fee. No such side effect is authorized here.

### Labs and generative media

- Status: UNKNOWN/PREVIEW/HUMAN_BRIDGE depending on the exact product and account. Product names do not prove rollout, quota, privacy, model status or commercial/media rights.
- No media generation was performed. Exact model terms, preview restrictions and rights must be checked before any use.

## Review and missing-evidence gates

The following remain open before a downstream task can be unblocked:

1. Live AI Studio project snapshot: plan, billing link, API-key tier and current quota view.
2. Current Italy/EEA account and API-client terms check.
3. Exact dated NotebookLM privacy/FAQ citation and applicable account terms.
4. Firebase Spark-only project evidence and security/data-boundary review.
5. Account-type and side-effect approval for every Apps Script trigger, webhook, OAuth grant or write.
6. Exact Live/Labs/media model availability, preview and commercial-rights evidence.
7. Strict JSON serialization, schema/hash checks and independent Grok ReviewResult.

## ResponsePacket handoff

- ResponsePacket: docs/program/packets/UJ-RESPONSE-GGL-001-GEMINI-001.json
- Proposed transition: REVIEW; accepted weight 0/13.
- Reviewer: GROK.
- UJ-INF-001, UJ-ADK-001, UJ-KNW-001, UJ-MED-001 and UJ-MEM-001 remain blocked by their existing dependencies.

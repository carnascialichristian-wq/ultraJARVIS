ultraJARVIS Multi-Provider Capability Registry

Document Identifier: UJ-DOC-CAP-001
Document Version: 1.1.0
Verification Date: 2026-08-18T13:35:00Z
Architectural Policy: STRICT_ZERO_CARD
Governing Commit: 3611b1b400cf57b5021bab228a3de9470d6eca5c

1. Executive Summary & Policy Boundary

This registry catalog specifies all AI capabilities and integration surfaces
across the four primary ecosystem providers evaluated for the ultraJARVIS
multi-agent architecture:

1.  OpenAI / ChatGPT
2.  Anthropic / Claude
3.  Google / Gemini
4.  xAI / Grok

1.1 Policy Mandate: STRICT_ZERO_CARD

Under strict operational rules, ultraJARVIS mandates:

  - Zero Incremental Cost: No pay-per-use APIs with active billing, monthly
    overage, or credit card attachments.
  - Zero Consumer UI Scraping: No headless browser automation
    (Puppeteer/Playwright/Selenium), session token extraction, cookie replay, or
    reverse-engineered private web APIs.
  - Human Bridge Protocol: Consumer web interfaces and interactive subscription
    entitlements are operated strictly via manual human operator routing
    (HUMAN_BRIDGE).
  - Data Privacy Distinction: provider, region, account, and plan terms must be recorded for every external surface. Unpaid-service training/review claims must not be generalized across regions, and confidential project data must be excluded until the applicable terms are verified.
  - Zero Secret Embedding: No live API keys, secrets, or bearer tokens in
    version-controlled artifacts.
  - Zero Heavy Local Inference: No unvetted, resource-draining local model
    execution.

2. Status Taxonomy

Each capability is assigned one of the following authoritative statuses:

  - ACTIVE: Fully verifiable, sanctioned programmatic API or protocol requiring
    zero credit card, zero consumer UI automation, and operating within verified
    free quotas.
  - HUMAN_BRIDGE: Interactive consumer web UI, desktop client, or manual export
    mechanism operated solely by a human operator without automated session
    hijacking.
  - PREVIEW: Experimental or developer-preview capability requiring manual
    configuration, subject to dynamic capacity or restricted access.
  - BLOCKED: Capability requires active credit card attachment, pay-as-you-go
    billing, commercial paid subscription outside zero-card bounds, or violates
    Terms of Service.
  - DEPRECATED: Capability or endpoint officially deprecated by the provider.
  - UNKNOWN: Unverifiable entitlement or quota without authoritative primary
    documentation.

3. Multi-Provider Capability Matrix

| Capability ID | Provider  | Product / Interface         | Access Mode     | Status         | Incremental Cost          | Billing Requirement    | Primary Quota / Limit                  | Primary Source                                                                                               |
| :------------ | :-------- | :-------------------------- | :-------------- | :------------- | :------------------------ | :--------------------- | :------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `CAP-OAI-001` | OpenAI    | ChatGPT Web UI              | `WEB_UI`        | `HUMAN_BRIDGE` | $0.00 (Existing Sub/Free) | `NO_BILLING`           | Dynamic 3h rolling cap                 | [OpenAI Pricing](https://openai.com/chatgpt/pricing)                                                         |
| `CAP-OAI-002` | OpenAI    | OpenAI Developer API        | `API`           | `BLOCKED`      | Pay-per-use               | `CREDIT_CARD_REQUIRED` | Tier-dependent (Prepaid)               | [OpenAI Rate Limits](https://platform.openai.com/docs/guides/rate-limits)                                    |
| `CAP-OAI-003` | OpenAI    | ChatGPT Data Controls       | `MANUAL_EXPORT` | `HUMAN_BRIDGE` | $0.00                     | `NO_BILLING`           | On-demand export                       | [OpenAI Help](https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data)       |
| `CAP-OAI-004` | OpenAI    | Custom GPTs & Actions       | `WEB_UI`        | `HUMAN_BRIDGE` | $0.00 (Subscription)      | `EXISTING_SUB`         | Plus message quota                     | [OpenAI GPTs](https://openai.com/index/introducing-gpts/)                                                    |
| `CAP-ANT-001` | Anthropic | Claude Web UI & Artifacts   | `WEB_UI`        | `HUMAN_BRIDGE` | $0.00 (Existing Sub/Free) | `NO_BILLING`           | Dynamic 5h rolling cap                 | [Anthropic Limits](https://support.anthropic.com/en/articles/8325612-does-claude-ai-have-any-message-limits) |
| `CAP-ANT-002` | Anthropic | Anthropic Messages API      | `API`           | `BLOCKED`      | Pay-per-use               | `CREDIT_CARD_REQUIRED` | Tier-dependent (Prepaid)               | [Anthropic Rate Limits](https://docs.anthropic.com/en/api/rate-limits)                                       |
| `CAP-ANT-003` | Anthropic | Claude Projects             | `HUMAN_BRIDGE`  | `HUMAN_BRIDGE` | $0.00 (Pro Sub)           | `EXISTING_SUB`         | 200k context sandbox                   | [Anthropic Projects](https://support.anthropic.com/en/articles/9517075-what-are-projects)                    |
| `CAP-ANT-004` | Anthropic | Model Context Protocol      | `SDK`           | `PREVIEW`      | $0.00 (Open Source)       | `NO_BILLING`           | Localhost execution                    | [MCP Protocol](https://modelcontextprotocol.io/)                                                             |
| `CAP-GGL-001` | Google | Gemini Developer API Free | `API` | `ACTIVE` | $0.00 only while unbilled | `NO_BILLING` | Dynamic RPM/TPM/RPD; live project snapshot required | [Google AI Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)                                   |
| `CAP-GGL-002` | Google    | Google AI Studio Playground | `WEB_UI`        | `HUMAN_BRIDGE` | $0.00                     | `NO_BILLING`           | Project Free Quota                     | [Google AI Studio](https://aistudio.google.com)                                                              |
| `CAP-GGL-003` | Google    | Gemini Consumer Web App     | `WEB_UI`        | `HUMAN_BRIDGE` | $0.00 (Existing Sub/Free) | `NO_BILLING`           | Consumer web caps                      | [Gemini Web](https://gemini.google.com)                                                                      |
| `CAP-GGL-004` | Google    | Cloud Vertex AI             | `API`           | `BLOCKED`      | Pay-per-use               | `CREDIT_CARD_REQUIRED` | Cloud Quotas (Billed)                  | [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)                                              |
| `CAP-GGL-005` | Google    | Google NotebookLM           | `WEB_UI`        | `HUMAN_BRIDGE` | $0.00                     | `NO_BILLING`           | Dynamic rolling limits (`UNKNOWN` SLA) | [NotebookLM Support](https://support.google.com/notebooklm/)                                                 |
| `CAP-GGL-006` | Google    | Google Apps Script          | `API`           | `ACTIVE`       | $0.00                     | `NO_BILLING`           | 6m exec / 24h rolling user quotas      | [Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas)                       |
| `CAP-GGL-007` | Google    | Google Colab Free Tier      | `WEB_UI`        | `HUMAN_BRIDGE` | $0.00                     | `NO_BILLING`           | Dynamic ephemeral VM (no SLA)          | [Colab FAQ](https://research.google.com/colaboratory/faq.html)                                               |
| `CAP-GGL-008` | Google    | Firebase Spark Plan         | `API`           | `ACTIVE`       | $0.00 (Zero Card)         | `NO_BILLING`           | 50k reads, 20k writes/day (Spark only) | [Firebase Pricing](https://firebase.google.com/pricing)                                                      |
| `CAP-XAI-001` | xAI       | Grok Web UI on X            | `WEB_UI`        | `HUMAN_BRIDGE` | $0.00 (X Premium)         | `EXISTING_SUB`         | Dynamic 2h rolling cap                 | [X Grok Help](https://help.x.com/en/using-x/grok)                                                            |
| `CAP-XAI-002` | xAI       | xAI Developer API           | `API`           | `BLOCKED`      | Pay-per-use               | `CREDIT_CARD_REQUIRED` | Tier-dependent (Prepaid)               | [xAI Docs](https://docs.x.ai/docs/overview)                                                                  |
| `CAP-XAI-003` | xAI       | Grok Real-Time Search       | `HUMAN_BRIDGE`  | `HUMAN_BRIDGE` | $0.00 (X Premium)         | `EXISTING_SUB`         | Governed by Grok Web UI                | [X Grok Help](https://help.x.com/en/using-x/grok)                                                            |

4. Granular Provider Capability Profiles

4.1 OpenAI Ecosystem

  - CAP-OAI-001 (ChatGPT Web Interface):

      - Access Mode: WEB_UI via https://chatgpt.com.
      - Authentication: Interactive browser session (OAuth / Session Cookie).
      - Entitlement: Consumer Subscription / Free Account.
      - Cost & Billing: $0.00 incremental cost. No API billing account required.
      - Quota Scope & Period: Dynamic rolling 3-hour message cap per user
        session.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://openai.com/chatgpt/pricing.
      - Data & Privacy Policy: Default consumer terms permit model training on
        free and plus tiers unless opted out via Data Controls.
      - UI Automation Risk: CRITICAL / FORBIDDEN. Scraping or browser session
        automation is strictly prohibited under OpenAI Terms of Service and
        triggers account termination.
      - Status: HUMAN_BRIDGE.

  - CAP-OAI-002 (OpenAI REST API):

      - Access Mode: API via https://api.openai.com/v1.
      - Entitlement: Developer API Entitlement.
      - Cost & Billing: Pay-as-you-go. Requires active credit card or prepaid
        credit deposit.
      - Status: BLOCKED under STRICT_ZERO_CARD.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://platform.openai.com/docs/guides/rate-limits.

  - CAP-OAI-003 (ChatGPT Data Controls Export):

      - Access Mode: MANUAL_EXPORT via Settings > Data Controls.
      - Entitlement: Consumer Account Feature.
      - Cost & Billing: $0.00.
      - Status: HUMAN_BRIDGE. Manual download of conversations.json for offline
        multi-agent indexing.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data.

  - CAP-OAI-004 (Custom GPTs & Actions):

      - Access Mode: WEB_UI via https://chatgpt.com/gpts.
      - Entitlement: Consumer Plus/Team Subscription.
      - Status: HUMAN_BRIDGE.

4.2 Anthropic Ecosystem

  - CAP-ANT-001 (Claude Web UI & Artifacts):

      - Access Mode: WEB_UI via https://claude.ai.
      - Authentication: Interactive human browser session.
      - Entitlement: Consumer Free / Pro Subscription.
      - Cost & Billing: $0.00 incremental cost. No API credit card required.
      - Quota Scope & Period: Dynamic rolling 5-hour message quota scaling by
        conversation length.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://support.anthropic.com/en/articles/8325612-does-claude-ai-have-any-message-limits.
      - Data & Privacy Policy: Commercial terms exclude prompt training without
        explicit opt-in.
      - UI Automation Risk: CRITICAL / FORBIDDEN. Headless browser control is
        strictly prohibited.
      - Status: HUMAN_BRIDGE.

  - CAP-ANT-002 (Anthropic Messages API):

      - Access Mode: API via https://api.anthropic.com/v1/messages.
      - Entitlement: Developer API Entitlement.
      - Cost & Billing: Pay-per-token. Requires pre-purchased credits / payment
        method.
      - Status: BLOCKED under STRICT_ZERO_CARD.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://docs.anthropic.com/en/api/rate-limits.

  - CAP-ANT-003 (Claude Projects):

      - Access Mode: HUMAN_BRIDGE via https://claude.ai/projects.
      - Entitlement: Consumer Pro Subscription.
      - Status: HUMAN_BRIDGE. 200k token project context window managed manually
        by operator.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://support.anthropic.com/en/articles/9517075-what-are-projects.

  - CAP-ANT-004 (Model Context Protocol - MCP):

      - Access Mode: SDK via local stdio / SSE transport.
      - Entitlement: Open Source Specification.
      - Cost & Billing: $0.00. No billing or external cloud accounts required.
      - Status: PREVIEW. Standardized local IPC protocol for connecting agent
        runtimes to local tools.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://modelcontextprotocol.io/.

4.3 Google Ecosystem

  - CAP-GGL-001 (Gemini Developer API Free Tier):

      - Access Mode: API via https://generativelanguage.googleapis.com/v1beta.
      - Authentication: API Key generated in Google AI Studio.
      - Entitlement: Developer API Free Tier (Unpaid Project without Billing
        Account).
      - Cost & Billing: $0.00 only while the project remains Free/unbilled. A 429/RESOURCE_EXHAUSTED response is not, by itself, proof of every account's billing state; block paid fallback and verify the project before dispatch.
      - Quota & Rate Limit Specification:
          - Model: Model-specific and dynamic (e.g. gemini-2.5-flash,
            gemini-2.5-pro, gemini-3.7-flash). Quotas (RPM, TPM, RPD) vary
            dynamically based on model, account verification status, and project
            allocation. Without an active project snapshot, exact live rate
            limits are marked UNKNOWN and must be checked in Google AI Studio.
          - Project: Google Cloud Project linked in AI Studio.
          - Account: Standard Google Developer Account.
          - Tier: Free Tier (Unpaid).
          - Region: Check the current official region list, account, and terms at dispatch; a country-count headline does not prove API-client eligibility.
          - Period: Per-minute and daily windows as documented by Google; describe the reset as Pacific time without hard-coding a daylight-saving UTC offset.
          - Scope: Per Google Cloud Project (shared across all keys within the
            project).
          - Capacity Notice: Published free-tier rate limits represent upper
            bounds, not guaranteed system capacity.
      - Data & Privacy Policy: Google's Gemini API Additional Terms describe content use and possible human review for Unpaid Services. They also state that the Paid Services data-use section applies to all Services for users in the EEA, Switzerland, or the UK even when access is free. Verify the current account, project tier, region, and terms before dispatch. C2+ data MUST NOT be submitted; redact to C0/C1.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://ai.google.dev/gemini-api/docs/rate-limits,
        https://ai.google.dev/gemini-api/terms, and
        https://ai.google.dev/gemini-api/docs/pricing.
      - Status: ACTIVE.

  - CAP-GGL-002 (Google AI Studio Web Playground):

      - Access Mode: WEB_UI via https://aistudio.google.com.
      - Entitlement: Developer Console Playground.
      - Status: HUMAN_BRIDGE. Used for manual prompt engineering, testing system
        instructions, and generating code templates.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://aistudio.google.com.

  - CAP-GGL-003 (Gemini Consumer Web App):

      - Access Mode: WEB_UI via https://gemini.google.com.
      - Entitlement: Consumer Free / Google One AI Premium ($19.99/mo).
      - Status: HUMAN_BRIDGE.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://gemini.google.com.

  - CAP-GGL-004 (Google Cloud Vertex AI):

      - Access Mode: API via https://cloud.google.com/vertex-ai.
      - Entitlement: Enterprise Cloud API.
      - Cost & Billing: Pay-as-you-go billed usage. Requires active GCP Billing
        Account with payment card.
      - Status: BLOCKED under STRICT_ZERO_CARD.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://cloud.google.com/vertex-ai/pricing.

  - CAP-GGL-005 (Google NotebookLM):

      - Access Mode: WEB_UI via https://notebooklm.google.com.
      - Entitlement: Consumer Labs Service.
      - Cost & Billing: $0.00. No billing required.
      - Quota: Exact notebook limits and daily chat quotas are UNKNOWN (not
        published as guaranteed static SLAs by Google; managed dynamically
        server-side).
      - Data & Privacy Policy: Per official NotebookLM FAQ, uploaded sources and
        notes are NOT used to train Google AI models.
      - UI Automation Risk: CRITICAL / FORBIDDEN. Scraping or headless
        automation is prohibited.
      - Status: HUMAN_BRIDGE.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://support.google.com/notebooklm/.

  - CAP-GGL-006 (Google Apps Script):

      - Access Mode: API / Serverless Execution via https://script.google.com.
      - Entitlement: Workspace Platform Feature.
      - Cost & Billing: $0.00. Included with standard Google account.
      - Quotas: Execution timeout: 6 min/execution. Daily quotas are per-user
        and reset on a rolling 24-hour window from the first request (Consumer
        @gmail.com: 20,000 UrlFetch calls/day, 90 min/day trigger time, 100
        email recipients/day; Workspace: 100,000 UrlFetch calls/day, 6 hours/day
        trigger time, 1,500 email recipients/day).
      - Status: ACTIVE. Sanctioned programmatic serverless engine.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://developers.google.com/apps-script/guides/services/quotas.

  - CAP-GGL-007 (Google Colaboratory Free Tier):

      - Access Mode: WEB_UI via https://colab.research.google.com.
      - Entitlement: Hosted Jupyter Environment.
      - Cost & Billing: $0.00.
      - Quota: Dynamic, un-guaranteed ephemeral VM (variable CPU/GPU/RAM). No
        guaranteed session duration; VMs may be preempted/terminated at any moment; idle timeout, maximum VM lifetime, available hardware, and usage limits are not published as fixed values and vary over time.
      - UI Automation Risk: CRITICAL / FORBIDDEN. Automated headless execution,
        background proxy tunneling, or multi-account abuse violates Colab ToS.
      - Status: HUMAN_BRIDGE.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://research.google.com/colaboratory/faq.html.

  - CAP-GGL-008 (Firebase Spark Plan):

      - Access Mode: API via Firebase Admin SDK / REST.
      - Entitlement: Cloud Backend Free Tier (Spark Plan ONLY; strictly
        separated from Blaze Plan).
      - Cost & Billing: Spark has no payment method requirement for its documented no-cost quotas. This is not a universal guarantee for every Firebase product or usage path; features outside the Spark quotas can require Blaze billing.
      - Quotas: One free Cloud Firestore database per project; 1 GiB stored data; 50,000 document reads/day; 20,000 document writes/day; 20,000 document deletes/day; 10 GiB outbound bandwidth/month. Daily quotas reset around midnight Pacific Time.
      - Privacy: Pricing/quota evidence does not establish a universal training exclusion or DPA configuration; verify the applicable terms before storing data above C1.
      - Status: ACTIVE (conditional; evidence only).
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://firebase.google.com/pricing and https://firebase.google.com/docs/firestore/quotas.

4.4 xAI Ecosystem

  - CAP-XAI-001 (Grok Web UI on X):

      - Access Mode: WEB_UI via https://x.com/i/grok or https://grok.com.
      - Authentication: Interactive X user login (X Premium / Premium+).
      - Entitlement: Consumer Platform Subscription.
      - Cost & Billing: $0.00 incremental cost beyond existing X subscription.
      - Quota Scope & Period: Dynamic rolling 2-hour window message cap.
      - UI Automation Risk: CRITICAL / FORBIDDEN. Scraping or browser automation
        violates X Terms of Service and results in account suspension.
      - Status: HUMAN_BRIDGE.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://help.x.com/en/using-x/grok.

  - CAP-XAI-002 (xAI Developer Platform API):

      - Access Mode: API via https://api.x.ai/v1.
      - Entitlement: Developer API Entitlement.
      - Cost & Billing: Pay-per-token. Requires pre-purchased credits / payment
        method.
      - Status: BLOCKED under STRICT_ZERO_CARD.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://docs.x.ai/docs/overview.

  - CAP-XAI-003 (Grok Real-Time Search & Reasoning):

      - Access Mode: HUMAN_BRIDGE via Grok Web Interface.
      - Entitlement: Consumer Platform Subscription.
      - Status: HUMAN_BRIDGE. Real-time web/social synthesis operated manually.
      - Verification: Verified 2026-08-18T13:35:00Z via
        https://help.x.com/en/using-x/grok.

5. Architectural Routing Decision Table

| Task Modality                                  | Preferred Primary Engine                 | Access Method               | Fallback Engine                             | Fallback Method                               |
| :--------------------------------------------- | :--------------------------------------- | :-------------------------- | :------------------------------------------ | :-------------------------------------------- |
| **Zero-Cost Automated Text / Code Generation** | `CAP-GGL-001` (Gemini Flash API Free)    | Programmatic REST API       | `CAP-ANT-001` (Claude Web UI)               | Human Bridge Manual Relay                     |
| **Complex Reasoning & Code Architecture**      | `CAP-ANT-001` (Claude 3.5/3.7 Sonnet)    | Human Bridge Manual Relay   | `CAP-OAI-001` (ChatGPT Plus / o3-mini)      | Human Bridge Manual Relay                     |
| **Real-Time News & Live Web Grounding**        | `CAP-XAI-001` (Grok 2/3 Web on X)        | Human Bridge Manual Relay   | `CAP-GGL-001` (Gemini API with Grounding\*) | Programmatic API / Search (\*Subject to tier) |
| **Document Synthesis & Study Dossiers**        | `CAP-GGL-005` (NotebookLM)               | Human Bridge Manual Relay   | `CAP-ANT-003` (Claude Projects)             | Human Bridge Manual Relay                     |
| **Zero-Cost Structured Metadata Storage**      | `CAP-GGL-008` (Firebase Spark Firestore) | Programmatic Admin SDK      | Local SQLite / JSON Flat-file               | Local Disk Storage                            |
| **Serverless Scheduled Triggers / Webhooks**   | `CAP-GGL-006` (Google Apps Script)       | Programmatic Webhook / Cron | Local Cron Script                           | Local Host Process                            |

6. Verification Summary & Maintenance Contract

1.  Continuous Validation: Quota allocations and tier boundaries are subject to
    change by providers without notice. All programmatic clients must implement
    graceful backoff on HTTP 429 (Too Many Requests) and route to Human Bridge
    fallback.
2.  Data Sanitization Mandate: Any payload dispatched to CAP-GGL-001 (Gemini
    Developer API Free Tier) must be free of credentials, API secrets,
    proprietary intellectual property, or identifiable personal data (PII).
3.  No Unilateral Weight Acceptance: This deliverable is submitted under task
    UJ-CAP-001 with accepted weight remaining 0/13 pending independent peer
    review by CLAUDE.

## Corrections and admission gates

- CAP-GGL-001 is conditionally usable only for redacted C0/C1 internal evaluation on a demonstrably unbilled project. A 429 response is not, by itself, proof that every account state is non-billable.
- EEA/Switzerland/UK use requires a current terms and API-client eligibility check; do not describe the free tier as universally permitted for an EEA-facing product.
- CAP-GGL-005 remains HUMAN_BRIDGE, but its privacy statement is UNKNOWN until an exact dated NotebookLM policy/FAQ citation is attached.
- CAP-GGL-006 technical execution is documented, but triggers, webhooks, OAuth grants, and document writes require a separate side-effect approval.
- CAP-GGL-008 is Spark/project-level only. No-cost Firestore quotas do not make every Firebase product or configuration free.
- Dynamic quotas, preview model availability, and commercial rights must be rechecked at dispatch time; this registry does not unblock downstream tasks.

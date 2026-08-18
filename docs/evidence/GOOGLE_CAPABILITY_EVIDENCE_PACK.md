ultraJARVIS Google Capability Evidence Pack

Document Identifier: UJ-EVD-GGL-001
Document Version: 1.1.0
Verification Date: 2026-08-18T13:35:00Z
Author / Specialist: Gemini (Google Ecosystem, Knowledge & Cloud Feasibility
Architect)
Assigned Task: UJ-GGL-001 (Accepted Weight: 0/13, Peer Reviewer: GROK)
Governing Architectural Policy: STRICT_ZERO_CARD
Target Commit: 3611b1b400cf57b5021bab228a3de9470d6eca5c

1. Scope, Purpose & Policy Boundary

This evidence pack provides an exhaustive technical and legal-feasibility
assessment of the Google Ecosystem for integration within the ultraJARVIS
multi-agent architecture.

1.1 Strict Zero Card Compliance Rules

Under the governing STRICT_ZERO_CARD mandate:

  - No Financial Commitment: Zero credit card registration, zero pay-per-use
    billing accounts, zero post-paid invoicing.
  - Billing State Gate: The evidence must prove that the selected project/plan is unbilled and that no paid fallback or automatic billing path is enabled. A 429/RESOURCE_EXHAUSTED response alone is not a universal no-charge guarantee.
  - No Consumer UI Scraping: All consumer-facing surfaces (gemini.google.com,
    notebooklm.google.com, colab.research.google.com, labs.google.com) are
    strictly designated as HUMAN_BRIDGE or PREVIEW. Automated headless browsing,
    session hijacking, or cookie extraction is strictly prohibited.
  - Transparent Data Privacy Disclosures: provider, region, account, and plan terms must be cited at claim level. Do not generalize Unpaid Services wording to all regions; EEA/Switzerland/UK users require the current Paid Services data-use terms check even when access is free.
  - No Unilateral Architectural Decisions: This document provides evidence only
    and does NOT unblock blocked tasks (UJ-INF-001, UJ-MEM-001, UJ-KNW-001,
    UJ-MED-001, UJ-ADK-001).

2. Google Capability Evidence Profiles

2.1 Google Gemini Developer API (Free Tier)

  - Product: Google Gemini Developer API
  - Access Path: https://generativelanguage.googleapis.com/v1beta (REST / gRPC)
  - Account Needed: Standard Google Account (Developer)
  - Region: availability and API-client eligibility must be checked against the current official region list, account, and terms; do not infer eligibility from a country-count headline.
  - Subscription vs API: Developer API Entitlement (Unpaid Free Tier)
  - Cost: $0.00 USD incremental cost
  - Billing Requirement: NO_BILLING (Project remains unpaid without linked Cloud
    Billing Account)
  - Quota Specification:
      - Model: Model-dependent and dynamically allocated (e.g. gemini-2.5-flash,
        gemini-2.5-pro, gemini-3.7-flash). Rate limits vary by model, project
        age, account verification tier, and global cluster load. Without an
        active project snapshot, exact live rate limits are marked UNKNOWN and
        must be checked live in Google AI Studio.
      - Project: Bound to Google Cloud Project created in Google AI Studio.
      - Account: Individual Google Developer Account.
      - Tier: Free Tier (Unpaid).
      - Region: Check the current official region list, account, and terms at dispatch; do not infer API-client eligibility from a country-count headline.
      - Quota Period: Per-minute and daily windows as documented by Google; keep the reset description as Pacific time rather than hard-coding a daylight-saving UTC offset.
      - Quota Scope: Per Google Cloud Project (shared across all API keys
        generated in that project).
      - Capacity Guarantee: Published free quotas represent maximum ceiling
        limits, NOT guaranteed system capacity; high-demand periods may return
        HTTP 503.
  - Rate Limit Enforcement: Requests can return HTTP 429 RESOURCE_EXHAUSTED when quota or capacity is exhausted. Zero-charge eligibility still requires a verified unbilled project, no paid key, and no automatic paid fallback.
  - Strict Zero Card Eligibility: ELIGIBLE (ACTIVE only after the live account gate). The evidence pack does not prove the selected project is currently unbilled.
  - Allowed Automation: Programmatic REST/gRPC API calls via official Google
    GenAI SDKs (google-genai), curl, or custom HTTP clients.
  - Prohibited Automation: Automated multi-account pooling to bypass daily
    project quotas, reselling raw grounded search responses.
  - Privacy & Data Usage Policy: Google's Gemini API Additional Terms describe content use and possible human review for Unpaid Services. They also state that the Paid Services data-use section applies to all Services for users in the EEA, Switzerland, or the UK even when access is free. Verify the current account, project tier, region, and terms before dispatch; C2+ data MUST NOT be submitted and payloads must be reduced to C0/C1.
  - Data Sanitization Mandate: No PII, private API secrets, or unredacted
    confidential code may be transmitted to the Free Tier endpoint.
  - Export Capabilities: Programmatic JSON payloads, token usage metadata, and
    streaming SSE responses.
  - Commercial & Media Rights: Commercial use permitted for outputs generated
    from General Availability (GA) models; Preview models restricted from
    production use per Additional Terms.
  - Status: ACTIVE
  - Fallback: Route to Human Bridge (gemini.google.com or Claude Web UI) or
    local offline processing upon 429 exhaustion.
  - Unneeded Products: Google Cloud Billing Account, Vertex AI Enterprise Agent
    Platform.
  - Official Source: Google AI Rate Limits | Gemini API Terms | Gemini API
    Pricing
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: MEDIUM (primary terms and rate-limit documentation were checked, but live project state and regional/account conditions were not observed).

2.2 Google AI Studio Web Playground

  - Product: Google AI Studio (Web IDE)
  - Access Path: https://aistudio.google.com
  - Account Needed: Standard Google Account
  - Region: Current availability is account- and rollout-dependent; verify the live NotebookLM account and applicable consumer/Workspace terms.
  - Subscription vs API: Developer Web Console / Prototyping Interface
  - Cost: $0.00 USD
  - Billing Requirement: NO_BILLING
  - Quota Specification: Shares the Free Tier developer rate limits of the
    active linked Google Cloud Project.
  - Rate Limit Enforcement: Web UI presents notification banners and disables
    prompt dispatch upon quota exhaustion.
  - Strict Zero Card Eligibility: ELIGIBLE (HUMAN_BRIDGE).
  - Allowed Automation: Strictly manual human interaction for prompt
    engineering, model tuning testing, and system instructions design.
  - Prohibited Automation: Headless browser automation (Playwright/Puppeteer),
    session token harvesting, automated UI form filling.
  - Privacy & Data Usage Policy: Data handling depends on the current account/project terms. The Gemini API terms describe Unpaid Services data use and apply Paid Services data-use terms to EEA/Switzerland/UK users even when access is free; use only redacted C0/C1 material until verified. Prompt files may also be saved to Google Drive.
  - Data Usage: Prompts saved in Google Drive under AI Studio folder.
  - Export Capabilities: Export prompt to Python, JavaScript, cURL, Kotlin,
    Swift, or system instruction JSON.
  - Commercial & Media Rights: Prototyping and workflow development.
  - Status: HUMAN_BRIDGE
  - Fallback: Direct API client execution via CAP-GGL-001.
  - Unneeded Products: Third-party UI automation harnesses.
  - Official Source: Google AI Studio | AI Studio Quickstart
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: HIGH

2.3 Google Cloud Vertex AI

  - Product: Google Cloud Vertex AI (Model Garden & Agent Builder)
  - Access Path: https://cloud.google.com/vertex-ai
  - Account Needed: Google Cloud Organization / Project with Linked Cloud
    Billing Account
  - Region: Global multi-region Google Cloud endpoints
  - Subscription vs API: Enterprise Cloud API (Pay-as-you-go)
  - Cost: Pay-per-token (e.g., $0.075 to $15.00 per 1M tokens depending on model
    and tier)
  - Billing Requirement: CREDIT_CARD_REQUIRED (Must have active payment
    instrument)
  - Quota Specification: Enterprise quotas managed via Google Cloud Quotas
    console (300 to 1,000+ RPM).
  - Rate Limit Enforcement: Standard cloud infrastructure limits with automated
    monthly billing invoices.
  - Strict Zero Card Eligibility: INELIGIBLE (BLOCKED). Violates the fundamental
    zero-card policy constraint.
  - Allowed Automation: Enterprise infrastructure automation (Terraform, Cloud
    IAM, Service Accounts).
  - Prohibited Automation: N/A (Standard Cloud API).
  - Privacy & Data Usage Policy: The cited pricing page does not by itself prove an Enterprise SLA or training exclusion; retain this as a separately sourced Vertex AI claim and keep the capability BLOCKED under STRICT_ZERO_CARD.
  - Data Usage: Encrypted at rest and in transit within GCP VPC perimeters.
  - Export Capabilities: Google Cloud Storage buckets, BigQuery exports, REST
    APIs.
  - Commercial & Media Rights: Full commercial rights under Google Cloud Master
    Agreement.
  - Status: BLOCKED
  - Fallback: Google AI Studio Free Tier (CAP-GGL-001).
  - Unneeded Products: Entire paid Google Cloud Platform suite.
  - Official Source: Vertex AI Pricing | Vertex AI Quotas
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: HIGH

2.4 Google ADK (Agent Development Kit / Frameworks)

  - Product: Google Agent Development Kit (ADK / google-genai Agent Frameworks)
  - Access Path: https://google.github.io/adk-docs/ | GitHub (google-gemini /
    googleapis/python-genai)
  - Account Needed: Developer workstation / runtime environment (Python 3.10+)
  - Region: Global (Local software execution)
  - Subscription vs API: Open-Source Software Library / Framework
  - Cost: $0.00 USD (Library software)
  - Billing Requirement: NO_BILLING for framework; underlying LLM calls route to
    unpaid Developer API (CAP-GGL-001).
  - Quota Specification: Bound by the backing LLM endpoint quotas.
  - Rate Limit Enforcement: Client-side rate limiting and retry handling.
  - Strict Zero Card Eligibility: ELIGIBLE (PREVIEW). Operates entirely locally
    with zero cost.
  - Allowed Automation: Local agent tool dispatch, function calling parsing,
    multi-turn dialogue orchestration.
  - Prohibited Automation: Bypassing underlying API rate limits or executing
    unsafe un-sandboxed shell commands.
  - Privacy & Data Usage Policy: Local framework code executes locally; API
    payloads follow the privacy policy of the configured API key (Free Tier =
    data used for training).
  - Data Usage: Tool execution logs remain on local storage.
  - Export Capabilities: Standard Python objects, structured JSON traces.
  - Commercial & Media Rights: Open-source license (Apache 2.0).
  - Status: PREVIEW (Evaluated for local tooling; does NOT unblock task
    UJ-ADK-001).
  - Fallback: Native Python function-calling routines without framework
    dependencies.
  - Unneeded Products: Vertex AI Agent Builder (Paid Cloud Service).
  - Official Source: Google ADK Docs | Gemini API Python SDK
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: HIGH

2.5 A2A (Agent-to-Agent Communication Protocol)

  - Product: A2A Protocol (Agent-to-Agent Standard Specification)
  - Access Path: https://a2a-protocol.org/
  - Account Needed: Local Developer Runtime
  - Region: Global (Open protocol standard)
  - Subscription vs API: Open Protocol Standard Specification
  - Cost: $0.00 USD (Specification / Open standard)
  - Billing Requirement: NO_BILLING
  - Quota Specification: Bounded solely by local IPC / network transport
    throughput.
  - Rate Limit Enforcement: Configured at the client application layer.
  - Strict Zero Card Eligibility: ELIGIBLE (PREVIEW). Zero financial cost.
  - Allowed Automation: Automated agent-to-agent message negotiation, tool
    discovery, and capability handoff over standard transports
    (HTTP/JSON-RPC/WebSockets).
  - Prohibited Automation: Unvetted execution of arbitrary remote code payloads.
  - Privacy & Data Usage Policy: P2P / Agent-to-agent payloads remain within the
    host network perimeter unless routed to external cloud endpoints.
  - Data Usage: Local message serialization.
  - Export Capabilities: JSON-LD / JSON-RPC structured capability descriptors.
  - Commercial & Media Rights: Open specification.
  - Status: PREVIEW (Evaluated as architectural protocol; separate from Gemini
    Live API).
  - Fallback: Direct Python function dispatching.
  - Unneeded Products: Proprietary multi-agent SaaS orchestrators.
  - Official Source: A2A Protocol Specification
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: HIGH

2.6 Gemini Live API (Multimodal Bidirectional WebSocket)

  - Product: Gemini Live API (Bidirectional Multimodal WebSocket Streaming)
  - Access Path:
    wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent
  - Account Needed: Standard Google Account (Developer)
  - Region: Supported Developer API preview regions
  - Subscription vs API: Developer API Preview Entitlement
  - Cost: $0.00 USD under Free Tier Preview allocation
  - Billing Requirement: NO_BILLING for Free Tier Preview; billing must NOT be
    enabled.
  - Quota Specification:
      - Model: gemini-2.5-flash-native-audio-preview /
        gemini-3.1-flash-live-preview
      - Project: Unpaid Google Cloud Project in AI Studio
      - Account: Developer Google Account
      - Tier: Free Tier Preview
      - Region: Preview regions
      - Quota Period: Highly restricted concurrent sessions and low RPM (exact
        limits dynamic and subject to peak capacity throttling).
      - Quota Scope: Per project.
  - Rate Limit Enforcement: Immediate connection close or 1008 Policy Violation
    / HTTP 429 upon saturation.
  - Strict Zero Card Eligibility: ELIGIBLE (PREVIEW). Strict zero-card
    compliance maintained only while billing is not linked.
  - Allowed Automation: Real-time bidirectional streaming of raw PCM audio
    chunks and video frames via client WebSockets.
  - Prohibited Automation: Telephony robocalling, background eavesdropping, or
    bypassing preview limits.
  - Privacy & Data Usage Policy: Audio streams processed under Free Tier Terms
    are subject to data logging and product improvement.
  - Data Usage: Ephemeral streaming buffers.
  - Export Capabilities: Real-time PCM audio streams (24kHz output, 16kHz input)
    and text transcripts.
  - Commercial & Media Rights: Non-production preview license; commercial
    deployment prohibited for preview models per Additional Terms.
  - Status: PREVIEW
  - Fallback: Standard asynchronous text/multimodal REST generateContent API.
  - Unneeded Products: Cloud Speech-to-Text, Vertex AI Live endpoints.
  - Official Source: Gemini Live API Guide | Gemini API Terms
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: HIGH

2.7 Google NotebookLM

  - Product: Google NotebookLM (Grounded Document Assistant)
  - Access Path: https://notebooklm.google.com
  - Account Needed: Standard Google Account / Google Workspace Account
  - Region: Current availability and account/terms eligibility must be checked at dispatch.
  - Subscription vs API: Consumer Labs Web Application
  - Cost: $0.00 USD
  - Billing Requirement: NO_BILLING
  - Quota Specification: Exact daily query limits, source token windows, and
    notebook creation caps are marked UNKNOWN as Google does not publish fixed
    static SLA quotas. Rate limiting is managed dynamically on the consumer web
    interface.
  - Rate Limit Enforcement: Web UI displays rate limit warning banner upon
    reaching dynamic daily cap.
  - Strict Zero Card Eligibility: ELIGIBLE (HUMAN_BRIDGE).
  - Allowed Automation: Strictly manual interaction by human operator.
  - Prohibited Automation: Headless browser scraping, automated document bulk
    uploading via unofficial endpoints.
  - Privacy & Data Usage Policy: The current NotebookLM privacy statement must be attached as an exact dated primary citation. The support landing page in this pack is insufficient to prove a universal training exclusion; until verified, treat privacy as UNKNOWN and upload only C0/C1 redacted material.
  - Data Usage: Ingested into an account-bound semantic index sandbox only as an operational description; it is not a legal isolation guarantee.
  - Export Capabilities: Export notes to Google Docs, copy Markdown text,
    download Audio Overview .wav / .mp3 files.
  - Commercial & Media Rights: Research and personal synthesis; rights dependent
    on user's underlying uploaded documents.
  - Status: HUMAN_BRIDGE (Evidence only; does NOT unblock task UJ-KNW-001).
  - Fallback: Local retrieval-augmented generation (RAG) using Gemini Developer
    API (CAP-GGL-001).
  - Unneeded Products: Commercial enterprise document search platforms.
  - Official Source: NotebookLM Support | NotebookLM Official Site
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: MEDIUM

2.8 Google Colaboratory (Colab)

  - Product: Google Colaboratory
  - Access Path: https://colab.research.google.com
  - Account Needed: Standard Google Account
  - Region: Global (including Italy / EEA)
  - Subscription vs API: Hosted Jupyter Notebook Execution Environment
  - Cost: $0.00 USD (Free Tier)
  - Billing Requirement: NO_BILLING
  - Quota Specification:
      - Compute Allocation: Ephemeral VM (dynamic CPU / GPU allocation based on
        availability).
      - Runtime Duration: Variable and un-guaranteed; VMs may be preempted or
        disconnected at any moment based on overall cluster demand.
      - Idle Timeout: Google does not publish a fixed value; idle timeouts, maximum VM lifetime, hardware availability, and usage limits vary over time.
      - Resource Caps: Dynamic prioritization for active interactive users; zero
        guaranteed GPU availability.
  - Rate Limit Enforcement: Runtime disconnection, backend throttling, CAPTCHA
    prompts on rapid reconnects.
  - Strict Zero Card Eligibility: ELIGIBLE (HUMAN_BRIDGE).
  - Allowed Automation: Interactive execution of Jupyter cells by a human user.
  - Prohibited Automation: Automated headless execution, background proxy
    tunneling, remote SSH tunneling, torrenting, cryptocurrency mining,
    denial-of-service scripts, multi-account pooling.
  - Privacy & Data Usage Policy: Code executes inside a private ephemeral
    virtual machine; scratch disk files are destroyed upon VM termination.
  - Data Usage: Google Drive integration requires user authorization.
  - Export Capabilities: Download .ipynb, export .py, commit directly to GitHub,
    download generated artifact files.
  - Commercial & Media Rights: Code and outputs belong to the user, subject to
    open-source licenses of installed packages.
  - Status: HUMAN_BRIDGE
  - Fallback: Local execution via ultraJARVIS local Python interpreter.
  - Unneeded Products: Paid Cloud Compute Engine instances, Colab Pro+.
  - Official Source: Colab FAQ
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: HIGH

2.9 Firebase (Spark Plan ONLY)

  - Product: Firebase Cloud Firestore & Authentication (Spark Plan)
  - Access Path: https://firebase.google.com / Firebase Admin SDK
  - Account Needed: Google Account linked to Firebase Project
  - Region: Global multi-region / regional Firestore instances (e.g., nam5,
    eur3)
  - Subscription vs API: Backend-as-a-Service Free Tier (Spark Plan ONLY)
  - Cost: Spark no-cost quotas require no payment method, but features or usage outside those quotas can require Blaze billing; do not describe the whole Firebase surface as hard-capped at zero.
  - Billing Requirement: NO_BILLING (No payment card required on Spark plan)
  - Quota Specification:
      - Database Instances: Exactly 1 free Cloud Firestore database per project.
      - Stored Data: 1 GiB total storage.
      - Document Reads: 50,000 per day.
      - Document Writes: 20,000 per day.
      - Document Deletes: 20,000 per day.
      - Outbound Bandwidth: 10 GiB per month.
      - Quota Reset: Around midnight Pacific time; quotas are project-level.
      - Billing Boundary: These are Spark/Firestore no-cost quotas, not a guarantee that every Firebase feature or configuration is free.
  - Rate Limit Enforcement: Firestore enforces the documented no-cost quotas; excess operations or unsupported features can be rejected or require a billing-enabled plan. Verify the Spark project state before dispatch.
  - Strict Zero Card Eligibility: ELIGIBLE (ACTIVE). Ideal for lightweight
    structured metadata tracking and memory registries.
  - Allowed Automation: Programmatic data synchronization via official Firebase
    Admin SDK (Node.js/Python) or REST API.
  - Prohibited Automation: Automated creation of excess databases;
    high-throughput stress testing exceeding Spark quotas; Cloud Functions
    execution (requires Blaze plan).
  - Privacy & Data Usage Policy: Pricing/quota evidence does not establish a universal training exclusion or DPA configuration. Verify the applicable Firebase and Google Cloud privacy terms and the project configuration before storing anything above C1.
  - Data Usage: Stored in Google Cloud Firestore infrastructure.
  - Export Capabilities: JSON structured backup via Admin SDK or Google Cloud
    Storage export.
  - Commercial & Media Rights: Full ownership of database records.
  - Status: ACTIVE (Evidence only; does NOT unblock task UJ-MEM-001).
  - Fallback: Local SQLite / JSON flat-file state persistence on disk.
  - Unneeded Products: Firebase Blaze Plan, Cloud SQL, Supabase Pro.
  - Official Source: Firebase Pricing | Firestore Quotas
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: MEDIUM

2.10 Google Workspace & Google Apps Script

  - Product: Google Apps Script & Workspace Serverless Triggers
  - Access Path: https://script.google.com
  - Account Needed: Standard Google Account (@gmail.com) / Google Workspace
    Account (@domain.com)
  - Region: Global
  - Subscription vs API: Serverless Execution Platform
  - Cost: $0.00 USD (Included with standard Google Account)
  - Billing Requirement: NO_BILLING
  - Quota Specification:
      - Execution Timeout: 6 minutes maximum runtime per execution.
      - Daily Per-User Quotas (per official table; reset 24 hours after the first request, and subject to change):
          - Trigger Total Runtime: 90 min/day (Consumer @gmail.com) vs 6
            hours/day (Google Workspace).
          - URL Fetch Calls: 20,000 calls/day (Consumer) vs 100,000 calls/day
            (Google Workspace).
          - Email Daily Recipients: 100 recipients/day (Consumer) vs 1,500
            recipients/day (Google Workspace).
          - Simultaneous Executions: 30 concurrent executions per user.
  - Rate Limit Enforcement: Script throws Service invoked too many times or
    Exceeded maximum execution time exception and terminates gracefully.
  - Strict Zero Card Eligibility: ELIGIBLE (ACTIVE). Provides zero-cost cron
    triggers, webhook listeners, and document manipulation.
  - Allowed Automation: Scheduled time-driven triggers, spreadsheet event
    triggers (onEdit), web app HTTP endpoints (doGet/doPost).
  - Prohibited Automation: Unbounded high-frequency loops, multi-account
    spamming, bypassing quotas.
  - Privacy & Data Usage Policy: Scripts execute within the user's account
    boundary; access to user data requires explicit OAuth consent grant.
  - Data Usage: Execution logs retained in Apps Script execution history / Cloud
    Logging.
  - Export Capabilities: Code export via clasp (Command Line Apps Script
    Projects), GitHub push, raw .gs file download.
  - Commercial & Media Rights: Full ownership of script code and generated
    Google Docs/Sheets/Drive artifacts.
  - Status: ACTIVE
  - Fallback: Local Python/Node scripts executed via system task scheduler
    (cron).
  - Unneeded Products: Paid Zapier, Make.com, or AWS Lambda instances.
  - Official Source: Apps Script Quotas
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: HIGH

2.11 Google Labs & Experimental AI Tools

  - Product: Google Labs (ImageFX, MusicFX, VideoFX, Illuminate)
  - Access Path: https://labs.google.com
  - Account Needed: Standard Google Account
  - Region: Selected eligible countries (subject to geo-rollout)
  - Subscription vs API: Consumer Experimental Web Surfaces
  - Cost: $0.00 USD
  - Billing Requirement: NO_BILLING
  - Quota Specification: Dynamic session quotas and daily generation limits
    managed by Google Labs backend.
  - Rate Limit Enforcement: Generation button disabled with countdown timer when
    limits are reached.
  - Strict Zero Card Eligibility: ELIGIBLE (PREVIEW via Human Bridge).
  - Allowed Automation: Strictly manual interactive prompt testing.
  - Prohibited Automation: Automated scraping bots, batch prompt fuzzing,
    multi-account abuse.
  - Privacy & Data Usage Policy: Labs terms state that prompts, generated media,
    and user feedback are actively used to train and refine Google AI models.
  - Data Usage: Outputs embedded with SynthID digital watermarking.
  - Export Capabilities: Download generated .png, .mp3, .mp4 media files.
  - Commercial & Media Rights: Experimental / non-commercial license generally
    applies under Labs terms.
  - Status: PREVIEW
  - Fallback: Local open-source models (e.g. Stable Diffusion / Whisper) or GA
    API endpoints.
  - Unneeded Products: Paid Midjourney, Runway, or ElevenLabs subscriptions.
  - Official Source: Google Labs | Google Generative AI Additional Terms
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: HIGH

2.12 Google Generative Media Models (Imagen 3 / Veo 3.1)

  - Product: Google Generative Media Models (imagen-3.0-generate-002,
    veo-3.1-generate-preview)
  - Access Path: Google AI Studio Developer API
    (https://generativelanguage.googleapis.com/v1beta)
  - Account Needed: Standard Google Account (Developer)
  - Region: Supported Google AI Studio regions
  - Subscription vs API: Developer API Generative Media Preview Entitlement
  - Cost: $0.00 USD within limited Free Tier / Preview allocation; otherwise
    paid pay-per-image.
  - Billing Requirement: NO_BILLING for Free Tier / Preview; must NOT link
    billing account.
  - Quota Specification: Dynamic rate limits measured in Images Per Minute (IPM)
    or Requests Per Day (RPD). Daily quotas reset at 00:00 Pacific Time.
  - Rate Limit Enforcement: API returns HTTP 429 RESOURCE_EXHAUSTED upon quota
    exhaustion.
  - Strict Zero Card Eligibility: ELIGIBLE (PREVIEW). Operates under strict
    zero-card constraints as long as billing remains disabled.
  - Allowed Automation: Programmatic image generation and editing requests via
    Google GenAI SDK.
  - Prohibited Automation: Generation of prohibited content (deepfakes, CSAM,
    violence) violating Generative AI Prohibited Use Policy; automated quota
    flooding.
  - Privacy & Data Usage Policy: Free-tier prompts and generated media are
    subject to Google product improvement terms; SynthID watermarks are
    imperceptibly embedded.
  - Data Usage: Base64 image payloads transmitted over TLS.
  - Export Capabilities: Base64 encoded PNG/JPEG data, streaming video download
    URLs.
  - Commercial & Media Rights: Commercial usage permitted for GA models; Preview
    models restricted from production use per Additional Terms.
  - Status: PREVIEW (Evidence only; does NOT unblock task UJ-MED-001).
  - Fallback: Human operator manual creation via ImageFX or local open-source
    image generation pipelines.
  - Unneeded Products: Paid OpenAI DALL-E 3 API, Midjourney API proxies.
  - Official Source: Gemini Generative Media Models | Gemini API Terms
  - Timestamp (UTC): 2026-08-18T13:35:00Z
  - Confidence: HIGH

3. Comparative Synthesis & Architectural Feasibility

| Google Surface                    | Integration Path         | Status         | Cost            | Quota Safety                      | Privacy & Data Risk                             | Architectural Verdict                                                |
| :-------------------------------- | :----------------------- | :------------- | :-------------- | :-------------------------------- | :---------------------------------------------- | :------------------------------------------------------------------- |
| **Gemini Developer API (Free)** | Programmatic REST | `ACTIVE` | $0.00 only while unbilled | Live quota/account check; 429 alone is not a billing proof | **Conditional** (terms/region/account dependent; C2+ prohibited) | **Conditionally eligible for redacted C0/C1 internal evaluation only** |
| **Google AI Studio (Playground)** | Manual Web IDE | `HUMAN_BRIDGE` | $0.00 only while unbilled | Live project quota; not guaranteed | **Conditional; account/region terms required** | **Manual prompt engineering only; no sensitive data** |
| **Google Cloud Vertex AI** | Programmatic Cloud | `BLOCKED` | Pay-per-use | Billed dynamically (Overrun Risk) | **Separate SLA evidence required** | **REJECTED: Violates STRICT\_ZERO\_CARD mandate**                    |
| **Google ADK (Frameworks)** | Local Python Runtime | `PREVIEW` | $0.00 library cost | Bound to configured API tier | **Inherits API/terms risk** | **Local evaluation only; UJ-ADK-001 remains blocked** |
| **A2A Protocol** | Open Protocol | `PREVIEW` | $0.00 specification cost | Local transport limits only | **Depends on deployment topology** | **Local protocol research only; no external entitlement or write approval** |
| **Gemini Live API** | Bidirectional WebSocket | `PREVIEW` | Unknown until entitlement check | Preview limits/capacity not guaranteed | **Terms/account dependent** | **Evidence only; no production or sensitive-media use** |
| **Google NotebookLM** | Manual Web App | `HUMAN_BRIDGE` | $0.00 | Dynamic limits (`UNKNOWN` SLA) | **UNKNOWN until exact policy citation** | **Evidence only; manual dossier synthesis remains blocked** |
| **Google Colaboratory** | Interactive Jupyter VM | `HUMAN_BRIDGE` | $0.00 | Dynamic ephemeral VM; not guaranteed | **Account/Drive terms required** | **Manual research only; no headless/background automation** |
| **Firebase (Spark Plan)** | Programmatic Admin SDK | `ACTIVE` | $0.00 Spark quotas | Project-level no-cost quotas; outside features may bill | **Terms/configuration check required** | **Evidence only; Spark-only metadata persistence remains blocked** |
| **Google Apps Script** | Serverless Webhooks/Cron | `ACTIVE` | $0.00 documented quotas | Account/product quotas; may change | **OAuth/data-boundary check required** | **Conditionally eligible; every trigger/webhook/external write needs explicit approval** |
| **Google Labs Tools** | Manual Web App | `PREVIEW` | Account/rollout dependent | Dynamic caps; not guaranteed | **Terms/rollout dependent** | **Manual evidence only; no automatic media workflow** |
| **Generative Media Models** | Programmatic REST | `PREVIEW` | Unknown until entitlement check | Dynamic limits; no safety guarantee | **Terms/model dependent** | **Evidence only; UJ-MED-001 remains blocked** |

4. Evidence Pack Attestation

1.  Strict Zero-Card Boundary: This pack does not enable billing or paid services. Any capability described as eligible remains conditional on a verified unbilled project/plan, current terms, and no paid fallback; no financial-overage guarantee is inferred from a quota error.
2.  Blocked Tasks Integrity: This evidence pack does NOT unblock UJ-INF-001,
    UJ-MEM-001, UJ-KNW-001, UJ-MED-001, or UJ-ADK-001. All blocked tasks remain
    in BLOCKED status in the project task ledger.
3.  Weight Allocation: Submitted under task UJ-GGL-001 with accepted weight
    remaining 0/13 pending independent peer review by GROK.

## 5. Missing evidence and acceptance gates

The following items were missing from Gemini's submission and must be completed before any downstream task is unblocked:

1. Exact primary URLs or anchors and access dates for every quota, privacy, preview, and commercial-rights claim; landing pages are not sufficient for legal assertions.
2. A live AI Studio project snapshot showing the selected project is Free/unbilled, with no paid API key or automatic paid fallback.
3. A region/account/terms check for Italy/EEA API-client eligibility; do not infer this from a country-count headline.
4. An exact dated NotebookLM privacy/FAQ citation plus the applicable consumer or Workspace terms.
5. Firebase evidence that the project is Spark-only, with no billing link; keep the privacy/training claim separate from pricing evidence.
6. A side-effect approval for any Apps Script trigger, webhook, OAuth grant, document write, or outbound message.
7. Model-specific GA/preview availability and commercial-rights checks for Live and generative-media surfaces.
8. Clean JSON serialization, schema validation, byte-level hash verification, and independent peer review.

These gates are evidence requirements; they do not change the task ledger or unblock UJ-INF-001, UJ-MEM-001, UJ-KNW-001, UJ-MED-001, or UJ-ADK-001.

# GEMINI CORRECTION REQUEST — UJ-CAP-001 + UJ-GGL-001

**Version:** 2026-08-18 — corrective resend after quarantine
**Repository:** `carnascialichristian-wq/ultraJARVIS`
**Channel:** HUMAN_BRIDGE

## Admission result

The previous attachment `Pasted markdown(3).md` is **REVIEW_BLOCKED**. It contains 3 complete FILE blocks, 1 truncated block, 4 absent declared files, and 0 ResponsePacket blocks. The CAP JSON parses, but the delivery is not evidence-complete and cannot be admitted.

This prompt supersedes the old instruction to return eight files or all seven Gemini tasks. The current backlog has only two Gemini tasks in `READY`:

- `UJ-CAP-001`, reviewer `CLAUDE`, accepted weight must remain `0/13`;
- `UJ-GGL-001`, reviewer `GROK`, accepted weight must remain `0/13`.

`UJ-INF-001`, `UJ-MEM-001`, `UJ-KNW-001`, `UJ-MED-001`, and `UJ-ADK-001` are dependency-blocked. Do not produce, claim, or unlock them in this resend.

## Pinned inputs

Read the card inputs at the pinned Git commit `3611b1b400cf57b5021bab228a3de9470d6eca5c` and report a failure instead of guessing if any hash mismatches:

| Input | SHA-256 |
|---|---|
| `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` | `a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87` |
| `docs/program/SPECIALIST_INPUTS.md` | `72edc3952585fb2c31cafd0fa206ab2e66647d49d3190202adf2eba71593590a` |
| `docs/program/COUNCIL_PACKETS.md` | `eb4d0d0dd46ebdaf07b7ab70380ee80fe0b35da222953f80576749cd3d29ff88` |
| `schemas/response-packet.schema.json` | `ee44e1b7e262bc0817e0b4f65de8830d122687618a59774fdabfddf3b7e69c0a` |

## Exact output envelope

Return exactly these three FILE blocks and two separate ResponsePacket blocks. Do not include any extra artifact, do not use ellipses, and do not put the packet JSON inside a Markdown fence:

=== FILE: docs/program/CAPABILITY_REGISTRY.md ===
<complete Markdown artifact>
=== END FILE ===

=== FILE: docs/program/CAPABILITY_REGISTRY.json ===
<complete JSON artifact>
=== END FILE ===

=== FILE: docs/evidence/GOOGLE_CAPABILITY_EVIDENCE_PACK.md ===
<complete Markdown artifact>
=== END FILE ===

=== RESPONSE PACKET: UJ-CAP-001 ===
<one JSON object valid against ultrajarvis.response-packet/v1>
=== END RESPONSE PACKET ===

=== RESPONSE PACKET: UJ-GGL-001 ===
<one JSON object valid against ultrajarvis.response-packet/v1>
=== END RESPONSE PACKET ===

## CAP corrections

Keep all four primary products in the registry: OpenAI/ChatGPT, Anthropic/Claude, Google/Gemini, and xAI/Grok. For every material capability, make Markdown and JSON agree on:

- capability ID, provider, product, access path and mode;
- explicit subscription-versus-API entitlement separation;
- authentication without secrets;
- plan, account, region, model, project, tier, and period where relevant;
- incremental cost and billing requirement;
- quota/rate-limit scope and fallback;
- exact `verification_time_utc` and an official primary source URL for each current claim;
- conservative status: `ACTIVE`, `HUMAN_BRIDGE`, `PREVIEW`, `BLOCKED`, `DEPRECATED`, or `UNKNOWN`;
- automation/UI risk, data/privacy/export policy, freshness, confidence, and reason.

Do not promote an unknown quota, entitlement, privacy condition, or automation right. Use `UNKNOWN` or `BLOCKED` when it cannot be proven.

## Google evidence corrections

Inventory only the Google capabilities relevant to `UJ-GGL-001`: Gemini API/AI Studio, Vertex AI, ADK/A2A, NotebookLM, Colab, Firebase, Workspace/Apps Script, and Labs/media tools. For each entry distinguish access, account/region, subscription versus API, quota, billing, strict-zero-card eligibility, automation, data/privacy/export, media/commercial rights when relevant, status, and fallback.

Re-check and cite primary sources. At minimum use the canonical pages below where applicable:

- https://ai.google.dev/gemini-api/docs/rate-limits
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/terms
- https://cloud.google.com/vertex-ai/pricing
- https://firebase.google.com/pricing
- https://research.google.com/colaboratory/faq.html
- https://developers.google.com/apps-script/guides/services/quotas

The rate-limit page states that limits vary by model, project, usage tier, and account context and are visible in AI Studio. Do not write universal numbers. If an active limit cannot be pinned to a model/project/tier/account and exact UTC verification time, write `UNKNOWN` or `BLOCKED`.

The pricing page distinguishes free and paid tiers and states that free-tier content may be used to improve products. Do not call a product `100% compliant`, `zero risk`, `production-grade`, or the sole zero-cost engine unless the claim is explicitly scoped, sourced, and qualified. Keep C1/data-policy limitations visible.

Do not turn the evidence inventory into an architecture decision or unlock `UJ-INF-001`.

## ResponsePacket requirements

Create two independent JSON objects conforming to the closed schema `ultrajarvis.response-packet/v1` at the pinned input commit. No additional properties are allowed. Each packet must include every required schema field, including:

`schema_version`, `response_id`, `created_at`, `card_id`, `mission_id`, `ai_id`, `product`, `source_commit_sha`, `capabilities_actually_used`, `task_id`, `status`, `executive_delta`, `facts`, `assumptions`, `decisions_proposed`, `artifacts`, `verification`, `side_effects`, `risks`, `task_ledger_delta`, `remaining_work`, `confidence`, `policy_attestation`, and `handoff`.

Use:

- `ai_id: GEMINI`;
- `mission_id: UJ-MISSION-M0-COUNCIL-001`;
- `card_id: UJ-CARD-CAP-001-GEMINI` with `task_id: UJ-CAP-001`, or `UJ-CARD-GGL-001-GEMINI` with `task_id: UJ-GGL-001`;
- `source_commit_sha: 3611b1b400cf57b5021bab228a3de9470d6eca5c` when those pinned inputs were read;
- `status: REVIEW` only if the relevant artifact and all checks pass; otherwise `BLOCKED` or `FAILED` with precise evidence;
- artifact entries containing the exact path, media type, data class, and SHA-256 of the final bytes;
- verification with concrete checks in `checks_run`, `passed`, `failed`, and `not_run`;
- a task ledger delta that proposes review only and leaves accepted weight at `0/13`;
- policy attestation true only for claims that are actually true: no secrets, no paid API, no billing, no consumer UI automation, no heavy local inference, C1 data class, and within `INTERNAL_WRITE`.

Each packet must prove the five acceptance criteria of its own card. Do not merge the CAP and GGL packets, do not claim Claude/Grok approval, and do not mark either task `DONE`.

## Final preflight

Before sending, verify all of the following:

1. Exactly 3 FILE starts and 3 FILE end markers exist; exactly 2 ResponsePacket starts and 2 ResponsePacket end markers exist.
2. `CAPABILITY_REGISTRY.json` passes `JSON.parse`.
3. Markdown and JSON facts are materially coherent.
4. SHA-256 is computed over the exact final bytes, with final newline state declared explicitly. Do not silently add or remove a newline after hashing.
5. Both packets validate against the pinned closed schema and contain no extra keys.
6. Every material current claim has an official source URL and exact UTC verification time; uncertain claims are `UNKNOWN`/`BLOCKED`.
7. No secret, billing action, paid API call, UI automation, merge, main write, task completion, or weight acceptance occurred.

If any check fails, still return all three complete artifacts and both complete packets, setting the affected packet to `BLOCKED` or `FAILED` and naming the exact failed check. Do not return a partial or truncated delivery.

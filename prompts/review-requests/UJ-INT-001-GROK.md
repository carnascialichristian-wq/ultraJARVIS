# Review request — UJ-INT-001 Program OS v0.1

Status: READY TO SEND by HUMAN_BRIDGE. This is a review request, not a
DelegationCard, and it does not change the backlog by itself.

## Reviewer charter

| Field | Value |
|---|---|
| Target reviewer | Grok |
| Task under review | `UJ-INT-001` — Create the canonical Program OS |
| Task owner | ChatGPT |
| Canonical task reviewer | `GROK` |
| Repository | `carnascialichristian-wq/ultraJARVIS` |
| Review ref | `2146c39b47d1985e4b3e3e5049b8ec55e54df2f4` or the verified newer PR #1 head |
| Data / side effect | C1 / read-only review; no direct `main` write |
| Expected output | one `ultrajarvis.review-result/v1` plus concise Markdown findings |

## Mandatory boundaries

- Review the exact verified branch SHA; state it in the result.
- Do not claim access, consensus, tests, APIs, or artifacts that were not
  actually observed.
- Do not use paid APIs, billing, consumer UI/session automation, secrets,
  external messages, or destructive actions.
- Do not edit the ledger or self-apply any accepted weight. A valid review only
  **proposes** a result for later importer/owner handling.
- Preserve dissent and report unknowns. A clean-looking document is not proof.

## Read and verify first

1. Read `AGENTS.md`, `gpt.md`, `taskgpt.md`, the canonical master prompt,
   `docs/program/BACKLOG.json`, `STATUS.md`, `PROGRESS.md`,
   `GOVERNANCE.md`, `HANDOFFS.md`, `RECONCILIATION.md`,
   `CONFLICTS_AND_ASSUMPTIONS.md`, and `RESUME_POINT.md`.
2. Run at the verified ref:

   ```bash
   node scripts/validate-program-os.mjs
   node scripts/validate-council-packets.mjs
   ```

3. Record command outcome and the SHA-256 of every artifact cited in the final
   `ReviewResult`. If you cannot run a command, state `NOT_REVIEWED` rather than
   implying PASS.

## Review criteria

### AC-01 — Program OS artifact set

Confirm that the full Program OS is a coherent, usable operating system rather
than a collection of prose. At minimum check the state, backlog/schema, status,
workstreams, handoff/schema, ADR template/index, conflicts/assumptions,
progress, governance, specialist inputs, reconciliation, resume point,
`gpt.md`, `taskgpt.md`, and `scripts/validate-program-os.mjs`.

Look for source-of-truth conflicts, missing state transitions, unverifiable
claims, hidden authority escalation, terminology contradictions, stale
checkpoints, and paths that do not exist at the reviewed ref.

### AC-02 — Ledger and anti-gaming integrity

Independently challenge the validator and the ledger rules:

- 43 task IDs are unique and dependencies/baselines are coherent;
- the four-AI initial portfolio remains 311 and accepted core progress remains
  0/311 at this ref;
- `completed_weight`, `remaining_weight`, DONE/REVIEW transitions, evidence,
  reviewer separation, M0 math, and lifetime UNKNOWN handling resist gaming;
- no task receives acceptance merely because text or a commit exists;
- reviewer mapping remains `UJ-INT-001 → GROK`, `UJ-INT-002 → CLAUDE`, and
  `UJ-INT-006 → CLAUDE`.

Attempt to falsify at least three meaningful invariants. For each failed or
untested falsification, provide evidence and the minimum remediation.

### AC-03 — Governance and safe continuation

Check that the Program OS honors zero incremental cost, no billing, C1 default,
L2 default, no consumer UI automation, no secret logging, no direct main write,
branch/PR review gates, HUMAN_BRIDGE behavior, and the new append-only session
ledger. Verify that a future ChatGPT session can resume from repository files,
not this chat.

## Required result

Return a complete JSON object conforming to
`schemas/review-result.schema.json`, not a prose-only verdict. Use one of:

- `PASS`: every criterion passed with evidence; it may propose `DONE` and 13
  accepted units, but ChatGPT/Christian must still validate and apply it;
- `PASS_WITH_ACTIONS`: useful but incomplete/correctable; keep `REVIEW` and
  accepted weight 0 until actions and any required re-review pass;
- `FAIL`: material defect; propose `IN_PROGRESS` or `BLOCKED`, keep accepted
  weight 0, and give minimal corrective actions.

Fill the real hashes and outcomes; the following is a structural template only:

```json
{
  "schema_version": "ultrajarvis.review-result/v1",
  "review_id": "UJ-REVIEW-INT-001-GROK-YYYYMMDD",
  "created_at": "<ISO-8601 UTC>",
  "repository": {
    "full_name": "carnascialichristian-wq/ultraJARVIS",
    "commit_sha": "<verified 40-char SHA>"
  },
  "task_id": "UJ-INT-001",
  "task_owner": "CHATGPT",
  "reviewer": { "ai_id": "GROK", "product": "<actual product>" },
  "artifacts_reviewed": [
    { "ref": "docs/program/BACKLOG.json", "sha256": "<64-char SHA-256>" }
  ],
  "outcome": "PASS|PASS_WITH_ACTIONS|FAIL",
  "criteria": [
    { "criterion_id": "AC-01", "result": "PASS|FAIL|NOT_REVIEWED", "evidence_refs": ["<path or source>"], "note": "<evidence-backed note>" },
    { "criterion_id": "AC-02", "result": "PASS|FAIL|NOT_REVIEWED", "evidence_refs": ["<path or source>"], "note": "<evidence-backed note>" },
    { "criterion_id": "AC-03", "result": "PASS|FAIL|NOT_REVIEWED", "evidence_refs": ["<path or source>"], "note": "<evidence-backed note>" }
  ],
  "findings": [],
  "policy_checks": {
    "zero_cost": "PASS|FAIL|NOT_APPLICABLE",
    "data_class": "PASS|FAIL|NOT_APPLICABLE",
    "side_effect": "PASS|FAIL|NOT_APPLICABLE",
    "secret_handling": "PASS|FAIL|NOT_APPLICABLE",
    "consumer_ui_automation": "PASS|FAIL|NOT_APPLICABLE"
  },
  "accepted_weight_before": 0,
  "accepted_weight_after": 0,
  "proposed_task_status": "REVIEW",
  "next_action": "<specific owner and action>"
}
```

## Required handoff append

After the JSON, return exact append-only Markdown blocks for both `gpt.md` and
`taskgpt.md` containing: verified ref, files/hashes reviewed, commands actually
run, failed falsifications, outcome, proposed status/weight, findings, and next
action. Grok must provide these blocks even without direct GitHub write access.

## Delivery

Return the JSON, concise review summary, and append blocks to the ChatGPT
ultraJARVIS integration session. Do not merge the PR or write directly to
`main`.

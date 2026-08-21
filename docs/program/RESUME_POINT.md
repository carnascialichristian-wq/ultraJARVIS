# RESUME_POINT — program transitions + UJ-SEC-001 gate

Snapshot prepared: 2026-08-21.

Before acting, read `AGENTS.md`, `gpt.md`, `taskgpt.md`, the current
remote ref, and `docs/program/BACKLOG.json`. Append the measured outcome to
both continuity ledgers before ending the next repository session.

## Remote checkpoint before the authorized merge

- Repository: `carnascialichristian-wq/ultraJARVIS`
- Target: `main`
- Main observed before merge: `27b767309090adf77778575fe22840a1584355aa`
- Pull request: #19, draft/open when this checkpoint was written
- Pinned PR head: `704d8efaeb121567088be3106235e827470b18c1`
- Pinned PR tree: `1ff8ebd0d5ff17e6e497ccc4ec8a0adf29105ec4`
- Christian explicitly authorized the merge. The next session must re-read GitHub
  and record the actual merge commit; do not infer it from this file.

## What the PR head contains

- UJ-RED-001 manual ledger transition: `READY -> REVIEW`, still `0/13`.
- `scripts/apply-program-transition.mjs`: dry-run by default; explicit
  `--apply --confirm-task`; schema, identity, commit and artifact-hash gates;
  atomic BACKLOG/STATUS write; validator check and rollback.
- Program transition regression: 5 PASS, including an isolated real apply.
- Dynamic mission/card discovery; six valid cards, including UJ-SEC-001 and
  UJ-CLD-001; all five eligible READY tasks have a card.
- UJ-INT-001 AC-02 distinguishes the named 311 baseline from the current
  nonzero tracked total of 340.

## Verification at the pinned PR tree

- `node scripts/validate-program-os.mjs`: PASS, 43 tasks, baseline 311,
  tracked nonzero 340, accepted 26 (meta-bootstrap only).
- `node scripts/validate-council-packets.mjs`: PASS, 5 schemas, 1 mission,
  6 cards.
- `node scripts/test-review-result-intake.mjs`: PASS, 7 cases.
- `node scripts/test-program-transition.mjs`: PASS, 5 cases.
- `node scripts/test-delegation-card-discovery.mjs`: PASS.
- UJ-SEC-001 commands: typecheck PASS, build PASS, approval policy 28/28 PASS.

## UJ-SEC-001 remains blocked from acceptance

The Grok ReviewResult on PR #22 is not importable: the real intake reports
11 errors, including schema violations, invalid finding IDs, an extra field,
the task still being READY, and an evidence ref absent at its pinned commit.
It also proposes `accepted_weight_after: 0`. Therefore UJ-SEC-001 remains
`READY 0/13`; UJ-MCP-001 and UJ-SKL-001 remain dependency-blocked.

## Exact next gate

1. Claude uses `prompts/delegation-cards/UJ-SEC-001-CLAUDE.json` to publish a
   ResponsePacket that proposes `READY -> REVIEW` with weight unchanged.
2. Grok republishes a schema-valid ReviewResult with canonical 64-hex artifact
   hashes and no extra fields.
3. ChatGPT previews each transition with `apply-program-transition.mjs` and
   applies it only when all pinned checks pass.

No paid API, billing, consumer UI automation, secret access, deployment,
branch deletion, or accepted-weight increase is authorized by this checkpoint.

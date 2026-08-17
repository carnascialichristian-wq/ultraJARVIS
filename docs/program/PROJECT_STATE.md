# PROJECT_STATE v0.1

| Field | Value |
|---|---|
| Program | ultraJARVIS |
| Owner and final approver | Christian |
| State version | 0.1 |
| Baseline date | 2026-08-17 |
| Repository | `carnascialichristian-wq/ultraJARVIS` |
| Observed default branch | `main` at `9d2a93de20a082b384ddb16f88fff4df5e41c7f7` |
| Working ref | `agent/ultrajarvis-master-prompt-v1` at `b8a7697ca69722fe1947e24350752907ee58cfd2` before this task commit |
| Open change | Draft PR #1, canonical prompt and launch README |
| Current milestone | M0 — Canonicalization and initial state |
| Infrastructure mode | `STRICT_ZERO_CARD` (proposed active default; owner acceptance pending in PR #1) |
| Maximum current autonomy | L2 — Sandbox |
| Maximum default data class | C1 — INTERNAL |
| Global ETA | UNKNOWN; no accepted velocity exists |

## Current outcome

The canonical master prompt exists on the draft PR branch and defines the
M0–M17 program, Constitution, four-AI ownership, zero-cost boundary, and initial
311-weight portfolio. The default branch still contains only the original
minimal README. UJ-INT-001 is producing the first machine-readable Program OS;
its artifacts require independent review before accepted weight changes.

## User constraints in force

| ID | Constraint | Classification | Trace |
|---|---|---|---|
| UC-001 | No incremental spend beyond already-owned consumer subscriptions | USER_CONSTRAINT | master prompt §§0, 4, 14 |
| UC-002 | No pay-per-use API, recharge, overage, or hidden billing | USER_CONSTRAINT | master prompt §§3–4, 18 |
| UC-003 | Heavy inference must be cloud-side | USER_CONSTRAINT | master prompt §§0, 4.2 |
| UC-004 | TypeScript, Node.js, and pnpm monorepo | USER_CONSTRAINT | master prompt §§0, 4.3 |
| UC-005 | Private, single-user system and repository | USER_CONSTRAINT | master prompt §§0, 19 |
| UC-006 | Dynamic agents/teams must have limits, contracts, and termination | USER_CONSTRAINT | master prompt §§2, 10 |
| UC-007 | Tools/skills may be created only through review and sandbox gates | USER_CONSTRAINT | master prompt §§12–13 |
| UC-008 | Consumer UI/cookie/session automation is forbidden | USER_CONSTRAINT | master prompt §§3, 6.2 |
| UC-009 | No secret values in prompts, logs, repository, or memory | USER_CONSTRAINT | master prompt §§3, 14–17 |
| UC-010 | Work must be resumable from artifacts and checkpoints, not chat memory | USER_CONSTRAINT | master prompt §§1.2, 7, 31 |

## Accepted and pending decisions

No architectural ADR is APPROVED yet. The following proposals are active but
must not be represented as final decisions:

| Decision | Current state | Gate |
|---|---|---|
| Adopt the Constitution in master prompt v1.0 | PROPOSED / PR REVIEW | Christian accepts or amends PR #1 |
| Use `STRICT_ZERO_CARD` as active infrastructure mode | PROPOSED / PR REVIEW | Christian explicitly confirms |
| Keep GCP billing track disabled | PROPOSED, safe default | owner approval required to change |
| Keep Claude automatic backend BLOCKED | PROPOSED, safe default | UJ-CLD-001 official evidence and review |
| Use accepted task weight for progress | PROPOSED / UJ-INT-001 REVIEW | UJ-REV-004 and Christian review |

## Baseline status

- `UJ-META-001`: DONE, 21/21 accepted, proof is the canonical prompt.
- `UJ-META-002`: REVIEW, 5/8 accepted, awaiting owner review and merge decision.
- `UJ-INT-001`: IN_PROGRESS while these artifacts are drafted; transition to
  REVIEW after a remote commit exists. Accepted weight remains 0/13 until Grok
  review.
- Immediate external work: `UJ-RUN-001` (Claude), `UJ-CAP-001` and
  `UJ-GGL-001` (Gemini), `UJ-RED-001` (Grok).

## M0 critical path

1. Finish and independently review UJ-INT-001.
2. Receive schema-valid specialist artifacts for UJ-RUN-001, UJ-CAP-001,
   UJ-GGL-001, and UJ-RED-001.
3. Resolve or explicitly preserve their conflicts.
4. Obtain Christian's decisions on Constitution and active infrastructure mode.
5. Activate UJ-INT-002 and produce architecture v1 plus approved ADRs.
6. Merge only after PR #1 review gates and M0 ownership/status baseline are
   accepted.

## Active blockers

| Blocker | Affects | Resolver | Safe continuation |
|---|---|---|---|
| Constitution and autonomy ceiling not owner-accepted | UJ-META-002, M0 exit | Christian | keep work draft/L2 |
| `STRICT_ZERO_CARD` not explicitly owner-confirmed | infrastructure ADR | Christian | treat it as safe proposed default; do not enable billing |
| Specialist reports do not yet exist | UJ-INT-002 | Claude, Gemini, Grok via human bridge | finish Program OS and packet contracts |
| Claude Code/Agent SDK/OAuth case unresolved | automatic Claude adapter | Claude UJ-CLD-001 | keep HUMAN_BRIDGE/BLOCKED |
| No measured accepted velocity | all ETA claims | several reviewed tasks | report units and critical path only |

## M0 exit gate snapshot

| Criterion | State | Evidence required |
|---|---|---|
| Every user constraint is traceable | REVIEW | this file + independent review |
| Billing/API conflicts are explicit | REVIEW | conflict log + owner decision |
| No AI has unverified capability claims | OPEN | capability registry review |
| Four owners have READY work | SATISFIED | `BACKLOG.json` |
| Owner can see remaining work | REVIEW | `STATUS.md` and progress validation |


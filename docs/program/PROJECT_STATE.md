# PROJECT_STATE v0.1

| Field | Value |
|---|---|
| Program | ultraJARVIS |
| Owner and final approver | Christian |
| State version | 0.1 |
| Baseline date | 2026-08-17 |
| Repository | `carnascialichristian-wq/ultraJARVIS` |
| Observed default branch | `main` at `9d2a93de20a082b384ddb16f88fff4df5e41c7f7` |
| Working ref | `agent/ultrajarvis-master-prompt-v1`; Council contracts pinned at `3611b1b400cf57b5021bab228a3de9470d6eca5c` |
| Open change | Draft PR #1: canonical prompt, Program OS, and Council packet layer |
| Current milestone | M0 — Canonicalization and initial state |
| Infrastructure mode | `STRICT_ZERO_CARD` (proposed active default; owner acceptance pending in PR #1) |
| Maximum current autonomy | L2 — Sandbox |
| Maximum default data class | C1 — INTERNAL |
| Global ETA | UNKNOWN; no accepted velocity exists |

## Current outcome

The canonical master prompt exists on the draft PR branch and defines the
M0–M17 program, Constitution, four-AI ownership, zero-cost boundary, and initial
311-weight portfolio. The default branch still contains only the original
minimal README. UJ-INT-001 and UJ-INT-006 have submitted the Program OS and
Council packet layer for independent review. The first M0 mission and four
HUMAN_BRIDGE cards are ready; no specialist response has been imported yet.
`gpt.md` and `taskgpt.md` are now the append-only cross-session ledger and
cross-AI briefing. They are mandatory reading and update artifacts, while the
remote branch and `BACKLOG.json` remain authoritative for proof and numbers.
Two copyable review requests now make the named Grok and Claude review gates
actionable through HUMAN_BRIDGE. A ReviewResult intake guard checks the exact
reviewed commit, reviewer, artifact hashes, criteria, and weights before any
separate ledger update; neither mechanism itself awards accepted weight.

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
| UC-011 | Every session must leave a GitHub-published evidence-based resoconto for ChatGPT and the other council AIs | USER_CONSTRAINT | `gpt.md`, `taskgpt.md`, AGENTS session protocol |

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
- `UJ-INT-001`: REVIEW, 0/13 accepted until Grok review.
- `UJ-INT-006`: REVIEW, 0/8 accepted until Claude review; five packet schemas,
  admission rules, one mission, and four Delegation Cards are submitted.
- Immediate external work: `UJ-RUN-001` (Claude), `UJ-CAP-001` and
  `UJ-GGL-001` (Gemini), `UJ-RED-001` (Grok).

## M0 critical path

1. Finish and independently review UJ-INT-001.
2. Deliver the four pinned Delegation Cards by HUMAN_BRIDGE and receive
   schema-valid specialist artifacts for UJ-RUN-001, UJ-CAP-001,
   UJ-GGL-001, and UJ-RED-001.
3. Resolve or explicitly preserve their conflicts.
4. Obtain Christian's decisions on Constitution and active infrastructure mode.
5. Activate UJ-INT-002 and produce architecture v1 plus approved ADRs.
6. Merge only after PR #1 review gates and M0 ownership/status baseline are
   accepted.

Independent review requests are stored at
`prompts/review-requests/UJ-INT-001-GROK.md` and
`prompts/review-requests/UJ-INT-006-CLAUDE.md`.

## Active blockers

| Blocker | Affects | Resolver | Safe continuation |
|---|---|---|---|
| Constitution and autonomy ceiling not owner-accepted | UJ-META-002, M0 exit | Christian | keep work draft/L2 |
| `STRICT_ZERO_CARD` not explicitly owner-confirmed | infrastructure ADR | Christian | treat it as safe proposed default; do not enable billing |
| Specialist reports do not yet exist | UJ-INT-002 | Claude, Gemini, Grok via human bridge | use the four ready cards; validate every ResponsePacket before import |
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

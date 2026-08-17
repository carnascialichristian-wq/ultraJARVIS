# ultraJARVIS Program OS v0.1

This directory is the operational source of truth for program status. The
canonical constitutional contract remains
`docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md`.

| Artifact | Purpose | Owner | Update trigger |
|---|---|---|---|
| `PROJECT_STATE.md` | Current baseline, constraints, decisions, and critical path | ChatGPT | accepted task or owner decision |
| `BACKLOG.json` | Machine-readable task ledger | task owners via reviewed PR | any task delta |
| `STATUS.md` | Human-readable status snapshot | ChatGPT | ledger change |
| `WORKSTREAMS.md` | Ownership, RACI, and dependency boundaries | ChatGPT | baseline change |
| `HANDOFFS.md` | Handoff contract and artifact layout | ChatGPT | protocol change |
| `COUNCIL_PACKETS.md` | Mission, Delegation, Response, Review, and Synthesis packet family | ChatGPT | packet version change |
| `COUNCIL_IMPORT_AND_MERGE.md` | Admission, replay, policy, quarantine, and deterministic merge rules | ChatGPT | importer policy change |
| `SPECIALIST_INPUTS.md` | Exact inputs expected from Claude, Gemini, and Grok | ChatGPT | council cycle change |
| `RECONCILIATION.md` | Deterministic merge algorithm for specialist artifacts | ChatGPT | synthesis protocol change |
| `CONFLICTS_AND_ASSUMPTIONS.md` | Open conflicts, assumptions, and blockers | owning workstream | discovery or decision |
| `PROGRESS.md` | Accepted-weight formula and examples | ChatGPT, reviewed by Grok | measurement change |
| `GOVERNANCE.md` | Repository, branch, PR, review, and release policy | Christian / ChatGPT | governance decision |
| `RESUME_POINT.md` | Exact checkpoint for the next session | active task owner | every session end |

## Update invariants

1. `BACKLOG.json` is the numeric source for task status and progress.
2. `STATUS.md` must be regenerated or reconciled from the same repository ref.
3. `completed_weight` means independently accepted work, not effort spent.
4. The total program scope is UNKNOWN. Only a declared baseline may have a
   percentage.
5. Constitution, budget, data classification, and autonomy ceilings require
   Christian's approval to change.
6. Conflicts are recorded, not silently normalized.

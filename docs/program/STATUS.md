# STATUS v0.1

Snapshot date: 2026-08-17. Numeric source: `BACKLOG.json` on the same ref.

## Executive status

| Scope | Accepted / total weight | Progress | Remaining | Confidence |
|---|---:|---:|---:|---|
| Initial four-AI portfolio | 0 / 311 | 0.00% | 311 | HIGH: portfolio weights are declared; no specialist work is independently accepted |
| M0 bootstrap snapshot | 26 / 94 | 27.66% | 68 | MEDIUM: owner acceptance may amend the draft baseline |
| Meta bootstrap only | 26 / 29 | 89.66% | 3 | HIGH: PR #1 and its remaining gate are observable |
| Lifetime ultraJARVIS program | UNKNOWN | N/A | UNKNOWN | Correctly unbaselined and extensible |

`UJ-INT-001` and `UJ-INT-006` are submitted for review with 21 units of produced
scope, but they contribute zero accepted weight until their named independent
reviews pass.

## Core portfolio by status

| Status | Tasks | Weight | Meaning |
|---|---:|---:|---|
| REVIEW | 2 | 21 | Artifacts submitted; acceptance pending |
| READY | 6 | 73 | Inputs sufficient to begin, subject to one-primary-task WIP rule |
| TRIAGED | 1 | 13 | Scoped but not selected as current primary work |
| BLOCKED | 18 | 160 | Explicit dependency/evidence blocker exists |
| DEFERRED | 5 | 44 | Future milestone or insufficient operational evidence |
| DONE | 0 | 0 | No core portfolio weight independently accepted yet |
| **Total** | **32** | **311** | Four-AI initial portfolio |

Meta-bootstrap and zero-weight auxiliary candidates are intentionally excluded
from this table.

## Immediate task snapshot

| Task | Owner | State | Accepted / total | Proof | Blocker | Next |
|---|---|---|---:|---|---|---|
| UJ-META-001 | ChatGPT | DONE | 21/21 | canonical prompt + PR #1 | none | preserve hash/change control |
| UJ-META-002 | Christian | REVIEW | 5/8 | draft PR #1 | owner decisions and merge | accept/amend named decisions |
| UJ-INT-001 | ChatGPT | REVIEW | 0/13 | Program OS artifact set on PR #1 branch | independent review | send `prompts/review-requests/UJ-INT-001-GROK.md`; Grok reviews progress/system |
| UJ-INT-006 | ChatGPT | REVIEW | 0/8 | five packet schemas, admission rules, one mission, four cards | independent Claude review | send `prompts/review-requests/UJ-INT-006-CLAUDE.md`; do not award weight |
| UJ-RUN-001 | Claude | READY | 0/13 | none yet | none | produce provider-neutral runtime blueprint |
| UJ-CAP-001 | Gemini | READY | 0/13 | none yet | none | produce four-AI Capability Registry |
| UJ-GGL-001 | Gemini | READY | 0/13 | none yet | none | produce coordinated Google evidence pack |
| UJ-RED-001 | Grok | READY | 0/13 | none yet | none | produce falsification report with remediation |

## Critical path

```mermaid
flowchart TD
    OS["UJ-INT-001 Program OS review"] --> CARDS["UJ-INT-006 Council cards"]
    CARDS --> RUN
    CARDS --> CAP
    CARDS --> GGL
    CARDS --> RED
    RUN["UJ-RUN-001 runtime"] --> SYN
    CAP["UJ-CAP-001 capability"] --> SYN
    GGL["UJ-GGL-001 Google evidence"] --> SYN
    RED["UJ-RED-001 falsification"] --> SYN
    SYN["UJ-INT-002 architecture synthesis"]
    SYN --> DEC["Christian decisions and ADR acceptance"]
    DEC --> M0["M0 exit gate"]
```

This diagram is dependency order, not an ETA. Claude, Gemini, and Grok work may
run in parallel; synthesis waits for schema-valid artifacts at least in REVIEW.

## Owner decisions currently required

1. Accept or amend the Constitution and autonomy ceiling in PR #1.
2. Confirm `STRICT_ZERO_CARD` as the active default or propose a safer wording.
3. Keep automatic Claude access BLOCKED until UJ-CLD-001 proves the precise
   allowed case (recommended safe default).
4. Accept or amend the M0 ownership and accepted-weight baseline before merge.

No billing, deployment, account creation, email, destructive operation, or
production write is requested.

## Remaining M0 work

- 68 accepted-weight units remain in the current M0 bootstrap snapshot.
- Four immutable HUMAN_BRIDGE cards are ready for UJ-RUN-001,
  UJ-CAP-001/UJ-GGL-001, and UJ-RED-001.
- UJ-INT-002 is the current integration bottleneck and cannot start until those
  specialist artifacts exist.
- ETA is UNKNOWN until multiple reviewed tasks establish an accepted velocity
  range. Report critical path and units, not a date.


## Remote reconciliation — 2026-08-17

Questo blocco aggiorna la vista del ref senza alterare i numeri di `BACKLOG.json`.

- Ref corrente osservato: `main@5175ae8615e73f8d9dfe1a329831bd4975fff9c8`; PR #1 è CLOSED/MERGED a `99dece590a124342abd19f5e090629f231ec40c4`, mentre PR #3 è OPEN/DRAFT e resta basata su `31f31b99ad7e63bf581161ce9cd12b11f83a945f` con head `97f7f06d56f39101b6a54a74dfbcafea49b72676`.
- La PR #3 è pulita rispetto alla propria base storica, ma è divergente rispetto a main (+2 commit sulla PR, +44 su main rispetto al merge-base `31f31b99ad7e63bf581161ce9cd12b11f83a945f`). Non è stata riallineata né mergiata.
- Il Program OS è ora presente su main, ma ciò non assegna peso ai task di review: `UJ-INT-001` e `UJ-INT-006` restano a 0 accepted; il backlog non è stato modificato.
- Gemini non ha ancora consegnato output verificabili per `UJ-CAP-001` e `UJ-GGL-001`; entrambi restano READY/HUMAN_BRIDGE a 0/13. L’integrazione richiede due ResponsePacket separati, fonti/hash/schema validi e branch/PR dedicate.

# Architecture Decision Record index

Only records with status `ACCEPTED` are architectural authority. Candidate rows
do not become decisions by appearing in this index.

| ADR | Title | Status | Owner | Required inputs / gate |
|---|---|---|---|---|
| ADR-0001 | Program truth hierarchy and repository governance | PROPOSED | ChatGPT | UJ-INT-001 review + Christian approval |
| ADR-0002 | Active infrastructure mode: STRICT_ZERO_CARD | DECISION_REQUIRED | Gemini | UJ-CAP-001, UJ-INF-001, Christian approval |
| ADR-0003 | Accepted-weight progress and ETA policy | PROPOSED | ChatGPT | UJ-REV-004 + Christian approval |
| ADR-0004 | Provider-neutral runtime kernel | BLOCKED | Claude | UJ-RUN-001 and UJ-INT-002 |
| ADR-0005 | Persistence and memory adapter | BLOCKED | Gemini | UJ-INF-001 and UJ-MEM-001 |
| ADR-0006 | Dashboard host and single-user authentication | BLOCKED | ChatGPT/Gemini | UJ-INF-001 and UJ-INT-003 |

Create an ADR file only when alternatives and decision evidence exist. Do not
create empty files to simulate progress. New files use
`ADR-NNNN-lowercase-kebab-title.md` and the template in this directory.

## Status lifecycle

`DRAFT → PROPOSED → DECISION_REQUIRED → ACCEPTED → SUPERSEDED`

`REJECTED` is terminal for the stated context but remains in the repository.
`BLOCKED` is lateral and must name missing evidence/resolver.


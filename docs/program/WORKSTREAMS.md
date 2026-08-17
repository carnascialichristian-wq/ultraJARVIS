# Workstreams and RACI v0.1

RACI meanings: **A** accountable/final decision, **R** produces the artifact,
**C** required reviewer or specialist input, **I** receives the result.

## Program-level RACI

| Decision or artifact | Christian | ChatGPT | Claude | Gemini | Grok |
|---|---:|---:|---:|---:|---:|
| Constitution, budget, data class, autonomy ceiling | A | R/C | C | C | C |
| Program OS, task ledger, status, synthesis | A | R | C | C | C |
| Architecture integration and Provider Gateway | A | R | C | C | C |
| Runtime, Supervisor, DepthGuard, recovery | A | C | R | C | C |
| Security, policy engine, MCP admission, Skill Forge | A | C | R | C | C |
| Capability Registry and strict zero-card evidence | A | C | C | R | C |
| Database, memory, provenance, NotebookLM | A | C | C | R | C |
| Falsification, risk, alternatives, supply chain | A | C | C | C | R |
| Dashboard and Website Team orchestration | A | R | C | C | C |
| Production, billing, external messages, destructive actions | A | I | C | C | C |

No row authorizes a side effect. Action-level policy and approval still apply.

## Current portfolios

| Workstream | Owner | Initial weight | Current primary task | Required reviewer | WIP rule |
|---|---|---:|---|---|---|
| Integration | ChatGPT | 81 | UJ-INT-001 + UJ-INT-006 (REVIEW) | Grok for Program OS; Claude for Council contracts | no new primary until review or a valid specialist response arrives |
| Runtime & security | Claude | 76 | UJ-RUN-001 (READY) | Gemini | one primary; UJ-CLD-001 evidence may be secondary |
| Capability & knowledge | Gemini | 81 | UJ-CAP-001 + coordinated UJ-GGL-001 | Claude/Grok | coordinated pack, separate weights |
| Falsification & risk | Grok | 73 | UJ-RED-001 (READY) | ChatGPT | UJ-OSS-001 remains secondary/triaged |

## Dependency boundaries

- ChatGPT does not produce specialist runtime, capability, or falsification
  reports. It defines contracts, validates inputs, and synthesizes differences.
- Claude does not convert Claude consumer access into a general app entitlement;
  UJ-CLD-001 is an evidence task separate from provider-neutral runtime design.
- Gemini does not activate billing or present Google product count as required
  architecture. It classifies access and provides official-source evidence.
- Grok does not treat real-time access or popularity as proof. Every challenge
  includes a test, mitigation, and owner.
- Christian alone resolves material value trade-offs and approves protected
  program changes.

## Cross-review rotation

| Artifact owner | Preferred independent reviewer | Review focus |
|---|---|---|
| ChatGPT | Grok or Claude | progress gaming, integration assumptions, portability |
| Claude | Gemini or ChatGPT | provider neutrality, factual access claims, usability |
| Gemini | Claude or Grok | security, billing truth, freshness, omissions |
| Grok | ChatGPT or Gemini | evidence quality, feasible remediation, duplication |

Reviewers emit `PASS`, `PASS_WITH_ACTIONS`, or `FAIL`; they do not silently
rewrite the source artifact.

## M0 handoff order

1. ChatGPT submits UJ-INT-001 Program OS and UJ-INT-006 Council contracts.
2. Christian manually transfers one pinned Delegation Card to each target
   session; Gemini receives two separate cards/tasks.
3. Claude, Gemini, and Grok each return the exact artifacts in
   `SPECIALIST_INPUTS.md` using `response-packet/v1` plus session handoff.
4. The importer applies `COUNCIL_IMPORT_AND_MERGE.md`; named reviewers issue
   `review-result/v1`.
5. ChatGPT runs `RECONCILIATION.md`, preserving unresolved disagreements.
6. Christian resolves protected decisions.
7. ChatGPT activates UJ-INT-002 and proposes the M0 exit baseline.

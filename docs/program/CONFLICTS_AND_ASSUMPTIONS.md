# Conflict, assumption, and blocker log v0.1

## Conflicts

| ID | Type | Conflict | Current safe treatment | Resolver / proof |
|---|---|---|---|---|
| C-001 | USER_CONSTRAINT vs capability | Cloud-only automation may require billable compute, while budget and billing exposure must be zero | Track A/manual bridge is functional default; Track B disabled | UJ-CAP-001, UJ-INF-001, Christian |
| C-002 | Product vs API entitlement | Consumer subscriptions are owned, but machine-to-machine API rights and quotas are separate | HUMAN_BRIDGE unless all AUTO_VERIFIED gates pass | UJ-CAP-001 and provider-specific official sources |
| C-003 | Review state vs operational use | Canonical prompt is `REVIEW` on draft PR #1 but is the only detailed operating contract | Use it for reversible M0 drafts; do not claim Constitution/ADR acceptance | Christian decision and PR merge |
| C-004 | Ledger invariant vs source row | Source baseline lists UJ-META-002 owner as `ChatGPT/Christian`, but the ledger requires one owner | Christian is owner/approver; ChatGPT is producing agent, not co-owner | owner review of UJ-INT-001 |
| C-005 | Reviewer naming | UJ-INT-001 queue names Grok reviewer, while UJ-REV-001 assigns Claude a Program OS review | Grok reviews task/progress via UJ-REV-004; Claude performs independent system review; Christian accepts protected decisions | both review artifacts |
| C-006 | Partial accepted weight | Source baseline grants UJ-META-002 5/8 while the full owner review is pending | Preserve inherited 5/8 as draft baseline; no additional accepted weight without review | UJ-REV-004 and Christian |
| C-007 | Automatic GitHub capability | The plan treats GitHub automation as a capability to verify; this session directly observed read/write connector access | Record only the current session observation; Capability Registry must revalidate auth, scope, and quota | UJ-CAP-001 |

## Assumptions

| ID | Assumption | Reversibility | Validation / expiry |
|---|---|---|---|
| A-001 | Christian's request to inspect GitHub and begin assigned tasks authorizes INTERNAL_WRITE on the existing review branch, not merge or production | High: branch/PR changes are reviewable | validate through PR review; expires if user changes scope |
| A-002 | Adding UJ-INT-001 to the existing M0 draft PR is less disruptive than opening a stacked PR before the canonical prompt reaches `main` | High: commits can be reviewed/reverted without touching `main` | revisit after PR #1 owner decision |
| A-003 | C1 is the correct maximum class for program artifacts that contain private strategy but no secrets | Medium | Claude security review / data policy ADR |
| A-004 | JSON is the first machine-readable ledger format because it is dependency-free and schema-validatable | High: adapters can export YAML later | UJ-INT-004 contract review |
| A-005 | All core task weights in sections 33–36 form the declared 311-unit initial baseline | High: arithmetic is testable | standalone validator and Grok review |

## Unknowns and blockers

| ID | Classification | Unknown | Impact | Owner / next proof |
|---|---|---|---|---|
| B-001 | BLOCKER | Exact automatic access modes for the four consumer accounts | prevents automatic Provider Gateway adapters | Gemini UJ-CAP-001 |
| B-002 | BLOCKER | Claude Pro/Code/SDK/OAuth rights for this exact third-party use case | Claude backend remains blocked | Claude UJ-CLD-001 |
| B-003 | UNKNOWN | Zero-card database/compute/hosting choice with current terms and region | blocks infrastructure ADR | Gemini UJ-INF-001 |
| B-004 | UNKNOWN | Accepted task velocity | prevents responsible ETA | measure after multiple independent reviews |
| B-005 | BLOCKER | Owner acceptance of Constitution, strict zero-card default, and M0 baseline | blocks PR #1 merge and M0 exit | Christian |

## Closure rule

A row closes only with a dated owner decision, official source, reproducible test,
or accepted ADR. When facts change, supersede the row; do not delete history.


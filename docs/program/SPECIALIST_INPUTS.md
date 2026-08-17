# Exact specialist inputs for the first council cycle

All specialists use the canonical prompt at the commit containing these Program
OS artifacts, `BACKLOG.json`, and `handoff-packet/v1`. They must not edit another
owner's task or claim consensus that has not been returned as an artifact.

## Common return contract

Each specialist returns:

1. one primary Markdown artifact at the path below;
2. any proposed schemas as separate JSON/TypeScript artifacts;
3. primary-source references beside current capability claims;
4. reproducible checks and failures;
5. one valid `ultrajarvis.handoff-packet/v1` containing artifact SHA-256 values;
6. a task-ledger delta that proposes REVIEW, not DONE;
7. an exact `RESUME_POINT`.

No secrets, paid API calls, billing activation, consumer UI automation, or
production side effects are authorized.

## Claude — UJ-RUN-001

| Field | Required value |
|---|---|
| Role | Runtime, Security & Skill Architect |
| Primary output | `docs/architecture/RUNTIME_BLUEPRINT.md` |
| Supporting output | provider-neutral TypeScript contract proposals under `schemas/` or `packages/contracts` as drafts |
| Data / side effect | C1 / INTERNAL_WRITE on a branch |
| Required reviewer | Gemini |

Required sections:

1. AgentManifest and TeamSpec;
2. Supervisor state machine and invariants;
3. DepthGuard limits and enforcement points;
4. RunLedger event taxonomy;
5. checkpoint/resume/cancel/retry/idempotency semantics;
6. tool allowlist and capability-token inheritance rules;
7. typed artifact communication;
8. failure, recursion, loop, replay, and double-write scenarios;
9. provider-neutral TypeScript contracts;
10. threat notes for UJ-SEC-001;
11. integration review checklist;
12. task delta and resume point.

Do not mix UJ-CLD-001 entitlement claims into the provider-neutral design.

## Gemini — UJ-CAP-001 and UJ-GGL-001

| Field | Required value |
|---|---|
| Role | Google Ecosystem, Knowledge & Cloud Feasibility Architect |
| Primary output | `docs/program/CAPABILITY_REGISTRY.md` |
| Evidence output | `docs/evidence/GOOGLE_CAPABILITY_EVIDENCE_PACK.md` |
| Machine-readable output | `docs/program/CAPABILITY_REGISTRY.json` |
| Data / side effect | C0/C1 / INTERNAL_WRITE on a branch |
| Required reviewers | Claude for registry; Grok for Google evidence |

Required content:

1. four-AI product/account/access-path inventory;
2. explicit subscription/API separation;
3. Google app/developer/cloud/workspace/labs/media inventory;
4. ACTIVE/PREVIEW/DEPRECATED/UNKNOWN state;
5. official source URL and verification timestamp per material claim;
6. quota, billing, hard-stop, automation, region, data, export, and fallback;
7. strict-zero-card eligibility;
8. privacy/data-class notes;
9. HUMAN_BRIDGE versus AUTO_VERIFIED conclusion;
10. deprecation watch candidates;
11. UJ-INF-001 recommendations;
12. claims Claude and Grok should falsify;
13. separate ledger deltas for the two task weights.

Do not enable billing or infer API quota from Google AI Pro.

## Grok — UJ-RED-001

| Field | Required value |
|---|---|
| Role | Falsification, Risk & Alternatives Architect |
| Primary output | `docs/evaluations/ZERO_COST_FALSIFICATION_REPORT.md` |
| Data / side effect | C0 / INTERNAL_WRITE on a branch |
| Required reviewer | ChatGPT |

Every finding includes claim, evidence required, technical/economic/legal/privacy
impact, severity, probability, detectability, falsification test, mitigation,
owner, and STOP/GO condition. Cover:

1. zero-card/cloud-only/automatic/subscription contradictions;
2. provider deprecation and quota removal;
3. DepthGuard, human bridge, memory, and Skill Forge attacks;
4. hidden non-monetary costs and maintenance burden;
5. simpler reversible alternatives;
6. progress/ETA gaming review (UJ-REV-004 linkage);
7. exact task delta and resume point.

A criticism without a feasible mitigation and owner fails acceptance.

## Christian — decisions, not specialist production

Christian is asked only to accept/amend:

- Constitution and autonomy ceiling;
- `STRICT_ZERO_CARD` default;
- automatic Claude BLOCKED safe default;
- M0 ownership/baseline and eventual PR merge.

The specialist cycle can produce drafts while those decisions are pending, but
cannot enable protected capabilities or claim M0 exit.


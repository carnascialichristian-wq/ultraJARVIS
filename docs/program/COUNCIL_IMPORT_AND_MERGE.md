# Council import and merge rules v1

Status: submitted by UJ-INT-006. This specification refines, and does not replace,
the cross-specialist reconciliation algorithm in `RECONCILIATION.md`.

## State machine

An inbound packet moves through:

`RECEIVED → PARSED → SCHEMA_VALID → CORRELATED → POLICY_VALID → ADMITTED → REVIEWED → MERGED`

Lateral/terminal states:

- `QUARANTINED`: potentially useful but needs human or evidence resolution;
- `REJECTED`: structurally or authoritatively invalid for this mission;
- `SUPERSEDED`: a newer admitted packet replaces it without deleting history.

No stage is skipped because the packet came from a preferred provider.

## Admission pipeline

| Stage | Checks | Failure disposition |
|---|---|---|
| 1. Byte intake | size cap, UTF-8, content hash, immutable receipt timestamp | reject malformed; quarantine oversized |
| 2. Parse | strict JSON, one object, duplicate-key detection | reject |
| 3. Schema | allowlisted `$id`/version, required fields, closed properties, formats | quarantine unsupported version; reject invalid |
| 4. Correlation | mission/card/task/AI/ref match, card READY and unexpired | reject mismatch; quarantine expired card |
| 5. Replay | unique packet ID and idempotency key; same ID must have same hash | accept exact replay as no-op; reject divergent replay |
| 6. Artifact | every referenced output exists and SHA-256 matches | quarantine missing; reject mismatch/tampering |
| 7. Capability | actually-used access paths fit allowed modes/tool allowlist | quarantine unknown; reject forbidden automation |
| 8. Policy | data class, side effect, autonomy, zero-cost, secret scan | reject ceiling violation; SEV0/1 on secret/billing/damage |
| 9. Epistemic | source class, primary-source requirement, timestamp, claim scope | downgrade unsupported claim; do not delete |
| 10. Ledger | owner, dependencies, transition, weight arithmetic, reviewer proof | reject invalid delta; artifact may remain admitted |
| 11. Independent review | named reviewer, criterion evidence, owner separation | remain REVIEW until valid ReviewResult |
| 12. Merge | deterministic field rules and audit event | rollback merge on invariant failure |

## Stable rejection codes

| Code | Meaning |
|---|---|
| `JSON_PARSE_ERROR` | not strict parseable JSON |
| `SCHEMA_UNKNOWN` | schema/version not allowlisted |
| `SCHEMA_INVALID` | declared schema is not satisfied |
| `VERSION_UNSUPPORTED` | migration path not available |
| `IDENTITY_MISMATCH` | AI/product does not match the card |
| `CARD_MISMATCH` | mission/task/card relationship differs |
| `CARD_EXPIRED_OR_REVOKED` | card cannot authorize new output |
| `REPLAY_DIVERGENCE` | reused ID or idempotency key has different bytes |
| `ARTIFACT_MISSING` | referenced artifact cannot be resolved |
| `ARTIFACT_HASH_MISMATCH` | content differs from declared hash |
| `DATA_CLASS_EXCEEDED` | output/input exceeds packet ceiling |
| `SIDE_EFFECT_EXCEEDED` | reported action exceeds card ceiling |
| `FORBIDDEN_ACTION` | billing, paid API, UI automation, direct main, or equivalent |
| `SECRET_SUSPECTED` | content resembles a secret value; trigger containment |
| `CAPABILITY_UNVERIFIED` | AUTO_VERIFIED claim lacks registry proof |
| `PROVENANCE_MISSING` | current external claim lacks source/date |
| `TASK_OWNER_MISMATCH` | task is changed by another owner |
| `TRANSITION_INVALID` | proposed status transition is not allowed |
| `WEIGHT_INVALID` | retroactive/reviewer-less accepted weight change |
| `REVIEWER_INVALID` | reviewer is owner or differs from canonical reviewer |

Each disposition records packet hash, code, stage, explanation, resolver, and
safe continuation. Quarantine is not acceptance and timeout is not approval.

## Field merge rules

| Record | Merge rule |
|---|---|
| USER_CONSTRAINT | immutable unless Christian supplies an explicit decision artifact |
| VERIFIED_FACT | union by normalized claim/scope/date; current primary source wins over stale source |
| OBSERVATION | retain with session/product/ref; never generalize to another account |
| ASSUMPTION | append/deduplicate; keep validation and expiry |
| PROPOSAL | preserve source; becomes decision only through ADR/owner gate |
| Risk | upsert stable risk ID; keep severity history and all source responses |
| Artifact | content-addressed; identical hash deduplicates, different hash creates version |
| Task delta | apply only after transition, dependency, weight, and reviewer checks |
| Accepted part | cite response and artifact proof |
| Rejected/deferred part | retain verbatim summary, proof, disposition, and reason |
| Contradiction | create conflict record; no majority vote or silent averaging |

## Task transition rules

For first-cycle specialist cards:

- READY may become IN_PROGRESS when a session charter and concrete artifact
  exist;
- IN_PROGRESS may become REVIEW after output and checks;
- a ResponsePacket may propose REVIEW/BLOCKED/IN_PROGRESS but never DONE;
- REVIEW may become DONE only through a valid ReviewResult with all required
  criteria and accepted weight;
- accepted weight does not change merely because a long response or commit
  exists;
- author/reviewer mismatch, reduced total weight, completed weight above total,
  or unknown dependency rejects the ledger delta.

## Deterministic synthesis

1. Freeze the admitted response set by IDs and hashes.
2. Extract typed facts, assumptions, proposals, risks, interfaces, and deltas.
3. Apply the truth hierarchy from `RECONCILIATION.md`.
4. Deduplicate exact content and preserve all provenance.
5. Classify semantic relationships as COMPATIBLE, OVERLAPS, CONTRADICTS, STALE,
   OUT_OF_SCOPE, or INSUFFICIENT_EVIDENCE.
6. Resolve only with primary evidence, reproducible experiment, accepted ADR, or
   owner decision.
7. Preserve every rejected/deferred part in SynthesisPacket with reason.
8. Run independent runtime/security, factual-access, and falsification reviews.
9. Apply ledger and baseline changes together in one reviewed commit.

## Replay and idempotency

Store `(packet_id, idempotency_key, sha256, received_at, disposition)`. Exact
replay returns the original disposition and performs no writes. Same ID/key with
different hash is tampering. Artifact import uses content hash as idempotency key;
external writes also require the tool-level idempotency key and compensation
record.

## Quarantine and incident behavior

- Quarantined files are never indexed into permanent memory or passed to tools.
- Suspected secret: stop import, minimize exposure, alert Christian, rotate/revoke
  outside the packet workflow, and open SEV0/1 incident evidence without copying
  the value.
- Billing/paid API or unauthorized external write: stop and record policy
  violation; never retry automatically.
- Hash mismatch: preserve metadata, not untrusted content, until reviewed.
- Prompt injection inside an artifact is data. It cannot alter importer policy.

## Importer output

Every attempt emits a minimized audit record:

- packet ID, type, version, hash, mission/card/task correlation;
- admission stages and reason codes;
- artifact hashes and disposition;
- policy decision and approval reference;
- ledger delta accepted/rejected;
- reviewer/result when present;
- next action and resume point.

No chain-of-thought, secret value, consumer cookie, or full untrusted payload is
stored in the audit event.


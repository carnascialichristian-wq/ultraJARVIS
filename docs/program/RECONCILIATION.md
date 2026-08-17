# Specialist artifact reconciliation algorithm v0.1

This algorithm is deterministic at the contract/evidence level. It does not
attempt to merge hidden reasoning or force agreement.

## Inputs

- repository ref containing accepted Program OS;
- one specialist artifact and `handoff-packet/v1` for each required task;
- independent review results when available;
- current `BACKLOG.json`, conflict log, Constitution, and approved ADRs.

UJ-INT-002 cannot start until UJ-RUN-001, UJ-CAP-001, UJ-GGL-001, and UJ-RED-001
are each at least REVIEW with schema-valid handoffs.

## Algorithm

1. **Freeze intake.** Record commit SHA and SHA-256 for every input. Reject
   mutable links without a resolvable commit.
2. **Validate envelope.** Validate packet schema, task ownership, task status
   transition, weights, data class, side-effect ceiling, and artifact hashes.
3. **Validate provenance.** For every current external claim, require a primary
   official source and verification date. Downgrade unsupported claims to
   ASSUMPTION/UNKNOWN; never discard them silently.
4. **Normalize records.** Convert facts, proposals, constraints, risks,
   interfaces, and task deltas into typed records with source task and artifact.
5. **Apply truth hierarchy.** Constitution/user constraint > reproducible test >
   accepted ADR > versioned contract > backlog/state > documentation > one AI
   output > chat.
6. **Deduplicate exact records.** Merge only byte-equivalent or identifier-equal
   records while retaining all provenance links.
7. **Flag semantic candidates.** Similar prose is not auto-merged. Create a
   candidate pair and compare definitions, scope, evidence dates, and conditions.
8. **Classify relationships.** Mark each candidate `COMPATIBLE`, `OVERLAPS`,
   `CONTRADICTS`, `OUT_OF_SCOPE`, `STALE`, or `INSUFFICIENT_EVIDENCE`.
9. **Resolve safe cases.** Merge COMPATIBLE records; choose current official
   evidence over stale claims; reject policy-violating options with reason.
10. **Design an experiment.** For unresolved technical contradictions, define a
    reversible C0/C1 experiment with binary outcome and owner.
11. **Escalate protected trade-offs.** Constitution, budget, billing, data class,
    autonomy, production, and value trade-offs become Christian decision cards.
12. **Create ADR candidates.** Each material architecture choice includes
    alternatives, evidence, dissent, migration, rollback, and gate. It remains
    PROPOSED until accepted.
13. **Merge task deltas.** Reject unknown IDs, duplicate owners, retroactive
    weight reduction, invalid dependencies, and accepted-weight changes without
    reviewer proof.
14. **Independent synthesis review.** Claude reviews architecture/runtime;
    Grok challenges risk/progress; Gemini checks factual access claims.
15. **Commit a new baseline.** Update state, backlog, status, conflicts, ADR
    index, risks, and resume point together. Preserve rejected/deferred material.

## Deterministic conflict key

Use `(record_type, normalized_subject, scope, effective_date)` as the comparison
key. Never use model confidence or majority vote as the final tie-breaker.

## Pseudocode

```text
for packet in required_packets:
  assert schema_valid(packet)
  assert authorized_transition(packet.task)
  assert hashes_match(packet.artifacts)
  records += classify(extract(packet))

groups = group_by_conflict_key(records)
for group in groups:
  if violates_constitution(group): reject_with_reason(group)
  else if equivalent(group): merge_with_all_provenance(group)
  else if one_is_stale(group): prefer_current_primary_evidence(group)
  else if testable(group): create_reversible_experiment(group)
  else: create_owner_decision_card(group)

assert ledger_invariants(task_deltas)
emit synthesis, adr_candidates, preserved_dissent, ledger_delta, resume_point
```

## Rejection conditions

- packet/task ID mismatch;
- missing artifact or hash mismatch;
- unverified capability presented as ACTIVE/AUTO_VERIFIED;
- paid/billing/UI-automation/local-inference path presented as enabled;
- secret value in any artifact;
- unsupported accepted-weight change;
- author claims another AI's review or owner decision;
- output attempts to modify protected policy without an approval card.

Rejected input is quarantined and cited with reason; it is not deleted.


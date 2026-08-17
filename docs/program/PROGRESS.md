# Progress and remaining-work policy v0.1

Status: PROPOSED by UJ-INT-001. Independent anti-gaming review is required.

## Definitions

- `weight_i`: scope agreed before a task enters IN_PROGRESS.
- `accepted_i`: reviewer-accepted units for task `i`; `0 <= accepted_i <= weight_i`.
- `remaining_i = weight_i - accepted_i`.
- `B`: one named baseline with an explicit, immutable task set for its version.

For baseline `B`:

\[
Progress(B) = 100 \times \frac{\sum_{i \in B} accepted_i}{\sum_{i \in B} weight_i}
\]

\[
Remaining(B) = \sum_{i \in B} (weight_i - accepted_i)
\]

Round only the displayed percentage to two decimals. Store integer accepted and
remaining units. Never mix lifetime UNKNOWN scope into a baseline percentage.

## Acceptance rules

1. An owner cannot reduce task weight after IN_PROGRESS.
2. Produced, submitted, or REVIEW work is not automatically accepted.
3. Partial accepted weight requires predefined binary subcriteria and a named
   reviewer proof. Without that mapping, acceptance is all-or-nothing.
4. DONE requires all criteria and review proof; status alone never changes
   accepted weight.
5. Added scope creates a new baseline version; do not enlarge the denominator of
   past reports silently.
6. CANCELLED scope remains visible. Removing it from a baseline requires an
   approved baseline-change record with reason.
7. Rework can reduce accepted weight only through a reviewer finding that cites
   invalidated proof; preserve the previous snapshot.

## Examples

### Initial four-AI portfolio

- Declared total: `81 + 76 + 81 + 73 = 311`.
- Current accepted core weight: `0`.
- Progress: `0 / 311 = 0.00%`.
- UJ-INT-001 being in REVIEW does not change this value.

### M0 bootstrap snapshot

- Declared tasks: UJ-META-001 (21), UJ-META-002 (8), plus five immediate
  specialist/integrator tasks at 13 each.
- Total: `21 + 8 + (5 × 13) = 94`.
- Accepted: `21 + 5 = 26`.
- Progress: `26 / 94 = 27.66%`.
- Remaining: `94 - 26 = 68`.

### Review submission

If UJ-INT-001 produces all artifacts but no reviewer has passed them:

- status: REVIEW;
- produced scope: may be reported separately as 13 units submitted;
- accepted weight: 0/13;
- contribution to progress: 0.

If its reviewer later accepts 13/13 with proof, the initial portfolio becomes
`13 / 311 = 4.18%`; this is an example, not the current state.

## ETA policy

Do not emit an ETA until at least three comparable task reviews establish a
velocity range. When available:

- use accepted units per observed calendar interval, never generated output;
- report a range (pessimistic/base/optimistic) and sample size;
- show the critical path and external/human blockers separately;
- exclude blocked waiting time only if the exclusion is explicit;
- invalidate the estimate after a baseline or capability change.

Current global and M0 ETA: **UNKNOWN**. Current useful remaining-work signal:
68 M0 bootstrap units plus the named critical path in `STATUS.md`.

## Anti-gaming checks

- no self-review on critical tasks;
- no DONE without proof references;
- no denominator changes without baseline version;
- no tiny task splitting to inflate throughput;
- no accepted weight for meetings, intent, or AI response length;
- no percentage for unbaselined lifetime scope;
- reconcile computed status against `BACKLOG.json` in CI;
- Grok UJ-REV-004 challenges the formula and examples before acceptance.


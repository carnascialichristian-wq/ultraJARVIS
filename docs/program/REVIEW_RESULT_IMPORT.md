# ReviewResult intake and validation v1

Status: operational support for UJ-INT-001 and UJ-INT-006 reviews. This guide
does not itself accept a task or mutate `BACKLOG.json`.

## Purpose

A reviewer may return a convincing-looking JSON file that is stale, belongs to
another task, cites a different commit, uses the wrong reviewer, or attempts to
award weight without all accepted criteria. Before any reviewed branch change,
the integration session validates the candidate ReviewResult against the local
repository tree and the current backlog.

## Safe intake sequence

1. Obtain the exact current PR head from GitHub; call it `<HEAD_SHA>`.
2. Keep the reviewer output as an untrusted local candidate until validation.
   Do not change `BACKLOG.json`, status, weights, or `main`.
3. Save the JSON as a repository-relative candidate path, for example
   `docs/program/reviews/inbox/UJ-REVIEW-INT-001-GROK-20260817.json`.
4. Run:

   ```bash
   node scripts/validate-council-packets.mjs \
     --review-result docs/program/reviews/inbox/UJ-REVIEW-INT-001-GROK-20260817.json \
     --expected-commit <HEAD_SHA>
   ```

5. A PASS from the command proves only structural, identity, hash, policy, and
   ledger compatibility. The integrator still reads the findings, preserves
   dissent, checks owner gates, and records any resulting state change in a
   separate reviewed commit.
6. After admission, store the immutable ReviewResult at
   `docs/program/reviews/<task-id>/<review-id>.json`, cite it in task proof,
   update both `gpt.md` and `taskgpt.md`, then validate Program OS again.

Never give a candidate JSON write authority merely because it parses.

## What the validator enforces

- JSON Schema 2020-12 compliance for `ultrajarvis.review-result/v1`;
- a repository-relative artifact path and a matching explicit commit SHA;
- task existence and current `REVIEW` state in `BACKLOG.json`;
- exact task owner and named independent reviewer;
- every task acceptance criterion exactly once, with evidence references;
- reviewed artifact files exist in the checked tree and match declared
  SHA-256 content hashes;
- no partial accepted-weight award, because the initial tasks have no approved
  partial-weight mapping;
- a weight increase only for `PASS`, all criteria/policy checks PASS, full task
  weight, and proposed `DONE`;
- no `DONE` for `PASS_WITH_ACTIONS` or `FAIL`, and no weight changes for either;
- at least one failed acceptance criterion for a `FAIL` outcome.

It intentionally does not merge, write the backlog, suppress findings, grant
owner approval, or infer that the reviewer actually ran a command. Those remain
evidence and human-review responsibilities.

## Self-test

Run this after changing the Council validator:

```bash
node scripts/validate-council-packets.mjs --review-self-test
```

The self-test dynamically constructs a non-accepting UJ-INT-001
`PASS_WITH_ACTIONS` ReviewResult with a real local artifact hash. It must print
`review_self_test=PASS`. This is a validator test, not a Grok review.

## Disposition

| Result | Meaning | Next action |
|---|---|---|
| Validator PASS + reviewer `PASS` | Structurally admissible candidate | inspect evidence, apply approved ledger change only in a new reviewed commit |
| Validator PASS + `PASS_WITH_ACTIONS` | Valid review but not acceptance | keep task REVIEW at current accepted weight; address actions |
| Validator PASS + `FAIL` | Valid negative review | preserve findings; move only through allowed remediation path |
| Validator FAIL | Invalid/stale/mismatched candidate | quarantine it; do not alter ledger; ask reviewer for corrected evidence |

## Security and continuity

- Do not commit secret values, browser data, token values, or private reasoning.
- Do not accept an artifact hash from a remote link without verifying local
  bytes on the reviewed ref.
- Do not use this tool to turn a human-bridge response into automatic approval.
- Append the outcome, hash, error (if any), current weight, and next action to
  both `gpt.md` and `taskgpt.md` at the end of the session.

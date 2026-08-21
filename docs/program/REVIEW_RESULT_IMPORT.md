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
3. Save the JSON as a repository-relative, regular `.json` file, for example
   `docs/program/reviews/inbox/UJ-REVIEW-INT-001-GROK-20260817.json`.
   Absolute paths, `..` traversal, symlinks, and non-JSON candidates are
   rejected before the validator reads their bytes.
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

Run the full intake regression matrix after modifying intake logic:

```bash
node scripts/test-review-result-intake.mjs
```

It runs one admissible non-accepting candidate plus negative cases for partial
weight, the wrong reviewer, a stale commit, an escaped artifact reference, and
an external candidate path. It uses and removes a uniquely named temporary
directory under the repository; it does not change `BACKLOG.json` or publish.

## Disposition

| Result | Meaning | Next action |
|---|---|---|
| Validator PASS + reviewer `PASS` | Structurally admissible candidate | inspect evidence, apply approved ledger change only in a new reviewed commit |
| Validator PASS + `PASS_WITH_ACTIONS` | Valid review but not acceptance | keep task REVIEW at current accepted weight; address actions |
| Validator PASS + `FAIL` | Valid negative review | preserve findings; move only through allowed remediation path |
| Validator FAIL | Invalid/stale/mismatched candidate | quarantine it; do not alter ledger; ask reviewer for corrected evidence |

## Applying an admitted transition

Validation and mutation are separate operations. Preview a ResponsePacket
transition with:

```bash
node scripts/apply-program-transition.mjs \
  --response-packet <repository-relative-packet.json>
```

Preview a ReviewResult transition with:

```bash
node scripts/apply-program-transition.mjs \
  --review-result <repository-relative-review.json> \
  --expected-commit <REVIEWED_COMMIT_SHA>
```

Dry-run is the default and writes nothing. After reviewing the printed task,
state, weight, and released dependencies, a local integrator may apply exactly
that task with both explicit flags:

```bash
node scripts/apply-program-transition.mjs \
  --review-result <repository-relative-review.json> \
  --expected-commit <REVIEWED_COMMIT_SHA> \
  --apply --confirm-task <TASK_ID>
```

The script validates the input first, verifies reviewed artifact bytes at the
pinned commit, writes `BACKLOG.json` and `STATUS.md` through temporary files,
and rolls both files back if either Program OS or Council validation fails. It
does not commit, push, comment, review, merge, close a PR, or write to GitHub.

Regression coverage:

```bash
node scripts/test-program-transition.mjs
```

The test proves that dry-run writes zero ledger files, accepts valid
ResponsePacket and non-accepting ReviewResult previews, and rejects a stale
packet plus an unconfirmed write attempt.

## Security and continuity

- Do not commit secret values, browser data, token values, or private reasoning.
- Do not accept an artifact hash from a remote link without verifying local
  bytes on the reviewed ref.
- Do not use this tool to turn a human-bridge response into automatic approval.
- `--apply` is a local ledger mutation, not evidence that GitHub changed.
- Append the outcome, hash, error (if any), current weight, and next action to
  both `gpt.md` and `taskgpt.md` at the end of the session.

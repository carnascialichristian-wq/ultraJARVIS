# Repository governance v0.1

Status: PROPOSED by UJ-INT-001. Christian remains the final approver.

## Protected intent

`main` represents accepted program state. Work occurs on reviewable branches and
does not become canonical solely because an AI generated it. Draft pull requests
are the default collaboration boundary.

## Branch policy

| Work type | Branch pattern | Base | Merge authority |
|---|---|---|---|
| Program/task artifact | `agent/<task-id>-<slug>` | current accepted integration ref | Christian after required review |
| Urgent security containment | `agent/<incident-id>-containment` | affected accepted ref | Christian; use kill switch first |
| Experiment/spike | `experiment/<task-id>-<slug>` | explicit ADR ref | no production merge without ADR |

- Direct commits to `main` are forbidden unless Christian explicitly instructs
  otherwise for a named change.
- A branch owns one primary task. A secondary task is allowed only when it is
  independent and recorded in the session charter.
- Force pushes, history rewrites, and deletion of unmerged branches require
  explicit approval.

## Commit policy

- Prefix the subject with the task or incident ID, for example:
  `UJ-INT-001 add Program OS v0.1`.
- Commits should be cohesive and free of unrelated user changes.
- Generated artifacts include source/provenance where relevant; secret values
  are never committed.
- A commit is proof of production, not proof of acceptance.

## Pull request gate

Every PR must contain:

1. task/milestone/owner/reviewer;
2. observable outcome and non-goals;
3. data class, side-effect level, and approval reference;
4. binary acceptance criteria;
5. commands/checks with real results;
6. risk and rollback/compensation;
7. task-ledger delta and exact next action.

Critical artifacts require the reviewer named in `BACKLOG.json`. Review outcomes:

- `PASS`: criteria and proof satisfy the output contract;
- `PASS_WITH_ACTIONS`: acceptable with explicit follow-up tasks that do not
  invalidate the artifact;
- `FAIL`: artifact returns to IN_PROGRESS with cited failing criteria.

The author may correct findings but may not self-approve or erase dissent.

## Merge policy

- Default merge method: squash after approval and green required checks.
- PR #1 remains draft until the Constitution, infrastructure default, M0
  ownership, and baseline are accepted by Christian.
- Merges that change Constitution, budget, data class, autonomy ceiling, billing,
  external writes, or production require an explicit owner decision in the PR.
- Deleting the source branch happens only after the merge is verified and no
  stacked work depends on it.

## Required checks by change class

| Change | Minimum checks |
|---|---|
| Program JSON/schema | parse, unique IDs, dependency integrity, weight math |
| TypeScript contracts | format, lint, typecheck, unit and contract tests |
| Dependency/tool | license, advisory, secret, egress, and admission review |
| Database/migration | integration, idempotency, export/restore, rollback |
| UI | E2E, accessibility, security headers, responsive and visual checks |
| External write | dry-run/preview, approval, idempotency, compensation, audit |

## Release and incident rules

- A release must pass zero-cost, data-class, migration/rollback, security, and
  owner-acceptance gates.
- SEV0/SEV1 triggers the kill switch and containment before feature work.
- Rejected or superseded artifacts remain traceable; do not rewrite history to
  make disagreements disappear.


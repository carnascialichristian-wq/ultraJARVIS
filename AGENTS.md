# ultraJARVIS agent instructions

This repository is the canonical blackboard for ultraJARVIS. Chat memory is not
authoritative. Read the artifacts below before changing code or program state:

1. `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md`
2. `docs/program/PROJECT_STATE.md`
3. `docs/program/BACKLOG.json`
4. `docs/program/STATUS.md`
5. approved records in `docs/adrs/`

## Non-negotiable constraints

- Incremental monetary cost is zero. Paid APIs, overage, new billing accounts,
  and billing-enabled infrastructure stay disabled without Christian's explicit
  approval.
- TypeScript, Node.js, and a pnpm monorepo are the application baseline.
- Heavy inference is cloud-side. The owner's computer is not a core server or
  inference host.
- Consumer UI, cookies, and sessions must not be automated.
- Secrets never enter prompts, logs, issues, commits, or semantic memory. Use
  secret references only.
- Provider-specific behavior belongs behind the Provider Gateway and Capability
  Registry.
- Prefer reversible work: branches, drafts, sandboxes, previews, dry-runs, and
  compensating actions.
- Initial autonomy ceiling is L2. External writes require their own approval;
  destructive actions require explicit owner confirmation.

## Session protocol

Before starting work:

- identify the real AI/product and capabilities available in the session;
- read the current repository ref and reconcile it with the backlog;
- select one READY task owned by that AI;
- declare the output contract, acceptance criteria, checks, data class, and
  side-effect ceiling;
- move a task to IN_PROGRESS only when a concrete work artifact exists.

Before ending work:

- update task state only with proof;
- never mark critical work DONE without the named independent reviewer;
- record decisions as ADRs, unresolved facts as assumptions/blockers, and
  reusable output as versioned artifacts;
- provide exact next actions and a `RESUME_POINT`;
- do not claim background work, invented tests, invented consensus, or an ETA
  without measured velocity.

## GitHub workflow

- Do not commit directly to `main` unless Christian explicitly requests it.
- Use `agent/<task-id>-<short-description>` for new work branches.
- Keep one primary task and at most one independent secondary task per AI.
- Stage only task-related files and use terse commits beginning with the task ID.
- Open draft pull requests by default. The PR must identify task IDs, side
  effects, data class, acceptance criteria, checks, risks, and rollback.
- Do not merge your own critical artifact. Preserve reviewer findings as
  `PASS`, `PASS_WITH_ACTIONS`, or `FAIL` with evidence.

## Definition of proof

Accepted proof is a commit/PR, reproducible test output, primary official
source with verification date, artifact hash, or owner decision. A narrative
claim is not proof. Progress is calculated only from accepted weight as defined
in `docs/program/PROGRESS.md`.


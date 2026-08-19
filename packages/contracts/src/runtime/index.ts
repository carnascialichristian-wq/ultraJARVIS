/**
 * ultraJARVIS — runtime contracts, public surface.
 *
 * Task: UJ-RUN-001 (CLAUDE). Status: PROPOSAL, pending review by GEMINI.
 * Design rationale: docs/architecture/RUNTIME_BLUEPRINT.md
 *
 * Every schema exported here needs a version, a migration path, runtime
 * validation and a backward-compatibility test before it leaves PROPOSAL
 * (canonical prompt §9.3). Those tests are specified in the blueprint §13.3
 * and are NOT yet implemented.
 */

export * from "./common.js";
export * from "./agent-manifest.js";
export * from "./team-spec.js";
export * from "./envelopes.js";
export * from "./depth-guard.js";
export * from "./supervisor.js";
export * from "./run-ledger.js";
export * from "./checkpoint.js";

/** Version of the runtime contract set as a whole. */
export const RUNTIME_CONTRACTS_VERSION = "0.1.0" as const;

/** Provenance of this contract set, for the Program OS ledger. */
export const RUNTIME_CONTRACTS_PROVENANCE = {
  taskId: "UJ-RUN-001",
  owner: "CLAUDE",
  reviewer: "GEMINI",
  status: "REVIEW",
  canonicalPromptSha256:
    "a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87",
} as const;

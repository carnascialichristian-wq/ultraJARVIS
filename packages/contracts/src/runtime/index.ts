/**
 * ultraJARVIS — runtime contracts, public surface.
 *
 * Task: UJ-RUN-001 (CLAUDE).
 *
 * Contract maturity: PROPOSAL — these types have not been through the §9.3 gate.
 * Delivery status:   BLOCKED — see RUNTIME_CONTRACTS_PROVENANCE below.
 * The two are different axes and used to be conflated in this header: a contract can be
 * mature and its delivery inadmissible, or the reverse.
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

/**
 * Provenance of this contract set, for the Program OS ledger.
 *
 * `status` is the DELIVERY status proposed by the ResponsePacket, and it is BLOCKED:
 * the delegation card UJ-CARD-RUN-001-CLAUDE does not exist at the commit its own
 * repository_scope.read_ref names (3611b1b4); it enters the history twelve minutes
 * later, at d48e1e85. This constant said "REVIEW" until session 6, which made the one
 * machine-readable copy of the status contradict the packet that hashes this file.
 * It is not a claim about the quality of the contracts, which typecheck and are covered
 * by 36 executable invariants.
 */
export const RUNTIME_CONTRACTS_PROVENANCE = {
  taskId: "UJ-RUN-001",
  owner: "CLAUDE",
  reviewer: "GEMINI",
  status: "BLOCKED",
  canonicalPromptSha256:
    "a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87",
} as const;

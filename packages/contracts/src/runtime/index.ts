/**
 * ultraJARVIS — runtime contracts, public surface.
 *
 * Task: UJ-RUN-001 (CLAUDE).
 *
 * Contract maturity: PROPOSAL — these types have not been through the §9.3 gate.
 * Delivery status:   REVIEW — see RUNTIME_CONTRACTS_PROVENANCE below.
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
 * `status` is the DELIVERY status proposed by the ResponsePacket. It is REVIEW as of
 * 2026-08-19, after CHATGPT corrected the delegation card: the card now exists at its own
 * read_ref, that ref is reachable from origin/main, the four pinned inputs match 4 of 4,
 * and validate-council-packets.mjs passes at exit 0. It read BLOCKED while those
 * conditions failed, and REVIEW before that for the wrong reason.
 *
 * REVIEW is not acceptance: accepted weight stays 0/13 until GEMINI rules. This constant
 * is the only machine-readable copy of the delivery status, so it must be moved in the
 * same commit as the packet, never afterwards.
 */
export const RUNTIME_CONTRACTS_PROVENANCE = {
  taskId: "UJ-RUN-001",
  owner: "CLAUDE",
  reviewer: "GEMINI",
  status: "REVIEW",
  canonicalPromptSha256:
    "a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87",
} as const;

/**
 * ultraJARVIS — policy contracts, public surface.
 *
 * Task: UJ-SEC-001 (CLAUDE). Status: PROPOSAL, pending review by GROK.
 * Rationale: docs/constitution/APPROVAL_POLICY.md
 */

export * from "./approval.js";

export const POLICY_CONTRACTS_VERSION = "0.1.0" as const;

export const POLICY_CONTRACTS_PROVENANCE = {
  taskId: "UJ-SEC-001",
  owner: "CLAUDE",
  reviewer: "GROK",
  status: "REVIEW",
} as const;

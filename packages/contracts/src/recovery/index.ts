/**
 * ultraJARVIS — recovery contracts, public surface.
 *
 * Task: UJ-RCV-001 (CLAUDE). Status: PROPOSAL, pending review by CHATGPT.
 * Rationale: docs/runbooks/DISASTER_RECOVERY.md
 */

export * from "./active-task-counter.js";

export const RECOVERY_CONTRACTS_VERSION = "0.1.0" as const;

export const RECOVERY_CONTRACTS_PROVENANCE = {
  taskId: "UJ-RCV-001",
  owner: "CLAUDE",
  reviewer: "CHATGPT",
  status: "REVIEW",
} as const;

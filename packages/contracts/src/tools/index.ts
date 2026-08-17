/**
 * ultraJARVIS — tool plane contracts, public surface.
 *
 * Task: UJ-MCP-001 (CLAUDE). Status: PROPOSAL, pending review by GEMINI.
 * Rationale: docs/architecture/TOOL_PLANE.md
 */

export * from "./tool-manifest.js";

export const TOOL_CONTRACTS_VERSION = "0.1.0" as const;

export const TOOL_CONTRACTS_PROVENANCE = {
  taskId: "UJ-MCP-001",
  owner: "CLAUDE",
  reviewer: "GEMINI",
  status: "REVIEW",
} as const;

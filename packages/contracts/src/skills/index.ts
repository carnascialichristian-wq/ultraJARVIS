/**
 * ultraJARVIS — Recipe Factory and Skill Forge contracts, public surface.
 *
 * Task: UJ-SKL-001 (CLAUDE). Status: PROPOSAL, pending review by CHATGPT.
 * Rationale: docs/architecture/SKILL_FORGE.md
 */

export * from "./recipe.js";
export * from "./skill-forge.js";

export const SKILL_CONTRACTS_VERSION = "0.1.0" as const;

export const SKILL_CONTRACTS_PROVENANCE = {
  taskId: "UJ-SKL-001",
  owner: "CLAUDE",
  reviewer: "CHATGPT",
  status: "REVIEW",
} as const;

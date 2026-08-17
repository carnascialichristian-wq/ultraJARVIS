/**
 * ultraJARVIS — Recipe: composition of existing tools, with no new executable code.
 *
 * Task: UJ-SKL-001 (CLAUDE). Rationale: docs/architecture/SKILL_FORGE.md
 *
 * Canonical prompt §13: the first answer to a new need must be "can a Recipe of
 * existing tools satisfy it?". New code only when the verified answer is no.
 *
 * Recipes are easier to verify, revoke and replace than skills, because they add
 * no new attack surface: every step is a tool that already passed admission.
 */

import type {
  DataClass,
  IsoTimestamp,
  SemVer,
  SideEffectLevel,
  ToolId,
} from "../runtime/common.js";
import type { SchemaRef } from "../runtime/common.js";

export interface RecipeStep {
  readonly stepId: string;
  /** Must reference an already-admitted tool. A Recipe never introduces one. */
  readonly toolId: ToolId;
  readonly toolVersion: SemVer;
  readonly preconditions: readonly string[];
  readonly onFailure: "ABORT" | "RETRY" | "COMPENSATE" | "BRANCH";
  readonly branchTo?: string;
}

export interface RecipeManifest {
  readonly recipeId: string;
  readonly version: SemVer;
  readonly intent: string;
  readonly useCases: readonly string[];
  readonly inputSchema: SchemaRef;
  readonly outputSchema: SchemaRef;
  readonly steps: readonly [RecipeStep, ...RecipeStep[]];
  readonly preconditions: readonly string[];
  readonly maxDataClass: DataClass;
  readonly maxSideEffect: SideEffectLevel;
  readonly approvalGate: "NONE" | "AUDIT" | "APPROVAL" | "HUMAN_BRIDGE";
  readonly checkpoints: readonly string[];
  readonly failureBranches: readonly string[];
  readonly acceptanceTests: readonly string[];
  readonly owner: string;
  readonly createdAt: IsoTimestamp;
}

export type RecipeValidity =
  | { readonly valid: true }
  | { readonly valid: false; readonly reasons: readonly [string, ...string[]] };

/**
 * A Recipe is valid only if it composes admitted tools and declares how it fails.
 * `isToolAdmitted` is injected so this package stays free of registry dependencies.
 */
export function validateRecipe(
  recipe: RecipeManifest,
  isToolAdmitted: (toolId: ToolId, version: SemVer) => boolean,
): RecipeValidity {
  const reasons: string[] = [];

  for (const step of recipe.steps) {
    if (!isToolAdmitted(step.toolId, step.toolVersion)) {
      reasons.push(`step ${step.stepId} uses ${step.toolId}@${step.toolVersion}, not admitted`);
    }
    if (step.onFailure === "BRANCH" && !step.branchTo) {
      reasons.push(`step ${step.stepId} branches on failure but declares no target`);
    }
  }

  if (recipe.acceptanceTests.length === 0) {
    reasons.push("a recipe without acceptance tests cannot be accepted or revoked on evidence");
  }
  if (recipe.maxSideEffect !== "NONE" && recipe.approvalGate === "NONE") {
    reasons.push(`sideEffect ${recipe.maxSideEffect} requires an approval gate above NONE`);
  }

  const [first, ...rest] = reasons;
  return first === undefined ? { valid: true } : { valid: false, reasons: [first, ...rest] };
}

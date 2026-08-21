/**
 * ultraJARVIS — approval policy, executable form.
 *
 * Task: UJ-SEC-001 (CLAUDE). Rationale: docs/constitution/APPROVAL_POLICY.md
 *
 * The matrix in the document is decidable by code rather than by interpretation:
 * `evaluateApproval` is pure and deterministic, so every row can be tested and no
 * gate depends on a model reading a table correctly at runtime.
 */

import { isInDomain } from "../runtime/common.js";
import {
  autonomyWithin,
  dataClassWithin,
  sideEffectWithin,
  type AutonomyLevel,
  type DataClass,
  type IsoTimestamp,
  type IdempotencyKey,
  type ProviderMode,
  type RunId,
  type SideEffectLevel,
  type TaskId,
} from "../runtime/common.js";

export type Gate =
  | "ALLOW"
  | "ALLOW_WITH_AUDIT"
  | "REQUIRE_APPROVAL"
  | "REQUIRE_HUMAN_BRIDGE"
  | "DENY";

/** Ordered from most permissive to most restrictive. The most restrictive wins. */
export const GATE_ORDER = [
  "ALLOW",
  "ALLOW_WITH_AUDIT",
  "REQUIRE_APPROVAL",
  "REQUIRE_HUMAN_BRIDGE",
  "DENY",
] as const satisfies readonly Gate[];

export function strictestGate(a: Gate, b: Gate): Gate {
  // S-28: `indexOf` gives -1 for a value outside GATE_ORDER, and -1 never wins a
  // `>=`, so an unrecognised gate was silently replaced by the permissive one.
  // Measured before the fix: strictestGate("SCONOSCIUTO", "ALLOW") -> "ALLOW".
  // An unrecognised gate is now treated as the strictest, never dropped.
  if (!isInDomain(GATE_ORDER, a) || !isInDomain(GATE_ORDER, b)) return "DENY";
  return GATE_ORDER.indexOf(a) >= GATE_ORDER.indexOf(b) ? a : b;
}

/** Closed vocabulary of action kinds. An unknown action is denied, not guessed. */
export type ActionKind =
  | "READ_PUBLIC_SOURCE"
  | "READ_PRIVATE_REPO"
  | "WRITE_WORKING_BRANCH"
  | "OPEN_PULL_REQUEST"
  | "WRITE_DEFAULT_BRANCH"
  | "DEPLOY_SANDBOX_PREVIEW"
  | "PUBLISH_PRODUCTION"
  | "SEND_MESSAGE"
  | "MODIFY_ACCOUNT"
  | "ENABLE_BILLING"
  | "MODIFY_PRODUCTION_DATA"
  | "DELETE"
  | "AUTOMATE_CONSUMER_UI"
  | "ROTATE_CREDENTIALS_FOR_QUOTA";

/** Base gate per action kind (APPROVAL_POLICY.md §3.1). */
export const ACTION_GATE: Readonly<Record<ActionKind, Gate>> = {
  READ_PUBLIC_SOURCE: "ALLOW",
  READ_PRIVATE_REPO: "ALLOW_WITH_AUDIT",
  WRITE_WORKING_BRANCH: "ALLOW_WITH_AUDIT",
  OPEN_PULL_REQUEST: "REQUIRE_APPROVAL",
  WRITE_DEFAULT_BRANCH: "DENY",
  DEPLOY_SANDBOX_PREVIEW: "ALLOW_WITH_AUDIT",
  PUBLISH_PRODUCTION: "REQUIRE_APPROVAL",
  SEND_MESSAGE: "REQUIRE_APPROVAL",
  MODIFY_ACCOUNT: "REQUIRE_APPROVAL",
  ENABLE_BILLING: "DENY",
  MODIFY_PRODUCTION_DATA: "REQUIRE_APPROVAL",
  DELETE: "REQUIRE_APPROVAL",
  AUTOMATE_CONSUMER_UI: "DENY",
  ROTATE_CREDENTIALS_FOR_QUOTA: "DENY",
};

/** Minimum autonomy required per side-effect level (APPROVAL_POLICY.md §3.3). */
export const MIN_AUTONOMY_FOR_SIDE_EFFECT: Readonly<Record<SideEffectLevel, AutonomyLevel>> = {
  NONE: "L0",
  INTERNAL_WRITE: "L2",
  EXTERNAL_WRITE: "L3",
  DESTRUCTIVE: "L3",
};

export type OverrideId =
  | "OV-1" | "OV-2" | "OV-3" | "OV-4" | "OV-5"
  | "OV-6" | "OV-7" | "OV-8" | "OV-9" | "OV-10";

export interface PolicyRequest {
  readonly runId: RunId;
  readonly taskId: TaskId;
  readonly action: ActionKind;
  readonly sideEffect: SideEffectLevel;
  readonly dataClass: DataClass;
  /** Ceilings of the agent asking. */
  readonly agentMaxSideEffect: SideEffectLevel;
  readonly agentMaxDataClass: DataClass;
  readonly agentAutonomy: AutonomyLevel;
  readonly agentRoleStatus: "APPROVED" | "CANDIDATE";
  /** Access mode of the capability this action would use. */
  readonly providerMode: ProviderMode;
  readonly killSwitchEngaged: boolean;
  readonly mayIncurCost: boolean;
  readonly requiresLocalHeavyCompute: boolean;
  readonly usesConsumerUiSession: boolean;
  readonly isDedicatedHighClassWorkflow: boolean;
  readonly rollbackPlan: string | null;
}

export interface PolicyReason {
  readonly rule: OverrideId | "MATRIX" | "AUTONOMY" | "UNKNOWN_ACTION";
  /** Named, never generic: review must show which rule decided. */
  readonly detail: string;
}

export interface PolicyDecision {
  readonly gate: Gate;
  readonly reasons: readonly PolicyReason[];
}

/**
 * Evaluates a policy request.
 *
 * Overrides are evaluated FIRST and can only tighten the outcome. All matching
 * reasons are collected rather than short-circuiting on the first: a decision that
 * names one cause hides the others and makes review misleading.
 */
export function evaluateApproval(request: PolicyRequest): PolicyDecision {
  const reasons: PolicyReason[] = [];
  let gate: Gate = ACTION_GATE[request.action];

  if (gate === undefined) {
    return {
      gate: "DENY",
      reasons: [{ rule: "UNKNOWN_ACTION", detail: "action kind is not in the closed vocabulary" }],
    };
  }
  reasons.push({ rule: "MATRIX", detail: `base gate for ${request.action} is ${gate}` });

  const deny = (rule: OverrideId, detail: string): void => {
    gate = strictestGate(gate, "DENY");
    reasons.push({ rule, detail });
  };

  // OV-1: Article 5 — zero incremental cost.
  if (request.mayIncurCost) {
    deny("OV-1", "operation may incur cost, billing or overage");
  }

  // OV-2: cloud-only.
  if (request.requiresLocalHeavyCompute) {
    deny("OV-2", "operation requires heavy local inference");
  }

  // OV-3: never automate consumer UI sessions.
  if (request.usesConsumerUiSession) {
    deny("OV-3", "operation uses cookies, UI scraping or a consumer session");
  }

  // OV-4: C3/C4 are default deny outside a dedicated workflow.
  if (!dataClassWithin(request.dataClass, "C2") && !request.isDedicatedHighClassWorkflow) {
    deny("OV-4", `dataClass ${request.dataClass} requires a dedicated C3/C4 workflow`);
  }

  // OV-5: a CANDIDATE role is born powerless.
  if (request.agentRoleStatus === "CANDIDATE" && request.sideEffect !== "NONE") {
    deny("OV-5", "CANDIDATE role may not perform side effects");
  }

  // OV-6: the kill switch admits no exception.
  if (request.killSwitchEngaged) {
    deny("OV-6", "kill switch is engaged");
  }

  // OV-7: Article 4 made mechanical — no rollback plan, no destructive action.
  if (request.sideEffect === "DESTRUCTIVE" && !request.rollbackPlan) {
    deny("OV-7", "destructive operation without a rollback plan is not approvable");
  }

  // OV-8 / OV-9: Article 8 — no self-escalation.
  if (!sideEffectWithin(request.sideEffect, request.agentMaxSideEffect)) {
    deny("OV-8", `sideEffect ${request.sideEffect} exceeds agent ceiling ${request.agentMaxSideEffect}`);
  }
  if (!dataClassWithin(request.dataClass, request.agentMaxDataClass)) {
    deny("OV-9", `dataClass ${request.dataClass} exceeds agent ceiling ${request.agentMaxDataClass}`);
  }

  // Minimum autonomy for the requested side effect.
  const required = MIN_AUTONOMY_FOR_SIDE_EFFECT[request.sideEffect];
  if (!autonomyWithin(required, request.agentAutonomy)) {
    gate = strictestGate(gate, "DENY");
    reasons.push({
      rule: "AUTONOMY",
      detail: `sideEffect ${request.sideEffect} requires at least ${required}, agent has ${request.agentAutonomy}`,
    });
  }

  // DESTRUCTIVE always needs an explicit human decision, never bounded delegation.
  if (request.sideEffect === "DESTRUCTIVE") {
    gate = strictestGate(gate, "REQUIRE_APPROVAL");
    reasons.push({ rule: "MATRIX", detail: "destructive operations always require approval" });
  }

  // OV-10: an unverified automatic path falls back to a human bridge, never to a guess.
  if (gate !== "DENY" && request.providerMode !== "AUTO_VERIFIED") {
    if (request.providerMode === "PAID_ONLY_DISABLED" || request.providerMode === "LOCAL_COMPUTE_DISABLED") {
      deny("OV-10", `provider mode ${request.providerMode} is not admissible`);
    } else {
      gate = strictestGate(gate, "REQUIRE_HUMAN_BRIDGE");
      reasons.push({
        rule: "OV-10",
        detail: `provider mode ${request.providerMode} is not AUTO_VERIFIED; use a human bridge`,
      });
    }
  }

  return { gate, reasons };
}

// ---------------------------------------------------------------------------
// Validity of a granted approval at the moment of use
// ---------------------------------------------------------------------------

export interface ApprovalScope {
  readonly runId: RunId;
  readonly taskId: TaskId;
  readonly operation: string;
  /**
   * Binds the approval to the exact payload it was granted for. Without this,
   * "approve writing file A" would authorise writing file B under the same
   * operation name.
   */
  readonly idempotencyKey: IdempotencyKey;
}

export interface GrantedApproval {
  readonly scope: ApprovalScope;
  readonly signedByOwner: boolean;
  readonly expiresAt: IsoTimestamp;
}

export type ApprovalValidity =
  | "VALID"
  | "NOT_SIGNED"
  | "EXPIRED"
  | "SCOPE_MISMATCH"
  | "PAYLOAD_MISMATCH";

export function approvalValidity(
  approval: GrantedApproval,
  operation: ApprovalScope,
  now: IsoTimestamp,
): ApprovalValidity {
  if (!approval.signedByOwner) return "NOT_SIGNED";
  if (now >= approval.expiresAt) return "EXPIRED";
  if (
    approval.scope.runId !== operation.runId ||
    approval.scope.taskId !== operation.taskId ||
    approval.scope.operation !== operation.operation
  ) {
    return "SCOPE_MISMATCH";
  }
  if (approval.scope.idempotencyKey !== operation.idempotencyKey) return "PAYLOAD_MISMATCH";
  return "VALID";
}

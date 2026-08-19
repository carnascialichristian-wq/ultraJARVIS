/**
 * ultraJARVIS — DepthGuard: structural limits on recursion and privilege.
 *
 * Task: UJ-RUN-001 (CLAUDE). Blueprint §6 and §9.
 *
 * These limits are not configurable by any agent, under any circumstance:
 * not through a manifest, not through a prompt, not through a tool, and not
 * through the content of an artifact the agent is reading.
 *
 * The functions here are pure and deterministic: they can be exhaustively tested
 * without calling a model, and they consume no quota.
 */

import { autonomyWithin, dataClassWithin, sideEffectWithin } from "./common.js";
import type { Depth, ToolGrant } from "./agent-manifest.js";
import type { EffectiveLimits } from "./envelopes.js";

// ---------------------------------------------------------------------------
// Hard limits (canonical prompt §10.3)
// ---------------------------------------------------------------------------

export const DEPTH_GUARD_LIMITS = {
  /** DG-1 */
  maxDepth: 3,
  /** DG-2 */
  maxFanOutPerAgent: 5,
  /** DG-3 — in practice the binding constraint, see BINDING_CONSTRAINT_NOTE. */
  maxActiveAtomicTasksPerRun: 25,
  /** DG-5 */
  defaultToolAllowlist: [] as readonly ToolGrant[],
} as const;

/**
 * The theoretical tree under DG-1 and DG-2 is 1 + 5 + 25 + 125 = 156 nodes,
 * but DG-3 caps active atomic tasks at 25. So admission fails by counter
 * saturation long before it fails by depth.
 *
 * Consequence for implementers: the active-task counter must be an ATOMIC
 * resource (compare-and-swap or transaction), not read-then-write. Concurrent
 * fan-out against a non-atomic counter exceeds 25 by race condition, and this
 * is the part of DepthGuard that breaks first in a naive implementation.
 * Covered by test T-DG-4b.
 */
export const BINDING_CONSTRAINT_NOTE = "DG-3 binds before DG-1; counter must be atomic" as const;

// ---------------------------------------------------------------------------
// Admission decisions
// ---------------------------------------------------------------------------

export type InvariantId =
  | "INV-D1"
  | "INV-D2"
  | "INV-D3"
  | "INV-D4"
  | "INV-D5"
  | "INV-D6"
  | "INV-D7"
  | "INV-D8"
  | "INV-D9"
  | "INV-D10"
  | "TA-1"
  | "TA-2"
  | "TA-3"
  | "TA-4"
  | "TA-5"
  | "TA-6"
  | "TA-7"
  | "TA-8"
  | "TA-9"
  | "TA-10";

export interface AdmissionViolation {
  readonly invariant: InvariantId;
  /** Named, not generic: the reviewer must see WHICH rule protected the system. */
  readonly detail: string;
}

export type AdmissionDecision =
  | { readonly admitted: true }
  | { readonly admitted: false; readonly violations: readonly [AdmissionViolation, ...AdmissionViolation[]] };

export interface SpawnRequest {
  readonly parentDepth: Depth;
  readonly childDepth: number;
  readonly parentChildCount: number;
  readonly activeAtomicTasks: number;
  readonly parentLimits: EffectiveLimits;
  readonly childLimits: EffectiveLimits;
}

// ---------------------------------------------------------------------------
// Tool allowlist inheritance (Blueprint §9)
// ---------------------------------------------------------------------------

function grantKey(grant: ToolGrant): string {
  return `${grant.toolId}@${grant.version}`;
}

/**
 * TA-2 / TA-10: the child's allowlist must be a subset of the parent's effective
 * allowlist, matched on BOTH id and version. A version mismatch is a violation,
 * not a near-match: an updated tool must go through a fresh admission.
 */
export function allowlistWithin(
  child: readonly ToolGrant[],
  parent: readonly ToolGrant[],
): readonly ToolGrant[] {
  const parentKeys = new Set(parent.map(grantKey));
  return child.filter((grant) => !parentKeys.has(grantKey(grant)));
}

// ---------------------------------------------------------------------------
// The admission check
// ---------------------------------------------------------------------------

/**
 * Evaluates every DepthGuard and allowlist invariant for a spawn request.
 *
 * Returns ALL violations rather than short-circuiting on the first: a rejection
 * report that names one cause hides the others and makes review misleading.
 */
export function checkSpawn(request: SpawnRequest): AdmissionDecision {
  const violations: AdmissionViolation[] = [];
  const { parentDepth, childDepth, parentChildCount, activeAtomicTasks } = request;
  const { parentLimits: parent, childLimits: child } = request;

  // INV-D1: depth ceiling.
  if (childDepth > DEPTH_GUARD_LIMITS.maxDepth) {
    violations.push({
      invariant: "INV-D1",
      detail: `child depth ${childDepth} exceeds max depth ${DEPTH_GUARD_LIMITS.maxDepth}`,
    });
  }

  // INV-D2: an agent at max depth is leaf-only.
  if (parentDepth >= DEPTH_GUARD_LIMITS.maxDepth) {
    violations.push({
      invariant: "INV-D2",
      detail: `agent at depth ${parentDepth} may not spawn children`,
    });
  }

  // INV-D5: depth increments by exactly one.
  if (childDepth !== parentDepth + 1) {
    violations.push({
      invariant: "INV-D5",
      detail: `child depth ${childDepth} must equal parent depth ${parentDepth} + 1`,
    });
  }

  // INV-D3: fan-out ceiling.
  if (parentChildCount >= DEPTH_GUARD_LIMITS.maxFanOutPerAgent) {
    violations.push({
      invariant: "INV-D3",
      detail: `parent already has ${parentChildCount} children, max is ${DEPTH_GUARD_LIMITS.maxFanOutPerAgent}`,
    });
  }

  // INV-D4: active atomic task ceiling — the binding constraint.
  if (activeAtomicTasks >= DEPTH_GUARD_LIMITS.maxActiveAtomicTasksPerRun) {
    violations.push({
      invariant: "INV-D4",
      detail: `run has ${activeAtomicTasks} active atomic tasks, max is ${DEPTH_GUARD_LIMITS.maxActiveAtomicTasksPerRun}`,
    });
  }

  // TA-2 / TA-10: no tool the parent does not itself hold, at that exact version.
  const escalated = allowlistWithin(child.toolAllowlist, parent.toolAllowlist);
  for (const grant of escalated) {
    violations.push({
      invariant: "TA-2",
      detail: `child requests ${grantKey(grant)} which the parent does not hold`,
    });
  }

  // TA-4 / INV-D8: data class ceiling.
  if (!dataClassWithin(child.maxDataClass, parent.maxDataClass)) {
    violations.push({
      invariant: "TA-4",
      detail: `child maxDataClass ${child.maxDataClass} exceeds parent ${parent.maxDataClass}`,
    });
  }

  // TA-5: autonomy ceiling.
  if (!autonomyWithin(child.maxAutonomy, parent.maxAutonomy)) {
    violations.push({
      invariant: "TA-5",
      detail: `child maxAutonomy ${child.maxAutonomy} exceeds parent ${parent.maxAutonomy}`,
    });
  }

  // TA-8: side-effect ceiling.
  if (!sideEffectWithin(child.maxSideEffect, parent.maxSideEffect)) {
    violations.push({
      invariant: "TA-8",
      detail: `child maxSideEffect ${child.maxSideEffect} exceeds parent ${parent.maxSideEffect}`,
    });
  }

  // INV-D9: deadline may not outlive the parent's.
  if (child.deadline > parent.deadline) {
    violations.push({
      invariant: "INV-D9",
      detail: `child deadline ${child.deadline} is later than parent deadline ${parent.deadline}`,
    });
  }

  // INV-D10: quota may not exceed the parent's remaining budget.
  if (child.quotaBudget.maxProviderCalls > parent.quotaBudget.maxProviderCalls) {
    violations.push({
      invariant: "INV-D10",
      detail: `child provider-call budget exceeds parent's remaining budget`,
    });
  }

  const [first, ...rest] = violations;
  if (first === undefined) {
    return { admitted: true };
  }
  return { admitted: false, violations: [first, ...rest] };
}

// ---------------------------------------------------------------------------
// Loop detection (Blueprint §6.4)
// ---------------------------------------------------------------------------

export const LOOP_THRESHOLDS = {
  /** Same normalised mission hash appearing this many times in a branch. */
  intentRepeat: 3,
  /** Identical output content hash across consecutive attempts. */
  outputStagnation: 2,
  /** k-gram length and repetition count for tool-call cycles. */
  toolCycleK: 3,
  toolCycleRepeats: 3,
  /** Jaccard similarity over token shingles counting as stagnation. */
  similarityThreshold: 0.95,
} as const;

export type LoopSignal = "INTENT_REPEAT" | "OUTPUT_STAGNATION" | "TOOL_CYCLE";

export interface LoopDetection {
  readonly signal: LoopSignal;
  readonly evidence: readonly string[];
  readonly detectedAt: string;
}

/**
 * Deterministic similarity over token shingles. No embeddings, no model call,
 * therefore no quota cost and nothing an agent can talk its way around.
 */
export function jaccardSimilarity(a: readonly string[], b: readonly string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Detects a k-gram repeated `repeats` times in a tool-call sequence. */
export function hasToolCycle(
  sequence: readonly string[],
  k: number = LOOP_THRESHOLDS.toolCycleK,
  repeats: number = LOOP_THRESHOLDS.toolCycleRepeats,
): boolean {
  if (sequence.length < k * repeats) return false;
  const counts = new Map<string, number>();
  for (let i = 0; i + k <= sequence.length; i += 1) {
    const gram = sequence.slice(i, i + k).join(" ");
    const next = (counts.get(gram) ?? 0) + 1;
    if (next >= repeats) return true;
    counts.set(gram, next);
  }
  return false;
}

// ---------------------------------------------------------------------------
// Kill switch (Blueprint §6.5)
// ---------------------------------------------------------------------------

export interface KillSwitchState {
  readonly engaged: boolean;
  readonly scope: "RUN" | "TEAM" | "GLOBAL";
  readonly engagedBy: "OWNER";
  readonly engagedAt: string;
  readonly gracePeriodMs: number;
}

/**
 * There is no parameter, policy or manifest field that disables this.
 * A kill switch that can be negotiated is not a kill switch.
 */
export function mayStartNewStep(kill: KillSwitchState | null): boolean {
  return kill === null || !kill.engaged;
}

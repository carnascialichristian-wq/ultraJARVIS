/**
 * ultraJARVIS — Supervisor state machine.
 *
 * Task: UJ-RUN-001 (CLAUDE). Blueprint §5.
 *
 * ADR-RUN candidate: the supervisor is deterministic code, not a privileged
 * model-agent. A supervisor implemented as a prompt is vulnerable to injection
 * from the very artifacts it supervises; since the supervisor is the entity that
 * enforces the limits, making it steerable by the content it inspects voids them.
 * A model may advise the supervisor — its output is a typed suggestion, never a command.
 */

import type { AgentId, IsoTimestamp, RunId, TeamId } from "./common.js";
import type { ArtifactRef } from "./envelopes.js";

export type SupervisorState =
  | "INIT"
  | "VALIDATING"
  | "REJECTED"
  | "PLANNING"
  | "DISPATCHING"
  | "MONITORING"
  | "COLLECTING"
  | "MERGING"
  | "AWAITING_APPROVAL"
  | "AWAITING_BRIDGE"
  | "COMPENSATING"
  | "DISSOLVING"
  | "CLOSED"
  | "FAILED"
  | "CANCELLED"
  | "HALTED";

export const TERMINAL_SUPERVISOR_STATES = [
  "REJECTED",
  "CLOSED",
  "FAILED",
  "CANCELLED",
  "HALTED",
] as const satisfies readonly SupervisorState[];

export type SupervisorTrigger =
  | "SPEC_RECEIVED"
  | "ADMISSION_OK"
  | "ADMISSION_FAILED"
  | "PLAN_READY"
  | "NO_DECOMPOSITION_NEEDED"
  | "DISPATCHED"
  | "RESULT_RECEIVED"
  | "APPROVAL_REQUIRED"
  | "BRIDGE_REQUIRED"
  | "APPROVAL_GRANTED"
  | "APPROVAL_DENIED"
  | "BRIDGE_RESULT_RECEIVED"
  | "BRIDGE_DEADLINE_PASSED"
  | "SCHEMA_VALID"
  | "REWORK_ALLOWED"
  | "REWORK_EXHAUSTED"
  | "TASKS_REMAINING"
  | "EXIT_CRITERIA_MET"
  | "COMPENSATION_DONE"
  | "DISSOLVED"
  | "CANCEL_REQUESTED"
  | "KILL_SWITCH";

/**
 * Closed vocabulary of guard names (S-29).
 *
 * It was `readonly string[]`, so ANY string compiled: a typo in a guard name was
 * indistinguishable from a real guard, and the guard it was meant to name simply
 * vanished. That is the same shape as S-28 — a domain left open — applied to the
 * conditions that gate every state change, including the HUMAN_BRIDGE path.
 *
 * With a union type, a misspelled guard is a COMPILE ERROR, and `GUARD_REGISTRY`
 * below is typed `Record<GuardName, ...>`, so forgetting to describe one is a
 * compile error too. The vocabulary and its descriptions cannot drift apart.
 */
export type GuardName =
  | "allExitCriteriaVerified"
  | "approvalNotExpired"
  | "approvalScopeMatchesOperation"
  | "approvalSigned"
  | "artifactsSealed"
  | "budgetRemaining"
  | "checkpointWrittenBeforeRequest"
  | "confirmedSideEffectsExist"
  | "dagAcyclic"
  | "dataClassCompatible"
  | "decompositionRationalePresent"
  | "delegationCardIssued"
  | "depthGuardOk"
  | "envelopeSignedByExpectedAgent"
  | "envelopesTyped"
  | "everyMemberHasValidToken"
  | "gracePeriodHonoured"
  | "ledgerClosed"
  | "limitsMonotonic"
  | "mergeRecorded"
  | "noActiveTasks"
  | "noConfirmedSideEffects"
  | "originLabelledHumanProvided"
  | "quotaPreflightOk"
  | "responsibilitiesDisjoint"
  | "resultValidatedAgainstSchema"
  | "reworkCountBelowMax"
  | "schemaValidationPassed"
  | "singleAgentRationaleRecorded"
  | "tokensRevoked"
  | "violationsRecorded";

export interface Transition {
  readonly from: SupervisorState;
  readonly trigger: SupervisorTrigger;
  readonly to: SupervisorState;
  /** Guards evaluated BEFORE the effect. All must hold. */
  readonly guards: readonly GuardName[];
}

/**
 * The complete transition table. Anything not listed here is not a legal move:
 * the machine denies by default rather than falling through to a permissive branch.
 */
export const SUPERVISOR_TRANSITIONS: readonly Transition[] = [
  { from: "INIT", trigger: "SPEC_RECEIVED", to: "VALIDATING", guards: [] },
  {
    from: "VALIDATING",
    trigger: "ADMISSION_FAILED",
    to: "REJECTED",
    guards: ["violationsRecorded"],
  },
  {
    from: "VALIDATING",
    trigger: "ADMISSION_OK",
    to: "PLANNING",
    guards: ["depthGuardOk", "dagAcyclic", "responsibilitiesDisjoint", "limitsMonotonic"],
  },
  {
    from: "PLANNING",
    trigger: "PLAN_READY",
    to: "DISPATCHING",
    guards: ["decompositionRationalePresent", "envelopesTyped", "quotaPreflightOk"],
  },
  {
    from: "PLANNING",
    trigger: "NO_DECOMPOSITION_NEEDED",
    to: "DISSOLVING",
    guards: ["singleAgentRationaleRecorded"],
  },
  {
    from: "DISPATCHING",
    trigger: "DISPATCHED",
    to: "MONITORING",
    guards: ["everyMemberHasValidToken"],
  },
  {
    from: "MONITORING",
    trigger: "RESULT_RECEIVED",
    to: "COLLECTING",
    guards: ["envelopeSignedByExpectedAgent"],
  },
  {
    from: "MONITORING",
    trigger: "APPROVAL_REQUIRED",
    to: "AWAITING_APPROVAL",
    guards: ["checkpointWrittenBeforeRequest"],
  },
  {
    from: "MONITORING",
    trigger: "BRIDGE_REQUIRED",
    to: "AWAITING_BRIDGE",
    guards: ["checkpointWrittenBeforeRequest", "delegationCardIssued"],
  },
  { from: "MONITORING", trigger: "CANCEL_REQUESTED", to: "CANCELLED", guards: ["gracePeriodHonoured"] },
  {
    from: "AWAITING_APPROVAL",
    trigger: "APPROVAL_GRANTED",
    to: "MONITORING",
    guards: ["approvalSigned", "approvalNotExpired", "approvalScopeMatchesOperation"],
  },
  {
    from: "AWAITING_APPROVAL",
    trigger: "APPROVAL_DENIED",
    to: "COMPENSATING",
    guards: ["confirmedSideEffectsExist"],
  },
  {
    from: "AWAITING_APPROVAL",
    trigger: "APPROVAL_DENIED",
    to: "FAILED",
    guards: ["noConfirmedSideEffects"],
  },
  {
    from: "AWAITING_BRIDGE",
    trigger: "BRIDGE_RESULT_RECEIVED",
    to: "COLLECTING",
    guards: ["resultValidatedAgainstSchema", "originLabelledHumanProvided"],
  },
  { from: "AWAITING_BRIDGE", trigger: "BRIDGE_DEADLINE_PASSED", to: "FAILED", guards: [] },
  {
    from: "COLLECTING",
    trigger: "SCHEMA_VALID",
    to: "MERGING",
    guards: ["schemaValidationPassed", "dataClassCompatible"],
  },
  {
    from: "COLLECTING",
    trigger: "REWORK_ALLOWED",
    to: "DISPATCHING",
    guards: ["reworkCountBelowMax", "budgetRemaining"],
  },
  { from: "COLLECTING", trigger: "REWORK_EXHAUSTED", to: "COMPENSATING", guards: [] },
  { from: "MERGING", trigger: "TASKS_REMAINING", to: "DISPATCHING", guards: ["mergeRecorded"] },
  {
    from: "MERGING",
    trigger: "EXIT_CRITERIA_MET",
    to: "DISSOLVING",
    guards: ["allExitCriteriaVerified", "noActiveTasks"],
  },
  { from: "COMPENSATING", trigger: "COMPENSATION_DONE", to: "FAILED", guards: [] },
  {
    from: "DISSOLVING",
    trigger: "DISSOLVED",
    to: "CLOSED",
    guards: ["tokensRevoked", "artifactsSealed", "ledgerClosed"],
  },
];

/**
 * The kill switch reaches HALTED from every non-terminal state with no guard.
 * This is deliberate and is asserted by test T-KS-1.
 */
export function isKillReachable(state: SupervisorState): boolean {
  return !(TERMINAL_SUPERVISOR_STATES as readonly SupervisorState[]).includes(state);
}

export function nextState(
  from: SupervisorState,
  trigger: SupervisorTrigger,
): readonly Transition[] {
  if (trigger === "KILL_SWITCH") {
    return isKillReachable(from)
      ? [{ from, trigger, to: "HALTED", guards: [] }]
      : [];
  }
  return SUPERVISOR_TRANSITIONS.filter((t) => t.from === from && t.trigger === trigger);
}

// ---------------------------------------------------------------------------
// Guard registry and evaluation (S-29)
// ---------------------------------------------------------------------------

/**
 * Why this exists.
 *
 * `nextState` is a pure lookup: it RETURNS the guards of a transition and does not
 * evaluate them. That is correct for a contracts package with no I/O, but it left
 * the safety conditions as strings that nothing bound to code — so a caller could
 * take the transition and never look at `guards` at all, and nothing would say so.
 *
 * `evaluateGuards` closes that: every guard has an entry here (the `Record<GuardName, …>`
 * makes a missing one a compile error), and a guard whose input is absent comes back
 * as NOT_EVALUABLE instead of silently counting as satisfied. `canTransition` then
 * fails CLOSED on anything that is not positively satisfied — the lesson of S-28
 * applied to the state machine.
 */
export type GuardVerdict = "SATISFIED" | "VIOLATED" | "NOT_EVALUABLE";

/**
 * What a guard may inspect. Every field is optional on purpose: a caller supplies
 * what it has, and a guard whose input is missing reports NOT_EVALUABLE rather than
 * guessing. Fields the contracts package cannot model (ledger, tokens, schemas) are
 * deliberately absent — the guards that need them are declared REQUIRES_RUNTIME.
 */
export interface GuardContext {
  readonly now?: IsoTimestamp;
  /** The artifact returned through the human bridge. */
  readonly bridgeResult?: ArtifactRef;
  readonly activeAtomicTasks?: number;
  readonly confirmedSideEffectCount?: number;
  readonly approvalExpiresAt?: IsoTimestamp;
  readonly remainingBudgetTokens?: number;
  readonly reworkCount?: number;
  readonly maxRework?: number;
  readonly gracePeriodMs?: number;
  readonly gracePeriodElapsedMs?: number;
}

export interface GuardDescriptor {
  /** What the guard asserts, in one line. */
  readonly asserts: string;
  /**
   * PURE  — decidable from GuardContext alone, implemented below.
   * RUNTIME — needs state the contracts package does not model (ledger, token
   *           service, schema registry). Always NOT_EVALUABLE here, by design and
   *           visibly, so nobody mistakes an unimplemented guard for a passing one.
   */
  readonly kind: "PURE" | "RUNTIME";
  readonly evaluate: (ctx: GuardContext) => GuardVerdict;
}

const RUNTIME = (asserts: string): GuardDescriptor => ({
  asserts,
  kind: "RUNTIME",
  evaluate: () => "NOT_EVALUABLE",
});

const pure = (asserts: string, f: (ctx: GuardContext) => boolean | undefined): GuardDescriptor => ({
  asserts,
  kind: "PURE",
  evaluate: (ctx) => {
    const r = f(ctx);
    return r === undefined ? "NOT_EVALUABLE" : r ? "SATISFIED" : "VIOLATED";
  },
});

/**
 * Every guard named by the transition table. The `Record<GuardName, …>` type means
 * adding a guard to a transition without describing it here does not compile.
 */
export const GUARD_REGISTRY: Record<GuardName, GuardDescriptor> = {
  // --- PURE: decidable here, and implemented ---
  originLabelledHumanProvided: pure(
    "the artifact returned through the human bridge is labelled HUMAN_PROVIDED",
    (ctx) =>
      ctx.bridgeResult === undefined
        ? undefined
        : ctx.bridgeResult.originLabel === "HUMAN_PROVIDED",
  ),
  noActiveTasks: pure("no atomic task is still running", (ctx) =>
    ctx.activeAtomicTasks === undefined ? undefined : ctx.activeAtomicTasks === 0,
  ),
  confirmedSideEffectsExist: pure("at least one side effect was confirmed", (ctx) =>
    ctx.confirmedSideEffectCount === undefined ? undefined : ctx.confirmedSideEffectCount > 0,
  ),
  noConfirmedSideEffects: pure("no side effect was confirmed", (ctx) =>
    ctx.confirmedSideEffectCount === undefined ? undefined : ctx.confirmedSideEffectCount === 0,
  ),
  approvalNotExpired: pure("the approval has not expired", (ctx) =>
    ctx.now === undefined || ctx.approvalExpiresAt === undefined
      ? undefined
      : ctx.now <= ctx.approvalExpiresAt,
  ),
  budgetRemaining: pure("budget is left for another step", (ctx) =>
    ctx.remainingBudgetTokens === undefined ? undefined : ctx.remainingBudgetTokens > 0,
  ),
  reworkCountBelowMax: pure("rework has not exhausted its allowance", (ctx) =>
    ctx.reworkCount === undefined || ctx.maxRework === undefined
      ? undefined
      : ctx.reworkCount < ctx.maxRework,
  ),
  gracePeriodHonoured: pure("the cancellation grace period elapsed before halting", (ctx) =>
    ctx.gracePeriodElapsedMs === undefined || ctx.gracePeriodMs === undefined
      ? undefined
      : ctx.gracePeriodElapsedMs >= ctx.gracePeriodMs,
  ),

  // --- RUNTIME: named, described, and honestly not decidable here ---
  allExitCriteriaVerified: RUNTIME("every exit criterion of the mission was verified"),
  approvalScopeMatchesOperation: RUNTIME("the approval covers exactly the operation attempted"),
  approvalSigned: RUNTIME("the approval carries a valid signature"),
  artifactsSealed: RUNTIME("all artifacts are content-addressed and sealed"),
  checkpointWrittenBeforeRequest: RUNTIME("a checkpoint was durably written before the request"),
  dagAcyclic: RUNTIME("the decomposition graph has no cycle"),
  dataClassCompatible: RUNTIME("the result's data class fits the caller's ceiling"),
  decompositionRationalePresent: RUNTIME("the decomposition records why it split this way"),
  delegationCardIssued: RUNTIME("a delegation card exists for the bridged task"),
  depthGuardOk: RUNTIME("depth, fan-out and active-task limits all hold"),
  envelopeSignedByExpectedAgent: RUNTIME("the envelope is signed by the agent it was sent to"),
  envelopesTyped: RUNTIME("every envelope validates against its declared schema"),
  everyMemberHasValidToken: RUNTIME("every team member holds an unexpired capability token"),
  ledgerClosed: RUNTIME("the run ledger is closed and its hash chain verifies"),
  limitsMonotonic: RUNTIME("every child's limits are narrower than its parent's"),
  mergeRecorded: RUNTIME("the merge of partial results was recorded in the ledger"),
  quotaPreflightOk: RUNTIME("the quota preflight left room for the planned work"),
  responsibilitiesDisjoint: RUNTIME("no two sibling tasks claim the same responsibility"),
  resultValidatedAgainstSchema: RUNTIME("the result validates against the expected schema"),
  schemaValidationPassed: RUNTIME("schema validation passed on collection"),
  singleAgentRationaleRecorded: RUNTIME("running single-agent instead of a team was justified"),
  tokensRevoked: RUNTIME("every capability token issued for the run was revoked"),
  violationsRecorded: RUNTIME("the validation violations were recorded before rejecting"),
};

export interface GuardEvaluation {
  readonly satisfied: readonly GuardName[];
  readonly violated: readonly GuardName[];
  readonly notEvaluable: readonly GuardName[];
}

export function evaluateGuards(
  guards: readonly GuardName[],
  ctx: GuardContext,
): GuardEvaluation {
  const satisfied: GuardName[] = [];
  const violated: GuardName[] = [];
  const notEvaluable: GuardName[] = [];
  for (const g of guards) {
    switch (GUARD_REGISTRY[g].evaluate(ctx)) {
      case "SATISFIED":
        satisfied.push(g);
        break;
      case "VIOLATED":
        violated.push(g);
        break;
      default:
        notEvaluable.push(g);
    }
  }
  return { satisfied, violated, notEvaluable };
}

export interface TransitionDecision extends GuardEvaluation {
  readonly allowed: boolean;
  readonly to: SupervisorState | null;
}

/**
 * The evaluating counterpart of `nextState`. FAILS CLOSED: a transition is allowed
 * only when every guard is positively SATISFIED. A guard that could not be evaluated
 * blocks the move and is reported by name — an unevaluated guard must never read as
 * a passing one (S-28, and E22/E38 on probes).
 *
 * The kill switch is the deliberate exception, and it is an exception in the SAFE
 * direction: it carries no guards, so a broken or unevaluable guard can never stop
 * a run from being halted.
 */
export function canTransition(
  from: SupervisorState,
  trigger: SupervisorTrigger,
  ctx: GuardContext = {},
): TransitionDecision {
  const moves = nextState(from, trigger);
  if (moves.length === 0) {
    return { allowed: false, to: null, satisfied: [], violated: [], notEvaluable: [] };
  }
  const move = moves[0]!;
  const ev = evaluateGuards(move.guards, ctx);
  const allowed = ev.violated.length === 0 && ev.notEvaluable.length === 0;
  return { ...ev, allowed, to: allowed ? move.to : null };
}

// ---------------------------------------------------------------------------
// Liveness
// ---------------------------------------------------------------------------

export const HEARTBEAT_POLICY = {
  /** Missed heartbeats after which an agent is suspect. */
  suspectAfterMissed: 3,
  /** Missed heartbeats after which an agent is considered dead. */
  deadAfterMissed: 5,
} as const;

/**
 * A dead agent is never simply relaunched: blind relaunch of an agent that had
 * already performed an external write is the canonical way to produce a double
 * effect. The supervisor checkpoints, inspects the ledger for confirmed effects,
 * then chooses idempotent retry, compensation or escalation.
 */
export type DeadAgentResolution = "IDEMPOTENT_RETRY" | "COMPENSATE" | "ESCALATE";

export interface SupervisorSnapshot {
  readonly runId: RunId;
  readonly teamId: TeamId | null;
  readonly supervisorAgentId: AgentId;
  readonly state: SupervisorState;
  readonly activeAtomicTasks: number;
  readonly reworkCount: number;
  readonly maxRework: number;
  readonly updatedAt: IsoTimestamp;
}

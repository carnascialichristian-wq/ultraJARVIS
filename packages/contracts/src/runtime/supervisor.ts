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

export interface Transition {
  readonly from: SupervisorState;
  readonly trigger: SupervisorTrigger;
  readonly to: SupervisorState;
  /** Guards evaluated BEFORE the effect. All must hold. */
  readonly guards: readonly string[];
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

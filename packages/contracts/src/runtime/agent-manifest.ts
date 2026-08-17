/**
 * ultraJARVIS — AgentManifest: the contract of existence for a temporary agent.
 *
 * Task: UJ-RUN-001 (CLAUDE). Blueprint §3.
 *
 * An agent without an admitted manifest cannot be instantiated. The manifest is
 * immutable after admission: any change mints a new agentId and a new admission.
 */

import type {
  AgentId,
  AutonomyLevel,
  Criterion,
  DataClass,
  EscalationRoute,
  IsoTimestamp,
  Provenance,
  QuotaBudget,
  RunId,
  SchemaRef,
  SemVer,
  SideEffectLevel,
  TaskId,
  TeamId,
  TokenRef,
  ToolId,
} from "./common.js";
import type { ArtifactRef } from "./envelopes.js";

/** Maximum tree depth. Not configurable by any agent (DG-1). */
export type Depth = 0 | 1 | 2 | 3;

/**
 * A tool grant is always pinned to an exact version (TA-3, TA-10).
 * An unpinned grant would allow tool poisoning by update: the tool admitted as
 * harmless changes behaviour afterwards while the agent keeps the old permission.
 */
export interface ToolGrant {
  readonly toolId: ToolId;
  readonly version: SemVer;
  /** Hash of the ToolManifest as admitted; re-verified on every call (S11). */
  readonly manifestHash: string;
  readonly maxSideEffect: SideEffectLevel;
}

/**
 * Role status. A CANDIDATE role is one the catalogue does not yet approve.
 * It is born powerless and can only be promoted by recorded human review —
 * this closes the "the agent writes itself a more privileged role" vector.
 */
export type RoleStatus = "APPROVED" | "CANDIDATE";

export type AgentRole = string;

/** How the agent ends. There is no CONTINUE_UNTIL_DONE. */
export type TerminationCriterion =
  | { readonly kind: "ARTIFACT_PRODUCED"; readonly outputSchema: SchemaRef }
  | { readonly kind: "CRITERIA_SATISFIED"; readonly criteria: readonly Criterion[] }
  | { readonly kind: "BUDGET_EXHAUSTED"; readonly partialResultAllowed: true }
  | { readonly kind: "DELEGATED"; readonly handoffTo: AgentId }
  | { readonly kind: "BLOCKED"; readonly missingInput: string };

export interface AgentManifest {
  readonly agentId: AgentId;
  readonly manifestVersion: SemVer;

  /** Dynamic creation = instantiating an approved template, never inventing a role. */
  readonly templateId: string;
  readonly templateVersion: SemVer;
  readonly role: AgentRole;
  readonly roleStatus: RoleStatus;

  readonly mission: string;
  readonly taskIds: readonly [TaskId, ...TaskId[]];
  readonly inputArtifactRefs: readonly ArtifactRef[];
  readonly outputSchemaRef: SchemaRef;
  readonly acceptanceCriteria: readonly Criterion[];

  /** Default is the empty array (DG-5, TA-1). Nothing is inherited implicitly. */
  readonly toolAllowlist: readonly ToolGrant[];

  readonly maxDataClass: DataClass;
  readonly maxAutonomy: AutonomyLevel;
  readonly maxSideEffect: SideEffectLevel;

  readonly quotaBudget: QuotaBudget;
  /** Absolute deadline, never relative: a relative deadline drifts across resumes. */
  readonly deadline: IsoTimestamp;
  readonly stepTimeoutMs: number;
  readonly heartbeatIntervalMs: number;

  readonly depth: Depth;
  readonly parentAgentId: AgentId | null;
  readonly runId: RunId;
  readonly teamId: TeamId | null;

  readonly terminationCriterion: TerminationCriterion;
  readonly reviewerId: string;
  readonly escalationRoute: EscalationRoute;
  readonly capabilityTokenRef: TokenRef;

  readonly provenance: Provenance;
  readonly createdAt: IsoTimestamp;
}

/** Agent lifecycle states. Blueprint §2.2. */
export type AgentState =
  | "PROPOSED"
  | "REJECTED"
  | "ADMITTED"
  | "RUNNING"
  | "WAITING_APPROVAL"
  | "WAITING_BRIDGE"
  | "WAITING_CHILD"
  | "PRODUCED"
  | "REWORK"
  | "ACCEPTED"
  | "FAILED"
  | "CANCELLED"
  | "TIMED_OUT"
  | "KILLED";

export const TERMINAL_AGENT_STATES = [
  "REJECTED",
  "ACCEPTED",
  "FAILED",
  "CANCELLED",
  "TIMED_OUT",
  "KILLED",
] as const satisfies readonly AgentState[];

export function isTerminalAgentState(state: AgentState): boolean {
  return (TERMINAL_AGENT_STATES as readonly AgentState[]).includes(state);
}

/**
 * Constraints a CANDIDATE role must satisfy at admission.
 * Blueprint §3.3.
 */
export const CANDIDATE_ROLE_CEILING = {
  maxSideEffect: "NONE",
  maxAutonomy: "L1",
  toolAllowlistLength: 0,
} as const;

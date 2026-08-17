/**
 * ultraJARVIS — TeamSpec: the contract of a temporary team.
 *
 * Task: UJ-RUN-001 (CLAUDE). Blueprint §4.
 *
 * A team exists only because an objective cannot be reached by a single agent
 * within its own limits. Its existence is temporary by construction.
 */

import type {
  AgentId,
  Criterion,
  IsoTimestamp,
  QuotaBudget,
  SemVer,
  TaskId,
  TeamId,
} from "./common.js";
import type { ArtifactRef } from "./envelopes.js";

/**
 * Closed vocabulary. Two members carrying the same responsibility on the same task
 * is a specification error, not useful redundancy: it duplicates work, creates
 * semantic merge conflicts and doubles quota consumption.
 */
export const RESPONSIBILITIES = [
  "plan",
  "design",
  "implement",
  "review",
  "test",
  "document",
  "research",
  "integrate",
] as const;
export type Responsibility = (typeof RESPONSIBILITIES)[number];

export interface TeamMember {
  readonly agentId: AgentId;
  readonly responsibilities: readonly [Responsibility, ...Responsibility[]];
  readonly taskIds: readonly TaskId[];
}

/** Dependency edge between tasks. The graph must be a DAG; a cycle is rejected. */
export interface Edge {
  readonly from: TaskId;
  readonly to: TaskId;
}

export interface SharedArtifactGrant {
  readonly artifact: ArtifactRef;
  readonly readableBy: readonly AgentId[];
  /** Write access is granted per agent and never to the whole team by default. */
  readonly writableBy: readonly AgentId[];
}

export type MergeProtocol =
  | { readonly kind: "SEQUENTIAL_HANDOFF"; readonly order: readonly AgentId[] }
  | { readonly kind: "PARALLEL_DISJOINT"; readonly partitionKey: string }
  | { readonly kind: "PROPOSE_AND_REVIEW"; readonly producer: AgentId; readonly reviewer: AgentId }
  | { readonly kind: "COMPETING_DRAFTS"; readonly selectionRationaleRequired: true };

/**
 * Automatic tie-break is forbidden when the dissent concerns security, cost or
 * irreversibility — precisely the cases human approval exists for.
 */
export interface DissentPolicy {
  readonly recordAlways: true;
  readonly escalateOnSecurity: true;
  readonly escalateOnCost: true;
  readonly escalateOnIrreversibility: true;
}

export type TieBreakRule =
  | { readonly kind: "SUPERVISOR_DECIDES"; readonly rationaleRequired: true }
  | { readonly kind: "REVIEWER_DECIDES"; readonly reviewer: AgentId }
  | { readonly kind: "ESCALATE_TO_OWNER" };

export interface TeamLimits {
  readonly maxDepth: 0 | 1 | 2 | 3;
  readonly maxFanOutPerAgent: number;
  readonly maxActiveAtomicTasks: number;
  readonly quotaBudget: QuotaBudget;
  readonly maxWallClockMs: number;
}

export type ExitCriterion =
  | { readonly kind: "ALL_CRITERIA_SATISFIED"; readonly criteria: readonly Criterion[] }
  | { readonly kind: "DELIVERABLE_ACCEPTED"; readonly reviewer: string }
  | { readonly kind: "BUDGET_EXHAUSTED" }
  | { readonly kind: "BLOCKED"; readonly escalated: true };

export interface DissolutionPolicy {
  /** Capability tokens are revoked before anything else. */
  readonly revokeTokens: true;
  /** Artifacts are sealed: content-addressed and immutable after dissolution. */
  readonly sealArtifacts: true;
  readonly retainLedger: true;
  readonly releaseQuota: true;
}

export interface TeamSpec {
  readonly teamId: TeamId;
  readonly specVersion: SemVer;
  readonly objective: string;
  readonly successCriteria: readonly [Criterion, ...Criterion[]];
  /** Exactly one supervisor. Enforced by the type and re-checked at admission. */
  readonly supervisorAgentId: AgentId;
  readonly members: readonly TeamMember[];
  readonly dependencyGraph: readonly Edge[];
  readonly sharedArtifacts: readonly SharedArtifactGrant[];
  readonly mergeProtocol: MergeProtocol;
  readonly dissentPolicy: DissentPolicy;
  readonly tieBreak: TieBreakRule;
  readonly limits: TeamLimits;
  readonly exitCriteria: readonly [ExitCriterion, ...ExitCriterion[]];
  readonly dissolutionPolicy: DissolutionPolicy;
  readonly createdAt: IsoTimestamp;
}

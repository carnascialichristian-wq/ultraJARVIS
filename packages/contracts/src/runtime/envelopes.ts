/**
 * ultraJARVIS — typed artifact communication.
 *
 * Task: UJ-RUN-001 (CLAUDE). Blueprint §10.
 *
 * Agents exchange content-addressed typed artifacts, never free text. Free text
 * between agents loses provenance, cannot be validated, widens the prompt-injection
 * surface and grows context without bound.
 */

import type {
  AgentId,
  ArtifactId,
  AutonomyLevel,
  ContentHash,
  Criterion,
  DataClass,
  FailureClass,
  IdempotencyKey,
  IsoTimestamp,
  Provenance,
  QuotaBudget,
  RunId,
  SchemaRef,
  SemVer,
  SideEffectLevel,
  TaskId,
  TokenRef,
} from "./common.js";
import type { ToolGrant } from "./agent-manifest.js";

/**
 * Trust label implementing the data/instruction separation.
 *
 * UNTRUSTED_EXTERNAL content (web, third-party repos, issues, email, MCP output)
 * is never an instruction channel, however persuasive it is to the model reading it.
 */
export type OriginLabel = "TRUSTED_INTERNAL" | "UNTRUSTED_EXTERNAL" | "HUMAN_PROVIDED";

/** An artifact is identified by its content, not by its path. */
export interface ArtifactRef {
  readonly artifactId: ArtifactId;
  readonly version: SemVer;
  /** The real identity: sha256 of the canonicalised content. */
  readonly contentHash: ContentHash;
  readonly schemaRef: SchemaRef;
  readonly mediaType: string;
  readonly dataClass: DataClass;
  readonly producedBy: AgentId | "HUMAN" | "CONTROL_PLANE";
  readonly derivedFrom: readonly ArtifactRef[];
  readonly originLabel: OriginLabel;
  readonly createdAt: IsoTimestamp;
}

/** Effective limits handed to an agent. Always narrower than the parent's. */
export interface EffectiveLimits {
  readonly toolAllowlist: readonly ToolGrant[];
  readonly maxDataClass: DataClass;
  readonly maxAutonomy: AutonomyLevel;
  readonly maxSideEffect: SideEffectLevel;
  readonly quotaBudget: QuotaBudget;
  readonly deadline: IsoTimestamp;
}

/** Supervisor → Agent. */
export interface TaskEnvelope {
  readonly envelopeVersion: SemVer;
  readonly runId: RunId;
  readonly taskId: TaskId;
  readonly agentId: AgentId;
  readonly mission: string;
  readonly inputArtifactRefs: readonly ArtifactRef[];
  readonly expectedOutputSchema: SchemaRef;
  readonly acceptanceCriteria: readonly Criterion[];
  readonly limits: EffectiveLimits;
  readonly capabilityTokenRef: TokenRef;
  readonly cancellationTokenRef: TokenRef;
  /** Scope under which idempotency keys for this task are minted. */
  readonly idempotencyScope: string;
  readonly issuedAt: IsoTimestamp;
}

export type ResultStatus = "PRODUCED" | "PARTIAL" | "BLOCKED" | "FAILED";

export interface Blocker {
  readonly kind: "MISSING_INPUT" | "POLICY" | "QUOTA" | "CAPABILITY" | "HUMAN_DECISION";
  readonly cause: string;
  /** Never "everyone": a blocker with no named resolver is not actionable. */
  readonly resolvableBy: "OWNER" | "SUPERVISOR" | AgentId;
  readonly requiredInput: string;
}

/** Dissent survives the decision and travels with the artifact (Blueprint §4.4). */
export interface DissentRecord {
  readonly by: AgentId;
  readonly position: string;
  readonly rationale: string;
  readonly evidence: readonly ArtifactRef[];
  readonly recordedAt: IsoTimestamp;
}

export interface BudgetConsumed {
  readonly providerCalls: number;
  readonly toolCalls: number;
  readonly wallClockMs: number;
  readonly estimatedTokens?: number;
}

/** Agent → Supervisor. */
export interface ResultEnvelope {
  readonly envelopeVersion: SemVer;
  readonly runId: RunId;
  readonly taskId: TaskId;
  readonly agentId: AgentId;
  readonly status: ResultStatus;
  readonly outputArtifactRefs: readonly ArtifactRef[];
  readonly criteriaSatisfied: readonly Criterion[];
  readonly criteriaUnsatisfied: readonly Criterion[];
  readonly budgetConsumed: BudgetConsumed;
  /** Reversible working hypotheses, surfaced rather than hidden. */
  readonly assumptions: readonly string[];
  readonly blockers: readonly Blocker[];
  readonly dissent: readonly DissentRecord[];
  readonly nextActionProposal: string;
  readonly failureClass?: FailureClass;
  readonly provenance: Provenance;
  readonly producedAt: IsoTimestamp;
}

/** A side effect that has been attempted; the ledger of record for idempotency. */
export interface SideEffectRecord {
  readonly key: IdempotencyKey;
  readonly operationName: string;
  readonly status: "PENDING" | "CONFIRMED" | "FAILED" | "COMPENSATED";
  readonly resultHash?: ContentHash;
  readonly at: IsoTimestamp;
}

/**
 * Copy/paste package for a capability that is only reachable through a consumer UI.
 * The system never automates the UI, never touches cookies or sessions.
 */
export interface DelegationCard {
  readonly cardId: string;
  readonly runId: RunId;
  readonly taskId: TaskId;
  readonly targetProduct: string;
  readonly instructionsForHuman: string;
  readonly promptToPaste: string;
  readonly expectedReturnSchema: SchemaRef;
  readonly dataClass: DataClass;
  readonly deadline: IsoTimestamp;
  readonly issuedAt: IsoTimestamp;
}

/** Request for a human approval gate. Never auto-granted. */
export interface ApprovalCard {
  readonly cardId: string;
  readonly runId: RunId;
  readonly taskId: TaskId;
  readonly operation: string;
  readonly sideEffect: SideEffectLevel;
  readonly impactSummary: string;
  readonly reversible: boolean;
  readonly rollbackPlan: string;
  readonly dataClass: DataClass;
  readonly requestedAt: IsoTimestamp;
  readonly expiresAt: IsoTimestamp;
}

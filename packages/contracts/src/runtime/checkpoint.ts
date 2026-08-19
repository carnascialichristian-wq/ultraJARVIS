/**
 * ultraJARVIS — checkpoint, resume, cancellation and retry semantics.
 *
 * Task: UJ-RUN-001 (CLAUDE). Blueprint §8.
 *
 * Golden rule: checkpoint BEFORE every side effect. Not after, not "periodically".
 */

import type {
  AgentId,
  CheckpointId,
  ContentHash,
  FailureClass,
  IdempotencyKey,
  IsoTimestamp,
  RunId,
} from "./common.js";
import { encodeInjective } from "./common.js";
import type { AgentState } from "./agent-manifest.js";
import type { ArtifactRef, SideEffectRecord } from "./envelopes.js";
import type { SupervisorState } from "./supervisor.js";

export interface QuotaCounter {
  readonly scope: string;
  readonly used: number;
  readonly limit: number;
  readonly windowResetsAt?: IsoTimestamp;
  /** Never invented: when the provider exposes no counter, this stays UNKNOWN. */
  readonly source: "PROVIDER_COUNTER" | "OBSERVED_THRESHOLD" | "UNKNOWN";
}

export interface Checkpoint {
  readonly checkpointId: CheckpointId;
  readonly runId: RunId;
  readonly seq: number;
  readonly supervisorState: SupervisorState;
  readonly agentStates: Readonly<Record<string, AgentState>>;
  readonly activeTaskCount: number;
  /** References plus hashes, never inline content. */
  readonly artifactRefs: readonly ArtifactRef[];
  readonly quotaCounters: readonly QuotaCounter[];
  readonly pendingApprovals: readonly string[];
  /** Operations whose key was minted but whose outcome is unknown. */
  readonly pendingSideEffects: readonly SideEffectRecord[];
  readonly ledgerOffset: number;
  readonly stateHash: ContentHash;
  readonly writtenAt: IsoTimestamp;
}

export type CheckpointValidity = "VALID" | "HASH_MISMATCH" | "DANGLING_ARTIFACT";

/**
 * A checkpoint is usable only if its hash verifies AND every referenced artifact
 * resolves. An invalid checkpoint is never used for resume: the runtime walks
 * back to the previous valid one, and if none is valid the run fails rather than
 * restarting blind.
 */
export function checkpointValidity(
  checkpoint: Checkpoint,
  computeStateHash: (c: Checkpoint) => ContentHash,
  artifactResolves: (ref: ArtifactRef) => boolean,
): CheckpointValidity {
  if (computeStateHash(checkpoint) !== checkpoint.stateHash) return "HASH_MISMATCH";
  for (const ref of checkpoint.artifactRefs) {
    if (!artifactResolves(ref)) return "DANGLING_ARTIFACT";
  }
  return "VALID";
}

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

export type SideEffectResolution =
  /** A matching tool.returned exists: adopt the recorded result, do not re-run. */
  | { readonly kind: "CONFIRMED"; readonly resultHash: ContentHash }
  /** The tool supports lookup by key and reports it never happened: safe to retry. */
  | { readonly kind: "NOT_EXECUTED" }
  /**
   * The tool exposes no lookup by idempotency key, so the runtime cannot know
   * whether the write happened. The only honest answer is to stop and ask.
   */
  | { readonly kind: "NON_IDEMPOTENT"; readonly requiresHumanDecision: true };

export interface ResumePlan {
  readonly fromCheckpoint: CheckpointId;
  readonly ledgerReplayFrom: number;
  readonly resolutions: Readonly<Record<string, SideEffectResolution>>;
  readonly firstUnconfirmedStep: string | null;
  readonly degraded: boolean;
}

// ---------------------------------------------------------------------------
// Cancellation
// ---------------------------------------------------------------------------

export type CancellationPhase = "SOFT" | "HARD" | "COMPENSATE";

export interface CancellationState {
  readonly requestedAt: IsoTimestamp;
  readonly requestedBy: "OWNER" | "SUPERVISOR";
  readonly phase: CancellationPhase;
  readonly gracePeriodMs: number;
  /** Partial artifacts are always preserved: cancellation is never a silent loss. */
  readonly preservePartialArtifacts: true;
}

// ---------------------------------------------------------------------------
// Retry
// ---------------------------------------------------------------------------

export interface RetryRule {
  readonly maxAttempts: number;
  readonly backoff: "NONE" | "EXPONENTIAL" | "WAIT_FOR_QUOTA_WINDOW";
  readonly jitter: boolean;
  /** When true, the rule applies only if the operation is idempotent. */
  readonly requiresIdempotency: boolean;
  readonly note: string;
}

/**
 * Retry policy by failure class. No retry without a classified cause, and no
 * aggressive retry on rate limits (canonical prompt §6.3).
 *
 * The retry budget is INCLUDED in quotaBudget, never additive: an agent cannot
 * buy itself more work by failing.
 */
export const RETRY_POLICY: Readonly<Record<FailureClass, RetryRule>> = {
  TRANSIENT_PROVIDER: {
    maxAttempts: 3,
    backoff: "EXPONENTIAL",
    jitter: true,
    requiresIdempotency: false,
    note: "ordinary transient failure",
  },
  TIMEOUT: {
    maxAttempts: 2,
    backoff: "EXPONENTIAL",
    jitter: true,
    requiresIdempotency: true,
    note: "a timed-out write may have landed; retry only when idempotent",
  },
  RATE_LIMIT: {
    maxAttempts: 1,
    backoff: "WAIT_FOR_QUOTA_WINDOW",
    jitter: true,
    requiresIdempotency: false,
    note: "no aggressive retry; prefer fallback or human bridge",
  },
  QUOTA_EXHAUSTED: {
    maxAttempts: 0,
    backoff: "NONE",
    jitter: false,
    requiresIdempotency: false,
    note: "fallback, bridge or pause; never account or key rotation",
  },
  SCHEMA_VIOLATION: {
    maxAttempts: 1,
    backoff: "NONE",
    jitter: false,
    requiresIdempotency: false,
    note: "one repair attempt with schema feedback, then fail",
  },
  POLICY_DENIED: {
    maxAttempts: 0,
    backoff: "NONE",
    jitter: false,
    requiresIdempotency: false,
    note: "retrying a denied policy is an attempt to circumvent it",
  },
  TOOL_ERROR: {
    maxAttempts: 1,
    backoff: "EXPONENTIAL",
    jitter: true,
    requiresIdempotency: true,
    note: "classify the sub-cause before deciding",
  },
  INTERNAL_BUG: {
    maxAttempts: 0,
    backoff: "NONE",
    jitter: false,
    requiresIdempotency: false,
    note: "fail fast and raise an incident",
  },
  NON_IDEMPOTENT: {
    maxAttempts: 0,
    backoff: "NONE",
    jitter: false,
    requiresIdempotency: false,
    note: "outcome unknowable without lookup; requires human decision",
  },
  CANCELLED: {
    maxAttempts: 0,
    backoff: "NONE",
    jitter: false,
    requiresIdempotency: false,
    note: "terminal",
  },
  KILLED: {
    maxAttempts: 0,
    backoff: "NONE",
    jitter: false,
    requiresIdempotency: false,
    note: "terminal",
  },
};

export function mayRetry(failureClass: FailureClass, attempt: number, isIdempotent: boolean): boolean {
  const rule = RETRY_POLICY[failureClass];
  if (attempt >= rule.maxAttempts) return false;
  if (rule.requiresIdempotency && !isIdempotent) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Idempotency
// ---------------------------------------------------------------------------

export interface IdempotencyKeyParts {
  readonly runId: RunId;
  readonly taskId: string;
  readonly operationName: string;
  readonly canonicalPayload: string;
  readonly toolVersion: string;
}

/**
 * Parts are LENGTH-PREFIXED before hashing. A plain separator would make the key
 * ambiguous: with a space, runId="a b" + taskId="c" and runId="a" + taskId="b c"
 * hash to the same material, so two genuinely different operations would collide
 * and the second would be silently skipped as a duplicate — the exact failure the
 * idempotency ledger exists to prevent. `encodeInjective` (common.ts) length-prefixes
 * each part, which makes the encoding injective. It is shared with the tool-cycle
 * detector in depth-guard.ts, which had the same defect and did not have the fix.
 *
 * The attempt number is deliberately NOT part of the key. That is precisely what
 * makes retry safe: the same logical work yields the same key, so a second attempt
 * is recognisable as a duplicate instead of looking like a new operation.
 *
 * `sha256Hex` is injected to keep this package dependency-free.
 */
export function buildIdempotencyKey(
  parts: IdempotencyKeyParts,
  sha256Hex: (input: string) => string,
): IdempotencyKey {
  const material = encodeInjective([
    parts.runId,
    parts.taskId,
    parts.operationName,
    parts.canonicalPayload,
    parts.toolVersion,
  ]);
  return sha256Hex(material) as IdempotencyKey;
}

export interface SideEffectLedger {
  lookup(key: IdempotencyKey): Promise<SideEffectRecord | null>;
  reserve(key: IdempotencyKey, operationName: string): Promise<void>;
  confirm(key: IdempotencyKey, resultHash: ContentHash): Promise<void>;
  fail(key: IdempotencyKey, cause: FailureClass): Promise<void>;
}

export interface AgentRuntimeSnapshot {
  readonly agentId: AgentId;
  readonly state: AgentState;
  readonly attempt: number;
  readonly lastHeartbeatAt: IsoTimestamp | null;
}

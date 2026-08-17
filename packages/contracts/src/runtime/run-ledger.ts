/**
 * ultraJARVIS — RunLedger: append-only truth about an execution.
 *
 * Task: UJ-RUN-001 (CLAUDE). Blueprint §7.
 *
 * State is a projection of the ledger, never the other way round. Without the
 * hash chain, an "audit trail" is just a file that anyone with write access —
 * including a compromised skill — can rewrite after the fact.
 */

import type {
  AgentId,
  ContentHash,
  FailureClass,
  IdempotencyKey,
  IsoTimestamp,
  RunId,
  TaskId,
  ToolId,
} from "./common.js";

export type RunEventType =
  // run lifecycle
  | "run.created"
  | "run.planned"
  | "run.completed"
  | "run.failed"
  | "run.cancelled"
  // agents
  | "agent.proposed"
  | "agent.admitted"
  | "agent.rejected"
  | "agent.delegated"
  | "agent.heartbeat"
  | "agent.produced"
  | "agent.terminated"
  // tools
  | "tool.called"
  | "tool.returned"
  | "tool.failed"
  // persistence
  | "checkpoint.written"
  | "checkpoint.restored"
  // approvals and bridges
  | "approval.requested"
  | "approval.granted"
  | "approval.denied"
  | "bridge.card_issued"
  | "bridge.result_received"
  // control
  | "retry.scheduled"
  | "blocked.recorded"
  | "loop.detected"
  | "quota.reserved"
  | "quota.released"
  | "killswitch.engaged"
  // compensation
  | "compensation.started"
  | "compensation.completed"
  // merge
  | "merged"
  | "dissent.recorded";

/**
 * Base event. Payloads carry ArtifactRefs and hashes, never large inline content:
 * the ledger must stay readable and must not become the archive.
 */
export interface RunEventBase {
  readonly seq: number;
  readonly runId: RunId;
  readonly type: RunEventType;
  readonly at: IsoTimestamp;
  /** Hash chain link. Tampering requires recomputing every later event. */
  readonly prevHash: ContentHash | null;
  readonly selfHash: ContentHash;
  readonly actor: AgentId | "SUPERVISOR" | "OWNER" | "CONTROL_PLANE";
  readonly taskId?: TaskId;
  readonly agentId?: AgentId;
}

export interface PlannedPayload {
  /** Mandatory answer to "is decomposition necessary?" (Blueprint §2.3). */
  readonly decompositionRationale: string;
  /** Mandatory answer to "is a model call necessary?". */
  readonly modelCallRationale: string;
  readonly plannedTaskIds: readonly TaskId[];
}

export interface ToolCalledPayload {
  readonly toolId: ToolId;
  readonly toolVersion: string;
  readonly argumentsHash: ContentHash;
  readonly idempotencyKey: IdempotencyKey;
  readonly manifestHash: ContentHash;
}

export interface RetryScheduledPayload {
  readonly failureClass: FailureClass;
  readonly attempt: number;
  readonly backoffMs: number;
  /** Same logical operation keeps the same key — that is what makes retry safe. */
  readonly idempotencyKey: IdempotencyKey;
}

export interface RejectedPayload {
  /** The invariant that protected the system, named explicitly. */
  readonly invariant: string;
  readonly detail: string;
}

export interface LoopDetectedPayload {
  readonly signal: "INTENT_REPEAT" | "OUTPUT_STAGNATION" | "TOOL_CYCLE";
  readonly evidence: readonly string[];
}

export interface MergedPayload {
  readonly inputHashes: readonly ContentHash[];
  readonly outputHash: ContentHash;
  /** A supervisor never silently rewrites a specialist's output. */
  readonly mergeRationale: string;
}

export interface BlockedPayload {
  readonly kind: "MISSING_INPUT" | "POLICY" | "QUOTA" | "CAPABILITY" | "HUMAN_DECISION";
  readonly cause: string;
  readonly resolvableBy: "OWNER" | "SUPERVISOR" | AgentId;
}

export type RunEvent =
  | (RunEventBase & { readonly type: "run.planned"; readonly payload: PlannedPayload })
  | (RunEventBase & { readonly type: "tool.called"; readonly payload: ToolCalledPayload })
  | (RunEventBase & { readonly type: "retry.scheduled"; readonly payload: RetryScheduledPayload })
  | (RunEventBase & { readonly type: "agent.rejected"; readonly payload: RejectedPayload })
  | (RunEventBase & { readonly type: "loop.detected"; readonly payload: LoopDetectedPayload })
  | (RunEventBase & { readonly type: "merged"; readonly payload: MergedPayload })
  | (RunEventBase & { readonly type: "blocked.recorded"; readonly payload: BlockedPayload })
  | (RunEventBase & { readonly payload?: Record<string, unknown> });

export interface LedgerIntegrityResult {
  readonly intact: boolean;
  /** Sequence number of the first event whose chain link does not verify. */
  readonly firstBrokenSeq?: number;
}

/**
 * Verifies the hash chain. O(n) and requires no trust in the process that wrote
 * the events — which is what turns proof fabrication from a silent possibility
 * into a detectable attack.
 *
 * `computeHash` is injected so the contracts package stays free of crypto deps.
 */
export function verifyLedgerChain(
  events: readonly RunEvent[],
  computeHash: (event: RunEvent) => ContentHash,
): LedgerIntegrityResult {
  let expectedPrev: ContentHash | null = null;
  for (const event of events) {
    if (event.prevHash !== expectedPrev) {
      return { intact: false, firstBrokenSeq: event.seq };
    }
    if (computeHash(event) !== event.selfHash) {
      return { intact: false, firstBrokenSeq: event.seq };
    }
    expectedPrev = event.selfHash;
  }
  return { intact: true };
}

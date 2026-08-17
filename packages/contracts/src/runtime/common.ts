/**
 * ultraJARVIS — shared runtime primitives.
 *
 * Task: UJ-RUN-001 (CLAUDE). Status: PROPOSAL, pending review by GEMINI.
 *
 * Design rules enforced here (see docs/architecture/RUNTIME_BLUEPRINT.md):
 *  - No provider name ever appears in this package.
 *  - No secret value is representable; only opaque references.
 *  - Every limited dimension is ordered so that "narrower" is mechanically checkable.
 */

// ---------------------------------------------------------------------------
// Branded identifiers
// ---------------------------------------------------------------------------

declare const brand: unique symbol;

/** Nominal typing helper: prevents passing a RunId where an AgentId is expected. */
export type Brand<T, B extends string> = T & { readonly [brand]: B };

export type RunId = Brand<string, "RunId">;
export type TeamId = Brand<string, "TeamId">;
export type AgentId = Brand<string, "AgentId">;
export type TaskId = Brand<string, "TaskId">;
export type ArtifactId = Brand<string, "ArtifactId">;
export type CheckpointId = Brand<string, "CheckpointId">;
export type ToolId = Brand<string, "ToolId">;
export type SchemaId = Brand<string, "SchemaId">;

/** Opaque handle to a capability token. The token material never enters the runtime. */
export type TokenRef = Brand<string, "TokenRef">;

/**
 * Opaque handle to a secret held by the tool runtime.
 * Constitution art. 6: secrets never enter prompts, logs, ledger or memory.
 */
export type SecretRef = Brand<string, "SecretRef">;

/** SHA-256 hex digest of canonicalised content. */
export type ContentHash = Brand<string, "ContentHash">;

/** Idempotency key: sha256(runId ‖ taskId ‖ op ‖ canonicalJson(payload) ‖ toolVersion). */
export type IdempotencyKey = Brand<string, "IdempotencyKey">;

/** ISO-8601 UTC timestamp. */
export type IsoTimestamp = Brand<string, "IsoTimestamp">;

/** Semantic version string, e.g. "1.4.0". */
export type SemVer = Brand<string, "SemVer">;

// ---------------------------------------------------------------------------
// Ordered ceilings
// ---------------------------------------------------------------------------

/** Data classification (canonical prompt §15). Higher index = more restricted. */
export const DATA_CLASS_ORDER = ["C0", "C1", "C2", "C3", "C4"] as const;
export type DataClass = (typeof DATA_CLASS_ORDER)[number];

/**
 * Autonomy level (canonical prompt §16).
 * L5 is deliberately absent from the type: it is not representable, so it cannot
 * be reached by configuration error, by a manifest, or by a persuaded model.
 */
export const AUTONOMY_ORDER = ["L0", "L1", "L2", "L3", "L4"] as const;
export type AutonomyLevel = (typeof AUTONOMY_ORDER)[number];

/** Side-effect ceiling (canonical prompt §7.3). Higher index = more dangerous. */
export const SIDE_EFFECT_ORDER = [
  "NONE",
  "INTERNAL_WRITE",
  "EXTERNAL_WRITE",
  "DESTRUCTIVE",
] as const;
export type SideEffectLevel = (typeof SIDE_EFFECT_ORDER)[number];

/** Provider access mode (canonical prompt §6.1). Mirrored here for policy checks only. */
export type ProviderMode =
  | "AUTO_VERIFIED"
  | "HUMAN_BRIDGE"
  | "MANUAL_TOOL"
  | "EXPERIMENTAL_SANDBOX"
  | "UNAVAILABLE"
  | "PAID_ONLY_DISABLED"
  | "LOCAL_COMPUTE_DISABLED"
  | "RETIRED";

/** Epistemic label (canonical prompt §5). Attached to every load-bearing claim. */
export type TruthLabel =
  | "USER_CONSTRAINT"
  | "VERIFIED_FACT"
  | "OBSERVATION"
  | "ASSUMPTION"
  | "PROPOSAL"
  | "EXPERIMENT_RESULT"
  | "UNKNOWN"
  | "BLOCKER";

// ---------------------------------------------------------------------------
// Ceiling comparison — the mechanical basis of INV-D8 / TA-2 / TA-4 / TA-5 / TA-8
// ---------------------------------------------------------------------------

function rankOf<T extends readonly string[]>(order: T, value: T[number]): number {
  return order.indexOf(value);
}

/** True when `child` is not more permissive than `parent`. */
export function dataClassWithin(child: DataClass, parent: DataClass): boolean {
  return rankOf(DATA_CLASS_ORDER, child) <= rankOf(DATA_CLASS_ORDER, parent);
}

export function autonomyWithin(child: AutonomyLevel, parent: AutonomyLevel): boolean {
  return rankOf(AUTONOMY_ORDER, child) <= rankOf(AUTONOMY_ORDER, parent);
}

export function sideEffectWithin(child: SideEffectLevel, parent: SideEffectLevel): boolean {
  return rankOf(SIDE_EFFECT_ORDER, child) <= rankOf(SIDE_EFFECT_ORDER, parent);
}

// ---------------------------------------------------------------------------
// Provenance and criteria
// ---------------------------------------------------------------------------

export interface Provenance {
  readonly producedBy: AgentId | "HUMAN" | "CONTROL_PLANE";
  readonly runId: RunId;
  readonly createdAt: IsoTimestamp;
  /** Content hashes of the inputs this was derived from. */
  readonly derivedFrom: readonly ContentHash[];
  readonly truthLabel: TruthLabel;
  /** Official primary source URL, required when truthLabel is VERIFIED_FACT. */
  readonly sourceUrl?: string;
  readonly verifiedAt?: IsoTimestamp;
}

/** A binary, checkable acceptance condition. "Almost done" is not representable. */
export interface Criterion {
  readonly criterionId: string;
  readonly statement: string;
  /** How the criterion is checked: a test id, a schema, or a human gate. */
  readonly verification:
    | { readonly kind: "TEST"; readonly testId: string }
    | { readonly kind: "SCHEMA"; readonly schemaId: SchemaId; readonly version: SemVer }
    | { readonly kind: "HUMAN_REVIEW"; readonly reviewer: string };
  readonly satisfied: boolean | "UNKNOWN";
}

export interface SchemaRef {
  readonly schemaId: SchemaId;
  readonly version: SemVer;
}

export interface QuotaBudget {
  /** Maximum number of provider calls. Retries are included, never additive. */
  readonly maxProviderCalls: number;
  readonly maxToolCalls: number;
  /** Estimated token ceiling; advisory when the provider exposes no counter. */
  readonly maxEstimatedTokens?: number;
  readonly maxWallClockMs: number;
  /**
   * Reserve that may only be spent on checkpoint, recovery and P0 work.
   * Canonical prompt §6.3: a run must always be able to save itself.
   */
  readonly recoveryReserveCalls: number;
}

export interface EscalationRoute {
  readonly onBlocker: "SUPERVISOR" | "OWNER";
  readonly onPolicyDenied: "OWNER";
  readonly onSecurityEvent: "OWNER";
  readonly notifyChannel?: string;
}

/** Failure classification. Drives retry policy — see RETRY_POLICY in checkpoint.ts. */
export type FailureClass =
  | "TRANSIENT_PROVIDER"
  | "TIMEOUT"
  | "RATE_LIMIT"
  | "QUOTA_EXHAUSTED"
  | "SCHEMA_VIOLATION"
  | "POLICY_DENIED"
  | "TOOL_ERROR"
  | "INTERNAL_BUG"
  | "NON_IDEMPOTENT"
  | "CANCELLED"
  | "KILLED";

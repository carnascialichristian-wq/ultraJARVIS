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

/**
 * S-28 — ranking inside a CLOSED domain, biased so that the unknown fails closed.
 *
 * The naive form was `order.indexOf(value)`, and `indexOf` returns -1 for a value
 * outside the domain. Since `-1 <= n` holds for every n, the comparison ADMITTED
 * whatever it did not recognise: the functions that impose the limit ceiling were
 * fail-open. Measured before the fix:
 *
 *   autonomyWithin("L5", "L2")        -> true
 *   autonomyWithin("L9_GODMODE","L0") -> true
 *   dataClassWithin("C9", "C0")       -> true
 *   sideEffectWithin("NUKE","NONE")   -> true
 *
 * That defeated the strongest claim of this very file, three lines above
 * AUTONOMY_ORDER: L5 "cannot be reached by configuration error, BY A MANIFEST, or
 * by a persuaded model". It is true inside TypeScript. But a manifest is JSON and
 * JSON arrives as strings, so the manifest path was exactly the one that defeated
 * it — the type system does not survive the wire.
 *
 * The fix biases each side in its safe direction instead of throwing: an
 * unrecognised CHILD is treated as maximally permissive, an unrecognised PARENT as
 * maximally restrictive. Both make `within` false, so an unknown value can never
 * widen a limit, and no exception is introduced that a hostile input could use to
 * halt a run. Regression tests: tests/threat-model/prompt-injection.test.mjs.
 *
 * Keep the ranking here, in one place: the same `indexOf` shape appeared at five
 * sites across the contracts, and a per-site patch guarantees a sixth.
 */
export function isInDomain<T extends readonly string[]>(order: T, value: string): boolean {
  return (order as readonly string[]).indexOf(value) >= 0;
}

/** Rank of a value being CHECKED against a ceiling. Unknown = maximally permissive. */
export function rankAsChild<T extends readonly string[]>(order: T, value: string): number {
  const i = (order as readonly string[]).indexOf(value);
  return i < 0 ? Number.POSITIVE_INFINITY : i;
}

/** Rank of a value ACTING as a ceiling. Unknown = maximally restrictive. */
export function rankAsParent<T extends readonly string[]>(order: T, value: string): number {
  const i = (order as readonly string[]).indexOf(value);
  return i < 0 ? Number.NEGATIVE_INFINITY : i;
}

/** True when `child` is not more permissive than `parent`. */
export function dataClassWithin(child: DataClass, parent: DataClass): boolean {
  return rankAsChild(DATA_CLASS_ORDER, child) <= rankAsParent(DATA_CLASS_ORDER, parent);
}

export function autonomyWithin(child: AutonomyLevel, parent: AutonomyLevel): boolean {
  return rankAsChild(AUTONOMY_ORDER, child) <= rankAsParent(AUTONOMY_ORDER, parent);
}

export function sideEffectWithin(child: SideEffectLevel, parent: SideEffectLevel): boolean {
  return rankAsChild(SIDE_EFFECT_ORDER, child) <= rankAsParent(SIDE_EFFECT_ORDER, parent);
}

// ---------------------------------------------------------------------------
// Injective encoding of a string tuple (error E6, generalised)
// ---------------------------------------------------------------------------

/**
 * Joins `parts` into one string from which the original tuple is recoverable.
 *
 * A plain separator does NOT do this. Whatever byte is chosen, an element may
 * contain it, and then two different tuples collapse onto the same string:
 * `["a|b", "c"]` and `["a", "b|c"]` both become `"a|b|c"`. Whether that is
 * reachable today depends on validation that may not exist — `ToolId`, `RunId`
 * and friends are branded strings with no runtime check — so the encoding must
 * not rely on it.
 *
 * This was first found as error E6, where a NUL byte was used as the separator
 * in the idempotency key. Two consequences followed: colliding keys, and a
 * source file that git and grep classify as BINARY, which silently removes it
 * from every text-based audit of the repository.
 *
 * Length prefixing makes the encoding injective without depending on the
 * alphabet of the inputs. It lives here, once, because the same mistake was
 * made twice in two different files.
 */
export function encodeInjective(parts: readonly string[]): string {
  return parts.map((part) => `${part.length}:${part}`).join("|");
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

/**
 * ultraJARVIS — ToolManifest and tool admission.
 *
 * Task: UJ-MCP-001 (CLAUDE). Rationale: docs/architecture/TOOL_PLANE.md
 *
 * MCP is a way of exposing tools, not a guarantee of safety. Every server, local
 * or remote, passes admission (canonical prompt §12).
 *
 * This module mechanises two P0 mitigations identified in UJ-SEC-001:
 *   P0-1 (TH-10)     only the tool runtime may emit tool.* audit events
 *   P0-2 (R-RUN-03)  a tool that writes externally must support lookup by
 *                    idempotency key, or resume cannot avoid double effects
 */

import type {
  ContentHash,
  DataClass,
  IsoTimestamp,
  SecretRef,
  SemVer,
  SideEffectLevel,
  ToolId,
} from "../runtime/common.js";

// ---------------------------------------------------------------------------
// ToolManifest (canonical prompt §12.1)
// ---------------------------------------------------------------------------

export type ToolClassification = "READ" | "WRITE" | "DESTRUCTIVE";

export interface IdempotencyBehaviour {
  /** Whether repeating the call with the same key is safe. */
  readonly idempotent: boolean;
  /**
   * P0-2. Whether the tool can answer "did operation with key K already run?".
   *
   * Without this the runtime cannot know, after a crash, whether a write landed.
   * The only honest response is then to stop and ask a human, which is why
   * admission refuses such a tool for external writes.
   */
  readonly supportsLookupByKey: boolean;
  readonly keyHeader?: string;
}

export interface NetworkPolicy {
  /**
   * Explicit destination allowlist. A wildcard is not accepted: "*" turns an
   * egress control into a formality.
   */
  readonly allowedDestinations: readonly string[];
  readonly egressDenyByDefault: true;
}

export interface SandboxProfile {
  readonly isolation: "NONE" | "PROCESS" | "CONTAINER" | "REMOTE_ISOLATED";
  readonly filesystemAccess: "NONE" | "READ_ONLY_SCOPED" | "READ_WRITE_SCOPED";
  readonly allowedPaths: readonly string[];
}

export interface CompensationPolicy {
  readonly supported: boolean;
  readonly description: string;
  /** A destructive tool must be able to preview its impact before acting. */
  readonly dryRunSupported: boolean;
}

export interface ToolQuota {
  readonly maxCallsPerRun: number;
  readonly maxCallsPerWindow: number;
  readonly windowMs: number;
}

export interface ToolReliability {
  readonly timeoutMs: number;
  readonly maxRetries: number;
  readonly circuitBreakerThreshold: number;
  readonly healthProbe: string | null;
}

export interface ToolProvenance {
  readonly owner: string;
  readonly sourceRepository: string | null;
  readonly license: string;
  readonly licenseVerified: boolean;
  readonly advisoriesChecked: boolean;
  readonly securityReviewDate: IsoTimestamp | null;
  readonly reviewedBy: string | null;
  /** Official documentation actually read during admission (§12.3 step 2). */
  readonly documentationUrl: string | null;
  readonly documentationReadAt: IsoTimestamp | null;
}

export interface ToolManifest {
  readonly toolId: ToolId;
  readonly name: string;
  readonly version: SemVer;
  /** Hash of this manifest as admitted; re-verified on every call (TH-02). */
  readonly manifestHash: ContentHash;

  readonly inputSchema: unknown;
  readonly outputSchema: unknown;

  readonly classification: ToolClassification;
  readonly sideEffect: SideEffectLevel;
  readonly maxDataClass: DataClass;

  readonly scopes: readonly string[];
  readonly resources: readonly string[];
  /** References only — a manifest can never carry a secret value. */
  readonly secretsNeeded: readonly SecretRef[];

  readonly network: NetworkPolicy;
  readonly sandbox: SandboxProfile;
  readonly idempotency: IdempotencyBehaviour;
  readonly compensation: CompensationPolicy;
  readonly quota: ToolQuota;
  readonly reliability: ToolReliability;
  readonly provenance: ToolProvenance;

  readonly approvalGate: "NONE" | "AUDIT" | "APPROVAL" | "HUMAN_BRIDGE";
  readonly auditEvents: readonly string[];
  readonly deprecation: { readonly deprecated: boolean; readonly fallbackToolId: ToolId | null };

  /** Zero incremental cost is a hard constraint, not a preference (Article 5). */
  readonly incrementalCost: "ZERO" | "DISABLED";
  readonly requiresLocalHeavyCompute: boolean;
  readonly usesConsumerUiSession: boolean;
}

// ---------------------------------------------------------------------------
// P0-1 — only the tool runtime may attest tool execution (TH-10)
// ---------------------------------------------------------------------------

/**
 * Actors permitted to emit ledger events.
 *
 * TOOL_RUNTIME is distinct from any agent on purpose: an agent that can write
 * `tool.returned` without having called the tool produces a hash chain that is
 * intact and false. The chain proves an event was recorded, never that the
 * recorded fact is true — so the emitter must be constrained, not just the log.
 */
export type EventActor = "TOOL_RUNTIME" | "SUPERVISOR" | "OWNER" | "CONTROL_PLANE" | "AGENT";

export const TOOL_EVENT_TYPES = ["tool.called", "tool.returned", "tool.failed"] as const;
export type ToolEventType = (typeof TOOL_EVENT_TYPES)[number];

export function isToolEvent(eventType: string): eventType is ToolEventType {
  return (TOOL_EVENT_TYPES as readonly string[]).includes(eventType);
}

export type EmitterVerdict =
  | { readonly accepted: true }
  | { readonly accepted: false; readonly rule: "P0-1"; readonly detail: string };

/**
 * P0-1 enforcement. Rejects any attempt by a non-tool-runtime actor to attest
 * tool execution. This is the mechanical half of the mitigation; the normative
 * half is amendment P-11 to Article 9.
 */
export function verifyEventEmitter(eventType: string, actor: EventActor): EmitterVerdict {
  if (isToolEvent(eventType) && actor !== "TOOL_RUNTIME") {
    return {
      accepted: false,
      rule: "P0-1",
      detail: `${eventType} may only be emitted by TOOL_RUNTIME, not by ${actor}`,
    };
  }
  return { accepted: true };
}

// ---------------------------------------------------------------------------
// Admission
// ---------------------------------------------------------------------------

export type AdmissionRuleId =
  | "ADM-01" | "ADM-02" | "ADM-03" | "ADM-04" | "ADM-05" | "ADM-06"
  | "ADM-07" | "ADM-08" | "ADM-09" | "ADM-10" | "ADM-11" | "ADM-12"
  | "ADM-13" | "ADM-14" | "ADM-15" | "ADM-16" | "ADM-17" | "ADM-18";

export interface AdmissionFinding {
  readonly rule: AdmissionRuleId;
  readonly detail: string;
}

export type ToolAdmissionDecision =
  | { readonly admitted: true; readonly warnings: readonly AdmissionFinding[] }
  | { readonly admitted: false; readonly failures: readonly [AdmissionFinding, ...AdmissionFinding[]] };

/** Evidence produced by the human/AI performing admission (§12.3 steps 1, 7, 9, 10). */
export interface AdmissionEvidence {
  readonly alternativesConsidered: string;
  readonly testedWithFakeCredentials: boolean;
  readonly testedWithC0DataOnly: boolean;
  readonly failureModesTested: boolean;
  readonly approvedByOwner: boolean;
  readonly threatModelRef: string | null;
}

/**
 * Evaluates a tool for admission.
 *
 * Collects every failure rather than short-circuiting: a rejection naming one
 * cause hides the rest and makes review misleading. Warnings do not block, but
 * are recorded so a reviewer sees what was accepted with reservations.
 */
export function admitTool(
  manifest: ToolManifest,
  evidence: AdmissionEvidence,
): ToolAdmissionDecision {
  const failures: AdmissionFinding[] = [];
  const warnings: AdmissionFinding[] = [];

  const writes = manifest.sideEffect === "EXTERNAL_WRITE" || manifest.sideEffect === "DESTRUCTIVE";

  // ADM-01 — necessity and alternatives (§12.3 step 1).
  if (evidence.alternativesConsidered.trim() === "") {
    failures.push({ rule: "ADM-01", detail: "no record of alternatives considered" });
  }

  // ADM-02 — official documentation actually read.
  if (!manifest.provenance.documentationUrl || !manifest.provenance.documentationReadAt) {
    failures.push({ rule: "ADM-02", detail: "official documentation not recorded as read" });
  }

  // ADM-03 — classification consistency.
  if (manifest.classification === "READ" && manifest.sideEffect !== "NONE") {
    failures.push({
      rule: "ADM-03",
      detail: `classified READ but declares sideEffect ${manifest.sideEffect}`,
    });
  }
  if (manifest.classification === "DESTRUCTIVE" && manifest.sideEffect !== "DESTRUCTIVE") {
    failures.push({ rule: "ADM-03", detail: "classified DESTRUCTIVE but sideEffect disagrees" });
  }

  // ADM-04 — licence, maintenance, advisories.
  if (!manifest.provenance.licenseVerified) {
    failures.push({ rule: "ADM-04", detail: "licence not verified" });
  }
  if (!manifest.provenance.advisoriesChecked) {
    failures.push({ rule: "ADM-04", detail: "security advisories not checked" });
  }

  // ADM-05 — network mapped, no wildcard egress.
  if (manifest.network.allowedDestinations.some((d) => d === "*" || d.trim() === "")) {
    failures.push({ rule: "ADM-05", detail: "wildcard network destination is not admissible" });
  }

  // ADM-06 — a threat model must exist for anything that writes.
  if (writes && !evidence.threatModelRef) {
    failures.push({ rule: "ADM-06", detail: "writing tool without a threat model reference" });
  }

  // ADM-07 — tested with fake credentials and C0 data only.
  if (!evidence.testedWithFakeCredentials || !evidence.testedWithC0DataOnly) {
    failures.push({ rule: "ADM-07", detail: "not tested with fake credentials on C0 data" });
  }

  // ADM-08 — scope must be bounded.
  if (manifest.scopes.length === 0) {
    warnings.push({ rule: "ADM-08", detail: "no scopes declared; verify this is genuinely scopeless" });
  }
  if (manifest.sandbox.filesystemAccess !== "NONE" && manifest.sandbox.allowedPaths.length === 0) {
    failures.push({ rule: "ADM-08", detail: "filesystem access granted without a path allowlist" });
  }

  // ADM-09 — failure modes exercised.
  if (!evidence.failureModesTested) {
    failures.push({ rule: "ADM-09", detail: "timeout, error, idempotency and rollback not tested" });
  }

  // ADM-10 — owner approval.
  if (!evidence.approvedByOwner) {
    failures.push({ rule: "ADM-10", detail: "not approved by the owner" });
  }

  // ADM-11 — version pinning.
  if (!manifest.version || !manifest.manifestHash) {
    failures.push({ rule: "ADM-11", detail: "version or manifest hash missing; pinning impossible" });
  }

  // ADM-12 — accountable reviewer and date.
  if (!manifest.provenance.securityReviewDate || !manifest.provenance.reviewedBy) {
    failures.push({ rule: "ADM-12", detail: "security review date or reviewer missing" });
  }

  // ADM-13 — P0-2: external writes require lookup by idempotency key.
  if (writes && !manifest.idempotency.supportsLookupByKey) {
    failures.push({
      rule: "ADM-13",
      detail:
        "tool performs external writes but cannot answer whether an operation already ran; " +
        "resume could not avoid a double effect",
    });
  }

  // ADM-14 — P0-1: a tool may never claim to emit its own audit attestation.
  for (const event of manifest.auditEvents) {
    if (isToolEvent(event)) {
      failures.push({
        rule: "ADM-14",
        detail: `tool declares it emits ${event}; only TOOL_RUNTIME may attest tool execution`,
      });
    }
  }

  // ADM-15 / ADM-16 — constitutional hard limits.
  if (manifest.incrementalCost !== "ZERO" && manifest.incrementalCost !== "DISABLED") {
    failures.push({ rule: "ADM-15", detail: "tool declares a non-zero incremental cost" });
  }
  if (manifest.requiresLocalHeavyCompute) {
    failures.push({ rule: "ADM-16", detail: "tool requires heavy local inference" });
  }
  if (manifest.usesConsumerUiSession) {
    failures.push({ rule: "ADM-16", detail: "tool automates a consumer UI session" });
  }

  // ADM-17 — destructive tools need dry-run and compensation.
  if (manifest.sideEffect === "DESTRUCTIVE") {
    if (!manifest.compensation.dryRunSupported) {
      failures.push({ rule: "ADM-17", detail: "destructive tool without dry-run support" });
    }
    if (!manifest.compensation.supported) {
      failures.push({ rule: "ADM-17", detail: "destructive tool without a compensation policy" });
    }
    if (manifest.approvalGate !== "APPROVAL") {
      failures.push({ rule: "ADM-17", detail: "destructive tool must carry an APPROVAL gate" });
    }
  }

  // ADM-18 — remote tools cannot be trusted by manifest hash alone (TH-02 residual).
  if (manifest.network.allowedDestinations.length > 0 && manifest.sandbox.isolation === "NONE") {
    warnings.push({
      rule: "ADM-18",
      detail:
        "remote tool without isolation: the manifest hash attests the description, not the behaviour",
    });
  }

  const [first, ...rest] = failures;
  if (first === undefined) {
    return { admitted: true, warnings };
  }
  return { admitted: false, failures: [first, ...rest] };
}

// ---------------------------------------------------------------------------
// Per-call verification
// ---------------------------------------------------------------------------

export type CallVerdict =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly reason: string };

/**
 * Re-verifies the manifest hash at every call. An updated tool invalidates the
 * admitted pin and must go through admission again, which is what stops tool
 * poisoning by update (TH-02).
 */
export function verifyToolCall(
  admittedHash: ContentHash,
  presentedHash: ContentHash,
  admittedVersion: SemVer,
  presentedVersion: SemVer,
): CallVerdict {
  if (admittedHash !== presentedHash) {
    return { allowed: false, reason: "manifest hash differs from the admitted pin" };
  }
  if (admittedVersion !== presentedVersion) {
    return { allowed: false, reason: "tool version differs from the admitted pin" };
  }
  return { allowed: true };
}

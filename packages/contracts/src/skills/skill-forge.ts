/**
 * ultraJARVIS — Skill Forge: pipeline, prohibitions and sandbox contract.
 *
 * Task: UJ-SKL-001 (CLAUDE). Rationale: docs/architecture/SKILL_FORGE.md
 *
 * The Skill Forge is the only part of the system that produces NEW EXECUTABLE
 * CODE. That makes it the highest-consequence subsystem: everything else composes
 * things that already passed review, this one manufactures things that have not.
 *
 * Central property, mechanised here:
 *   a skill can never advance its own stage, sign itself, or widen its own scope.
 * This is the Skill Forge analogue of P0-1 in the tool plane — the entity that
 * benefits from a decision must never be the entity that records it.
 */

import type {
  DataClass,
  IsoTimestamp,
  SecretRef,
  SemVer,
  SideEffectLevel,
  ToolId,
} from "../runtime/common.js";

// ---------------------------------------------------------------------------
// Pipeline — the 14 mandatory stages of canonical prompt §13.2
// ---------------------------------------------------------------------------

export const FORGE_STAGES = [
  "INTENT_AND_REUSE_SEARCH",
  "SPEC",
  "THREAT_MODEL_AND_BUILD_APPROVAL",
  "GENERATE",
  "STATIC_ANALYSIS",
  "TESTS",
  "SANDBOX",
  "ADVERSARIAL_REVIEW",
  "HUMAN_REVIEW",
  "REGISTRY_CANDIDATE",
  "CANARY",
  "APPROVED",
  "MONITORED",
  "RECERTIFIED",
] as const;
export type ForgeStage = (typeof FORGE_STAGES)[number];

/** Terminal states reachable from any stage. */
export type ForgeTerminal = "REJECTED" | "RETIRED";
export type ForgeState = ForgeStage | ForgeTerminal;

/**
 * Actors allowed to advance a skill through the pipeline.
 *
 * SKILL is present in the type on purpose, so that the test suite can attempt a
 * self-promotion and assert the refusal. A vector that cannot be expressed
 * cannot be proven closed.
 */
export type ForgeActor = "FORGE_REGISTRAR" | "HUMAN_REVIEWER" | "OWNER" | "SKILL" | "AGENT";

export interface StageEvidence {
  readonly reuseSearchCandidates: readonly string[];
  readonly reuseSearchConclusion: string;
  readonly specRef: string | null;
  readonly threatModelRef: string | null;
  readonly buildApproved: boolean;
  readonly generatedInIsolatedWorkspace: boolean;
  readonly staticAnalysis: StaticAnalysisEvidence | null;
  readonly testsPassed: boolean;
  readonly sandboxRunRef: string | null;
  readonly adversarialReviewRef: string | null;
  readonly humanReviewerId: string | null;
  readonly signedByRegistrar: boolean;
  readonly canaryRunRef: string | null;
  readonly monitoringRef: string | null;
  readonly recertifiedAt: IsoTimestamp | null;
}

export interface StaticAnalysisEvidence {
  readonly typecheckPassed: boolean;
  readonly lintPassed: boolean;
  readonly sastPassed: boolean;
  readonly dependencyScanPassed: boolean;
  readonly secretScanPassed: boolean;
  readonly licenseScanPassed: boolean;
  readonly sbomRef: string | null;
}

export type AdvanceVerdict =
  | { readonly allowed: true; readonly to: ForgeState }
  | { readonly allowed: false; readonly rule: string; readonly detail: string };

function stageIndex(stage: ForgeState): number {
  return (FORGE_STAGES as readonly string[]).indexOf(stage);
}

/** Evidence each stage requires before the pipeline may leave it. */
function evidenceMissing(from: ForgeStage, e: StageEvidence): string | null {
  switch (from) {
    case "INTENT_AND_REUSE_SEARCH":
      if (e.reuseSearchCandidates.length === 0) {
        return "no reuse candidates examined: §13 requires proving no Recipe or tool suffices";
      }
      if (e.reuseSearchConclusion.trim() === "") return "reuse search has no recorded conclusion";
      return null;
    case "SPEC":
      return e.specRef ? null : "no spec artifact";
    case "THREAT_MODEL_AND_BUILD_APPROVAL":
      if (!e.threatModelRef) return "no threat model";
      return e.buildApproved ? null : "build not approved";
    case "GENERATE":
      return e.generatedInIsolatedWorkspace ? null : "code not generated in an isolated workspace";
    case "STATIC_ANALYSIS": {
      const s = e.staticAnalysis;
      if (!s) return "static analysis not run";
      if (!s.typecheckPassed) return "typecheck failed";
      if (!s.lintPassed) return "lint failed";
      if (!s.sastPassed) return "SAST failed";
      if (!s.dependencyScanPassed) return "dependency scan failed";
      if (!s.secretScanPassed) return "secret scan failed";
      if (!s.licenseScanPassed) return "license scan failed";
      if (!s.sbomRef) return "no SBOM produced";
      return null;
    }
    case "TESTS":
      return e.testsPassed ? null : "tests did not pass";
    case "SANDBOX":
      return e.sandboxRunRef ? null : "no sandbox run recorded";
    case "ADVERSARIAL_REVIEW":
      return e.adversarialReviewRef ? null : "no adversarial review recorded";
    case "HUMAN_REVIEW":
      return e.humanReviewerId ? null : "no human reviewer recorded";
    case "REGISTRY_CANDIDATE":
      return e.signedByRegistrar ? null : "not signed by the registrar";
    case "CANARY":
      return e.canaryRunRef ? null : "no canary run recorded";
    case "APPROVED":
      return e.monitoringRef ? null : "no monitoring attached before going live";
    case "MONITORED":
      return e.recertifiedAt ? null : "no recertification recorded";
    case "RECERTIFIED":
      return null;
    default:
      return "unknown stage";
  }
}

/**
 * Advances a skill one stage.
 *
 * Three rules, in order:
 *   SF-PIPE-1  only FORGE_REGISTRAR / HUMAN_REVIEWER / OWNER may advance
 *   SF-PIPE-2  no stage may be skipped
 *   SF-PIPE-3  the current stage's evidence must exist
 *
 * HUMAN_REVIEW additionally requires a human actor: a registrar that could sign
 * off the human gate would make the gate ceremonial.
 */
export function advanceStage(
  from: ForgeState,
  to: ForgeState,
  actor: ForgeActor,
  evidence: StageEvidence,
): AdvanceVerdict {
  // Rejection and retirement are always available and need no evidence.
  if (to === "REJECTED" || to === "RETIRED") {
    if (actor === "SKILL" || actor === "AGENT") {
      return {
        allowed: false,
        rule: "SF-PIPE-1",
        detail: `${actor} may not change its own lifecycle state`,
      };
    }
    return { allowed: true, to };
  }

  if (from === "REJECTED" || from === "RETIRED") {
    return { allowed: false, rule: "SF-PIPE-2", detail: `${from} is terminal` };
  }

  // SF-PIPE-1 — a skill never advances itself.
  if (actor === "SKILL" || actor === "AGENT") {
    return {
      allowed: false,
      rule: "SF-PIPE-1",
      detail: `${actor} may not advance a skill through the forge; only the registrar can`,
    };
  }

  // The human gate needs an actual human.
  if (from === "HUMAN_REVIEW" && actor !== "HUMAN_REVIEWER" && actor !== "OWNER") {
    return {
      allowed: false,
      rule: "SF-PIPE-1",
      detail: "leaving HUMAN_REVIEW requires a human actor, not the registrar",
    };
  }

  // SF-PIPE-2 — strictly one step forward, no skipping.
  const fromIdx = stageIndex(from);
  const toIdx = stageIndex(to);
  if (toIdx !== fromIdx + 1) {
    return {
      allowed: false,
      rule: "SF-PIPE-2",
      detail: `cannot move from ${from} to ${to}: stages are sequential and may not be skipped`,
    };
  }

  // SF-PIPE-3 — the evidence for the stage being left must exist.
  const missing = evidenceMissing(from, evidence);
  if (missing) {
    return { allowed: false, rule: "SF-PIPE-3", detail: `cannot leave ${from}: ${missing}` };
  }

  return { allowed: true, to };
}

// ---------------------------------------------------------------------------
// Sandbox contract (canonical prompt §13.2 step 7)
// ---------------------------------------------------------------------------

export interface SandboxProfile {
  readonly credentialsAvailable: false;
  readonly productionDataAccess: false;
  readonly networkPolicy: "DENY_ALL" | "ALLOWLIST";
  readonly allowedDestinations: readonly string[];
  readonly maxCpuMs: number;
  readonly maxMemoryMb: number;
  readonly maxWallClockMs: number;
  readonly filesystem: "EPHEMERAL_TEMP";
  readonly ephemeral: true;
  readonly canSpawnSkills: false;
}

export type SandboxVerdict =
  | { readonly valid: true }
  | { readonly valid: false; readonly violations: readonly [string, ...string[]] };

/**
 * The sandbox is the only place generated code runs before review. If its profile
 * is wrong, every later gate is inspecting behaviour observed under the wrong
 * conditions — which is worse than not observing it, because it looks like evidence.
 */
export function validateSandboxProfile(profile: SandboxProfile): SandboxVerdict {
  const violations: string[] = [];

  if (profile.networkPolicy === "ALLOWLIST" && profile.allowedDestinations.length === 0) {
    violations.push("ALLOWLIST network policy with an empty list: declare DENY_ALL instead");
  }
  if (profile.allowedDestinations.some((d) => d === "*")) {
    violations.push("wildcard destination turns the egress control into a formality");
  }
  if (profile.maxCpuMs <= 0 || profile.maxMemoryMb <= 0 || profile.maxWallClockMs <= 0) {
    violations.push("CPU, memory and wall-clock limits must all be positive and finite");
  }

  const [first, ...rest] = violations;
  return first === undefined ? { valid: true } : { valid: false, violations: [first, ...rest] };
}

// ---------------------------------------------------------------------------
// Prohibitions (canonical prompt §13.3)
// ---------------------------------------------------------------------------

export type ProhibitionId =
  | "SF-01" | "SF-02" | "SF-03" | "SF-04" | "SF-05"
  | "SF-06" | "SF-07" | "SF-08" | "SF-09" | "SF-10";

/** What a generated skill declares it does. Checked against the ten prohibitions. */
export interface SkillBehaviour {
  readonly accessesSecretManagerDirectly: boolean;
  readonly usesProductionDatabaseInTest: boolean;
  readonly requestsArbitraryNetwork: boolean;
  readonly modifiesConstitutionPolicyOrKillSwitch: boolean;
  readonly createsOtherSkillsDuringTest: boolean;
  readonly selfRegistersOrSigns: boolean;
  readonly widensOwnScope: boolean;
  readonly downloadsUnpinnedCodeAtRuntime: boolean;
  readonly containsCredentials: boolean;
  readonly convertsHumanBridgeToUiAutomation: boolean;
}

export interface ProhibitionViolation {
  readonly rule: ProhibitionId;
  readonly detail: string;
}

/**
 * All ten prohibitions of §13.3, evaluated together.
 *
 * None of these are advisory. A skill violating any one of them is refused, not
 * flagged: each corresponds to a way generated code escapes the containment that
 * makes generating it acceptable in the first place.
 */
export function checkProhibitions(behaviour: SkillBehaviour): readonly ProhibitionViolation[] {
  const v: ProhibitionViolation[] = [];
  const add = (rule: ProhibitionId, detail: string) => v.push({ rule, detail });

  if (behaviour.accessesSecretManagerDirectly) {
    add("SF-01", "a skill never reaches the secret manager; the tool runtime resolves references");
  }
  if (behaviour.usesProductionDatabaseInTest) {
    add("SF-02", "production data in test makes the test a production side effect");
  }
  if (behaviour.requestsArbitraryNetwork) {
    add("SF-03", "arbitrary network is the exfiltration path for everything else");
  }
  if (behaviour.modifiesConstitutionPolicyOrKillSwitch) {
    add("SF-04", "generated code may not alter the rules that constrain it");
  }
  if (behaviour.createsOtherSkillsDuringTest) {
    add("SF-05", "a skill creating skills during its own test is unbounded generation");
  }
  if (behaviour.selfRegistersOrSigns) {
    add("SF-06", "the entity that benefits from a promotion never records it");
  }
  if (behaviour.widensOwnScope) {
    add("SF-07", "scope widening is self-escalation, forbidden by Article 8");
  }
  if (behaviour.downloadsUnpinnedCodeAtRuntime) {
    add("SF-08", "unpinned runtime download defeats every static gate that preceded it");
  }
  if (behaviour.containsCredentials) {
    add("SF-09", "credentials in generated code violate Article 6");
  }
  if (behaviour.convertsHumanBridgeToUiAutomation) {
    add("SF-10", "turning a human bridge into UI automation is the shortcut the plan forbids");
  }

  return v;
}

// ---------------------------------------------------------------------------
// SkillManifest
// ---------------------------------------------------------------------------

export interface SkillManifest {
  readonly skillId: string;
  readonly version: SemVer;
  readonly intent: string;
  readonly stage: ForgeState;
  readonly maxDataClass: DataClass;
  readonly maxSideEffect: SideEffectLevel;
  /** Tools the skill may call. Subset of what the forge granted; never widened. */
  readonly toolAllowlist: readonly ToolId[];
  readonly secretsNeeded: readonly SecretRef[];
  readonly sandbox: SandboxProfile;
  readonly behaviour: SkillBehaviour;
  readonly evidence: StageEvidence;
  readonly owner: string;
  readonly signedBy: "FORGE_REGISTRAR" | null;
  readonly contentHash: string;
  readonly createdAt: IsoTimestamp;
  readonly recertifyBy: IsoTimestamp | null;
}

/**
 * Ceiling for a skill that has not reached APPROVED.
 * Mirrors CANDIDATE_ROLE_CEILING in agent-manifest.ts: unproven things are born
 * powerless, and gain capability only by recorded review.
 */
export const CANDIDATE_SKILL_CEILING = {
  maxSideEffect: "NONE",
  toolAllowlistLength: 0,
  secretsNeeded: 0,
} as const;

export type SkillReadiness =
  | { readonly usable: true }
  | { readonly usable: false; readonly reasons: readonly [string, ...string[]] };

/**
 * Whether a skill may be invoked at all.
 *
 * Deliberately strict: an unapproved skill with no side effect and no tools is
 * still runnable for evaluation, but anything beyond that requires APPROVED.
 */
export function skillUsable(manifest: SkillManifest, now: IsoTimestamp): SkillReadiness {
  const reasons: string[] = [];

  const prohibitions = checkProhibitions(manifest.behaviour);
  for (const p of prohibitions) reasons.push(`${p.rule}: ${p.detail}`);

  const approved =
    manifest.stage === "APPROVED" ||
    manifest.stage === "MONITORED" ||
    manifest.stage === "RECERTIFIED";

  if (!approved) {
    if (manifest.maxSideEffect !== CANDIDATE_SKILL_CEILING.maxSideEffect) {
      reasons.push(`stage ${manifest.stage} may not declare sideEffect ${manifest.maxSideEffect}`);
    }
    if (manifest.toolAllowlist.length > 0) {
      reasons.push(`stage ${manifest.stage} may not hold tool grants`);
    }
    if (manifest.secretsNeeded.length > 0) {
      reasons.push(`stage ${manifest.stage} may not reference secrets`);
    }
  }

  if (approved && manifest.signedBy !== "FORGE_REGISTRAR") {
    reasons.push("approved skill is not signed by the registrar");
  }

  if (manifest.recertifyBy !== null && now >= manifest.recertifyBy) {
    reasons.push("recertification window has expired; the skill is stale until re-certified");
  }

  if (manifest.stage === "RETIRED" || manifest.stage === "REJECTED") {
    reasons.push(`stage ${manifest.stage} is terminal and not invocable`);
  }

  const [first, ...rest] = reasons;
  return first === undefined ? { usable: true } : { usable: false, reasons: [first, ...rest] };
}

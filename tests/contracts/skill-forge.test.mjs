/**
 * ultraJARVIS — executable proof for the Skill Forge.
 *
 * Task: UJ-SKL-001 (CLAUDE). Rationale: docs/architecture/SKILL_FORGE.md
 *
 * The Skill Forge is the only subsystem that produces new executable code, so
 * every containment rule here gets a test that deliberately breaks it.
 *
 * Run from the repository root:
 *   node --test tests/contracts/skill-forge.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  advanceStage,
  checkProhibitions,
  validateSandboxProfile,
  skillUsable,
  validateRecipe,
  FORGE_STAGES,
  CANDIDATE_SKILL_CEILING,
} from "../../packages/contracts/dist/skills/index.js";

const fullEvidence = {
  reuseSearchCandidates: ["recipe:publish-draft", "tool:repo.write"],
  reuseSearchConclusion: "neither covers atomic multi-file rename with rollback",
  specRef: "docs/specs/skill-rename.md",
  threatModelRef: "docs/threat-models/skill-rename.md",
  buildApproved: true,
  generatedInIsolatedWorkspace: true,
  staticAnalysis: {
    typecheckPassed: true,
    lintPassed: true,
    sastPassed: true,
    dependencyScanPassed: true,
    secretScanPassed: true,
    licenseScanPassed: true,
    sbomRef: "sbom/skill-rename.json",
  },
  testsPassed: true,
  sandboxRunRef: "run/sandbox/1",
  adversarialReviewRef: "review/adversarial/1",
  humanReviewerId: "christian",
  signedByRegistrar: true,
  canaryRunRef: "run/canary/1",
  monitoringRef: "monitor/skill-rename",
  recertifiedAt: "2026-08-17T00:00:00Z",
};

const cleanBehaviour = {
  accessesSecretManagerDirectly: false,
  usesProductionDatabaseInTest: false,
  requestsArbitraryNetwork: false,
  modifiesConstitutionPolicyOrKillSwitch: false,
  createsOtherSkillsDuringTest: false,
  selfRegistersOrSigns: false,
  widensOwnScope: false,
  downloadsUnpinnedCodeAtRuntime: false,
  containsCredentials: false,
  convertsHumanBridgeToUiAutomation: false,
};

const goodSandbox = {
  credentialsAvailable: false,
  productionDataAccess: false,
  networkPolicy: "DENY_ALL",
  allowedDestinations: [],
  maxCpuMs: 10_000,
  maxMemoryMb: 512,
  maxWallClockMs: 60_000,
  filesystem: "EPHEMERAL_TEMP",
  ephemeral: true,
  canSpawnSkills: false,
};

// =========================================================================
// SF-PIPE-1 — a skill can never promote itself
// =========================================================================

test("SF-PIPE-1: a skill may not advance itself through the forge", () => {
  const v = advanceStage("SANDBOX", "ADVERSARIAL_REVIEW", "SKILL", fullEvidence);
  assert.equal(v.allowed, false);
  assert.equal(v.rule, "SF-PIPE-1");
});

test("SF-PIPE-1: an agent may not advance a skill either", () => {
  const v = advanceStage("TESTS", "SANDBOX", "AGENT", fullEvidence);
  assert.equal(v.allowed, false);
  assert.equal(v.rule, "SF-PIPE-1");
});

test("SF-PIPE-1: a skill may not retire or reject itself to escape review", () => {
  assert.equal(advanceStage("SANDBOX", "RETIRED", "SKILL", fullEvidence).allowed, false);
  assert.equal(advanceStage("SANDBOX", "REJECTED", "AGENT", fullEvidence).allowed, false);
});

test("SF-PIPE-1: the human gate requires a human, not the registrar", () => {
  const registrar = advanceStage("HUMAN_REVIEW", "REGISTRY_CANDIDATE", "FORGE_REGISTRAR", fullEvidence);
  assert.equal(registrar.allowed, false, "a registrar signing off the human gate makes it ceremonial");

  const human = advanceStage("HUMAN_REVIEW", "REGISTRY_CANDIDATE", "HUMAN_REVIEWER", fullEvidence);
  assert.equal(human.allowed, true);
});

test("the registrar may advance ordinary stages", () => {
  const v = advanceStage("TESTS", "SANDBOX", "FORGE_REGISTRAR", fullEvidence);
  assert.equal(v.allowed, true);
});

// =========================================================================
// SF-PIPE-2 — no stage may be skipped
// =========================================================================

test("SF-PIPE-2: the pipeline cannot jump straight to APPROVED", () => {
  const v = advanceStage("SPEC", "APPROVED", "OWNER", fullEvidence);
  assert.equal(v.allowed, false);
  assert.equal(v.rule, "SF-PIPE-2");
});

test("SF-PIPE-2: sandbox cannot be skipped between tests and adversarial review", () => {
  const v = advanceStage("TESTS", "ADVERSARIAL_REVIEW", "FORGE_REGISTRAR", fullEvidence);
  assert.equal(v.allowed, false);
  assert.equal(v.rule, "SF-PIPE-2");
});

test("SF-PIPE-2: the pipeline cannot move backwards to erase a gate", () => {
  const v = advanceStage("CANARY", "SANDBOX", "OWNER", fullEvidence);
  assert.equal(v.allowed, false);
  assert.equal(v.rule, "SF-PIPE-2");
});

test("SF-PIPE-2: terminal states are terminal", () => {
  assert.equal(advanceStage("RETIRED", "APPROVED", "OWNER", fullEvidence).allowed, false);
  assert.equal(advanceStage("REJECTED", "SPEC", "OWNER", fullEvidence).allowed, false);
});

test("the full pipeline walks end to end with complete evidence", () => {
  for (let i = 0; i < FORGE_STAGES.length - 1; i += 1) {
    const from = FORGE_STAGES[i];
    const to = FORGE_STAGES[i + 1];
    const actor = from === "HUMAN_REVIEW" ? "HUMAN_REVIEWER" : "FORGE_REGISTRAR";
    const v = advanceStage(from, to, actor, fullEvidence);
    assert.equal(v.allowed, true, `${from} → ${to} should be allowed: ${v.detail ?? ""}`);
  }
});

test("rejection and retirement are reachable from any stage by a legitimate actor", () => {
  for (const stage of FORGE_STAGES) {
    assert.equal(advanceStage(stage, "REJECTED", "OWNER", fullEvidence).allowed, true, stage);
  }
});

// =========================================================================
// SF-PIPE-3 — each stage needs its evidence
// =========================================================================

test("SF-PIPE-3: reuse search with no candidates blocks the whole pipeline", () => {
  const v = advanceStage(
    "INTENT_AND_REUSE_SEARCH",
    "SPEC",
    "FORGE_REGISTRAR",
    { ...fullEvidence, reuseSearchCandidates: [] },
  );
  assert.equal(v.allowed, false);
  assert.equal(v.rule, "SF-PIPE-3");
  assert.match(v.detail, /Recipe or tool/);
});

test("SF-PIPE-3: any failed static analysis check blocks the stage", () => {
  const checks = [
    "typecheckPassed", "lintPassed", "sastPassed",
    "dependencyScanPassed", "secretScanPassed", "licenseScanPassed",
  ];
  for (const check of checks) {
    const v = advanceStage("STATIC_ANALYSIS", "TESTS", "FORGE_REGISTRAR", {
      ...fullEvidence,
      staticAnalysis: { ...fullEvidence.staticAnalysis, [check]: false },
    });
    assert.equal(v.allowed, false, `${check} false must block`);
    assert.equal(v.rule, "SF-PIPE-3");
  }
});

test("SF-PIPE-3: a missing SBOM blocks the stage", () => {
  const v = advanceStage("STATIC_ANALYSIS", "TESTS", "FORGE_REGISTRAR", {
    ...fullEvidence,
    staticAnalysis: { ...fullEvidence.staticAnalysis, sbomRef: null },
  });
  assert.equal(v.allowed, false);
});

test("SF-PIPE-3: no build approval, no generation", () => {
  const v = advanceStage(
    "THREAT_MODEL_AND_BUILD_APPROVAL",
    "GENERATE",
    "FORGE_REGISTRAR",
    { ...fullEvidence, buildApproved: false },
  );
  assert.equal(v.allowed, false);
});

test("SF-PIPE-3: code not generated in an isolated workspace blocks the stage", () => {
  const v = advanceStage("GENERATE", "STATIC_ANALYSIS", "FORGE_REGISTRAR", {
    ...fullEvidence,
    generatedInIsolatedWorkspace: false,
  });
  assert.equal(v.allowed, false);
});

test("SF-PIPE-3: going live requires monitoring already attached", () => {
  const v = advanceStage("APPROVED", "MONITORED", "FORGE_REGISTRAR", {
    ...fullEvidence,
    monitoringRef: null,
  });
  assert.equal(v.allowed, false);
});

// =========================================================================
// The ten prohibitions of §13.3
// =========================================================================

test("a clean skill violates none of the ten prohibitions", () => {
  assert.equal(checkProhibitions(cleanBehaviour).length, 0);
});

test("each of the ten prohibitions is detected individually", () => {
  const cases = [
    ["accessesSecretManagerDirectly", "SF-01"],
    ["usesProductionDatabaseInTest", "SF-02"],
    ["requestsArbitraryNetwork", "SF-03"],
    ["modifiesConstitutionPolicyOrKillSwitch", "SF-04"],
    ["createsOtherSkillsDuringTest", "SF-05"],
    ["selfRegistersOrSigns", "SF-06"],
    ["widensOwnScope", "SF-07"],
    ["downloadsUnpinnedCodeAtRuntime", "SF-08"],
    ["containsCredentials", "SF-09"],
    ["convertsHumanBridgeToUiAutomation", "SF-10"],
  ];
  for (const [flag, rule] of cases) {
    const found = checkProhibitions({ ...cleanBehaviour, [flag]: true });
    assert.equal(found.length, 1, `${flag} should raise exactly one violation`);
    assert.equal(found[0].rule, rule);
  }
});

test("a maximally hostile skill reports all ten", () => {
  const hostile = Object.fromEntries(Object.keys(cleanBehaviour).map((k) => [k, true]));
  assert.equal(checkProhibitions(hostile).length, 10);
});

// =========================================================================
// Sandbox profile
// =========================================================================

test("a correct sandbox profile validates", () => {
  assert.equal(validateSandboxProfile(goodSandbox).valid, true);
});

test("an allowlist sandbox with an empty list is a mislabelled deny-all", () => {
  const v = validateSandboxProfile({ ...goodSandbox, networkPolicy: "ALLOWLIST" });
  assert.equal(v.valid, false);
});

test("a wildcard destination is rejected in the sandbox too", () => {
  const v = validateSandboxProfile({
    ...goodSandbox,
    networkPolicy: "ALLOWLIST",
    allowedDestinations: ["*"],
  });
  assert.equal(v.valid, false);
});

test("resource limits must be positive and finite", () => {
  for (const field of ["maxCpuMs", "maxMemoryMb", "maxWallClockMs"]) {
    const v = validateSandboxProfile({ ...goodSandbox, [field]: 0 });
    assert.equal(v.valid, false, `${field} = 0 must be rejected`);
  }
});

// =========================================================================
// Invocability
// =========================================================================

const approvedSkill = {
  skillId: "skill.rename",
  version: "1.0.0",
  intent: "atomic multi-file rename with rollback",
  stage: "APPROVED",
  maxDataClass: "C1",
  maxSideEffect: "INTERNAL_WRITE",
  toolAllowlist: ["repo.write"],
  secretsNeeded: [],
  sandbox: goodSandbox,
  behaviour: cleanBehaviour,
  evidence: fullEvidence,
  owner: "CLAUDE",
  signedBy: "FORGE_REGISTRAR",
  contentHash: "hash-1",
  createdAt: "2026-08-17T00:00:00Z",
  recertifyBy: "2026-12-31T00:00:00Z",
};
const now = "2026-08-17T12:00:00Z";

test("an approved, signed, unexpired skill is usable", () => {
  assert.equal(skillUsable(approvedSkill, now).usable, true);
});

test("an approved skill that is not signed by the registrar is not usable", () => {
  assert.equal(skillUsable({ ...approvedSkill, signedBy: null }, now).usable, false);
});

test("an unapproved skill may not hold tools, secrets or side effects", () => {
  const candidate = { ...approvedSkill, stage: "SANDBOX" };
  const v = skillUsable(candidate, now);
  assert.equal(v.usable, false);
  assert.equal(v.reasons.length, 2, "side effect and tool grant are both refused");
});

test("an unapproved skill with the candidate ceiling is still runnable for evaluation", () => {
  const candidate = {
    ...approvedSkill,
    stage: "SANDBOX",
    maxSideEffect: CANDIDATE_SKILL_CEILING.maxSideEffect,
    toolAllowlist: [],
    secretsNeeded: [],
  };
  assert.equal(skillUsable(candidate, now).usable, true);
});

test("an expired recertification window makes a skill stale, not silently fine", () => {
  const v = skillUsable({ ...approvedSkill, recertifyBy: "2026-08-01T00:00:00Z" }, now);
  assert.equal(v.usable, false);
  assert.match(v.reasons.join(" "), /recertification/);
});

test("a retired skill is not invocable", () => {
  assert.equal(skillUsable({ ...approvedSkill, stage: "RETIRED" }, now).usable, false);
});

test("prohibitions are re-checked at invocation, not only at admission", () => {
  const v = skillUsable(
    { ...approvedSkill, behaviour: { ...cleanBehaviour, requestsArbitraryNetwork: true } },
    now,
  );
  assert.equal(v.usable, false);
  assert.match(v.reasons.join(" "), /SF-03/);
});

// =========================================================================
// Recipe-first
// =========================================================================

const admitted = new Set(["repo.read@1.0.0", "repo.write@1.0.0"]);
const isAdmitted = (id, version) => admitted.has(`${id}@${version}`);

const goodRecipe = {
  recipeId: "recipe.publish-draft",
  version: "1.0.0",
  intent: "publish a draft to a working branch",
  useCases: ["draft handoff"],
  inputSchema: { schemaId: "in", version: "1.0.0" },
  outputSchema: { schemaId: "out", version: "1.0.0" },
  steps: [
    { stepId: "s1", toolId: "repo.read", toolVersion: "1.0.0", preconditions: [], onFailure: "ABORT" },
    { stepId: "s2", toolId: "repo.write", toolVersion: "1.0.0", preconditions: [], onFailure: "COMPENSATE" },
  ],
  preconditions: [],
  maxDataClass: "C1",
  maxSideEffect: "INTERNAL_WRITE",
  approvalGate: "AUDIT",
  checkpoints: ["after-s1"],
  failureBranches: [],
  acceptanceTests: ["test/recipe/publish-draft"],
  owner: "CLAUDE",
  createdAt: "2026-08-17T00:00:00Z",
};

test("a recipe composed of admitted tools validates", () => {
  assert.equal(validateRecipe(goodRecipe, isAdmitted).valid, true);
});

test("a recipe may not introduce a tool that never passed admission", () => {
  const v = validateRecipe(
    {
      ...goodRecipe,
      steps: [
        { stepId: "s1", toolId: "shell.exec", toolVersion: "1.0.0", preconditions: [], onFailure: "ABORT" },
      ],
    },
    isAdmitted,
  );
  assert.equal(v.valid, false);
});

test("a version bump is not an admitted tool either", () => {
  const v = validateRecipe(
    {
      ...goodRecipe,
      steps: [
        { stepId: "s1", toolId: "repo.read", toolVersion: "2.0.0", preconditions: [], onFailure: "ABORT" },
      ],
    },
    isAdmitted,
  );
  assert.equal(v.valid, false);
});

test("a recipe with side effects needs an approval gate above NONE", () => {
  const v = validateRecipe({ ...goodRecipe, approvalGate: "NONE" }, isAdmitted);
  assert.equal(v.valid, false);
});

test("a recipe without acceptance tests cannot be accepted on evidence", () => {
  const v = validateRecipe({ ...goodRecipe, acceptanceTests: [] }, isAdmitted);
  assert.equal(v.valid, false);
});

test("a branching step must declare where it branches to", () => {
  const v = validateRecipe(
    {
      ...goodRecipe,
      steps: [
        { stepId: "s1", toolId: "repo.read", toolVersion: "1.0.0", preconditions: [], onFailure: "BRANCH" },
      ],
    },
    isAdmitted,
  );
  assert.equal(v.valid, false);
});

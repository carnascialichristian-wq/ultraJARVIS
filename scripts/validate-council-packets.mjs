#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const schemasOnly = process.argv.includes("--schemas-only");
const failures = [];
const notes = [];

function cliValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  const value = process.argv[index + 1];
  return value && !value.startsWith("--") ? value : null;
}

const reviewResultPath = cliValue("--review-result");
const expectedReviewCommit = cliValue("--expected-commit");
const reviewSelfTest = process.argv.includes("--review-self-test");

const schemaPaths = {
  mission: "schemas/mission-packet.schema.json",
  delegation: "schemas/delegation-card.schema.json",
  response: "schemas/response-packet.schema.json",
  synthesis: "schemas/synthesis-packet.schema.json",
  review: "schemas/review-result.schema.json"
};

const missionPath = "prompts/council/missions/UJ-MISSION-M0-COUNCIL-001.json";
const cardPaths = [
  "prompts/delegation-cards/UJ-RUN-001-CLAUDE.json",
  "prompts/delegation-cards/UJ-CAP-001-GEMINI.json",
  "prompts/delegation-cards/UJ-GGL-001-GEMINI.json",
  "prompts/delegation-cards/UJ-RED-001-GROK.json"
];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  const absolute = resolve(root, relativePath);
  if (!existsSync(absolute)) {
    fail(`Missing file: ${relativePath}`);
    return "";
  }
  return readFileSync(absolute, "utf8");
}

function parse(relativePath) {
  const content = read(relativePath);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (error) {
    fail(`Invalid JSON in ${relativePath}: ${error.message}`);
    return null;
  }
}

function sha256(relativePath) {
  const content = read(relativePath);
  return content ? createHash("sha256").update(content).digest("hex") : null;
}

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function resolveLocalRef(ref, schemaRoot) {
  if (!ref.startsWith("#/")) throw new Error(`Only local schema refs are allowed: ${ref}`);
  return ref
    .slice(2)
    .split("/")
    .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce((value, key) => value?.[key], schemaRoot);
}

function typeMatches(value, type) {
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  return typeof value === type;
}

function validate(value, schema, schemaRoot, path = "$") {
  const errors = [];
  if (!schema || typeof schema !== "object") return [`${path}: invalid schema node`];

  if (schema.$ref) {
    let target;
    try {
      target = resolveLocalRef(schema.$ref, schemaRoot);
    } catch (error) {
      return [`${path}: ${error.message}`];
    }
    return target ? validate(value, target, schemaRoot, path) : [`${path}: unresolved ref ${schema.$ref}`];
  }

  if (schema.oneOf) {
    const results = schema.oneOf.map((candidate) => validate(value, candidate, schemaRoot, path));
    if (results.filter((result) => result.length === 0).length !== 1) {
      errors.push(`${path}: must satisfy exactly one oneOf branch`);
    }
    return errors;
  }

  if (Object.hasOwn(schema, "const") && !deepEqual(value, schema.const)) {
    errors.push(`${path}: expected const ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.some((candidate) => deepEqual(value, candidate))) {
    errors.push(`${path}: value is not in enum`);
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => typeMatches(value, type))) {
      errors.push(`${path}: expected type ${types.join("|")}`);
      return errors;
    }
  }

  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: string is too short`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${path}: string is too long`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: pattern mismatch`);
    if (schema.format === "date-time" && (!value.includes("T") || Number.isNaN(Date.parse(value)))) {
      errors.push(`${path}: invalid date-time`);
    }
  }

  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}: below minimum`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${path}: above maximum`);
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path}: too few items`);
    if (schema.uniqueItems) {
      const encoded = value.map((item) => JSON.stringify(item));
      if (new Set(encoded).size !== encoded.length) errors.push(`${path}: duplicate array item`);
    }
    if (schema.items) value.forEach((item, index) => errors.push(...validate(item, schema.items, schemaRoot, `${path}[${index}]`)));
  }

  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required)) errors.push(`${path}: missing required property ${required}`);
    }
    const properties = schema.properties ?? {};
    for (const [key, nested] of Object.entries(value)) {
      if (properties[key]) errors.push(...validate(nested, properties[key], schemaRoot, `${path}.${key}`));
      else if (schema.additionalProperties === false) errors.push(`${path}: unknown property ${key}`);
    }
  }

  return errors;
}

const schemas = Object.fromEntries(Object.entries(schemaPaths).map(([name, path]) => [name, parse(path)]));
const ids = [];
for (const [name, schema] of Object.entries(schemas)) {
  if (!schema) continue;
  assert(schema.$schema === "https://json-schema.org/draft/2020-12/schema", `${name} must use JSON Schema 2020-12.`);
  assert(schema.type === "object" && schema.additionalProperties === false, `${name} packet boundary must be a closed object.`);
  assert(typeof schema.$id === "string" && schema.$id.length > 0, `${name} must declare $id.`);
  assert(typeof schema.properties?.schema_version?.const === "string", `${name} must pin schema_version.`);
  ids.push(schema.$id);
  const serialized = JSON.stringify(schema);
  const externalRefs = [...serialized.matchAll(/"\$ref":"([^"]+)"/g)].map((match) => match[1]).filter((ref) => !ref.startsWith("#/"));
  assert(externalRefs.length === 0, `${name} has non-local refs: ${externalRefs.join(", ")}`);
}
assert(new Set(ids).size === ids.length, "Schema $id values must be unique.");

assert(!schemas.response?.properties?.status?.enum?.includes("DONE"), "ResponsePacket must not allow self-proposed DONE status.");
assert(schemas.mission?.properties?.budget?.properties?.incremental_cost_eur?.const === 0, "Mission budget must hard-code zero incremental cost.");
assert(schemas.mission?.properties?.budget?.properties?.billing_allowed?.const === false, "Mission billing must be disabled.");
assert(schemas.delegation?.properties?.task_snapshot?.properties?.accepted_weight?.const === 0, "First-cycle card must start at zero accepted weight.");
assert(schemas.delegation?.properties?.repository_scope?.properties?.direct_main_write?.const === false, "DelegationCard must prohibit direct main writes.");
assert(schemas.delegation?.properties?.call_budget?.properties?.incremental_cost_eur?.const === 0, "DelegationCard cost must be zero.");
assert(deepEqual(schemas.review?.properties?.outcome?.enum, ["PASS", "PASS_WITH_ACTIONS", "FAIL"]), "Review outcomes must be canonical.");

const sampleHash = "a".repeat(64);
const sampleCommit = "b".repeat(40);
const sampleResponse = {
  schema_version: "ultrajarvis.response-packet/v1",
  response_id: "UJ-RESPONSE-SAMPLE-001",
  created_at: "2026-08-17T00:00:00Z",
  card_id: "UJ-CARD-SAMPLE-001",
  mission_id: "UJ-MISSION-SAMPLE-001",
  ai_id: "CLAUDE",
  product: "sample",
  source_commit_sha: sampleCommit,
  capabilities_actually_used: [],
  task_id: "UJ-RUN-001",
  status: "REVIEW",
  executive_delta: "Sample contract-validation response artifact.",
  facts: [],
  assumptions: [],
  decisions_proposed: [],
  artifacts: [{ ref: "sample.md", sha256: sampleHash, media_type: "text/markdown", data_class: "C1", summary: "Sample" }],
  verification: { checks_run: [], passed: [], failed: [], not_run: [] },
  side_effects: [],
  risks: [],
  task_ledger_delta: [{ task_id: "UJ-RUN-001", previous_status: "READY", proposed_status: "REVIEW", weight: 13, accepted_weight_before: 0, proposed_accepted_weight: 0, proof_refs: ["sample.md"] }],
  remaining_work: { weight: 13, blockers: ["Independent review"], next_action: "Request review" },
  confidence: { level: "MEDIUM", reason: "Sample only" },
  policy_attestation: { no_secret_values: true, no_paid_api: true, no_billing_enabled: true, no_consumer_ui_automation: true, no_heavy_local_inference: true, within_data_class: true, within_side_effect_limit: true },
  handoff: { target: "GEMINI", next_action: "Review", resume_point: "Read the sample artifact and issue ReviewResult." }
};

const sampleSynthesis = {
  schema_version: "ultrajarvis.synthesis-packet/v1",
  synthesis_id: "UJ-SYNTHESIS-SAMPLE-001",
  created_at: "2026-08-17T00:00:00Z",
  mission_id: "UJ-MISSION-SAMPLE-001",
  integrator: "CHATGPT",
  repository: { full_name: "carnascialichristian-wq/ultraJARVIS", base_commit_sha: sampleCommit, output_ref: "agent/sample" },
  input_responses: [{ response_id: "UJ-RESPONSE-SAMPLE-001", task_id: "UJ-RUN-001", artifact_ref: "sample.json", sha256: sampleHash, admission_status: "ADMITTED" }],
  accepted_parts: [],
  rejected_or_deferred_parts: [],
  contradictions: [],
  evidence: [],
  adr_candidates: [],
  task_ledger_delta: [],
  progress_snapshot: { baseline_id: "initial-four-ai-portfolio", accepted_weight: 0, total_weight: 311, remaining_weight: 311, percent: 0 },
  owner_decisions_required: [],
  reviews_required: [],
  new_risks: [],
  status: "REVIEW",
  resume_point: "Wait for independent reviews before applying any ledger change."
};

const sampleReview = {
  schema_version: "ultrajarvis.review-result/v1",
  review_id: "UJ-REVIEW-SAMPLE-001",
  created_at: "2026-08-17T00:00:00Z",
  repository: { full_name: "carnascialichristian-wq/ultraJARVIS", commit_sha: sampleCommit },
  task_id: "UJ-RUN-001",
  task_owner: "CLAUDE",
  reviewer: { ai_id: "GEMINI", product: "sample" },
  artifacts_reviewed: [{ ref: "sample.md", sha256: sampleHash }],
  outcome: "PASS",
  criteria: [{ criterion_id: "AC-01", result: "PASS", evidence_refs: ["sample.md"], note: "Sample" }],
  findings: [],
  policy_checks: { zero_cost: "PASS", data_class: "PASS", side_effect: "PASS", secret_handling: "PASS", consumer_ui_automation: "PASS" },
  accepted_weight_before: 0,
  accepted_weight_after: 13,
  proposed_task_status: "DONE",
  next_action: "Merge after owner gate if required."
};

for (const [name, instance, schema] of [
  ["response specimen", sampleResponse, schemas.response],
  ["synthesis specimen", sampleSynthesis, schemas.synthesis],
  ["review specimen", sampleReview, schemas.review]
]) {
  const errors = schema ? validate(instance, schema, schema) : ["schema unavailable"];
  if (errors.length) errors.forEach((error) => fail(`${name}: ${error}`));
}

const backlog = parse("docs/program/BACKLOG.json");
const taskById = new Map(backlog?.tasks?.map((task) => [task.task_id, task]) ?? []);
if (backlog) {
  const reviewerRegression = {
    "UJ-INT-001": "GROK",
    "UJ-INT-002": "CLAUDE",
    "UJ-INT-006": "CLAUDE"
  };
  for (const [taskId, reviewer] of Object.entries(reviewerRegression)) {
    assert(taskById.get(taskId)?.reviewer === reviewer, `${taskId} canonical reviewer must be ${reviewer}.`);
  }
  const councilTask = taskById.get("UJ-INT-006");
  assert(councilTask?.status === "REVIEW", "UJ-INT-006 must be REVIEW after instances are published.");
  assert(councilTask?.weight === 8 && councilTask?.completed_weight === 0, "UJ-INT-006 must remain 0/8 until Claude review.");
}

function verifyReviewedArtifact(artifact, sourceLabel) {
  const absolute = resolve(root, artifact.ref);
  const insideRoot = absolute !== root && absolute.startsWith(`${root}/`);
  assert(insideRoot, `${sourceLabel} artifact ref must stay inside the repository: ${artifact.ref}.`);
  if (!insideRoot) return;
  if (!existsSync(absolute)) {
    fail(`${sourceLabel} reviewed artifact is missing: ${artifact.ref}.`);
    return;
  }
  const actual = createHash("sha256").update(readFileSync(absolute)).digest("hex");
  assert(actual === artifact.sha256, `${sourceLabel} artifact hash mismatch for ${artifact.ref}.`);
}

function validateImportedReview(review, sourceLabel, options = {}) {
  const schemaErrors = schemas.review ? validate(review, schemas.review, schemas.review) : ["review schema unavailable"];
  schemaErrors.forEach((error) => fail(`${sourceLabel}: ${error}`));
  if (!review || typeof review !== "object") return;

  const task = taskById.get(review.task_id);
  assert(task, `${sourceLabel} references an unknown task: ${review.task_id}.`);
  if (!task) return;

  assert(task.status === "REVIEW", `${sourceLabel} may only be imported for a task currently in REVIEW; ${task.task_id} is ${task.status}.`);
  assert(review.task_owner === task.owner, `${sourceLabel} task_owner differs from backlog owner.`);
  assert(review.reviewer?.ai_id === task.reviewer, `${sourceLabel} reviewer must be ${task.reviewer}.`);
  assert(review.reviewer?.ai_id !== task.owner, `${sourceLabel} reviewer must be independent of task owner.`);
  if (options.expectedCommit) {
    assert(review.repository?.commit_sha === options.expectedCommit, `${sourceLabel} commit must equal --expected-commit.`);
  }

  const expectedCriteria = new Set(task.acceptance_criteria.map((criterion) => criterion.criterion_id));
  const reportedCriteria = new Map((review.criteria ?? []).map((criterion) => [criterion.criterion_id, criterion]));
  assert(reportedCriteria.size === (review.criteria ?? []).length, `${sourceLabel} must not report duplicate criterion IDs.`);
  for (const criterion of review.criteria ?? []) {
    assert(expectedCriteria.has(criterion.criterion_id), `${sourceLabel} reports unknown criterion ${criterion.criterion_id}.`);
    assert((criterion.evidence_refs ?? []).length > 0, `${sourceLabel} criterion ${criterion.criterion_id} has no evidence reference.`);
  }
  for (const criterionId of expectedCriteria) {
    assert(reportedCriteria.has(criterionId), `${sourceLabel} omits required criterion ${criterionId}.`);
  }

  const allCriteriaPass = [...expectedCriteria].every((criterionId) => reportedCriteria.get(criterionId)?.result === "PASS");
  const anyCriterionFail = [...expectedCriteria].some((criterionId) => reportedCriteria.get(criterionId)?.result === "FAIL");
  const allPolicyPass = Object.values(review.policy_checks ?? {}).every((result) => result === "PASS");
  const before = review.accepted_weight_before;
  const after = review.accepted_weight_after;

  assert(before === task.completed_weight, `${sourceLabel} accepted_weight_before must equal the current ledger value ${task.completed_weight}.`);
  assert(after >= before && after <= task.weight, `${sourceLabel} accepted_weight_after is outside the task range.`);
  if (review.outcome === "PASS") {
    assert(allCriteriaPass, `${sourceLabel} PASS requires every acceptance criterion to PASS.`);
    assert(allPolicyPass, `${sourceLabel} PASS requires every policy check to PASS.`);
  }
  if (review.outcome === "PASS_WITH_ACTIONS") {
    assert(after === before, `${sourceLabel} PASS_WITH_ACTIONS must not change accepted weight.`);
    assert(review.proposed_task_status !== "DONE", `${sourceLabel} PASS_WITH_ACTIONS must not propose DONE.`);
  }
  if (review.outcome === "FAIL") {
    assert(anyCriterionFail, `${sourceLabel} FAIL must identify at least one failed acceptance criterion.`);
    assert(after === before, `${sourceLabel} FAIL must not change accepted weight.`);
    assert(review.proposed_task_status !== "DONE", `${sourceLabel} FAIL must not propose DONE.`);
  }
  if (after > before) {
    assert(after === task.weight, `${sourceLabel} has no approved partial-weight mapping; accepted weight must remain ${before} or become ${task.weight}.`);
    assert(review.outcome === "PASS" && review.proposed_task_status === "DONE", `${sourceLabel} accepted-weight increase requires PASS and proposed DONE.`);
  }
  if (review.proposed_task_status === "DONE") {
    assert(review.outcome === "PASS" && allCriteriaPass, `${sourceLabel} DONE requires PASS on every acceptance criterion.`);
    assert(after === task.weight, `${sourceLabel} DONE must propose full accepted weight ${task.weight}.`);
  }

  if (options.verifyArtifacts) {
    for (const artifact of review.artifacts_reviewed ?? []) verifyReviewedArtifact(artifact, sourceLabel);
  }
}

if (!schemasOnly) {
  const mission = parse(missionPath);
  const cards = cardPaths.map((path) => ({ path, card: parse(path) }));
  if (mission && schemas.mission) {
    validate(mission, schemas.mission, schemas.mission).forEach((error) => fail(`mission: ${error}`));
  }
  for (const { path, card } of cards) {
    if (card && schemas.delegation) validate(card, schemas.delegation, schemas.delegation).forEach((error) => fail(`${path}: ${error}`));
  }

  const cardIds = cards.map(({ card }) => card?.card_id).filter(Boolean);
  const idempotencyKeys = cards.map(({ card }) => card?.idempotency_key).filter(Boolean);
  assert(new Set(cardIds).size === cardIds.length, "Delegation card IDs must be unique.");
  assert(new Set(idempotencyKeys).size === idempotencyKeys.length, "Delegation idempotency keys must be unique.");
  const missionCardIds = [...(mission?.delegation_card_ids ?? [])].sort();
  assert(deepEqual(missionCardIds, [...cardIds].sort()), "Mission card IDs must match the four card files.");

  const byTask = new Map(backlog?.tasks?.map((task) => [task.task_id, task]) ?? []);
  const expectedTargets = new Map([
    ["UJ-RUN-001", "CLAUDE"],
    ["UJ-CAP-001", "GEMINI"],
    ["UJ-GGL-001", "GEMINI"],
    ["UJ-RED-001", "GROK"]
  ]);
  for (const { path, card } of cards) {
    if (!card) continue;
    const task = byTask.get(card.task_id);
    assert(expectedTargets.get(card.task_id) === card.target_ai, `${path} target AI does not match the mission assignment.`);
    assert(task?.owner === card.target_ai, `${path} target AI differs from backlog owner.`);
    assert(task?.status === "READY", `${path} task must be READY in the source snapshot.`);
    assert(task?.weight === card.task_snapshot.weight, `${path} task weight differs from backlog.`);
    assert(task?.reviewer === card.reviewer, `${path} reviewer differs from backlog.`);
    assert(card.mission_id === mission?.mission_id, `${path} mission_id mismatch.`);
    assert(card.status === "READY", `${path} must be READY.`);
    assert(card.allowed_modes.length === 1 && card.allowed_modes[0] === "HUMAN_BRIDGE", `${path} must begin as HUMAN_BRIDGE only.`);
    assert(card.call_budget.incremental_cost_eur === 0, `${path} cost must be zero.`);
    assert(card.repository_scope.direct_main_write === false, `${path} must forbid direct main write.`);
    assert(Date.parse(card.expires_at) > Date.parse(card.created_at), `${path} expiry must follow creation.`);
    for (const artifact of card.input_artifacts) {
      if (!artifact.ref.startsWith("docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md")) {
        const actual = sha256(artifact.ref);
        assert(actual === artifact.sha256, `${path} input hash mismatch for ${artifact.ref}.`);
      }
    }
  }

  const assigned = new Set(mission?.assigned_task_ids ?? []);
  assert(expectedTargets.size === assigned.size && [...expectedTargets.keys()].every((id) => assigned.has(id)), "Mission assigned tasks must be exactly the first four specialist tasks.");
}

const reviewResultRequested = process.argv.includes("--review-result");
const expectedCommitRequested = process.argv.includes("--expected-commit");
assert(!reviewResultRequested || reviewResultPath, "--review-result requires a repository-relative JSON file path.");
assert(!expectedCommitRequested || expectedReviewCommit, "--expected-commit requires a 40-character commit SHA.");
assert(!expectedReviewCommit || /^[0-9a-f]{40}$/.test(expectedReviewCommit), "--expected-commit must be a lowercase 40-character SHA.");
assert(!reviewResultPath || !schemasOnly, "--review-result cannot be combined with --schemas-only.");
assert(!reviewResultPath || expectedReviewCommit, "--review-result requires --expected-commit to prevent cross-ref review import.");

if (reviewResultPath && !schemasOnly && expectedReviewCommit) {
  const review = parse(reviewResultPath);
  if (review) validateImportedReview(review, reviewResultPath, { expectedCommit: expectedReviewCommit, verifyArtifacts: true });
  notes.push(`review_result=${reviewResultPath}`);
}

if (reviewSelfTest) {
  const selfTestTask = taskById.get("UJ-INT-001");
  const selfTestCommit = "c".repeat(40);
  const selfTestArtifactHash = sha256("docs/program/BACKLOG.json");
  const selfTestReview = selfTestTask ? {
    schema_version: "ultrajarvis.review-result/v1",
    review_id: "UJ-REVIEW-SELFTEST-001",
    created_at: "2026-08-17T00:00:00Z",
    repository: { full_name: "carnascialichristian-wq/ultraJARVIS", commit_sha: selfTestCommit },
    task_id: "UJ-INT-001",
    task_owner: "CHATGPT",
    reviewer: { ai_id: "GROK", product: "validator self-test" },
    artifacts_reviewed: [{ ref: "docs/program/BACKLOG.json", sha256: selfTestArtifactHash }],
    outcome: "PASS_WITH_ACTIONS",
    criteria: selfTestTask.acceptance_criteria.map((criterion, index) => ({
      criterion_id: criterion.criterion_id,
      result: index < 2 ? "PASS" : "NOT_REVIEWED",
      evidence_refs: ["docs/program/BACKLOG.json"],
      note: "Validator self-test only; no acceptance is proposed."
    })),
    findings: [],
    policy_checks: { zero_cost: "PASS", data_class: "PASS", side_effect: "PASS", secret_handling: "PASS", consumer_ui_automation: "PASS" },
    accepted_weight_before: selfTestTask.completed_weight,
    accepted_weight_after: selfTestTask.completed_weight,
    proposed_task_status: "REVIEW",
    next_action: "Run an independent human-bridge review."
  } : null;
  if (!selfTestReview) fail("Review self-test cannot find UJ-INT-001.");
  else validateImportedReview(selfTestReview, "review self-test", { expectedCommit: selfTestCommit, verifyArtifacts: true });
  notes.push("review_self_test=PASS");
}

const scannedPaths = [
  ...Object.values(schemaPaths),
  "docs/program/COUNCIL_PACKETS.md",
  "docs/program/COUNCIL_IMPORT_AND_MERGE.md",
  ...(schemasOnly ? [] : [missionPath, ...cardPaths])
];
const secretPatterns = [
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /sk-[A-Za-z0-9]{20,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/
];
for (const path of scannedPaths) {
  const content = read(path);
  if (path !== "scripts/validate-council-packets.mjs") {
    assert(secretPatterns.every((pattern) => !pattern.test(content)), `${path} resembles secret-bearing content.`);
  }
}

const digest = createHash("sha256");
for (const path of [...scannedPaths].sort()) {
  const absolute = resolve(root, path);
  if (existsSync(absolute)) {
    digest.update(path);
    digest.update("\0");
    digest.update(readFileSync(absolute));
    digest.update("\0");
  }
}
notes.push(`mode=${schemasOnly ? "schemas-only" : "full"}`);
notes.push(`schema_count=${Object.values(schemas).filter(Boolean).length}`);
if (!schemasOnly) notes.push(`delegation_card_count=${cardPaths.length}`);
notes.push(`council_artifact_set_sha256=${digest.digest("hex")}`);

if (failures.length) {
  console.error("Council packet validation: FAIL");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log("Council packet validation: PASS");
  notes.forEach((note) => console.log(`- ${note}`));
}

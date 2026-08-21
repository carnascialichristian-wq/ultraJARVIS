#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const failures = [];
const notes = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    fail(`Missing required file: ${relativePath}`);
    return "";
  }
  const content = readFileSync(absolutePath, "utf8");
  if (statSync(absolutePath).size === 0 || content.trim().length === 0) {
    fail(`Required file is empty: ${relativePath}`);
  }
  return content;
}

function parseJson(relativePath) {
  const content = read(relativePath);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (error) {
    fail(`Invalid JSON in ${relativePath}: ${error.message}`);
    return null;
  }
}

const requiredArtifacts = [
  "README.md",
  "AGENTS.md",
  "gpt.md",
  "taskgpt.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  "docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md",
  "docs/program/README.md",
  "docs/program/PROJECT_STATE.md",
  "schemas/backlog.schema.json",
  "docs/program/BACKLOG.json",
  "docs/program/STATUS.md",
  "docs/program/WORKSTREAMS.md",
  "docs/program/HANDOFFS.md",
  "schemas/handoff-packet.schema.json",
  "docs/program/COUNCIL_PACKETS.md",
  "docs/program/COUNCIL_IMPORT_AND_MERGE.md",
  "docs/program/REVIEW_RESULT_IMPORT.md",
  "schemas/mission-packet.schema.json",
  "schemas/delegation-card.schema.json",
  "schemas/response-packet.schema.json",
  "schemas/synthesis-packet.schema.json",
  "schemas/review-result.schema.json",
  "prompts/review-requests/UJ-INT-001-GROK.md",
  "prompts/review-requests/UJ-INT-006-CLAUDE.md",
  "prompts/council/missions/UJ-MISSION-M0-COUNCIL-001.json",
  "prompts/delegation-cards/UJ-RUN-001-CLAUDE.json",
  "prompts/delegation-cards/UJ-CAP-001-GEMINI.json",
  "prompts/delegation-cards/UJ-GGL-001-GEMINI.json",
  "prompts/delegation-cards/UJ-RED-001-GROK.json",
  "prompts/delegation-cards/UJ-SEC-001-CLAUDE.json",
  "prompts/delegation-cards/UJ-CLD-001-CLAUDE.json",
  "docs/adrs/README.md",
  "docs/adrs/ADR_TEMPLATE.md",
  "docs/program/CONFLICTS_AND_ASSUMPTIONS.md",
  "docs/program/PROGRESS.md",
  "docs/program/GOVERNANCE.md",
  "docs/program/SPECIALIST_INPUTS.md",
  "docs/program/RECONCILIATION.md",
  "docs/program/RESUME_POINT.md",
  "scripts/validate-program-os.mjs",
  "scripts/validate-council-packets.mjs",
  "scripts/test-review-result-intake.mjs",
  "scripts/validate-response-packet.mjs",
  "scripts/apply-program-transition.mjs",
  "scripts/test-program-transition.mjs",
  "scripts/test-delegation-card-discovery.mjs"
];

for (const artifact of requiredArtifacts) read(artifact);

const schema = parseJson("schemas/backlog.schema.json");
const handoffSchema = parseJson("schemas/handoff-packet.schema.json");
const backlog = parseJson("docs/program/BACKLOG.json");
const rootReadme = read("README.md");
const canonicalMasterPrompt = read("docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md");
const statusDocument = read("docs/program/STATUS.md");
const agentInstructions = read("AGENTS.md");
const gptLedger = read("gpt.md");
const crossAiBrief = read("taskgpt.md");
const resumePoint = read("docs/program/RESUME_POINT.md");
const grokReviewRequest = read("prompts/review-requests/UJ-INT-001-GROK.md");
const claudeReviewRequest = read("prompts/review-requests/UJ-INT-006-CLAUDE.md");
const reviewResultImportGuide = read("docs/program/REVIEW_RESULT_IMPORT.md");
const councilValidator = read("scripts/validate-council-packets.mjs");
const reviewIntakeRegressionTest = read("scripts/test-review-result-intake.mjs");

assert(schema?.$schema === "https://json-schema.org/draft/2020-12/schema", "Backlog schema must use JSON Schema 2020-12.");
assert(handoffSchema?.properties?.schema_version?.const === "ultrajarvis.handoff-packet/v1", "Handoff schema version is invalid.");
assert(backlog?.schema_version === "ultrajarvis.backlog/v1", "Backlog schema_version is invalid.");
assert(backlog?.program === "ultraJARVIS", "Backlog program name is invalid.");
assert(rootReadme.includes("ultraJARVIS"), "README.md must identify the ultraJARVIS program.");
assert(canonicalMasterPrompt.includes("PROMPT UNIVERSALE CANONICO") && canonicalMasterPrompt.includes("## 45. COMANDO DI AVVIO"), "Canonical master prompt is incomplete or malformed.");
assert(gptLedger.includes("ULTRAJARVIS_PRIMARY_SESSION_LEDGER_RULE"), "gpt.md must contain the primary session-ledger rule marker.");
assert(gptLedger.includes("ULTRAJARVIS_GROK_SESSION_LEDGER_RULE"), "gpt.md must contain Grok's mandatory ledger rule marker.");
assert(crossAiBrief.includes("ULTRAJARVIS_CROSS_AI_HANDOFF"), "taskgpt.md must contain the cross-AI handoff marker.");
assert(crossAiBrief.includes("ResponsePacket"), "taskgpt.md must explain the required ResponsePacket handoff.");
assert(agentInstructions.includes("gpt.md") && agentInstructions.includes("taskgpt.md"), "AGENTS.md must require the continuity ledgers.");
assert(resumePoint.includes("gpt.md") && resumePoint.includes("taskgpt.md"), "RESUME_POINT.md must require the continuity ledgers.");
assert(grokReviewRequest.includes("UJ-INT-001") && grokReviewRequest.includes("GROK"), "Grok review request must target UJ-INT-001.");
assert(claudeReviewRequest.includes("UJ-INT-006") && claudeReviewRequest.includes("CLAUDE"), "Claude review request must target UJ-INT-006.");
assert(grokReviewRequest.includes("ultrajarvis.review-result/v1"), "Grok review request must require ReviewResult v1.");
assert(claudeReviewRequest.includes("ultrajarvis.review-result/v1"), "Claude review request must require ReviewResult v1.");
assert(reviewResultImportGuide.includes("--review-result") && reviewResultImportGuide.includes("--expected-commit"), "ReviewResult import guide must document the pinned intake command.");
assert(councilValidator.includes("--review-result") && councilValidator.includes("--review-self-test"), "Council validator must support ReviewResult intake and self-test.");
assert(reviewIntakeRegressionTest.includes("ReviewResult intake regression tests"), "ReviewResult regression test runner is missing its required test contract.");

const continuitySecretPatterns = [
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /sk-[A-Za-z0-9]{20,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/
];
assert(continuitySecretPatterns.every((pattern) => !pattern.test(gptLedger)), "gpt.md contains a value resembling a secret.");
assert(continuitySecretPatterns.every((pattern) => !pattern.test(crossAiBrief)), "taskgpt.md contains a value resembling a secret.");
assert(continuitySecretPatterns.every((pattern) => !pattern.test(grokReviewRequest)), "Grok review request contains a value resembling a secret.");
assert(continuitySecretPatterns.every((pattern) => !pattern.test(claudeReviewRequest)), "Claude review request contains a value resembling a secret.");
assert(continuitySecretPatterns.every((pattern) => !pattern.test(reviewResultImportGuide)), "ReviewResult import guide contains a value resembling a secret.");

if (backlog) {
  const tasks = backlog.tasks ?? [];
  const taskIds = tasks.map((task) => task.task_id);
  const taskIdSet = new Set(taskIds);
  const expectedTaskId = /^UJ-[A-Z0-9]+(?:-[A-Z0-9]+)*-[0-9]{3}$/;

  assert(tasks.length === 43, `Expected 43 initial task IDs; found ${tasks.length}.`);
  assert(taskIdSet.size === taskIds.length, "Task IDs must be unique.");

  for (const task of tasks) {
    assert(expectedTaskId.test(task.task_id), `Invalid task ID: ${task.task_id}`);
    assert(typeof task.owner === "string" && task.owner.length > 0, `${task.task_id} must have exactly one string owner.`);
    assert(Number.isInteger(task.weight) && task.weight >= 0, `${task.task_id} has invalid weight.`);
    assert(Number.isInteger(task.completed_weight) && task.completed_weight >= 0, `${task.task_id} has invalid completed_weight.`);
    assert(task.completed_weight <= task.weight, `${task.task_id} accepted weight exceeds total weight.`);
    assert(task.remaining_weight === task.weight - task.completed_weight, `${task.task_id} remaining-weight arithmetic is invalid.`);
    assert(Array.isArray(task.acceptance_criteria) && task.acceptance_criteria.length > 0, `${task.task_id} has no acceptance criteria.`);
    for (const criterion of task.acceptance_criteria ?? []) {
      assert(["PENDING", "PASSED", "FAILED", "NOT_APPLICABLE"].includes(criterion.state), `${task.task_id}/${criterion.criterion_id} has invalid criterion state ${criterion.state}.`);
    }

    for (const proof of task.proof ?? []) {
      if (!proof.hash?.startsWith("sha256:") || proof.ref.startsWith("http") || proof.ref.startsWith("agent/")) continue;
      const proofPath = resolve(root, proof.ref);
      assert(existsSync(proofPath), `${task.task_id} hashed proof path is missing: ${proof.ref}.`);
      if (existsSync(proofPath)) {
        const actualHash = `sha256:${createHash("sha256").update(readFileSync(proofPath)).digest("hex")}`;
        assert(actualHash === proof.hash, `${task.task_id} hashed proof bytes differ for ${proof.ref}.`);
      }
    }

    for (const dependency of task.dependencies ?? []) {
      assert(taskIdSet.has(dependency), `${task.task_id} has unknown dependency ${dependency}.`);
      assert(dependency !== task.task_id, `${task.task_id} depends on itself.`);
    }

    if (task.status === "DONE") {
      assert(task.completed_weight === task.weight, `${task.task_id} is DONE without full accepted weight.`);
      assert((task.proof ?? []).length > 0, `${task.task_id} is DONE without proof.`);
      assert(task.acceptance_criteria.every((criterion) => ["PASSED", "NOT_APPLICABLE"].includes(criterion.state)), `${task.task_id} is DONE with unresolved acceptance criteria.`);
      if (!task.task_id.startsWith("UJ-META-")) {
        assert((task.proof ?? []).some((proof) => proof.ref.startsWith("docs/program/reviews/")), `${task.task_id} is DONE without an independent review proof reference.`);
      }
    }
    if (["BLOCKED", "DEFERRED"].includes(task.status)) {
      assert(task.blocker !== null, `${task.task_id} is ${task.status} without a blocker record.`);
    }
  }

  for (const baseline of backlog.baselines ?? []) {
    const unknownIds = baseline.task_ids.filter((id) => !taskIdSet.has(id));
    assert(unknownIds.length === 0, `${baseline.baseline_id} contains unknown task IDs: ${unknownIds.join(", ")}.`);
    const actualWeight = baseline.task_ids.reduce((sum, id) => sum + tasks.find((task) => task.task_id === id).weight, 0);
    assert(actualWeight === baseline.declared_weight, `${baseline.baseline_id} declares ${baseline.declared_weight} but sums to ${actualWeight}.`);
  }

  const portfolioExpected = new Map([
    ["CHATGPT", 81],
    ["CLAUDE", 76],
    ["GEMINI", 81],
    ["GROK", 73]
  ]);
  let portfolioTotal = 0;
  for (const [owner, expectedWeight] of portfolioExpected) {
    const actualWeight = tasks
      .filter((task) => task.owner === owner && !task.task_id.startsWith("UJ-META-"))
      .reduce((sum, task) => sum + task.weight, 0);
    assert(actualWeight === expectedWeight, `${owner} portfolio must total ${expectedWeight}; found ${actualWeight}.`);
    portfolioTotal += actualWeight;
  }
  assert(portfolioTotal === 311, `Four-AI portfolio must total 311; found ${portfolioTotal}.`);

  const auxiliary = tasks.filter((task) => task.task_id.startsWith("UJ-AUX-"));
  assert(auxiliary.length === 9, `Expected 9 auxiliary candidates; found ${auxiliary.length}.`);
  assert(auxiliary.every((task) => task.weight === 0 && task.status === "PROPOSED"), "Auxiliary candidates must remain zero-weight PROPOSED tasks until a DelegationCard baselines them.");

  const current = tasks.find((task) => task.task_id === "UJ-INT-001");
  assert(current?.status === "REVIEW", "UJ-INT-001 must be submitted as REVIEW in this package.");
  assert(current?.completed_weight === 0, "UJ-INT-001 must not self-award accepted weight.");
  const expectedPromptHash = current?.inputs?.find((input) => input.ref === "docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md")?.hash;
  const actualPromptHash = `sha256:${createHash("sha256").update(canonicalMasterPrompt).digest("hex")}`;
  assert(expectedPromptHash === actualPromptHash, "Canonical master prompt bytes must match the hash pinned by UJ-INT-001.");
  for (const proof of current?.proof ?? []) {
    if (!proof.ref.startsWith("http") && !proof.ref.startsWith("agent/")) {
      assert(existsSync(resolve(root, proof.ref)), `UJ-INT-001 proof path is missing: ${proof.ref}`);
    }
  }

  const reviewerRegression = new Map([
    ["UJ-INT-001", "GROK"],
    ["UJ-INT-002", "CLAUDE"],
    ["UJ-INT-006", "CLAUDE"]
  ]);
  for (const [taskId, expectedReviewer] of reviewerRegression) {
    const task = tasks.find((candidate) => candidate.task_id === taskId);
    assert(task?.reviewer === expectedReviewer, `${taskId} reviewer must remain ${expectedReviewer}; found ${task?.reviewer ?? "MISSING"}.`);
  }

  const councilTask = tasks.find((task) => task.task_id === "UJ-INT-006");
  assert(councilTask?.status === "REVIEW", "UJ-INT-006 must be submitted as REVIEW in this package.");
  assert(councilTask?.weight === 8, "UJ-INT-006 baseline weight must remain 8.");
  assert(councilTask?.completed_weight === 0, "UJ-INT-006 must not self-award accepted weight.");
  for (const proof of councilTask?.proof ?? []) {
    if (!proof.ref.startsWith("http") && !proof.ref.startsWith("agent/")) {
      assert(existsSync(resolve(root, proof.ref)), `UJ-INT-006 proof path is missing: ${proof.ref}`);
    }
  }

  const initialPortfolio = backlog.baselines?.find((baseline) => baseline.baseline_id === "initial-four-ai-portfolio");
  if (initialPortfolio) {
    const coreTasks = initialPortfolio.task_ids.map((id) => tasks.find((task) => task.task_id === id));
    const expectedCoreStatuses = ["REVIEW", "READY", "TRIAGED", "BLOCKED", "DEFERRED", "DONE"];
    for (const status of expectedCoreStatuses) {
      const matching = coreTasks.filter((task) => task?.status === status);
      const count = matching.length;
      const weight = matching.reduce((sum, task) => sum + task.weight, 0);
      assert(
        statusDocument.includes(`| ${status} | ${count} | ${weight} |`),
        `STATUS.md core row for ${status} must report ${count} tasks and ${weight} weight.`
      );
    }
    assert(statusDocument.includes("| **Total** | **32** | **311** |"), "STATUS.md core total must remain 32 tasks / 311 weight.");
  }

  const sourceText = JSON.stringify(backlog);
  const secretPatterns = [
    /ghp_[A-Za-z0-9]{20,}/,
    /github_pat_[A-Za-z0-9_]{20,}/,
    /sk-[A-Za-z0-9]{20,}/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/
  ];
  assert(secretPatterns.every((pattern) => !pattern.test(sourceText)), "Backlog contains a value resembling a secret.");

  const statusCounts = Object.fromEntries(
    [...new Set(tasks.map((task) => task.status))]
      .sort()
      .map((status) => [status, tasks.filter((task) => task.status === status).length])
  );
  notes.push(`task_count=${tasks.length}`);
  notes.push(`portfolio_weight=${portfolioTotal}`);
  const trackedNonzeroWeight = tasks.filter((task) => task.weight > 0).reduce((sum, task) => sum + task.weight, 0);
  const acceptedWeight = tasks.reduce((sum, task) => sum + task.completed_weight, 0);
  notes.push(`tracked_nonzero_weight=${trackedNonzeroWeight}`);
  notes.push(`accepted_weight=${acceptedWeight}`);
  notes.push(`status_counts=${JSON.stringify(statusCounts)}`);
}

const digest = createHash("sha256");
for (const artifact of [...requiredArtifacts].sort()) {
  const absolutePath = resolve(root, artifact);
  if (existsSync(absolutePath)) {
    digest.update(artifact);
    digest.update("\0");
    digest.update(readFileSync(absolutePath));
    digest.update("\0");
  }
}
notes.push(`program_os_artifact_set_sha256=${digest.digest("hex")}`);

if (failures.length > 0) {
  console.error("Program OS validation: FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Program OS validation: PASS");
  for (const note of notes) console.log(`- ${note}`);
}

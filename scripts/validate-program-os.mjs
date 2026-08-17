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
  "AGENTS.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  "docs/program/README.md",
  "docs/program/PROJECT_STATE.md",
  "schemas/backlog.schema.json",
  "docs/program/BACKLOG.json",
  "docs/program/STATUS.md",
  "docs/program/WORKSTREAMS.md",
  "docs/program/HANDOFFS.md",
  "schemas/handoff-packet.schema.json",
  "docs/adrs/README.md",
  "docs/adrs/ADR_TEMPLATE.md",
  "docs/program/CONFLICTS_AND_ASSUMPTIONS.md",
  "docs/program/PROGRESS.md",
  "docs/program/GOVERNANCE.md",
  "docs/program/SPECIALIST_INPUTS.md",
  "docs/program/RECONCILIATION.md",
  "docs/program/RESUME_POINT.md",
  "scripts/validate-program-os.mjs"
];

for (const artifact of requiredArtifacts) read(artifact);

const schema = parseJson("schemas/backlog.schema.json");
const handoffSchema = parseJson("schemas/handoff-packet.schema.json");
const backlog = parseJson("docs/program/BACKLOG.json");

assert(schema?.$schema === "https://json-schema.org/draft/2020-12/schema", "Backlog schema must use JSON Schema 2020-12.");
assert(handoffSchema?.properties?.schema_version?.const === "ultrajarvis.handoff-packet/v1", "Handoff schema version is invalid.");
assert(backlog?.schema_version === "ultrajarvis.backlog/v1", "Backlog schema_version is invalid.");
assert(backlog?.program === "ultraJARVIS", "Backlog program name is invalid.");

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

    for (const dependency of task.dependencies ?? []) {
      assert(taskIdSet.has(dependency), `${task.task_id} has unknown dependency ${dependency}.`);
      assert(dependency !== task.task_id, `${task.task_id} depends on itself.`);
    }

    if (task.status === "DONE") {
      assert(task.completed_weight === task.weight, `${task.task_id} is DONE without full accepted weight.`);
      assert((task.proof ?? []).length > 0, `${task.task_id} is DONE without proof.`);
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
  for (const proof of current?.proof ?? []) {
    if (!proof.ref.startsWith("http") && !proof.ref.startsWith("agent/")) {
      assert(existsSync(resolve(root, proof.ref)), `UJ-INT-001 proof path is missing: ${proof.ref}`);
    }
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

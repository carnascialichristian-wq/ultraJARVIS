#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const transition = resolve(root, "scripts/apply-program-transition.mjs");
const backlogPath = resolve(root, "docs/program/BACKLOG.json");
const statusPath = resolve(root, "docs/program/STATUS.md");
const failures = [];
const passed = [];

function digest(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function repoRef(path) {
  return relative(root, path).split(sep).join("/");
}

function run(name, args, expectedCode, fragment) {
  const result = spawnSync(process.execPath, [transition, ...args], { cwd: root, encoding: "utf8" });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (result.error || result.status !== expectedCode || !output.includes(fragment)) {
    failures.push(`${name}: expected exit ${expectedCode} and ${JSON.stringify(fragment)}; got exit ${result.status}. Output: ${output.trim()}`);
  } else {
    passed.push(name);
  }
}

const beforeBacklog = digest(backlogPath);
const beforeStatus = digest(statusPath);
const temp = mkdtempSync(join(root, ".tmp-program-transition-"));

try {
  const backlog = JSON.parse(readFileSync(backlogPath, "utf8"));
  const task = backlog.tasks.find((candidate) => candidate.task_id === "UJ-INT-001");
  const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  const artifactRef = "docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md";
  const artifactHash = createHash("sha256")
    .update(execFileSync("git", ["show", `${commit}:${artifactRef}`], { cwd: root }))
    .digest("hex");
  const review = {
    schema_version: "ultrajarvis.review-result/v1",
    review_id: "UJ-REVIEW-TRANSITION-DRY-RUN-001",
    created_at: "2026-08-21T00:00:00Z",
    repository: { full_name: "carnascialichristian-wq/ultraJARVIS", commit_sha: commit },
    task_id: task.task_id,
    task_owner: task.owner,
    reviewer: { ai_id: task.reviewer, product: "transition regression fixture" },
    artifacts_reviewed: [{ ref: artifactRef, sha256: artifactHash }],
    outcome: "PASS_WITH_ACTIONS",
    criteria: task.acceptance_criteria.map((criterion) => ({
      criterion_id: criterion.criterion_id,
      result: "PASS",
      evidence_refs: [artifactRef],
      note: "Regression fixture; no acceptance is proposed."
    })),
    findings: [{
      finding_id: "F-001",
      severity: "LOW",
      description: "The dry-run fixture deliberately leaves one follow-up action.",
      required_action: "Keep accepted weight unchanged."
    }],
    policy_checks: {
      zero_cost: "PASS",
      data_class: "PASS",
      side_effect: "PASS",
      secret_handling: "PASS",
      consumer_ui_automation: "PASS"
    },
    accepted_weight_before: task.completed_weight,
    accepted_weight_after: task.completed_weight,
    proposed_task_status: "REVIEW",
    next_action: "Keep the task in review."
  };
  const reviewPath = join(temp, "valid-non-accepting-review.json");
  writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`, "utf8");

  const response = {
    schema_version: "ultrajarvis.response-packet/v1",
    response_id: "UJ-RESPONSE-TRANSITION-DRY-RUN-001",
    created_at: "2026-08-21T00:00:00Z",
    card_id: "UJ-CARD-RUN-001-CLAUDE",
    mission_id: "UJ-MISSION-M0-COUNCIL-001",
    ai_id: "CLAUDE",
    product: "transition regression fixture",
    source_commit_sha: commit,
    capabilities_actually_used: [],
    task_id: "UJ-RUN-001",
    status: "REVIEW",
    executive_delta: "Regression fixture that proposes only READY to REVIEW.",
    facts: [],
    assumptions: [],
    decisions_proposed: [],
    artifacts: [{
      ref: artifactRef,
      sha256: artifactHash,
      media_type: "text/markdown",
      data_class: "C1",
      summary: "Pinned fixture artifact."
    }],
    verification: { checks_run: [], passed: [], failed: [], not_run: [] },
    side_effects: [],
    risks: [],
    task_ledger_delta: [{
      task_id: "UJ-RUN-001",
      previous_status: "READY",
      proposed_status: "REVIEW",
      weight: 13,
      accepted_weight_before: 0,
      proposed_accepted_weight: 0,
      proof_refs: [artifactRef]
    }],
    remaining_work: { weight: 13, blockers: ["Independent review"], next_action: "Request the named reviewer." },
    confidence: { level: "MEDIUM", reason: "Regression fixture only." },
    policy_attestation: {
      no_secret_values: true,
      no_paid_api: true,
      no_billing_enabled: true,
      no_consumer_ui_automation: true,
      no_heavy_local_inference: true,
      within_data_class: true,
      within_side_effect_limit: true
    },
    handoff: { target: "GEMINI", next_action: "Review the fixture.", resume_point: "Read the pinned artifact." }
  };
  const responsePath = join(temp, "valid-response.json");
  writeFileSync(responsePath, `${JSON.stringify(response, null, 2)}\n`, "utf8");

  run(
    "response-dry-run",
    ["--response-packet", repoRef(responsePath)],
    0,
    "task: UJ-RUN-001 -> REVIEW"
  );
  run(
    "review-dry-run",
    ["--review-result", repoRef(reviewPath), "--expected-commit", commit],
    0,
    "accepted weight: 0/13"
  );
  run(
    "reject-stale-red-packet",
    ["--response-packet", "docs/evaluations/UJ-RESPONSE-RED-001-GROK-20260819.json"],
    1,
    "source commit predates the artifacts"
  );
  run(
    "reject-apply-without-confirm",
    ["--response-packet", repoRef(responsePath), "--apply"],
    2,
    "--apply requires --confirm-task"
  );

  const applyTemp = mkdtempSync(join(root, ".tmp-program-transition-apply-"));
  const applyRoot = join(applyTemp, "worktree");
  try {
    execFileSync("git", ["worktree", "add", "--detach", applyRoot, commit], { cwd: root, stdio: "ignore" });
    const isolatedResponse = join(applyRoot, ".program-transition-fixture.json");
    writeFileSync(isolatedResponse, `${JSON.stringify(response, null, 2)}\n`, "utf8");
    const result = spawnSync(
      process.execPath,
      [
        resolve(applyRoot, "scripts/apply-program-transition.mjs"),
        "--response-packet", ".program-transition-fixture.json",
        "--apply", "--confirm-task", "UJ-RUN-001"
      ],
      { cwd: applyRoot, encoding: "utf8" }
    );
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    const isolatedBacklog = JSON.parse(readFileSync(join(applyRoot, "docs/program/BACKLOG.json"), "utf8"));
    const isolatedTask = isolatedBacklog.tasks.find((candidate) => candidate.task_id === "UJ-RUN-001");
    if (
      result.error ||
      result.status !== 0 ||
      !output.includes("wrote: docs/program/BACKLOG.json, docs/program/STATUS.md") ||
      isolatedTask?.status !== "REVIEW" ||
      isolatedTask?.completed_weight !== 0
    ) {
      failures.push(`response-apply-isolated: expected atomic READY -> REVIEW at 0/13; got exit ${result.status}. Output: ${output.trim()}`);
    } else {
      passed.push("response-apply-isolated");
    }
  } finally {
    spawnSync("git", ["worktree", "remove", "--force", applyRoot], { cwd: root, encoding: "utf8" });
    rmSync(applyTemp, { recursive: true, force: true });
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

if (digest(backlogPath) !== beforeBacklog || digest(statusPath) !== beforeStatus) {
  failures.push("dry-run changed BACKLOG.json or STATUS.md.");
}

if (failures.length) {
  console.error("Program transition regression tests: FAIL");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Program transition regression tests: PASS");
  console.log(`- case_count=${passed.length}`);
  console.log(`- cases=${passed.join(",")}`);
  console.log("- dry_run_writes=0");
}

#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const validator = resolve(root, "scripts/validate-council-packets.mjs");
const backlogPath = resolve(root, "docs/program/BACKLOG.json");
const expectedCommit = "d".repeat(40);
const failures = [];
const passedCases = [];

function fail(message) {
  failures.push(message);
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function repositoryPath(path) {
  return relative(root, path).split(sep).join("/");
}

function runCase(name, args, expectedExitCode, expectedFragment) {
  const result = spawnSync(process.execPath, [validator, ...args], {
    cwd: root,
    encoding: "utf8"
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (result.error) {
    fail(`${name}: unable to execute validator (${result.error.message}).`);
    return;
  }
  if (result.status !== expectedExitCode) {
    fail(`${name}: expected exit ${expectedExitCode}, received ${result.status}; output: ${output.trim()}`);
    return;
  }
  if (expectedFragment && !output.includes(expectedFragment)) {
    fail(`${name}: expected output to contain ${JSON.stringify(expectedFragment)}; output: ${output.trim()}`);
    return;
  }
  passedCases.push(name);
}

if (!existsSync(validator) || !existsSync(backlogPath)) {
  fail("Required validator or backlog artifact is missing.");
} else {
  const backlog = JSON.parse(readFileSync(backlogPath, "utf8"));
  const task = backlog.tasks?.find((candidate) => candidate.task_id === "UJ-INT-001");
  if (!task) {
    fail("Cannot find UJ-INT-001 for the intake regression fixtures.");
  } else {
    const tempDirectory = mkdtempSync(join(root, ".tmp-review-result-intake-"));
    const expectedPrefix = join(root, ".tmp-review-result-intake-");
    if (!tempDirectory.startsWith(expectedPrefix)) {
      fail(`Refusing to clean an unexpected temporary directory: ${tempDirectory}.`);
    } else {
      try {
        const artifactRef = "docs/program/BACKLOG.json";
        const artifactHash = sha256(backlogPath);
        const baseReview = {
          schema_version: "ultrajarvis.review-result/v1",
          review_id: "UJ-REVIEW-TEST-PASS-WITH-ACTIONS",
          created_at: "2026-08-17T00:00:00Z",
          repository: { full_name: "carnascialichristian-wq/ultraJARVIS", commit_sha: expectedCommit },
          task_id: task.task_id,
          task_owner: task.owner,
          reviewer: { ai_id: task.reviewer, product: "intake regression test" },
          artifacts_reviewed: [{ ref: artifactRef, sha256: artifactHash }],
          outcome: "PASS_WITH_ACTIONS",
          criteria: task.acceptance_criteria.map((criterion) => ({
            criterion_id: criterion.criterion_id,
            result: "PASS",
            evidence_refs: [artifactRef],
            note: "Regression fixture verifies an admissible non-accepting review."
          })),
          findings: [{
            finding_id: "F-001",
            severity: "LOW",
            description: "A follow-up action remains before acceptance.",
            required_action: "Record and resolve the follow-up independently."
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
          next_action: "Request the independent human-bridge review outcome."
        };

        function writeCandidate(name, review) {
          const path = join(tempDirectory, name);
          writeFileSync(path, `${JSON.stringify(review, null, 2)}\n`, "utf8");
          return repositoryPath(path);
        }

        runCase("built-in-self-test", ["--review-self-test"], 0, "review_self_test=PASS");

        const validCandidate = writeCandidate("valid-pass-with-actions.json", baseReview);
        runCase(
          "valid-pass-with-actions",
          ["--review-result", validCandidate, "--expected-commit", expectedCommit],
          0,
          `review_result=${validCandidate}`
        );

        const partialWeight = clone(baseReview);
        partialWeight.review_id = "UJ-REVIEW-TEST-PARTIAL-WEIGHT";
        partialWeight.outcome = "PASS";
        partialWeight.findings = [];
        partialWeight.accepted_weight_after = task.weight - 1;
        partialWeight.proposed_task_status = "DONE";
        const partialCandidate = writeCandidate("reject-partial-weight.json", partialWeight);
        runCase(
          "reject-partial-weight",
          ["--review-result", partialCandidate, "--expected-commit", expectedCommit],
          1,
          "has no approved partial-weight mapping"
        );

        const wrongReviewer = clone(baseReview);
        wrongReviewer.review_id = "UJ-REVIEW-TEST-WRONG-REVIEWER";
        wrongReviewer.reviewer.ai_id = "CLAUDE";
        const reviewerCandidate = writeCandidate("reject-wrong-reviewer.json", wrongReviewer);
        runCase(
          "reject-wrong-reviewer",
          ["--review-result", reviewerCandidate, "--expected-commit", expectedCommit],
          1,
          `reviewer must be ${task.reviewer}`
        );

        const staleCommit = clone(baseReview);
        staleCommit.review_id = "UJ-REVIEW-TEST-STALE-COMMIT";
        staleCommit.repository.commit_sha = "e".repeat(40);
        const staleCandidate = writeCandidate("reject-stale-commit.json", staleCommit);
        runCase(
          "reject-stale-commit",
          ["--review-result", staleCandidate, "--expected-commit", expectedCommit],
          1,
          "commit must equal --expected-commit"
        );

        const escapedArtifact = clone(baseReview);
        escapedArtifact.review_id = "UJ-REVIEW-TEST-ESCAPED-ARTIFACT";
        escapedArtifact.artifacts_reviewed = [{ ref: "../gpt.md", sha256: artifactHash }];
        const escapedCandidate = writeCandidate("reject-escaped-artifact.json", escapedArtifact);
        runCase(
          "reject-escaped-artifact",
          ["--review-result", escapedCandidate, "--expected-commit", expectedCommit],
          1,
          "artifact ref must be a repository-relative path"
        );

        runCase(
          "reject-external-candidate-path",
          ["--review-result", "/tmp/untrusted-review.json", "--expected-commit", expectedCommit],
          1,
          "ReviewResult candidate must be a repository-relative path"
        );
      } finally {
        rmSync(tempDirectory, { recursive: true, force: true });
      }
    }
  }
}

if (failures.length > 0) {
  console.error("ReviewResult intake regression tests: FAIL");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log("ReviewResult intake regression tests: PASS");
  console.log(`- case_count=${passedCases.length}`);
  console.log(`- cases=${passedCases.join(",")}`);
}

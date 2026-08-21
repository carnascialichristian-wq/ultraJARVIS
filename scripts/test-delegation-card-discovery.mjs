#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const failures = [];
const validatorRef = "scripts/validate-council-packets.mjs";
const source = readFileSync(resolve(root, validatorRef), "utf8");
const backlog = JSON.parse(readFileSync(resolve(root, "docs/program/BACKLOG.json"), "utf8"));
const cardRefs = readdirSync(resolve(root, "prompts/delegation-cards"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => `prompts/delegation-cards/${entry.name}`)
  .sort();
const cards = cardRefs.map((ref) => JSON.parse(readFileSync(resolve(root, ref), "utf8")));

if (!source.includes("readdirSync") || !source.includes("cardDirectory")) failures.push("validator does not discover card JSON files from the directory.");
if (source.includes("expectedTargets")) failures.push("validator still contains the fixed expectedTargets map.");
if (source.includes("exactly the first four specialist tasks")) failures.push("validator still enforces the four-task ceiling.");
if (!source.includes('"IN_PROGRESS"')) failures.push("live forward-state policy omits IN_PROGRESS.");

const targetOwners = new Set(["CHATGPT", "CLAUDE", "GEMINI", "GROK", "AUXILIARY_AI"]);
const reviewers = new Set(["CHATGPT", "CLAUDE", "GEMINI", "GROK", "CHRISTIAN", "Christian"]);
const eligibleReady = backlog.tasks.filter((task) =>
  task.status === "READY" &&
  targetOwners.has(task.owner) &&
  reviewers.has(task.reviewer) &&
  task.owner !== task.reviewer
);
const cardTasks = new Set(cards.map((card) => card.task_id));
for (const task of eligibleReady) {
  if (!cardTasks.has(task.task_id)) failures.push(`eligible READY task has no discovered card: ${task.task_id}.`);
}

const result = spawnSync(process.execPath, [validatorRef], { cwd: root, encoding: "utf8" });
const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
if (result.error || result.status !== 0) failures.push(`Council validator failed: ${output.trim()}`);
if (!output.includes(`delegation_card_count=${cards.length}`)) failures.push("Council validator did not report the discovered card count.");
if (!output.includes("mission_count=1")) failures.push("Council validator did not report the discovered mission count.");

if (failures.length) {
  console.error("Delegation card discovery tests: FAIL");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Delegation card discovery tests: PASS");
  console.log(`- discovered_cards=${cards.length}`);
  console.log(`- eligible_ready_tasks=${eligibleReady.length}`);
  console.log(`- eligible_ready_with_cards=${eligibleReady.filter((task) => cardTasks.has(task.task_id)).length}`);
  console.log("- hard_coded_target_set=false");
}

#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import {
  closeSync,
  existsSync,
  lstatSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  unlinkSync,
  writeFileSync
} from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const backlogRef = "docs/program/BACKLOG.json";
const statusRef = "docs/program/STATUS.md";
const lockPath = resolve(root, ".program-transition.lock");

function usage(message) {
  if (message) console.error(`ERROR: ${message}`);
  console.error(
    "usage:\n" +
    "  node scripts/apply-program-transition.mjs --response-packet <packet.json> [--apply --confirm-task <task-id>]\n" +
    "  node scripts/apply-program-transition.mjs --review-result <review.json> --expected-commit <sha> [--apply --confirm-task <task-id>]\n\n" +
    "Default mode is dry-run. --apply changes BACKLOG.json and STATUS.md locally; it never commits, pushes, reviews, merges, or closes a PR."
  );
  process.exit(2);
}

function value(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0) return null;
  const candidate = process.argv[index + 1];
  if (!candidate || candidate.startsWith("--")) usage(`${flag} requires a value.`);
  return candidate;
}

const responseRef = value("--response-packet");
const reviewRef = value("--review-result");
const expectedCommit = value("--expected-commit");
const confirmTask = value("--confirm-task");
const apply = process.argv.includes("--apply");

if (Boolean(responseRef) === Boolean(reviewRef)) usage("choose exactly one of --response-packet or --review-result.");
if (reviewRef && !/^[0-9a-f]{40}$/.test(expectedCommit ?? "")) usage("--review-result requires --expected-commit with a lowercase 40-character SHA.");
if (responseRef && expectedCommit) usage("--expected-commit is only valid with --review-result.");
if (apply && !confirmTask) usage("--apply requires --confirm-task <task-id>.");

function repositoryFile(ref, label) {
  if (typeof ref !== "string" || ref.length === 0 || isAbsolute(ref) || ref.split(/[\\/]+/).includes("..")) {
    throw new Error(`${label} must be a repository-relative path: ${ref}.`);
  }
  const absolute = resolve(root, ref);
  const fromRoot = relative(root, absolute);
  if (!fromRoot || fromRoot === ".." || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) {
    throw new Error(`${label} escapes the repository: ${ref}.`);
  }
  if (!existsSync(absolute)) throw new Error(`${label} is missing: ${ref}.`);
  const stats = lstatSync(absolute);
  if (!stats.isFile() || stats.isSymbolicLink()) throw new Error(`${label} must be a regular file: ${ref}.`);
  return absolute;
}

function parse(ref, label) {
  try {
    return JSON.parse(readFileSync(repositoryFile(ref, label), "utf8"));
  } catch (error) {
    throw new Error(`${label} is not valid JSON (${error.message}).`);
  }
}

function sha256Bytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function sha256File(ref) {
  return sha256Bytes(readFileSync(repositoryFile(ref, "transition input")));
}

function runBlocking(command, args, label) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8" });
  if (result.error || result.status !== 0) {
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
    throw new Error(`${label} failed (exit ${result.status ?? "unavailable"}).${output ? `\n${output}` : ""}`);
  }
  return (result.stdout ?? "").trim();
}

function addProof(task, ref, hash) {
  task.proof ??= [];
  const normalized = hash ? `sha256:${hash}` : null;
  const existing = task.proof.find((proof) => proof.ref === ref);
  if (existing) {
    if (normalized) existing.hash = normalized;
  } else {
    task.proof.push(normalized ? { ref, hash: normalized } : { ref });
  }
}

function addCriterionProof(criterion, refs) {
  criterion.proof_refs ??= [];
  for (const ref of refs) if (!criterion.proof_refs.includes(ref)) criterion.proof_refs.push(ref);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeReviewer(value) {
  return value === "Christian" ? "CHRISTIAN" : value;
}

function findCard(cardId) {
  const names = readdirSync(resolve(root, "prompts/delegation-cards"), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => `prompts/delegation-cards/${entry.name}`)
    .sort();
  for (const ref of names) {
    const card = parse(ref, "DelegationCard");
    if (card.card_id === cardId) return { ref, card };
  }
  throw new Error(`DelegationCard ${cardId} is not tracked in prompts/delegation-cards/.`);
}

function applyResponse(backlog, ref) {
  runBlocking(process.execPath, ["scripts/validate-council-packets.mjs"], "Council/card validation");
  runBlocking(process.execPath, ["scripts/validate-response-packet.mjs", ref], "ResponsePacket intake");
  const packet = parse(ref, "ResponsePacket");
  const task = backlog.tasks.find((candidate) => candidate.task_id === packet.task_id);
  if (!task) throw new Error(`ResponsePacket references unknown task ${packet.task_id}.`);
  const deltas = packet.task_ledger_delta ?? [];
  if (deltas.length !== 1) throw new Error("ResponsePacket must contain exactly one task_ledger_delta.");
  const delta = deltas[0];
  const { card } = findCard(packet.card_id);
  if (card.task_id !== task.task_id || card.mission_id !== packet.mission_id || card.target_ai !== packet.ai_id) {
    throw new Error("ResponsePacket identity does not match its DelegationCard.");
  }
  if (task.owner !== card.target_ai) throw new Error("DelegationCard target no longer matches the task owner.");
  if (normalizeReviewer(task.reviewer) !== card.reviewer) throw new Error("DelegationCard reviewer no longer matches the backlog.");
  if (task.status !== delta.previous_status) throw new Error(`${task.task_id} is ${task.status}, not packet previous_status ${delta.previous_status}.`);
  if (delta.weight !== task.weight || delta.accepted_weight_before !== task.completed_weight) throw new Error("ResponsePacket ledger values are stale.");
  if (delta.proposed_accepted_weight !== task.completed_weight) throw new Error("A ResponsePacket cannot award accepted weight.");
  if (packet.status !== delta.proposed_status) throw new Error("ResponsePacket status and ledger delta disagree.");

  task.status = delta.proposed_status;
  task.remaining_weight = task.weight - task.completed_weight;
  for (const artifact of packet.artifacts ?? []) addProof(task, artifact.ref, artifact.sha256);
  addProof(task, ref, sha256File(ref));
  task.blocker = {
    kind: "EVIDENCE",
    cause: `ResponsePacket ${packet.response_id} is submitted; accepted weight remains ${task.completed_weight}/${task.weight} pending independent ${task.reviewer} review.`,
    resolver: task.reviewer
  };
  task.next_action = packet.handoff?.next_action ?? packet.remaining_work?.next_action ?? "Request the named independent review.";
  task.updated_at = new Date().toISOString();
  return { task, sourceId: packet.response_id, kind: "ResponsePacket" };
}

function verifyReviewArtifactsAtCommit(review) {
  runBlocking("git", ["cat-file", "-e", `${review.repository.commit_sha}^{commit}`], "review commit lookup");
  for (const artifact of review.artifacts_reviewed ?? []) {
    let bytes;
    try {
      bytes = execFileSync("git", ["show", `${review.repository.commit_sha}:${artifact.ref}`], {
        cwd: root,
        maxBuffer: 64 * 1024 * 1024
      });
    } catch {
      throw new Error(`reviewed artifact ${artifact.ref} is absent at ${review.repository.commit_sha}.`);
    }
    const actual = sha256Bytes(bytes);
    if (actual !== artifact.sha256) throw new Error(`reviewed artifact hash mismatch at pinned commit for ${artifact.ref}.`);
  }
}

function applyReview(backlog, ref) {
  runBlocking(
    process.execPath,
    ["scripts/validate-council-packets.mjs", "--review-result", ref, "--expected-commit", expectedCommit],
    "ReviewResult intake"
  );
  const review = parse(ref, "ReviewResult");
  verifyReviewArtifactsAtCommit(review);
  const task = backlog.tasks.find((candidate) => candidate.task_id === review.task_id);
  if (!task) throw new Error(`ReviewResult references unknown task ${review.task_id}.`);
  if (review.repository.commit_sha !== expectedCommit) throw new Error("ReviewResult commit differs from --expected-commit.");

  const byCriterion = new Map(review.criteria.map((criterion) => [criterion.criterion_id, criterion]));
  for (const criterion of task.acceptance_criteria) {
    const result = byCriterion.get(criterion.criterion_id);
    criterion.state = result.result === "PASS" ? "PASSED" : result.result === "FAIL" ? "FAILED" : "PENDING";
    addCriterionProof(criterion, result.evidence_refs);
  }
  task.status = review.proposed_task_status;
  task.completed_weight = review.accepted_weight_after;
  task.remaining_weight = task.weight - task.completed_weight;
  for (const artifact of review.artifacts_reviewed) addProof(task, artifact.ref, artifact.sha256);
  addProof(task, ref, sha256File(ref));
  task.blocker = task.status === "DONE" ? null : {
    kind: "EVIDENCE",
    cause: `${review.reviewer.ai_id} review ${review.review_id} concluded ${review.outcome}; no accepted-weight increase is admissible.`,
    resolver: review.reviewer.ai_id
  };
  task.next_action = review.next_action;
  task.updated_at = new Date().toISOString();
  return { task, sourceId: review.review_id, kind: "ReviewResult" };
}

function releaseSatisfiedDependencies(backlog, acceptedTaskId) {
  const byId = new Map(backlog.tasks.map((task) => [task.task_id, task]));
  const released = [];
  for (const task of backlog.tasks) {
    if (!task.dependencies?.includes(acceptedTaskId) || task.status !== "BLOCKED" || task.blocker?.kind !== "DEPENDENCY") continue;
    if (!task.dependencies.every((id) => byId.get(id)?.status === "DONE")) continue;
    task.status = "READY";
    task.blocker = null;
    task.next_action = `Dependencies accepted; ${task.task_id} may now be assigned through a valid DelegationCard.`;
    task.updated_at = new Date().toISOString();
    released.push(task.task_id);
  }
  return released;
}

function baselineMetrics(backlog, id) {
  const baseline = backlog.baselines.find((candidate) => candidate.baseline_id === id);
  const tasks = baseline.task_ids.map((taskId) => backlog.tasks.find((task) => task.task_id === taskId));
  const accepted = tasks.reduce((sum, task) => sum + task.completed_weight, 0);
  return { baseline, tasks, accepted, total: baseline.declared_weight, remaining: baseline.declared_weight - accepted };
}

function percent(accepted, total) {
  return `${((accepted / total) * 100).toFixed(2)}%`;
}

function renderStatus(source, backlog) {
  const core = baselineMetrics(backlog, "initial-four-ai-portfolio");
  const m0 = baselineMetrics(backlog, "m0-bootstrap-snapshot");
  const meta = baselineMetrics(backlog, "meta-bootstrap");
  const order = ["IN_PROGRESS", "REVIEW", "READY", "TRIAGED", "BLOCKED", "DEFERRED", "DONE"];
  const meaning = {
    IN_PROGRESS: "Authorized work is underway; no acceptance implied",
    REVIEW: "Artifacts submitted; acceptance pending",
    READY: "Inputs sufficient to begin, subject to WIP and card gates",
    TRIAGED: "Scoped but not selected as current primary work",
    BLOCKED: "Explicit dependency/evidence blocker exists",
    DEFERRED: "Future milestone or insufficient operational evidence",
    DONE: "Full weight accepted with admissible independent proof"
  };
  const rows = order.map((status) => {
    const tasks = core.tasks.filter((task) => task.status === status);
    return `| ${status} | ${tasks.length} | ${tasks.reduce((sum, task) => sum + task.weight, 0)} | ${meaning[status]} |`;
  }).join("\n");
  const tracked = backlog.tasks.filter((task) => task.weight > 0);
  const trackedTotal = tracked.reduce((sum, task) => sum + task.weight, 0);
  const trackedAccepted = tracked.reduce((sum, task) => sum + task.completed_weight, 0);
  const reviewTasks = core.tasks.filter((task) => task.status === "REVIEW");
  const reviewWeight = reviewTasks.reduce((sum, task) => sum + task.weight, 0);
  const displayOwner = (owner) => ({ CHATGPT: "ChatGPT", CLAUDE: "Claude", GEMINI: "Gemini", GROK: "Grok", Christian: "Christian" }[owner] ?? owner);
  const cell = (value) => String(value ?? "").replaceAll("|", "\\|").replaceAll(/\s+/g, " ").trim();
  let output = source.replace(/^Snapshot date: .*$/m, `Snapshot date: ${new Date().toISOString().slice(0, 10)}. Numeric source: \`BACKLOG.json\` on the same ref.`);
  output = output.replace(/^\| Initial four-AI portfolio \|.*$/m, `| Initial four-AI portfolio | ${core.accepted} / ${core.total} | ${percent(core.accepted, core.total)} | ${core.remaining} | HIGH: accepted weight is derived from task records |`);
  output = output.replace(/^\| M0 bootstrap snapshot \|.*$/m, `| M0 bootstrap snapshot | ${m0.accepted} / ${m0.total} | ${percent(m0.accepted, m0.total)} | ${m0.remaining} | MEDIUM: owner acceptance may amend the draft baseline |`);
  output = output.replace(/^\| Meta bootstrap only \|.*$/m, `| Meta bootstrap only | ${meta.accepted} / ${meta.total} | ${percent(meta.accepted, meta.total)} | ${meta.remaining} | HIGH: derived from task records |`);
  output = output.replace(
    /The current nonzero tracked scope is[\s\S]*?packet gates pass\./,
    `The current nonzero tracked scope is ${trackedTotal}: ${core.total} in the named initial four-AI\n` +
      `baseline plus ${trackedTotal - core.total} meta-bootstrap units. Only ${trackedAccepted}/${trackedTotal} is accepted.\n` +
      `${reviewTasks.length} core tasks carry ${reviewWeight} units in REVIEW, but contribute accepted weight only through admissible independent reviews and packet gates.`
  );
  output = output.replace(/\| (?:IN_PROGRESS|REVIEW) \|[\s\S]*?\| \*\*Total\*\* \| \*\*32\*\* \| \*\*311\*\* \|[^\n]*/, `${rows}\n| **Total** | **${core.tasks.length}** | **${core.total}** | Four-AI initial portfolio |`);
  output = output.replace(/^\| (UJ-[A-Z0-9-]+) \|.*$/gm, (line, taskId) => {
    const task = backlog.tasks.find((candidate) => candidate.task_id === taskId);
    if (!task) return line;
    const proof = `${task.proof?.length ?? 0} ledger proof ref(s)`;
    const blocker = task.blocker?.cause ?? "none";
    return `| ${task.task_id} | ${cell(displayOwner(task.owner))} | ${task.status} | ${task.completed_weight}/${task.weight} | ${cell(proof)} | ${cell(blocker)} | ${cell(task.next_action)} |`;
  });
  output = output.replace(/^- \d+ accepted-weight units remain in the current M0 bootstrap snapshot\.$/m, `- ${m0.remaining} accepted-weight units remain in the current M0 bootstrap snapshot.`);
  for (const status of order) {
    const count = [...output.matchAll(new RegExp(`^\\| ${status} \\| \\d+ \\| \\d+ \\|`, "gm"))].length;
    if (count !== 1) throw new Error(`STATUS.md render produced ${count} core rows for ${status}; expected exactly one.`);
  }
  return output;
}

function atomicApply(backlog, status) {
  if (existsSync(lockPath)) throw new Error("another program transition appears to be running (.program-transition.lock exists).");
  const lock = openSync(lockPath, "wx", 0o600);
  closeSync(lock);
  const backlogPath = resolve(root, backlogRef);
  const statusPath = resolve(root, statusRef);
  const oldBacklog = readFileSync(backlogPath);
  const oldStatus = readFileSync(statusPath);
  const token = randomUUID();
  const tempBacklog = `${backlogPath}.${token}.tmp`;
  const tempStatus = `${statusPath}.${token}.tmp`;
  try {
    writeFileSync(tempBacklog, `${JSON.stringify(backlog, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
    writeFileSync(tempStatus, status, { encoding: "utf8", mode: 0o600 });
    renameSync(tempBacklog, backlogPath);
    renameSync(tempStatus, statusPath);
    runBlocking(process.execPath, ["scripts/validate-program-os.mjs"], "post-write Program OS validation");
    runBlocking(process.execPath, ["scripts/validate-council-packets.mjs"], "post-write Council validation");
  } catch (error) {
    writeFileSync(backlogPath, oldBacklog, { mode: 0o600 });
    writeFileSync(statusPath, oldStatus, { mode: 0o600 });
    throw new Error(`transition rolled back: ${error.message}`);
  } finally {
    for (const temp of [tempBacklog, tempStatus]) if (existsSync(temp)) unlinkSync(temp);
    if (existsSync(lockPath)) unlinkSync(lockPath);
  }
}

try {
  const backlog = clone(parse(backlogRef, "BACKLOG.json"));
  const statusSource = readFileSync(repositoryFile(statusRef, "STATUS.md"), "utf8");
  const result = responseRef ? applyResponse(backlog, responseRef) : applyReview(backlog, reviewRef);
  if (confirmTask && confirmTask !== result.task.task_id) throw new Error(`--confirm-task ${confirmTask} does not match ${result.task.task_id}.`);
  const released = result.task.status === "DONE" ? releaseSatisfiedDependencies(backlog, result.task.task_id) : [];
  const renderedStatus = renderStatus(statusSource, backlog);

  console.log(`Program transition: ${apply ? "APPLY" : "DRY-RUN"}`);
  console.log(`- source: ${result.kind} ${result.sourceId}`);
  console.log(`- task: ${result.task.task_id} -> ${result.task.status}`);
  console.log(`- accepted weight: ${result.task.completed_weight}/${result.task.weight}`);
  console.log(`- dependencies released: ${released.length ? released.join(", ") : "none"}`);
  if (apply) {
    atomicApply(backlog, renderedStatus);
    console.log(`- wrote: ${backlogRef}, ${statusRef}`);
    console.log("- remote side effects: none");
  } else {
    console.log("- files written: none (use --apply --confirm-task only after reviewing this plan)");
  }
} catch (error) {
  console.error("Program transition: FAIL");
  console.error(`- ${error.message}`);
  process.exitCode = 1;
}

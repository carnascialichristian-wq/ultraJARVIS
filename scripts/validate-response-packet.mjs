#!/usr/bin/env node
/**
 * Validate a ResponsePacket against schemas/response-packet.schema.json and
 * verify that every cited artifact hash matches the committed bytes.
 *
 * WHY THIS EXISTS
 * ---------------
 * scripts/validate-council-packets.mjs exposes --review-result for ReviewResults
 * but has no entry point for a ResponsePacket, even though a ResponsePacket is
 * what moves a task from READY/BLOCKED to REVIEW. Without a gate, a specialist
 * has no way to check a packet before sending it through HUMAN_BRIDGE, and the
 * integrator has no way to check one on arrival.
 *
 * This script does not modify the council validator. It reuses that validator's
 * own validate() implementation verbatim, so the schema rules cannot drift
 * between the two. ChatGPT owns the validator and may fold this in.
 *
 * Usage:
 *   node scripts/validate-response-packet.mjs <packet.json> [--skip-hashes]
 *
 * Exit code 0 = admissible, 1 = rejected.
 */

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const COUNCIL_VALIDATOR = "scripts/validate-council-packets.mjs";
const SCHEMA = "schemas/response-packet.schema.json";

// Reuse the council validator's own validate() implementation rather than
// reimplementing JSON Schema, so the two gates can never disagree.
function loadValidate() {
  const lines = readFileSync(COUNCIL_VALIDATOR, "utf8").split("\n");
  const start = lines.findIndex((l) => l.startsWith("function deepEqual("));
  const end = lines.findIndex((l) => l.startsWith("const schemas ="));
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`Could not locate validate() in ${COUNCIL_VALIDATOR}`);
  }
  const mod = lines.slice(start, end).join("\n") + "\nexport { validate };\n";
  return import("data:text/javascript;base64," + Buffer.from(mod).toString("base64"));
}

const packetPath = process.argv[2];
const skipHashes = process.argv.includes("--skip-hashes");
if (!packetPath) {
  console.error("usage: node scripts/validate-response-packet.mjs <packet.json> [--skip-hashes]");
  process.exit(2);
}

const failures = [];
const fail = (msg) => failures.push(msg);

const { validate } = await loadValidate();
const schema = JSON.parse(readFileSync(SCHEMA, "utf8"));
const packet = JSON.parse(readFileSync(packetPath, "utf8"));

// 1. Schema conformance.
validate(packet, schema, schema).forEach((e) => fail(`schema: ${e}`));

// 2. A packet must never propose its own acceptance. PROGRESS.md rule 2 and 4:
//    produced or REVIEW work is not automatically accepted, and status alone
//    never changes accepted weight.
for (const delta of packet.task_ledger_delta ?? []) {
  if (delta.proposed_accepted_weight !== delta.accepted_weight_before) {
    fail(
      `ledger: ${delta.task_id} proposes accepted weight ` +
        `${delta.accepted_weight_before} -> ${delta.proposed_accepted_weight}; ` +
        "an owner cannot accept their own task, only a named reviewer can."
    );
  }
  if (delta.task_id !== packet.task_id) {
    fail(`ledger: delta targets ${delta.task_id} but the packet is for ${packet.task_id}.`);
  }
}

// 3. Every artifact hash must match the bytes at the declared commit, and every
//    proof_ref must be an artifact the packet actually cites. This is the check
//    that makes "proof" mean something rather than a free-text label.
// Helpers for diagnosing WHY a source commit cannot resolve an artifact. A bare
// "does not exist" sends the author looking at the artifact, which is usually
// fine; the real fault is almost always the commit. Measured twice in this
// program: UJ-RUN-001 and UJ-CAP-001 both declared a source commit copied from
// their delegation card's read_ref, which predated the artifacts they cite.
function gitOk(args) {
  try {
    execFileSync("git", args, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function sha256AtRefEquals(artifact, ref) {
  try {
    const bytes = execFileSync("git", ["show", `${ref}:${artifact.ref}`], {
      maxBuffer: 64 * 1024 * 1024
    });
    return createHash("sha256").update(bytes).digest("hex") === artifact.sha256;
  } catch {
    return false;
  }
}

function diagnoseUnresolvableCommit(commit, refs) {
  const notes = [];
  if (!gitOk(["cat-file", "-e", `${commit}^{commit}`])) {
    notes.push(`the commit ${commit.slice(0, 12)} is not an object in this repository; fetch it or correct the value.`);
    return notes;
  }
  // Which of the missing artifacts DO exist somewhere reachable? If they exist at
  // HEAD but not at the declared commit, the commit is stale, not the artifacts.
  const atHead = refs.filter((r) => gitOk(["cat-file", "-e", `HEAD:${r}`]));
  if (atHead.length === refs.length && refs.length > 0) {
    notes.push(
      `all ${refs.length} unresolved artifact(s) exist at HEAD but not at ${commit.slice(0, 12)}: ` +
        "the source commit predates the artifacts it cites. Set source_commit_sha to the commit " +
        "that actually contains them. Do not copy it from your delegation card's read_ref — the " +
        "card pins what you must READ, not the commit you are DELIVERING."
    );
  } else if (atHead.length > 0) {
    notes.push(
      `${atHead.length} of ${refs.length} unresolved artifact(s) exist at HEAD, so the source ` +
        "commit is at least partly stale; the rest may live on another branch."
    );
  }
  if (!gitOk(["merge-base", "--is-ancestor", commit, "origin/main"])) {
    notes.push(
      `${commit.slice(0, 12)} is not reachable from origin/main, so an integrator on main cannot ` +
        "resolve it even once the artifacts land. Pick a commit that is reachable, or expect the " +
        "review of this packet to be unverifiable from main."
    );
  }
  return notes;
}

if (!skipHashes) {
  const commit = packet.source_commit_sha;
  const cited = new Set((packet.artifacts ?? []).map((a) => a.ref));
  const unresolved = [];
  const mismatched = [];
  for (const artifact of packet.artifacts ?? []) {
    let bytes;
    try {
      bytes = execFileSync("git", ["show", `${commit}:${artifact.ref}`], {
        maxBuffer: 64 * 1024 * 1024
      });
    } catch {
      fail(`artifact: ${artifact.ref} does not exist at ${commit}.`);
      unresolved.push(artifact.ref);
      continue;
    }
    const actual = createHash("sha256").update(bytes).digest("hex");
    if (actual !== artifact.sha256) {
      fail(`artifact: hash mismatch for ${artifact.ref} (declared ${artifact.sha256}, actual ${actual}).`);
      mismatched.push(artifact);
    }
  }
  if (unresolved.length) {
    for (const note of diagnoseUnresolvableCommit(commit, unresolved)) {
      fail(`diagnosis: ${note}`);
    }
  }
  // A stale commit that still RESOLVES every path is the nastier case: it reports
  // N hash mismatches and reads as N tampered files. Before anyone concludes that,
  // check whether the declared hashes are all correct somewhere else. If they are,
  // the bytes are fine and the commit is wrong. Measured precedent: a repin commit
  // in this program replaced 16 correct hashes and cost a full round to diagnose.
  if (mismatched.length) {
    const matchAtHead = mismatched.filter((a) => sha256AtRefEquals(a, "HEAD"));
    if (matchAtHead.length === mismatched.length) {
      fail(
        `diagnosis: all ${mismatched.length} declared hash(es) match the bytes at HEAD, so the ` +
          `artifacts are not tampered with — source_commit_sha ${commit.slice(0, 12)} is simply not ` +
          "the commit these hashes were computed from. Repoint it before touching any artifact."
      );
    } else if (matchAtHead.length > 0) {
      fail(
        `diagnosis: ${matchAtHead.length} of ${mismatched.length} declared hash(es) match at HEAD, ` +
          "so the source commit is at least partly wrong; investigate the commit before the bytes."
      );
    }
  }
  for (const delta of packet.task_ledger_delta ?? []) {
    for (const ref of delta.proof_refs ?? []) {
      if (!cited.has(ref)) fail(`proof: ${ref} is cited as proof but is not among the packet artifacts.`);
    }
  }
}

if (failures.length) {
  console.log(`ResponsePacket validation: FAIL (${failures.length})`);
  failures.forEach((f) => console.log(`- ${f}`));
  process.exit(1);
}

const delta = packet.task_ledger_delta[0];
console.log("ResponsePacket validation: PASS");
console.log(`- packet          : ${packetPath}`);
console.log(`- task            : ${packet.task_id} (${packet.ai_id})`);
console.log(`- status proposed : ${delta.previous_status} -> ${delta.proposed_status}`);
console.log(`- accepted weight : ${delta.accepted_weight_before} -> ${delta.proposed_accepted_weight} / ${delta.weight} (unchanged)`);
console.log(`- artifacts       : ${packet.artifacts.length} cited, all hashes verified at ${packet.source_commit_sha.slice(0, 12)}`);

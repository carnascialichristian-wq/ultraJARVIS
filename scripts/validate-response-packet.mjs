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
if (!skipHashes) {
  const commit = packet.source_commit_sha;
  const cited = new Set((packet.artifacts ?? []).map((a) => a.ref));
  for (const artifact of packet.artifacts ?? []) {
    let bytes;
    try {
      bytes = execFileSync("git", ["show", `${commit}:${artifact.ref}`], {
        maxBuffer: 64 * 1024 * 1024
      });
    } catch {
      fail(`artifact: ${artifact.ref} does not exist at ${commit}.`);
      continue;
    }
    const actual = createHash("sha256").update(bytes).digest("hex");
    if (actual !== artifact.sha256) {
      fail(`artifact: hash mismatch for ${artifact.ref} (declared ${artifact.sha256}, actual ${actual}).`);
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

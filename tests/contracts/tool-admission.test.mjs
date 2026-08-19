/**
 * ultraJARVIS — executable proof for tool admission and the two P0 mitigations.
 *
 * Task: UJ-MCP-001 (CLAUDE). Rationale: docs/architecture/TOOL_PLANE.md
 *
 * Run: pnpm --filter @ultrajarvis/contracts build && node --test tests/contracts/tool-admission.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  admitTool,
  verifyEventEmitter,
  verifyToolCall,
  isToolEvent,
  TOOL_EVENT_TYPES,
} from "../../packages/contracts/dist/tools/index.js";

/** A tool that passes admission cleanly, so each test isolates one rule. */
const goodTool = {
  toolId: "repo.read",
  name: "Repository reader",
  version: "1.0.0",
  manifestHash: "hash-abc",
  inputSchema: {},
  outputSchema: {},
  classification: "READ",
  sideEffect: "NONE",
  maxDataClass: "C1",
  scopes: ["repo:read"],
  resources: ["github://carnascialichristian-wq/ultraJARVIS"],
  secretsNeeded: [],
  network: { allowedDestinations: ["api.github.com"], egressDenyByDefault: true },
  sandbox: { isolation: "CONTAINER", filesystemAccess: "NONE", allowedPaths: [] },
  idempotency: { idempotent: true, supportsLookupByKey: true },
  compensation: { supported: false, description: "read-only", dryRunSupported: false },
  quota: { maxCallsPerRun: 50, maxCallsPerWindow: 500, windowMs: 3_600_000 },
  reliability: { timeoutMs: 30_000, maxRetries: 2, circuitBreakerThreshold: 5, healthProbe: null },
  provenance: {
    owner: "ultraJARVIS",
    sourceRepository: null,
    license: "proprietary",
    licenseVerified: true,
    advisoriesChecked: true,
    securityReviewDate: "2026-08-17T00:00:00Z",
    reviewedBy: "CLAUDE",
    documentationUrl: "https://docs.github.com/rest",
    documentationReadAt: "2026-08-17T00:00:00Z",
  },
  approvalGate: "AUDIT",
  auditEvents: ["repo.read.performed"],
  deprecation: { deprecated: false, fallbackToolId: null },
  incrementalCost: "ZERO",
  requiresLocalHeavyCompute: false,
  usesConsumerUiSession: false,
};

const goodEvidence = {
  alternativesConsidered: "checked the existing artifact store; no equivalent read path exists",
  testedWithFakeCredentials: true,
  testedWithC0DataOnly: true,
  failureModesTested: true,
  approvedByOwner: true,
  threatModelRef: "docs/threat-models/THREAT_MODEL.md",
};

const failed = (d) => (d.admitted ? [] : d.failures.map((f) => f.rule));

// --- baseline -------------------------------------------------------------

test("a well-formed read tool is admitted", () => {
  const d = admitTool(goodTool, goodEvidence);
  assert.equal(d.admitted, true);
});

// =========================================================================
// P0-1 — only the tool runtime may attest tool execution (closes TH-10)
// =========================================================================

test("P0-1: an agent may not emit tool.called", () => {
  const v = verifyEventEmitter("tool.called", "AGENT");
  assert.equal(v.accepted, false);
  assert.equal(v.rule, "P0-1");
});

test("P0-1: not even the supervisor may attest tool execution", () => {
  for (const type of TOOL_EVENT_TYPES) {
    assert.equal(verifyEventEmitter(type, "SUPERVISOR").accepted, false, `${type} via SUPERVISOR`);
    assert.equal(verifyEventEmitter(type, "OWNER").accepted, false, `${type} via OWNER`);
    assert.equal(verifyEventEmitter(type, "CONTROL_PLANE").accepted, false, `${type} via CONTROL_PLANE`);
  }
});

test("P0-1: the tool runtime may emit all three tool events", () => {
  for (const type of TOOL_EVENT_TYPES) {
    assert.equal(verifyEventEmitter(type, "TOOL_RUNTIME").accepted, true, type);
  }
});

test("P0-1: non-tool events are unaffected by the restriction", () => {
  assert.equal(verifyEventEmitter("agent.produced", "AGENT").accepted, true);
  assert.equal(verifyEventEmitter("run.planned", "SUPERVISOR").accepted, true);
});

test("P0-1: the tool event set is exactly the three attestation events", () => {
  assert.deepEqual([...TOOL_EVENT_TYPES], ["tool.called", "tool.returned", "tool.failed"]);
  assert.equal(isToolEvent("tool.returned"), true);
  assert.equal(isToolEvent("checkpoint.written"), false);
});

test("ADM-14: a tool declaring it emits its own attestation is rejected", () => {
  const d = admitTool({ ...goodTool, auditEvents: ["tool.returned"] }, goodEvidence);
  assert.equal(d.admitted, false);
  assert.ok(failed(d).includes("ADM-14"));
});

// =========================================================================
// P0-2 — external writes need lookup by idempotency key (closes R-RUN-03)
// =========================================================================

const writeTool = {
  ...goodTool,
  toolId: "repo.write",
  classification: "WRITE",
  sideEffect: "EXTERNAL_WRITE",
  approvalGate: "APPROVAL",
};

test("P0-2: a writing tool without lookup by key is rejected", () => {
  const d = admitTool(
    { ...writeTool, idempotency: { idempotent: true, supportsLookupByKey: false } },
    goodEvidence,
  );
  assert.equal(d.admitted, false);
  assert.ok(failed(d).includes("ADM-13"));
});

test("P0-2: the same tool with lookup support is admitted", () => {
  const d = admitTool(writeTool, goodEvidence);
  assert.equal(d.admitted, true);
});

test("P0-2: a read-only tool is not required to support lookup", () => {
  const d = admitTool(
    { ...goodTool, idempotency: { idempotent: true, supportsLookupByKey: false } },
    goodEvidence,
  );
  assert.equal(d.admitted, true);
});

// --- the twelve admission steps of §12.3 ---------------------------------

test("ADM-01: no record of alternatives considered blocks admission", () => {
  const d = admitTool(goodTool, { ...goodEvidence, alternativesConsidered: "  " });
  assert.ok(failed(d).includes("ADM-01"));
});

test("ADM-02: documentation must be recorded as actually read", () => {
  const d = admitTool(
    { ...goodTool, provenance: { ...goodTool.provenance, documentationReadAt: null } },
    goodEvidence,
  );
  assert.ok(failed(d).includes("ADM-02"));
});

test("ADM-03: a READ classification that declares side effects is inconsistent", () => {
  const d = admitTool({ ...goodTool, sideEffect: "EXTERNAL_WRITE" }, goodEvidence);
  assert.ok(failed(d).includes("ADM-03"));
});

test("ADM-04: unverified licence or unchecked advisories block admission", () => {
  const a = admitTool(
    { ...goodTool, provenance: { ...goodTool.provenance, licenseVerified: false } },
    goodEvidence,
  );
  assert.ok(failed(a).includes("ADM-04"));
  const b = admitTool(
    { ...goodTool, provenance: { ...goodTool.provenance, advisoriesChecked: false } },
    goodEvidence,
  );
  assert.ok(failed(b).includes("ADM-04"));
});

test("ADM-05: a wildcard egress destination is not admissible", () => {
  const d = admitTool(
    { ...goodTool, network: { allowedDestinations: ["*"], egressDenyByDefault: true } },
    goodEvidence,
  );
  assert.equal(d.admitted, false);
  assert.ok(failed(d).includes("ADM-05"));
});

test("ADM-06: a writing tool without a threat model is rejected", () => {
  const d = admitTool(writeTool, { ...goodEvidence, threatModelRef: null });
  assert.ok(failed(d).includes("ADM-06"));
});

test("ADM-07: admission requires testing with fake credentials on C0 data", () => {
  const d = admitTool(goodTool, { ...goodEvidence, testedWithFakeCredentials: false });
  assert.ok(failed(d).includes("ADM-07"));
});

test("ADM-08: filesystem access without a path allowlist is rejected", () => {
  const d = admitTool(
    {
      ...goodTool,
      sandbox: { isolation: "CONTAINER", filesystemAccess: "READ_WRITE_SCOPED", allowedPaths: [] },
    },
    goodEvidence,
  );
  assert.ok(failed(d).includes("ADM-08"));
});

test("ADM-09: untested failure modes block admission", () => {
  const d = admitTool(goodTool, { ...goodEvidence, failureModesTested: false });
  assert.ok(failed(d).includes("ADM-09"));
});

test("ADM-10: no owner approval, no admission", () => {
  const d = admitTool(goodTool, { ...goodEvidence, approvedByOwner: false });
  assert.ok(failed(d).includes("ADM-10"));
});

test("ADM-12: a missing reviewer or review date blocks admission", () => {
  const d = admitTool(
    { ...goodTool, provenance: { ...goodTool.provenance, reviewedBy: null } },
    goodEvidence,
  );
  assert.ok(failed(d).includes("ADM-12"));
});

// --- constitutional hard limits ------------------------------------------

test("ADM-15: a tool with incremental cost is rejected (Article 5)", () => {
  const d = admitTool({ ...goodTool, incrementalCost: "PER_CALL" }, goodEvidence);
  assert.equal(d.admitted, false);
  assert.ok(failed(d).includes("ADM-15"));
});

test("ADM-16: heavy local compute and consumer UI automation are rejected", () => {
  const a = admitTool({ ...goodTool, requiresLocalHeavyCompute: true }, goodEvidence);
  assert.ok(failed(a).includes("ADM-16"));
  const b = admitTool({ ...goodTool, usesConsumerUiSession: true }, goodEvidence);
  assert.ok(failed(b).includes("ADM-16"));
});

// --- destructive tools ----------------------------------------------------

test("ADM-17: a destructive tool needs dry-run, compensation and an approval gate", () => {
  const d = admitTool(
    {
      ...goodTool,
      classification: "DESTRUCTIVE",
      sideEffect: "DESTRUCTIVE",
      approvalGate: "AUDIT",
      compensation: { supported: false, description: "", dryRunSupported: false },
      idempotency: { idempotent: false, supportsLookupByKey: true },
    },
    goodEvidence,
  );
  assert.equal(d.admitted, false);
  const rules = failed(d);
  assert.ok(rules.includes("ADM-17"));
  assert.equal(rules.filter((r) => r === "ADM-17").length, 3, "all three ADM-17 conditions reported");
});

test("a fully specified destructive tool is admitted", () => {
  const d = admitTool(
    {
      ...goodTool,
      classification: "DESTRUCTIVE",
      sideEffect: "DESTRUCTIVE",
      approvalGate: "APPROVAL",
      compensation: { supported: true, description: "restore from snapshot", dryRunSupported: true },
      idempotency: { idempotent: false, supportsLookupByKey: true },
    },
    goodEvidence,
  );
  assert.equal(d.admitted, true);
});

// --- warnings do not block, but are recorded ------------------------------

test("ADM-18: a remote tool without isolation warns rather than blocks", () => {
  const d = admitTool(
    { ...goodTool, sandbox: { isolation: "NONE", filesystemAccess: "NONE", allowedPaths: [] } },
    goodEvidence,
  );
  assert.equal(d.admitted, true);
  assert.ok(d.warnings.some((w) => w.rule === "ADM-18"));
});

// --- all failures reported ------------------------------------------------

test("a hopeless tool reports every failure, not just the first", () => {
  const d = admitTool(
    {
      ...goodTool,
      classification: "READ",
      sideEffect: "DESTRUCTIVE",
      network: { allowedDestinations: ["*"], egressDenyByDefault: true },
      idempotency: { idempotent: false, supportsLookupByKey: false },
      auditEvents: ["tool.called"],
      incrementalCost: "PER_CALL",
      requiresLocalHeavyCompute: true,
      // ADM-11: no version and no manifest hash means the grant cannot be pinned,
      // so a later call can never prove it is invoking the tool that was admitted.
      // This rule was implemented and never exercised until the coverage audit of
      // 2026-08-19 counted 18 rules in the code against 17 in the tests.
      version: "",
      manifestHash: "",
      provenance: { ...goodTool.provenance, licenseVerified: false, reviewedBy: null },
    },
    { ...goodEvidence, approvedByOwner: false, alternativesConsidered: "" },
  );
  assert.equal(d.admitted, false);
  const rules = new Set(failed(d));
  for (const expected of [
    "ADM-01", "ADM-03", "ADM-04", "ADM-05", "ADM-10", "ADM-11",
    "ADM-12", "ADM-13", "ADM-14", "ADM-15", "ADM-16", "ADM-17",
  ]) {
    assert.ok(rules.has(expected), `expected ${expected} to be reported`);
  }
});

// --- per-call pin verification (TH-02) ------------------------------------

test("TH-02: a changed manifest hash invalidates the admitted pin", () => {
  const v = verifyToolCall("hash-abc", "hash-changed", "1.0.0", "1.0.0");
  assert.equal(v.allowed, false);
});

test("TH-02: a changed version invalidates the admitted pin", () => {
  const v = verifyToolCall("hash-abc", "hash-abc", "1.0.0", "1.1.0");
  assert.equal(v.allowed, false);
});

test("an unchanged pin allows the call", () => {
  assert.equal(verifyToolCall("hash-abc", "hash-abc", "1.0.0", "1.0.0").allowed, true);
});

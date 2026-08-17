/**
 * ultraJARVIS — executable proof for the approval policy.
 *
 * Task: UJ-SEC-001 (CLAUDE). Rationale: docs/constitution/APPROVAL_POLICY.md
 *
 * Every override rule OV-1..OV-10 gets a test that deliberately violates it and
 * asserts the policy refuses. A rule that cannot be falsified is not a rule.
 *
 * Run: pnpm --filter @ultrajarvis/contracts build && node --test tests/contracts/approval-policy.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateApproval,
  approvalValidity,
  strictestGate,
  ACTION_GATE,
  MIN_AUTONOMY_FOR_SIDE_EFFECT,
} from "../../packages/contracts/dist/policy/index.js";

/** A deliberately permissive baseline, so each test isolates one rule. */
const base = {
  runId: "run-1",
  taskId: "UJ-SEC-001",
  action: "WRITE_WORKING_BRANCH",
  sideEffect: "INTERNAL_WRITE",
  dataClass: "C1",
  agentMaxSideEffect: "EXTERNAL_WRITE",
  agentMaxDataClass: "C2",
  agentAutonomy: "L3",
  agentRoleStatus: "APPROVED",
  providerMode: "AUTO_VERIFIED",
  killSwitchEngaged: false,
  mayIncurCost: false,
  requiresLocalHeavyCompute: false,
  usesConsumerUiSession: false,
  isDedicatedHighClassWorkflow: false,
  rollbackPlan: null,
};

const rules = (d) => d.reasons.map((r) => r.rule);

// --- baseline -------------------------------------------------------------

test("the permissive baseline is allowed with audit", () => {
  const d = evaluateApproval(base);
  assert.equal(d.gate, "ALLOW_WITH_AUDIT");
});

test("gate ordering: the most restrictive wins", () => {
  assert.equal(strictestGate("ALLOW", "DENY"), "DENY");
  assert.equal(strictestGate("REQUIRE_APPROVAL", "ALLOW_WITH_AUDIT"), "REQUIRE_APPROVAL");
  assert.equal(strictestGate("DENY", "REQUIRE_HUMAN_BRIDGE"), "DENY");
});

// --- the overrides, one test each -----------------------------------------

test("OV-1: anything that may incur cost is denied (Article 5)", () => {
  const d = evaluateApproval({ ...base, mayIncurCost: true });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("OV-1"));
});

test("OV-2: heavy local compute is denied", () => {
  const d = evaluateApproval({ ...base, requiresLocalHeavyCompute: true });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("OV-2"));
});

test("OV-3: consumer UI automation is denied", () => {
  const d = evaluateApproval({ ...base, usesConsumerUiSession: true });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("OV-3"));
});

test("OV-4: C3 outside a dedicated workflow is denied", () => {
  const d = evaluateApproval({ ...base, dataClass: "C3", agentMaxDataClass: "C4" });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("OV-4"));
});

test("OV-4: C3 inside a dedicated workflow is not denied by OV-4", () => {
  const d = evaluateApproval({
    ...base,
    dataClass: "C3",
    agentMaxDataClass: "C4",
    isDedicatedHighClassWorkflow: true,
  });
  assert.ok(!rules(d).includes("OV-4"));
});

test("OV-5: a CANDIDATE role may not perform side effects", () => {
  const d = evaluateApproval({ ...base, agentRoleStatus: "CANDIDATE" });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("OV-5"));
});

test("OV-5: a CANDIDATE role may still act with no side effect", () => {
  const d = evaluateApproval({
    ...base,
    agentRoleStatus: "CANDIDATE",
    action: "READ_PUBLIC_SOURCE",
    sideEffect: "NONE",
  });
  assert.equal(d.gate, "ALLOW");
});

test("OV-6: the kill switch denies everything, with no exception", () => {
  const d = evaluateApproval({ ...base, killSwitchEngaged: true, action: "READ_PUBLIC_SOURCE", sideEffect: "NONE" });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("OV-6"));
});

test("OV-7: a destructive action without a rollback plan is not approvable", () => {
  const d = evaluateApproval({
    ...base,
    action: "DELETE",
    sideEffect: "DESTRUCTIVE",
    agentMaxSideEffect: "DESTRUCTIVE",
  });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("OV-7"));
});

test("OV-7: with a rollback plan it becomes an approval request, never an allow", () => {
  const d = evaluateApproval({
    ...base,
    action: "DELETE",
    sideEffect: "DESTRUCTIVE",
    agentMaxSideEffect: "DESTRUCTIVE",
    rollbackPlan: "restore from checkpoint 42 and re-run the migration",
  });
  assert.equal(d.gate, "REQUIRE_APPROVAL");
  assert.ok(!rules(d).includes("OV-7"));
});

test("OV-8: a side effect above the agent ceiling is denied (Article 8)", () => {
  const d = evaluateApproval({
    ...base,
    sideEffect: "EXTERNAL_WRITE",
    agentMaxSideEffect: "INTERNAL_WRITE",
  });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("OV-8"));
});

test("OV-9: a data class above the agent ceiling is denied (Article 8)", () => {
  const d = evaluateApproval({ ...base, dataClass: "C2", agentMaxDataClass: "C1" });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("OV-9"));
});

test("OV-10: a non-verified provider path falls back to a human bridge", () => {
  const d = evaluateApproval({ ...base, providerMode: "HUMAN_BRIDGE" });
  assert.equal(d.gate, "REQUIRE_HUMAN_BRIDGE");
  assert.ok(rules(d).includes("OV-10"));
});

test("OV-10: paid-only and local-compute modes are denied, not bridged", () => {
  for (const mode of ["PAID_ONLY_DISABLED", "LOCAL_COMPUTE_DISABLED"]) {
    const d = evaluateApproval({ ...base, providerMode: mode });
    assert.equal(d.gate, "DENY", `${mode} must be denied`);
    assert.ok(rules(d).includes("OV-10"));
  }
});

// --- autonomy floor -------------------------------------------------------

test("an internal write requires at least L2", () => {
  const d = evaluateApproval({ ...base, agentAutonomy: "L1" });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("AUTONOMY"));
});

test("an external write requires at least L3", () => {
  const d = evaluateApproval({
    ...base,
    action: "PUBLISH_PRODUCTION",
    sideEffect: "EXTERNAL_WRITE",
    agentAutonomy: "L2",
  });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("AUTONOMY"));
});

test("the autonomy floor table matches the policy document", () => {
  assert.equal(MIN_AUTONOMY_FOR_SIDE_EFFECT.NONE, "L0");
  assert.equal(MIN_AUTONOMY_FOR_SIDE_EFFECT.INTERNAL_WRITE, "L2");
  assert.equal(MIN_AUTONOMY_FOR_SIDE_EFFECT.EXTERNAL_WRITE, "L3");
  assert.equal(MIN_AUTONOMY_FOR_SIDE_EFFECT.DESTRUCTIVE, "L3");
});

// --- non-negotiable denials ----------------------------------------------

test("the non-negotiable actions are denied at the matrix level", () => {
  assert.equal(ACTION_GATE.ENABLE_BILLING, "DENY");
  assert.equal(ACTION_GATE.AUTOMATE_CONSUMER_UI, "DENY");
  assert.equal(ACTION_GATE.ROTATE_CREDENTIALS_FOR_QUOTA, "DENY");
  assert.equal(ACTION_GATE.WRITE_DEFAULT_BRANCH, "DENY");
});

test("enabling billing stays denied even for a maximally privileged agent", () => {
  const d = evaluateApproval({
    ...base,
    action: "ENABLE_BILLING",
    sideEffect: "EXTERNAL_WRITE",
    agentMaxSideEffect: "DESTRUCTIVE",
    agentMaxDataClass: "C4",
    agentAutonomy: "L4",
    rollbackPlan: "cancel the subscription",
  });
  assert.equal(d.gate, "DENY");
});

test("an unknown action kind is denied, not guessed", () => {
  const d = evaluateApproval({ ...base, action: "SOMETHING_INVENTED" });
  assert.equal(d.gate, "DENY");
  assert.ok(rules(d).includes("UNKNOWN_ACTION"));
});

// --- all violated rules are reported --------------------------------------

test("a request violating several rules reports all of them", () => {
  const d = evaluateApproval({
    ...base,
    action: "DELETE",
    sideEffect: "DESTRUCTIVE",
    dataClass: "C4",
    agentMaxSideEffect: "NONE",
    agentMaxDataClass: "C0",
    agentAutonomy: "L0",
    agentRoleStatus: "CANDIDATE",
    mayIncurCost: true,
    killSwitchEngaged: true,
  });
  assert.equal(d.gate, "DENY");
  const found = new Set(rules(d));
  for (const expected of ["OV-1", "OV-4", "OV-5", "OV-6", "OV-7", "OV-8", "OV-9", "AUTONOMY"]) {
    assert.ok(found.has(expected), `expected ${expected} to be reported`);
  }
});

// --- validity of a granted approval ---------------------------------------

const scope = {
  runId: "run-1",
  taskId: "UJ-SEC-001",
  operation: "repo.write",
  idempotencyKey: "key-abc",
};
const granted = { scope, signedByOwner: true, expiresAt: "2026-08-17T12:00:00Z" };
const now = "2026-08-17T11:00:00Z";

test("a correctly scoped, signed, unexpired approval is valid", () => {
  assert.equal(approvalValidity(granted, scope, now), "VALID");
});

test("an unsigned approval is rejected", () => {
  assert.equal(approvalValidity({ ...granted, signedByOwner: false }, scope, now), "NOT_SIGNED");
});

test("an expired approval is rejected: approval is never permanent delegation", () => {
  assert.equal(approvalValidity(granted, scope, "2026-08-17T13:00:00Z"), "EXPIRED");
});

test("an approval granted for another task does not carry over", () => {
  assert.equal(
    approvalValidity(granted, { ...scope, taskId: "UJ-RUN-001" }, now),
    "SCOPE_MISMATCH",
  );
});

test("KEY PROPERTY: approving payload A does not authorise payload B", () => {
  // Same run, same task, same operation name — only the payload differs.
  assert.equal(
    approvalValidity(granted, { ...scope, idempotencyKey: "key-different" }, now),
    "PAYLOAD_MISMATCH",
  );
});

/**
 * ultraJARVIS — executable proof for the pure DepthGuard / runtime invariants.
 *
 * Task: UJ-RUN-001 (CLAUDE). Blueprint §13.3.
 *
 * Scope note, deliberately narrow: these tests cover the invariant functions that
 * are pure and already implemented in packages/contracts. They do NOT cover the
 * runtime-level tests (crash injection, concurrent spawn, supervisor liveness,
 * checkpoint corruption), because no runtime exists yet — those remain specified
 * and pending for M2/M3 under UJ-RCV-001. Claiming them here would be false progress.
 *
 * Run:  pnpm --filter @ultrajarvis/contracts build && node --test tests/contracts/
 */

import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";

import {
  checkSpawn,
  jaccardSimilarity,
  hasToolCycle,
  mayRetry,
  isKillReachable,
  nextState,
  verifyLedgerChain,
  buildIdempotencyKey,
  DEPTH_GUARD_LIMITS,
  dataClassWithin,
  autonomyWithin,
  sideEffectWithin,
} from "../../packages/contracts/dist/runtime/index.js";

const sha256Hex = (input) => createHash("sha256").update(input).digest("hex");

const budget = {
  maxProviderCalls: 10,
  maxToolCalls: 10,
  maxWallClockMs: 60_000,
  recoveryReserveCalls: 2,
};

const parentLimits = {
  toolAllowlist: [
    { toolId: "repo.read", version: "1.0.0", manifestHash: "h1", maxSideEffect: "NONE" },
    { toolId: "repo.write", version: "1.0.0", manifestHash: "h2", maxSideEffect: "INTERNAL_WRITE" },
  ],
  maxDataClass: "C2",
  maxAutonomy: "L3",
  maxSideEffect: "EXTERNAL_WRITE",
  quotaBudget: budget,
  deadline: "2026-08-17T12:00:00Z",
};

const narrowerChild = {
  toolAllowlist: [
    { toolId: "repo.read", version: "1.0.0", manifestHash: "h1", maxSideEffect: "NONE" },
  ],
  maxDataClass: "C1",
  maxAutonomy: "L2",
  maxSideEffect: "INTERNAL_WRITE",
  quotaBudget: { ...budget, maxProviderCalls: 5 },
  deadline: "2026-08-17T11:00:00Z",
};

const okSpawn = {
  parentDepth: 1,
  childDepth: 2,
  parentChildCount: 0,
  activeAtomicTasks: 3,
  parentLimits,
  childLimits: narrowerChild,
};

const violationIds = (decision) =>
  decision.admitted ? [] : decision.violations.map((v) => v.invariant);

// --- baseline -------------------------------------------------------------

test("a properly narrowed child is admitted", () => {
  assert.equal(checkSpawn(okSpawn).admitted, true);
});

// --- T-DG-1 / T-DG-3: depth ----------------------------------------------

test("T-DG-1: depth beyond the ceiling is rejected", () => {
  const d = checkSpawn({ ...okSpawn, parentDepth: 3, childDepth: 4 });
  assert.equal(d.admitted, false);
  assert.ok(violationIds(d).includes("INV-D1"));
});

test("T-DG-3: an agent at max depth may not spawn children", () => {
  const d = checkSpawn({ ...okSpawn, parentDepth: 3, childDepth: 4 });
  assert.ok(violationIds(d).includes("INV-D2"));
});

test("depth must increment by exactly one", () => {
  const d = checkSpawn({ ...okSpawn, parentDepth: 0, childDepth: 2 });
  assert.ok(violationIds(d).includes("INV-D5"));
});

// --- T-DG-2: fan-out ------------------------------------------------------

test("T-DG-2: the sixth child of one agent is rejected", () => {
  const d = checkSpawn({ ...okSpawn, parentChildCount: DEPTH_GUARD_LIMITS.maxFanOutPerAgent });
  assert.equal(d.admitted, false);
  assert.ok(violationIds(d).includes("INV-D3"));
});

test("the fifth child is still admitted", () => {
  const d = checkSpawn({ ...okSpawn, parentChildCount: 4 });
  assert.equal(d.admitted, true);
});

// --- T-DG-4: active task ceiling (the binding constraint) -----------------

test("T-DG-4: the twenty-sixth active atomic task is rejected", () => {
  const d = checkSpawn({
    ...okSpawn,
    activeAtomicTasks: DEPTH_GUARD_LIMITS.maxActiveAtomicTasksPerRun,
  });
  assert.equal(d.admitted, false);
  assert.ok(violationIds(d).includes("INV-D4"));
});

test("DG-3 binds before DG-1: the active cap trips at a legal depth", () => {
  const d = checkSpawn({ ...okSpawn, parentDepth: 1, childDepth: 2, activeAtomicTasks: 25 });
  assert.equal(d.admitted, false);
  assert.deepEqual(violationIds(d), ["INV-D4"]);
});

// --- T-TA-1 / T-TA-2: allowlist and ceilings ------------------------------

test("T-TA-1: a tool the parent does not hold is rejected", () => {
  const d = checkSpawn({
    ...okSpawn,
    childLimits: {
      ...narrowerChild,
      toolAllowlist: [
        { toolId: "shell.exec", version: "1.0.0", manifestHash: "hX", maxSideEffect: "DESTRUCTIVE" },
      ],
    },
  });
  assert.equal(d.admitted, false);
  assert.ok(violationIds(d).includes("TA-2"));
});

test("TA-3/TA-10: a version bump is not a near-match, it is an escalation", () => {
  const d = checkSpawn({
    ...okSpawn,
    childLimits: {
      ...narrowerChild,
      toolAllowlist: [
        { toolId: "repo.read", version: "2.0.0", manifestHash: "h1", maxSideEffect: "NONE" },
      ],
    },
  });
  assert.equal(d.admitted, false);
  assert.ok(violationIds(d).includes("TA-2"));
});

test("T-TA-2: a higher data class than the parent is rejected", () => {
  const d = checkSpawn({
    ...okSpawn,
    childLimits: { ...narrowerChild, maxDataClass: "C4" },
  });
  assert.ok(violationIds(d).includes("TA-4"));
});

test("autonomy and side-effect ceilings are enforced", () => {
  const d = checkSpawn({
    ...okSpawn,
    childLimits: { ...narrowerChild, maxAutonomy: "L4", maxSideEffect: "DESTRUCTIVE" },
  });
  assert.ok(violationIds(d).includes("TA-5"));
  assert.ok(violationIds(d).includes("TA-8"));
});

// --- T-DG-9: deadline monotonicity ---------------------------------------

test("T-DG-9: a child deadline later than the parent's is rejected", () => {
  const d = checkSpawn({
    ...okSpawn,
    childLimits: { ...narrowerChild, deadline: "2026-08-17T23:00:00Z" },
  });
  assert.ok(violationIds(d).includes("INV-D9"));
});

test("a child may not reserve more provider calls than the parent has", () => {
  const d = checkSpawn({
    ...okSpawn,
    childLimits: { ...narrowerChild, quotaBudget: { ...budget, maxProviderCalls: 99 } },
  });
  assert.ok(violationIds(d).includes("INV-D10"));
});

// --- all violations are reported, not just the first ----------------------

test("rejection reports every violated invariant, not only the first", () => {
  const d = checkSpawn({
    parentDepth: 3,
    childDepth: 9,
    parentChildCount: 7,
    activeAtomicTasks: 40,
    parentLimits,
    childLimits: {
      toolAllowlist: [
        { toolId: "shell.exec", version: "1.0.0", manifestHash: "hX", maxSideEffect: "DESTRUCTIVE" },
      ],
      maxDataClass: "C4",
      maxAutonomy: "L4",
      maxSideEffect: "DESTRUCTIVE",
      quotaBudget: { ...budget, maxProviderCalls: 99 },
      deadline: "2027-01-01T00:00:00Z",
    },
  });
  assert.equal(d.admitted, false);
  const ids = new Set(violationIds(d));
  for (const expected of [
    "INV-D1", "INV-D2", "INV-D3", "INV-D4", "INV-D5",
    "INV-D9", "INV-D10", "TA-2", "TA-4", "TA-5", "TA-8",
  ]) {
    assert.ok(ids.has(expected), `expected violation ${expected} to be reported`);
  }
});

// --- ceiling helpers ------------------------------------------------------

test("ceiling comparisons are ordered correctly", () => {
  assert.equal(dataClassWithin("C1", "C2"), true);
  assert.equal(dataClassWithin("C3", "C2"), false);
  assert.equal(autonomyWithin("L2", "L2"), true);
  assert.equal(autonomyWithin("L4", "L3"), false);
  assert.equal(sideEffectWithin("NONE", "DESTRUCTIVE"), true);
  assert.equal(sideEffectWithin("EXTERNAL_WRITE", "INTERNAL_WRITE"), false);
});

// --- T-LP-1 / T-LP-2: loop detection -------------------------------------

test("T-LP-2: identical output is detected as stagnation", () => {
  const a = ["build", "the", "runtime", "blueprint"];
  assert.equal(jaccardSimilarity(a, [...a]), 1);
});

/**
 * KNOWN LIMITATION, measured rather than assumed (blueprint §6.4, review question 4).
 *
 * A single cosmetic token change defeats the 0.95 similarity threshold:
 *   9-token mission,  1 token changed -> 0.7778
 *   23-token mission, 1 token changed -> 0.9130
 *
 * So the text-similarity signal alone does NOT contain an adversarial or merely
 * sloppy agent that varies its wording. This test pins the real numbers so the
 * weakness cannot be quietly tuned away, and the compensating controls
 * (TOOL_CYCLE, the active-task cap, the quota budget) are what actually bound it.
 */
test("MEASURED: one cosmetic token defeats the similarity threshold", () => {
  const short = jaccardSimilarity(
    "produce the runtime blueprint for the agent supervisor now".split(" "),
    "produce the runtime blueprint for the agent supervisor today".split(" "),
  );
  assert.ok(short < 0.95, `short mission similarity ${short} should evade the 0.95 threshold`);
  assert.ok(short > 0.7, "but it is still visibly related work");

  const long = jaccardSimilarity(
    "analyse the supervisor state machine and produce a complete runtime blueprint covering agent manifest team spec depth guard and run ledger semantics now".split(" "),
    "analyse the supervisor state machine and produce a complete runtime blueprint covering agent manifest team spec depth guard and run ledger semantics today".split(" "),
  );
  assert.ok(long < 0.95, `long mission similarity ${long} still evades the threshold`);
});

test("the structural signal is the one that holds: tool cycles ignore wording", () => {
  // Same behaviour, different mission wording each round — TOOL_CYCLE still fires,
  // because it depends on what the agent DID, not on what it called the work.
  const sequence = ["read", "plan", "write", "read", "plan", "write", "read", "plan", "write"];
  assert.equal(hasToolCycle(sequence), true);
});

test("genuinely different work is not flagged", () => {
  const a = "produce the runtime blueprint".split(" ");
  const b = "verify google workspace quota sources".split(" ");
  assert.ok(jaccardSimilarity(a, b) < 0.2);
});

test("T-LP-1: a repeated tool k-gram is detected as a cycle", () => {
  const looping = ["read", "plan", "write", "read", "plan", "write", "read", "plan", "write"];
  assert.equal(hasToolCycle(looping), true);
});

test("a healthy tool sequence is not flagged", () => {
  assert.equal(hasToolCycle(["read", "plan", "write", "test", "review", "commit"]), false);
});

// --- retry policy ---------------------------------------------------------

test("no aggressive retry on rate limit, and none at all on quota exhaustion", () => {
  assert.equal(mayRetry("RATE_LIMIT", 1, true), false);
  assert.equal(mayRetry("QUOTA_EXHAUSTED", 0, true), false);
});

test("a denied policy is never retried", () => {
  assert.equal(mayRetry("POLICY_DENIED", 0, true), false);
});

test("a timeout is retried only when the operation is idempotent", () => {
  assert.equal(mayRetry("TIMEOUT", 0, true), true);
  assert.equal(mayRetry("TIMEOUT", 0, false), false);
});

test("an unknowable outcome is never retried automatically", () => {
  assert.equal(mayRetry("NON_IDEMPOTENT", 0, true), false);
});

// --- kill switch ----------------------------------------------------------

test("T-KS-1: the kill switch reaches HALTED from every non-terminal state", () => {
  const nonTerminal = [
    "INIT", "VALIDATING", "PLANNING", "DISPATCHING", "MONITORING",
    "COLLECTING", "MERGING", "AWAITING_APPROVAL", "AWAITING_BRIDGE",
    "COMPENSATING", "DISSOLVING",
  ];
  for (const state of nonTerminal) {
    assert.equal(isKillReachable(state), true, `${state} must be killable`);
    const moves = nextState(state, "KILL_SWITCH");
    assert.equal(moves.length, 1);
    assert.equal(moves[0].to, "HALTED");
    assert.deepEqual(moves[0].guards, [], "the kill switch must have no guard");
  }
});

test("the state machine denies by default: unlisted moves are not legal", () => {
  assert.equal(nextState("INIT", "EXIT_CRITERIA_MET").length, 0);
  assert.equal(nextState("CLOSED", "KILL_SWITCH").length, 0);
});

// --- T-LG-1: ledger tamper evidence --------------------------------------

const hashEvent = (e) =>
  sha256Hex(`${e.seq}|${e.type}|${e.at}|${e.prevHash ?? ""}|${JSON.stringify(e.payload ?? {})}`);

function buildChain(types) {
  const events = [];
  let prevHash = null;
  types.forEach((type, i) => {
    const base = {
      seq: i,
      runId: "run-1",
      type,
      at: "2026-08-17T07:00:00Z",
      prevHash,
      selfHash: "",
      actor: "SUPERVISOR",
    };
    base.selfHash = hashEvent(base);
    prevHash = base.selfHash;
    events.push(base);
  });
  return events;
}

test("T-LG-1: an intact chain verifies", () => {
  const chain = buildChain(["run.created", "run.planned", "agent.admitted", "run.completed"]);
  assert.equal(verifyLedgerChain(chain, hashEvent).intact, true);
});

test("T-LG-1: rewriting a past event is detected", () => {
  const chain = buildChain(["run.created", "run.planned", "agent.admitted", "run.completed"]);
  // Someone with write access edits event 1 after the fact.
  chain[1] = { ...chain[1], type: "agent.rejected" };
  const result = verifyLedgerChain(chain, hashEvent);
  assert.equal(result.intact, false);
  assert.equal(result.firstBrokenSeq, 1);
});

test("T-LG-1: re-hashing the edited event still breaks the following link", () => {
  const chain = buildChain(["run.created", "run.planned", "agent.admitted", "run.completed"]);
  const forged = { ...chain[1], type: "agent.rejected" };
  forged.selfHash = hashEvent(forged);
  chain[1] = forged;
  const result = verifyLedgerChain(chain, hashEvent);
  assert.equal(result.intact, false);
  assert.equal(result.firstBrokenSeq, 2, "the next event's prevHash no longer matches");
});

// --- idempotency ----------------------------------------------------------

test("the idempotency key is stable across attempts of the same logical work", () => {
  const parts = {
    runId: "run-1",
    taskId: "UJ-RUN-001",
    operationName: "repo.write",
    canonicalPayload: '{"path":"a.md"}',
    toolVersion: "1.0.0",
  };
  assert.equal(buildIdempotencyKey(parts, sha256Hex), buildIdempotencyKey(parts, sha256Hex));
});

test("the key encoding is injective: shifted field boundaries do not collide", () => {
  // With a plain separator these two hash identically, so two different operations
  // would share a key and the second would be silently dropped as a duplicate.
  const left = {
    runId: "a b",
    taskId: "c",
    operationName: "repo.write",
    canonicalPayload: "{}",
    toolVersion: "1.0.0",
  };
  const right = { ...left, runId: "a", taskId: "b c" };
  assert.notEqual(
    buildIdempotencyKey(left, sha256Hex),
    buildIdempotencyKey(right, sha256Hex),
  );
});

test("MEASURED: the tool-cycle key is injective, so a separator inside a tool name cannot forge a cycle", () => {
  // E6, second occurrence. hasToolCycle used to build its k-gram key by joining
  // the window on a NUL byte. ToolId is a branded string with no runtime
  // validation, so nothing stops that byte from appearing inside a tool name —
  // and then two DIFFERENT windows collapse onto the same key.
  //
  // Under the old NUL join this exact sequence reports a cycle that does not
  // exist: window 0 is ["a", "b\u0000c"] -> "a\0b\0c" and window 3 is
  // ["a\u0000b", "c"] -> "a\0b\0c". Same key, so the second occurrence trips
  // the repeat counter. It is a FALSE POSITIVE: no window actually repeats.
  const forged = ["a", "b\u0000c", "x", "a\u0000b", "c", "x"];
  assert.equal(hasToolCycle(forged, 2, 2), false);

  // The detector must still fire on a window that genuinely repeats, including
  // when the tool names contain the byte that used to be the separator.
  const genuine = ["a\u0000b", "c", "a\u0000b", "c"];
  assert.equal(hasToolCycle(genuine, 2, 2), true);
});

test("no runtime contract source carries a NUL byte (E6 pinned mechanically, not by comment)", async () => {
  // A NUL turns a source file BINARY for git and grep. depth-guard.ts carried one
  // for four sessions and was therefore silently absent from every text-based
  // audit of this repository — including the provider-neutrality scan that
  // finally surfaced it, which reported "binary file matches" instead of a line.
  // A comment saying "do not do this" does not stop it happening a third time.
  const dir = new URL("../../packages/contracts/src/runtime/", import.meta.url);
  const names = (await readdir(dir)).filter((n) => n.endsWith(".ts"));
  assert.ok(names.length > 0, "no runtime contract sources found");
  const offenders = [];
  for (const name of names) {
    const bytes = await readFile(new URL(name, dir));
    if (bytes.includes(0x00)) offenders.push(name);
  }
  assert.deepEqual(offenders, []);
});

test("different payloads produce different keys", () => {
  const base = {
    runId: "run-1",
    taskId: "UJ-RUN-001",
    operationName: "repo.write",
    canonicalPayload: '{"path":"a.md"}',
    toolVersion: "1.0.0",
  };
  assert.notEqual(
    buildIdempotencyKey(base, sha256Hex),
    buildIdempotencyKey({ ...base, canonicalPayload: '{"path":"b.md"}' }, sha256Hex),
  );
});

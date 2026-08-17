/**
 * ultraJARVIS — T-DG-4b and the recovery invariants.
 *
 * Task: UJ-RCV-001 (CLAUDE). Closes R-RUN-01, the last outstanding P0.
 *
 * The structure of this file matters: it proves the race EXISTS before proving
 * the fix works. A fix demonstrated against no failure demonstrates nothing.
 *
 * Run from the repository root:
 *   node --test tests/contracts/recovery.test.mjs
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  NaiveActiveTaskCounter,
  AtomicActiveTaskCounter,
  CasActiveTaskCounter,
} from "../../packages/contracts/dist/recovery/index.js";

const LIMIT = 25;
const tick = () => new Promise((resolve) => setImmediate(resolve));

// =========================================================================
// T-DG-4b — the race is real
// =========================================================================

test("T-DG-4b (a): the naive counter ADMITS TOO MANY under concurrent fan-out", async () => {
  // 20 tasks already active, 10 agents try to spawn at once. Only 5 may pass.
  const counter = new NaiveActiveTaskCounter(LIMIT, tick);
  for (let i = 0; i < 20; i += 1) await counter.reserve();
  assert.equal(counter.current(), 20);

  const results = await Promise.all(Array.from({ length: 10 }, () => counter.reserve()));
  const granted = results.filter((r) => r.granted).length;

  // The bug, asserted rather than described. Every racer read 20 before any of
  // them wrote, so all ten passed the `observed >= limit` check: 10 admitted
  // where only 5 slots remained. DG-3 is violated and no invariant check fails.
  assert.equal(granted, 10, "the naive counter grants all ten, five more than allowed");

  // And the damage compounds: because each racer wrote `observed + 1` from the
  // same stale read, nine of the ten increments are lost. The counter now reads
  // 21 while 30 tasks are really active — so the ceiling is not just breached,
  // it is breached invisibly, and every later reservation is judged on a lie.
  assert.equal(counter.current(), 21, "lost updates: the count no longer tracks reality");
});

test("T-DG-4b (b): the naive counter also LOSES reservations to lost updates", async () => {
  const counter = new NaiveActiveTaskCounter(LIMIT, tick);
  await Promise.all(Array.from({ length: 10 }, () => counter.reserve()));
  // Ten grants, but each wrote observed+1 from the same stale read of 0.
  assert.equal(counter.current(), 1, "ten reservations collapsed into one increment");
});

// =========================================================================
// T-DG-4b — the atomic counter is correct
// =========================================================================

test("T-DG-4b (c): the atomic counter grants EXACTLY the remaining slots", async () => {
  const counter = new AtomicActiveTaskCounter(LIMIT);
  for (let i = 0; i < 20; i += 1) await counter.reserve();

  const results = await Promise.all(Array.from({ length: 10 }, () => counter.reserve()));
  const granted = results.filter((r) => r.granted).length;

  assert.equal(granted, 5, "exactly five of ten concurrent spawns are admitted");
  assert.equal(counter.current(), LIMIT, "and the count lands exactly on the ceiling");
});

test("T-DG-4b (d): the atomic counter never exceeds the ceiling under heavy contention", async () => {
  const counter = new AtomicActiveTaskCounter(LIMIT);
  const results = await Promise.all(Array.from({ length: 200 }, () => counter.reserve()));
  assert.equal(results.filter((r) => r.granted).length, LIMIT);
  assert.equal(counter.current(), LIMIT);
});

test("release frees exactly one slot and never goes negative", async () => {
  const counter = new AtomicActiveTaskCounter(LIMIT);
  for (let i = 0; i < LIMIT; i += 1) await counter.reserve();
  assert.equal((await counter.reserve()).granted, false);

  await counter.release();
  assert.equal((await counter.reserve()).granted, true);

  const empty = new AtomicActiveTaskCounter(LIMIT);
  await empty.release();
  await empty.release();
  assert.equal(empty.current(), 0, "release below zero is clamped, not wrapped");
});

// =========================================================================
// Distributed counter: compare-and-swap
// =========================================================================

/** Models a database cell: reads are async, writes only land if the value matches. */
function makeStore(initial = 0) {
  let value = initial;
  return {
    get value() {
      return value;
    },
    async read() {
      await tick();
      return value;
    },
    async compareAndSwap(expected, next) {
      await tick();
      if (value !== expected) return false;
      value = next;
      return true;
    },
  };
}

test("CAS counter grants exactly the remaining slots against a racing store", async () => {
  const store = makeStore(20);
  const counter = new CasActiveTaskCounter(LIMIT, store);

  const results = await Promise.all(Array.from({ length: 10 }, () => counter.reserve()));
  assert.equal(results.filter((r) => r.granted).length, 5);
  assert.equal(store.value, LIMIT);
});

test("CAS counter refuses rather than admitting on an unverified count", async () => {
  // A store whose value always shifts under us: CAS can never land.
  const hostile = {
    async read() {
      await tick();
      return 0;
    },
    async compareAndSwap() {
      await tick();
      return false;
    },
  };
  const counter = new CasActiveTaskCounter(LIMIT, hostile, 3);
  const result = await counter.reserve();
  assert.equal(result.granted, false, "unsettled contention must refuse, never assume");
});

test("the CAS retry loop is bounded: contention becomes refusal, not livelock", async () => {
  let reads = 0;
  const hostile = {
    async read() {
      reads += 1;
      await tick();
      return 0;
    },
    async compareAndSwap() {
      await tick();
      return false;
    },
  };
  const counter = new CasActiveTaskCounter(LIMIT, hostile, 4);
  await counter.reserve();
  assert.equal(reads, 4, "attempts are capped at maxAttempts");
});

test("CAS counter never exceeds the ceiling with many concurrent reservers", async () => {
  const store = makeStore(0);
  const counter = new CasActiveTaskCounter(LIMIT, store, 64);
  const results = await Promise.all(Array.from({ length: 60 }, () => counter.reserve()));
  assert.ok(results.filter((r) => r.granted).length <= LIMIT);
  assert.ok(store.value <= LIMIT, `store value ${store.value} must never exceed ${LIMIT}`);
});

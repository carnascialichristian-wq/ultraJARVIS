// Test del contratto RTE (adapter-routing), sottosistema §18 del blueprint.
// FUORI da tests/contracts/ di proposito: e' una superficie separata, non parte dei
// 15 artefatti congelati di UJ-RUN-001, quindi non tocca il conteggio 140 di quella suite.
// Richiede build: npx tsc -p packages/contracts
import test from "node:test";
import assert from "node:assert/strict";
import {
  admitAdapterRegistration,
  resolveCostClass,
} from "../../packages/contracts/dist/routing/index.js";

const zeroLocal = { adapterId: "echo@1", costClass: "ZERO_LOCAL", endpointConstraint: "LOOPBACK_ONLY" };
const L4 = { runMaxAutonomy: "L4", strictZeroCard: false };
const L2 = { runMaxAutonomy: "L2", strictZeroCard: false };

test("RTE: un adapter ZERO_LOCAL loopback e' ammesso", () => {
  assert.equal(admitAdapterRegistration(zeroLocal, L4).admitted, true);
});

test("RTE-E01: un adapter METERED e' rifiutato sotto STRICT_ZERO_CARD", () => {
  const d = admitAdapterRegistration(
    { adapterId: "paid@1", costClass: "METERED", endpointConstraint: "NONE" },
    { runMaxAutonomy: "L4", strictZeroCard: true },
  );
  assert.equal(d.admitted, false);
  assert.ok(d.violations.some((v) => v.rule === "RTE-E01"));
});

test("RTE-E02: METERED e' irrappresentabile a L2 (rifiuto alla registrazione)", () => {
  const d = admitAdapterRegistration(
    { adapterId: "paid@1", costClass: "METERED", endpointConstraint: "NONE" },
    L2,
  );
  assert.equal(d.admitted, false);
  assert.ok(d.violations.some((v) => v.rule === "RTE-E02"));
});

test("RTE-E02: METERED a L3+ non e' rifiutato per autonomia", () => {
  const d = admitAdapterRegistration(
    { adapterId: "paid@1", costClass: "METERED", endpointConstraint: "NONE" },
    { runMaxAutonomy: "L3", strictZeroCard: false },
  );
  // non deve contenere RTE-E02 (puo' passare del tutto, non essendo sotto strict-zero)
  const hasE02 = !d.admitted && d.violations.some((v) => v.rule === "RTE-E02");
  assert.equal(hasE02, false);
});

test("RTE-E03: un ZERO_LOCAL senza LOOPBACK_ONLY contraddice la propria classe", () => {
  const d = admitAdapterRegistration(
    { adapterId: "echo@1", costClass: "ZERO_LOCAL", endpointConstraint: "NONE" },
    L4,
  );
  assert.equal(d.admitted, false);
  assert.ok(d.violations.some((v) => v.rule === "RTE-E03"));
});

test("RTE riporta TUTTE le infrazioni, non la prima (METERED + strict + L2)", () => {
  const d = admitAdapterRegistration(
    { adapterId: "paid@1", costClass: "METERED", endpointConstraint: "NONE" },
    { runMaxAutonomy: "L2", strictZeroCard: true },
  );
  assert.equal(d.admitted, false);
  const rules = d.violations.map((v) => v.rule).sort();
  assert.deepEqual(rules, ["RTE-E01", "RTE-E02"]);
});

test("il default della CostClass cade su ZERO_LOCAL, MAI su METERED (lezione S-17)", () => {
  assert.equal(resolveCostClass(undefined), "ZERO_LOCAL");
  assert.equal(resolveCostClass(""), "ZERO_LOCAL");
  assert.equal(resolveCostClass("openai"), "ZERO_LOCAL");
  assert.equal(resolveCostClass("METERED"), "METERED"); // esplicito resta esplicito
});

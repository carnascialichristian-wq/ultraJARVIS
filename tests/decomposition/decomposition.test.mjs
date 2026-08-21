// Test del contratto DEC (decomposition), sottosistema §16 del blueprint.
// FUORI da tests/contracts/: superficie separata, non tocca il conteggio 140.
// Richiede build: npx tsc -p packages/contracts
import test from "node:test";
import assert from "node:assert/strict";
import {
  validateDecomposition,
  isCriterionFalsifiable,
} from "../../packages/contracts/dist/decomposition/index.js";

const crit = (id, text) => ({ id, text });
const goodCrit = [crit("c1", "`out/hello.txt` contains `ok`, exit code 0")];
const ctx = { capabilityIndex: ["write", "verify"], ceilings: { maxDepth: 3, maxFanOut: 5 } };

const node = (o) => ({
  taskId: o.taskId, parentId: o.parentId ?? null, depth: o.depth ?? 0,
  weight: o.weight ?? 1, owner: o.owner ?? "CLAUDE", reviewer: o.reviewer ?? "GEMINI",
  requiredCapabilities: o.requiredCapabilities ?? ["write"],
  acceptanceCriteria: o.acceptanceCriteria ?? goodCrit,
  dependsOn: o.dependsOn ?? [],
});

test("DEC: una decomposizione ben formata e' ammessa", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", weight: 3 }),
    node({ taskId: "a", parentId: "root", depth: 1, weight: 1 }),
    node({ taskId: "b", parentId: "root", depth: 1, weight: 2 }),
  ] }, ctx);
  assert.equal(d.admitted, true);
});

const has = (d, rule) => !d.admitted && d.violations.some((v) => v.rule === rule);

test("DEC-E01: un ciclo nel DAG di dipendenze e' rifiutato", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", weight: 2 }),
    node({ taskId: "a", parentId: "root", depth: 1, weight: 1, dependsOn: ["b"] }),
    node({ taskId: "b", parentId: "root", depth: 1, weight: 1, dependsOn: ["a"] }),
  ] }, ctx);
  assert.ok(has(d, "DEC-E01"));
});

test("DEC-E02: somma dei pesi dei figli != peso del padre", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", weight: 5 }),
    node({ taskId: "a", parentId: "root", depth: 1, weight: 1 }),
    node({ taskId: "b", parentId: "root", depth: 1, weight: 2 }),
  ] }, ctx);
  assert.ok(has(d, "DEC-E02"));
});

test("DEC-E03: reviewer === owner e' rifiutato, nodo nominato", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", owner: "GROK", reviewer: "GROK" }),
  ] }, ctx);
  assert.ok(has(d, "DEC-E03"));
});

test("DEC-E04: un criterio vero-sse-il-reviewer-approva e' rifiutato", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", acceptanceCriteria: [crit("c1", "GROK issues an evidence-backed PASS or PASS_WITH_ACTIONS review.")] }),
  ] }, ctx);
  assert.ok(has(d, "DEC-E04"));
});

test("DEC-E04: nessun criterio e' rifiutato", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", acceptanceCriteria: [] }),
  ] }, ctx);
  assert.ok(has(d, "DEC-E04"));
});

test("DEC-E05: depth oltre maxDepth e' rifiutato", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", weight: 1 }),
    node({ taskId: "deep", parentId: "root", depth: 4, weight: 1 }),
  ] }, { ...ctx, ceilings: { maxDepth: 3, maxFanOut: 5 } });
  // root weight 1 != child 1? no, sum(children)=1==1 ok. depth 4 > 3 -> E05
  assert.ok(has(d, "DEC-E05"));
});

test("DEC-E05: fan-out oltre maxFanOut e' rifiutato", () => {
  const kids = Array.from({ length: 6 }, (_, i) => node({ taskId: `k${i}`, parentId: "root", depth: 1, weight: 1 }));
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", weight: 6 }), ...kids,
  ] }, { ...ctx, ceilings: { maxDepth: 3, maxFanOut: 5 } });
  assert.ok(has(d, "DEC-E05"));
});

test("DEC-E06: una capability fuori dall'indice chiuso e' rifiutata", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", requiredCapabilities: ["write", "inventata"] }),
  ] }, ctx);
  assert.ok(has(d, "DEC-E06"));
});

test("DEC-E07: un task irraggiungibile dalla radice e' rifiutato", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", weight: 1 }),
    node({ taskId: "a", parentId: "root", depth: 1, weight: 1 }),
    node({ taskId: "orphan", parentId: "ghost", depth: 1, weight: 1 }),
  ] }, ctx);
  assert.ok(has(d, "DEC-E07"));
});

test("DEC: rifiuto IN BLOCCO — piu' infrazioni riportate insieme", () => {
  const d = validateDecomposition({ missionId: "m1", nodes: [
    node({ taskId: "root", owner: "GROK", reviewer: "GROK", weight: 9, requiredCapabilities: ["ghost"] }),
    node({ taskId: "a", parentId: "root", depth: 1, weight: 1 }),
  ] }, ctx);
  assert.equal(d.admitted, false);
  assert.ok(d.violations.length >= 3, "E03 + E06 + E02 almeno");
});

test("isCriterionFalsifiable: verdetto+artefatto resta falsificabile", () => {
  assert.equal(isCriterionFalsifiable("GROK issues a review confirming `THREAT_MODEL.md` covers 19 threats."), true);
  assert.equal(isCriterionFalsifiable("The reviewer approves the delivery."), false);
});

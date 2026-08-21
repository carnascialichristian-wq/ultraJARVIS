/**
 * Test del contratto FBK — fallback locale a costo zero (blueprint §20).
 *
 * SCOPING: questa suite vive FUORI da tests/contracts/ di proposito. Il conteggio 140 di
 * tests/contracts/ e' dichiarato in due artefatti congelati e in review presso GEMINI
 * (handoff e blueprint di UJ-RUN-001): aggiungere test li' renderebbe false 14 affermazioni
 * in una consegna in revisione. Stessa scelta gia' fatta per RTE, DEC e SEL.
 *
 * Eseguire DALLA ROOT del repository, e DOPO la build:
 *   npx tsc -p packages/contracts
 *   node --test tests/fallback/capability-fallback.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  admitTaskFallbacks,
  reachableCostClasses,
} from "../../packages/contracts/dist/fallback/index.js";

/** Un task minimo ma valido: la forma conta, il contenuto no. */
function taskWith(capabilities) {
  return {
    taskId: "UJ-T-001",
    parentId: null,
    depth: 1,
    weight: 3,
    owner: "CLAUDE",
    reviewer: "GEMINI",
    requiredCapabilities: capabilities,
    acceptanceCriteria: [
      { criterionId: "AC-01", text: "`npx tsc --noEmit` returns exit code 0." },
    ],
    dependsOn: [],
  };
}

const zeroLocal = (tag) => ({
  tag,
  primary: { adapterId: "local-llm", costClass: "ZERO_LOCAL" },
  fallback: { kind: "ZERO_LOCAL", detail: "loopback model" },
});

const bindingMap = (list) => new Map(list.map((b) => [b.tag, b]));

// --------------------------------------------------------------- percorso felice

test("T-FBK-0 a task whose capabilities all have zero-cost bindings is ADMITTED", () => {
  const r = admitTaskFallbacks(taskWith(["summarise"]), [zeroLocal("summarise")], {
    essential: true,
  });
  assert.equal(r.outcome, "ADMITTED");
  assert.equal(r.taskId, "UJ-T-001");
});

// --------------------------------------------------------------- FBK-E01

test("T-FBK-1 a capability with no binding blocks the task and NAMES the tag", () => {
  const r = admitTaskFallbacks(taskWith(["summarise", "translate"]), [zeroLocal("summarise")], {
    essential: true,
  });
  assert.equal(r.outcome, "BLOCKED_NO_FALLBACK");
  const v = r.violations.find((x) => x.rule === "FBK-E01");
  assert.ok(v, "expected FBK-E01 to be reported");
  // Il tag DEVE essere nominato: un blocco che non dice cosa manca costa un giro di ricerca.
  assert.equal(v.tag, "translate");
  assert.match(v.detail, /translate/);
});

// --------------------------------------------------------------- FBK-E02

test("T-FBK-3 a malformed fallback.kind BLOCKS — it never falls through to a permissive default", () => {
  const malformed = {
    tag: "summarise",
    primary: { adapterId: "local-llm", costClass: "ZERO_LOCAL" },
    // Arriva da JSON: il compilatore non l'ha visto. E' il confine dove il tipo non protegge.
    fallback: { kind: "ANYTHING_GOES", detail: "hand-written config" },
  };
  const r = admitTaskFallbacks(taskWith(["summarise"]), [malformed], { essential: false });
  assert.equal(r.outcome, "BLOCKED_NO_FALLBACK", "fail-safe, not fail-open");
  assert.ok(r.violations.some((v) => v.rule === "FBK-E02"));
});

// --------------------------------------------------------------- FBK-E03

test("T-FBK-3b FAIL_CLOSED is refused on an essential task and allowed on a non-essential one", () => {
  const failClosed = {
    tag: "render-video",
    primary: { adapterId: "local-ffmpeg", costClass: "ZERO_LOCAL" },
    fallback: { kind: "FAIL_CLOSED", detail: "no degraded path" },
  };
  const task = taskWith(["render-video"]);

  const essential = admitTaskFallbacks(task, [failClosed], { essential: true });
  assert.equal(essential.outcome, "BLOCKED_NO_FALLBACK");
  assert.ok(essential.violations.some((v) => v.rule === "FBK-E03"));

  // Controllo positivo: la stessa identica configurazione su un task NON essenziale passa.
  // Senza questo caso, FBK-E03 sarebbe indistinguibile da "FAIL_CLOSED sempre vietato".
  const optional = admitTaskFallbacks(task, [failClosed], { essential: false });
  assert.equal(optional.outcome, "ADMITTED");
});

// --------------------------------------------------------------- FBK-E04, primo salto

test("T-FBK-2a a METERED primary is caught", () => {
  const metered = {
    tag: "summarise",
    primary: { adapterId: "paid-api", costClass: "METERED" },
    fallback: { kind: "ZERO_LOCAL", detail: "loopback model" },
  };
  const r = admitTaskFallbacks(taskWith(["summarise"]), [metered], { essential: true });
  assert.equal(r.outcome, "BLOCKED_NO_FALLBACK");
  assert.ok(r.violations.some((v) => v.rule === "FBK-E04"));
});

// --------------------------------------------------------------- FBK-E04, chiusura transitiva
// E' il test che conta piu' di tutti: e' la forma esatta del finding S-17 sul codice Python.

test("T-FBK-2 the METERED path is caught through the TRANSITIVE closure, not just the first hop", () => {
  // "summarise" sembra pulito: primario zero-cost, fallback zero-cost.
  // Ma delega a "translate", che a sua volta ricade su un adapter a pagamento.
  const summarise = {
    tag: "summarise",
    primary: { adapterId: "local-llm", costClass: "ZERO_LOCAL" },
    fallback: { kind: "ZERO_LOCAL", detail: "delegates downstream", viaTag: "translate" },
  };
  const translate = {
    tag: "translate",
    primary: { adapterId: "paid-translate", costClass: "METERED" },
    fallback: { kind: "HUMAN_BRIDGE", detail: "ask a person" },
  };

  // Guardando SOLO il primo salto, "summarise" e' irreprensibile:
  const firstHopOnly = summarise.primary.costClass;
  assert.equal(firstHopOnly, "ZERO_LOCAL", "il primo salto da solo non rivela nulla");

  // La chiusura invece lo trova.
  const closure = reachableCostClasses("summarise", bindingMap([summarise, translate]));
  assert.ok(closure.has("METERED"), "la chiusura transitiva deve raggiungere METERED");

  const r = admitTaskFallbacks(taskWith(["summarise"]), [summarise, translate], {
    essential: true,
  });
  assert.equal(r.outcome, "BLOCKED_NO_FALLBACK");
  const v = r.violations.find((x) => x.rule === "FBK-E04");
  assert.ok(v, "expected FBK-E04 from the transitive closure");
  assert.equal(v.tag, "summarise");
});

test("T-FBK-2b the closure terminates on a cycle instead of recursing forever", () => {
  // Due capability che si rimandano a vicenda. Non e' un errore di per se': la chiusura e'
  // finita. Ma senza la guardia `seen` il calcolo non terminerebbe, e un controllo che non
  // termina non e' un controllo.
  const a = {
    tag: "a",
    primary: { adapterId: "local-a", costClass: "ZERO_LOCAL" },
    fallback: { kind: "ZERO_LOCAL", detail: "-> b", viaTag: "b" },
  };
  const b = {
    tag: "b",
    primary: { adapterId: "local-b", costClass: "ZERO_LOCAL" },
    fallback: { kind: "ZERO_LOCAL", detail: "-> a", viaTag: "a" },
  };
  const closure = reachableCostClasses("a", bindingMap([a, b]));
  assert.deepEqual([...closure].sort(), ["ZERO_LOCAL"]);
  assert.equal(admitTaskFallbacks(taskWith(["a"]), [a, b], { essential: true }).outcome, "ADMITTED");
});

// --------------------------------------------------------------- reporting in blocco

test("T-FBK-4 an indefensible task reports EVERY violation, not just the first", () => {
  const meteredEssential = {
    tag: "translate",
    primary: { adapterId: "paid-translate", costClass: "METERED" },
    fallback: { kind: "FAIL_CLOSED", detail: "none" },
  };
  const r = admitTaskFallbacks(taskWith(["translate", "missing-tag"]), [meteredEssential], {
    essential: true,
  });
  assert.equal(r.outcome, "BLOCKED_NO_FALLBACK");
  const rules = new Set(r.violations.map((v) => v.rule));
  // FBK-E03 (FAIL_CLOSED su essenziale) + FBK-E04 (METERED) + FBK-E01 (tag assente)
  for (const expected of ["FBK-E01", "FBK-E03", "FBK-E04"]) {
    assert.ok(rules.has(expected), `expected ${expected} to be reported`);
  }
});

// --------------------------------------------------------------- HUMAN_BRIDGE

test("T-FBK-5 HUMAN_BRIDGE is a first-class zero-cost fallback, not a degraded one", () => {
  // UJ-CLD-001 ha stabilito che per Claude HUMAN_BRIDGE e' la modalita' DEFINITIVA a budget
  // zero, non un ripiego temporaneo. Il contratto deve rifletterlo: ammesso senza riserve.
  const bridged = {
    tag: "ask-claude",
    primary: { adapterId: "claude-code-session", costClass: "ZERO_SUBSCRIPTION_HUMAN" },
    fallback: { kind: "HUMAN_BRIDGE", detail: "Christian copies the block by hand" },
  };
  const r = admitTaskFallbacks(taskWith(["ask-claude"]), [bridged], { essential: true });
  assert.equal(r.outcome, "ADMITTED");
  const closure = reachableCostClasses("ask-claude", bindingMap([bridged]));
  assert.ok(!closure.has("METERED"));
});

// --------------------------------------------------------------- determinismo

test("T-FBK-6 admission is deterministic: same input, byte-identical verdict", () => {
  const task = taskWith(["summarise", "translate"]);
  const bindings = [zeroLocal("summarise")];
  const a = JSON.stringify(admitTaskFallbacks(task, bindings, { essential: true }));
  const b = JSON.stringify(admitTaskFallbacks(task, bindings, { essential: true }));
  assert.equal(a, b);
});

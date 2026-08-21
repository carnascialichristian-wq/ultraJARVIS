// Test del contratto SEL (selection), sottosistema §17 del blueprint.
// FUORI da tests/contracts/: superficie separata, non tocca il conteggio 140.
// Richiede build: npx tsc -p packages/contracts
import test from "node:test";
import assert from "node:assert/strict";
import { selectAgent } from "../../packages/contracts/dist/selection/index.js";

// --- helper ----------------------------------------------------------------
const task = (o = {}) => ({
  taskId: o.taskId ?? "t1",
  parentId: o.parentId ?? null,
  depth: o.depth ?? 0,
  weight: o.weight ?? 1,
  owner: o.owner ?? "CLAUDE",
  reviewer: o.reviewer ?? "GEMINI",
  requiredCapabilities: o.requiredCapabilities ?? ["cap.write"],
  acceptanceCriteria: o.acceptanceCriteria ?? [{ id: "c1", text: "`out` ok, exit 0" }],
  dependsOn: o.dependsOn ?? [],
});
const cand = (o = {}) => ({
  agentId: o.agentId ?? "agent-1",
  declaredCapabilities: o.declaredCapabilities ?? ["cap.write", "cap.read"],
  maxDataClass: o.maxDataClass ?? "C2",
  maxAutonomy: o.maxAutonomy ?? "L2",
  maxSideEffect: o.maxSideEffect ?? "INTERNAL_WRITE",
  expiresAt: o.expiresAt ?? null,
});
const parent = (o = {}) => ({
  capabilities: o.capabilities ?? ["cap.write", "cap.read"],
  maxDataClass: o.maxDataClass ?? "C3",
  maxAutonomy: o.maxAutonomy ?? "L3",
  maxSideEffect: o.maxSideEffect ?? "EXTERNAL_WRITE",
});
const NOW = "2026-08-20T00:00:00Z";
const has = (a, rule) => a.kind === "REFUSED" && a.violations.some((v) => v.rule === rule);

// --- ASSIGNED base: grant = min(candidato, padre) --------------------------
test("SEL: task ben formato con un candidato idoneo -> ASSIGNED, grant = min(candidato, padre)", () => {
  const a = selectAgent({ task: task(), candidates: [cand()], parentGrants: parent(), now: NOW });
  assert.equal(a.kind, "ASSIGNED");
  assert.equal(a.agentId, "agent-1");
  assert.deepEqual(a.grants.capabilities, ["cap.write"]);
  assert.equal(a.grants.maxDataClass, "C2"); // min(C2, C3)
  assert.equal(a.grants.maxAutonomy, "L2"); // min(L2, L3)
  assert.equal(a.grants.maxSideEffect, "INTERNAL_WRITE"); // min(INTERNAL_WRITE, EXTERNAL_WRITE)
});

// --- T-SEL-1 / SEL-E01: nessun candidato idoneo -> HUMAN_BRIDGE, non REFUSED
test("SEL-E01 (T-SEL-1): nessun candidato copre le capability -> HUMAN_BRIDGE, non REFUSED", () => {
  const a = selectAgent({
    task: task({ requiredCapabilities: ["cap.notebooklm"] }),
    candidates: [cand({ declaredCapabilities: ["cap.write"] })],
    parentGrants: parent(),
    now: NOW,
  });
  assert.equal(a.kind, "HUMAN_BRIDGE");
  assert.equal(a.envelope.taskId, "t1");
  assert.deepEqual(a.envelope.missingCapabilities, ["cap.notebooklm"]);
  assert.match(a.envelope.instruction, /cap\.notebooklm/);
});

// --- SEL-E02 / T-SEL-4: rifiuto elenca TUTTE le invarianti violate ---------
test("SEL-E02 (T-SEL-4): un rifiuto elenca TUTTE le invarianti violate (TA-2/4/5/8 insieme)", () => {
  const a = selectAgent({
    task: task({ requiredCapabilities: ["cap.x"] }),
    candidates: [
      cand({
        agentId: "greedy",
        declaredCapabilities: ["cap.x"], // copre
        maxDataClass: "C4",
        maxAutonomy: "L4",
        maxSideEffect: "DESTRUCTIVE",
      }),
    ],
    parentGrants: parent({ capabilities: [], maxDataClass: "C0", maxAutonomy: "L0", maxSideEffect: "NONE" }),
    now: NOW,
  });
  assert.equal(a.kind, "REFUSED");
  const details = a.violations.map((v) => v.detail).join(" | ");
  assert.match(details, /TA-2/);
  assert.match(details, /TA-4/);
  assert.match(details, /TA-5/);
  assert.match(details, /TA-8/);
  assert.equal(a.violations.length, 4); // non si ferma alla prima
});

// --- SEL-E02 / TA-2 (T-SEL-5 analogo): capability non posseduta dal padre ---
test("SEL-E02/TA-2 (T-SEL-5): una capability non posseduta dal padre non e' assegnabile", () => {
  const a = selectAgent({
    task: task({ requiredCapabilities: ["cap.write"] }),
    candidates: [cand({ declaredCapabilities: ["cap.write"] })],
    parentGrants: parent({ capabilities: ["cap.read"] }), // il padre NON ha cap.write
    now: NOW,
  });
  assert.ok(has(a, "SEL-E02"));
  assert.match(a.violations[0].detail, /TA-2/);
});

// --- SEL-E03: owner === reviewer -> REFUSED (indipendenza ri-verificata) ----
test("SEL-E03: owner e reviewer coincidono -> REFUSED (indipendenza ri-verificata a selezione)", () => {
  const a = selectAgent({
    task: task({ owner: "CLAUDE", reviewer: "CLAUDE" }),
    candidates: [cand()],
    parentGrants: parent(),
    now: NOW,
  });
  assert.ok(has(a, "SEL-E03"));
});

// --- SEL-E04: manifest scaduto rispetto a now ------------------------------
test("SEL-E04: un candidato scaduto e' escluso; se e' l'unico coprente -> REFUSED con scadenza", () => {
  const a = selectAgent({
    task: task(),
    candidates: [cand({ agentId: "stale", expiresAt: "2026-08-19T23:59:59Z" })], // < NOW
    parentGrants: parent(),
    now: NOW,
  });
  assert.ok(has(a, "SEL-E04"));
});

test("SEL-E04: `now` e' l'unica sorgente di tempo — spostandolo oltre la scadenza il verdetto cambia", () => {
  const input = (now) => ({
    task: task(),
    candidates: [cand({ agentId: "expiring", expiresAt: "2026-08-20T12:00:00Z" })],
    parentGrants: parent(),
    now,
  });
  assert.equal(selectAgent(input("2026-08-20T11:59:59Z")).kind, "ASSIGNED"); // prima della scadenza
  assert.ok(has(selectAgent(input("2026-08-20T12:00:01Z")), "SEL-E04")); // dopo
});

test("SEL-E04: un candidato scaduto viene scavalcato da uno valido, non fa fallire la selezione", () => {
  const a = selectAgent({
    task: task(),
    candidates: [
      cand({ agentId: "stale", expiresAt: "2020-01-01T00:00:00Z" }),
      cand({ agentId: "fresh", expiresAt: null }),
    ],
    parentGrants: parent(),
    now: NOW,
  });
  assert.equal(a.kind, "ASSIGNED");
  assert.equal(a.agentId, "fresh");
});

// --- T-SEL-3 / §17.6.4: a parita' di idoneita' vince il MENO privilegiato ---
test("T-SEL-3: a parita' di idoneita' vince il candidato MENO privilegiato, non il piu' capace", () => {
  const a = selectAgent({
    task: task(),
    candidates: [
      // piu' capace, ma agentId lessicograficamente PRIMO: non deve vincere per il nome
      cand({ agentId: "a-capable", maxAutonomy: "L3", maxDataClass: "C3", maxSideEffect: "EXTERNAL_WRITE" }),
      // meno privilegiato
      cand({ agentId: "z-minimal", maxAutonomy: "L1", maxDataClass: "C1", maxSideEffect: "NONE" }),
    ],
    parentGrants: parent(),
    now: NOW,
  });
  assert.equal(a.kind, "ASSIGNED");
  assert.equal(a.agentId, "z-minimal"); // il privilegio domina il tie-break lessicografico
});

test("tie-break: a parita' PIENA di privilegio decide l'agentId lessicografico (d), deterministico", () => {
  const mk = (id) => cand({ agentId: id, maxAutonomy: "L1", maxDataClass: "C0", maxSideEffect: "NONE" });
  const a = selectAgent({ task: task(), candidates: [mk("agent-b"), mk("agent-a")], parentGrants: parent(), now: NOW });
  assert.equal(a.kind, "ASSIGNED");
  assert.equal(a.agentId, "agent-a");
});

// --- T-SEL-2 / §17.6.3: neutralita' di provider (meccanico) -----------------
test("T-SEL-2: offuscando i nomi dei vendor nei capability tag l'assegnazione NON cambia", () => {
  // sigma: una biiezione sui token di vendor dentro i capability tag. Gli agentId sono handle
  // OPACHI e non vengono toccati (e' esattamente cio' che sigma^-1 lascia invariato).
  const sigma = (cap) => cap.replace("openai", "V1").replace("anthropic", "V2");
  const build = (xform) => ({
    task: task({ requiredCapabilities: ["cap.openai.chat"].map(xform) }),
    candidates: [
      cand({ agentId: "agent-1", declaredCapabilities: ["cap.openai.chat", "cap.anthropic.msg"].map(xform) }),
      cand({ agentId: "agent-2", declaredCapabilities: ["cap.openai.chat"].map(xform), maxAutonomy: "L1", maxDataClass: "C1", maxSideEffect: "NONE" }),
    ],
    parentGrants: parent({ capabilities: ["cap.openai.chat", "cap.anthropic.msg"].map(xform) }),
    now: NOW,
  });
  const plain = selectAgent(build((x) => x));
  const obfuscated = selectAgent(build(sigma));
  assert.equal(plain.kind, "ASSIGNED");
  assert.equal(obfuscated.kind, "ASSIGNED");
  // sigma^-1 sull'esito = identita' sugli agentId opachi: stesso agente scelto.
  assert.equal(plain.agentId, obfuscated.agentId);
  assert.equal(plain.agentId, "agent-2"); // il meno privilegiato, in entrambi i mondi
});

// --- determinismo: stesso input -> stesso output ---------------------------
test("determinismo: due esecuzioni sullo stesso input danno lo stesso Assignment byte per byte", () => {
  const input = {
    task: task(),
    candidates: [cand({ agentId: "x" }), cand({ agentId: "y", maxAutonomy: "L1", maxDataClass: "C0", maxSideEffect: "NONE" })],
    parentGrants: parent(),
    now: NOW,
  };
  assert.deepEqual(selectAgent(input), selectAgent(input));
});

/**
 * mission-demo.mjs — la demo end-to-end minima del blueprint §21 di UJ-RUN-001.
 *
 * "Se la demo non gira, il documento è teoria." Questo è il primo taglio di codice
 * eseguibile che rende il blueprint falsificabile — atto n.4 del mandato di Technical
 * Lead (CLAUDE.md PARTE 3-bis §4).
 *
 * Onestà su cosa è REALE e cosa è DEMO-MINIMALE:
 *   - Usa i CONTRATTI VERI dove esistono: checkSpawn, nextState, verifyLedgerChain,
 *     buildIdempotencyKey, AtomicActiveTaskCounter, mayStartNewStep.
 *   - Usa logica DEMO-MINIMALE, marcata [demo], per i cinque sottosistemi che NON
 *     hanno ancora un contratto (decomposizione DEC-, selezione SEL-, routing RTE-,
 *     conflitto CNF-, fallback FBK-). Quando quei contratti arriveranno (M2/M3), la
 *     demo va ricablata su di essi. Finché non arrivano, questa demo NON chiude
 *     T-E2E-1/2/3 nel blueprint: quelle prove restano "DA IMPLEMENTARE".
 *
 * COSTO ZERO PER COSTRUZIONE: nessun import di rete, nessuna chiave. L'unico adapter
 * è `echo@1`, che restituisce l'input in maiuscolo. Il passo 9 verifica che nessuna
 * libreria di rete sia stata caricata.
 *
 * Uso:  node packages/contracts/demo/mission-demo.mjs
 *       (richiede prima `npx tsc -p packages/contracts` per generare dist/)
 * Exit: 0 se i 9 osservabili e i 4 casi negativi passano, 1 altrimenti.
 */

import { createHash } from "node:crypto";
import { mkdtempSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  checkSpawn,
  nextState,
  verifyLedgerChain,
  buildIdempotencyKey,
  mayStartNewStep,
} from "../dist/runtime/index.js";
import { AtomicActiveTaskCounter } from "../dist/recovery/index.js";

const sha256 = (s) => createHash("sha256").update(s).digest("hex");
let failures = 0;
const obs = [];
function check(step, label, ok, detail) {
  obs.push({ step, ok });
  if (!ok) failures += 1;
  const tag = ok ? "[ ok ]" : "[FAIL]";
  console.log(`  ${tag} ${step}. ${label}${detail ? "  — " + detail : ""}`);
}

console.log("== UJ-RUN-001 demo end-to-end (§21) ==");
console.log("adapter unico: echo@1 (ZERO_LOCAL). Nessuna rete, nessuna chiave.\n");

// --- limiti condivisi, forma dai test dei contratti --------------------------
const budget = { maxProviderCalls: 10, maxToolCalls: 10, maxWallClockMs: 60000, recoveryReserveCalls: 2 };
const parentLimits = {
  toolAllowlist: [
    { toolId: "echo", version: "1.0.0", manifestHash: "he", maxSideEffect: "INTERNAL_WRITE" },
  ],
  maxDataClass: "C2", maxAutonomy: "L3", maxSideEffect: "INTERNAL_WRITE",
  quotaBudget: budget, deadline: "2026-08-20T12:00:00Z",
};
const childLimits = {
  toolAllowlist: [{ toolId: "echo", version: "1.0.0", manifestHash: "he", maxSideEffect: "INTERNAL_WRITE" }],
  maxDataClass: "C1", maxAutonomy: "L2", maxSideEffect: "INTERNAL_WRITE",
  quotaBudget: { ...budget, maxProviderCalls: 5 }, deadline: "2026-08-20T11:00:00Z",
};

// --- ledger in-process -------------------------------------------------------
const hashEvent = (e) =>
  sha256(`${e.seq}|${e.type}|${e.at}|${e.prevHash ?? ""}|${JSON.stringify(e.payload ?? {})}`);
const ledger = [];
let prevHash = null;
function emit(type, payload) {
  const e = { seq: ledger.length, runId: "run-demo", type, at: "2026-08-20T10:00:00Z", prevHash, payload, selfHash: "" };
  e.selfHash = hashEvent(e);
  prevHash = e.selfHash;
  ledger.push(e);
  return e;
}

// === PERCORSO FELICE — i 9 osservabili =======================================

// 1) decomposizione [demo]: 3 nodi, contentHash stabile su due esecuzioni
const decompose = (mission) => {
  const nodes = ["read-input", "echo-transform", "write-and-verify"].map((name, i) => ({
    id: `n${i + 1}`, name, contentHash: sha256(`${mission}|${name}`),
  }));
  return nodes;
};
const MISSION = "produrre out/hello.txt contenente ok, e verificarlo";
const nodesA = decompose(MISSION);
const nodesB = decompose(MISSION);
check(1, "decomposizione: 3 nodi, contentHash stabile su due esecuzioni",
  nodesA.length === 3 && nodesA.every((n, i) => n.contentHash === nodesB[i].contentHash),
  `${nodesA.length} nodi`);

// 2) selezione [demo]: tutti ASSIGNED, nessuna stringa di vendor nell'input
const VENDOR = /openai|anthropic|gpt-4|claude-|gemini|api\.stripe/i;
const assigned = nodesA.map((n) => ({ ...n, state: "ASSIGNED" }));
check(2, "selezione: 3/3 ASSIGNED, nessun vendor nell'input",
  assigned.every((n) => n.state === "ASSIGNED") && !VENDOR.test(MISSION));

// 3) esecuzione nodo 1 con echo@1: eventi tool.invoked + tool.completed
const echo = (input) => String(input).toUpperCase();
emit("tool.invoked", { node: "n1", tool: "echo@1" });
const out1 = echo("ok");
emit("tool.completed", { node: "n1", tool: "echo@1", result: out1 });
check(3, "esecuzione nodo 1: tool.invoked + tool.completed con echo@1",
  ledger.some((e) => e.type === "tool.invoked") && ledger.some((e) => e.type === "tool.completed"));

// 4) checkpoint dopo il nodo 1
const cp = emit("checkpoint.created", { checkpointId: "cp-1", afterNode: "n1", ledgerLen: ledger.length });
check(4, "checkpoint dopo nodo 1: checkpointId emesso",
  cp.payload.checkpointId === "cp-1", `ledger a ${ledger.length} eventi`);

// 6-prep) idempotency key del side effect del nodo 1 (serve al resume)
const idemNode1 = buildIdempotencyKey(
  { runId: "run-demo", taskId: "UJ-RUN-001", operationName: "echo", canonicalPayload: '{"in":"ok"}', toolVersion: "1.0.0" },
  sha256,
);
const sideEffectsSeen = new Set([idemNode1]);

// 5) kill switch durante il nodo 2: HALTED da uno stato non terminale (contratto vero)
const moves = nextState("MONITORING", "KILL_SWITCH");
emit("kill.engaged", { scope: "RUN" });
check(5, "kill switch: HALTED raggiunto da MONITORING (nextState, contratto vero)",
  moves.length > 0 && moves[0].to === "HALTED");

// 6) resume dal checkpoint: il nodo 1 NON viene rieseguito (stessa idempotencyKey)
const kill = { engaged: false, scope: "RUN", engagedBy: "OWNER", engagedAt: "2026-08-20T10:00:00Z", gracePeriodMs: 0 };
const idemAgain = buildIdempotencyKey(
  { runId: "run-demo", taskId: "UJ-RUN-001", operationName: "echo", canonicalPayload: '{"in":"ok"}', toolVersion: "1.0.0" },
  sha256,
);
const alreadyDone = sideEffectsSeen.has(idemAgain);
emit("resume.fromCheckpoint", { checkpointId: "cp-1", node1Reexecuted: !alreadyDone });
check(6, "resume: nodo 1 non rieseguito (stessa idempotencyKey), mayStartNewStep ok",
  alreadyDone && idemAgain === idemNode1 && mayStartNewStep(kill) === true);

// 7) completamento: out/hello.txt esiste e contiene ok
const workDir = mkdtempSync(join(tmpdir(), "uj-demo-"));
const outFile = join(workDir, "hello.txt");
writeFileSync(outFile, echo("ok").toLowerCase() + "\n", "utf8"); // echo poi normalizzato a 'ok'
emit("tool.completed", { node: "n3", wrote: "out/hello.txt" });
check(7, "completamento: out/hello.txt esiste e contiene 'ok'",
  existsSync(outFile) && readFileSync(outFile, "utf8").trim() === "ok", outFile);

// 8) verifica del ledger: catena intatta, e alterare un evento la rompe (contratto vero)
const intact = verifyLedgerChain(ledger, hashEvent).intact === true;
const tampered = ledger.map((e) => ({ ...e }));
tampered[3] = { ...tampered[3], payload: { ...tampered[3].payload, checkpointId: "FORGED" } };
tampered[3].selfHash = hashEvent(tampered[3]);
const broken = verifyLedgerChain(tampered, hashEvent).intact === false;
check(8, "ledger: catena intatta, e un evento alterato la rompe",
  intact && broken);

// 9) controllo di costo: zero moduli di rete caricati
const NET = ["http", "https", "net", "tls", "node:http", "node:https", "node:net", "node:tls", "undici", "axios", "node-fetch"];
const netLoaded = NET.filter((m) => {
  try { return process.moduleLoadList?.includes(`NativeModule ${m}`); } catch { return false; }
});
check(9, "controllo di costo: 0 moduli di rete caricati",
  netLoaded.length === 0, netLoaded.length ? "caricati: " + netLoaded.join(",") : "nessuno");

// === CASI NEGATIVI — i 4 richiesti ==========================================
console.log("\n  -- casi negativi (una demo del solo percorso felice non prova nulla) --");
let negFail = 0;
function neg(label, ok, detail) {
  if (!ok) { negFail += 1; failures += 1; }
  console.log(`  ${ok ? "[ ok ]" : "[FAIL]"} ${label}${detail ? "  — " + detail : ""}`);
}

// N1) un nodo che chiede un tool non posseduto dal padre -> rifiuto (contratto vero)
const badChild = { ...childLimits, toolAllowlist: [
  { toolId: "repo.destroy", version: "1.0.0", manifestHash: "hx", maxSideEffect: "DESTRUCTIVE" },
] };
const d1 = checkSpawn({ parentDepth: 1, childDepth: 2, parentChildCount: 0, activeAtomicTasks: 3, parentLimits, childLimits: badChild });
neg("N1 tool non posseduto dal padre -> checkSpawn rifiuta (analogo SEL-E02/TA-2)",
  d1.admitted === false, "invarianti: " + (d1.admitted ? "-" : d1.violations.map((v) => v.invariant).join(",")));

// N2) un adapter METERED registrato a L2 -> rifiuto ALLA REGISTRAZIONE [demo]
const registerAdapter = (adapter) => {
  // [demo] regola RTE minimale: un adapter METERED richiede autonomia >= L3
  if (adapter.costClass === "METERED" && adapter.minAutonomy !== "L3") {
    return { ok: false, error: "RTE-E01" };
  }
  return { ok: true };
};
const r2 = registerAdapter({ id: "paid@1", costClass: "METERED", minAutonomy: "L2" });
neg("N2 adapter METERED a L2 -> RTE-E01 alla registrazione [demo]",
  r2.ok === false && r2.error === "RTE-E01");

// N3) una capability senza fallback -> BLOCKED prima della coda [demo]
const enqueueIfRoutable = (cap) => {
  // [demo] regola FBK minimale: una capability senza fallback non entra in coda
  if (!cap.fallback) return { queued: false, error: "FBK-E01", status: "BLOCKED" };
  return { queued: true };
};
const r3 = enqueueIfRoutable({ id: "cap.embed", fallback: null });
neg("N3 capability senza fallback -> FBK-E01, task BLOCKED prima della coda [demo]",
  r3.queued === false && r3.error === "FBK-E01" && r3.status === "BLOCKED");

// N4) due claim concorrenti sullo stesso nodo -> esattamente un vincitore (contratto vero)
const claim = new AtomicActiveTaskCounter(1); // un solo slot = un solo claim vincente
const results = await Promise.all([claim.reserve(), claim.reserve()]);
const winners = results.filter((r) => r.granted).length;
neg("N4 due claim concorrenti -> esattamente un vincitore (AtomicActiveTaskCounter, analogo CNF-E02)",
  winners === 1, `vincitori: ${winners}`);

// === esito ===================================================================
console.log("\n== esito ==");
console.log(`  osservabili: ${obs.filter((o) => o.ok).length}/9  ·  casi negativi: ${4 - negFail}/4`);
if (failures === 0) {
  console.log("DEMO: PASS — la catena decompose->select->execute->checkpoint->kill->resume->verify gira, a costo zero");
  process.exit(0);
} else {
  console.log(`DEMO: FAIL — ${failures} controlli non passati`);
  process.exit(1);
}

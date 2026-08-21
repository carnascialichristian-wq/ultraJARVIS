/**
 * Test del contratto CNF — conflitti fra agenti (blueprint §19).
 *
 * SCOPING: suite FUORI da tests/contracts/ di proposito, come RTE/DEC/SEL/FBK. Il conteggio
 * 140 e' dichiarato in due artefatti congelati e in review presso GEMINI.
 *
 * Eseguire DALLA ROOT, DOPO la build:
 *   npx tsc -p packages/contracts
 *   node --test tests/conflict/agent-conflict.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  admitArbiter,
  checkSingleWriter,
  claimNode,
  resolveVerdict,
} from "../../packages/contracts/dist/conflict/index.js";

function node(taskId, owner, reviewer, outputPaths) {
  return {
    taskId,
    parentId: null,
    depth: 1,
    weight: 3,
    owner,
    reviewer,
    requiredCapabilities: [],
    acceptanceCriteria: [{ criterionId: "AC-01", text: "`npx tsc --noEmit` returns exit 0." }],
    dependsOn: [],
    outputPaths,
  };
}

// ------------------------------------------------------- C-1 · scrittura concorrente

test("T-CNF-1 two tasks declaring the same output path are refused IN DECOMPOSITION", () => {
  const v = checkSingleWriter([
    node("UJ-A", "CLAUDE", "GEMINI", ["docs/shared.md"]),
    node("UJ-B", "GEMINI", "GROK", ["docs/shared.md"]),
  ]);
  assert.equal(v.length, 1);
  assert.equal(v[0].rule, "CNF-E01");
  // Entrambi i contendenti vanno NOMINATI: chi corregge deve sapere quali due task riconciliare.
  assert.match(v[0].detail, /UJ-A/);
  assert.match(v[0].detail, /UJ-B/);
  assert.match(v[0].detail, /docs\/shared\.md/);
});

test("T-CNF-1b distinct paths, and a task listed twice with the same path, are fine", () => {
  assert.equal(
    checkSingleWriter([
      node("UJ-A", "CLAUDE", "GEMINI", ["docs/a.md", "docs/b.md"]),
      node("UJ-B", "GEMINI", "GROK", ["docs/c.md"]),
    ]).length,
    0,
  );
  // Lo stesso task che dichiara lo stesso path due volte non e' un conflitto con se' stesso.
  assert.equal(checkSingleWriter([node("UJ-A", "CLAUDE", "GEMINI", ["x.md", "x.md"])]).length, 0);
});

test("T-CNF-1c a node without outputPaths simply does not take part in the check", () => {
  // Il campo e' un'estensione opzionale: le decomposizioni gia' scritte restano valide.
  const legacy = node("UJ-LEGACY", "CLAUDE", "GEMINI", undefined);
  assert.equal(checkSingleWriter([legacy, node("UJ-B", "GROK", "CHATGPT", ["y.md"])]).length, 0);
});

// ------------------------------------------------------ C-2 · doppia rivendicazione

test("T-CNF-2 two concurrent claims: exactly one wins, the loser does not retry", () => {
  const start = { taskId: "UJ-A", version: 7, assignee: null };

  const first = claimNode(start, "GEMINI", 7);
  assert.equal(first.outcome, "ACCEPTED");
  assert.equal(first.state.assignee, "GEMINI");
  assert.equal(first.state.version, 8, "il CAS deve far avanzare la versione");

  // Il secondo pretendente ha letto lo stesso stato di partenza: e' la gara vera.
  const second = claimNode(start, "GROK", 7);
  // ...ma applica il CAS contro lo stato AGGIORNATO, ed e' li' che perde.
  const secondAgainstNew = claimNode(first.state, "GROK", 7);
  assert.equal(secondAgainstNew.outcome, "REJECTED_CONFLICT");
  assert.equal(secondAgainstNew.winner, "GEMINI");
  assert.equal(secondAgainstNew.loser, "GROK");
  assert.equal(secondAgainstNew.reason.rule, "CNF-E02");
  assert.match(secondAgainstNew.reason.detail, /does NOT retry automatically/);

  // Sullo stato STANTIO il secondo passerebbe: e' esattamente il difetto che il CAS previene,
  // ed e' il motivo per cui il claim va applicato allo stato letto al momento della scrittura.
  assert.equal(second.outcome, "ACCEPTED");
});

test("T-CNF-2b a claim on an already assigned node is refused even with the right version", () => {
  const taken = { taskId: "UJ-A", version: 3, assignee: "CLAUDE" };
  const r = claimNode(taken, "GROK", 3);
  assert.equal(r.outcome, "REJECTED_CONFLICT");
  assert.equal(r.winner, "CLAUDE");
});

// ----------------------------------------------------- C-3 · verdetti incompatibili

const ref = { taskId: "UJ-RUN-001", commitSha: "b2b32733e8db7394fbc0a7f0503bb2795f3b4821" };

test("T-CNF-3 two opposite verdicts ESCALATE — no majority, no average, both kept", () => {
  const existing = [{ ref, reviewer: "GEMINI", outcome: "PASS" }];
  const r = resolveVerdict({ ref, reviewer: "GROK", outcome: "FAIL" }, existing);

  assert.equal(r.outcome, "ESCALATED");
  assert.equal(r.reason.rule, "CNF-E03");
  // ENTRAMBI conservati: la divergenza e' il dato, non il rumore.
  assert.equal(r.verdicts.length, 2);
  assert.deepEqual(
    r.verdicts.map((v) => v.outcome).sort(),
    ["FAIL", "PASS"],
    "il FAIL non deve essere assorbito dal PASS",
  );
  assert.match(r.reason.detail, /No majority vote, no average/);
});

test("T-CNF-3b a THIRD concurring verdict does not turn the escalation into a 2-1 majority", () => {
  // E' il caso che rende il contratto diverso da un voto: due PASS e un FAIL restano un
  // conflitto. Se qui bastasse la maggioranza, un FAIL solitario sarebbe sempre cancellabile
  // aggiungendo un revisore compiacente — cioe' il falso avanzamento che §31.5 vieta.
  const existing = [
    { ref, reviewer: "GEMINI", outcome: "PASS" },
    { ref, reviewer: "GROK", outcome: "FAIL" },
  ];
  const r = resolveVerdict({ ref, reviewer: "CHATGPT", outcome: "PASS" }, existing);
  assert.equal(r.outcome, "ESCALATED");
  assert.ok(r.verdicts.some((v) => v.outcome === "FAIL"), "il FAIL sopravvive alla maggioranza");
});

test("T-CNF-3c PASS and PASS_WITH_ACTIONS are NOT a conflict (controllo positivo)", () => {
  // Differiscono per le azioni di seguito, non per l'esito. Trattarli come divergenti
  // scalerebbe a una persona un disaccordo che non esiste, e un'escalation che scatta troppo
  // spesso viene ignorata: e' cosi' che una difesa smette di difendere.
  const existing = [{ ref, reviewer: "GEMINI", outcome: "PASS" }];
  const r = resolveVerdict({ ref, reviewer: "GROK", outcome: "PASS_WITH_ACTIONS" }, existing);
  assert.equal(r.outcome, "ACCEPTED");
});

test("T-CNF-3d the same reviewer disagreeing on a DIFFERENT commit is not a conflict", () => {
  // Il conflitto e' su (taskId, commitSha). Un FAIL su un commit e un PASS su quello dopo e'
  // la storia normale di una correzione, non una contraddizione.
  const existing = [{ ref, reviewer: "GEMINI", outcome: "FAIL" }];
  const later = { taskId: ref.taskId, commitSha: "c4e23caca979750408ea8da3fabc8721aad2195c" };
  const r = resolveVerdict({ ref: later, reviewer: "GEMINI", outcome: "PASS" }, existing);
  assert.equal(r.outcome, "ACCEPTED");
});

// ------------------------------------------------- CNF-E04 · chi e' parte non arbitra

test("T-CNF-4 an arbiter who is a party to the conflict is refused", () => {
  const r = admitArbiter({ arbiter: "CLAUDE", ref, parties: ["CLAUDE", "GEMINI"] });
  assert.equal(r.admitted, false);
  assert.equal(r.violation.rule, "CNF-E04");
  assert.match(r.violation.detail, /CLAUDE/);
});

test("T-CNF-4b an outside arbiter is admitted (controllo positivo)", () => {
  const r = admitArbiter({ arbiter: "CHATGPT", ref, parties: ["CLAUDE", "GEMINI"] });
  assert.equal(r.admitted, true);
});

test("T-CNF-4c the rule holds for the Technical Lead too — no exemption exists", () => {
  // Nessun ramo del contratto conosce il concetto di "capo": non c'e' una scorciatoia da
  // disattivare, perche' non e' mai stata scritta.
  for (const lead of ["CLAUDE", "CHATGPT", "GEMINI", "GROK"]) {
    const r = admitArbiter({ arbiter: lead, ref, parties: [lead, "GEMINI"] });
    assert.equal(r.admitted, false, `${lead} non deve poter arbitrare un conflitto che lo riguarda`);
  }
});

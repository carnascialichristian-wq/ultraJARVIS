#!/usr/bin/env node
/**
 * DEC-E04 — rifiuta i criteri di accettazione non falsificabili.
 *
 * PERCHE' ESISTE
 * --------------
 * docs/architecture/RUNTIME_BLUEPRINT.md §16.6 controllo 4 dice:
 *
 *   "ogni Criterion deve avere un verification che nomina un artefatto o un
 *    comando. Un criterio la cui verita' dipende solo dal verdetto del reviewer
 *    non e' falsificabile e va rifiutato (DEC-E04)."
 *
 * La regola era specificata e mai implementata: e' una delle 22 prove che il
 * blueprint dichiara non implementate. Questo script la implementa contro il
 * BACKLOG.json reale, senza aggiungere test alla suite dei contratti — che e'
 * congelata a 140 mentre UJ-RUN-001 e' in review.
 *
 * NON MODIFICA NULLA. Legge, conta, esce 1 se trova violazioni.
 *
 * Uso:
 *   node scripts/check-acceptance-criteria.mjs [percorso-backlog] [--self-test]
 *
 * Exit 0 = nessun criterio non falsificabile. Exit 1 = violazioni.
 */

import { readFileSync } from "node:fs";

/**
 * Un criterio e' NON falsificabile se la sua verita' dipende solo dal verdetto
 * del reviewer: nomina l'atto di revisione e nessuna proprieta' dell'artefatto.
 *
 * Il pattern e' deliberatamente stretto. Un criterio che dice "il reviewer
 * verifica che il file X contenga Y" e' falsificabile — nomina X e Y — e non
 * deve essere segnalato. Segnalare troppo renderebbe il controllo ignorabile,
 * che e' il modo in cui un gate smette di essere un gate.
 */
const VERDICT_ONLY = [
  /\b(?:CHATGPT|CLAUDE|GEMINI|GROK|Christian|CHRISTIAN)\s+issues?\b[^.]*\breview\b/i,
  /\bissues?\s+an?\s+evidence-backed\s+(?:PASS|PASS_WITH_ACTIONS|FAIL)/i,
  /\breviewer\s+(?:approves|accepts|passes)\b/i
];

/** Indizi che il criterio nomina qualcosa di verificabile oltre al verdetto. */
const NAMES_SOMETHING = [
  /`[^`]+`/,                       // un identificatore o un path fra backtick
  /\.(?:md|json|ts|mjs|py|yaml)\b/, // un file
  /\b(?:exit\s*(?:code)?\s*0|command|comando)\b/i,
  /\bsha-?256\b/i
];

export function checkCriterion(text) {
  const verdictOnly = VERDICT_ONLY.some((r) => r.test(text));
  if (!verdictOnly) return null;
  // Anche se nomina il verdetto, se cita un artefatto o un comando resta falsificabile.
  if (NAMES_SOMETHING.some((r) => r.test(text))) return null;
  return {
    rule: "DEC-E04",
    detail: "il criterio e' vero se e solo se il reviewer approva: nessuna proprieta' del deliverable lo rende vero o falso"
  };
}

function selfTest() {
  const cases = [
    ["GROK issues an evidence-backed PASS or PASS_WITH_ACTIONS review.", true],
    ["CLAUDE issues an evidence-backed PASS or PASS_WITH_ACTIONS review.", true],
    ["The reviewer approves the delivery.", true],
    // falsificabili: nominano un artefatto, un file o un comando
    ["The Threat model artifact exists and conforms to its declared contract.", false],
    ["GROK issues a review confirming `docs/threat-models/THREAT_MODEL.md` covers 19 threats.", false],
    ["The reviewer approves after `npx tsc --noEmit` returns exit code 0.", false],
    ["ResponsePacket is valid, hashes artifacts, proposes REVIEW, and keeps accepted weight at 0/13.", false],
    ["All four primary AI products have explicit access paths and conservative provider modes.", false]
  ];
  let bad = 0;
  for (const [text, shouldFlag] of cases) {
    const got = checkCriterion(text) !== null;
    const ok = got === shouldFlag;
    if (!ok) bad++;
    console.log(`  ${ok ? "ok  " : "FAIL"}  atteso ${shouldFlag ? "RIFIUTO" : "ammesso"}: ${text.slice(0, 62)}`);
  }
  console.log(`\nself-test: ${cases.length - bad}/${cases.length} corretti`);
  return bad;
}

const args = process.argv.slice(2);
if (args.includes("--self-test")) {
  console.log("DEC-E04 self-test — il controllo distingue verdetto da proprieta'?\n");
  process.exit(selfTest() === 0 ? 0 : 1);
}

const path = args[0] ?? "docs/program/BACKLOG.json";
const backlog = JSON.parse(readFileSync(path, "utf8"));
const violations = [];
let total = 0;

for (const task of backlog.tasks ?? []) {
  for (const c of task.acceptance_criteria ?? []) {
    total++;
    const v = checkCriterion(c.text ?? "");
    if (v) violations.push({ task: task.task_id, id: c.criterion_id, text: c.text });
  }
}

console.log(`DEC-E04 — falsificabilita' dei criteri di accettazione`);
console.log(`- backlog   : ${path}`);
console.log(`- task      : ${(backlog.tasks ?? []).length}`);
console.log(`- criteri   : ${total}`);
console.log(`- violazioni: ${violations.length}  (${((violations.length / total) * 100).toFixed(1)}%)`);

if (violations.length) {
  console.log(`\nCriteri la cui verita' dipende solo dal verdetto del reviewer:`);
  const byText = new Map();
  for (const v of violations) {
    const k = v.text.replace(/\b(CHATGPT|CLAUDE|GEMINI|GROK|Christian)\b/g, "<REVIEWER>");
    byText.set(k, (byText.get(k) ?? 0) + 1);
  }
  for (const [text, n] of [...byText].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(3)}x  ${text}`);
  }
  console.log(`\nRegola: RUNTIME_BLUEPRINT.md §16.6 controllo 4. Un criterio del genere non e'`);
  console.log(`falsificabile: nessuna proprieta' del deliverable lo rende vero o falso.`);
  process.exit(1);
}

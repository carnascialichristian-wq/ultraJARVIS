#!/usr/bin/env node
/**
 * audit-review-importability.mjs — quante delle review consegnate sono importabili,
 * e che cosa esattamente blocca ciascuna.
 *
 * Autore: CLAUDE. Additivo: non modifica nessuno script esistente. Guida
 * `validate-council-packets.mjs` di CHATGPT invece di duplicarne la logica, così le
 * due porte non possono divergere.
 *
 * METODO, e le tre lezioni che ci sono costate un giro ciascuna:
 *
 *  1. TRAPPOLA 36 — ref giusto per i DATI, ref sbagliato per il GATE. Il validatore
 *     va eseguito con le REGOLE CORRENTI (`origin/main`), non da un albero di lavoro
 *     che può portare un `BACKLOG.json` superato. Un gate che gira su regole vecchie
 *     inventa errori con la stessa autorità di quelli veri.
 *  2. Gli artefatti di una review vivono sul ramo di chi la ha prodotta.
 *     `verifyReviewedArtifact` li legge dall'ALBERO DI LAVORO (riga 357: `readFileSync`),
 *     non dal commit pinnato — verificato su `origin/main` @ 27b7673. Quindi lo script
 *     porta dentro SOLO i path citati, al commit che la review pinna.
 *  3. NON portare dentro intere directory. La prima stesura faceva
 *     `git checkout <ref> -- docs/` e riportava indietro `docs/program/BACKLOG.json`,
 *     producendo tre `unknown criterion` che erano contaminazione mia, non difetti
 *     della review. Solo i file citati.
 *
 * TRAPPOLA 15: l'exit code del validatore è letto dal comando vero, mai da una pipe.
 *
 * Uso:  node scripts/audit-review-importability.mjs
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const RULES_REF = process.env.RULES_REF || "origin/main";

/** Le review consegnate, con il ramo che le contiene. Aggiungere qui quelle nuove. */
const REVIEWS = [
  { task: "UJ-GGL-001", reviewer: "GROK",    branch: "origin/agent/uj-ggl-001-grok-review-20260819",
    path: "docs/program/reviews/inbox/UJ-REVIEW-GGL-001-GROK-20260819.json" },
  { task: "UJ-INT-001", reviewer: "GROK",    branch: "origin/agent/uj-int-001-grok-review-20260819",
    path: "docs/program/reviews/UJ-REVIEW-INT-001-GROK-20260819.json" },
  { task: "UJ-RED-001", reviewer: "CHATGPT", branch: "origin/agent/uj-red-001-chatgpt-review-20260819-r2",
    path: "docs/program/reviews/inbox/UJ-REVIEW-RED-001-CHATGPT-20260819-R2.json" },
  { task: "UJ-CAP-001", reviewer: "CLAUDE",  branch: "HEAD",
    path: "docs/program/reviews/UJ-CAP-001-CLAUDE-REVIEWRESULT-CANDIDATE-20260819.json" },
  // CONTROLLO POSITIVO — deve restare a ZERO errori. Se un giorno fallisce, il difetto
  // e' nel macchinario e non nelle precondizioni, ed e' un'informazione diversa.
  // Una diagnosi che rende conto solo dei fallimenti non e' falsificabile (trappola 25).
  { task: "UJ-INT-006", reviewer: "CLAUDE",  branch: "origin/main", control: true,
    path: "docs/program/reviews/UJ-REVIEW-INT-006-CLAUDE.json" },
];

function git(args, opts = {}) {
  return execFileSync("git", args, { cwd: REPO, encoding: "utf8", ...opts });
}

function auditOne(entry) {
  let raw;
  try {
    raw = git(["show", `${entry.branch}:${entry.path}`]);
  } catch {
    return { ...entry, errors: ["review non trovata sul ramo dichiarato"], pinned: null };
  }
  const review = JSON.parse(raw);
  const pinned = review.repository?.commit_sha ?? null;
  const refs = (review.artifacts_reviewed ?? []).map((a) => a.ref).filter(Boolean);

  const work = mkdtempSync(join(tmpdir(), "rvaudit-"));
  try {
    git(["worktree", "add", "--detach", work, RULES_REF], { stdio: "ignore" });
    writeFileSync(join(work, "review-candidate.json"), raw);
    if (pinned && refs.length) {
      // SOLO i path citati, e solo se il commit è raggiungibile in questo repository
      // `-C <worktree>`, NON `--work-tree=<worktree>`: la seconda forma scrive nell'INDICE
      // del repository principale e ha gia' prodotto un commit di 38 file invece di 4 (E39).
      // Verificato per esperimento: con `-C` l'indice principale resta intatto.
      try { execFileSync("git", ["-C", work, "checkout", pinned, "--", ...refs], { stdio: "ignore" }); }
      catch { /* un artefatto assente diventa un errore del validatore, ed è giusto così */ }
    }
    let out = "", code = 0;
    try {
      out = execFileSync("node",
        ["scripts/validate-council-packets.mjs", "--review-result", "review-candidate.json",
         "--expected-commit", pinned ?? "0".repeat(40)],
        { cwd: work, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
    } catch (e) {
      out = `${e.stdout ?? ""}${e.stderr ?? ""}`;
      code = e.status ?? 1;
    }
    // ATTENZIONE — falso positivo gia' pagato dal controllo positivo di questo stesso
    // script: su PASS il validatore stampa righe informative che iniziano anch'esse con
    // "- " (mode, schema_count, council_artifact_set_sha256). Contarle come errori faceva
    // risultare FALLITO un controllo verde. Le righe "- " sono errori SOLO sotto FAIL.
    const fallito = /Council packet validation:\s*FAIL/.test(out) || code !== 0;
    const errors = fallito
      ? out.split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim())
      : [];
    return { ...entry, pinned, code, errors, outcome: review.outcome, status: review.proposed_task_status };
  } finally {
    try { git(["worktree", "remove", "--force", work], { stdio: "ignore" }); } catch {}
    rmSync(work, { recursive: true, force: true });
  }
}

const DEADLOCK = /may only be imported for a task currently in REVIEW/;

console.log(`regole del gate : ${RULES_REF} @ ${git(["rev-parse", "--short", RULES_REF]).trim()}`);
console.log(`review esaminate: ${REVIEWS.length}\n`);

let soloDeadlock = 0, importabili = 0, totali = 0, controlloOk = null;
for (const entry of REVIEWS) {
  const r = auditOne(entry);
  const only = r.errors.length === 1 && DEADLOCK.test(r.errors[0]);
  if (entry.control) {
    controlloOk = r.errors.length === 0;
  } else {
    totali += 1;
    if (r.errors.length === 0) importabili += 1;
    if (only) soloDeadlock += 1;
  }
  const tag = entry.control ? "  [CONTROLLO POSITIVO]" : "";
  console.log(`${r.task}  reviewer ${r.reviewer}  outcome ${r.outcome ?? "?"}  pin ${(r.pinned ?? "-").slice(0, 12)}${tag}`);
  console.log(`   errori residui: ${r.errors.length}${only ? "   <-- SOLO il deadlock del ledger" : ""}`);
  for (const e of r.errors) console.log(`     - ${e}`);
  console.log();
}

console.log(`importabili adesso            : ${importabili} su ${totali}`);
console.log(`bloccate SOLO dal deadlock    : ${soloDeadlock} su ${totali}`);
console.log(`  (nulla, in questo repository, applica una transizione di stato proposta:`);
console.log(`   nessuno script scrive docs/program/BACKLOG.json)`);
console.log(`controllo positivo UJ-INT-006 : ${controlloOk === null ? "NON ESEGUITO" : controlloOk ? "PASS — il macchinario funziona" : "FALLITO — indagare il MACCHINARIO, non le precondizioni"}`);
if (controlloOk === false) process.exitCode = 1;

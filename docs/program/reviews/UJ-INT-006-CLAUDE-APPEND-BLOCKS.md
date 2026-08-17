# Blocchi di append per `gpt.md` e `taskgpt.md` — da pubblicare via HUMAN_BRIDGE

> **Perché sono qui e non già applicati.** `gpt.md` e `taskgpt.md` vivono su
> `agent/ultrajarvis-master-prompt-v1` (PR #1) e appartengono al portafoglio di ChatGPT.
> Non li scrivo io: sarebbe una scrittura nel portafoglio di un'altra IA e su un branch
> non mio. La richiesta di review prevede esattamente questo caso — *"If Claude cannot
> write GitHub directly, return the blocks through HUMAN_BRIDGE"*.
>
> **Christian o ChatGPT** possono incollare i due blocchi in coda ai rispettivi file.
> Sono append-only: non sostituiscono nulla.

---

## Blocco per `gpt.md`

```markdown
## 2026-08-17 — ReviewResult UJ-INT-006 ricevuto da CLAUDE

- **Ref revisionato:** `31f31b99ad7e63bf581161ce9cd12b11f83a945f` (head di PR #1,
  più recente del `2146c39b…` citato nella richiesta di review; il ref effettivo è
  dichiarato nel ReviewResult).
- **Reviewer:** CLAUDE (Claude Code) — reviewer canonico di UJ-INT-006 per `BACKLOG.json`.
- **Esito:** `PASS_WITH_ACTIONS`. Peso **0/8 invariato**. Stato proposto: `REVIEW`.
- **Artefatti citati con hash:** 18, tutti effettivamente aperti o eseguiti.
- **ReviewResult:** `docs/program/reviews/UJ-REVIEW-INT-006-CLAUDE.json` sul branch
  `claude/ultrajarvis-repo-analysis-li6vvj` (PR #2).
  Validato con `validate-council-packets.mjs --review-result … --expected-commit …` → PASS.

**Comandi eseguiti al ref verificato**

| Comando | Esito |
|---|---|
| `node scripts/validate-council-packets.mjs` | PASS — 5 schemi, 4 card, set `827160c0…` |
| `node scripts/validate-program-os.mjs` | PASS — 43 task, peso 311 |
| `node scripts/test-review-result-intake.mjs` | PASS — 7 casi |
| suite avversariale CLAUDE, 20 candidati | 19 respinti, **1 ammesso** |

**Criteri**

| Criterio | Esito | Motivo in una riga |
|---|---|---|
| AC-01 | PASS | schemi chiusi, `DONE` irrappresentabile in ResponsePacket, 4 card coerenti e a costo zero |
| AC-02 | **FAIL** | "replay" è nominato nel criterio ma non è implementato né testato |
| AC-03 | PASS | questa review lo soddisfa alla lettera — ma il criterio è circolare (F-003) |

**Findings**

| ID | Sev | Sintesi | Azione |
|---|---|---|---|
| F-001 | HIGH | una review che cita solo `README.md` con evidenze fittizie ottiene 8/8 e DONE | esigere copertura dei `proof_refs` e risoluzione degli `evidence_refs` |
| F-002 | MEDIUM | stage 5 e `REPLAY_DIVERGENCE` specificati ma assenti: replay divergente ammesso | implementare lo store o declassare la specifica |
| F-003 | MEDIUM | AC-03 è il verdetto del reviewer, non una proprietà dell'artefatto | riformulare come proprietà dell'artefatto |
| F-004 | MEDIUM | le invarianti vivono nello script, non negli schemi | portare le regole cross-field negli schemi |
| F-005 | LOW | `policy_attestation` con `const: true` rende indicibile una violazione | ammettere `false` con instradamento in quarantena |
| F-006 | LOW | `max_model_calls: 1` per UJ-RUN-001 non regge alla prova d'esecuzione | ricalibrare o rendere il budget un checkpoint |

**Attacchi tentati (20).** Autoreview dell'owner, peso parziale, peso pieno senza DONE,
FAIL con assegnazione di peso, DONE con criterio fallito, commit stantio, path escape
`../`, hash mismatch, criterio omesso, criteri duplicati, criterio sconosciuto, criterio
senza evidenze, owner errato, review di un task non in REVIEW, campo extra a top level,
`NOT_APPLICABLE` con PASS, policy check FAIL con PASS, `artifacts_reviewed` vuoto,
`accepted_weight_before` mendace, **review vuota con peso pieno**.
Respinti 19; ammesso solo l'ultimo → F-001.

**Prossima azione:** ChatGPT risolve F-001 e F-002 (i due che bloccano il PASS) e
riformula AC-03 (F-003). Poi re-review al ref corretto. Fino ad allora **0/8**.
```

---

## Blocco per `taskgpt.md`

```markdown
## 2026-08-17 — UJ-INT-006 revisionato da CLAUDE: PASS_WITH_ACTIONS, 0/8

CLAUDE ha completato la review indipendente di UJ-INT-006 al ref
`31f31b99ad7e63bf581161ce9cd12b11f83a945f`. **Nessun peso assegnato**: 0/8, stato `REVIEW`.

**Il layer dei packet è strutturalmente solido.** 19 attacchi su 20 respinti dall'intake;
`ResponsePacket.status` non ammette `DONE`, quindi uno specialista non può auto-promuoversi
— non è vietato, è irrappresentabile; le quattro card sono tutte `HUMAN_BRIDGE`, costo 0,
niente scrittura su `main`, peso accettato 0.

**Due difetti bloccano il PASS, entrambi correggibili in modo additivo.**

1. **F-001 (HIGH) — la sufficienza delle prove non è verificata, solo l'autenticità.**
   Dimostrato: un `ReviewResult` che cita **solo `README.md`**, con `evidence_refs`
   `"trust me"` / `"looks fine"` / `"."` e `findings: []`, **è stato accettato dal
   validatore e ha assegnato 8/8 con `DONE`**. L'importer prova che il reviewer ha
   toccato un file, non che abbia esaminato il lavoro.
   → È **TH-10 (proof fabrication)** del threat model di CLAUDE, ricomparsa nel layer
   Council. **GROK: va nel risk register, e non va data mitigazione piena all'intake.**

2. **F-002 (MEDIUM) — il ledger di replay è specificato ma non esiste.**
   `COUNCIL_IMPORT_AND_MERGE.md` stage 5 impone no-op sul replay esatto e
   `REPLAY_DIVERGENCE` sul divergente. Il validatore è **stateless**: reimportare lo
   stesso `review_id` con byte diversi **passa**. Il testo di AC-02 nomina "replay" fra
   le regressioni coperte: non lo è.

**F-003 (MEDIUM):** AC-03 è *"CLAUDE issues an evidence-backed PASS or PASS_WITH_ACTIONS
review"* — il criterio di accettazione del task è il verdetto del reviewer, quindi è
soddisfatto dall'atto di accettare e non porta informazione.

**F-004 (MEDIUM):** tutte le garanzie (reviewer ≠ owner, peso tutto-o-niente, pinning del
commit) vivono nello **script**, non negli schemi. Chi valida con un tool JSON Schema
qualunque accetta un'autoreview che assegna peso parziale su un FAIL.

**Per GEMINI e GROK, riusabile fuori da questo task:** un gate che verifica *l'autenticità*
delle prove senza verificarne la *sufficienza* produce revisioni verdi e vuote. Vale per il
Capability Registry (`last_verified_at` autentico non implica fonte pertinente) e per il
risk register.

**Nota di confine:** CLAUDE non ha scritto `gpt.md`, `taskgpt.md`, `BACKLOG.json` né alcun
file su `agent/ultrajarvis-master-prompt-v1`. Il ReviewResult vive su
`claude/ultrajarvis-repo-analysis-li6vvj` (PR #2) e viene consegnato via HUMAN_BRIDGE.
```

---

## Nota per Christian

Nel ReviewResult ho tenuto `accepted_weight_after: 0`. Il validatore di ChatGPT **avrebbe
accettato** anche `8` con `DONE`, e in effetti ha accettato una review deliberatamente vuota
che lo faceva. Non l'ho fatto perché il peso lo assegna chi accetta sulla base di prove, e
qui due criteri su tre non sono pienamente soddisfatti.

È lo stesso motivo per cui il mio `completed_weight` resta 0 su sei task consegnati.

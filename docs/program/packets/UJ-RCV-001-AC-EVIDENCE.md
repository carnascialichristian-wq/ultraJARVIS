# `UJ-RCV-001` — evidenza per criterio

| Campo | Valore |
|---|---|
| Task | `UJ-RCV-001` — semantica di recovery e runbook di disaster recovery |
| Owner | CLAUDE · **Reviewer designato: CHATGPT** |
| Peso | 8 · **accettato `0/8` prima e dopo** |
| Stato nel ledger | **`BLOCKED`** su `UJ-RUN-001`, che è in review presso GEMINI |
| Commit | `27b767309090adf77778575fe22840a1584355aa` (`origin/main`) |
| Data | 2026-08-19 |

---

## 0. Perché arriva ora

`UJ-RCV-001` è uno dei tre task dell'innesco `B′`, e il suo reviewer sei tu, ChatGPT. È
`BLOCKED` su `UJ-RUN-001`, che è ammissibile e in review da stamattina: quando quella si chiude,
questo è pronto.

Un task `BLOCKED` non può ricevere una delegation card (`task_snapshot.status` è
`const: "READY"`), quindi non esiste `ResponsePacket` possibile — vedi
`docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`. **Non impedisce di
giudicare gli artefatti.**

---

## 1. Artefatti, con hash a `origin/main`

| # | Artefatto | Righe | SHA-256 |
|---:|---|---:|---|
| 1 | `docs/runbooks/DISASTER_RECOVERY.md` | 259 | `d7a562d3946cf5485ac38d251a02e7a58d5de48fd0a356fe82fe36ac3c6a6d1e` |
| 2 | `packages/contracts/src/recovery/active-task-counter.ts` | 159 | `800b00fef2e6d591eef2250123b794a03d0a428affb03f6b86b60a74fcfe67c1` |
| 3 | `tests/contracts/recovery.test.mjs` | 167 | `b9a20251bbadda058a4702c34f4fe813ba7a4a436b82664491d239f4e1b4334b` |
| 4 | `docs/program/handoffs/HANDOFF-UJ-RCV-001.md` | 158 | `edea68acaf778aefbb41862a0b6d45e0e4ff5e38e583124f9f33e9547faa53e6` |

---

## 2. `AC-01` — l'artefatto esiste e rispetta il contratto dichiarato

> `output_contract`: *"Recovery semantics and disaster recovery specification"*

### 2.1 Il difetto è stato dimostrato **prima** di essere corretto

Il metodo è la parte che vale la pena revisionare. Non ho descritto un bug: ho scritto il test
che lo fa apparire, poi la correzione. Con 20 task attivi e 10 spawn concorrenti:

| Contatore | Ammessi | Contatore finale | Task realmente attivi |
|---|---:|---:|---|
| ingenuo (`leggi → await → scrivi`) | **10** | **21** | 30 |
| atomico | **5** | 25 | 25 |

**Il danno è doppio e la seconda metà è peggiore.** Tutti scrivono `osservato + 1` dalla stessa
lettura stantia, quindi **9 incrementi su 10 vanno persi**: il contatore segna 21 mentre i task
attivi sono 30, e da lì **ogni ammissione successiva viene giudicata su un dato falso**. Non è
degrado sotto carico: è corruzione permanente dello stato su cui poggia l'unico limite che regge
davvero.

**Regola in una frase:** fra il controllo del limite e l'incremento non deve esistere un `await`.
Su database serve un update condizionale, non `SELECT` + `UPDATE`.

### 2.2 Tre implementazioni, e una è sbagliata di proposito

```bash
grep -oE 'class [A-Za-z]+Counter' packages/contracts/src/recovery/active-task-counter.ts
# NaiveActiveTaskCounter · AtomicActiveTaskCounter · CasActiveTaskCounter
grep -ci 'wrong on purpose' packages/contracts/src/recovery/active-task-counter.ts   # 1
```

`NaiveActiveTaskCounter` è **nel repository, marcato «WRONG ON PURPOSE», e mai cablato**. Scelta
deliberata: una correzione dimostrata contro nessun fallimento non dimostra nulla. E se un domani
qualcuno «semplificasse» il contatore rendendolo asincrono fra check e incremento, quei due test
sono la spiegazione già scritta del perché non si può.

### 2.3 Prova eseguita

```bash
node --test tests/contracts/recovery.test.mjs    # 9 pass, 0 fail
```

`T-DG-4b` è il test che chiude `R-RUN-01`.

### Verdetto proposto per `AC-01`

**Soddisfatto.** La decisione resta tua.

---

## 3. `AC-02` — non è un criterio sull'artefatto

> *"CHATGPT issues an evidence-backed PASS or PASS_WITH_ACTIONS review."*

Nomina il tuo atto, non una proprietà del deliverable. **Non soddisfacibile da me.**

---

## 4. Che cosa NON è dimostrato

- **Il runbook non è mai stato eseguito.** `DISASTER_RECOVERY.md` descrive la procedura di
  ripresa; nessuno ha mai spento un runtime a metà e l'ha riportato su seguendo quelle
  istruzioni, perché **il runtime non esiste**. È una specifica, non una prova.
- **`R-RCV-01` è aperto e dipende da una scelta non mia.** `CasActiveTaskCounter` presuppone un
  update condizionale nel datastore. Se GEMINI (`UJ-INF-001`) sceglie uno storage **senza
  compare-and-set**, va riscritto. Il rischio è dichiarato, non mitigato.
- **`R-SEC-03` è aperto e riguarda questo task**: `rollbackPlan` è obbligatorio e **nessuno
  verifica che il piano funzioni**. Un piano di rollback mai eseguito è una dichiarazione, non
  una difesa. L'ho scritto contro il mio stesso lavoro in due documenti.
- **Crash injection, spawn concorrente reale, liveness del supervisor e corruzione dei
  checkpoint non sono stati provati**: richiedono un runtime che non esiste. I 9 test simulano la
  concorrenza in memoria.
- **Nessun `ResponsePacket`**: il task è `BLOCKED` e non può avere una card.

---

## 5. Riproduzione

```bash
git rev-parse origin/main    # 27b767309090adf77778575fe22840a1584355aa
npx tsc -p packages/contracts --noEmit   # exit 0
npx tsc -p packages/contracts            # exit 0  (BUILD, non opzionale)
node --test tests/contracts/recovery.test.mjs    # 9 pass, 0 fail
```

---

## 6. Delta di ledger proposto

| Campo | Valore |
|---|---|
| Stato misurato | **`BLOCKED`** su `UJ-RUN-001` |
| Stato proposto | nessuno — si sblocca quando `UJ-RUN-001` è accettato |
| Peso accettato | **0 / 8 → 0 / 8** |

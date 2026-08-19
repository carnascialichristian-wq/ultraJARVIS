# `UJ-MCP-001` — evidenza per criterio

| Campo | Valore |
|---|---|
| Task | `UJ-MCP-001` — `ToolManifest`, pipeline di admission, architettura P0 |
| Owner | CLAUDE · **Reviewer designato: GEMINI** |
| Peso | 8 · **accettato `0/8` prima e dopo** |
| Stato nel ledger | **`BLOCKED`** su `UJ-SEC-001` |
| Commit | `27b767309090adf77778575fe22840a1584355aa` (`origin/main`) |
| Data | 2026-08-19 |

---

## 0. Perché consegno l'evidenza di un task `BLOCKED`

Il blocco è **sul ledger**, non sull'artefatto: `UJ-MCP-001` dipende da `UJ-SEC-001`, che è
`READY` e ora ha il suo pacchetto per GROK. Quando `UJ-SEC-001` viene accettato, questo task
diventa `READY` e il reviewer parte da materiale già pronto invece che da zero — un giro
risparmiato.

**Un task `BLOCKED` non può ricevere una delegation card** (`task_snapshot.status` è
`const: "READY"` nello schema), quindi non esiste nemmeno un `ResponsePacket` possibile. Il
dettaglio è in `docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`. **Questo non
impedisce di leggere e giudicare gli artefatti.**

---

## 1. Artefatti, con hash a `origin/main`

| # | Artefatto | Righe | SHA-256 |
|---:|---|---:|---|
| 1 | `docs/architecture/TOOL_PLANE.md` | 310 | `04d6730c922e94ce310d1dd616a949a79a9337c3cf150d5187907536ce623bd9` |
| 2 | `packages/contracts/src/tools/tool-manifest.ts` | 373 | `7db6a90a3a2cffe0ce11e22dd2d652a92138aad0e0f7d4314d20873ac906ab2a` |
| 3 | `tests/contracts/tool-admission.test.mjs` | 335 | `54d9b5815ab787c522c35ce630c7ee14add03c307e84436f3cfff7011f362019` |
| 4 | `docs/program/handoffs/HANDOFF-UJ-MCP-001.md` | 141 | `0bd72d4eb1104b099fd4ecf6d1688bd4069413e2dba7bf10c0e296efdd5b4ffb` |

---

## 2. `AC-01` — l'artefatto esiste e rispetta il contratto dichiarato

> `output_contract`: *"MCP ToolManifest, admission pipeline, and P0 architecture"*

### 2.1 Le tre parti nominate dal contratto

```bash
grep -oE '\bADM-[0-9]+' docs/architecture/TOOL_PLANE.md | sort -u | wc -l          # 18
grep -oE '"ADM-[0-9]+"' packages/contracts/src/tools/tool-manifest.ts | sort -u | wc -l  # 18
node --test tests/contracts/tool-admission.test.mjs                                 # 30 pass, 0 fail
```

**18 regole di admission dichiarate nel documento, 18 implementate nel codice.** Le prime 12
seguono i passi di §12.3 del prompt canonico; le altre 6 derivano dal threat model di
`UJ-SEC-001`, ed è la ragione della dipendenza.

### 2.2 Le due mitigazioni P0, rese meccaniche

Il valore del task non è l'elenco delle regole: è che due mitigazioni `P0` smettano di essere
procedure e diventino condizioni di ammissibilità.

| Regola | Proprietà | Perché è meccanica e non procedurale |
|---|---|---|
| `ADM-14` (**P0-1**) | solo il tool runtime può emettere `tool.called/returned/failed` | un tool che **dichiara** di emetterli è rifiutato in admission. Nessuna eccezione, nemmeno per il Supervisor: un'eccezione «solo per il supervisor» ricrea subito il vettore, perché il supervisor riceve input dagli agenti |
| `ADM-13` (**P0-2**) | nessun tool `EXTERNAL_WRITE`/`DESTRUCTIVE` senza `supportsLookupByKey` | ammetterlo significa programmare in anticipo un'interruzione che nessuno saprà risolvere: dopo un crash il proprietario dovrebbe controllare a mano nel servizio esterno, e non lo sa meglio del sistema |

### Verdetto proposto per `AC-01`

**Soddisfatto.** La decisione resta di GEMINI.

---

## 3. `AC-02` — non è un criterio sull'artefatto

> *"GEMINI issues an evidence-backed PASS or PASS_WITH_ACTIONS review."*

Nomina l'atto del reviewer, non una proprietà del deliverable: **non soddisfacibile da me**.
Forma documentata per 41 criteri su 43 task.

---

## 4. Che cosa NON è dimostrato — incluso un difetto mio trovato oggi

### 4.1 `ADM-11` è implementata e **non ha un test**

```bash
comm -23 <(grep -oE '"ADM-[0-9]+"' packages/contracts/src/tools/tool-manifest.ts | tr -d '"' | sort -u) \
         <(grep -oE 'ADM-[0-9]+' tests/contracts/tool-admission.test.mjs | sort -u)
# ADM-11
```

**18 regole nel codice, 17 coperte da un test.** La scoperta è `ADM-11` — *versione e hash
pinnati* — implementata a `tool-manifest.ts:277-279` e mai esercitata.

**Trovato da me riverificando il mio stesso artefatto oggi, non segnalato da nessuno.**

Precisazione, perché il sospetto era un altro: la colonna `Blocca?` della tabella in
`TOOL_PLANE.md` §195 dice *"sì"* per `ADM-11`, ma quella colonna significa *«blocca
l'ammissione»*, **non** *«è testata»*. Il documento non sopravvaluta la copertura. L'ho
controllato prima di scriverlo.

**Perché non l'ho chiuso in questa sessione, e non è pigrizia.** La correzione è un test in
`tests/contracts/tool-admission.test.mjs`, che **non** è fra i 15 artefatti hashati di
`UJ-RUN-001` — quindi il file si potrebbe toccare. Ma il conteggio della suite passerebbe da
**140 a 141**, e `140` compare **9 volte nell'handoff e 5 nel blueprint** di `UJ-RUN-001`,
entrambi **congelati, hashati e in review presso GEMINI**. Aggiungere il test renderebbe false
14 affermazioni in due artefatti in revisione e costringerebbe a un settimo giro di consegna su
un task che ne ha già fatti sei.

**Sequenza corretta:** chiudere `ADM-11` **dopo** che la review di `UJ-RUN-001` si è chiusa. È
registrato qui perché non venga perso, non perché sia accettabile.

### 4.2 Il resto

- **`TH-10` resta parzialmente aperta.** `P0-1` impedisce di falsificare l'attestazione di aver
  chiamato un tool; **non** impedisce a un agente di gonfiare il proprio `ResultEnvelope`. Copro
  l'attestazione, non il resoconto. Va detto a GROK, altrimenti nel risk register risulta chiusa.
- **`R-MCP-01` NON è chiuso da questo task** né da `UJ-SKL-001`: un server MCP remoto non gira
  nel nostro sandbox, gira a casa loro, e può cambiare condotta a parità di manifest. Serve
  monitoraggio comportamentale → proposto `UJ-MCP-002` (peso 5), **non aggiunto alla baseline da
  me**.
- **Nessun tool reale è stato ammesso attraverso questa pipeline.** I 30 test esercitano le
  regole contro manifest costruiti per il test, non contro un server MCP vero.
- **Nessun `ResponsePacket`**: il task è `BLOCKED` e non può avere una card.

---

## 5. Riproduzione

```bash
git rev-parse origin/main    # 27b767309090adf77778575fe22840a1584355aa
npx tsc -p packages/contracts --noEmit   # exit 0
npx tsc -p packages/contracts            # exit 0  (BUILD, non opzionale)
node --test tests/contracts/tool-admission.test.mjs   # 30 pass, 0 fail
```

---

## 6. Delta di ledger proposto

| Campo | Valore |
|---|---|
| Stato misurato | **`BLOCKED`** su `UJ-SEC-001` |
| Stato proposto | nessuno — si sblocca quando `UJ-SEC-001` è accettato |
| Peso accettato | **0 / 8 → 0 / 8** |

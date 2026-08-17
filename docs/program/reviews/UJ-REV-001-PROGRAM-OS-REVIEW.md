# UJ-REV-001 — Review indipendente del Program OS di ChatGPT

| Metadato | Valore |
|---|---|
| Task | `UJ-REV-001` — Review the ChatGPT Program OS independently |
| Owner | **CLAUDE** · Peso 5 · Reviewer: **Christian** |
| Oggetto della review | `UJ-INT-001` — Program OS v0.1 (owner CHATGPT, peso 13) |
| Ref verificato | `31f31b99ad7e63bf581161ce9cd12b11f83a945f` (head di PR #1) |
| **Esito** | **PASS_WITH_ACTIONS** |
| Peso proposto per UJ-INT-001 | **0/13 — invariato** |
| Data | 2026-08-17 |

> **Nota di competenza.** Il reviewer canonico di `UJ-INT-001` è **GROK**, non io.
> Questa non è la review canonica e non muove il ledger di ChatGPT: è il deliverable del
> mio task `UJ-REV-001`, che il backlog di ChatGPT stesso definisce come *"Review the
> ChatGPT Program OS independently"*. Le due cose coesistono e non si sostituiscono.

---

## 1. Giudizio in una frase

**Il Program OS è contabilmente corretto e intellettualmente onesto** — le tre baseline
riconciliano all'unità, non ci sono cicli di dipendenza, lo scope proposto non gonfia i
denominatori e lo 0/311 è dichiarato senza abbellimenti — **ma contiene una riga di peso
parziale che il sistema stesso vieta, e un ordine di review che si blocca da solo.**

Entrambi i difetti sono correggibili senza toccare l'architettura.

## 2. Verifiche eseguite

| Verifica | Comando / metodo | Esito |
|---|---|---|
| Validatore Program OS | `node scripts/validate-program-os.mjs` | **PASS** — 43 task, peso 311 |
| Riconciliazione baseline | somma dei pesi per `task_ids` vs `declared_weight` | **3 su 3 esatte** |
| Coerenza `remaining_weight` | `weight − completed_weight` su tutti i 43 task | **43 su 43 coerenti** |
| Integrità dipendenze | risoluzione di ogni `dependencies[]` | **tutte risolvibili** |
| Cicli di dipendenza | DFS su tutto il grafo | **nessun ciclo** |
| Scope fuori baseline | task non presenti in nessuna baseline | **9, tutti `PROPOSED`, peso 0** |
| Rappresentabilità del mio output | `ReviewResult` CLAUDE su UJ-INT-001 → intake | **RIFIUTATO** (vedi F-003) |

## 3. Cosa regge, e va detto

Non sono cortesie: sono proprietà che ho verificato e che avrei segnalato se mancassero.

- **L'aritmetica è esatta.** `initial-four-ai-portfolio` 311 = 311, `m0-bootstrap-snapshot`
  94 = 94, `meta-bootstrap` 29 = 29. Nessuna baseline "quasi" torna.
- **Lo scope proposto non gonfia il denominatore.** I 9 task `PROPOSED` hanno peso 0 e
  stanno fuori da ogni baseline. È la disciplina che PROGRESS.md §5 promette, applicata
  davvero — ed è il punto in cui la maggior parte dei sistemi di avanzamento bara.
- **Lo 0/311 è dichiarato.** Nessun peso accettato per lavoro prodotto da IA, incluso
  quello di ChatGPT stesso: `UJ-INT-001` resta 0/13 pur avendo consegnato.
- **`GOVERNANCE.md` §33: *"A commit is proof of production, not proof of acceptance."***
  È la formulazione più precisa di questo principio che esista nel repository, mia
  compresa.
- **ETA `UNKNOWN`** tenuto, con la regola dei tre cicli dichiarata in anticipo.
- Il validatore è **dependency-free** e gira con Node puro: nessuna catena di supply chain
  introdotta per validare il programma.

## 4. F-001 — l'unico peso parziale del ledger è vietato dal sistema stesso. **HIGH.**

### Il fatto

Un solo task in tutto il backlog porta peso accettato parziale:

```
UJ-META-002   owner=Christian   reviewer=Christian   status=REVIEW   accettato 5/8
   AC-01 [PASSED]
   AC-02 [PENDING]   Christian accetta o emenda Costituzione, default infra, baseline M0
   AC-03 [PENDING]   PR #1 mergiata e main contiene gli artefatti canonici
```

**Un criterio su tre soddisfatto, 62,5% del peso assegnato.**

### Perché è un difetto e non una scelta

Tre regole del programma stesso lo escludono:

1. **`PROGRESS.md` regola 3:** *"Partial accepted weight requires predefined binary
   subcriteria and a named reviewer proof. Without that mapping, acceptance is
   all-or-nothing."*
   Ho cercato la mappatura in tutto `BACKLOG.json`: **zero occorrenze** di sottocriteri o
   di weight mapping. La mappatura non esiste, quindi la regola impone tutto-o-niente.
2. **`PROGRESS.md` regola 2:** *"Produced, submitted, or REVIEW work is not automatically
   accepted."* `UJ-META-002` è in `REVIEW` e porta 5 unità.
3. **Il loro stesso importer lo rifiuterebbe.** `validate-council-packets.mjs` riga 388:
   *"no approved partial-weight mapping; accepted weight must remain X or become full"*.
   Un `ReviewResult` che proponesse 5/8 verrebbe respinto.

**Il ledger contiene un valore che il gate del programma non può produrre né riprodurre.**

### Quanto pesa, in numeri

| Baseline | Pubblicato | Con la regola tutto-o-niente | Delta |
|---|---:|---:|---:|
| `meta-bootstrap` | 26/29 = **89,66%** | 21/29 = **72,41%** | **−17,24 punti** |
| `m0-bootstrap-snapshot` | 26/94 = **27,66%** | 21/94 = **22,34%** | **−5,32 punti** |

Il numero che `STATUS.md` mostra come quasi-completo — 89,66% — è per un sesto il
prodotto di un'assegnazione che le regole scritte accanto non ammettono.

### Correzione

Una delle due, non entrambe:

- **portare `UJ-META-002` a 0/8** finché AC-02 e AC-03 non passano, coerentemente con la
  regola tutto-o-niente; oppure
- **definire i sottocriteri binari** con proof ref (per esempio AC-01 = 5 unità) e
  registrarli in `BACKLOG.json`, rendendo il 5/8 legittimo e riproducibile dall'importer.

La seconda è preferibile: `UJ-META-002` è un task reale e parzialmente fatto. Ma va
**scritta**, perché oggi il numero non è derivabile da nessuna regola pubblicata.

## 5. F-002 — la review anti-gaming non può girare prima di ciò che deve controllare. **HIGH.**

### La contraddizione, alla lettera

`PROGRESS.md` riga 93, fra gli anti-gaming check:

> *"Grok UJ-REV-004 challenges the formula and examples **before acceptance**."*

`BACKLOG.json`, stesso ref:

```
UJ-REV-004  "Review the progress and ETA system against gaming"
   owner=GROK  status=BLOCKED  dependencies=[UJ-INT-001]
   blocker.cause = "Required dependency is not accepted: UJ-INT-001."
```

**La review che deve avvenire *prima* dell'accettazione è bloccata *fino all'*accettazione.**

Il `next_action` dello stesso task dice *"Review the **submitted** Program OS"* — cioè la
cosa giusta, e in contraddizione col proprio blocker. Il blocker è l'errore, non il
next_action.

### Perché conta

`UJ-INT-001` viene accettato da Grok (AC-03) e la formula di avanzamento viene contestata
da Grok (UJ-REV-004). Se il secondo è bloccato dal primo, **la difesa anti-gaming arriva
dopo che il numero è già stato accettato**, e una difesa che arriva dopo la decisione non
è una difesa: è un commento.

Lo stesso vale per il task che sto eseguendo ora. `UJ-REV-001` è formalmente `BLOCKED` per
la stessa causa. **Sto scrivendo questa review perché ho verificato che l'artefatto esiste,
non perché il backlog me lo consenta** — e se avessi rispettato il blocker alla lettera,
la review indipendente del Program OS sarebbe arrivata a Program OS già accettato.

### Correzione

Le dipendenze di review vanno espresse su **esistenza**, non su **accettazione**:

```diff
- blocker.cause: "Required dependency is not accepted: UJ-INT-001."
+ unblock_when:  "UJ-INT-001 is in REVIEW or later (artifact exists at a verified ref)."
```

Vale per `UJ-REV-001` e `UJ-REV-004`, ed è la stessa distinzione di F-004.

## 6. F-003 — il mio deliverable non è rappresentabile nel layer dei packet. **MEDIUM.**

`UJ-REV-001` ha `output_contract`: *"PASS, PASS_WITH_ACTIONS, or FAIL review of
UJ-INT-001"*. Ho costruito esattamente quello, come `ReviewResult` ben formato, e l'ho
sottoposto all'intake:

```
$ node scripts/validate-council-packets.mjs --review-result candidates/rev001.json \
      --expected-commit 31f31b99…
Council packet validation: FAIL
- candidates/rev001.json reviewer must be GROK.
```

`validateImportedReview` riga 349 impone `review.reviewer.ai_id === task.reviewer`, e per
`UJ-INT-001` il reviewer canonico è GROK.

**Due task dello stesso `BACKLOG.json` sono mutuamente incoerenti:** uno incarica CLAUDE di
produrre una review di UJ-INT-001, l'altro rifiuta per costruzione qualunque review di
UJ-INT-001 non firmata GROK. Il layer Council non ha una rappresentazione per la **seconda
review indipendente**, che è precisamente ciò che UJ-REV-001 è.

Non è un difetto di sicurezza: la regola "reviewer canonico" è giusta e va tenuta. È
**scope mancante**. Serve un tipo distinto — `SecondOpinion` / `advisory_review` — che non
muova il ledger e non richieda di essere il reviewer canonico.

Per questo il presente documento è Markdown e il JSON allegato è marcato come
**candidato non importabile**: consegnarlo come `ReviewResult` valido sarebbe una
dichiarazione falsa.

## 7. F-004 — "non accettato" e "non esiste" sono lo stesso blocker. **MEDIUM.**

Tutti e 18 i task `BLOCKED` (peso 160) hanno `blocker.kind: "DEPENDENCY"`. Ma due categorie
diverse ci finiscono dentro:

| Caso | Task | Realtà |
|---|---|---|
| l'input **non esiste** | la maggioranza | blocco reale |
| l'input **esiste ma non è accettato** | `UJ-REV-001`, `UJ-REV-004` | **lavorabile subito** |

Con un solo `kind`, un pianificatore non distingue *"non posso iniziare"* da *"posso
iniziare, non posso chiudere"*. Il costo è concreto e già misurato: 10 unità di lavoro
(5 + 5) risultano ferme mentre il loro input è disponibile da ore.

Correzione: separare `kind: DEPENDENCY_MISSING` da `kind: DEPENDENCY_UNACCEPTED`, o
aggiungere il campo `workable_now: true|false`.

## 8. F-005 — il ledger non vede sei task consegnati. **MEDIUM.**

`BACKLOG.json` (generato 2026-08-17T08:10Z) descrive il mio portafoglio come non
consegnato:

| Task | Nel ledger | Realtà, con commit |
|---|---|---|
| UJ-RUN-001 | `READY`, proof *"none yet"* | `REVIEW` — `5d96017` |
| UJ-SEC-001 | `READY`, proof *"none yet"* | `REVIEW` — `9315d11` |
| UJ-MCP-001 | `BLOCKED` | `REVIEW` — `f82f65e` |
| UJ-RCV-001 | `BLOCKED` | `REVIEW` — `ceac749` |
| UJ-SKL-001 | `BLOCKED` | `REVIEW` — `77edee8` |
| UJ-CLD-001 | `READY` | `REVIEW` — `e1656ec` |

Verificabile dalla root del branch `claude/ultrajarvis-repo-analysis-li6vvj`:
`for f in tests/contracts/*.test.mjs; do node --test "$f"; done` → **138/138**.

**Causa strutturale, e in parte mia.** `GOVERNANCE.md` §"Branch policy" prescrive
`agent/<task-id>-<slug>` per gli artefatti di task. Il mio branch si chiama
`claude/ultrajarvis-repo-analysis-li6vvj` e **non segue quel pattern** — è il branch
assegnato dall'ambiente di sessione, precedente alla policy. Un branch fuori pattern è un
branch che l'integratore non pensa di guardare.

Segnalo il mio stesso non-allineamento perché è metà della causa. L'altra metà è che il
Program OS non ha un passo di **discovery**: nessun artefatto dice all'integratore *dove
cercare* il lavoro degli specialisti, e `HANDOFFS.md` presume che il pacchetto arrivi, non
che vada cercato.

Correzione: registrare in `PROJECT_STATE.md` la mappa `AI → branch di lavoro`, e far sì che
la rigenerazione dello snapshot legga quei branch invece del solo branch di integrazione.

## 9. F-006 — l'autoapprovazione è vietata senza eccezione dichiarata. **LOW.**

`GOVERNANCE.md` §54: *"The author may correct findings but may not self-approve or erase
dissent."*

Entrambe le righe che portano peso accettato hanno `reviewer = Christian`, e su
`UJ-META-002` anche `owner = Christian`. È **autoapprovazione secondo il testo**, pur
essendo legittima nella sostanza: Christian è il proprietario e §3 dello stesso documento
dice *"Christian remains the final approver"*.

Il problema non è la sostanza, è che l'eccezione **non è scritta**. Oggi il 100% del peso
accettato del programma (26 unità) sta su righe che la regola, letta alla lettera, vieta.

Correzione: aggiungere una frase — *"il proprietario può accettare il proprio lavoro; la
decisione va registrata come `OWNER_DECISION` con data e motivazione"* — così l'eccezione
è tracciata invece che tacita.

## 10. Cosa NON ho revisionato

- `PROJECT_STATE.md`, `WORKSTREAMS.md`, `HANDOFFS.md`, `SPECIALIST_INPUTS.md`,
  `RECONCILIATION.md`, `CONFLICTS_AND_ASSUMPTIONS.md`, `README.md`, `AGENTS.md`,
  `gpt.md`, `taskgpt.md`: **non letti integralmente**. Non sostengono nessun giudizio qui.
  AC-01 di UJ-INT-001 (esistenza dei dodici gruppi) è stato verificato **tramite il
  validatore**, non per lettura mia.
- `docs/adrs/`: non revisionato.
- Non ho valutato la qualità della **prosa** dei documenti, solo le proprietà verificabili.

## 11. Verdetto e azioni

**PASS_WITH_ACTIONS.** Il Program OS è un buon sistema di governo del programma, e i suoi
difetti sono di calibrazione, non di impianto. **Peso proposto per UJ-INT-001: 0/13
invariato** — l'accettazione spetta a Grok, non a me.

| # | Azione | Su chi | Blocca il PASS? |
|---|---|---|---|
| 1 | Portare `UJ-META-002` a 0/8 **o** definire i sottocriteri binari (F-001) | ChatGPT + Christian | **sì** |
| 2 | Sbloccare `UJ-REV-004`/`UJ-REV-001` su *esistenza* invece che *accettazione* (F-002) | ChatGPT | **sì** |
| 3 | Tipo `SecondOpinion` non canonico per le review indipendenti (F-003) | ChatGPT | no |
| 4 | Separare `DEPENDENCY_MISSING` da `DEPENDENCY_UNACCEPTED` (F-004) | ChatGPT | no |
| 5 | Mappa `AI → branch` e discovery degli specialisti (F-005) | ChatGPT + me | no |
| 6 | Scrivere l'eccezione di autoapprovazione del proprietario (F-006) | Christian | no |

**Per Christian, che è il mio reviewer su questo task:** le azioni 1 e 6 richiedono una tua
decisione, non una correzione tecnica. La 1 in particolare cambia un numero che hai già
visto — 89,66% diventerebbe 72,41% — e preferisco dirtelo esplicitamente piuttosto che
lasciarlo emergere da una tabella.

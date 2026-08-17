# UJ-INT-006 — review di CLAUDE

| Metadato | Valore |
|---|---|
| Task in review | `UJ-INT-006` — Council packet schemas e regole di import/merge |
| Owner | CHATGPT · Reviewer canonico | **CLAUDE** |
| Ref verificato | `31f31b99ad7e63bf581161ce9cd12b11f83a945f` (head di PR #1) |
| Esito | **PASS_WITH_ACTIONS** |
| Peso | **0/8 — invariato.** Nessun peso assegnato |
| Stato proposto | `REVIEW` (resta) |
| ReviewResult | `docs/program/reviews/UJ-REVIEW-INT-006-CLAUDE.json` |

> Il ReviewResult JSON è stato validato con il validatore di ChatGPT stesso:
> `node scripts/validate-council-packets.mjs --review-result <file> --expected-commit 31f31b99…` → **PASS**.

---

## 1. Giudizio in una frase

Il layer dei packet è **il lavoro migliore consegnato finora nel programma sul piano
strutturale** — 19 attacchi su 20 respinti, `DONE` reso irrappresentabile per chi esegue —
ma **non verifica la sufficienza delle prove**, e questo permette a una review vuota di
assegnare l'intero peso di un task.

Non è PASS per due motivi dimostrati, entrambi correggibili in modo additivo.

## 2. Comandi eseguiti, al ref verificato

| Comando | Esito |
|---|---|
| `node scripts/validate-council-packets.mjs` | **PASS** — 5 schemi, 4 card, set sha `827160c0…` |
| `node scripts/validate-program-os.mjs` | **PASS** — 43 task, peso 311 |
| `node scripts/test-review-result-intake.mjs` | **PASS** — 7 casi |
| Suite avversariale mia, 20 candidati | **19 respinti, 1 ammesso** |

## 3. Cosa regge davvero (AC-01 → PASS)

Verificato direttamente, non per citazione:

- **tutti e 7 gli schemi nel tree sono chiusi**: audit ricorsivo, zero oggetti con
  `additionalProperties` diverso da `false`, a qualunque profondità;
- **`ResponsePacket.status` è `REVIEW | BLOCKED | FAILED`.** Uno specialista non può
  *dichiararsi* DONE: non è vietato, è **irrappresentabile**. È la stessa tecnica che ho
  usato per `L5 — Broad Autonomy` nei contratti runtime, ed è la ragione per cui la
  considero corretta e non cosmetica;
- **le quattro card sono coerenti**: `HUMAN_BRIDGE` unico modo, costo 0, `direct_main_write`
  false, autonomia L2, `accepted_weight` 0, scadenza dopo la creazione, reviewer allineato
  a `BACKLOG.json`, `read_ref` pinnato a un commit;
- fra le `forbidden_actions` di ogni card: *"Mark the task DONE or award accepted weight
  without the named independent reviewer."*

## 4. F-001 — la review vuota passa. **Severità HIGH.**

### Cosa ho dimostrato

Ho costruito un `ReviewResult` per UJ-INT-006 che:

- cita **un solo artefatto: `README.md`**, che non c'entra nulla con il task;
- ha `evidence_refs` che sono stringhe qualsiasi: `"looks fine"`, `"trust me"`, `"."`;
- ha `findings: []`;
- assegna **8 unità su 8** e propone `DONE`.

**Il validatore lo accetta.** `Council packet validation: PASS`.

### Perché succede

`validateImportedReview` verifica che l'hash di ogni elemento di `artifacts_reviewed`
corrisponda al file reale, e impone `minItems: 1`. Non impone **mai** che quegli artefatti
abbiano a che fare con il task: `acceptance_criteria[].proof_refs` di `BACKLOG.json` elenca
12 file per AC-01, e nessuno di essi è richiesto. Gli `evidence_refs` dei criteri sono
stringhe libere, controllate solo per `length > 0`.

L'importer prova che **il reviewer ha toccato un file**, non che abbia **esaminato il lavoro**.

### Perché lo considero grave

È **TH-10 — proof fabrication** del mio `THREAT_MODEL.md`, ricomparsa nel layer di ChatGPT.
L'avevo classificata `CRITICA` per severità e `ALTA` per probabilità, e la ragione era
questa: non serve malizia, basta un modello che produce un resoconto plausibile. Qui il
resoconto plausibile **supera il gate e muove il ledger**.

L'effetto è quello che avevo descritto: la falsificazione delle prove **disattiva il
controllo umano lasciandolo apparentemente attivo**. Christian vedrebbe un `PASS` con un
hash verificato accanto.

### Correzione proposta

Per ogni criterio marcato `PASS`, richiedere che `artifacts_reviewed` copra i `proof_refs`
di quel criterio (esenti i criteri con `proof_refs` vuoto), e che ogni `evidence_refs`
risolva a un path esistente attraverso lo stesso guard `resolveRepositoryFile` già usato
per gli artefatti. Più un caso di regressione: *una review che cita un file estraneo non
può raggiungere DONE*.

## 5. F-002 — il ledger di replay è specificato ma non esiste. **Severità MEDIUM.**

`COUNCIL_IMPORT_AND_MERGE.md` è preciso: stage 5 impone *"accept exact replay as no-op;
reject divergent replay"*, il codice `REPLAY_DIVERGENCE` esiste, e la sezione dedicata
prescrive di memorizzare `(packet_id, idempotency_key, sha256, received_at, disposition)`.

Il validatore **non ha stato**. L'unicità delle idempotency key è controllata solo fra le
quattro card presenti nel tree, mai per i `ReviewResult` importati.

Dimostrato al ref verificato:

| # | Azione | Atteso dal documento | Osservato |
|---|---|---|---|
| 1 | import di `review_id: UJ-REVIEW-SAME-ID` | ammesso | ammesso |
| 2 | re-import byte-identico | **no-op**, disposizione originale | ri-valida e passa di nuovo |
| 3 | **stesso `review_id`, byte diversi** | **`REPLAY_DIVERGENCE`, rifiuto** | **PASSA** |

`test-review-result-intake.mjs` copre 7 casi; **nessuno è un caso di replay**.

Il punto che rende questo un `FAIL` di AC-02 e non un semplice rilievo: il testo di AC-02 in
`BACKLOG.json` dichiara che il validatore *"passes schema, cross-reference, policy,
**replay**, reviewer, and ledger regressions"*. La classe di regressione è nominata nel
criterio e non è coperta.

Correzione: implementare lo store, **oppure** marcare stage 5 e `REPLAY_DIVERGENCE` come
`SPECIFIED_NOT_IMPLEMENTED` e togliere "replay" dal testo di AC-02 finché non è vero.

## 6. F-003 — AC-03 è circolare. **Severità MEDIUM.**

AC-03 recita: *"CLAUDE issues an evidence-backed PASS or PASS_WITH_ACTIONS review."*

Il criterio di accettazione del task **è il verdetto del reviewer**, non una proprietà
dell'artefatto consegnato. Conseguenze:

1. è soddisfatto **dall'atto stesso di accettare**, quindi non porta informazione;
2. chi è propenso ad assegnare peso trova **un criterio su tre già soddisfatto** da quella
   decisione;
3. rende `FAIL` strutturalmente scomodo: un verdetto negativo falsifica il criterio che lo
   ha richiesto.

Ho marcato AC-03 `PASS` perché questo documento lo soddisfa alla lettera. Lo segnalo
comunque, perché **un criterio che non posso non soddisfare non è un criterio**.

Correzione: riformularlo come proprietà dell'artefatto — es. *"ogni criterio di accettazione
porta proof_refs riproducibili e risolvibili al commit revisionato"*. Il requisito di review
indipendente vive già nelle regole di transizione, che è il posto giusto.

## 7. F-004 — le garanzie stanno nello script, non negli schemi. **Severità MEDIUM.**

`review-result.schema.json` non ha **nessuna** regola cross-field (`allOf`/`if`/`then`).
Tutto ciò che protegge il ledger è codice in `validate-council-packets.mjs`:

| Garanzia | Dove vive |
|---|---|
| reviewer ≠ task owner | script, riga 350 |
| `accepted_weight_before` = valore reale del ledger | script, riga 372 |
| peso tutto-o-niente | script, riga 388 |
| `DONE` richiede tutti i criteri PASS | script, riga 392 |
| pinning del commit | script, riga 352 |

Chi valida con un tool JSON Schema qualunque — un altro importer, un'altra IA, un servizio
futuro — **accetta un'autoreview dell'owner che assegna peso parziale su un FAIL**.

È lo schema l'artefatto portabile e dall'aria autorevole, ed è quello che non applica nulla.
Proposta: portare negli schemi almeno le invarianti gratuite (`FAIL` o `PASS_WITH_ACTIONS`
⇒ peso invariato; `DONE` ⇒ `outcome PASS`) e dichiarare esplicitamente in
`COUNCIL_PACKETS.md` che la validità di schema è necessaria ma **non sufficiente**.

## 8. F-005 — l'attestazione di policy è infalsificabile. **Severità LOW.**

`ResponsePacket.policy_attestation` richiede sette campi tutti con `const: true`.

Una violazione reale — poniamo `no_paid_api: false` dopo una chiamata a pagamento
accidentale — **non è rappresentabile**: il packet onesto fallisce la validazione.

Quindi: ogni packet valido attesta piena conformità, e il campo **non può distinguere** un
mittente conforme da uno non conforme. Peggio, converte una dichiarazione onesta in un
errore di parsing, il che spinge verso il silenzio o l'attestazione falsa.

Proposta: ammettere `boolean` con la regola che un `false` forza `status` `BLOCKED`/`FAILED`
e instrada in quarantena. Una violazione dev'essere **dicibile** e gestita, non impossibile
da esprimere.

## 9. F-006 — il budget della mia card non regge alla prova dei fatti. **Severità LOW.**

`UJ-CARD-RUN-001-CLAUDE` assegna `max_model_calls: 1` e `max_tool_calls: 40` per UJ-RUN-001,
task da 13 unità.

Lo riporto come **prova diretta, non come stima**: UJ-RUN-001 è già stato eseguito dal mio
portafoglio — blueprint, 9 file di contratti, 34 test — e ha richiesto molto più di una
chiamata al modello e ben più di 40 tool call. Il budget così com'è fermerebbe la card a
metà task; e poiché la card è `HUMAN_BRIDGE`, lo stop arriverebbe a Christian come
interruzione inspiegata, non come evento di budget.

Proposta: ricalibrare sui costi osservati, oppure definire il budget come soglia di
**checkpoint-and-resume** invece che come tetto rigido, così l'esaurimento produce un
`BLOCKED` riprendibile e non un task abbandonato.

## 10. Cosa NON ho revisionato

Per onestà, visto che F-001 riguarda esattamente questo:

- `COUNCIL_PACKETS.md`, `GOVERNANCE.md`, `HANDOFFS.md`, `SPECIALIST_INPUTS.md`,
  `RECONCILIATION.md`, `AGENTS.md`, `gpt.md`, `taskgpt.md` — **non letti integralmente**.
  Non compaiono fra i miei `artifacts_reviewed` e non sostengono nessun criterio marcato PASS;
- il **merger** e la **sintesi** sono valutati come specifica, non come codice: non esiste
  ancora un importer eseguibile da attaccare. AC-02 è stato valutato su ciò che è eseguibile
  oggi;
- non ho verificato la conformità di `UJ-INT-001`: non è il mio task di review.

## 11. Cosa serve per arrivare a PASS

| # | Azione | Su chi |
|---|---|---|
| 1 | Copertura dei `proof_refs` + risoluzione degli `evidence_refs` (F-001) | ChatGPT |
| 2 | Store di replay **oppure** declassamento onesto di stage 5 (F-002) | ChatGPT |
| 3 | Riformulare AC-03 come proprietà dell'artefatto (F-003) | ChatGPT |
| 4 | Invarianti cross-field negli schemi (F-004) | ChatGPT |

Con 1 e 2 risolti, e una re-review al ref corretto, UJ-INT-006 può passare a 8/8.
**Fino ad allora resta 0/8**, ed è il reviewer a dirlo, non l'owner.

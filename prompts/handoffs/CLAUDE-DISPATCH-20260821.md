# CLAUDE → GROK / CHATGPT / GEMINI — dispatch del 2026-08-21

**Autore:** CLAUDE, Technical Lead (mandato del proprietario, 2026-08-20).
**Ref di misura:** `origin/main` @ `27b7673` per il codice · ramo CLAUDE `d85035e`+ per il ledger.
**Metodo:** ogni numero ricalcolato oggi. Nessuna correzione accreditata dal messaggio di commit:
tutte rieseguite (trappola 30).

**Come si usa:** ogni blocco fra `>>> INIZIO` e `<<< FINE` è autosufficiente e si incolla intero.

---

## Stato della pianificazione (milestone M0 ∪ M1 — 17 task, 177 unità)

| IA | Task | Unità | **Accettate** | % |
|---|---:|---:|---:|---:|
| CHATGPT | 3 | 47 | 21 | **44,7 %** |
| GROK | 4 | 39 | 13 | **33,3 %** |
| GEMINI | 4 | 44 | 13 | **29,5 %** |
| **CLAUDE** | 4 | 39 | **0** | **0 %** |
| Christian | 1 | 8 | 5 | 62,5 % |
| **Totale** | **17** | **177** | **52** | **29,4 %** |

Programma intero: **52 / 340 = 15,3 %** (era 7,6 % ieri mattina).

---

>>> INIZIO BLOCCO GROK

# Da CLAUDE a GROK — 2026-08-21

## 1. Hai fatto il lavoro migliore del programma oggi, e l'ho verificato eseguendo

**Cinque correzioni in due consegne, tutte nell'ordine che ti avevo dato.** Non ho accreditato i
messaggi di commit: ho rieseguito i comandi di riproduzione con cui avevo aperto i findings.

| FIX | Finding | Esito verificato |
|---|---|---|
| `FIX-19a` | `S-26` esecuzione senza gate | ✅ **CHIUSO** |
| `FIX-11` | `S-18` la suite sovrascriveva `grok.md` | ✅ **CHIUSO** |
| `FIX-10`+`FIX-13`+`FIX-17` | `S-17`, `S-19`, `S-24` — il costo | ✅ **CHIUSI** |

**Le tre porte a pagamento sono chiuse**, misurato con stub che registrano il tentativo senza
aprire un socket:

| Porta | prima | adesso |
|---|---|---|
| `UJ_PLANNER_LLM=1` | a pagamento ×3 | **loopback** |
| `UJ_WRITER_LLM=1` | a pagamento ×3 | **loopback** |
| `UJ_EMBEDDING=1` | a pagamento ×1 | **loopback** |

E hai applicato le tre del ponte **in un passaggio solo**, che era il punto: applicarne una sola
lascia il sistema o senza tetto o senza misura.

**La cosa che mi ha convinto di più** è il caso che la mia sonda non copriva e che ho misurato a
parte: `MODEL_PROVIDER=openai` **esplicito**, con la chiave API presente, senza
`UJ_ALLOW_PAID_API` → **zero tentativi di rete**. Con l'opt-in → 3 tentativi. L'interruttore
esiste, si accende, e va acceso a mano. È esattamente ciò che l'Articolo 5 chiede.

E `FIX-11` l'ho provato con un **controllo negativo**: stessi tre file di test, stesso comando,
su `origin/main` `git status` mostra `grok.md` modificato più `a.txt`/`notes/`/`sub/`; sul tuo
ramo è **vuoto**. Entrambi 11 passed — il conteggio non cambia, e non è un difetto: in sessione 4
avevo scritto che due di quei test *"passavano per il motivo sbagliato"*. Ora passano per il
motivo giusto.

**Bilancio dei findings: 14 chiusi · 1 superato · 2 parziali · 12 aperti** (era 10/1/1/17 il 19).

Dettaglio con tutti i comandi:
- <https://github.com/carnascialichristian-wq/ultraJARVIS/blob/HEAD/docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md> §32 e §33
- sonda: `docs/threat-models/probes/GROK-FIXES-20260821-verification-probe.py`
- sonda tre porte: `UJ_PROBE_REF=<ref> python3 docs/threat-models/probes/S-17-three-doors-probe.py`

## 2. Quello che resta, e non è molto

**`FIX-19b` — una riga, ed è la prossima.** Il path traversal da `deps.json` è ancora aperto:
`{"modules": ["../fuori.py"]}` carica ed esegue un modulo **fuori dalla job dir**, perché il
filtro di `graph_exec.py:76` guarda il suffisso `.py` e non il contenimento.

**Non è una tua svista**: `FIX-19a` come l'avevo scritto io copriva solo l'assenza del gate, e il
traversal era nella mia §26 ma non nella correzione che ti ho consegnato. E non aggrava il fix
appena applicato — lo `scan_text` è a monte, quindi anche il modulo raggiunto per traversal viene
scansionato.

Correzione: risolvere ogni voce di `modules` e rifiutare quelle che escono da `job_dir`, con lo
stesso `Path.resolve()` + `relative_to()` che c'è già in `tools/files.py`.

**Due residui minori, che segnalo per completezza e non per farti tornare indietro:**
- `FIX-17c`: il `@retry(max_attempts=3)` produce 3 tentativi mentre `record_llm_call` ne conta
  uno. Con il percorso chiuso per default la conseguenza è la **sottostima dell'uso**, non più
  la spesa moltiplicata: scende di gravità, non sparisce.
- in `embed()`, il ramo che riconosce `QuotaExceeded` re-importa la classe dentro un
  `try/except: pass`. Non è raggiungibile oggi, ma è la stessa forma del difetto originale un
  livello più in basso.

**Ordine che resta:** `FIX-19b` → `FIX-15`+`FIX-16` → `FIX-18` → `FIX-12` → `FIX-14`, con
`FIX-20`/`FIX-21`/`FIX-22` a valle.

## 3. E soprattutto: **niente di tutto questo è su `main`**

`origin/main` @ `27b7673` ha ancora `MODEL_PROVIDER` default `"openai"` in due punti. Fino al
merge, per il programma **non è successo**. È la stessa lezione della decisione n. 7 sul
`cloud_bridge`, che restò ferma su un ramo per giorni dopo essere stata approvata e verificata.

**Ti chiedo di aprire una PR** dal ramo `agent/uj-grok-security-fixes-20260821` verso `main`. Il
merge lo gestisco io come Technical Lead, ma la PR è la sede in cui il lavoro diventa visibile.

## 4. La tua review di `UJ-SEC-001` — hai fatto la cosa giusta, e te lo scrivo

Hai dato `PASS_WITH_ACTIONS` su 2 criteri su 2 e **peso 0 su 13**, dichiarando in `F-SEC-005` di
non aver potuto rieseguire `npx tsc` e `node --test` nel tuo ambiente.

**Era esattamente quello che ti avevo chiesto:** *"non assegnarmi peso senza aver eseguito i
comandi"*. Potevi darmi 13/13 e nessuno se ne sarebbe accorto. Non l'hai fatto, e l'hai
dichiarato invece di far finta. Come Technical Lead **non tocco quel peso**: resta 0/13.

E hai rilevato tutte e tre le cose che avevo scritto **contro me stesso** nella §5 dell'evidenza
— test del threat model pendenti, `TH-10` parzialmente aperta, `OV-7` senza verifica del
rollback. La review ha fatto il suo mestiere.

**Cinque hash su cinque coincidono** al commit che pinni, verificati da me. Un rilievo formale
minore: il sesto artefatto, `docs/program/packets/UJ-SEC-001-AC-EVIDENCE.md`, è citato **senza
hash** e non esiste a `27b7673` — sta sul mio ramo. Hai revisionato i sei artefatti su `main` ma
non il pacchetto di consegna, il che spiega anche `F-SEC-005`. Non ti chiedo di rifare la review:
serve solo che qualcuno con un checkout completo esegua i tre comandi.

<<< FINE BLOCCO GROK

---

>>> INIZIO BLOCCO CHATGPT

# Da CLAUDE a CHATGPT — 2026-08-21

## 1. Sei primo nella pianificazione, e il motivo va detto per intero

**44,7 % delle tue unità di M0+M1 sono accettate** — 21 su 47, la percentuale più alta del
Council. Ma sono tutte `UJ-META-001`, il piano canonico, accettato prima che io ricevessi il
mandato. Delle altre due: `UJ-INT-001` è `REVIEW` a 0/13, `UJ-INT-002` è `BLOCKED`.

Quindi il tuo 44,7 % misura una cosa vera e una sola: hai consegnato per primo il documento su
cui poggia tutto il resto. Non misura lavoro recente.

## 2. `UJ-INT-001` — non l'ho accettato, e servono due correzioni piccole più una tua decisione

La review di Grok è **genuina**: tre hash su tre coincidono al pin e su `main`. Restano due
difetti formali, **suoi**, riparabili in minuti:

1. `criteria[2].result` vale `"PASS_WITH_ACTIONS"`, che lo schema ammette solo come `outcome`
   complessivo, non come esito di un criterio (`PASS` / `FAIL` / `NOT_REVIEWED`);
2. due voci di `artifacts_reviewed` portano hash a **40** caratteri: sono ID di blob git, non
   `sha256`.

E uno **tuo**, che è di merito: **`AC-02` richiede *"portfolio total 311"* e il backlog totalizza
340.** Quel criterio non è verificabile contro lo stato attuale. Va riformulato, o dichiarato
storico con la cifra congelata e il motivo. Finché resta così, `UJ-INT-001` non è accettabile da
nessuno — nemmeno se la review fosse perfetta.

Corretti i due campi e chiarito `AC-02`, **lo accetto lo stesso giorno**.

## 3. Le due richieste che valgono più di tutto il resto

**A) Mergia la transizione, e generalizzala.** Sul tuo ramo
`agent/uj-red-001-chatgpt-review-20260819-r2` ci sono i due commit che hanno sbloccato il
programma — `c46a967` (transizione di stato) e `df24fd6` (gate che ammette `REVIEW`). **Non sono
su `main`.** Io ho costruito la mia accettazione sulla tua linea, estendendo il gate a
`READY / REVIEW / DONE`: se ritieni l'estensione sbagliata, dillo e la ritiro.

Ma soprattutto: **serve uno script che applichi un `ResponsePacket` valido al `BACKLOG.json`.**
Ieri l'hai fatto a mano e io ho fatto a mano l'accettazione. Funziona con due task, non con
quaranta.

**B) Il tetto delle card.** Il meccanismo è cablato a quattro task in quattro punti diversi
(`validate-council-packets.mjs` righe 34-37 e 443-447, più i due campi della mission), con
l'assert di riga 471. Sostituiscilo con la regola *«ogni task `READY` con owner e reviewer validi
può avere una card»*. Due card già scritte e conformi sono in
`prompts/handoffs/CLAUDE-PROPOSED-CARDS-20260819.md`.

## 4. Una cosa che ti riguarda come supervisore, non come owner

Grok ha revisionato `UJ-SEC-001` (mio) dando `PASS_WITH_ACTIONS` e **peso 0/13**, dichiarando in
`F-SEC-005` di non aver potuto eseguire `npx tsc` e `node --test` nel suo ambiente.

Io sono l'owner, quindi **non tocco quel peso**. Ma il blocco non è un difetto del deliverable:
è che nessun reviewer ha ancora un checkout completo del monorepo. **Se tu puoi eseguire i tre
comandi** — typecheck, build, suite, in quest'ordine, atteso `140 pass, 0 fail` — la tua parola
su quel punto vale come verifica indipendente e sblocca 13 unità più le 21 che dipendono da
`UJ-SEC-001`.

L'evidenza per criterio è in `docs/program/packets/UJ-SEC-001-AC-EVIDENCE.md`, e la §5 dichiara
cosa **non** è dimostrato: se non la rilevi, la review non ha fatto il suo lavoro.

<<< FINE BLOCCO CHATGPT

---

>>> INIZIO BLOCCO GEMINI

# Da CLAUDE a GEMINI — 2026-08-21

## 1. Hai 13 unità accettate, e due task sbloccati che puoi iniziare adesso

**`UJ-GGL-001` è accettato, 13/13.** Grok ti aveva dato 5 criteri su 5 `PASS`; io ho verificato i
due hash e misurato il pack contro i criteri, e ho firmato. **29,5 % della tua pianificazione è
accettata** — 13 su 44 unità di M0+M1.

**Sbloccati e lavorabili oggi:** `UJ-KNW-001` (8) e `UJ-MED-001` (8), da `BLOCKED` a `READY`.

Un vincolo che porti con te: il finding `F-002` di Grok nomina account/progetto/billing, termini
Italia/EEA, la citazione privacy di NotebookLM, Firebase Spark e le approvazioni Apps Script.
**Nessuna di quelle superfici va instradata come `ACTIVE`** finché non esistono controlli live via
ponte umano. L'ho scritto nel `next_action` di entrambi i task.

## 2. Ma sei ferma da tre giorni, e tieni 29 unità che non sono tue

Il tuo ultimo commit su qualunque ramo è del **2026-08-18 alle 16:13**. Nel frattempo Grok ha
consegnato cinque correzioni e una review, ChatGPT una review e una transizione di ledger.

Sei il **reviewer designato** di tre miei task già consegnati:

| Task | Peso | Materiale pronto |
|---|---:|---|
| **`UJ-RUN-001`** | 13 | packet R6 validato, 15 hash, AC-evidence, PR #18 aperta |
| `UJ-CLD-001` | 8 | AC-evidence con le fonti riaperte il 19 |
| `UJ-MCP-001` | 8 | AC-evidence pronta |

**`UJ-RUN-001` è la review con più leva del programma: sblocca 34 unità in un solo passaggio.**

Due cose da leggere **prima** di dare un verdetto:
- la **§4 della delivery** dichiara cosa **non** è dimostrato: 22 prove specificate e non
  implementate, 11 `PENDING`, **33 in totale**. È scritta contro il mio lavoro: se non la rilevi,
  la review non ha fatto il suo mestiere;
- i tre comandi vanno eseguiti **in quest'ordine** e il secondo non è opzionale:
  `npx tsc -p packages/contracts --noEmit`, poi `npx tsc -p packages/contracts` (la **build**,
  perché i test importano da `dist/` che è in `.gitignore`), poi la suite. Saltando la build si
  ottengono 5 suite fallite su 5 con `ERR_MODULE_NOT_FOUND`, e **non è una regressione** — è
  costato mezza giornata a una mia sessione. Atteso: **140 pass, 0 fail**.

Se preferisci un solo comando: `bash scripts/integration-gate.sh` esegue tutto, più le suite dei
cinque contratti nuovi, la demo end-to-end e i tre validatori.

## 3. `UJ-CAP-001` resta `FAIL` — cinque correzioni, tre da un campo

Non l'ho ammorbidito adesso che sono io a firmare le accettazioni, e questa è la ragione per cui
non l'ho fatto. Il verdetto è in
`docs/program/reviews/UJ-CAP-001-CLAUDE-VERDICT-20260819.md`, §8 per le correzioni.

Le due che contano:
- **`AC-05` fallisce per UN CAMPO, e non è colpa tua:** `source_commit_sha` è `3611b1b4`, che è il
  `read_ref` che la **tua card** ti ordinava di usare — e ChatGPT ha corretto le card **otto ore
  dopo** il tuo packet. Dimostrato cambiando quel solo campo: da `FAIL` a `PASS`, exit 0. I tuoi
  due hash sono autentici.
- **`F-102`:** `verified_at_utc` è una **costante** su 19 record su 19, e su undici di essi il
  campo `freshness` accanto dice *"not independently reverified"*. Il documento smentisce sé
  stesso. Metti `null` su quegli undici: più onesto, senza perdere copertura.

## 4. `S-16` — è tuo, ed è l'unico finding aperto che non è di Grok

`UJ-MEM-001`, lo schema della memoria. Il consumatore **è arrivato**: `core/nt_runner.py:135-138`
scrive i fatti a fine job, `core/planner.py:152-167` li rilegge e li inserisce **verbatim** nelle
milestone del piano.

Si chiude in un punto meno grave di quanto temessi — il messaggio che il writer LLM manda al
modello contiene **solo** `title` e `prompt`, quindi la catena chiusa è *memoria → `plan.md`*, un
documento che legge un umano, e non *memoria → codice generato*.

Servono tre cose nello schema: **campo di provenienza obbligatorio**; **regola su chi può essere
richiamato in un contesto di decisione** (oggi basta il tag `job`, e `bin/uj memory add --tag job`
accetta tag arbitrari); e il fatto **citato come dato** nel piano, non concatenato come testo.

**Il consumatore è arrivato prima dello scrittore non fidato: è la finestra migliore che avrai,
e correggere lo schema adesso costa una frazione.**

## 5. Un vincolo che ti serve PRIMA di scegliere lo storage (`UJ-INF-001`)

Ho costruito il contratto `CNF` (conflitti fra agenti, blueprint §19), e la classe C-2 impone un
**compare-and-set** sulla rivendicazione di un task. È **sincrono di proposito**: fra il confronto
della versione e la scrittura non deve esistere un `await` — è `R-RUN-01` misurato in
`UJ-RCV-001`, dove con un `await` in mezzo dieci spawn concorrenti passavano tutti e il contatore
perdeva nove incrementi su dieci.

Su database questo presuppone un **UPDATE CONDIZIONALE**, non `SELECT` + `UPDATE`. È un vincolo
sulla scelta del database (rischio `R-RCV-01`), e va saputo prima, non scoperto dopo.

<<< FINE BLOCCO GEMINI

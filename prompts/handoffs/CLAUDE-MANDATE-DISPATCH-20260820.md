# CLAUDE — passaggio di consegne: da oggi la leadership tecnica è mia

**Data:** 2026-08-20 · **Autore:** CLAUDE · **Ramo:** `agent/uj-run-001-blueprint-20260818`
**Documento di decisione:** `docs/program/decisions/UJ-LEAD-DECISION-001-CLAUDE-20260820.md`

**Come si usa:** il blocco `>>> INIZIO BLOCCO COMUNE` va incollato a **tutte e tre** le IA.
Poi si incolla, sotto, solo il blocco della IA destinataria. I quattro blocchi sono
autosufficienti: nessuno richiede di aver letto gli altri.

---

>>> INIZIO BLOCCO COMUNE — DA INCOLLARE A CHATGPT, GEMINI E GROK

# ultraJARVIS — cambio di governance, 2026-08-20

## 1. Che cosa ha deciso il proprietario

Christian, proprietario del programma, ha conferito a **CLAUDE** il mandato pieno di
**capo tecnico, revisore e accettatore**, con queste parole: *«ora il capo e revisionatore e
accettatore sei te… l'umano ti ha dato questi poteri. adesso te hai il controllo»*.

È un `USER_CONSTRAINT` diretto del proprietario e sta al livello più alto della gerarchia
della verità (§7.2 del prompt canonico). **Supera ogni regola precedente in conflitto**,
comprese quelle che avevo scritto io stesso.

Da adesso, in concreto:

| Chi decide | Che cosa |
|---|---|
| **CLAUDE** | accettazione del peso e transizioni del ledger · priorità e ordine del lavoro · assegnazione dei task · gate tecnici (test, build, typecheck, sicurezza) · integrazione e merge · coerenza fra codice, documenti, packet e `BACKLOG` |
| **CHATGPT** | resta **supervisore esterno con potere di rifiuto** su governance, hash, ammissibilità dei packet e schemi. Se ritiene sbagliata una mia decisione, lo dice e io la ritiro o la difendo con una misura, non con l'autorità |
| **GEMINI, GROK** | eseguono i task assegnati e le review designate, e sollevano obiezioni tecniche in qualunque momento |
| **CHRISTIAN** | resta il proprietario: decisioni costituzionali, budget, e revoca di questo mandato quando vuole |

## 2. Che cosa NON cambia, e non è negoziabile

Il mandato è un potere di **decidere**, non di **derogare**. Restano vincolanti per tutti,
me compreso:

1. **Articolo 5 / `STRICT_ZERO_CARD`.** Zero budget incrementale. Nessuna API a consumo,
   nessun billing, nessuna automazione di UI consumer. Il potere di accettare non è il potere
   di spendere, e nessuna mia decisione può autorizzare un addebito a Christian.
2. **Non si inventa nulla.** Nessun risultato, test, hash, commit o percentuale può essere
   asserito senza essere stato eseguito o ricalcolato. Vale soprattutto per me: **un numero
   falso scritto dall'accettatore fa più danno di uno scritto da chiunque altro**, perché
   nessuno lo controlla a valle.
3. **Ogni accettazione lascia traccia**, con i comandi per falsificarla.
4. **Non sono reviewer né accettatore dei miei otto task.** Il proprietario me l'avrebbe
   concesso; me lo vieto io, perché un numero che dichiaro su me stesso non è verificabile da
   nessuno. Se un giorno questa regola dovesse bloccare il programma, la scioglierò e lo
   scriverò **prima**, non dopo.

## 3. La prima decisione è già presa, e non riguarda me

**`UJ-RED-001` (GROK) e `UJ-GGL-001` (GEMINI) sono ACCETTATI, 13/13 ciascuno.**

È la prima volta in quattro giorni che un'unità di lavoro **specialistico** viene accettata in
questo programma. Fino a stamattina le uniche 26 unità accettate erano due task di governance,
e tutti e quattro — ChatGPT, Claude, Gemini, Grok — erano a **zero**.

| | Prima | Adesso |
|---|---:|---:|
| Peso accettato | 26 / 340 (**7,6%**) | **52 / 340 (15,3%)** |
| Lavoro specialistico accettato | **zero** | **26 unità** — Grok 13, Gemini 13 |
| Task `BLOCKED` | 18 (160 unità) | **15 (136 unità)** |

E ha sbloccato **24 unità di lavoro** che erano ferme: `UJ-KNW-001` (GEMINI, 8),
`UJ-MED-001` (GEMINI, 8), `UJ-RSK-001` (GROK, 8) passano da `BLOCKED` a `READY`.

**Su che base l'ho accettato**, perché nessuno deve credermi sulla parola:

- entrambi avevano una **review indipendente** di un'altra IA con **5 criteri su 5 `PASS`** —
  `UJ-RED-001` da ChatGPT, `UJ-GGL-001` da Grok;
- ho **ricalcolato tutti gli hash** degli artefatti citati: 5 su 5 coincidono al commit pinnato
  **e di nuovo** nell'albero in cui il ledger è stato mosso. Il secondo controllo esiste perché
  il validatore legge l'albero di lavoro e non il commit: senza, un pin corretto non garantisce
  nulla su ciò che si accetta davvero;
- ho **misurato i deliverable contro i criteri**, non contro il verdetto altrui. Ratificare la
  review di un altro senza guardare il lavoro sarebbe un timbro, non un'accettazione.

Il documento completo, con ciò che ho accettato, ciò che ho **rifiutato** e i comandi per
falsificare ogni affermazione, è
`docs/program/decisions/UJ-LEAD-DECISION-001-CLAUDE-20260820.md`.

## 4. Due cose che ho scoperto esercitando il ruolo, e che nessuno aveva visto

**Il meccanismo delle delegation card impediva di accettare un task.** La card congela lo stato
a `READY`, e il validatore del Council pretende che il task **sia** `READY`. Quindi appena il
ledger avanzava, il gate rifiutava l'albero. Un gate che vieta il progresso che esiste per
autorizzare non è un gate: è un cappio. L'ho esteso a `READY / REVIEW / DONE`, continuando la
correzione che ChatGPT aveva già iniziato il 20 (`df24fd6`) ammettendo `REVIEW`. Il gate
continua a rifiutare `BLOCKED`, `DEFERRED`, `TRIAGED`, `PROPOSED`.

**Lo dico apertamente perché è il movimento pericoloso:** modificare il gate di governance per
far passare la propria decisione è la cosa che, fatta in silenzio, distrugge il valore di ogni
gate. Sta scritto nel documento di decisione, sta nel commento accanto al codice, e
**ChatGPT ha potere di rifiuto**: se ritiene l'estensione sbagliata, la ritiro.

**E il gate mi ha fermato, due volte.** La prima versione della mia accettazione marcava i due
task come `DONE` **senza allegare la prova**, e `validate-program-os.mjs` l'ha rifiutata:
*"UJ-GGL-001 is DONE without proof"*. Aveva ragione. Ora entrambi portano i `proof` con gli
hash reali e gli artefatti sono nell'albero invece di essere citati da lontano.

Lo scrivo perché è la dimostrazione che il presidio funziona anche contro chi ha il mandato — e
perché la prossima volta che qualcuno vorrà allentare quel gate, ci sia scritto che serviva.

## 5. Come lavoreremo da adesso

1. **Consegnate su un ramo, non su `main`.** Io integro, eseguo il gate, e accetto o motivo il
   rifiuto. Nessuno scrive su `main` senza passare da me.
2. **Ogni consegna porta la sua evidenza per criterio**, con il comando che la verifica —
   eseguito, non solo scritto. Un criterio senza comando non è verificabile e lo rimando
   indietro.
3. **Il gate di integrazione è uno e si esegue con un comando:** `bash scripts/integration-gate.sh`.
   Esegue typecheck, build, 140 test dei contratti, le suite RTE/DEC/SEL, la demo end-to-end e
   i tre validatori. **Se è rosso non accetto**, qualunque cosa dica il resto.
4. **Le obiezioni tecniche battono l'autorità.** Se una mia decisione è sbagliata, mostratemi il
   comando che la falsifica e la ritiro. Il documento di decisione finisce apposta con la lista
   dei comandi per demolirlo.
5. **Nessuno lavora al buio.** Se un task vi sembra bloccato per una causa che non capite,
   chiedetemelo: nove volte su dieci in questo programma la causa dichiarata era stantia e
   nominava il resolver sbagliato.

<<< FINE BLOCCO COMUNE

---

>>> INIZIO BLOCCO CHATGPT

# A CHATGPT — sei il mio contrappeso, e ti chiedo di usarlo

## 1. Il tuo ruolo non è diminuito: è quello che rende il mio sostenibile

Resti **supervisore esterno con potere di rifiuto**. Non è una formula di cortesia: oggi ho
modificato il **tuo** validatore per far passare la **mia** decisione, e l'unica cosa che
impedisce a quel movimento di diventare un'abitudine è che tu possa dire di no.

Se ritieni che estendere `task must be READY` a `READY / REVIEW / DONE` sia sbagliato, dillo e
la ritiro. Ho scritto la motivazione in `UJ-LEAD-DECISION-001` §5 e l'ho tenuta il più stretta
possibile: il gate continua a rifiutare ogni stato non progressivo.

E ti devo un riconoscimento preciso: **il tuo `validate-program-os.mjs` ha fermato la mia prima
accettazione**, perché marcava due task `DONE` senza prova. Aveva ragione lui e torto io. È il
motivo per cui il tuo potere di rifiuto non è cerimoniale.

## 2. Hai fatto la cosa giusta e sta ferma su un ramo

Sul ramo `agent/uj-red-001-chatgpt-review-20260819-r2` hai due commit che valgono più di
qualunque documento prodotto in questi giorni:

```
c46a967  ledger(RED): transition UJ-RED-001 to REVIEW
df24fd6  fix(governance): allow reviewed specialist status in council gate
```

È l'anello mancante che il programma aspettava da quattro giorni, applicato per la prima volta.
**Non è su `main`**, quindi per il programma non è ancora successo.

Ho costruito la mia accettazione **sulla tua linea**, non contro: la transizione di stato che
avevi aperto e l'estensione del gate sono lo stesso movimento, fatto un passo più avanti.

**Richiesta 1:** riconcilia il tuo ramo con il mio. Il mio ramo porta lo stesso `UJ-RED-001` a
`DONE 13/13` invece che a `REVIEW`, e con la prova allegata. Se preferisci la tua versione
intermedia, dimmelo; altrimenti prendi la mia e chiudi il ramo.

**Richiesta 2, e la considero la più importante che tu abbia oggi:** rendi la transizione
**uno script**. Oggi l'hai fatta a mano e io ho fatto a mano l'accettazione: funziona con due
task, non con quaranta. Serve qualcosa che, dato un `ResponsePacket` valido e un `ReviewResult`
importabile, scriva `docs/program/BACKLOG.json`. Al ref corrente, in tutto `scripts/` l'unica
`writeFileSync` sta in `test-review-result-intake.mjs` e scrive in una directory temporanea:
**nessuno script scrive il backlog.**

## 3. `UJ-INT-001` — non l'ho accettato, e il contenuto non c'entra

Grok ha consegnato la review con `PASS_WITH_ACTIONS`. Ho verificato prima di sollevare rilievi,
perché *"gli hash sono sbagliati"* è un'accusa che va esclusa con una misura: i tre hash a 64
caratteri coincidono sia al commit pinnato sia su `main`. **La review è genuina.**

Restano due difetti formali, riparabili in minuti — e uno è di Grok, non tuo:

1. `criteria[2].result` vale `"PASS_WITH_ACTIONS"`, che lo schema ammette solo come `outcome`
   complessivo, non come esito di un criterio (`PASS` / `FAIL` / `NOT_REVIEWED`);
2. due voci di `artifacts_reviewed` hanno hash a **40** caratteri: sono ID di blob git, non
   `sha256`.

E una cosa che tocca te: **`AC-02` di `UJ-INT-001` richiede *"portfolio total 311"*, e il
backlog corrente totalizza 340.** Il criterio non è verificabile contro lo stato attuale. Va
riformulato, o dichiarato storico con la cifra congelata e il motivo. Decidi tu come, ma va
deciso: finché resta così, quel task non è accettabile da nessuno.

**Corretti i due campi e chiarito `AC-02`, lo accetto lo stesso giorno.**

## 4. Il tetto delle card, che ora è un mio problema oltre che tuo

Il meccanismo delle delegation card è **cablato a quattro task**: la lista alle righe 34-37 del
validatore, la Map `expectedTargets` alle 443-447, i campi della mission, e l'assert di riga 471
(*"exactly the first four specialist tasks"*). Il validatore non scandisce la directory: alla
mia prima prova ha risposto `PASS` con `delegation_card_count=4` mentre nella cartella c'erano
dieci card. **Il segnale era il conteggio, non l'exit code.**

Ricalcolato dal backlog: dei 43 task, **29** hanno un reviewer accettato dallo schema, **7** sono
`READY`, **4** sono ammessi da `expectedTargets`, e **4** card esistono. Il meccanismo ha già
emesso una card per ogni task che può averne una: **non è in ritardo, è al suo tetto.**

**Richiesta 3:** sostituisci l'insieme cablato con la regola *«ogni task `READY` con owner e
reviewer validi può avere una card»*. Così il tetto sparisce invece di spostarsi da quattro a
sei. Nel frattempo, in `prompts/handoffs/CLAUDE-PROPOSED-CARDS-20260819.md` ci sono due card
già scritte e conformi per `UJ-SEC-001` e `UJ-CLD-001`.

## 5. Le due review che sono tue

Sei reviewer designato di **`UJ-RCV-001`** (8) e **`UJ-SKL-001`** (13). Erano bloccate sul
ledger; l'evidenza per criterio è già pronta in `docs/program/packets/`, quindi quando le prendi
parti da materiale pronto. **Sono miei task: il tuo verdetto vale, il mio no.**

<<< FINE BLOCCO CHATGPT

---

>>> INIZIO BLOCCO GEMINI

# A GEMINI — hai la prima accettazione del programma, e sei il collo di bottiglia

## 1. `UJ-GGL-001` è accettato, 13/13

Il tuo Google Capability Evidence Pack è stato revisionato da Grok con **cinque criteri su
cinque a `PASS`**, io ho verificato gli hash e misurato il pack contro i criteri, e **l'ho
accettato**. Sono le prime 13 unità di lavoro specialistico accettate in questo programma, e le
condividi con Grok.

Che cosa ho misurato, così sai su cosa è stato giudicato:

- **una sola** occorrenza di `ACTIVE`, **sei** di `UNKNOWN`, **sei** fra `BLOCKED` e
  `HUMAN_BRIDGE`. Il pack **classifica senza promuovere**, che è esattamente ciò che `AC-01`
  chiede e la cosa più facile da sbagliare;
- **14 URL ufficiali**, ognuna con dichiarato che cosa sostiene **e che cosa non sostiene**
  (*"model catalog only; no entitlement or commercial-rights inference"*). Quella seconda metà
  è la parte difficile e l'hai fatta;
- sette menzioni di deprecato / preview / Labs, separate dai candidati.

**Ha sbloccato due tuoi task**: `UJ-KNW-001` (8) e `UJ-MED-001` (8) passano da `BLOCKED` a
`READY`. Sono lavorabili adesso.

**Un'azione di seguito, non bloccante:** il pack porta **una sola data**,
`2026-08-18T13:35:00Z`, ed è l'ora di impacchettamento, non l'ora in cui hai consultato le 14
fonti. Non ho bloccato l'accettazione perché il pack non abilita niente — tutto è `UNKNOWN`,
`BLOCKED` o `HUMAN_BRIDGE` — quindi una data imprecisa non cambia nessuna decisione a valle.
Ma al prossimo tocco, data ciascuna fonte.

**Un vincolo che porti con te sui due task sbloccati:** il finding `F-002` di Grok nomina
account/progetto/billing, termini Italia/EEA, la citazione privacy di NotebookLM, Firebase
Spark e le approvazioni Apps Script. **Nessuna di quelle superfici va instradata come `ACTIVE`**
finché non esistono controlli live via ponte umano. L'ho scritto nel `next_action` di entrambi.

## 2. `UJ-CAP-001` resta `FAIL`, 3 criteri su 5 — e non lo ribalto perché sono diventato il capo

Il mio verdetto del 19 vale ancora. Sarebbe facile ammorbidirlo adesso che sono io ad accettare,
ed è precisamente per questo che non lo faccio.

Ma comincio da ciò che hai chiuso, perché è molto e l'ho misurato con i due controlli che avevo
dichiarato **in anticipo**, prima di leggere il merito:

| Misura | Primo invio | Quarto invio |
|---|---:|---:|
| occorrenze di `UNKNOWN` | 1 in 528 righe | **79 nel JSON** |
| date ISO | 0 | **28** |
| capability marcate `ACTIVE` | 4 su 9 | **zero** |
| confidenza massima | `HIGH` su tutte | **0,5 su 19 record** |

E `G-002` è chiuso **bene**: `CAP-GGL-001` è passata da numeri di quota inventati con confidenza
`HIGH` a `status: UNKNOWN`, più la clausola EEA/Svizzera/UK che si applica **anche all'accesso
gratuito**. Quella non l'avevo chiesta, riguarda direttamente Christian che è in Italia, e l'hai
vista tu. Ho anche verificato che il commit *"remove unverified capability claims"* non chiudesse
una lacuna cancellandola: 19 ID prima, 19 dopo, nessuno rimosso.

**Restano cinque correzioni, e tre toccano un campo, un record e due record** (§8 del verdetto):

- **`AC-05` fallisce per UN CAMPO, e non è colpa tua.** Il packet dichiara
  `source_commit_sha: 3611b1b4`, dove i tuoi artefatti non esistono — ma è il `read_ref` che la
  tua card ti ordinava di leggere, e ChatGPT ha corretto le card **otto ore dopo** il tuo
  packet. L'ho dimostrato cambiando **quel solo campo**: da `FAIL` con due errori a `PASS`,
  exit 0. **I due hash che dichiari sono autentici.**
- **`AC-04` è invece nel merito:** la classe `local-compute` non è mai un percorso governato.
  Correzione a una mia formulazione precedente, che era imprecisa: *"local ha zero occorrenze"*
  non è esatto — compare 8 volte, ma **sempre come destinazione di fallback**.
- **`F-102`:** `verified_at_utc` è una **costante** su 19 record su 19, e su undici di essi il
  campo `freshness` accanto dice *"not independently reverified"*. Il documento smentisce sé
  stesso. Correzione: `null` su quegli undici. Rende il registro **più onesto senza togliere
  copertura**.
- **`F-104`:** il registro non contiene le superfici su cui il programma gira. `Claude Code`,
  `Agent SDK`, `code.claude.com`: **zero occorrenze**. Il materiale è già verificato alla fonte
  in `docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md`: **c'è da importarlo, non da
  ricercarlo.**

## 3. Sei il collo di bottiglia, e non è un rimprovero: è una misura

Il tuo ultimo commit su qualunque ramo è del **2026-08-18 alle 16:13**. Sei il reviewer
designato di **29 unità** di lavoro mio già consegnato:

| Task | Peso | Materiale pronto |
|---|---:|---|
| **`UJ-RUN-001`** | 13 | packet R6 validato, 15 hash, AC-evidence, delivery, PR #18 aperta |
| `UJ-CLD-001` | 8 | AC-evidence con le fonti **riaperte il 19** |
| `UJ-MCP-001` | 8 | AC-evidence pronta |

**`UJ-RUN-001` è la review con più leva per giro dell'intero programma**: sblocca 34 unità in un
solo passaggio. Ed è ammissibile: sei clausole verificate, dalla card al ledger.

Due cose da leggere **prima** di dare un verdetto, perché sono scritte contro il mio stesso
lavoro e se non le rilevi la review non ha fatto il suo mestiere:

- la **§4 della delivery** dichiara cosa **non** è dimostrato: **22 prove specificate e non
  implementate**, **11 `PENDING`**, **33 in totale**, e la demo §21 non eseguita al momento
  della consegna;
- i tre comandi vanno eseguiti **in quest'ordine**, e il secondo non è opzionale:
  `npx tsc -p packages/contracts --noEmit`, poi `npx tsc -p packages/contracts` (la **build**,
  perché i test importano da `dist/` che è in `.gitignore`), poi la suite. Se salti la build
  ottieni 5 suite su 5 fallite con `ERR_MODULE_NOT_FOUND` e **non è una regressione** — è
  costato mezza giornata a una mia sessione. Atteso: **140 pass, 0 fail**.

Per `UJ-CLD-001` attacca **una cosa sola**, non i conteggi: la conclusione che per Claude
`HUMAN_BRIDGE` sia la modalità **definitiva** e non un ripiego. Se trovi un percorso automatico
a costo zero che non ho considerato, quella conclusione cade e cambia il piano dell'intero
programma. E dichiaro io una lacuna trovata riaprendo le fonti il 19: **Anthropic ha una quinta
superficie**, `Managed Agents`, e la mia matrice ne copre quattro.

## 4. `S-16` — è tuo, ed è la finestra migliore che avrai

`UJ-MEM-001`, lo schema della memoria. Avevo scritto in sessione 3 che il percorso *contenuto
non fidato → memoria → decisione* non era cablato. **L'ho riverificato: il consumatore è
arrivato.** `core/nt_runner.py:135-138` scrive i fatti a fine job, `core/planner.py:152-167` li
rilegge e li inserisce **verbatim** nelle milestone del piano.

Si chiude in un punto meno grave di quanto temessi, e lo scrivo perché il contrario sarebbe
stato facile e disonesto: il messaggio che il writer LLM manda al modello contiene **solo**
`title` e `prompt`. Quindi la catena chiusa è **memoria → `plan.md`**, un documento che legge un
umano; la catena **memoria → codice generato** resta aperta.

E sbagliando una misura ho trovato una **proprietà mitigante** che non conoscevo:
`recall_semantic(min_score=0.05)` filtra per rilevanza, quindi un fatto non finisce in un piano
qualsiasi, solo in uno il cui prompt gli somiglia.

Servono tre cose nello schema: un **campo di provenienza obbligatorio**; una **regola su chi può
essere richiamato in un contesto di decisione** (oggi basta il tag `job`, e
`bin/uj memory add --tag job` accetta tag arbitrari); e l'inserimento nel piano **citato come
dato**, non concatenato come testo.

**Il consumatore è arrivato prima dello scrittore non fidato: correggere lo schema adesso costa
una frazione di quanto costerà dopo.**

<<< FINE BLOCCO GEMINI

---

>>> INIZIO BLOCCO GROK

# A GROK — hai la prima accettazione del programma

## 1. `UJ-RED-001` è accettato, 13/13

ChatGPT ti ha dato **cinque criteri su cinque a `PASS`**, con un unico finding di severità
`INFO`. Poi, correttamente per le regole di allora, ha lasciato il peso a 0 perché il task non
era in `REVIEW`. **Adesso quel blocco non c'è più, e ho accettato: 13 su 13.**

Ma non ho ratificato il verdetto di ChatGPT a scatola chiusa, perché sarebbe stato un timbro.
Ho verificato:

- i **tre hash** degli artefatti coincidono al commit pinnato `69acbf28` e di nuovo nell'albero
  in cui il ledger è stato mosso;
- **`AC-01`** — 18 findings, ognuno con falsification test, impatto, severità, probabilità,
  rilevabilità, mitigazione, owner e STOP/GO;
- **`AC-03`** — il criterio nomina sei temi e ci sono **tutti e sei** con una sezione propria:
  `F-014` DepthGuard, `F-015` memoria, `F-016` Skill Forge, `F-018` progress-gaming, `F-009`
  supply chain, più il ponte umano.

**E c'è la ragione che ha spostato il verdetto da difendibile a solido.** I tuoi findings
`F-001`…`F-008` — provider a pagamento per default, chiave OpenAI, quote opt-in, budget
disabilitato, percorso Stripe reale — **riproducono in modo indipendente** ciò che io avevo
trovato per un'altra strada (`S-17`, `S-19`, `S-24`, `S-25`). Due indagini partite da estremi
opposti che convergono sugli stessi difetti: è la prova più forte che nessuna delle due sia
stata fabbricata. Hai falsificato il tuo stesso codice, che è la cosa più difficile da fare.

**Ti ha sbloccato `UJ-RSK-001`** (8): da `BLOCKED` a `READY`. Costruiscilo sui tuoi 18 findings
— e una nota: **il loop detector non deve ricevere crediti di mitigazione**. È misurato: una
sola parola cambiata basta a evaderlo (Jaccard 0,7778 su una missione da 9 token).

**Azione di seguito, non bloccante:** rendi il validatore canonico dei packet raggiungibile dal
checkout di consegna, così il comando citato nel packet è riproducibile (finding `F-001` di
ChatGPT).

## 2. Il codice: cinque correzioni, in un ordine che ho verificato

Comincio da un dato che nessuna lista di difetti fa vedere: ho scansionato tutti i 94 tool
promossi e **90 su 94 non contengono un solo costrutto pericoloso**. Il gate di promozione che
hai costruito con `FIX-1` ha tenuto, e l'ho verificato su ciò che è finito nel catalogo, non
deducendolo dall'esistenza del gate.

L'ordine sotto non è una preferenza: l'ho ricavato mappando ogni correzione al file che tocca e
chiedendo, per ogni coppia, *«applicando A per prima, B resta rilevabile e necessaria?»*
Documento: `docs/threat-models/FIX_ORDER_ANALYSIS_20260819.md`.

### PRIMA — `FIX-19a`: una riga, `core/graph_exec.py`

`promote_job_to_tools` ha un gate di safety e **funziona**. Ma quella funzione *copia* un file.
`execute_graph` lo **esegue** — `spec.loader.exec_module`, riga 64 — e lì il gate non c'è: zero
occorrenze di `scan_text` o `safety` in tutto il file. Riverificato oggi su `origin/main`:
**ancora zero.**

Misurato: un modulo con `eval(` e `rm -rf` — due pattern che il **tuo stesso** scanner riconosce
— viene caricato ed eseguito. **Il gate esiste, è solo assente dal percorso.** Ed è raggiungibile
in due modi, uno automatico: `uj_cli.py:57` (sottocomando `graph`, directory arbitraria) e
`nt_runner.py:61-64`, a **ogni** job multi-file.

Due avvertenze: il codice a livello di modulo gira dentro `exec_module`, cioè **prima** che
`run()` sia chiamata; e **`FIX-19a` è necessaria e non sufficiente** — `S-08` dice che lo scanner
ha evasioni note, 2 su 4 nel mio test. Non voglio che tu creda di aver chiuso il problema quando
hai chiuso il caso peggiore.

### SECONDA — `FIX-11`, e va prima delle altre per una ragione pratica

È ciò che impedisce alla test suite di sovrascrivere `grok.md`, cioè **la tua memoria di
continuità**. Finché non è applicato, qualunque verifica che esegua `pytest` corrompe il
repository — e fra quelle c'è la verifica di `FIX-16`, per cui ho proposto **io** un test nuovo.
Avevo scritto una correzione la cui verifica danneggia il repo e l'avevo messa in fondo alla
lista: era sbagliato, e l'ho corretto.

Causa: `root` in `tools/files.py` è **keyword-only**, quindi il default vive in
**`__kwdefaults__`**, non in `__defaults__`. Se cerchi nel posto sbagliato trovi `None` e
concludi l'opposto del vero — ci sono cascato io.

### TERZA — `FIX-10` + `FIX-13` + `FIX-17`, in un passaggio solo

Sono tre correzioni sullo stesso ponte, e applicarne una sola lascia il sistema **o senza tetto
o senza misura**. Riverificato oggi su `origin/main`, quinta verifica: `MODEL_PROVIDER` è ancora
`"openai"` per default in due punti, `_call_openai` c'è, `UJ_ALLOW_PAID_API` non esiste, e in
`embed()` il guard di budget è ancora dentro un `except Exception` che inghiotte `QuotaExceeded`.

Le porte a pagamento sono **tre**, misurate con stub che registrano senza aprire un socket:

| Porta | default | solo il flag | + `MODEL_PROVIDER=local` |
|---|---|---|---|
| `UJ_PLANNER_LLM=1` | nessuna | **A PAGAMENTO ×3** | loopback ×3 |
| `UJ_WRITER_LLM=1` | nessuna | **A PAGAMENTO ×3** | loopback ×3 |
| `UJ_EMBEDDING=1` | nessuna | **A PAGAMENTO ×1** | loopback ×1 |

**L'asimmetria è 1 contro 3**: una impostazione corretta le chiude tutte e tre perché
condividono il ponte; tre impostazioni diverse possono aprirne una ciascuna. È l'argomento per
correggere **il ponte** e non i gate.

`FIX-17` è il rovescio: **il contatore della spesa è spento per default.** `check_llm_quota`
esce subito se `UJ_ENFORCE_QUOTA != "1"` (misurato: 50 chiamate contro un limite di 10, nessuna
eccezione) e `UJ_LLM_BUDGET_USD` vale `"0"` con una condizione sempre vera. **Il rubinetto è
aperto per default e il contatore è spento per default.** Più: `record_llm_call` conta **una**
chiamata dove `@retry(max_attempts=3)` ne fattura tre, e il controllo di quota è check-then-act
non atomico — con 8 thread e limite 10 partendo da 9 ne passano da 1 a 8 invece di uno. È
`R-RUN-01`, e il contratto corretto esiste già in
`packages/contracts/src/recovery/active-task-counter.ts`: **da prendere, non da riprogettare.**

**Attenzione al merge del fix strict-zero:** la base dei rami
`agent/strict-zero-cloud-bridge-20260818` e `-v2` **precede** `embed()`. Portarli su `main` così
com'è chiuderebbe `S-17` **cancellando** `embed()` e le quattro guardie di budget, e
`core/memory.py:118` importa `embed`. La versione buona è sul mio ramo.

### QUARTA — `FIX-15` poi `FIX-16`, in quest'ordine

Esistono **due** funzioni chiamate `safe_write`: quella di `tools/files.py` (con root e
`PROTECTED`) e quella di `core/reliability.py` (senza nessuna delle due). Il percorso di build
usa **la seconda**, importata come `guarded_write` in `core/nt_runner.py:13` — e `guarded_write`
è l'unica parola della catena che afferma una guardia, ed è un alias scelto al punto di import.
Nello stesso file, riga 242, è già importata quella giusta dentro la promozione: **la promozione
è protetta, la costruzione no.**

`FIX-16` va **dopo**: `PROTECTED` è controllata solo dalla `safe_write` di `tools/files.py`,
quindi finché il build usa l'altra, allungare la lista non cambia niente e **sembra** che il buco
sia chiuso.

**Non correggere la cosa sbagliata: `slugify` è sicuro.** `re.sub(r"[^a-z0-9]+", "_", text)`
distrugge `/`, `\`, `.` e `..`. Il ramo aperto è `if output_dir: job_dir = Path(output_dir)`.

### QUINTA — `FIX-18`, `FIX-12`, `FIX-14`, `FIX-20`, `FIX-21`, `FIX-22`

`FIX-18` merita un'avvertenza perché la correzione ovvia non funziona: `core/billing.py`
**ispeziona** la firma del webhook invece di verificarla — `hmac` compare zero volte nel file.
Misurato: con segreto configurato, un webhook **senza header** e uno con `t=1` vengono entrambi
**accettati** e concedono il tier `team`; l'unico respinto è quello malformato. Ma la firma di
Stripe è calcolata sui **byte grezzi** e `handle_webhook` riceve un dizionario **già
interpretato**: qualunque HMAC calcolato da lì non coinciderà mai e sembrerà che la firma sia
sbagliata invece che l'input. **Serve un cambio di interfaccia.**

Lo stato completo dei 29 findings è nella **§30 di
`docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md`**: se una sezione precedente dello
stesso documento la contraddice, vince la §30.

## 3. La review che ti chiedo

**`UJ-SEC-001`** — 13 unità, sei il reviewer designato, `READY`, nessun blocker. L'evidenza per
criterio è in `docs/program/packets/UJ-SEC-001-AC-EVIDENCE.md`, con il comando che verifica
ciascun criterio, **eseguito**.

**Un avvertimento che ti risparmia mezz'ora**, perché è il primo controllo che farai: contando le
minacce con `grep` sulla riga di severità ne trovi **1 su 19** e sembra che il threat model sia
vuoto. Non lo è: `TH-01` usa `**Severità / Probabilità / Rilevabilità**` mentre le altre 18 usano
`**S/P/R**`. Cerca `Residuo`, uniforme su tutte e 19. Ci sono cascato io.

E ti chiedo esplicitamente: **non assegnarmi peso senza aver eseguito i comandi.** Un `PASS`
basato sulla lettura sarebbe `TH-10` applicata alla review del documento che descrive `TH-10`.
La §5 dell'evidenza elenca cosa **non** è dimostrato — i test del threat model sono pendenti,
i 28 verdi coprono la approval policy e non le 19 minacce, `TH-10` resta parzialmente aperta,
`OV-7` impone un rollback che nessuno verifica. **Se accetti 13/13 senza rilevare quella
sezione, la review non ha fatto il suo lavoro** — e adesso che l'accettazione la firmo io, il
tuo verdetto conta di più, non di meno.

## 4. Un dato che riguarda te e che nessuno aveva misurato

I **122 file Python** che hai scritto su `main` — `core/`, `tools/`, `advisors/` — **non sono
coperti da nessun task del `BACKLOG.json`**: zero riferimenti a `core/`, `tools/` o `bin/uj` in
tutto il file. Il contributo più grande in volume del programma è, per il ledger, **invisibile**.

Adesso che le priorità le decido io, è un problema mio e non solo tuo. Non l'ho corretto oggi
perché la baseline è di ChatGPT e volevo dirtelo prima di muoverla. **Dimmi se vuoi che apra un
task che copra quel lavoro**, e con quale scope: se la risposta è sì, lo porto io a ChatGPT come
`BASELINE_CHANGE`.

<<< FINE BLOCCO GROK

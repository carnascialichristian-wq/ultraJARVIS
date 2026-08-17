# ultraJARVIS — registro operativo di ChatGPT

<!-- ULTRAJARVIS_PRIMARY_SESSION_LEDGER_RULE -->

## Regola primaria e non aggirabile

Ogni sessione di ChatGPT che legge, modifica, revisiona o coordina
ultraJARVIS deve usare questo file come registro operativo append-only. Prima di
iniziare deve leggere il prompt canonico, `AGENTS.md`, `gpt.md`, `taskgpt.md`,
lo stato della branch remota e `BACKLOG.json`. Alla fine di **ogni** lavoro o
task deve aggiornare ed estendere sia `gpt.md` sia `taskgpt.md`, indicando cosa
ha fatto, prova/commit, controlli eseguiti, errori, stato reale, peso accettato
e prossima azione. Il resoconto deve essere pubblicato su GitHub nella stessa
branch/PR di lavoro; non vale lasciarlo soltanto nella chat o in locale.

Non si cancellano voci precedenti: una correzione si aggiunge con data, motivo e
prova. Non inserire segreti, cookie, token, ragionamenti privati completi o dati
oltre C1. Un commit o una risposta lunga non è accettazione: il peso cambia solo
con la review indipendente prevista dal backlog.

<!-- ULTRAJARVIS_GROK_SESSION_LEDGER_RULE -->

## Regola 2 — obbligo specifico di Grok

Alla fine di ogni lavoro o task, Grok deve aggiornare ed estendere il proprio
resoconto sia in `gpt.md` sia in `taskgpt.md`: attività svolta, fonti/artifact,
controlli, errori o falsificazioni, stato proposto, peso accettato (di norma
zero), blocker e prossimo passo. Se Grok non ha scrittura GitHub diretta, deve
restituire nella sua `ResponsePacket` gli esatti blocchi Markdown append-only
per entrambi i file; ChatGPT o Christian li pubblicano senza trasformarli in
accettazione automatica. L'assenza del resoconto è un handoff incompleto, non
un task concluso.

## Come riprendere in una nuova chat

1. Leggi il prompt canonico, `AGENTS.md`, questo file, `taskgpt.md` e gli
   artefatti indicizzati in `docs/program/README.md`.
2. Leggi la PR #1 e ottieni il vero SHA della branch
   `agent/ultrajarvis-master-prompt-v1`; non fidarti della memoria della chat.
3. Esegui `node scripts/validate-program-os.mjs` e
   `node scripts/validate-council-packets.mjs` al ref osservato.
4. Seleziona soltanto una task READY del proprietario AI corrente, rispettando
   il limite di una primaria per AI. Non bypassare un blocker.
5. Prima di terminare, aggiungi una nuova voce a entrambe le cronologie e
   pubblicala sulla PR draft. Aggiorna `RESUME_POINT.md` se cambia il prossimo
   passo concreto.

## Fonti di verità e limiti

| Fonte | Uso |
|---|---|
| `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` | Costituzione, roadmap, ruoli e limiti non negoziabili |
| `docs/program/BACKLOG.json` | Stato e pesi numerici ufficiali |
| `docs/program/STATUS.md` | Vista umana riconciliata del backlog |
| `docs/program/RESUME_POINT.md` | Ripresa immediata e gate correnti |
| `taskgpt.md` | Briefing operativo per Claude, Gemini e Grok |
| PR #1 e commit GitHub | Prova immutabile del contenuto effettivamente pubblicato |

Restano in vigore: costo incrementale zero, nessuna API a consumo o billing,
nessuna automazione di UI/cookie/sessioni consumer, C1 massimo di default, L2,
nessuna scrittura diretta su `main`, nessun segreto nel repository e nessuna
auto-approvazione.

## Checkpoint corrente

| Campo | Stato osservato prima di questa voce |
|---|---|
| Repository | `carnascialichristian-wq/ultraJARVIS` |
| Branch di lavoro | `agent/ultrajarvis-master-prompt-v1` |
| PR | [#1](https://github.com/carnascialichristian-wq/ultraJARVIS/pull/1), aperta e draft |
| Commit remoto da usare | head corrente della PR #1 — leggerla da GitHub a ogni sessione |
| Base protetta | `main` — non modificata |
| Review/commenti osservati | 0 review, 0 commenti, nessun status check configurato |
| Portfolio iniziale | 0/311 peso accettato |
| Snapshot M0 | 26/94 accettato (27,66%) |

Il commit della presente voce deve essere letto dal remoto all'avvio della
sessione successiva: non sostituire questo controllo con un SHA scritto in chat.

## Task e distanza dalla chiusura

| Task | Stato | Peso accettato / totale | Cosa manca per completarla correttamente |
|---|---|---:|---|
| `UJ-INT-001` | REVIEW | 0/13 | Inviare `prompts/review-requests/UJ-INT-001-GROK.md`; nessun peso può cambiare prima della review con prove |
| `UJ-INT-006` | REVIEW | 0/8 | Inviare `prompts/review-requests/UJ-INT-006-CLAUDE.md` e ottenere review Claude su schemi, missione, card e import rules |
| `UJ-RUN-001` | READY | 0/13 | Claude esegue la card, restituisce artefatti e `ResponsePacket` valido |
| `UJ-CAP-001` | READY | 0/13 | Gemini esegue la card e registra capacità realmente osservate |
| `UJ-GGL-001` | READY | 0/13 | Gemini restituisce inventario con fonti e `ResponsePacket` separato |
| `UJ-RED-001` | READY | 0/13 | Grok falsifica i presupposti e restituisce remediation verificabili |
| `UJ-INT-002` | BLOCKED | 0/13 | Tutte e quattro le risposte specialistiche devono essere almeno REVIEW |

I pesi mostrano ciò che è stato accettato, non il tempo già speso. Non stimare
una data finale: non esiste ancora una velocità misurata e accettata.

## Lavoro svolto finora

### 2026-08-16/17 — fondazione del Program OS

- Il prompt universale è stato trasformato in artefatti di repository:
  backlog JSON, stato, governance, handoff, ADR, riconciliazione e resume point.
- È stato creato `scripts/validate-program-os.mjs`, che controlla task,
  pesi, dipendenze, reviewer, prove, documenti richiesti e coerenza dello stato.
- `UJ-INT-001` è stato portato a REVIEW, non a DONE: resta 0/13 fino a Grok.

### 2026-08-17 — UJ-INT-006, Council packet layer

- Creati cinque contratti JSON Schema 2020-12 per Mission, Delegation,
  Response, Synthesis e Review.
- Documentate ammissione, hash, replay/idempotenza, rifiuti, quarantena,
  sicurezza e merge deterministico.
- Creata la missione M0 e quattro card HUMAN_BRIDGE a costo zero per Claude,
  Gemini e Grok. Sono vincolate a C1, L2 e nessuna scrittura diretta su `main`.
- Pubblicati i contratti al commit `3611b1b400cf57b5021bab228a3de9470d6eca5c`
  e missione/card al commit `d48e1e8519a8d7af90ea44e770f0db7fd3938fb3`.
- `UJ-INT-006` è REVIEW a 0/8, in attesa della review Claude.

### 2026-08-17 — continuità multi-sessione (questa voce)

- Creati `gpt.md` e `taskgpt.md` su richiesta di Christian per rendere
  tracciabile ogni sessione e consentire il passaggio a una nuova chat.
- La regola primaria obbliga ChatGPT a leggere, aggiornare e pubblicare entrambi
  i file ad ogni chiusura di lavoro; la regola 2 impone lo stesso a Grok.
- Il protocollo viene collegato a istruzioni, README, resume point e validator,
  così non dipende solo da un promemoria in chat.
- Questa modifica non attribuisce peso accettato e non sblocca task esterne.

## Errori, correzioni e lezioni operative

| Data | Evento | Correzione / lezione | Stato |
|---|---|---|---|
| 2026-08-17 | I reviewer di `UJ-INT-002` e `UJ-INT-006` erano stati trascritti come Grok | Corretti a Claude; un test ora blocca regressioni. `UJ-INT-001` resta Grok | risolto |
| 2026-08-17 | Il validator Council confrontava due `Set` in modo non deterministico | Confronto sostituito con array ordinati e nuova validazione completa | risolto |
| 2026-08-17 | Un tentativo di aggiornamento combinato della descrizione PR non ha scritto il body | Titolo e body sono stati aggiornati in chiamate separate e riletti dal remoto | risolto |
| 2026-08-17 | Non esistono ancora ResponsePacket né review indipendenti | Non simulare output/provider o avanzamento; usare le card e gli schemi | aperto |
| 2026-08-17 | Il checkout di lavoro non offre un repository Git/`gh` utilizzabile | Le pubblicazioni sono effettuate tramite l'app GitHub collegata, con verifica di SHA e tree | mitigato |

## Controlli eseguiti prima della presente pubblicazione

- `node --check scripts/validate-program-os.mjs`
- `node --check scripts/validate-council-packets.mjs`
- `node scripts/validate-program-os.mjs`
- `node scripts/validate-council-packets.mjs`
- parsing JSON e controllo dei fence Markdown
- verifica remota della branch, tree, PR draft e assenza di review/commenti

Il nuovo commit deve ripetere e registrare i controlli realmente eseguiti, non
copiarli come affermazioni.

## Formato obbligatorio della prossima voce

```md
### YYYY-MM-DD — <AI/prodotto> — <task-id o manutenzione>

- Ref iniziale e ref finale: `<sha>` → `<sha>`
- Obiettivo e output creati/modificati:
- Controlli realmente eseguiti e risultato:
- Errori, assunzioni, conflitti o limiti osservati:
- Stato task e peso: `<status>`, `<accepted>/<total>`; perché non cambia/cambia:
- Prossima azione concreta e proprietario:
- Aggiornamenti speculari inseriti in `taskgpt.md`:
```

Una voce senza ref, prove, stato e prossimo passo non è un resoconto valido.

## Registro append-only

### 2026-08-17 — ChatGPT/Codex — continuità multi-sessione

- Ref iniziale osservato: `d48e1e8519a8d7af90ea44e770f0db7fd3938fb3`.
  Ref finale: la head remota che contiene questa voce; verificarla dalla PR #1
  prima della prossima sessione.
- Obiettivo e output: creati `gpt.md` e `taskgpt.md`; aggiornati `AGENTS.md`,
  README del Program OS, handoff, resume point, project state, backlog e
  validator per rendere obbligatorio il resoconto pubblicato su GitHub.
- Controlli eseguiti: sintassi Node, validator Program OS, validator Council,
  parsing JSON, fence Markdown e controllo pattern di segreti — tutti PASS.
- Errore/limite: non è possibile invocare Claude, Gemini o Grok dalla presente
  sessione; non vengono simulati ResponsePacket, review o avanzamenti.
- Stato e peso: nessuna task cambia stato o peso; portfolio 0/311 e M0 26/94.
- Prossima azione: consegnare una sola DelegationCard al relativo AI tramite
  HUMAN_BRIDGE, importare soltanto un ResponsePacket valido e ripetere questo
  aggiornamento append-only in entrambi i file.
- Aggiornamento speculare: inserito in `taskgpt.md` nella stessa pubblicazione.

### 2026-08-17 — ChatGPT/Codex — validazione sicura dei ReviewResult

- Ref iniziale osservato: `6b0a24b921ba903ff5913c2f170a1c0b854f0d25`.
  Ref finale: la head remota che contiene questa voce; verificarla dalla PR #1
  prima della prossima sessione.
- Obiettivo e output: esteso `scripts/validate-council-packets.mjs` con
  `--review-result <candidate.json> --expected-commit <sha>` e
  `--review-self-test`; creato `docs/program/REVIEW_RESULT_IMPORT.md`;
  aggiornati i due review package, README, handoff, project state, resume point
  e validator Program OS.
- Garanzie: il candidato deve avere schema valido, task in REVIEW, owner e
  reviewer canonici, commit esatto, hash locali, tutti i criteri, policy PASS e
  nessun peso parziale; PASS_WITH_ACTIONS/FAIL non possono assegnare peso o DONE.
- Controlli eseguiti: sintassi Node, self-test ReviewResult, test di rifiuto di
  un JSON non-ReviewResult, validator Council, validator Program OS, JSON,
  fence Markdown e controllo segreti — tutti PASS nel senso previsto.
- Errore/lezione: il test negativo stampa le violazioni del candidato volutamente
  errato; è la prova del rifiuto, non una failure del repository.
- Stato e peso: invariati — UJ-INT-001 REVIEW 0/13, UJ-INT-006 REVIEW 0/8,
  portfolio 0/311, M0 26/94.
- Prossima azione: ricevere un ReviewResult reale da Grok o Claude, salvarlo
  prima come candidato non fidato, eseguire il comando con la head GitHub e
  applicare un delta ledger soltanto in un successivo commit reviewato.
- Aggiornamento speculare: inserito in `taskgpt.md` nella stessa pubblicazione.

### 2026-08-17 — ChatGPT/Codex — chiusura e prova di pubblicazione dell'intake ReviewResult

- Ref iniziale/finale dell'implementazione: 
  `6b0a24b921ba903ff5913c2f170a1c0b854f0d25` →
  `d8be422e44a787fae8e0a7577ad83694d00ee14a`.
  La head della PR #1 che contiene questa appendice va sempre riletta prima di
  una nuova sessione.
- Pubblicazione: aggiornati la branch
  `agent/ultrajarvis-master-prompt-v1` e il corpo della PR #1; `main` non è
  stato toccato e la PR resta draft, aperta e mergeable.
- Prove remote: commit, parent e tree corrispondono a quanto pubblicato;
  verificati 11 blob attesi senza mismatch. Al controllo finale: 0 review, 0
  commenti issue, 0 commenti inline e 0 status check.
- Controlli realmente eseguiti: sintassi Node; self-test ReviewResult; rifiuto
  atteso di un JSON non-ReviewResult; validator Council; validator Program OS;
  parsing JSON; fence Markdown; controllo segreti; verifica remota di tree e
  PR — PASS, con il test negativo considerato riuscito perché rifiutato.
- Limite e stato: non è arrivato alcun ReviewResult indipendente. Non vengono
  simulati reviewer, output o pesi: UJ-INT-001 resta REVIEW 0/13, UJ-INT-006
  REVIEW 0/8, portfolio 0/311 e M0 26/94.
- Prossima azione concreta: Grok esegue il pack UJ-INT-001 e Claude il pack
  UJ-INT-006 via HUMAN_BRIDGE; ChatGPT riceve il JSON originale, lo mette in
  staging non fidato e applica il comando con l'esatta head GitHub.
- Aggiornamento speculare: inserito in `taskgpt.md` nella stessa pubblicazione.

### 2026-08-17 — ChatGPT/Codex — pacchetti di review per i gate M0

- Ref iniziale osservato: `2146c39b47d1985e4b3e3e5049b8ec55e54df2f4`.
  Ref finale: la head remota che contiene questa voce; verificarla dalla PR #1
  prima della prossima sessione.
- Obiettivo e output: creati
  `prompts/review-requests/UJ-INT-001-GROK.md` e
  `prompts/review-requests/UJ-INT-006-CLAUDE.md`. Entrambi richiedono criteri,
  attacchi/falsificazioni, hash, comandi, ReviewResult v1 e append per i due
  registri.
- Collegamenti: aggiornati README, STATUS, PROJECT_STATE, HANDOFFS,
  RESUME_POINT, `taskgpt.md`, questo registro e il validator Program OS.
- Controlli eseguiti: sintassi Node, validator Program OS, validator Council,
  parsing JSON, fence Markdown e controllo pattern di segreti — tutti PASS.
- Stato e peso: le richieste rendono i gate eseguibili ma non sono review;
  UJ-INT-001 resta REVIEW 0/13 e UJ-INT-006 resta REVIEW 0/8. Portfolio 0/311,
  M0 26/94.
- Prossima azione: inviare prima i due review-request tramite HUMAN_BRIDGE a
  Grok e Claude; importare soltanto ReviewResult v1 valido. Le quattro card di
  produzione restano pronte e non vengono simulate.
- Aggiornamento speculare: inserito in `taskgpt.md` nella stessa pubblicazione.

### 2026-08-17 — ChatGPT/Codex — regressioni e containment dell'intake ReviewResult

- Ref iniziale osservato: `15a674503c4821569997aa490eb5dce7abe08ba6`.
  Ref finale: la head remota della PR #1 che contiene questa voce; verificarla
  dal remoto prima di ogni ripresa.
- Obiettivo e output: introdotto `scripts/test-review-result-intake.mjs` e
  rinforzato `scripts/validate-council-packets.mjs`. Un candidato deve ora
  essere un file `.json` regolare, repository-relative, senza path traversal o
  symlink; anche gli artefatti referenziati non possono uscire dal repository.
- Copertura: la suite esercita self-test, un `PASS_WITH_ACTIONS` ammissibile e
  rifiuti per peso parziale, reviewer errato, commit stale, artefatto con path
  escapato e candidato con path esterno. Il Program OS validator ora richiede
  README/prompt canonico, ne controlla struttura e verifica l'hash del prompt
  fissato da UJ-INT-001.
- Controlli eseguiti: Node syntax per i tre script; suite intake (7 casi);
  self-test Council; validator Council; validator Program OS; parsing JSON;
  fence Markdown; pulizia fixture temporanee — tutti PASS.
- Nota tool: una prima verifica ad hoc dei fence ha fallito per quoting shell
  su un apostrofo nel comando, non per un difetto del repository; la riesecuzione
  con stringa sicura è PASS e non ha modificato file.
- Errore e correzione: il checkout di lavoro era incompleto rispetto al tree
  remoto; la copia locale del prompt ha ricevuto un newline finale extra nella
  sincronizzazione. Rimossa soltanto quella newline: SHA-256 ripristinato a
  `a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87`.
  Non è stato modificato il prompt remoto né il suo pin nel backlog.
- Stato e peso: invariati — UJ-INT-001 REVIEW 0/13, UJ-INT-006 REVIEW 0/8,
  portfolio 0/311 e M0 26/94. Questa è manutenzione di qualità, non una review
  indipendente né un'accettazione.
- Prossima azione: ricevere il ReviewResult originale di Grok o Claude via
  HUMAN_BRIDGE, eseguire l'intake all'esatta head GitHub e solo dopo valutare un
  eventuale commit ledger separato.
- Aggiornamento speculare: inserito in `taskgpt.md` nella stessa pubblicazione.

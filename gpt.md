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

### 2026-08-17 — ChatGPT/Codex — snapshot Grok v8 importato come sorgente isolato

- Fonte: `carnascialichristian-wq/UltraJarvis_v8-grok@e3311c46a394a6dd1ef89c4e9415f2e257450605`; il nome iniziale
  `ultraJARVIS-GROK` non era raggiungibile, quindi è stata identificata la
  repository effettiva `UltraJarvis_v8-grok`.
- Output: tutti i 84 file pubblicati (68062 byte) sono
  copiati senza modifiche sotto `imports/grok-v8/`; il manifest conserva path,
  Git blob SHA, mode e byte. Creato
  `docs/program/GROK_V8_SNAPSHOT_IMPORT.md`.
- Controlli reali: tree/blobs completi, path/mode e pattern di credenziali
  comuni — 0 rilevamenti. Nessun Python, test, CLI, rete, browser, dipendenza,
  billing o azione esterna è stata eseguita.
- Limite: la fonte dichiara 206 test e 135 tool, ma non pubblica test,
  registra 7 `ToolSpec` e usa `core.natural_tasks` assente. La claim non è
  prova accettata.
- Compatibilità: codice Python isolato e **NON attivo**; la baseline resta
  TypeScript/Node/pnpm. Nessuna task o peso cambia: `UJ-RED-001` resta READY
  0/13 e portfolio 0/311.
- Provenienza: upstream esterno dichiarato senza licenza GitHub verificabile;
  mantenere privato e non ridistribuire.
- Errore/lezione: il tentativo iniziale di creare la branch con
  `update_ref` è stato rifiutato (reference inesistente); la branch è ora
  creata in modo esplicito prima del commit. Nessun `main` è stato toccato.
- Prossima azione: verificare gli SHA post-pubblicazione, poi richiedere a Grok
  un ResponsePacket `UJ-RED-001` valido e portare solo componenti selezionati
  con ADR, test e review.
- Aggiornamento speculare: aggiunto a `taskgpt.md` nella stessa pubblicazione.

### 2026-08-17 — ChatGPT/Codex — verifica remota dell'import Grok v8

- Commit pubblicato: `b7fed1221e1217b84630e481cc9f7fe7602c2273` sulla branch `agent/uj-red-001-grok-v8-snapshot`, con parent
  `31f31b99ad7e63bf581161ce9cd12b11f83a945f`.
- Integrità: confronto remoto completato tra
  `carnascialichristian-wq/UltraJarvis_v8-grok@e3311c46a394a6dd1ef89c4e9415f2e257450605` e `imports/grok-v8/`: **84/84 blob
  presenti, 0 mismatch SHA**. Le modifiche sono esattamente 90: 84 file
  sorgente, manifest, guida di import e quattro file di continuità/indice.
- Nessun file inatteso è stato modificato; `main`, backlog, stati e pesi sono
  invariati.
- Prossima azione: tenere la PR draft in review; non attivare il codice Python.
  Richiedere a Grok il ResponsePacket `UJ-RED-001` separato e verificabile.


### 2026-08-17 — ChatGPT/Codex — merge della branch Claude in `main`

- Operazione autorizzata dall'utente: PR #2 (`claude/ultrajarvis-repo-analysis-li6vvj`) è stata verificata e unita con merge commit `bb51093b23cb4b8f4f2335fc2bb856f7dc141731`.
- Provenienza verificata: head Claude `eaa7a5191ccbf4cb360019ceaab3ec365ff3863b`; `main` precedente `a0935645293599ec13064c51949b2b0b8440d449`. Il tree post-merge contiene sia i file Claude (contratti TypeScript, test, architettura, threat model, handoff e review) sia i componenti Python/Grok già presenti.
- Controlli remoti: PR #2 risulta `merged=true`, `state=closed`, con head atteso; nel tree di `main` sono presenti `CLAUDE.md`, `TASKCLAUDE.md`, `packages/contracts/src/runtime/common.ts`, `tests/contracts/tool-admission.test.mjs`, `core/planner.py`, `tools/math_helpers.py` e `taskgrok.md`.
- Verifica locale non distruttiva: sintassi JavaScript dei test passata. Non è stato possibile eseguire il typecheck completo perché il checkout non disponeva di `node_modules/tsc`; il parser TypeScript sperimentale di Node si è fermato su `declare const brand` in `common.ts`. Non dichiaro quindi una nuova esecuzione indipendente dei 138 test riportati dalla branch Claude.
- Limiti noti: l'artefatto Claude resta documentato come `PASS_WITH_ACTIONS`/REVIEW; F-001 (evidence sufficiency) e F-002 (replay/idempotency non implementato) non sono stati chiusi. Nessun peso o stato del backlog è stato accettato o promosso dal merge.
- Errore/correzione: la prima fotografia della PR la mostrava con base storica; la rilettura GitHub alla head Claude ha restituito `mergeable=clean`, quindi il merge è stato eseguito con `expected_head_sha` per evitare race.
- Prossima azione: tenere separate le PR draft del Program OS e dell'import Grok, chiudere i finding Claude con test/ADR e rieseguire il typecheck in un ambiente Node completo.
- Aggiornamento speculare: questa stessa sessione è stata aggiunta a `taskgpt.md` nella medesima pubblicazione.


### 2026-08-17 — ChatGPT/Codex — checkpoint remoto post-merge

- Correzione di continuità: il merge Claude è `bb51093b23cb4b8f4f2335fc2bb856f7dc141731`; il commit successivo che pubblica i ledger è `f7978cde9b2bae138a6939880f0ced5681a379ad`. Quindi la head reale di `main` a questo checkpoint è `f7978cde9b2bae138a6939880f0ced5681a379ad`, non `bb51093b…`.
- Stato PR verificato tramite API: PR #1 Program OS è OPEN/DRAFT, head `31f31b99…`, base storica `9d2a93de…`, `mergeable=dirty`; PR #3 import Grok è OPEN/DRAFT, head `97f7f06d…`, base `agent/ultrajarvis-master-prompt-v1`, `mergeable=clean`. Nessuna delle due è stata unita.
- Rilevazione importante: `AGENTS.md`, backlog e contratti Program OS restano sulla branch `agent/ultrajarvis-master-prompt-v1`, non sono ancora parte di `main`. Non descrivere `main` come se contenesse già il Program OS completo.
- Decisione operativa: mantenere PR #1 e #3 separate finché la base viene riallineata e i reviewer/owner gate restano documentati. Non cambiare task weight o status.
- Prossima azione: integrare prima gli output HUMAN_BRIDGE di Gemini (UJ-CAP-001 e UJ-GGL-001), poi creare branch/PR dedicate e soltanto dopo valutare una fusione controllata del Program OS.
- Verifica eseguita senza installazioni, billing, segreti o scritture esterne oltre a questo ledger commit.


### 2026-08-18 — ChatGPT/Codex — candidate hardening STRICT_ZERO del cloud bridge

- Ref iniziale: main@6af4a3721ab0d7f3272fd6e4e872b1331da99aa5; branch dedicata: agent/strict-zero-cloud-bridge-20260818.
- Output: cloud_bridge.py local-only, test senza rete in tests/test_cloud_bridge_strict_zero.py e review note in docs/program/reviews/inbox/CLOUD_BRIDGE_STRICT_ZERO_REVIEW_20260818.md.
- Correzione: provider cloud/pagati bloccati prima dell'adapter; endpoint locale limitato al loopback; nessuna lettura di API key.
- Controlli dichiarati: ispezione statica del diff e progettazione dei test; esecuzione runtime/test non disponibile in questo checkout. Nessuna API, billing, rete esterna o segreto usato.
- Stato/peso: candidate draft, nessuna task DONE, nessun backlog delta e nessun peso accettato.
- Prossima azione: review Claude/Grok e verifica in checkout con dipendenze; mantenere il percorso non su main finché la review non passa.
- Aggiornamento speculare: inserito in taskgpt.md.

### 2026-08-18 — ChatGPT/Codex — governance reconciliation for Claude and Grok

- Branch di coordinamento: `agent/chatgpt-governance-reconcile-20260818`, creata da `main@25b1b7d53ff5bc4b05348453ebb704aba3a88630`; nessuna scrittura su `main`, sulla branch Claude o sulla branch Grok.
- Correzione di provenienza: il pin missione/card è ora `d48e1e8519a8d7af90ea44e770f0db7fd3938fb3`; il precedente `3611b1b400cf57b5021bab228a3de9470d6eca5c` non contiene le quattro card. I quattro input card a `d48e1e8519a8d7af90ea44e770f0db7fd3938fb3` verificano gli SHA dichiarati.
- Allineamento contratto: UJ-RUN-001, UJ-CAP-001, UJ-GGL-001 e UJ-RED-001 hanno ora nel BACKLOG gli stessi cinque criteri AC-01..AC-05 delle rispettive card. Restano READY, 0/13; nessun peso o accettazione è stato modificato.
- Protezione anti-regressione: il validator Council rifiuta un pin missione/card divergente o criteri card/BACKLOG divergenti.
- Stato specialisti: la consegna Claude resta BLOCKED secondo il suo packet; Grok v8 resta uno snapshot isolato e non è una consegna UJ-RED-001. Questo commit non li sostituisce.
- Prossimo passo: consegnare a Claude e Grok le card corrette, ricevere i packet completi, verificare hash/ref/schema e importare solo dopo il reviewer gate.


### 2026-08-21 — ChatGPT/Codex — transizioni Program OS e verifica UJ-SEC-001

- Autorizzazione Christian: aggiornare e mergiare la PR #19, trasformare la transizione manuale in script, correggere AC-02 di UJ-INT-001 ed eseguire i tre comandi UJ-SEC-001.
- Head remota pubblicata prima del merge: `704d8efaeb121567088be3106235e827470b18c1` sulla PR #19; il tree remoto `1ff8ebd0d5ff17e6e497ccc4ec8a0adf29105ec4` coincide con il tree locale verificato.
- Transizione: `scripts/apply-program-transition.mjs` è dry-run per default; `--apply` richiede `--confirm-task`, verifica schema/pin/hash, scrive atomicamente BACKLOG+STATUS, esegue i due gate e fa rollback su errore. Nessuna azione GitHub è incorporata nello script.
- Regressioni: intake ReviewResult 7/7 PASS; transizione 5/5 PASS, incluso un vero apply READY→REVIEW a 0/13 in una worktree usa-e-getta; Program OS PASS (43 task, baseline 311, totale nonzero 340, accettato 26); Council PASS (5 schemi, 1 missione, 6 card); discovery card 5/5 task READY eleggibili coperti.
- Card: rimosso il tetto cablato a quattro task e aggiunte le card UJ-SEC-001 e UJ-CLD-001. Lo snapshot della card resta immutabile READY/0; il ledger vivo può avanzare senza invalidarla.
- UJ-INT-001 AC-02 ora distingue la baseline iniziale nominata 311 dal totale corrente nonzero 340.
- UJ-SEC-001: i tre comandi richiesti sono stati rieseguiti e passano: typecheck exit 0, build exit 0, approval-policy 28/28. Il ReviewResult Grok della PR #22 non è importabile: 11 errori reali (schema, finding_id, campo extra, task ancora READY e prova assente sul ref). Resta quindi READY 0/13; UJ-MCP-001 e UJ-SKL-001 restano BLOCKED. Nessun peso è stato inventato.
- Prossimo gate: Claude produce un ResponsePacket UJ-SEC-001 usando la nuova card; Grok corregge e ripubblica il ReviewResult con gli hash/schema canonici. Solo allora lo script può applicare REVIEW e una successiva accettazione valida.

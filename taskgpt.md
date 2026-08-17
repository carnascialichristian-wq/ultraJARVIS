# ultraJARVIS — briefing operativo per Claude, Gemini e Grok

<!-- ULTRAJARVIS_CROSS_AI_HANDOFF -->

Questo file permette a Claude, Gemini e Grok di riprendere il progetto senza
dipendere dalla cronologia di una chat. Non sostituisce il prompt canonico o il
backlog: li riassume e indica da dove ripartire. Prima di agire, ogni AI deve
leggere `AGENTS.md`, `gpt.md`, questo file, il prompt canonico, il ref remoto e
la propria DelegationCard.

## Regole di lavoro comuni

1. Un AI riceve una sola card/task primaria alla volta. Una card READY non è
   autorizzazione a lavorare su altre task né a cambiare `main`.
2. Dichiara le capacità realmente disponibili nella sessione. Un abbonamento
   consumer non dimostra diritti API o automazione.
3. Non usare API a consumo, billing, browser/UI automation, cookie/sessioni,
   token, segreti, inferenza pesante locale, account creation, messaggi esterni
   o azioni distruttive.
4. Restare in C1 e L2; ogni side effect fuori da INTERNAL_WRITE richiede un
   gate separato di Christian.
5. Restituire artefatti versionabili, fonti, limiti e un `ResponsePacket`
   conforme allo schema. Una risposta testuale non trasforma la task in DONE.
6. Alla fine aggiornare con blocchi append-only sia `gpt.md` sia `taskgpt.md`.
   Per Grok questo è obbligatorio anche quando il lavoro è solo una review o una
   falsificazione; senza scrittura GitHub diretta, inviare i blocchi esatti nel
   ResponsePacket per la pubblicazione via HUMAN_BRIDGE.

## Checkpoint da verificare prima di iniziare

| Campo | Valore da verificare remotamente |
|---|---|
| Repository | `carnascialichristian-wq/ultraJARVIS` |
| Branch | `agent/ultrajarvis-master-prompt-v1` |
| PR | [#1](https://github.com/carnascialichristian-wq/ultraJARVIS/pull/1), draft verso `main` |
| Ultimo checkpoint precedente | `d48e1e8519a8d7af90ea44e770f0db7fd3938fb3` |
| Contratti Council | `3611b1b400cf57b5021bab228a3de9470d6eca5c` |
| Stato portfolio | 0/311 peso accettato; M0 26/94 |

Il SHA scritto qui è un punto di partenza, non una licenza a ignorare la branch
corrente. Se la branch è avanzata, leggere il nuovo `gpt.md` e il nuovo resume
point prima di produrre output.

## Task pronte e materiale esatto da usare

| AI | Task | Card da usare | Output minimo | Reviewer / gate |
|---|---|---|---|---|
| Claude | `UJ-RUN-001` | `prompts/delegation-cards/UJ-RUN-001-CLAUDE.json` | provider-neutral runtime blueprint + ResponsePacket | reviewer indicato dalla card/backlog |
| Gemini | `UJ-CAP-001` | `prompts/delegation-cards/UJ-CAP-001-GEMINI.json` | Capability Registry basato su capacità osservate | reviewer indicato dalla card/backlog |
| Gemini | `UJ-GGL-001` | `prompts/delegation-cards/UJ-GGL-001-GEMINI.json` | inventario Google con fonti/date + ResponsePacket separato | reviewer indicato dalla card/backlog |
| Grok | `UJ-RED-001` | `prompts/delegation-cards/UJ-RED-001-GROK.json` | falsificazione zero-cost/cloud/automation + remediation | reviewer indicato dalla card/backlog |

Non inviare due card a Gemini nella stessa sessione se ciò compromette la
separazione o la qualità: le due task devono produrre ResponsePacket distinti.
Claude ha anche `UJ-SEC-001` e `UJ-CLD-001` READY nel backlog, ma non devono
superare `UJ-RUN-001` come task primaria senza una card esplicita e un nuovo
checkpoint.

## Review e integrazione

| Responsabile | Lavoro | Stato | Regola |
|---|---|---:|---|
| Grok | Review di `UJ-INT-001` / UJ-REV-004 | REVIEW richiesta | inviare `prompts/review-requests/UJ-INT-001-GROK.md`; controlla anti-gaming, coerenza ledger e prove; non assegnare peso senza criterio e evidenza |
| Claude | Review di `UJ-INT-006` | REVIEW richiesta | inviare `prompts/review-requests/UJ-INT-006-CLAUDE.md`; controlla schemi, missione, card, import/merge e limiti di sicurezza |
| ChatGPT | `UJ-INT-002` | BLOCKED | si attiva solo dopo quattro risposte ammesse, almeno REVIEW |
| Christian | UJ-META-002 e decisioni protette | REVIEW | costituzione, STRICT_ZERO_CARD, baseline M0 e merge restano decisioni del proprietario |

Ogni risposta è sottoposta alle fasi di
`docs/program/COUNCIL_IMPORT_AND_MERGE.md`: parse, schema, correlazione con
mission/card/task, hash, replay, policy, provenienza, ledger, review e merge.
Un pacchetto invalido viene respinto o quarantinato; non si corregge
silenziosamente dopo l'importazione.

## Cosa deve contenere una ResponsePacket

- ID, card ID, mission ID, task ID e prodotto/AI coerenti con la card;
- commit/ref e hash SHA-256 per ogni artefatto;
- capacità realmente usate, controlli passati/falliti/non eseguiti;
- fatti distinti da assunzioni, proposte, rischi e blocker;
- delta ledger che può proporre REVIEW, BLOCKED o FAILED, mai auto-DONE;
- attestazione esplicita su costo zero, no billing, no secrets, no UI automation
  e rispetto di C1/L2;
- prossimo passo e blocchi append-only per `gpt.md` e `taskgpt.md`.

Il formato completo è vincolato da
`schemas/response-packet.schema.json`; non inventare campi extra perché gli
schemi sono chiusi (`additionalProperties: false`).

## Errori già scoperti: non ripeterli

| Evento | Trattamento corretto |
|---|---|
| Reviewer trascritti male per `UJ-INT-002` e `UJ-INT-006` | i reviewer canonici sono Claude; `UJ-INT-001` resta Grok e un validator blocca regressioni |
| Confronto non deterministico dei Set nel validator Council | ora usa array ordinati; eseguire sempre il validator aggiornato |
| Rischio di modificare il file degli input specialistici dopo il pinning | non alterare `SPECIALIST_INPUTS.md` senza rigenerare hash/card e ripetere validazioni |
| Ricavare stato dalla chat | verificare sempre `BACKLOG.json`, PR e ref remoto |
| Scambiare artefatto prodotto per progresso | mantenere `completed_weight` a zero fino a ReviewResult/review indipendente valida |
| Affermare supporto API/automazione da un abbonamento | registrare solo accesso e capacità osservati, con fonte e data |

## Stato del programma e veri blocker

- Nessuna review o commento è ancora presente sulla PR #1.
- `UJ-INT-001` è 0/13 in REVIEW: serve Grok.
- `UJ-INT-006` è 0/8 in REVIEW: serve Claude.
- Le richieste di review pronte sono `prompts/review-requests/UJ-INT-001-GROK.md`
  e `prompts/review-requests/UJ-INT-006-CLAUDE.md`; non sono un'approvazione.
- Le quattro card M0 esistono ma nessuna ResponsePacket è stata importata.
- `UJ-INT-002` non può iniziare; non chiedere a ChatGPT di sintetizzare output
  non ancora ricevuti.
- Non esiste una velocità accettata, quindi ETA e percentuali extra sono
  proibite.

## Formato append obbligatorio per ogni AI

```md
### YYYY-MM-DD — <AI/prodotto> — <task-id>

- Ref iniziale/finale e card usata:
- Artefatti e SHA-256 restituiti:
- Capacità effettivamente osservate:
- Controlli eseguiti e risultato:
- Errori, falsificazioni, assunzioni, rischi e blocker:
- Stato proposto / peso accettato: `<state>`, `<accepted>/<total>` e ragione:
- Prossima azione, reviewer e gate:
- Stesso aggiornamento aggiunto a `gpt.md`:
```

Se non puoi pubblicare su GitHub, restituisci questo blocco completo nel tuo
output. ChatGPT o Christian lo importano con review, senza cambiare i pesi solo
perché il blocco esiste.

## Ultima nota di continuità

Questo briefing viene mantenuto da ChatGPT a ogni sessione e da Grok a ogni
chiusura di lavoro; Claude e Gemini devono fornire l'append corrispondente nel
proprio handoff. Se un file contraddice il backlog, prevale il backlog e il
conflitto va registrato, non eliminato.

## Registro append-only

### 2026-08-17 — ChatGPT/Codex — continuità multi-sessione

- Ref iniziale osservato: `d48e1e8519a8d7af90ea44e770f0db7fd3938fb3`; ref
  finale: leggere la head della PR #1 che contiene questa voce.
- Artefatti: creati questo briefing e `gpt.md`; il protocollo è stato collegato
  a AGENTS, README, handoff, resume point, project state, backlog e validator.
- Controlli: sintassi Node, Program OS validator, Council validator, JSON,
  fence Markdown e controllo segreti — PASS.
- Stato: nessuna task avanzata artificialmente; restano 0/311 e M0 26/94.
- Limite reale: Claude, Gemini e Grok devono ancora ricevere una card e
  restituire ResponsePacket validi via HUMAN_BRIDGE.
- Prossimo passo: usare una sola card pronta per volta; includere nel ritorno il
  prossimo blocco append-only per entrambi i registri.

### 2026-08-17 — ChatGPT/Codex — pacchetti di review per i gate M0

- Ref iniziale osservato: `2146c39b47d1985e4b3e3e5049b8ec55e54df2f4`; ref
  finale: leggere la head della PR #1 che contiene questa voce.
- Artefatti: pronti
  `prompts/review-requests/UJ-INT-001-GROK.md` e
  `prompts/review-requests/UJ-INT-006-CLAUDE.md`.
- Cosa fare: Grok deve usare il primo per UJ-INT-001; Claude deve usare il
  secondo per UJ-INT-006. Entrambi devono ritornare un ReviewResult v1 completo
  con hash, prove, outcome e blocchi append-only per i due registri.
- Controlli: sintassi Node, Program OS validator, Council validator, JSON,
  fence Markdown e controllo segreti — PASS.
- Stato: nessuna review è ancora arrivata e nessun peso è cambiato: 0/311,
  M0 26/94, UJ-INT-001 0/13 REVIEW, UJ-INT-006 0/8 REVIEW.
- Prossimo passo: inviare i review request tramite HUMAN_BRIDGE prima di
  tentare import o aggiornamenti del ledger.

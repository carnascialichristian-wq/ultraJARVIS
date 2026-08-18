# CLAUDE HANDOFF — UJ-RUN-001 — RICHIESTA DI CONSEGNA

Data: 2026-08-18
Canale: HUMAN_BRIDGE / copia-incolla
Repository: carnascialichristian-wq/ultraJARVIS
Task: UJ-RUN-001
Card: UJ-CARD-RUN-001-CLAUDE
Mission: UJ-MISSION-M0-COUNCIL-001
Owner: CLAUDE
Reviewer: GEMINI
Stato/peso: READY, 0/13 accettato

## Scopo

Sei l’agente primario Claude per la prima task Runtime. Produci un blueprint schema-first, provider-neutral e verificabile. Non eseguire UJ-SEC-001 o UJ-CLD-001: puoi citare threat notes e checklist di integrazione, ma la loro ricerca e consegna restano separate.

## Input obbligatori

Leggi integralmente al commit di lettura della card 3611b1b400cf57b5021bab228a3de9470d6eca5c:

- docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md
- docs/program/SPECIALIST_INPUTS.md
- docs/program/COUNCIL_PACKETS.md
- schemas/response-packet.schema.json
- prompts/delegation-cards/UJ-RUN-001-CLAUDE.json

Hash SHA-256 pinati:

| Input | SHA-256 |
|---|---|
| docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md | a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87 |
| docs/program/SPECIALIST_INPUTS.md | 72edc3952585fb2c31cafd0fa206ab2e66647d49d3190202adf2eba71593590a |
| docs/program/COUNCIL_PACKETS.md | eb4d0d0dd46ebdaf07b7ab70380ee80fe0b35da222953f80576749cd3d29ff88 |
| schemas/response-packet.schema.json | ee44e1b7e262bc0817e0b4f65de8830d122687618a59774fdabfddf3b7e69c0a |

Se un pin non corrisponde, non inventare: restituisci BLOCKED con ref e hash atteso/osservato.

## Output obbligatorio

Restituisci almeno il file completo docs/architecture/RUNTIME_BLUEPRINT.md. Puoi aggiungere draft TypeScript/JSON schemas soltanto se realmente necessari; ogni file aggiuntivo deve avere un proprio blocco FILE, path relativo e SHA nel packet. Non aggiungere file vuoti o descrizioni al posto dei contenuti.

Formato di consegna:

=== FILE: docs/architecture/RUNTIME_BLUEPRINT.md ===
<contenuto completo>
=== END FILE ===

=== FILE: <eventuale schema aggiuntivo> ===
<contenuto completo>
=== END FILE ===

=== RESPONSE PACKET: UJ-RUN-001 ===
<un solo JSON valido, senza Markdown fence interno>
=== END RESPONSE PACKET ===

Non troncare, non usare ellissi e non dichiarare che Gemini ha approvato. Se non puoi consegnare in modo verificabile, restituisci il file completo disponibile e marca il packet BLOCKED con il motivo preciso.

## Contenuto tecnico richiesto

Il blueprint deve coprire in modo operativo e provider-neutral:

- AgentManifest: identità, versione, capability, policy, data class, tool allowlist, budget, reviewer e provenance;
- TeamSpec: membri, ruoli, input/output, ownership, reviewer, limiti e lifecycle;
- Supervisor state machine: stati, transizioni, precondizioni, rifiuti, timeout e terminal states;
- DepthGuard: profondità, fan-out, loop detection, escalation e default-deny;
- RunLedger: eventi append-only, schema minimo, correlation/idempotency key, replay e audit;
- checkpoint, resume, cancellation, retry, idempotency e deduplication;
- tool allowlist ereditata soltanto per concessione esplicita, mai implicitamente;
- comunicazione tipizzata tramite artifact/ResponsePacket, hash e versioni;
- failure containment, partial failure, provider failure, human-bridge failure, loop e replay scenarios;
- threat notes collegate a UJ-SEC-001 senza sostituirne il lavoro;
- integration review checklist per ChatGPT e Gemini.

## Acceptance criteria da dimostrare

- AC-01: AgentManifest, TeamSpec, Supervisor, DepthGuard e RunLedger sono contratti provider-neutral;
- AC-02: checkpoint, cancellation, retry, idempotency, loop, replay e failure containment sono binary-testable;
- AC-03: tool access è default-deny e non viene ereditato implicitamente;
- AC-04: schemi proposti e checklist sono completi per la review ChatGPT/Gemini;
- AC-05: ResponsePacket valido, ogni artifact hashato, proposta REVIEW e accepted weight invariato 0/13.

Per ogni criterio inserisci path, SHA previsto/finale e un controllo concreto. Un testo architetturale senza prove o invarianti non basta.

## ResponsePacket obbligatorio

Valida il JSON contro schemas/response-packet.schema.json, schema_version ultrajarvis.response-packet/v1, senza proprietà extra. Deve contenere tutti i required fields:

schema_version, response_id, created_at, card_id, mission_id, ai_id, product, source_commit_sha, capabilities_actually_used, task_id, status, executive_delta, facts, assumptions, decisions_proposed, artifacts, verification, side_effects, risks, task_ledger_delta, remaining_work, confidence, policy_attestation, handoff.

Valori:

- ai_id CLAUDE;
- card_id UJ-CARD-RUN-001-CLAUDE;
- mission_id UJ-MISSION-M0-COUNCIL-001;
- task_id UJ-RUN-001;
- source_commit_sha: SHA Git reale di 40 caratteri, non hash di file;
- status REVIEW se verificabile, altrimenti BLOCKED o FAILED;
- artifacts con path relativo, SHA-256 dei byte finali, media type e data class;
- verification con checks_run, passed, failed e not_run;
- task_ledger_delta solo proposto, accepted weight sempre 0/13;
- nessuna approvazione attribuita a Gemini.

## Vincoli assoluti

- no API pay-per-use, billing, account, deploy, produzione o API key;
- no browser/cookie/session automation e nessun dato oltre C1;
- no heavy local inference;
- no scrittura diretta su main, merge o retarget di PR;
- no task DONE e no accepted weight;
- non simulare output, review o consenso di altri agenti.

## Preflight

Prima dell’invio:

1. verifica tutti i pin input e il source_commit_sha;
2. conta i blocchi FILE e chiudi ogni END FILE;
3. calcola SHA-256 sui byte finali e annota il newline;
4. valida JSON/schema e packet;
5. verifica AC-01…AC-05 con prove;
6. controlla segreti, API, billing, side effects e pesi.

Se un controllo fallisce, non inviare una consegna parziale non dichiarata: usa BLOCKED e descrivi la prova del fallimento.

## Stato coordinamento

- main corrente al momento della preparazione: 1e40376b6c30b4452090c598c5f6ddf265e36852;
- PR #3/#5/#6 restano separate e draft;
- PR #7 è una candidate STRICT_ZERO separata, non una review di questa task;
- UJ-CAP-001/UJ-GGL-001 restano Gemini READY 0/13;
- UJ-SEC-001 e UJ-CLD-001 restano in coda: questa consegna è solo UJ-RUN-001.

Restituisci il contenuto originale tramite HUMAN_BRIDGE. ChatGPT congelerà bytes, ref, hash e schema prima di pubblicare una branch/PR dedicata.
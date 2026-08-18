# GROK HANDOFF — UJ-RED-001 — RICHIESTA DI CONSEGNA

Data: 2026-08-18
Canale: HUMAN_BRIDGE / copia-incolla
Repository: carnascialichristian-wq/ultraJARVIS
Task: UJ-RED-001
Card: UJ-RED-001-GROK / UJ-CARD-RED-001-GROK
Mission: UJ-MISSION-M0-COUNCIL-001
Owner: GROK
Reviewer: CHATGPT
Stato/peso: READY, 0/13 accettato

## Obiettivo

Falsifica con prove le assunzioni zero-cost, cloud-only, subscription e automation di ultraJARVIS. La consegna precedente PR #3 è soltanto uno snapshot Grok v8: il report richiesto e il ResponsePacket non sono presenti. Non trattare i claim dello snapshot come fatti verificati.

PR #6 contiene una candidate review ChatGPT che segnala FAIL per UJ-RED-001; non è un’approvazione e non devi dichiarare che ChatGPT o altri reviewer abbiano accettato il lavoro.

## Input obbligatori

Leggi integralmente, al commit di lettura della card 3611b1b400cf57b5021bab228a3de9470d6eca5c:

- prompts/delegation-cards/UJ-RED-001-GROK.json;
- docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md;
- docs/program/SPECIALIST_INPUTS.md;
- docs/program/COUNCIL_PACKETS.md;
- schemas/response-packet.schema.json;
- docs/program/GROK_V8_SNAPSHOT_IMPORT.md e IMPORT_MANIFEST.json solo come materiale da falsificare, non come prova di completamento.

Hash SHA-256 pinati dalle card:

| Input | SHA-256 |
|---|---|
| docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md | a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87 |
| docs/program/SPECIALIST_INPUTS.md | 72edc3952585fb2c31cafd0fa206ab2e66647d49d3190202adf2eba71593590a |
| docs/program/COUNCIL_PACKETS.md | eb4d0d0dd46ebdaf07b7ab70380ee80fe0b35da222953f80576749cd3d29ff88 |
| schemas/response-packet.schema.json | ee44e1b7e262bc0817e0b4f65de8830d122687618a59774fdabfddf3b7e69c0a |

Se un pin non corrisponde, restituisci BLOCKED con ref, hash atteso e hash osservato; non inventare.

## Output esatto

Restituisci un solo artifact report e un solo ResponsePacket:

=== FILE: docs/evaluations/ZERO_COST_FALSIFICATION_REPORT.md ===
<report completo>
=== END FILE ===

=== RESPONSE PACKET: UJ-RED-001 ===
<un solo JSON valido, senza Markdown fence interno>
=== END RESPONSE PACKET ===

Non aggiungere snapshot, codice, file placeholder o report parziali non dichiarati. Non troncare e non usare ellissi.

## Contenuto obbligatorio del report

Per ogni finding inserisci sempre:

- claim/assumption esatta;
- evidence needed e fonte o prova disponibile;
- impatto tecnico, economico, legale, privacy e operativo;
- severity, probability e detectability;
- test riproducibile di falsificazione;
- mitigation concreta e reversibile;
- owner responsabile;
- condizione STOP/GO;
- alternativa più semplice quando esiste.

Copri almeno:

- deprecazione o rimozione delle capability e quote dei provider;
- costo nascosto non monetario: rate limit, tempo, account, storage, export, lock-in, manutenzione;
- bypass di DepthGuard, fan-out, loop e retry;
- failure del HUMAN_BRIDGE e perdita di provenienza;
- memory poisoning e artifact/provenance tampering;
- Skill Forge escalation e creazione di tool non autorizzati;
- progress/ETA gaming e metriche non falsificabili;
- il percorso cloud_bridge/OpenAI pay-per-use e il gate STRICT_ZERO;
- alternative local-only o human-approved.

Critica generica senza remediation, owner e test riproducibile è insufficiente.

## Acceptance criteria

- AC-01: report con evidence requirements, mitigazioni, owner e STOP/GO esiste;
- AC-02: ogni finding ha falsificazione riproducibile e impatto multi-dimensionale;
- AC-03: zero-cost, provider, automation, human bridge, memory e governance sono realmente attaccati;
- AC-04: sono offerte alternative semplici e reversibili;
- AC-05: ResponsePacket separato valido, artifact hashato, proposta REVIEW e accepted weight 0/13.

## ResponsePacket

Valida contro schemas/response-packet.schema.json, schema_version ultrajarvis.response-packet/v1, senza proprietà extra. Required fields:

schema_version, response_id, created_at, card_id, mission_id, ai_id, product, source_commit_sha, capabilities_actually_used, task_id, status, executive_delta, facts, assumptions, decisions_proposed, artifacts, verification, side_effects, risks, task_ledger_delta, remaining_work, confidence, policy_attestation, handoff.

Valori obbligatori:

- ai_id GROK;
- card_id UJ-CARD-RED-001-GROK;
- mission_id UJ-MISSION-M0-COUNCIL-001;
- task_id UJ-RED-001;
- reviewer CHATGPT non equivale ad approvazione;
- source_commit_sha: SHA Git reale di 40 caratteri;
- status REVIEW se verificabile, altrimenti BLOCKED o FAILED;
- artifacts con path, SHA-256 dei byte finali, media type e data class;
- verification con checks_run, passed, failed e not_run;
- task_ledger_delta con accepted weight invariato a 0/13.

## Vincoli assoluti

- no API pay-per-use, billing, account, deploy, produzione o segreti;
- no browser/cookie/session automation e nessun dato oltre C1;
- no scrittura diretta su main, merge o retarget PR #3;
- no task DONE, peso o consenso inventato;
- nessuna prova può uscire dal repository o essere sostituita da claim non verificati.

## Preflight

1. Verifica tutti i pin e source_commit_sha;
2. verifica un solo blocco FILE completo e un solo packet;
3. calcola SHA-256 sui byte finali e annota newline;
4. valida packet contro lo schema chiuso;
5. collega ogni AC e finding a path/hash/check;
6. controlla policy, segreti, billing e side effects.

Se un controllo fallisce, restituisci il report completo e marca il packet BLOCKED/FAILED con evidenza precisa.

## Coordinamento

- main di coordinamento al momento della preparazione: 1e40376b6c30b4452090c598c5f6ddf265e36852;
- PR #3 resta OPEN/DRAFT, snapshot Grok non accettato;
- PR #6 resta candidate review FAIL/non fidata;
- PR #7 è candidate STRICT_ZERO separata;
- UJ-CAP-001/UJ-GGL-001 restano Gemini READY 0/13;
- UJ-RUN-001 è stato consegnato come handoff Claude separato.

Restituisci la consegna originale tramite HUMAN_BRIDGE. ChatGPT congelerà bytes/ref/hash, verificherà il report e pubblicherà branch/PR dedicata solo se l’intake supera tutti i gate.
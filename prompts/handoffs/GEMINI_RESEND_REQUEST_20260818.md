# GEMINI HANDOFF — RICHIESTA DI RESEND COMPLETO — AGGIORNAMENTO 2026-08-18

Questo è il prompt operativo da copiare integralmente a Gemini. Il contratto dettagliato del resend è riportato sotto e resta vincolante.

## Stato remoto verificato prima della pubblicazione

- main corrente osservata il 2026-08-18: 6af4a3721ab0d7f3272fd6e4e872b1331da99aa5; le PR operative mantengono la base storica e non vengono riallineate da questo handoff.

- Il precedente handoff Gemini è in quarantena: 3 file completi, 1 file troncato, 4 file assenti e 0 ResponsePacket.
- Le sole task Gemini READY sono UJ-CAP-001 (reviewer CLAUDE, 0/13) e UJ-GGL-001 (reviewer GROK, 0/13). UJ-INF-001, UJ-MEM-001, UJ-KNW-001, UJ-MED-001 e UJ-ADK-001 sono BLOCKED.
- PR #5 è la quarantena OPEN/DRAFT sulla branch agent/gemini-handoff-quarantine-20260817; il suo head prima di questo aggiornamento è 30ab1a2ad1a2302d28a55ab08069da5ce787a9dc.
- PR #3 è OPEN/DRAFT, head 97f7f06d56f39101b6a54a74dfbcafea49b72676, basata sulla branch Program OS storica: non modificarla, non retargettarla e non fonderla.
- PR #6 è un candidato di review Grok separato e non fidato: non attribuire approvazioni a Grok.
- main non deve essere scritto o fuso; nessun task weight è stato accettato.

## Criteri non negoziabili per questa nuova consegna

1. Restituisci esattamente 3 blocchi FILE e 2 ResponsePacket separati: nessun artifact mancante, troncato o aggiuntivo.
2. Usa gli input e gli SHA pinati nelle card al commit 3611b1b400cf57b5021bab228a3de9470d6eca5c; source_commit_sha deve essere un vero SHA Git di 40 caratteri, non un hash di file.
3. Calcola SHA-256 sui byte finali degli artifact, indicando il newline finale; esegui JSON.parse e valida entrambi i packet contro lo schema chiuso ultrajarvis.response-packet/v1.
4. Ogni claim materiale, quota, prezzo, status, billing o automazione deve avere fonte ufficiale primaria e data UTC; non rendere universale una quota che varia per modello, progetto, tier o account.
5. Mantieni C1, HUMAN_BRIDGE, INTERNAL_WRITE e L2: niente segreti, billing, API a consumo, UI automation, browser/cookie/session automation, heavy local inference, merge, deploy, main write, DONE o peso diverso da 0/13.
6. Se un controllo fallisce, non inviare una risposta parziale: restituisci i contenuti completi e marca il packet interessato BLOCKED o FAILED con evidenza precisa.

Il destinatario deve leggere e seguire integralmente il prompt seguente.

# GEMINI RESEND REQUEST — CONTRATTO COMPLETO

**Data:** 2026-08-18  
**Mittente:** ChatGPT/Codex — Repository Custodian & Orchestrator  
**Canale:** HUMAN_BRIDGE  
**Repository:** `carnascialichristian-wq/ultraJARVIS`

## Scopo

Il primo pacchetto ricevuto è stato messo in quarantena perché troncato, incompleto e privo dei ResponsePacket obbligatori. Devi ora restituire una consegna **completa, byte-stabile e verificabile** per i soli task che risultano attualmente `READY`:

- `UJ-CAP-001` — reviewer: `CLAUDE`;
- `UJ-GGL-001` — reviewer: `GROK`.

Non produrre o dichiarare completati `UJ-INF-001`, `UJ-KNW-001`, `UJ-MEM-001`, `UJ-MED-001` o `UJ-ADK-001`: nel backlog corrente sono task dipendenti e bloccati, senza card READY valida per questa consegna.

## Input da leggere e fissare

Leggi integralmente gli artefatti ai commit e agli hash indicati nelle card GitHub:

- commit/ref di lettura delle card: `3611b1b400cf57b5021bab228a3de9470d6eca5c`;
- prompt canonico: `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md`;
- `docs/program/SPECIALIST_INPUTS.md`;
- `docs/program/COUNCIL_PACKETS.md`;
- `schemas/response-packet.schema.json`.

Hash SHA-256 pinned dalle card:

| Input | SHA-256 |
|---|---|
| Master Prompt | `a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87` |
| SPECIALIST_INPUTS | `72edc3952585fb2c31cafd0fa206ab2e66647d49d3190202adf2eba71593590a` |
| COUNCIL_PACKETS | `eb4d0d0dd46ebdaf07b7ab70380ee80fe0b35da222953f80576749cd3d29ff88` |
| ResponsePacket schema | `ee44e1b7e262bc0817e0b4f65de8830d122687618a59774fdabfddf3b7e69c0a` |

Se un input non è leggibile o non corrisponde all’hash, non inventare: segnala `BLOCKED` nel relativo ResponsePacket e indica il mismatch.

## Output obbligatorio

Restituisci **esattamente** questi 3 artefatti e **2 ResponsePacket separati**:

1. `docs/program/CAPABILITY_REGISTRY.md`;
2. `docs/program/CAPABILITY_REGISTRY.json`;
3. `docs/evidence/GOOGLE_CAPABILITY_EVIDENCE_PACK.md`;
4. ResponsePacket separato per `UJ-CAP-001`;
5. ResponsePacket separato per `UJ-GGL-001`.

Usa questo contenitore senza omissioni:

```text
=== FILE: docs/program/CAPABILITY_REGISTRY.md ===
<contenuto completo>
=== END FILE ===

=== FILE: docs/program/CAPABILITY_REGISTRY.json ===
<JSON completo>
=== END FILE ===

=== FILE: docs/evidence/GOOGLE_CAPABILITY_EVIDENCE_PACK.md ===
<contenuto completo>
=== END FILE ===

=== RESPONSE PACKET: UJ-CAP-001 ===
<un solo JSON valido>
=== END RESPONSE PACKET ===

=== RESPONSE PACKET: UJ-GGL-001 ===
<un solo JSON valido>
=== END RESPONSE PACKET ===
```

Non interrompere blocchi, non usare ellissi, non sostituire contenuti con descrizioni e non racchiudere l’intero JSON in Markdown fences dentro il blocco.

## Requisiti UJ-CAP-001

Il Registry deve coprire tutti e quattro i prodotti primari:

- OpenAI/ChatGPT;
- Anthropic/Claude;
- Google/Gemini;
- xAI/Grok.

Per ogni capability materiale inserisci, in Markdown e nel JSON coerentemente:

- capability ID e nome;
- prodotto e access path;
- `WEB_UI`, `API`, SDK o altro modality;
- separazione esplicita subscription vs API entitlement;
- autenticazione senza valori segreti;
- piano/account/region quando rilevante;
- costo incrementale e requisito billing;
- quota/limite con modello, tier, progetto e periodo se applicabile;
- data e ora di verifica in UTC;
- URL ufficiale primario specifico per la claim;
- stato soltanto tra `ACTIVE`, `HUMAN_BRIDGE`, `PREVIEW`, `BLOCKED`, `DEPRECATED`, `UNKNOWN`;
- automation/UI risk e fallback;
- data/privacy/export policy;
- confidence e motivazione.

Non usare una quota come universale se la fonte dice che varia per modello, progetto, tier o account. Se non puoi provarla, usa `UNKNOWN` o `BLOCKED`.

## Requisiti UJ-GGL-001

L’Evidence Pack deve inventariare soltanto capability Google rilevanti:

- Gemini API/AI Studio;
- Vertex AI;
- ADK/A2A;
- NotebookLM;
- Colab;
- Firebase;
- Workspace/Apps Script;
- Labs/media/creative tools.

Per ogni voce devi distinguere:

- prodotto, accesso e account/region;
- subscription vs API;
- quota e billing;
- strict-zero-card eligibility;
- automazione consentita o vietata;
- data/privacy/export;
- diritti commerciali/media dove pertinenti;
- fonte ufficiale primaria e data UTC;
- `ACTIVE`, `PREVIEW`, `DEPRECATED`, `UNKNOWN` o `BLOCKED`;
- fallback e prodotti non necessari.

Non trasformare l’inventario in una decisione architetturale definitiva. Le raccomandazioni per `UJ-INF-001` devono rimanere proposte e non sbloccare quel task.

Fonti Google da controllare in forma canonica, senza affidarsi solo a redirect:

- https://ai.google.dev/gemini-api/docs/rate-limits
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/terms
- https://cloud.google.com/vertex-ai/pricing
- https://firebase.google.com/pricing
- https://research.google.com/colaboratory/faq.html
- https://developers.google.com/apps-script/guides/services/quotas
- documentazione ufficiale ADK/A2A e termini delle singole Labs, se usati.

## ResponsePacket

Crea due JSON distinti conformi integralmente a `ultrajarvis.response-packet/v1`.

Valori obbligatori:

- `ai_id: "GEMINI"`;
- `mission_id: "UJ-MISSION-M0-COUNCIL-001"`;
- `card_id: "UJ-CARD-CAP-001-GEMINI"` oppure `"UJ-CARD-GGL-001-GEMINI"`;
- `task_id` corrispondente;
- `status: "REVIEW"` se la consegna è verificabile, altrimenti `"BLOCKED"` o `"FAILED"`;
- `source_commit_sha`: SHA Git reale di 40 caratteri del commit degli input letti, mai uno SHA-256 di file;
- `artifacts`: hash SHA-256 dei byte esatti degli artefatti consegnati, con path/media type/data class;
- `verification`: checks_run, passed, failed e not_run;
- `task_ledger_delta`: proposta separata per il task, sempre con accepted weight invariato a `0/13`;
- `remaining_work`, confidence, rischi, side effects e handoff;
- tutte le attestazioni di policy vere: nessun segreto, nessuna API a pagamento, nessun billing, nessuna automazione UI consumer, nessuna inferenza locale pesante, data class C1, side-effect limit rispettato.

Ogni ResponsePacket deve dimostrare i cinque acceptance criteria della propria card con path, SHA e check concreto. Non creare un packet unico, non unire i due task e non affermare che Claude o Grok hanno approvato qualcosa.

## Vincoli assoluti

- Nessun valore segreto o API key.
- Nessun billing, carta, account o servizio creato.
- Nessuna API pay-per-use.
- Nessuna automazione di browser, cookie, sessione consumer o scraping.
- Nessuna scrittura diretta su `main`.
- Nessun merge.
- Nessun task `DONE`.
- Nessun peso accettato: entrambi restano `0/13`.
- Se una fonte è incerta, usa `UNKNOWN`/ `BLOCKED`, non una supposizione.

## Pre-consegna obbligatoria

Prima di inviare:

1. conta esattamente 3 blocchi `FILE` completi;
2. verifica che ogni blocco termini con `=== END FILE ===`;
3. esegui JSON.parse sul Registry;
4. calcola SHA-256 sui byte finali committabili, specificando il newline finale;
5. valida entrambi i ResponsePacket contro lo schema;
6. controlla che gli ID dei packet, task, card e reviewer siano corretti;
7. controlla che non ci siano segreti, claim senza fonte/data o pesi diversi da 0/13.

Se anche un solo controllo fallisce, restituisci comunque i dati completi ma imposta il relativo packet a `BLOCKED` e descrivi il motivo preciso.

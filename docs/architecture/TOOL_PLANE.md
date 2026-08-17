# TOOL PLANE — ToolManifest, MCP Admission e architettura P0

| Metadato | Valore |
|---|---|
| Task ID | UJ-MCP-001 |
| Milestone | M8 |
| Owner | CLAUDE · Reviewer | **GEMINI** |
| Stato | REVIEW |
| Peso | 8 |
| Dipendenza | UJ-SEC-001 (REVIEW) — soddisfatta |
| Contratti | `packages/contracts/src/tools/` |
| Test | `tests/contracts/tool-admission.test.mjs` — 30/30 verdi |

---

## 1. Premessa che governa tutto il documento

> **MCP è un modo di esporre tool, non una garanzia di sicurezza.**
> (prompt canonico §12)

Questa frase va presa alla lettera. Un server MCP è codice di terzi che dichiara cosa sa
fare. La dichiarazione è **input non fidato**, esattamente come una pagina web. Il fatto
che parli un protocollo standard non dice nulla sulla sua condotta.

Conseguenza pratica: ogni server, **locale o remoto**, passa dalla stessa admission.
Non esiste una corsia preferenziale per "è ufficiale", "è popolare" o "lo usano tutti" —
l'Articolo 11 lo vieta esplicitamente.

## 2. Scopo di questo task

UJ-MCP-001 esiste per tre ragioni, in ordine di importanza:

1. **Chiudere due mitigazioni P0** identificate in UJ-SEC-001, che nessun altro task copre;
2. definire il `ToolManifest` come contratto verificabile;
3. fissare l'ordine di costruzione dei tool, perché costruirli nell'ordine sbagliato
   crea potere prima del controllo.

### 2.1 Le due mitigazioni P0 — perché sono qui e non altrove

| ID | Mitigazione | Minaccia chiusa | Perché era urgente |
|---|---|---|---|
| **P0-1** | Solo il tool runtime può emettere eventi `tool.*` | **TH-10** proof fabrication (`CRITICA`/`ALTA`) | senza, un agente scrive `tool.returned` senza aver chiamato il tool e produce una catena **integra e falsa** |
| **P0-2** | Un tool che scrive all'esterno deve supportare la lookup per idempotency key | **R-RUN-03** doppio side effect | senza, dopo un crash il runtime non può sapere se la scrittura è avvenuta |

Entrambe erano **specificate ma non meccaniche** dopo UJ-RUN-001 e UJ-SEC-001.
Ora sono codice con test che le violano deliberatamente.

---

## 3. P0-1 — Chi può attestare l'esecuzione di un tool

### 3.1 Il problema, in una frase

L'hash chain del RunLedger prova che **un evento è stato registrato**, non che il fatto
registrato sia **vero**.

Questa distinzione è la ragione per cui TH-10 resta `CRITICA` anche con un audit trail
perfetto. Un agente che scrive:

```
{ type: "tool.returned", actor: <agentId>, payload: { resultHash: "..." } }
```

senza aver mai chiamato il tool produce una catena di hash **perfettamente valida**.
`verifyLedgerChain()` la considera intatta, perché lo è: nessuno l'ha manomessa
a posteriori. È stata scritta falsa fin dall'origine.

### 3.2 La soluzione: vincolare l'emittente, non solo il registro

Introduco un attore distinto, `TOOL_RUNTIME`, separato da qualunque agente, e la regola:

> Gli eventi `tool.called`, `tool.returned` e `tool.failed` possono essere emessi
> **soltanto** da `TOOL_RUNTIME`.

Nessuna eccezione. In particolare **nemmeno il Supervisor e nemmeno il proprietario**:
non perché siano sospetti, ma perché l'attestazione dell'esecuzione di un tool deve
provenire dall'unico componente che l'esecuzione l'ha davvero effettuata. Un'eccezione
"solo per il supervisor" ricrea immediatamente il vettore, perché il supervisor riceve
input dagli agenti.

A questo si aggiunge `ADM-14`: un tool che **dichiara nel proprio manifest** di emettere
eventi `tool.*` viene rifiutato in admission. Chiude il tentativo di ottenere il
privilegio dichiarandolo invece di usurparlo.

### 3.3 Cosa questa mitigazione NON risolve

Onestà necessaria: P0-1 impedisce a un agente di **falsificare l'attestazione**.
Non impedisce a un agente di **mentire nel proprio `ResultEnvelope`** — di dichiarare
"ho completato il task" quando non l'ha fatto.

Contro quello servono altre due cose, entrambe già in campo ma nessuna meccanica:
- l'Articolo 2 e la proposta **P-05** (nessuna affermazione di lavoro senza prova
  riproducibile);
- il reviewer indipendente, che è processo, non codice.

**La copertura di TH-10 è quindi parziale, e va detto:** P0-1 rende impossibile
falsificare la prova *di aver chiamato un tool*; non rende impossibile un resoconto
gonfiato. Chi legge il risk register non deve dedurre che TH-10 sia chiusa.

---

## 4. P0-2 — Idempotency lookup obbligatoria per le scritture

### 4.1 Il problema

Il runtime scrive un checkpoint prima di ogni side effect (regola d'oro §8.1 del
blueprint). Ma esiste una finestra irriducibile:

```
1. checkpoint scritto
2. chiamata al tool  ────┐
                         │  ← crash qui
3. esito registrato  ────┘
```

Dopo il crash, l'operazione è in `pendingSideEffects` con esito **ignoto**. Il runtime
deve decidere: rieseguire (rischio di doppio effetto) o saltare (rischio di lavoro perso).

L'unico modo per **sapere** invece di indovinare è chiedere al tool:
*"l'operazione con chiave K è già avvenuta?"*

### 4.2 La regola

> Un tool con `sideEffect` pari a `EXTERNAL_WRITE` o `DESTRUCTIVE` **non è ammissibile**
> se non espone `supportsLookupByKey`.

Non è una preferenza né un warning: è un rifiuto in admission (`ADM-13`).

**Perché così duro.** L'alternativa è ammettere il tool e poi, al primo crash, fermarsi
e chiedere a Christian se l'operazione è avvenuta. Ma Christian **non può saperlo**
meglio del sistema: dovrebbe andare a controllare a mano nel servizio esterno. Ammettere
un tool del genere significa quindi programmare in anticipo un'interruzione che nessuno
saprà risolvere bene, e che alimenta l'approval fatigue (TH-18).

I tool in sola lettura sono esenti: rileggere non ha effetti.

### 4.3 Cosa fare quando un tool utile non supporta la lookup

Ordine di preferenza, tutte opzioni realistiche e nessuna che aggira la regola:

1. **avvolgerlo** con un tool intermedio che tiene il proprio registro chiave → esito,
   scrivendo il record **prima** di inoltrare la chiamata;
2. renderlo **naturalmente idempotente** (es. scrittura per contenuto, non per append);
3. degradarlo a `HUMAN_BRIDGE`, dove la conferma la fornisce la persona;
4. dichiararlo `UNAVAILABLE`.

L'opzione 1 è quasi sempre praticabile ed è quella da tentare per prima.

---

## 5. ToolManifest

Copre tutti i campi obbligatori di §12.1. Contratto completo in
`packages/contracts/src/tools/tool-manifest.ts`.

| Gruppo | Campi | Nota di progetto |
|---|---|---|
| Identità | `toolId`, `name`, `version`, `manifestHash` | l'hash è pinnato e **riverificato a ogni chiamata** |
| Schemi | `inputSchema`, `outputSchema` | validazione a monte e a valle |
| Classificazione | `classification`, `sideEffect`, `maxDataClass` | verificata per coerenza interna (`ADM-03`) |
| Accesso | `scopes`, `resources`, `secretsNeeded` | solo `SecretRef`, mai valori |
| Rete | `network.allowedDestinations`, `egressDenyByDefault` | **il wildcard è rifiutato** |
| Isolamento | `sandbox` | profilo esplicito, path allowlist obbligatoria se c'è FS |
| Idempotenza | `idempotency` | vedi P0-2 |
| Rientro | `compensation`, `dryRunSupported` | obbligatori se `DESTRUCTIVE` |
| Limiti | `quota`, `reliability` | timeout, retry, circuit breaker |
| Provenienza | `license`, `sourceRepository`, `securityReviewDate`, `documentationUrl` | Articolo 11 |
| Governo | `approvalGate`, `auditEvents`, `deprecation` | `auditEvents` non può contenere `tool.*` |
| Vincoli costituzionali | `incrementalCost`, `requiresLocalHeavyCompute`, `usesConsumerUiSession` | Articoli 5 e §4.2, §3 |

### 5.1 Perché il wildcard di rete è rifiutato

`allowedDestinations: ["*"]` trasforma un controllo di egress in una formalità. È il
modo più comune in cui una allowlist di rete smette di essere una difesa pur restando
presente nella configurazione — e quindi pur risultando "implementata" in una checklist.

---

## 6. Pipeline di admission

18 regole. Le prime 12 seguono i passi di §12.3; le altre 6 derivano dal threat model.

| ID | Regola | Origine | Blocca? |
|---|---|---|---|
| `ADM-01` | alternative già presenti considerate e registrate | §12.3.1 | sì |
| `ADM-02` | documentazione ufficiale letta, con URL e data | §12.3.2 | sì |
| `ADM-03` | classificazione coerente con il side effect | §12.3.3 | sì |
| `ADM-04` | licenza verificata e advisories controllate | §12.3.4 | sì |
| `ADM-05` | rete mappata, nessun wildcard | §12.3.5 | sì |
| `ADM-06` | threat model esistente per i tool che scrivono | §12.3.6 | sì |
| `ADM-07` | testato con credenziali finte e dati C0 | §12.3.7 | sì |
| `ADM-08` | scope limitato; FS senza path allowlist rifiutato | §12.3.8 | sì |
| `ADM-09` | timeout, errori, idempotenza e rollback provati | §12.3.9 | sì |
| `ADM-10` | approvato dal proprietario | §12.3.10 | sì |
| `ADM-11` | versione e hash pinnati | §12.3.11 | sì |
| `ADM-12` | owner e data di review registrati | §12.3.12 | sì |
| `ADM-13` | **P0-2** — lookup per idempotency key sulle scritture | UJ-SEC-001 | sì |
| `ADM-14` | **P0-1** — nessun tool dichiara di emettere `tool.*` | UJ-SEC-001 | sì |
| `ADM-15` | costo incrementale `ZERO` o `DISABLED` | Articolo 5 | sì |
| `ADM-16` | né compute locale pesante né sessioni UI consumer | §4.2, §3 | sì |
| `ADM-17` | tool distruttivo: dry-run + compensazione + gate `APPROVAL` | Articolo 4 | sì |
| `ADM-18` | tool remoto senza isolamento | TH-02 residuo | **warning** |

### 6.1 Due scelte di progetto

**Tutte le violazioni vengono riportate, non solo la prima.** Una motivazione di rifiuto
che nomina una causa nasconde le altre e rende la review ingannevole: chi corregge quella
causa ripresenta il tool e viene rifiutato di nuovo, senza capire quante ne restino.

**`ADM-18` avverte invece di bloccare, e il motivo è dichiarato.** Un tool remoto può
cambiare comportamento **a parità di manifest**: l'hash attesta la descrizione, non la
condotta. Bloccare tutti i tool remoti renderebbe MCP inutilizzabile; ammetterli in
silenzio nasconderebbe il residuo. Il warning è la risposta onesta: passa, ma resta
scritto che questa specifica difesa non copre questo specifico caso.

---

## 7. Architettura P0 dei tool

L'ordine di §12.2 non è burocrazia: **costruire i tool nell'ordine sbagliato crea potere
prima del controllo.** Un tool GitHub in scrittura prima dell'audit writer significa
azioni esterne senza registro.

### P0 — Fondazione (nell'ordine)

| # | Tool | Side effect | Perché è P0 |
|---|---|---|---|
| 1 | artifact store read/write con versioni | `INTERNAL_WRITE` | senza artifact non esiste comunicazione tipizzata |
| 2 | task ledger e run ledger | `INTERNAL_WRITE` | senza ledger non esiste prova |
| 3 | database/memory tool in sandbox | `INTERNAL_WRITE` | primo vertical slice |
| 4 | **audit event writer** | `INTERNAL_WRITE` | **è il componente `TOOL_RUNTIME` di P0-1** |
| 5 | approval queue | `INTERNAL_WRITE` | senza coda, nessun gate umano |
| 6 | capability registry reader | `NONE` | il routing legge da qui |
| 7 | GitHub read-only | `NONE` | prima leggere, poi scrivere |

**Il numero 4 non è un tool come gli altri.** L'audit event writer *è* l'entità
`TOOL_RUNTIME`: è il solo componente autorizzato ad attestare l'esecuzione dei tool.
Va costruito prima di qualunque tool che produca side effect esterni, altrimenti P0-1
è una regola senza esecutore.

**Regola d'ordine non derogabile** (§12.2): database/memoria, audit e approvazioni
precedono ogni tool esterno potente. Un ADR può cambiare l'ordine interno, non questa
precedenza.

### P1–P3

Restano come da §12.2 e non li ridefinisco qui. Un'unica annotazione su P2 n. 16
(browser QA con Playwright), perché è il punto dove il confine è più facile da
attraversare per errore:

> Playwright è ammesso **su siti di test controllati**. Non è ammesso per automatizzare
> account consumer, in nessuna forma e per nessuna motivazione di comodità. La distinzione
> non è tecnica — è lo stesso strumento — ma è netta, ed è `ADM-16` a farla rispettare.

---

## 8. Rapporto con gli altri task

| Task | Relazione |
|---|---|
| UJ-RUN-001 | il tool plane consuma `ToolGrant`, `IdempotencyKey`, `RunEvent` |
| UJ-SEC-001 | P0-1 e P0-2 vengono da lì; `ADM-15/16/17` applicano la Costituzione |
| UJ-SKL-001 | Skill Forge produrrà tool: passeranno da **questa stessa** admission |
| UJ-RCV-001 | il resume dipende da `ADM-13`: senza lookup non esiste resume sicuro |
| UJ-CAP-001 (Gemini) | `Capability Record` e `ToolManifest` sono entità diverse e complementari |

### 8.1 Nota per GEMINI, reviewer

`ToolManifest` e `CapabilityRecord` **non vanno fusi**, benché si somiglino:

| | `CapabilityRecord` | `ToolManifest` |
|---|---|---|
| Domanda | *l'account può usare questo prodotto?* | *il sistema può chiamare questa funzione?* |
| Vive in | Capability Registry (tuo, UJ-CAP-001) | Tool Registry (mio) |
| Cambia quando | cambia il piano o la policy del provider | cambia il codice del tool |

Un `ToolManifest` **cita** un `capability_id`; non lo duplica. Se li fondiamo, ogni
cambio di piano invalida i tool e ogni aggiornamento di tool richiede una riverifica
di piano: due cicli di vita diversi legati a forza.

---

## 9. Limiti dichiarati

1. **P0-1 copre l'attestazione, non la veridicità del resoconto** (§3.3). TH-10 resta
   parzialmente aperta.
2. **`ADM-18` è un warning**, quindi il residuo TH-02 sui server remoti rimane. Servono
   sandbox e monitoraggio comportamentale, non progettati (è `UJ-SKL-001`).
3. **L'admission è un evento singolo.** Un tool ammesso resta ammesso finché hash e
   versione non cambiano. Un servizio remoto che cambia condotta senza cambiare manifest
   non viene intercettato.
4. **Nessun tool è ancora implementato.** Questo documento e i contratti definiscono
   *come* si ammette un tool; il tool plane vero è M8.
5. **La quota per tool non è ancora integrata col Quota Governor** — i campi esistono,
   il collegamento no.

## 10. Autovalutazione (§43)

| Area | Max | Assegnato | Motivazione |
|---|---:|---:|---|
| vincoli e zero-cost truthfulness | 15 | 15 | `ADM-15`/`ADM-16` applicano i vincoli in modo meccanico e testato |
| fattibilità e sostituibilità | 15 | 13 | nessun nome di provider; MCP trattato come un caso, non come il caso |
| sicurezza e approval model | 15 | 14 | due P0 chiuse meccanicamente; residui dichiarati |
| artifact concreti e testabilità | 15 | 14 | 30 test verdi; nessun tool implementato |
| fonti e disciplina epistemica | 10 | 9 | tutto ancorato a §12 e a UJ-SEC-001 |
| roadmap ed estendibilità | 10 | 8 | ordine P0 motivato; P1–P3 non ridefiniti |
| status e remaining work | 10 | 9 | delta e limiti espliciti |
| collaborazione e handoff | 5 | 5 | distinzione `ToolManifest`/`CapabilityRecord` per Gemini |
| chiarezza | 5 | 4 | denso |
| **Totale** | **100** | **91** | pronto per review |

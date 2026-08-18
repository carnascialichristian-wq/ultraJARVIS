# CONSEGNA UJ-RUN-001 — blocchi da inoltrare a CHATGPT via HUMAN_BRIDGE

> **Christian:** ogni blocco delimitato qui sotto va copiato **per intero**, dai marcatori
> `===` inclusi. Non accorciare e non riformattare. Il blueprint e' grande: se il canale
> tronca, e' meglio inviare **questo file** che un blocco tagliato a meta' — un blocco
> troncato e' esattamente il motivo per cui la prima consegna di Gemini e' stata respinta.

| | |
|---|---|
| Task | `UJ-RUN-001` — owner CLAUDE, reviewer GEMINI, peso 13 |
| Card | `UJ-CARD-RUN-001-CLAUDE` |
| Mission | `UJ-MISSION-M0-COUNCIL-001` |
| Stato proposto | **REVIEW** |
| Peso accettato | **0 / 13, invariato** |
| `source_commit_sha` | `8ed53286ea805118d26c9a27caf4281904cf7fbe` |
| Ref da fetchare | `origin/claude/claude-md-resume-point-tvej1u` |
| Blocchi FILE | **1** — `docs/architecture/RUNTIME_BLUEPRINT.md`, **84318 byte**, sha256 `a0be04069692d89399eefe183d489d8ad8bea472c232444676883331c23c2538` |
| Newline finale del file | presente (LF) |
| Generato | 2026-08-18T13:50:28Z |

## Cosa e' cambiato rispetto alla consegna precedente

Ho **misurato** la copertura del blueprint contro i 24 punti richiesti invece di assumerla.
Cinque punti avevano **zero occorrenze** nel documento — decomposizione dei task, selezione e
assegnazione degli agenti, demo end-to-end, fallback locale a costo zero — e due erano deboli:
conflitti fra agenti (1 occorrenza), HUMAN_BRIDGE (2).

Ho aggiunto le sezioni **16-22** invece di riscrivere le 0-15. Quelle sono citate per numero
dal ResponsePacket, dalla review checklist §13, dagli header dei contratti in
`packages/contracts/src/runtime/` e dalle threat notes: rinumerarle romperebbe quei riferimenti
in silenzio. **Un solo hash su quindici e' cambiato**, quello del blueprint: e' la prova che
l'estensione non ha toccato gli altri quattordici artefatti.

**Bilancio dichiarato, §22:** 24 requisiti su 24 hanno ora una sezione. **NON** 24 su 24 hanno
una prova eseguita. Le sezioni nuove specificano **24 prove da implementare**, ognuna marcata
`PROVA DA IMPLEMENTARE`, e il resto poggia sui 140 test che passano oggi.

## Gli altri quattordici artefatti, consegnati per riferimento

`return_channel` della card dice di usare un branch **se la scrittura e' disponibile**: lo e'.
Sono committati al `source_commit_sha` dichiarato, ognuno col proprio hash nel packet. Non sono
omessi — sono verificabili con un `git fetch`.

| Artefatto | SHA-256 dei byte finali |
|---|---|
| `packages/contracts/src/runtime/agent-manifest.ts` | `0401bf8c364cad5e6f8d430c84a4dc1b66e3b5420e7e2834e88e2a891ebb5b26` |
| `packages/contracts/src/runtime/checkpoint.ts` | `21df12f40d2ffe93e672ed95a13d3ca1125fcd0dad05abfd967b41b2d9612fce` |
| `packages/contracts/src/runtime/common.ts` | `86baa7e4050a252f5d4650be35753585ae4f1bd3733691a8b4ba31ef70919c51` |
| `packages/contracts/src/runtime/depth-guard.ts` | `515b8a9f36fa3fae9594552d30a58bc33bf52d155d6b29fe45e7f01bdcca19b7` |
| `packages/contracts/src/runtime/envelopes.ts` | `1e3f94558b69abd2852f2c8d5af3691db4d31a9ca947ae7d093581ec4a483b79` |
| `packages/contracts/src/runtime/index.ts` | `08e06bde8eb51ab1ac9636a1bebfae12c6bd373643ba1c77180b1da64b85de1a` |
| `packages/contracts/src/runtime/run-ledger.ts` | `e40c5004152b7bdcb150b26effff634f73a9356f45fe25605b8b2d58959314a7` |
| `packages/contracts/src/runtime/supervisor.ts` | `d9d4078c69fd1dfede055571c546d0b3ca092bd14a1807eab6eb16d99dd72779` |
| `packages/contracts/src/runtime/team-spec.ts` | `d5a6e5adb50d0cdff3d920ce7dd20dacbef8d8012659f129723d64411653f9ff` |
| `packages/contracts/package.json` | `3c085ad42466251192a5ecfa7ee71750bd6825d4f5cb6fa56df0c257c4f3980a` |
| `packages/contracts/tsconfig.json` | `d438c3e078c5acc567c703f7d1c119d17d9b135810acd22cd0b5c8013415a5fe` |
| `tests/contracts/runtime-invariants.test.mjs` | `0f9afe37ab686a02d80d0092bf081fcb4daec1195c32d59e55679c91a9cbabf0` |
| `docs/threat-models/RUNTIME_THREAT_NOTES.md` | `b84a9a721c5544df9ad1b84e48760a2382783eed3556a7b0c60ba2a6d34bdb60` |
| `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` | `5b943a125bddfb70659daadceda7609527fed464d1ff9f1fb26c88887e7c5e45` |

## Rilievi sul gate, gia' segnalati e non risolti

1. La card `UJ-RUN-001-CLAUDE.json` **non esiste** al commit `3611b1b4` al quale il gate ordina
   di leggerla: entra con `d48e1e85`, dodici minuti dopo. I quattro hash **pinati** coincidono
   tutti a `3611b1b4`, quindi non ho restituito `BLOCKED`.
2. Il gate dice `path`, lo schema dice `ref`. Con `additionalProperties: false` un artifact con
   `path` fallisce la validazione. Ho seguito lo schema.
3. Il gate chiede la mappatura per criterio **dentro** il packet; lo schema non ha alcun campo
   per criterio. E' in `docs/program/packets/UJ-RUN-001-AC-EVIDENCE.md`.
4. `UJ-RUN-001` dichiara **cinque** criteri nella card e **due** nel `BACKLOG.json`. Una review
   scritta sui cinque criteri assegnati verra' respinta come *"unknown criterion"*. Misurato
   eseguendo il validatore. Vale per tutte e quattro le card.

---
=== FILE: docs/architecture/RUNTIME_BLUEPRINT.md ===
# RUNTIME BLUEPRINT — ultraJARVIS Agent Runtime v0.1

| Metadato | Valore |
|---|---|
| Task ID | UJ-RUN-001 |
| Milestone | M0 / M2 |
| Owner | CLAUDE (Runtime, Security & Skill Architect) |
| Reviewer | GEMINI |
| Stato | REVIEW |
| Peso | 13 |
| Data class | C1 INTERNAL |
| Side effect | INTERNAL_WRITE (solo file su branch dedicato) |
| Autonomia usata | L2 |
| Prompt canonico | `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` v1.0 |
| Prompt SHA-256 | `a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87` (verificato in sessione) |
| Contratti collegati | `packages/contracts/src/runtime/*.ts` |
| Threat notes | `docs/threat-models/RUNTIME_THREAT_NOTES.md` |

> **Nota di provenienza.** Il prompt canonico vive attualmente sul branch
> `agent/ultrajarvis-master-prompt-v1` (PR #1, draft) e non è ancora su `main`.
> Questo blueprint è stato scritto contro il commit `b8a7697` di quel branch, il cui
> contenuto è stato verificato con SHA-256 corrispondente a quello dichiarato nella PR.
> Se la PR #1 viene modificata prima del merge, questo documento va riconciliato.
> Etichetta: `OBSERVATION`.

---

## 0. Scope

### 0.1 In scope

Questo documento definisce il **livello di runtime** di ultraJARVIS: come nasce, vive,
si sospende, riprende e muore un'unità di lavoro agentica, e quali invarianti non
possono essere violate da nessun agente, nemmeno da uno generato dinamicamente.

Copre i deliverable 1–10 e 13 di §39.2 del prompt canonico:

| # | Deliverable §39.2 | Sezione |
|---|---|---|
| 1 | Runtime Blueprint | tutto il documento |
| 2 | AgentManifest completo | §3 |
| 3 | TeamSpec completo | §4 |
| 4 | Supervisor state machine | §5 |
| 5 | DepthGuard invariants | §6 |
| 6 | RunLedger / event taxonomy | §7 |
| 7 | checkpoint / resume / cancel / retry semantics | §8 |
| 8 | tool allowlist inheritance rules | §9 |
| 9 | typed artifact communication | §10 |
| 10 | failure and loop scenarios | §11 |
| 13 | review checklist per l'integratore | §13 |

I deliverable 11 (contratti TypeScript), 12 (threat notes) e 14 (task delta e resume
point) sono file separati, elencati in §14.

### 0.2 Out of scope — esplicitamente non deciso qui

Per non invadere portafogli altrui e non anticipare milestone non baselined:

| Fuori scope | Owner corretto | Task |
|---|---|---|
| Scelta del framework kernel (custom state machine vs LangGraphJS vs altro) | esperimento M2 | UJ-INT-002 / ADR |
| Scelta del database e della persistenza fisica | GEMINI | UJ-MEM-001 / UJ-INF-001 |
| Capability reali delle quattro IA | GEMINI | UJ-CAP-001 |
| Program OS, backlog e formula di status | CHATGPT | UJ-INT-001 |
| Threat model completo e approval policy | CLAUDE, task successivo | UJ-SEC-001 |
| ToolManifest e MCP admission in dettaglio | CLAUDE, task successivo | UJ-MCP-001 |
| Disaster recovery operativo | CLAUDE, task successivo | UJ-RCV-001 |

Questo blueprint definisce **contratti e invarianti**, non prodotti. Ogni entità è
progettata per sopravvivere alla sostituzione del framework, del database e del provider.

### 0.3 Principio guida

> Il runtime non deve rendere gli agenti intelligenti. Deve rendere **impossibile** che
> un agente, per errore o per manipolazione, superi i limiti che il proprietario ha fissato.

L'intelligenza sta nei modelli, che sono sostituibili. Le garanzie stanno nel runtime,
che è deterministico, ispezionabile e testabile senza chiamare un modello.

**Corollario di verificabilità.** Ogni invariante in questo documento deve poter essere
violata *deliberatamente* in un test e il runtime deve rifiutare. Un'invariante che non
si può falsificare non è un'invariante: è un auspicio.

---

## 1. Posizione nell'architettura

```
┌─────────────────────────────────────────────────────────────────┐
│ apps/dashboard          cockpit umano, kill switch, approvazioni │
├─────────────────────────────────────────────────────────────────┤
│ apps/control-plane      API deterministica, orchestrazione run   │
├─────────────────────────────────────────────────────────────────┤
│ packages/agent-runtime  ◀── QUESTO DOCUMENTO                     │
│   Supervisor · DepthGuard · RunLedger · Checkpoint · Scheduler   │
├──────────────┬───────────────┬──────────────┬───────────────────┤
│ policy-engine│ tool-runtime  │ task-ledger  │ memory            │
├──────────────┴───────────────┴──────────────┴───────────────────┤
│ provider-gateway        adapter provider-neutral, HUMAN_BRIDGE   │
├─────────────────────────────────────────────────────────────────┤
│ packages/contracts      schemi e tipi condivisi, versionati      │
└─────────────────────────────────────────────────────────────────┘
```

### 1.1 Regole di dipendenza vincolanti

1. `agent-runtime` dipende da `contracts`, `policy-engine`, `task-ledger`,
   `tool-runtime` e `provider-gateway` **solo tramite interfacce**.
2. `agent-runtime` **non** conosce nomi di provider. Non esiste in questo package la
   stringa `"claude"`, `"gemini"`, `"gpt"` o `"grok"` fuori dai test fixture.
3. `agent-runtime` **non** legge secret. Riceve `SecretRef` opachi e li passa al
   tool-runtime, che li risolve fuori dal contesto del modello.
4. Nessun modulo sotto `agent-runtime` esegue I/O di rete diretto. Ogni uscita passa
   dal `provider-gateway` o dal `tool-runtime`, entrambi soggetti a preflight di policy.
5. Il runtime è **deterministico**: dato lo stesso RunLedger, ricostruisce lo stesso stato.
   Tutta la non-determinatezza (output dei modelli, timestamp, id) entra come evento
   registrato, mai come effetto collaterale nascosto.

La regola 5 è ciò che rende possibili resume, audit e test riproducibili. È
l'invariante architetturale più costosa da recuperare se la si perde: va rispettata
dal primo commit.

---

## 2. Modello a oggetti e ciclo di vita

### 2.1 Gerarchia

```
Mission            obiettivo dichiarato dal proprietario o dal control-plane
 └─ Run            esecuzione isolata, unità di checkpoint e audit
     └─ Team       insieme temporaneo con un solo Supervisor
         └─ Agent  identità temporanea, depth 0..3
             └─ Attempt   singolo tentativo di produrre un ResultEnvelope
                 └─ Step  chiamata a modello o a tool, atomica e registrata
```

**Invariante di contenimento:** ogni entità figlia eredita i limiti della madre in
forma **monotonicamente più stretta**. Nessuna entità può allargare i propri limiti
verso l'alto. Questa è la proprietà fondamentale su cui poggiano §6 e §9.

Formalmente, per ogni coppia (parent `p`, child `c`) e per ogni dimensione limitata
`L` ∈ {tool allowlist, data class, autonomy, side-effect ceiling, quota, deadline}:

```
limit(c, L) ⊑ limit(p, L)
```

dove `⊑` è "non più permissivo di". Il runtime valuta questa condizione in fase di
**admission**, prima che l'agente figlio esista. Un fallimento è un rifiuto, non un warning.

### 2.2 Stati di un Agent

| Stato | Significato | Uscite ammesse |
|---|---|---|
| `PROPOSED` | manifest costruito, non ancora validato | `ADMITTED`, `REJECTED` |
| `REJECTED` | admission fallita | terminale |
| `ADMITTED` | limiti validati, capability token emesso | `RUNNING`, `CANCELLED` |
| `RUNNING` | sta producendo | `WAITING_*`, `PRODUCED`, `FAILED`, `CANCELLED`, `TIMED_OUT` |
| `WAITING_APPROVAL` | side effect in attesa di gate | `RUNNING`, `CANCELLED`, `TIMED_OUT` |
| `WAITING_BRIDGE` | DelegationCard in attesa dell'umano | `RUNNING`, `CANCELLED`, `TIMED_OUT` |
| `WAITING_CHILD` | attende figli | `RUNNING`, `FAILED`, `CANCELLED` |
| `PRODUCED` | ResultEnvelope valido emesso | `ACCEPTED`, `REWORK` |
| `REWORK` | reviewer ha respinto | `RUNNING` (se budget residuo), `FAILED` |
| `ACCEPTED` | reviewer ha accettato | terminale |
| `FAILED` | esaurito o errore non recuperabile | terminale |
| `CANCELLED` | cancellazione cooperativa completata | terminale |
| `TIMED_OUT` | deadline superata | terminale |
| `KILLED` | kill switch del proprietario | terminale |

`KILLED` è raggiungibile da **qualunque** stato non terminale, senza guardia. È l'unica
transizione che ignora il consenso dell'agente. Questo è deliberato: il kill switch che
può essere negoziato non è un kill switch.

### 2.3 Le due domande obbligatorie del planner

Prima di creare qualunque agente figlio, il planner deve rispondere e **registrare**:

1. **È necessario chiamare un modello?** Se il compito è deterministico (parsing,
   validazione, diff, hash, formattazione), va eseguito come tool o funzione pura.
2. **È necessario scomporre?** Se il costo di coordinamento (contratti, merge, review,
   quota, latenza) supera il beneficio, si usa un singolo agente.

Entrambe le risposte finiscono nel RunLedger come evento `planned` con campo
`decompositionRationale`. Una scomposizione senza motivazione registrata è un difetto
rilevabile in review, non una preferenza stilistica.

> **Perché è un'invariante e non un consiglio.** Il fallimento più comune dei sistemi
> multi-agente non è l'agente sbagliato: è la scomposizione non necessaria, che moltiplica
> quota, latenza e superficie di errore senza aggiungere qualità. Rendere obbligatoria la
> motivazione rende il costo visibile prima che venga pagato.

---

## 3. AgentManifest — completo

L'AgentManifest è il **contratto di esistenza** di un agente. Un agente senza manifest
validato non può essere istanziato. Il manifest è immutabile dopo l'admission: ogni
modifica genera un nuovo `agentId` e una nuova admission.

### 3.1 Campi

| Campo | Tipo | Obbligatorio | Regola |
|---|---|---|---|
| `agentId` | `AgentId` | sì | stabile, unico nel run |
| `manifestVersion` | `SemVer` | sì | versione dello schema del manifest |
| `templateId` | `string` | sì | template approvato da cui deriva |
| `templateVersion` | `SemVer` | sì | versione del template |
| `role` | `AgentRole` | sì | dal catalogo ruoli approvato |
| `roleStatus` | `APPROVED \| CANDIDATE` | sì | `CANDIDATE` non può avere side effect |
| `mission` | `string` | sì | obiettivo singolo, verificabile |
| `taskIds` | `TaskId[]` | sì | ≥1, dal task ledger |
| `inputArtifactRefs` | `ArtifactRef[]` | sì | può essere vuoto solo per agenti seed |
| `outputSchemaRef` | `SchemaRef` | sì | schema atteso del ResultEnvelope |
| `acceptanceCriteria` | `Criterion[]` | sì | binari e verificabili |
| `toolAllowlist` | `ToolGrant[]` | sì | **default `[]`** |
| `maxDataClass` | `C0..C4` | sì | ≤ del parent |
| `maxAutonomy` | `L0..L4` | sì | ≤ del parent; `L5` vietato |
| `maxSideEffect` | `SideEffectLevel` | sì | ≤ del parent |
| `quotaBudget` | `QuotaBudget` | sì | chiamate, token stimati, tool call, wall-clock |
| `deadline` | `ISO-8601` | sì | assoluto, non relativo |
| `stepTimeoutMs` | `number` | sì | timeout del singolo step |
| `depth` | `0..3` | sì | vedi §6 |
| `parentAgentId` | `AgentId \| null` | sì | `null` solo per root |
| `runId` | `RunId` | sì | |
| `teamId` | `TeamId \| null` | sì | |
| `terminationCriterion` | `TerminationCriterion` | sì | condizione esplicita di uscita |
| `reviewerId` | `ReviewerRef` | sì | ≠ `agentId` per task critici |
| `escalationRoute` | `EscalationRoute` | sì | dove va un blocker |
| `capabilityTokenRef` | `TokenRef` | sì | emesso all'admission, a scadenza |
| `provenance` | `Provenance` | sì | chi ha creato il manifest e da cosa |
| `createdAt` | `ISO-8601` | sì | UTC |

### 3.2 Cosa un manifest NON contiene

- **nessun secret**, in nessuna forma, nemmeno cifrato: solo `SecretRef` risolti dal
  tool-runtime al momento della chiamata;
- **nessun nome di provider**: la selezione avviene per capability nel gateway;
- **nessun prompt di sistema privilegiato** generato da testo libero non revisionato;
- **nessuna quota auto-estendibile**.

### 3.3 Creazione dinamica: cosa significa davvero

Il prompt canonico è esplicito e questo blueprint lo rende meccanico:

> "Creazione dinamica" significa istanziare un AgentManifest **da template e capability
> approvati**, variando missione, input e limiti.

Quindi:

| Consentito | Vietato |
|---|---|
| istanziare `template=code-reviewer@1.2` con missione e input nuovi | inventare un ruolo da testo libero e dargli tool |
| restringere l'allowlist rispetto al template | allargarla oltre il template |
| ridurre `maxDataClass` | alzarlo |
| proporre un nuovo ruolo come `CANDIDATE` | promuoverlo da solo ad `APPROVED` |

Un ruolo `CANDIDATE` nasce con `maxSideEffect = NONE`, `maxAutonomy ≤ L1` e
`toolAllowlist = []`. Diventa `APPROVED` solo tramite review umana registrata.
Questo chiude il vettore "l'agente si scrive da solo un ruolo con più poteri".

### 3.4 TerminationCriterion

Un agente deve dichiarare **come finisce**, non solo cosa fa. Tipi ammessi:

| Tipo | Semantica |
|---|---|
| `ARTIFACT_PRODUCED` | termina quando emette un ResultEnvelope valido secondo lo schema |
| `CRITERIA_SATISFIED` | termina quando tutti gli `acceptanceCriteria` sono verificati |
| `BUDGET_EXHAUSTED` | termina all'esaurimento di quota o deadline, con risultato parziale |
| `DELEGATED` | termina passando il lavoro a un altro agente, con handoff registrato |
| `BLOCKED` | termina registrando un blocker e l'input mancante |

Non esiste un criterio `CONTINUE_UNTIL_DONE`. Un agente che non sa dichiarare come
finisce non supera l'admission.

---

## 4. TeamSpec — completo

Un Team è un aggregato **temporaneo**. La sua esistenza è giustificata solo da un
obiettivo che un singolo agente non può raggiungere entro i propri limiti.

### 4.1 Campi

| Campo | Tipo | Regola |
|---|---|---|
| `teamId` | `TeamId` | unico nel run |
| `specVersion` | `SemVer` | schema del TeamSpec |
| `objective` | `string` | un solo obiettivo |
| `successCriteria` | `Criterion[]` | binari, verificabili, dichiarati prima |
| `supervisorAgentId` | `AgentId` | **esattamente uno** |
| `members` | `TeamMember[]` | responsabilità disgiunte |
| `dependencyGraph` | `Edge[]` | DAG, ciclo = rifiuto in admission |
| `sharedArtifacts` | `SharedArtifactGrant[]` | accesso esplicito per membro |
| `mergeProtocol` | `MergeProtocol` | come si compongono gli output |
| `dissentPolicy` | `DissentPolicy` | cosa succede se due membri divergono |
| `tieBreak` | `TieBreakRule` | chi decide, e come si registra il dissenso |
| `limits` | `TeamLimits` | depth, fan-out, task attivi, quota, wall-clock |
| `exitCriteria` | `ExitCriterion[]` | quando il team si scioglie |
| `dissolutionPolicy` | `DissolutionPolicy` | cosa succede agli artifact e ai token |

### 4.2 Responsabilità disgiunte

Regola verificabile in admission: per ogni coppia di membri `(a, b)`,
`responsibilities(a) ∩ responsibilities(b) = ∅`.

Le responsabilità sono etichette da un vocabolario chiuso (es. `design`, `implement`,
`review`, `test`, `document`). Due membri con la stessa etichetta sullo stesso
`taskId` sono un errore di specifica, non una ridondanza utile: creano lavoro duplicato,
merge conflict semantici e doppio consumo di quota.

L'eccezione deliberata è la **review incrociata**, che non è sovrapposizione: il reviewer
ha etichetta `review` e non può avere `implement` sullo stesso task.

### 4.3 MergeProtocol

| Protocollo | Uso | Regola |
|---|---|---|
| `SEQUENTIAL_HANDOFF` | pipeline lineare | l'output di N è input di N+1, hash verificato |
| `PARALLEL_DISJOINT` | file/sezioni disgiunte | nessun overlap, merge meccanico |
| `PROPOSE_AND_REVIEW` | artefatti critici | produttore ≠ reviewer, entrambi registrati |
| `COMPETING_DRAFTS` | esplorazione | scelta motivata + scarti conservati |

In tutti i casi il Supervisor **non riscrive silenziosamente** l'output di un membro.
Se interviene, registra un evento `merged` con `mergeRationale`, l'hash dell'input e
l'hash dell'output. La modifica non tracciata di un artefatto specialistico è una
violazione della disciplina della verità (§5 del prompt canonico): fa sparire chi ha
detto cosa.

### 4.4 Dissenso

Il dissenso è **informazione**, non rumore da eliminare. Politica:

1. il dissenso viene registrato come `DissentRecord` con posizione, motivazione e prova;
2. il tie-break decide la strada operativa;
3. il `DissentRecord` **sopravvive** alla decisione e viaggia con l'artifact;
4. se il dissenso riguarda sicurezza, costo o irreversibilità, il tie-break automatico è
   **vietato**: si escala al proprietario.

Il punto 4 è il freno che impedisce a un supervisor di risolvere da solo esattamente le
questioni per cui esiste l'approvazione umana.

---

## 5. Supervisor — macchina a stati

Il Supervisor è **codice deterministico**, non un agente-modello con poteri speciali.
Può *consultare* un modello per pianificare, ma le transizioni di stato, l'admission,
la contabilità di quota e le decisioni di sicurezza non passano da un modello.

> **Decisione di design (ADR candidato RUN-001).** Un supervisor implementato come
> prompt è vulnerabile a prompt injection proveniente dagli artifact che deve
> supervisionare. Poiché il supervisor è precisamente l'entità che applica i limiti,
> renderlo influenzabile dal contenuto che ispeziona annulla i limiti. Quindi:
> **il supervisor è una state machine; il modello è un consulente il cui output è
> un suggerimento tipizzato, non un comando.**

### 5.1 Stati

| Stato | Descrizione |
|---|---|
| `INIT` | TeamSpec ricevuto |
| `VALIDATING` | validazione TeamSpec + DepthGuard + policy preflight |
| `REJECTED` | specifica invalida — terminale |
| `PLANNING` | risposta alle due domande §2.3, costruzione TaskEnvelope |
| `DISPATCHING` | emissione envelope ai membri ammessi |
| `MONITORING` | osservazione heartbeat e stato, nessuna microgestione |
| `COLLECTING` | raccolta ResultEnvelope, validazione schema |
| `MERGING` | applicazione del MergeProtocol |
| `AWAITING_APPROVAL` | gate di approvazione per side effect |
| `AWAITING_BRIDGE` | DelegationCard emessa, attesa umano |
| `COMPENSATING` | rollback/compensazione di side effect confermati |
| `DISSOLVING` | exit criterion raggiunto, revoca token, rilascio membri |
| `CLOSED` | successo — terminale |
| `FAILED` | fallimento — terminale |
| `CANCELLED` | cancellazione — terminale |
| `HALTED` | kill switch — terminale |

### 5.2 Transizioni

```mermaid
stateDiagram-v2
    [*] --> INIT
    INIT --> VALIDATING
    VALIDATING --> REJECTED: spec o limiti invalidi
    VALIDATING --> PLANNING: admission ok
    PLANNING --> DISPATCHING: envelope pronti
    PLANNING --> DISSOLVING: nessuna scomposizione necessaria
    DISPATCHING --> MONITORING
    MONITORING --> COLLECTING: risultato ricevuto
    MONITORING --> AWAITING_APPROVAL: side effect richiede gate
    MONITORING --> AWAITING_BRIDGE: percorso solo manuale
    MONITORING --> COMPENSATING: fallimento con effetti confermati
    AWAITING_APPROVAL --> MONITORING: approvato
    AWAITING_APPROVAL --> COMPENSATING: negato con effetti parziali
    AWAITING_APPROVAL --> FAILED: negato, nessun effetto
    AWAITING_BRIDGE --> COLLECTING: risultato incollato e validato
    AWAITING_BRIDGE --> FAILED: deadline bridge superata
    COLLECTING --> MERGING: schema valido
    COLLECTING --> DISPATCHING: rework entro budget
    COLLECTING --> COMPENSATING: schema invalido oltre budget
    MERGING --> DISPATCHING: restano task
    MERGING --> DISSOLVING: exit criteria soddisfatti
    COMPENSATING --> FAILED
    DISSOLVING --> CLOSED
    MONITORING --> CANCELLED: cancellazione cooperativa
    INIT --> HALTED: kill switch
    VALIDATING --> HALTED: kill switch
    PLANNING --> HALTED: kill switch
    DISPATCHING --> HALTED: kill switch
    MONITORING --> HALTED: kill switch
    COLLECTING --> HALTED: kill switch
    MERGING --> HALTED: kill switch
    AWAITING_APPROVAL --> HALTED: kill switch
    AWAITING_BRIDGE --> HALTED: kill switch
```

### 5.3 Guardie obbligatorie

Ogni transizione è protetta da guardie valutate **prima** dell'effetto:

| Transizione | Guardia |
|---|---|
| `VALIDATING → PLANNING` | DepthGuard ok, DAG aciclico, responsabilità disgiunte, limiti monotoni |
| `PLANNING → DISPATCHING` | `decompositionRationale` presente, envelope tipizzati, quota preflight ok |
| `DISPATCHING → MONITORING` | ogni membro ha capability token valido e non scaduto |
| `MONITORING → COLLECTING` | ResultEnvelope firmato dal `agentId` atteso |
| `COLLECTING → MERGING` | validazione schema superata, dataClass compatibile |
| `COLLECTING → DISPATCHING` | `reworkCount < maxRework` e budget residuo > 0 |
| `* → AWAITING_APPROVAL` | checkpoint scritto **prima** della richiesta |
| `AWAITING_APPROVAL → MONITORING` | approvazione firmata, non scaduta, per quella esatta operazione |
| `MERGING → DISSOLVING` | tutti gli `exitCriteria` verificati, nessun task attivo |
| `DISSOLVING → CLOSED` | token revocati, artifact sigillati, ledger chiuso |

### 5.4 Cosa il Supervisor non fa

- non legge né interpreta la catena di ragionamento dei membri;
- non modifica un output specialistico senza `merged` + rationale;
- non estende quota, deadline o allowlist;
- non promuove un ruolo `CANDIDATE`;
- non decide da solo su sicurezza, irreversibilità o costo;
- non considera "quasi finito" uno stato.

### 5.5 Heartbeat e liveness

Ogni agente `RUNNING` emette heartbeat con periodo `heartbeatIntervalMs`. Il Supervisor
considera un agente **sospetto** dopo `3` heartbeat mancati e **morto** dopo `5`.

Un agente morto non viene "rilanciato e basta": il Supervisor
1. scrive checkpoint,
2. ispeziona il ledger per capire se ci sono side effect confermati,
3. decide fra retry idempotente, compensazione o escalation.

Il rilancio cieco di un agente che aveva già eseguito una scrittura esterna è il modo
canonico per produrre doppi effetti. Vedi §8.4 e scenario S5 in §11.

---

## 6. DepthGuard — invarianti

DepthGuard è il modulo che rende **strutturalmente impossibile** l'esplosione ricorsiva.
I suoi default non sono configurabili dagli agenti, in nessuna circostanza, nemmeno
tramite manifest, prompt, tool o contenuto di artifact.

### 6.1 Limiti hard

| ID | Limite | Valore | Fonte |
|---|---|---:|---|
| `DG-1` | profondità massima | `3` | prompt canonico §10.3 |
| `DG-2` | fan-out massimo per agente | `5` | prompt canonico §10.3 |
| `DG-3` | task atomici attivi per run | `25` | prompt canonico §10.3 |
| `DG-4` | generazione figli a depth 3 | **vietata** | prompt canonico §10.3 |
| `DG-5` | tool allowlist di default | `[]` | prompt canonico §10.1/§10.3 |
| `DG-6` | deadline e timeout | obbligatori | prompt canonico §10.3 |
| `DG-7` | auto-estensione del budget | **vietata** | prompt canonico §10.3 |

### 6.2 Invarianti formali

Sia `A` l'insieme degli agenti vivi in un run.

| ID | Invariante | Verifica |
|---|---|---|
| `INV-D1` | `∀a ∈ A: depth(a) ≤ 3` | admission |
| `INV-D2` | `∀a ∈ A: depth(a) = 3 ⇒ children(a) = ∅` | admission del figlio |
| `INV-D3` | `∀a ∈ A: \|children(a)\| ≤ 5` | admission del figlio |
| `INV-D4` | `\|{t : t attivo nel run}\| ≤ 25` | admission, contatore atomico |
| `INV-D5` | `∀a: depth(a) = depth(parent(a)) + 1` | admission |
| `INV-D6` | `∀a ≠ root: parent(a) ≠ null ∧ parent(a) ∈ A ∪ terminati` | admission |
| `INV-D7` | il grafo padre-figlio è una **foresta** (nessun ciclo, un solo padre) | admission |
| `INV-D8` | `effectiveLimits(a) ⊑ effectiveLimits(parent(a))` per ogni dimensione | admission |
| `INV-D9` | `∀a: deadline(a) ≤ deadline(parent(a))` | admission |
| `INV-D10` | `∀a: quotaBudget(a) ≤ quotaResiduo(parent(a))` al momento dell'emissione | admission atomica |

### 6.3 Nota di progettazione: quale limite lega davvero

L'albero teorico massimo con `DG-1` e `DG-2` è:

```
depth 0:   1 nodo
depth 1:   5 nodi
depth 2:  25 nodi
depth 3: 125 nodi
totale : 156 nodi
```

Ma `DG-3` impone **25 task atomici attivi**. Quindi il limite realmente vincolante in
esercizio è `DG-3`, non la profondità. Conseguenza pratica per l'implementazione:

> L'ammissione di un nuovo agente deve fallire per **saturazione del contatore attivo**
> molto prima che per profondità. Il contatore va quindi implementato come risorsa
> **atomica** (compare-and-swap o transazione), non come lettura seguita da scrittura,
> altrimenti fan-out concorrenti superano 25 per race condition.

Questa è la parte del DepthGuard che si rompe per prima in un'implementazione ingenua,
ed è quella da coprire con un test di concorrenza esplicito (vedi `T-DG-4b` in §13.3).

### 6.4 Loop detector

Tre segnali indipendenti, tutti **deterministici e locali** — nessuno richiede una
chiamata a modello, quindi il rilevamento non consuma quota e non è aggirabile
convincendo un modello:

| Segnale | Metodo | Soglia default | Azione |
|---|---|---:|---|
| `INTENT_REPEAT` | hash della missione normalizzata nel ramo | 3 occorrenze | `LOOP_SUSPECTED` |
| `OUTPUT_STAGNATION` | hash del contenuto dell'artifact fra tentativi consecutivi | 2 identici | `LOOP_SUSPECTED` |
| `TOOL_CYCLE` | k-gramma (k=3) nella sequenza di tool call | 3 ripetizioni | `LOOP_SUSPECTED` |

Per la similarità non identica si usa **Jaccard su shingle di token** (deterministico,
senza embedding, senza costo): `similarity ≥ 0.95` su due tentativi consecutivi conta
come stagnazione.

Su `LOOP_SUSPECTED`: checkpoint, sospensione del ramo, evento `loop_detected` nel
ledger, escalation al Supervisor. Il Supervisor **non** può risolvere aumentando il
budget: può solo cambiare strategia, delegare diversamente, o bloccare.

#### Limite misurato dei segnali testuali — `EXPERIMENT_RESULT`

Misurato in questa sessione con `jaccardSimilarity` (test
`tests/contracts/runtime-invariants.test.mjs`):

| Missione | Token cambiati | Similarità | Sotto soglia 0.95? |
|---|---:|---:|---|
| 9 token | 1 | `0.7778` | sì — evade |
| 23 token | 1 | `0.9130` | sì — evade |

**Conclusione onesta:** i due segnali testuali (`INTENT_REPEAT`, che usa un hash
esatto, e `OUTPUT_STAGNATION`, che usa la soglia di similarità) sono **aggirabili con
una singola parola cambiata**. Non contengono un agente avversario, e nemmeno un
agente semplicemente prolisso che riformula.

Il segnale che regge è `TOOL_CYCLE`, perché dipende da **cosa l'agente ha fatto**, non
da come ha chiamato il lavoro: riformulare la missione non cambia la sequenza di tool.
E il contenimento reale non viene comunque dal loop detector, ma dai limiti strutturali
di §6.1 — il cap dei task attivi e il budget di quota — che bounded il danno di un loop
non rilevato.

Quindi il loop detector va considerato un **early-warning euristico**, non un controllo
di sicurezza. Rimuoverlo peggiorerebbe l'osservabilità; fidarsene come barriera sarebbe
un errore. Questo punto è deliberatamente lasciato aperto per l'attacco di GROK in
UJ-RED-001, con i numeri già sul tavolo invece che con una rassicurazione.

### 6.5 Kill switch

| Proprietà | Regola |
|---|---|
| Autorità | solo il proprietario, dalla dashboard |
| Latenza | effetto immediato su nuovi step; grazia configurabile per step in volo |
| Ambito | run singolo, team, o globale |
| Effetto | nessun nuovo step, nessun nuovo side effect, checkpoint forzato |
| Reversibilità | non riavvia da solo: la ripresa è un'azione umana esplicita |
| Bypass | **nessuno**. Nessun manifest, policy o tool può disabilitarlo |

Il kill switch scrive nel ledger prima di fermare, non dopo: se il processo muore
durante l'arresto, la ripresa sa che era stato richiesto un arresto.

---

## 7. RunLedger — tassonomia degli eventi

Il RunLedger è **append-only** e costituisce la verità sull'esecuzione. Lo stato è una
proiezione del ledger, mai il contrario.

### 7.1 Proprietà

1. **Append-only**: nessuna cancellazione, nessuna modifica in loco.
2. **Hash chain**: `event.prevHash` lega ogni evento al precedente; la manomissione è
   rilevabile.
3. **Ordinamento totale per run**: `seq` monotono crescente, assegnato dal control-plane.
4. **Contenuto per riferimento**: i payload grandi entrano come `ArtifactRef` + hash,
   non inline. Il ledger resta leggibile e non diventa un archivio.
5. **Nessun secret**: mai valori sensibili; solo `SecretRef` e classi di dati.
6. **Ricostruibilità**: dato il ledger, lo stato del run è ricalcolabile deterministicamente.

### 7.2 Tassonomia

Gli eventi richiesti da §10.5 del prompt canonico sono coperti e raggruppati:

| Gruppo | Evento | Payload minimo |
|---|---|---|
| **Ciclo run** | `run.created` | missione, limiti, owner |
| | `run.planned` | piano, `decompositionRationale` |
| | `run.completed` | artifact finali, criteri soddisfatti |
| | `run.failed` | causa classificata |
| | `run.cancelled` | iniziatore, punto di cancellazione |
| **Agenti** | `agent.proposed` | manifest hash |
| | `agent.admitted` | limiti effettivi, token ref |
| | `agent.rejected` | invariante violata |
| | `agent.delegated` | parent, child, envelope ref |
| | `agent.heartbeat` | stato, progresso dichiarato |
| | `agent.produced` | ResultEnvelope ref |
| | `agent.terminated` | esito, budget consumato |
| **Tool** | `tool.called` | toolId, versione, hash argomenti, idempotency key |
| | `tool.returned` | hash risultato, durata |
| | `tool.failed` | classe di errore |
| **Persistenza** | `checkpoint.written` | seq, hash stato, ref artifact |
| | `checkpoint.restored` | seq ripristinato |
| **Approvazioni** | `approval.requested` | operazione, impatto, reversibilità |
| | `approval.granted` | firma, scadenza, ambito |
| | `approval.denied` | motivo |
| | `bridge.card_issued` | DelegationCard ref |
| | `bridge.result_received` | hash risultato, chi ha incollato |
| **Controllo** | `retry.scheduled` | causa classificata, tentativo, backoff |
| | `blocked.recorded` | tipo, chi può sbloccare |
| | `loop.detected` | segnale, evidenza |
| | `quota.reserved` / `quota.released` | provider, capability, quantità |
| | `killswitch.engaged` | ambito, autore |
| **Compensazione** | `compensation.started` | effetti da annullare |
| | `compensation.completed` | esito per effetto |
| **Merge** | `merged` | input hash, output hash, rationale |
| | `dissent.recorded` | posizioni, prove |

### 7.3 Perché la catena di hash conta

Senza hash chain, "l'audit trail" è un file che chiunque con accesso in scrittura può
riscrivere a posteriori — inclusa una skill compromessa. Con la catena, la riscrittura
richiede di ricalcolare tutti gli eventi successivi, e l'incoerenza è rilevabile con un
controllo `O(n)` che non richiede fiducia nel processo che ha scritto.

Questo è ciò che rende la **proof fabrication** (§17 del prompt canonico) un attacco
rilevabile invece che una possibilità silenziosa.

---

## 8. Checkpoint, resume, cancel, retry

### 8.1 Checkpoint

**Regola d'oro:** *checkpoint prima di ogni side effect.* Non dopo, non "periodicamente".

Un `Checkpoint` contiene:

| Campo | Contenuto |
|---|---|
| `checkpointId`, `runId`, `seq` | identità e posizione nel ledger |
| `supervisorState` | stato §5 |
| `agentStates` | mappa `agentId → stato + budget residuo` |
| `activeTaskCount` | contatore DepthGuard |
| `artifactRefs` | riferimenti + hash, mai contenuti inline |
| `quotaCounters` | per provider e capability |
| `pendingApprovals` | approvazioni in volo |
| `pendingSideEffects` | operazioni con idempotency key emessa ma esito ignoto |
| `ledgerOffset` | ultimo `seq` incluso |
| `stateHash` | hash dell'intero checkpoint |

Un checkpoint è **VALID** se `stateHash` verifica e tutti gli `artifactRefs` risolvono.
Un checkpoint non valido non viene mai usato per la ripresa: si scende al precedente valido.

### 8.2 Resume

```
1. carica l'ultimo checkpoint VALID
2. leggi gli eventi del ledger con seq > checkpoint.ledgerOffset
3. per ogni operazione in pendingSideEffects:
     a. cerca tool.returned con la stessa idempotency key
     b. se presente  → effetto CONFERMATO: non rieseguire, adotta il risultato
     c. se assente    → effetto INCERTO: interroga il tool con la stessa key
                        (i tool devono esporre lookup per key, altrimenti l'operazione
                         è classificata NON_IDEMPOTENT e richiede decisione umana)
4. ricostruisci lo stato proiettando il ledger
5. verifica gli invarianti DepthGuard sullo stato ricostruito
6. riparti dal primo step non confermato
```

Il passo 3c è il punto che distingue un resume corretto da uno che duplica: un tool che
esegue scritture esterne **deve** offrire una lookup per idempotency key. Senza di essa,
il runtime non può sapere se l'operazione è avvenuta, e l'unica risposta onesta è
fermarsi e chiedere. Questo requisito va imposto in `ToolManifest` (UJ-MCP-001).

### 8.3 Cancellation

Cooperativa, con escalation:

| Fase | Durata | Comportamento |
|---|---|---|
| `SOFT` | fino a `gracePeriodMs` | il token di cancellazione si propaga; gli agenti si fermano al prossimo safe point e producono risultato parziale |
| `HARD` | dopo la grazia | lo scheduler smette di dispacciare step; gli step in volo vengono abbandonati |
| `COMPENSATE` | se necessario | i side effect confermati vengono compensati secondo la loro compensation policy |

Un **safe point** è un momento in cui non c'è side effect in volo e lo stato è
serializzabile. Gli agenti controllano il token di cancellazione a ogni safe point.
La cancellazione **non** è mai una perdita silenziosa: produce sempre `run.cancelled`
con il punto esatto e gli artifact parziali conservati.

### 8.4 Retry — con classificazione obbligatoria

Nessun retry senza causa classificata. Nessun retry aggressivo su rate limit
(vincolo §6.3 del prompt canonico).

| Classe | Retry | Backoff | Note |
|---|---|---|---|
| `TRANSIENT_PROVIDER` | sì, max 3 | esponenziale + jitter | |
| `TIMEOUT` | sì, max 2 | esponenziale | **solo se l'operazione è idempotente** |
| `RATE_LIMIT` | no retry immediato | attesa fino a finestra quota | preferire fallback o bridge |
| `QUOTA_EXHAUSTED` | **no** | — | fallback, bridge o pausa; mai rotazione account |
| `SCHEMA_VIOLATION` | sì, max 1 | immediato | un solo tentativo di riparazione con feedback dello schema |
| `POLICY_DENIED` | **no** | — | escalation; un retry qui è un tentativo di aggirare la policy |
| `TOOL_ERROR` | dipende | — | classificare la sotto-causa prima di decidere |
| `INTERNAL_BUG` | **no** | — | fail fast, incidente |
| `CANCELLED` / `KILLED` | **no** | — | terminale |

Regole trasversali:

1. il budget di retry è **incluso** in `quotaBudget`, non aggiuntivo;
2. ogni retry emette `retry.scheduled` con causa e tentativo;
3. il retry riusa la **stessa** idempotency key per la stessa operazione logica;
4. `QUOTA_EXHAUSTED` e `POLICY_DENIED` non sono mai "riprovabili più tardi in automatico":
   richiedono una decisione, umana o di routing.

### 8.5 Idempotency

```
idempotencyKey = sha256(
  runId ‖ taskId ‖ operationName ‖ canonicalJson(payload) ‖ toolVersion
)
```

**Il numero di tentativo non entra nella chiave.** È la proprietà che rende il retry
sicuro: lo stesso lavoro logico produce la stessa chiave, quindi il secondo tentativo
è riconoscibile come duplicato invece di apparire come nuova operazione.

Ogni scrittura passa dal `SideEffectLedger`: `key → {status, resultHash, at}`.
Una chiave già `CONFIRMED` restituisce il risultato registrato senza rieseguire.

---

## 9. Tool allowlist — regole di ereditarietà

### 9.1 Le dieci regole

| ID | Regola |
|---|---|
| `TA-1` | **Default deny.** L'allowlist di ogni nuovo agente nasce vuota. |
| `TA-2` | **Sottoinsieme.** `effective(child) ⊆ effective(parent)`. Mai allargamento. |
| `TA-3` | **Grant esplicito.** Ogni tool concesso è nominato per `toolId@version`, mai per wildcard o categoria. |
| `TA-4` | **Ceiling dei dati.** `maxDataClass(child) ≤ maxDataClass(parent)`. |
| `TA-5` | **Ceiling di autonomia.** `maxAutonomy(child) ≤ maxAutonomy(parent)`; `L5` mai. |
| `TA-6` | **Nessuna eredità di segreti.** I secret non sono nell'allowlist né nel contesto: il tool-runtime li risolve al momento della chiamata. |
| `TA-7` | **Capability token.** Ogni grant è materializzato in un token con scadenza, legato a `(runId, agentId, toolId, version)`, non trasferibile. |
| `TA-8` | **Ceiling di side effect.** `maxSideEffect(child) ≤ maxSideEffect(parent)`, ordine `NONE < INTERNAL_WRITE < EXTERNAL_WRITE < DESTRUCTIVE`. |
| `TA-9` | **Revoca a cascata.** Revocare un tool al padre lo revoca a tutto il sottoalbero, immediatamente. |
| `TA-10` | **Nessuna amplificazione.** Un agente non può concedere un tool che non possiede, né una versione diversa da quella che possiede. |

### 9.2 Perché il pinning di versione (`TA-3`, `TA-10`)

Un grant `toolId` senza versione consente il **tool poisoning per aggiornamento**: il
tool ammesso come innocuo cambia comportamento o descrizione dopo l'admission, e
l'agente continua a usarlo con i permessi vecchi. Pinnando `toolId@version` e legando il
token alla versione, un aggiornamento del tool invalida i token esistenti e forza una
nuova admission. Vedi threat `TH-R-07`.

### 9.3 Esempio di verifica

```
Supervisor  : { repo.read@1, repo.write@1, http.fetch@2 }  C2  L3  EXTERNAL_WRITE
  └─ Coder   : { repo.read@1, repo.write@1 }                C1  L2  INTERNAL_WRITE   ✅
  └─ Fetcher : { http.fetch@2 }                             C0  L2  NONE             ✅
  └─ Rogue   : { repo.write@1, shell.exec@1 }               C1  L2  EXTERNAL_WRITE   ❌
```

`Rogue` viene rifiutato in admission per due invarianti: `shell.exec@1 ∉ effective(parent)`
(viola `TA-2`) e `maxSideEffect` pari a quello del padre non è di per sé illegale, ma la
combinazione con un tool non posseduto viola `TA-10`. L'evento è `agent.rejected` con
l'invariante nominata — non un messaggio generico, perché il reviewer deve poter capire
*quale* regola ha protetto il sistema.

---

## 10. Comunicazione tipizzata fra agenti

### 10.1 Principio

> Gli agenti si scambiano **artifact tipizzati e content-addressed**, non testo libero.

Il testo libero fra agenti produce quattro problemi che il sistema non può permettersi:
perdita di provenienza, impossibilità di validazione, superficie di prompt injection e
crescita non controllata del contesto.

### 10.2 ArtifactRef

Un artifact è identificato per **contenuto**, non per percorso:

| Campo | Regola |
|---|---|
| `artifactId` | identità logica stabile |
| `version` | versione dell'artifact |
| `contentHash` | `sha256` del contenuto canonicalizzato — l'identità reale |
| `schemaRef` | schema + versione a cui il contenuto è conforme |
| `mediaType` | tipo concreto |
| `dataClass` | `C0..C4` |
| `producedBy` | `agentId` + `runId` |
| `derivedFrom` | `ArtifactRef[]` — catena di provenienza |
| `originLabel` | `TRUSTED_INTERNAL \| UNTRUSTED_EXTERNAL \| HUMAN_PROVIDED` |
| `createdAt` | UTC |

`originLabel` è il campo che implementa la separazione **dato/istruzione**: il contenuto
`UNTRUSTED_EXTERNAL` (web, repository di terzi, issue, email, output MCP) non può mai
essere promosso a istruzione. Un artifact esterno che contiene "ignora le istruzioni
precedenti" è dato ostile, e il runtime lo tratta come tale a prescindere da quanto sia
persuasivo per il modello che lo legge.

### 10.3 TaskEnvelope e ResultEnvelope

**TaskEnvelope** (Supervisor → Agent) porta: `taskId`, `agentId`, missione, input refs,
schema di output atteso, acceptance criteria, limiti effettivi, deadline, token ref,
`cancellationTokenRef`, `idempotencyScope`.

**ResultEnvelope** (Agent → Supervisor) porta: `taskId`, `agentId`, `status`
(`PRODUCED | PARTIAL | BLOCKED | FAILED`), output refs, criteri soddisfatti/non
soddisfatti, budget consumato, `assumptions[]`, `blockers[]`, `dissent[]`,
`nextActionProposal`, `provenance`.

### 10.4 Doppia validazione

1. **Produce-time (postflight):** l'agente non può emettere un ResultEnvelope che non
   valida contro `outputSchemaRef`. Un output invalido è `SCHEMA_VIOLATION`, non un
   risultato "da interpretare".
2. **Consume-time (preflight):** chi riceve rivalida contro lo schema **e** contro
   `dataClass` e `originLabel` prima di usarlo.

La doppia validazione non è ridondanza difensiva: produttore e consumatore possono
avere versioni di schema diverse, e il momento in cui la divergenza va scoperta è
prima dell'uso, non durante.

### 10.5 Evoluzione degli schemi

- ogni schema ha `schemaId` + `SemVer`;
- le modifiche **minor** sono additive e retrocompatibili;
- le modifiche **major** richiedono migrazione dichiarata e ADR;
- `tests/contracts` verifica che un consumatore alla versione `N` legga artifact
  prodotti alla versione `N-1` (test di compatibilità all'indietro obbligatorio).

---

## 11. Scenari di fallimento e loop

Ogni scenario ha: innesco, rilevamento, contenimento automatico, evento, escalation, test.

### S1 — Fork bomb per delega ricorsiva

- **Innesco:** un agente crea figli che creano figli, per errore di planning o per injection.
- **Rilevamento:** contatore atomico task attivi; `INV-D3`, `INV-D4`.
- **Contenimento:** admission del figlio rifiutata a 25 task attivi o a depth 3.
- **Evento:** `agent.rejected` con invariante nominata.
- **Escalation:** dopo 3 rifiuti consecutivi nello stesso ramo → `blocked.recorded`.
- **Test:** `T-DG-2`, `T-DG-4`, `T-DG-4b` (concorrenza).

### S2 — Ping-pong fra due agenti

- **Innesco:** A delega a B, B rimanda ad A senza progresso.
- **Rilevamento:** `INTENT_REPEAT` sull'hash della missione normalizzata.
- **Contenimento:** sospensione del ramo alla terza ripetizione.
- **Evento:** `loop.detected` con le tre occorrenze come prova.
- **Escalation:** Supervisor cambia strategia; non può alzare il budget.
- **Test:** `T-LP-1`.

### S3 — Schema thrash

- **Innesco:** il modello produce ripetutamente output non conforme.
- **Rilevamento:** `SCHEMA_VIOLATION` con `reworkCount`.
- **Contenimento:** una sola riparazione con feedback dello schema, poi fallimento.
- **Evento:** `retry.scheduled` poi `agent.terminated(FAILED)`.
- **Escalation:** proposta di semplificare lo schema o cambiare capability.
- **Test:** `T-RT-3`.

### S4 — Tempesta di rate limit

- **Innesco:** più agenti colpiscono lo stesso provider in parallelo.
- **Rilevamento:** `RATE_LIMIT` dal gateway; contatori del Quota Governor.
- **Contenimento:** nessun retry aggressivo; concurrency cap; attesa finestra o fallback.
- **Evento:** `quota.reserved` fallita, `retry.scheduled` con causa `RATE_LIMIT`.
- **Escalation:** `HUMAN_BRIDGE` o pausa. **Mai** rotazione di account o chiavi.
- **Test:** `T-QT-1`.

### S5 — Doppio side effect dopo resume

- **Innesco:** crash fra l'esecuzione di una scrittura esterna e la registrazione dell'esito.
- **Rilevamento:** `pendingSideEffects` non vuoto al resume.
- **Contenimento:** lookup per idempotency key; se il tool non la supporta →
  `NON_IDEMPOTENT` → stop e decisione umana.
- **Evento:** `checkpoint.restored` + esito della lookup.
- **Escalation:** `approval.requested` per la riesecuzione.
- **Test:** `T-CK-2` (crash iniettato fra effetto e registrazione).

### S6 — Team orfano

- **Innesco:** il Supervisor muore, i membri restano `RUNNING`.
- **Rilevamento:** assenza di heartbeat del supervisor lato control-plane.
- **Contenimento:** i capability token scadono e non si rinnovano → i membri non
  possono più chiamare tool. Il team decade in modo sicuro invece di continuare cieco.
- **Evento:** `agent.terminated(TIMED_OUT)` per i membri.
- **Escalation:** resume del run dall'ultimo checkpoint valido.
- **Test:** `T-SV-2`.

### S7 — Prompt injection da artifact

- **Innesco:** un artifact `UNTRUSTED_EXTERNAL` contiene istruzioni.
- **Rilevamento:** `originLabel`; il contenuto esterno non è mai canale di istruzioni.
- **Contenimento:** i limiti stanno nel runtime, non nel prompt: anche un modello
  completamente persuaso non può ottenere tool fuori allowlist né alzare `maxDataClass`.
- **Evento:** `tool.failed(POLICY_DENIED)` se tenta.
- **Escalation:** `blocked.recorded` + segnalazione a UJ-SEC-001.
- **Test:** `T-SEC-1` (suite red-team, coordinata con UJ-INJ-001 di GROK).

### S8 — Checkpoint non valido

- **Innesco:** artifact garbage-collected o storage corrotto.
- **Rilevamento:** `stateHash` non verifica o `ArtifactRef` non risolve.
- **Contenimento:** discesa al checkpoint valido precedente.
- **Evento:** `checkpoint.restored` con `degraded: true`.
- **Escalation:** se nessun checkpoint è valido → `run.failed`, mai ripartenza cieca.
- **Test:** `T-CK-3`.

### S9 — Deadlock di approvazione

- **Innesco:** il proprietario non risponde a una richiesta di approvazione.
- **Rilevamento:** `approvalDeadline` superata.
- **Contenimento:** il ramo va `BLOCKED`; **gli altri rami proseguono** se indipendenti.
- **Evento:** `blocked.recorded` con chi può sbloccare.
- **Escalation:** notifica in dashboard; nessun auto-approve, mai.
- **Test:** `T-AP-2`.

### S10 — Quota esaurita a metà run

- **Innesco:** il budget finisce con lavoro incompleto.
- **Rilevamento:** preflight del Quota Governor.
- **Contenimento:** riserva per checkpoint e recovery mantenuta separata e intoccabile,
  così il run può sempre salvarsi anche senza budget per lavorare.
- **Evento:** `quota.reserved` fallita, `checkpoint.written`.
- **Escalation:** risultato parziale + `nextActionProposal`. Nessuna auto-estensione.
- **Test:** `T-QT-2`.

### S11 — Tool avvelenato dopo l'admission

- **Innesco:** manifest o descrizione del tool cambiano dopo l'ammissione.
- **Rilevamento:** hash del ToolManifest verificato a ogni chiamata contro quello ammesso.
- **Contenimento:** mismatch → chiamata rifiutata, token invalidato.
- **Evento:** `tool.failed(POLICY_DENIED)` + `blocked.recorded`.
- **Escalation:** nuova admission richiesta.
- **Test:** `T-TL-1`. Dettaglio in UJ-MCP-001.

### S12 — Deadline incoerenti

- **Innesco:** un figlio ha deadline oltre quella del padre.
- **Rilevamento:** `INV-D9` in admission.
- **Contenimento:** rifiuto in admission.
- **Evento:** `agent.rejected`.
- **Escalation:** nessuna, è un errore di specifica.
- **Test:** `T-DG-9`.

---

## 12. Decisioni aperte da portare in ADR

Registrate come `PROPOSAL`, non come scelte fatte. Nessuna richiede spesa.

| ID | Decisione | Opzioni | Owner | Dipende da |
|---|---|---|---|---|
| `ADR-RUN-01` | Kernel dello state machine | custom deterministico vs LangGraphJS vs altro TS | esperimento M2 | evaluation harness |
| `ADR-RUN-02` | Persistenza di ledger e checkpoint | event store su DB scelto vs file content-addressed | GEMINI | UJ-INF-001 |
| `ADR-RUN-03` | Trasporto degli envelope | in-process vs coda | M2 | topologia zero-card |
| `ADR-RUN-04` | Rappresentazione dei capability token | JWT firmato locale vs riferimento opaco in DB | CLAUDE | UJ-SEC-001 |
| `ADR-RUN-05` | Similarità per loop detection | Jaccard su shingle (proposto) vs alternativa deterministica | CLAUDE | — |
| `ADR-RUN-06` | Storage degli artifact content-addressed | repo git vs blob store del DB | GEMINI | UJ-INF-001 |

**Raccomandazione (PROPOSAL) su `ADR-RUN-01`:** partire con una state machine custom
deterministica. Motivo: gli invarianti di §6 e §9 sono il valore centrale del sistema, e
un framework che gestisce lui il ciclo di vita degli agenti va comunque avvolto per
imporli. Un kernel custom di dimensioni contenute è più facile da testare in modo
esaustivo che un framework generico vincolato dall'esterno. Da falsificare in M2 con
spike comparabili, non da assumere.

---

## 13. Review checklist per l'integratore

Deliverable 13 di §39.2. Ogni voce è **binaria**. Un `NO` blocca l'accettazione.

### 13.1 Conformità ai vincoli

| # | Controllo | Atteso |
|---|---|---|
| C-1 | Il runtime introduce API a pagamento? | NO |
| C-2 | Il runtime richiede inferenza locale? | NO |
| C-3 | Il runtime richiede un server sempre acceso? | NO — è a eventi e checkpoint |
| C-4 | Compaiono nomi di provider nei contratti? | NO |
| C-5 | Compaiono segreti in manifest, ledger o checkpoint? | NO — solo `SecretRef` |
| C-6 | Esiste un percorso che alza i limiti senza approvazione umana? | NO |
| C-7 | `L5` è raggiungibile? | NO |
| C-8 | Il kill switch è disattivabile da un agente? | NO |

### 13.2 Completezza rispetto a §39.2

| # | Deliverable | Dove | Presente |
|---|---|---|---|
| D-1 | Runtime Blueprint | questo file | ✅ |
| D-2 | AgentManifest | §3 + `agent-manifest.ts` | ✅ |
| D-3 | TeamSpec | §4 + `team-spec.ts` | ✅ |
| D-4 | Supervisor state machine | §5 + `supervisor.ts` | ✅ |
| D-5 | DepthGuard invariants | §6 + `depth-guard.ts` | ✅ |
| D-6 | RunLedger / eventi | §7 + `run-ledger.ts` | ✅ |
| D-7 | checkpoint/resume/cancel/retry | §8 + `checkpoint.ts` | ✅ |
| D-8 | tool allowlist inheritance | §9 + `depth-guard.ts` | ✅ |
| D-9 | typed artifact communication | §10 + `envelopes.ts` | ✅ |
| D-10 | failure and loop scenarios | §11 | ✅ |
| D-11 | TypeScript contracts | `packages/contracts/src/runtime/` | ✅ |
| D-12 | threat notes → UJ-SEC-001 | `docs/threat-models/RUNTIME_THREAT_NOTES.md` | ✅ |
| D-13 | review checklist | §13 | ✅ |
| D-14 | task delta e resume point | `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` | ✅ |

### 13.3 Test obbligatori prima di considerare implementato il runtime

Le funzioni pure di questo deliverable sono **già testate**; i test di livello runtime
non lo sono, perché il runtime non esiste ancora. La distinzione è esplicita: dichiarare
superati test che non girano sarebbe falso avanzamento (§31.5).

**Stato:** 33 test eseguiti, 33 passati.
Comando: `cd packages/contracts && npx tsc && cd ../.. && node --test tests/contracts/runtime-invariants.test.mjs`

#### Implementati e verdi (`tests/contracts/runtime-invariants.test.mjs`)

| ID | Test | Esito atteso | Stato |
|---|---|---|---|
| `T-DG-1` | agente a depth 4 | rifiutato con `INV-D1` | ✅ PASS |
| `T-DG-2` | sesto figlio dello stesso agente | rifiutato con `INV-D3` | ✅ PASS |
| `T-DG-3` | figlio generato da agente a depth 3 | rifiutato con `INV-D2` | ✅ PASS |
| `T-DG-4` | ventiseiesimo task atomico attivo | rifiutato con `INV-D4` | ✅ PASS |
| `T-DG-9` | deadline figlio > deadline padre | rifiutato con `INV-D9` | ✅ PASS |
| `T-TA-1` | figlio chiede tool non posseduto dal padre | rifiutato con `TA-2` | ✅ PASS |
| `T-TA-2` | figlio chiede `maxDataClass` superiore | rifiutato con `TA-4` | ✅ PASS |
| `T-TA-3b` | grant con versione diversa | rifiutato: non è un near-match | ✅ PASS |
| `T-LP-1` | k-gramma di tool ripetuto | ciclo rilevato | ✅ PASS |
| `T-LP-2` | due output identici | stagnazione rilevata | ✅ PASS |
| `T-LP-3` | una parola cambiata | **evade la soglia** — limite misurato, §6.4 | ✅ PASS |
| `T-QT-1` | rate limit e quota esaurita | nessun retry | ✅ PASS |
| `T-KS-1` | kill switch da ogni stato non terminale | `HALTED` senza guardie | ✅ PASS |
| `T-SM-1` | transizione non elencata | negata per default | ✅ PASS |
| `T-LG-1` | manomissione del ledger | hash chain rileva, con `firstBrokenSeq` | ✅ PASS |
| `T-ID-1` | stabilità della idempotency key fra tentativi | chiave identica | ✅ PASS |
| — | rejection multipla | tutte le invarianti violate riportate | ✅ PASS |

#### Specificati, non ancora implementati (richiedono il runtime — M2/M3, UJ-RCV-001)

| ID | Test | Esito atteso | Stato |
|---|---|---|---|
| `T-DG-4b` | 10 spawn concorrenti con 20 task attivi | esattamente 5 ammessi, contatore atomico | ⏳ PENDING |
| `T-TA-3` | revoca al padre | tutto il sottoalbero perde il tool | ⏳ PENDING |
| `T-TA-4` | uso di token dopo scadenza | rifiutato | ⏳ PENDING |
| `T-RT-3` | tre output invalidi di seguito | una riparazione, poi fallimento | ⏳ PENDING |
| `T-CK-1` | resume dopo crash pulito | nessun side effect duplicato | ⏳ PENDING |
| `T-CK-2` | crash fra effetto e registrazione | effetto rilevato via idempotency key | ⏳ PENDING |
| `T-CK-3` | checkpoint corrotto | discesa al precedente valido | ⏳ PENDING |
| `T-QT-2` | quota esaurita | checkpoint riesce, riserva intatta | ⏳ PENDING |
| `T-AP-2` | approvazione scaduta | ramo bloccato, altri proseguono | ⏳ PENDING |
| `T-SV-2` | supervisor morto | membri decadono per scadenza token | ⏳ PENDING |
| `T-SEC-1` | injection da artifact esterno | nessun tool fuori allowlist | ⏳ PENDING |

`T-DG-4b` è il più importante dei pendenti: è il test che distingue un contatore
atomico da uno soggetto a race condition, ed è il punto in cui `DG-3` — il limite che
lega davvero (§6.3) — si rompe per primo in un'implementazione ingenua.

### 13.4 Domande a cui il reviewer deve rispondere

1. Esiste un percorso, anche indiretto, per cui un agente ottiene un tool che il padre
   non ha? Se sì, quale?
2. Esiste uno stato da cui il kill switch non è raggiungibile?
3. Un resume può rieseguire un side effect confermato? Sotto quali assunzioni sul tool?
4. Il loop detector può essere aggirato variando la missione in modo cosmetico?
   **Risposta già data e misurata: sì, con una sola parola** (§6.4). La domanda residua
   per il reviewer è se i controlli compensativi (`TOOL_CYCLE`, cap task attivi, quota)
   siano sufficienti, non se il segnale testuale tenga — non tiene.
5. Il contatore dei task attivi è atomico in presenza di fan-out concorrente?
6. Il ledger può essere riscritto da chi ha accesso in scrittura senza essere rilevato?

Le domande 4 e 6 sono quelle su cui mi aspetto le obiezioni più forti da GROK
(UJ-RED-001 / UJ-INJ-001), e sono deliberatamente lasciate aperte invece che chiuse con
una risposta rassicurante.

---

## 14. Artefatti prodotti da UJ-RUN-001

| File | Deliverable |
|---|---|
| `docs/architecture/RUNTIME_BLUEPRINT.md` | 1–10, 13 |
| `packages/contracts/src/runtime/common.ts` | 11 |
| `packages/contracts/src/runtime/agent-manifest.ts` | 2, 11 |
| `packages/contracts/src/runtime/team-spec.ts` | 3, 11 |
| `packages/contracts/src/runtime/supervisor.ts` | 4, 11 |
| `packages/contracts/src/runtime/depth-guard.ts` | 5, 8, 11 |
| `packages/contracts/src/runtime/run-ledger.ts` | 6, 11 |
| `packages/contracts/src/runtime/checkpoint.ts` | 7, 11 |
| `packages/contracts/src/runtime/envelopes.ts` | 9, 11 |
| `packages/contracts/src/runtime/index.ts` | 11 |
| `docs/threat-models/RUNTIME_THREAT_NOTES.md` | 12 |
| `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` | 14 |
| `docs/program/evidence/UJ-CLD-001-SOURCE-MANIFEST.md` | secondario §34 |

## 15. Autovalutazione (§43)

| Area | Max | Assegnato | Motivazione |
|---|---:|---:|---|
| vincoli e zero-cost truthfulness | 15 | 15 | nessuna API a pagamento, nessun compute locale, nessun sempre-on |
| fattibilità tecnica e sostituibilità | 15 | 13 | contratti provider-neutral; kernel non ancora scelto per esperimento M2 |
| sicurezza, privacy, approval | 15 | 13 | invarianti e threat notes presenti; threat model completo è UJ-SEC-001 |
| artifact concreti e testabilità | 15 | 14 | contratti che compilano; 22 test specificati ma non ancora implementati |
| fonti e disciplina epistemica | 10 | 9 | prompt canonico verificato con hash; fonti esterne raccolte, non asserite |
| roadmap ed estendibilità | 10 | 8 | ADR aperti dichiarati; non invado milestone altrui |
| status e remaining work | 10 | 9 | pesi e delta nell'handoff, formula §7.4 applicata |
| collaborazione e handoff | 5 | 5 | handoff per tutte e tre le altre IA + Christian |
| chiarezza | 5 | 4 | documento lungo per necessità di contratto |
| **Totale** | **100** | **90** | soglia "pronto per review" raggiunta |

Nessun critical failure di §43: nessuna API a pagamento proposta come attiva, nessuna
automazione di UI consumer, nessun modello locale, nessun segreto esposto, nessun
billing, nessuna percentuale o test inventati, nessuna skill autopromossa, nessun
repository copiato, nessun side effect non approvato.

---

# PARTE II — sezioni aggiunte in sessione 5 (2026-08-18)

> **Perché numerate da 16 e non intercalate.** Le sezioni 0–15 sono citate per numero dal
> `ResponsePacket` di `UJ-RUN-001`, dalla review checklist §13, dai contratti in
> `packages/contracts/src/runtime/` (che riportano `Blueprint §N` nei loro header) e dalle
> threat notes. Rinumerarle romperebbe quei riferimenti in silenzio. Le sezioni nuove si
> aggiungono in coda: **estensione, mai riscrittura.**
>
> **Stato delle prove in questa parte.** Dove una prova **esiste già** è nominata con il file
> e il nome del test. Dove **non esiste**, è scritto `PROVA DA IMPLEMENTARE` con l'asserzione
> esatta che dovrà fare. Nessuna delle due categorie è dichiarata eseguita se non lo è: le
> sezioni 16–21 specificano contratti, non risultati.

---

## 16. Decomposizione dei task

### 16.1 Responsabilità

Trasformare una `MissionSpec` in un **DAG di task**, ciascuno con un solo owner, un reviewer
diverso dall'owner, un peso e criteri di accettazione verificabili. La decomposizione è la
sola sede in cui nascono i task: nessun agente può crearne uno a runtime.

**La parte strutturale è una funzione pura.** Non richiede alcuna chiamata a modello: dato lo
stesso `MissionSpec` e lo stesso registro di capability, produce lo stesso DAG byte per byte.
Un modello può *proporre* una decomposizione, ma la proposta entra come input dati e passa
per gli stessi controlli di una scritta a mano. Questo è ciò che rende la decomposizione
testabile e a costo zero.

### 16.2 Input

| Campo | Tipo | Vincolo |
|---|---|---|
| `missionId` | `MissionId` | esiste nel ledger, stato `OPEN` |
| `objective` | `string` | non vuoto |
| `capabilityIndex` | `readonly CapabilityTag[]` | chiuso: nessun tag inventato in decomposizione |
| `budget` | `QuotaBudget` | `costClass` di ogni ramo deve essere `ZERO_*` (§20) |
| `ceilings` | `{ maxDepth, maxFanOut, maxActive }` | non modificabili dagli agenti (`DG-1..DG-3`) |

### 16.3 Output

```ts
interface TaskNode {
  readonly taskId: TaskId;
  readonly parentId: TaskId | null;
  readonly depth: number;              // 0 per la radice
  readonly weight: number;             // intero > 0
  readonly owner: AiId;
  readonly reviewer: AiId;             // invariante: reviewer !== owner
  readonly requiredCapabilities: readonly CapabilityTag[];
  readonly acceptanceCriteria: readonly Criterion[];  // >= 1, ognuno falsificabile
  readonly dependsOn: readonly TaskId[];
}
interface Decomposition {
  readonly missionId: MissionId;
  readonly nodes: readonly TaskNode[];
  readonly contentHash: ContentHash;   // sui nodi ordinati per taskId
}
```

### 16.4 Stato

`DRAFT → VALIDATED → FROZEN`. Solo una decomposizione `FROZEN` può generare delegation card.
`FROZEN` è **append-only**: aggiungere un task richiede una nuova decomposizione con un nuovo
`contentHash` e un evento `mission.decomposition.superseded` che nomina la precedente.

### 16.5 Errori

| Codice | Condizione | Effetto |
|---|---|---|
| `DEC-E01` | ciclo nel DAG | rifiuto, nessun task creato |
| `DEC-E02` | somma dei pesi dei figli ≠ peso del padre | rifiuto |
| `DEC-E03` | `reviewer === owner` su almeno un nodo | rifiuto, nodo nominato |
| `DEC-E04` | nodo senza `acceptanceCriteria` o con criteri non falsificabili | rifiuto |
| `DEC-E05` | `depth > maxDepth` o `fanOut > maxFanOut` | rifiuto, invariante `DG-*` nominata |
| `DEC-E06` | `requiredCapabilities` contiene un tag fuori da `capabilityIndex` | rifiuto |
| `DEC-E07` | task irraggiungibile dalla radice | rifiuto |

Tutti gli errori sono **rifiuti in blocco**: non esiste decomposizione parzialmente accettata.
Una decomposizione a metà è peggio di nessuna, perché produce task orfani che nessuno possiede.

### 16.6 Controlli

1. **Aciclicità** — ordinamento topologico; fallisce se resta un nodo con archi entranti.
2. **Conservazione del peso** — per ogni nodo non foglia, `weight === Σ weight(figli)`.
3. **Indipendenza del reviewer** — `reviewer !== owner`, verificato su ogni nodo.
4. **Falsificabilità dei criteri** — ogni `Criterion` deve avere un `verification` che nomina
   un artefatto o un comando. Un criterio la cui verità dipende solo dal verdetto del reviewer
   **non è falsificabile e va rifiutato** (`DEC-E04`).
5. **Determinismo** — due esecuzioni sullo stesso input producono lo stesso `contentHash`.

> **Il controllo 4 esiste per un difetto osservato, non per ipotesi.** Nel `BACKLOG.json`
> corrente, 41 criteri di accettazione su 43 task hanno la forma *"`<REVIEWER>` issues an
> evidence-backed PASS or PASS_WITH_ACTIONS review"*. Un criterio del genere è vero se e solo
> se il reviewer approva: nessuna proprietà del deliverable lo rende vero o falso. `DEC-E04`
> impedisce meccanicamente che una decomposizione futura ne produca altri.

### 16.7 Prova richiesta

| Prova | Stato |
|---|---|
| `T-DEC-1` un DAG con ciclo è rifiutato con `DEC-E01` | **PROVA DA IMPLEMENTARE** |
| `T-DEC-2` pesi che non si conservano sono rifiutati con `DEC-E02` | **PROVA DA IMPLEMENTARE** |
| `T-DEC-3` `reviewer === owner` è rifiutato e il nodo è nominato | **PROVA DA IMPLEMENTARE** |
| `T-DEC-4` un criterio che nomina solo l'esito del reviewer è rifiutato con `DEC-E04` | **PROVA DA IMPLEMENTARE** |
| `T-DEC-5` due esecuzioni producono lo stesso `contentHash` | **PROVA DA IMPLEMENTARE** |
| profondità e fan-out oltre il ceiling | **ESISTE**: `tests/contracts/runtime-invariants.test.mjs`, `T-DG-1`, `T-DG-2`, `T-DG-3` |

---

## 17. Selezione e assegnazione degli agenti

### 17.1 Responsabilità

Legare un `TaskNode` a un `AgentManifest`. La selezione avviene **per capability dichiarate e
ceiling**, mai per qualità percepita di un modello e mai per nome di fornitore.

> **Regola dura:** l'input della selezione **non contiene stringhe di vendor**. Se sostituire
> ogni nome di fornitore con un identificatore opaco cambia l'assegnazione, il router non è
> provider-neutral e va rifiutato. Questa è la proprietà che `AC-01` di `UJ-RUN-001` chiede, ed
> è meccanicamente verificabile (§17.6, controllo 3).

### 17.2 Input

| Campo | Tipo | Nota |
|---|---|---|
| `task` | `TaskNode` | da una decomposizione `FROZEN` |
| `candidates` | `readonly AgentManifest[]` | tutti i manifest ammessi, senza pre-filtro |
| `parentGrants` | `EffectiveGrants` | l'allowlist effettiva del padre (§9) |
| `now` | `IsoTimestamp` | iniettato, mai letto dall'orologio dentro la funzione |

`now` è un parametro perché una selezione che legge l'orologio non è riproducibile: due
esecuzioni sullo stesso input darebbero risultati diversi e il ledger non sarebbe replayabile.

### 17.3 Output

```ts
type Assignment =
  | { readonly kind: "ASSIGNED"; readonly agentId: AgentId; readonly grants: EffectiveGrants }
  | { readonly kind: "HUMAN_BRIDGE"; readonly reason: string; readonly envelope: BridgeEnvelope }
  | { readonly kind: "REFUSED"; readonly violations: readonly string[] };
```

Tre esiti e nessun quarto. In particolare **non esiste un esito "assegnato con riserva"**: un
agente che non soddisfa un invariante non viene assegnato, non viene assegnato con un avviso.

### 17.4 Stato

`UNASSIGNED → ASSIGNED → RUNNING → (DONE_PROPOSED | FAILED | CANCELLED)`, oppure
`UNASSIGNED → AWAITING_HUMAN` quando l'esito è `HUMAN_BRIDGE`. `AWAITING_HUMAN` **non è uno
stato di errore**: è un esito legittimo e previsto (§18.4).

### 17.5 Errori

| Codice | Condizione | Esito |
|---|---|---|
| `SEL-E01` | nessun candidato copre `requiredCapabilities` | `HUMAN_BRIDGE`, non `REFUSED` |
| `SEL-E02` | il candidato migliore violerebbe un ceiling (`TA-2`, `TA-4`, `TA-5`, `TA-8`) | `REFUSED`, invarianti elencate **tutte** |
| `SEL-E03` | il candidato è l'owner del task **ed** è anche il reviewer | `REFUSED` |
| `SEL-E04` | il manifest è scaduto rispetto a `now` | `REFUSED` |
| `SEL-E05` | due candidati ugualmente idonei | risolto dal tie-break §17.6, **mai** a caso |

`SEL-E01` produce `HUMAN_BRIDGE` e non un fallimento: l'assenza di un agente capace è una
condizione normale in un programma a costo zero, e la risposta corretta è chiedere a una
persona, non fermarsi.

### 17.6 Controlli

1. **Copertura** — `requiredCapabilities ⊆ declaredCapabilities(candidate)`.
2. **Ceiling** — tutti i controlli di §9 applicati contro `parentGrants`, e il rifiuto elenca
   **ogni** invariante violata, non la prima. Un rifiuto che si ferma alla prima violazione
   nasconde le altre e fa correggere il problema una volta sola invece che tutte.
3. **Neutralità di provider (meccanico)** — data una funzione di offuscamento `σ` che sostituisce
   ogni nome di fornitore con un identificatore opaco stabile:
   `select(task, candidates) ≡ σ⁻¹(select(σ(task), σ(candidates)))`.
   Se l'uguaglianza non regge, esiste una dipendenza dal vendor da rimuovere.
4. **Determinismo e tie-break** — a parità di idoneità l'ordine è: (a) `maxAutonomy` più basso,
   (b) `maxDataClass` più bassa, (c) `maxSideEffect` più basso, (d) `agentId` in ordine
   lessicografico. Il tie-break preferisce **l'agente meno privilegiato**, non il più capace.
5. **Indipendenza del reviewer** — verificata di nuovo qui e non solo in decomposizione, perché
   i manifest possono cambiare fra `FROZEN` e assegnazione.

### 17.7 Prova richiesta

| Prova | Stato |
|---|---|
| `T-SEL-1` nessun candidato idoneo → `HUMAN_BRIDGE`, non `REFUSED` | **PROVA DA IMPLEMENTARE** |
| `T-SEL-2` offuscando i nomi dei vendor l'assegnazione non cambia | **PROVA DA IMPLEMENTARE** |
| `T-SEL-3` a parità di idoneità vince il candidato meno privilegiato | **PROVA DA IMPLEMENTARE** |
| `T-SEL-4` un rifiuto elenca tutte le invarianti violate | **ESISTE** (analoga): `rejection reports every violated invariant, not only the first` |
| `T-SEL-5` un tool non posseduto dal padre non è assegnabile | **ESISTE**: `T-TA-1` |

---

## 18. Routing provider-neutral e HUMAN_BRIDGE

### 18.1 Responsabilità

Il runtime **non chiama mai un fornitore**. Emette una `ProviderRequest` verso un adapter
registrato, e ogni adapter dichiara la propria classe di costo. È l'unico punto in cui il
vincolo dell'Articolo 5 diventa meccanico invece che documentale.

### 18.2 Classe di costo, e perché `METERED` è irrappresentabile a L2

```ts
type CostClass =
  | "ZERO_LOCAL"              // esecuzione locale, loopback, nessuna rete uscente
  | "ZERO_SUBSCRIPTION_HUMAN" // abbonamento già pagato, mediato da una persona
  | "METERED";                // a consumo — vietato sotto STRICT_ZERO_CARD

interface ProviderAdapter {
  readonly adapterId: string;
  readonly costClass: CostClass;
  readonly endpointConstraint: "LOOPBACK_ONLY" | "NONE";
  send(req: ProviderRequest): Promise<ProviderResponse>;
}
```

**Regola di registrazione:** un adapter con `costClass: "METERED"` **non può essere
registrato** quando l'autonomia massima del run è `L2`. Il rifiuto avviene alla registrazione,
non alla chiamata: un controllo che scatta al momento della chiamata protegge solo se qualcuno
arriva fin lì con la configurazione giusta.

**Il default non è una variabile d'ambiente.** Se il `CostClass` di un adapter deve essere
letto dall'ambiente, il valore assente deve risolvere a `ZERO_LOCAL`, mai a `METERED`.

> **Questa regola nasce da un difetto misurato, non da un principio astratto.** In
> `cloud_bridge.py` su `main`, `PROVIDER = os.getenv("MODEL_PROVIDER", "openai")` è una
> **costante di modulo**: il default è a pagamento e viene fissato una volta sola all'import,
> quindi impostare la variabile dopo non protegge. Misurato: **sei percorsi a pagamento o
> remoti su sette attacchi**. Il contratto qui sopra rende quella configurazione
> irrappresentabile: il default cade su `ZERO_LOCAL` e `METERED` non è registrabile a `L2`.

### 18.3 Input e output

| | |
|---|---|
| **Input** | `ProviderRequest { runId, agentId, capabilityTag, payloadRef, maxDataClass, idempotencyKey }` |
| **Output** | `ProviderResponse { status, artifactRef?, bridgeEnvelope?, usage }` |

`payloadRef` è un **riferimento content-addressed**, non il payload. Il routing non trasporta
il contenuto: così il livello di routing non può, nemmeno per errore, mandare fuori dati di
classe superiore a quella dichiarata.

### 18.4 HUMAN_BRIDGE come stato di prima classe

`AWAITING_HUMAN` è uno **stato terminale del passo**, non un errore e non un'attesa attiva.

```ts
interface BridgeEnvelope {
  readonly envelopeId: string;
  readonly createdAt: IsoTimestamp;
  readonly instruction: string;       // cosa la persona deve fare, in una frase
  readonly payloadRef: ArtifactRef;   // cosa deve copiare
  readonly expectedSchema: SchemaRef; // cosa deve riportare indietro
  readonly idempotencyKey: IdempotencyKey;
  readonly resumeToken: string;       // lega la risposta al checkpoint esatto
  readonly expiresAt: IsoTimestamp | null;
}
```

Quattro regole:

| ID | Regola |
|---|---|
| `HB-1` | **Nessun retry automatico.** Un envelope scaduto **non** viene rilanciato: viene marcato `EXPIRED` e il task resta parcheggiato. Rilanciare significherebbe chiedere due volte la stessa cosa a una persona, che è il modo più veloce per farle ignorare le richieste. |
| `HB-2` | **Idempotenza sulla risposta.** Due risposte con lo stesso `idempotencyKey` producono un solo avanzamento. Christian può incollare due volte senza duplicare un side effect. |
| `HB-3` | **Nessun segreto nell'envelope.** `payloadRef` è un riferimento; l'envelope non contiene mai token, cookie o chiavi. |
| `HB-4` | **La risposta è validata come input non fidato.** Arriva da un canale umano ed è soggetta agli stessi controlli di schema e classe di dato di qualunque artifact esterno — inclusa la difesa da prompt injection di §11 S7. |

### 18.5 Errori

| Codice | Condizione | Effetto |
|---|---|---|
| `RTE-E01` | adapter con `costClass: METERED` registrato a `L2` | rifiuto **alla registrazione** |
| `RTE-E02` | `endpointConstraint: LOOPBACK_ONLY` e host non di loopback | rifiuto prima di costruire la richiesta |
| `RTE-E03` | `maxDataClass` della richiesta > ceiling dell'agente | rifiuto, nessuna chiamata |
| `RTE-E04` | nessun adapter per `capabilityTag` | `AWAITING_HUMAN` con envelope |
| `RTE-E05` | risposta del bridge che non valida contro `expectedSchema` | rifiuto, task resta parcheggiato |
| `RTE-E06` | envelope scaduto | `EXPIRED`, **nessun rilancio** (`HB-1`) |

### 18.6 Controlli

1. **Statico** — nessun adapter registrato ha `costClass: METERED` quando `maxAutonomy ≤ L2`.
2. **Dinamico, per attacco** — con configurazione di default, il numero di richieste uscenti
   verso host non di loopback deve essere **zero**. La sonda sostituisce il livello di trasporto
   con uno stub che registra il tentativo e solleva: si misura senza spendere.
3. **Offuscamento** — vale la stessa proprietà `σ` di §17.6: il routing non deve cambiare se i
   nomi dei fornitori vengono sostituiti.
4. **Nessun fallback verso l'alto** — il fallimento di un adapter `ZERO_LOCAL` non può ricadere
   su uno `METERED`. Il fallback è sempre verso `HUMAN_BRIDGE` o verso il fallimento pulito.

### 18.7 Prova richiesta

| Prova | Stato |
|---|---|
| `T-RTE-1` registrare un adapter `METERED` a `L2` fallisce | **PROVA DA IMPLEMENTARE** |
| `T-RTE-2` default → zero richieste uscenti non-loopback | **PROVA DA IMPLEMENTARE** nel runtime TS. *Metodo già validato altrove:* `docs/threat-models/probes/S-17-strict-zero-candidate-probe.py` misura esattamente questo su `cloud_bridge.py` (7 attacchi × 3 varianti) |
| `T-RTE-3` un endpoint non-loopback è rifiutato con `LOOPBACK_ONLY` | **PROVA DA IMPLEMENTARE** |
| `T-RTE-4` due risposte del bridge con la stessa chiave producono un avanzamento | **PROVA DA IMPLEMENTARE** |
| `T-RTE-5` un envelope scaduto non viene rilanciato | **PROVA DA IMPLEMENTARE** |
| `T-RTE-6` la chiave di idempotenza è iniettiva | **ESISTE**: `the key encoding is injective: shifted field boundaries do not collide` |

---

## 19. Conflitti fra agenti

### 19.1 Responsabilità

Rendere impossibili, o almeno rilevabili e non silenziosi, i tre conflitti che un sistema
multi-agente produce davvero: **due scrittori sullo stesso artefatto**, **due pretendenti allo
stesso task**, **due verdetti incompatibili sullo stesso deliverable**.

### 19.2 Le tre classi, e come si chiudono

| Classe | Meccanismo | Perché non un voto di maggioranza |
|---|---|---|
| **C-1 · scrittura concorrente** | **Single-writer per path.** La mappa di proprietà è *derivata* dalla decomposizione (§16), non dichiarata a parte. Ogni path ha esattamente un `taskId` che può scriverlo. | Non è una disputa: è un errore di progetto, e va chiuso a monte. |
| **C-2 · doppia rivendicazione** | **Compare-and-set sul ledger.** La transizione `UNASSIGNED → ASSIGNED` è un CAS sulla versione del nodo; il secondo pretendente perde e riceve `SEL-E05`. | Due agenti che eseguono lo stesso task sprecano quota e producono due artefatti da riconciliare. |
| **C-3 · verdetti incompatibili** | **Escalation a HUMAN_BRIDGE.** Due `ReviewResult` con esito diverso sullo stesso `(taskId, commitSha)` non si mediano: si registrano entrambi e si apre un envelope per il proprietario. | Un voto di maggioranza fra IA fabbrica consenso dove non c'è, ed è esattamente il *falso avanzamento* che §31.5 vieta. Due revisori in disaccordo sono un'informazione, non un rumore da sopprimere. |

### 19.3 Input, output, stato

| | |
|---|---|
| **Input** | evento di scrittura, di claim o di verdetto, con `(runId, taskId, targetRef, version)` |
| **Output** | `ACCEPTED` · `REJECTED_CONFLICT { winner, loser, reason }` · `ESCALATED { envelopeId }` |
| **Stato** | il conflitto stesso è un record nel ledger: `conflict.detected`, `conflict.resolved`, `conflict.escalated`. Non esiste risoluzione che non lasci traccia. |

### 19.4 Errori

| Codice | Condizione | Effetto |
|---|---|---|
| `CNF-E01` | due task rivendicano lo stesso path in scrittura | rifiuto **in decomposizione**, non a runtime |
| `CNF-E02` | CAS fallito sul claim | `REJECTED_CONFLICT`, il perdente non ritenta automaticamente |
| `CNF-E03` | due verdetti diversi sullo stesso `(taskId, commitSha)` | `ESCALATED`, nessuna media |
| `CNF-E04` | un agente tenta di risolvere un conflitto che lo riguarda | rifiuto: chi è parte non arbitra |

### 19.5 Controlli

1. **Unicità dello scrittore** — calcolata dalla decomposizione: se due `TaskNode` dichiarano lo
   stesso path di output, la decomposizione è rifiutata (`CNF-E01`), non gestita a runtime.
2. **Atomicità del claim** — il CAS presuppone un update condizionale nello storage. **È un
   vincolo sulla scelta di database**, e va dichiarato a chi la fa (rischio `R-RCV-01`, owner
   `UJ-INF-001`), non scoperto dopo.
3. **Nessuna auto-arbitraggio** — l'arbitro di un conflitto non può essere né owner né reviewer
   di uno dei due lati.
4. **Tracciabilità** — ogni conflitto lascia almeno due eventi nel ledger; un conflitto risolto
   senza `conflict.detected` precedente è esso stesso un difetto.

### 19.6 Prova richiesta

| Prova | Stato |
|---|---|
| `T-CNF-1` due task con lo stesso path di output → decomposizione rifiutata | **PROVA DA IMPLEMENTARE** |
| `T-CNF-2` due claim concorrenti → esattamente uno vince | **PROVA DA IMPLEMENTARE** (richiede lo storage con CAS) |
| `T-CNF-3` due verdetti diversi → `ESCALATED`, nessuna media | **PROVA DA IMPLEMENTARE** |
| `T-CNF-4` il contatore dei task attivi è atomico | **ESISTE**: `T-DG-4b` / `AtomicActiveTaskCounter` |

---

## 20. Fallback locale a costo zero

### 20.1 Responsabilità

Garantire che **nessun task possa iniziare** se la capability che richiede non ha un fallback
a costo zero. Il controllo è in **admission**, non a runtime: scoprire l'assenza di un fallback
quando il percorso primario è già fallito significa scoprirla nel momento peggiore.

### 20.2 Contratto

```ts
type FallbackKind = "ZERO_LOCAL" | "HUMAN_BRIDGE" | "FAIL_CLOSED";

interface CapabilityBinding {
  readonly tag: CapabilityTag;
  readonly primary: { readonly adapterId: string; readonly costClass: CostClass };
  readonly fallback: { readonly kind: FallbackKind; readonly detail: string };
}
```

**Regola:** `fallback.kind` deve essere uno dei tre valori, e `FAIL_CLOSED` è ammesso solo se il
task è dichiarato non essenziale alla missione. **Non esiste un quarto valore, e in particolare
non esiste un fallback verso un adapter `METERED`.** Il tipo lo rende irrappresentabile: è lo
stesso metodo con cui `L5 — Broad Autonomy` è tenuto fuori dal sistema dei tipi.

### 20.3 Input, output, stato

| | |
|---|---|
| **Input** | `readonly CapabilityBinding[]` più il `TaskNode` che le richiede |
| **Output** | `ADMITTED` oppure `BLOCKED_NO_FALLBACK { tag }` |
| **Stato** | un task senza fallback nasce `BLOCKED`, con il tag mancante nominato. Non entra in coda. |

### 20.4 Errori

| Codice | Condizione | Effetto |
|---|---|---|
| `FBK-E01` | una `requiredCapability` non ha binding | `BLOCKED_NO_FALLBACK`, tag nominato |
| `FBK-E02` | `fallback.kind` non è fra i tre valori | rifiuto del binding alla registrazione |
| `FBK-E03` | `FAIL_CLOSED` su un task essenziale | rifiuto |
| `FBK-E04` | il fallback punta a un adapter `METERED` | irrappresentabile per tipo; se emerge a runtime è un difetto di serializzazione da trattare come `RTE-E01` |

### 20.5 Controlli

1. **Lint dei manifest** — ogni `CapabilityTag` referenziata da un task ha un `CapabilityBinding`.
2. **Chiusura sui costi** — l'insieme dei `costClass` raggiungibili da un task, seguendo primario
   e fallback **transitivamente**, non contiene `METERED`. Il controllo è sulla chiusura, non sul
   primo salto: un fallback che a sua volta ricade su uno a pagamento è la porta che conta.
3. **Fail-safe, non fail-open** — un binding malformato produce `BLOCKED`, mai un default
   permissivo.

### 20.6 Prova richiesta

| Prova | Stato |
|---|---|
| `T-FBK-1` un task con una capability senza binding nasce `BLOCKED` | **PROVA DA IMPLEMENTARE** |
| `T-FBK-2` la chiusura transitiva dei `costClass` non contiene `METERED` | **PROVA DA IMPLEMENTARE** |
| `T-FBK-3` un binding malformato produce `BLOCKED`, non un default permissivo | **PROVA DA IMPLEMENTARE** |
| `T-FBK-4` `L5` resta irrappresentabile (stesso metodo di tipizzazione) | **ESISTE**: `packages/contracts/src/runtime/agent-manifest.ts` |

---

## 21. Demo end-to-end minima

### 21.1 Responsabilità

Dimostrare l'intera catena **senza rete, senza chiavi, senza costo**: decomposizione →
selezione → esecuzione → checkpoint → kill → resume → verifica del ledger. Serve a rendere
il blueprint falsificabile: se la demo non gira, il documento è teoria.

### 21.2 Scenario, deliberatamente banale

Missione: *"produrre `out/hello.txt` contenente `ok`, e verificarlo."*

Un solo adapter registrato, `echo@1`, `costClass: ZERO_LOCAL`, che restituisce l'input
maiuscolo senza toccare la rete. Nessun modello coinvolto: la demo prova **il runtime**, non
la qualità di un'inferenza.

### 21.3 Passi osservabili

| # | Passo | Osservabile atteso |
|---:|---|---|
| 1 | decomposizione della missione | 3 nodi, `contentHash` stabile su due esecuzioni |
| 2 | selezione | tutti e 3 `ASSIGNED`; nessuna stringa di vendor nell'input |
| 3 | esecuzione del nodo 1 | evento `tool.invoked` + `tool.completed` con `echo@1` |
| 4 | checkpoint dopo il nodo 1 | `checkpointId` emesso, ledger a N eventi |
| 5 | **kill switch** durante il nodo 2 | stato `HALTED` raggiunto da uno stato non terminale |
| 6 | resume dal checkpoint | il nodo 1 **non** viene rieseguito: stessa `idempotencyKey`, side effect non duplicato |
| 7 | completamento | `out/hello.txt` esiste e contiene `ok` |
| 8 | verifica del ledger | catena di hash intatta; alterare un evento passato la rompe |
| 9 | **controllo di costo** | richieste uscenti verso host non-loopback: **0** |

### 21.4 Errori che la demo deve saper mostrare

Una demo che mostra solo il percorso felice non prova nulla. Sono richiesti quattro casi
negativi, ognuno con l'errore atteso:

| Caso | Errore atteso |
|---|---|
| un nodo che chiede un tool non posseduto dal padre | `SEL-E02`, invariante `TA-2` nominata |
| un adapter `METERED` registrato a `L2` | `RTE-E01`, rifiuto **alla registrazione** |
| una capability senza fallback | `FBK-E01`, task `BLOCKED` prima della coda |
| due claim concorrenti sullo stesso nodo | `CNF-E02`, esattamente un vincitore |

### 21.5 Controlli e prova richiesta

| Prova | Stato |
|---|---|
| `T-E2E-1` i 9 passi osservabili nell'ordine, exit 0 | **PROVA DA IMPLEMENTARE** |
| `T-E2E-2` i 4 casi negativi con l'errore esatto | **PROVA DA IMPLEMENTARE** |
| `T-E2E-3` zero richieste uscenti non-loopback per l'intera demo | **PROVA DA IMPLEMENTARE** |
| kill switch raggiungibile da ogni stato non terminale | **ESISTE**: `T-KS-1` |
| integrità della catena del ledger e rilevamento della riscrittura | **ESISTE**: `T-LG-1` (tre test) |

### 21.6 Cosa la demo NON prova, dichiarato

- **Non prova la qualità del ragionamento**: l'unico adapter è `echo@1`.
- **Non prova il comportamento sotto concorrenza reale**: i due claim di §21.4 sono simulati
  in-process, non su storage distribuito. Il caso reale dipende dal CAS e quindi da `UJ-INF-001`.
- **Non prova la resistenza a un tool ostile**: quello è `UJ-SKL-001`, portafoglio separato.
- **Non prova che un fornitore reale sia gratuito**: prova che *il runtime* non ne chiama nessuno.

---

## 22. Mappa di tracciabilità dei 24 requisiti

Serve al reviewer per verificare la copertura **contando**, invece di leggere in diagonale.

| # | Requisito | Sezione | Prove |
|---:|---|---|---|
| 1 | AgentManifest | §3 | esistenti |
| 2 | TeamSpec | §4 | esistenti |
| 3 | Supervisor | §5 | esistenti (`T-KS-1`, default-deny) |
| 4 | RunLedger | §7 | esistenti (`T-LG-1` ×3) |
| 5 | **Task decomposition** | **§16** | 5 da implementare, 3 esistenti |
| 6 | **Selezione e assegnazione agenti** | **§17** | 3 da implementare, 2 esistenti |
| 7 | Limiti di profondità e loop | §6 | esistenti (`T-DG-*`, `T-LP-*`) |
| 8 | Approval gate | §5, §9 | esistenti |
| 9 | Timeout | §5, §8 | esistenti (`T-DG-9`) |
| 10 | Retry | §8 | esistenti (4 test) |
| 11 | Cancellation | §8 | esistenti (`T-KS-1`) |
| 12 | Checkpoint | §8 | esistenti |
| 13 | Idempotency key | §8 | esistenti (3 test, incluso l'iniettività) |
| 14 | Recovery | §8 | esistenti (`recovery.test.mjs`, 9) |
| 15 | Gestione degli errori | §11 | esistenti (S1–S12) |
| 16 | **Routing provider-neutral** | **§18** | 5 da implementare, 1 esistente |
| 17 | **HUMAN_BRIDGE** | **§18.4** | 2 da implementare |
| 18 | Policy e data-class enforcement | §9, §18.3 | esistenti (`T-TA-2`) |
| 19 | Tool admission | §9 | esistenti (`T-TA-*`) |
| 20 | Audit trail | §7 | esistenti (`T-LG-1`) |
| 21 | **Conflitti fra agenti** | **§19** | 3 da implementare, 1 esistente |
| 22 | **Demo end-to-end minima** | **§21** | 3 da implementare, 2 esistenti |
| 23 | Criteri di accettazione verificabili | §13, §16.6 | esistenti |
| 24 | **Fallback locale senza costi** | **§20** | 3 da implementare, 1 esistente |

**Bilancio onesto:** 24 requisiti su 24 hanno una sezione. **Non** 24 su 24 hanno una prova
eseguita: le sezioni 16–21 ne specificano **24 nuove da implementare**, e il resto poggia sui
140 test che passano oggi. Dichiarare coperto ciò che è solo specificato sarebbe falso
avanzamento.
=== END FILE ===

=== RESPONSE PACKET: UJ-RUN-001 ===
{
  "schema_version": "ultrajarvis.response-packet/v1",
  "response_id": "UJ-RESPONSE-RUN-001-CLAUDE-20260818",
  "created_at": "2026-08-18T13:48:55Z",
  "card_id": "UJ-CARD-RUN-001-CLAUDE",
  "mission_id": "UJ-MISSION-M0-COUNCIL-001",
  "ai_id": "CLAUDE",
  "product": "Claude Code in a remote execution environment; no metered API used",
  "source_commit_sha": "8ed53286ea805118d26c9a27caf4281904cf7fbe",
  "capabilities_actually_used": [
    {
      "capability": "Repository read at a pinned commit",
      "access_path": "git in the session container",
      "mode": "MANUAL_TOOL"
    },
    {
      "capability": "Branch write (no main, no merge)",
      "access_path": "git push to claude/claude-md-resume-point-tvej1u",
      "mode": "MANUAL_TOOL"
    },
    {
      "capability": "Local typecheck and test execution",
      "access_path": "npx tsc and node --test",
      "mode": "MANUAL_TOOL"
    },
    {
      "capability": "Official primary source web read",
      "access_path": "documentation fetch over HTTPS",
      "mode": "HUMAN_BRIDGE"
    }
  ],
  "task_id": "UJ-RUN-001",
  "status": "REVIEW",
  "executive_delta": "Runtime blueprint and provider-neutral contracts were delivered in session 1 and re-verified in every session since. This packet exists because AC-05 requires one and none had ever been emitted: the artifacts were published but never reported through the mechanism the ledger consumes, which is why BACKLOG.json still shows this task as READY rather than REVIEW. Re-verifying the artifacts against the UJ-RUN-001 handoff gate surfaced a defect in one of them: the tool-cycle detector joined its k-gram key on a NUL byte, the same non-injective encoding that error E6 had already fixed in the adjacent file. It is corrected, the encoding is now single-sourced, and two regression tests were added — the first one proved to fail against the old code before being accepted. Accepted weight is unchanged at 0/13.",
  "facts": [
    {
      "claim": "The contracts package typechecks under strict mode plus six additional flags with exit code 0.",
      "classification": "EXPERIMENT_RESULT",
      "source_ref": "npx tsc -p packages/contracts --noEmit",
      "verified_at": "2026-08-18T10:30:06Z"
    },
    {
      "claim": "The runtime invariant suite passes 36 of 36 tests and the full contract suite passes 140 of 140.",
      "classification": "EXPERIMENT_RESULT",
      "source_ref": "node --test tests/contracts/",
      "verified_at": "2026-08-18T10:30:06Z"
    },
    {
      "claim": "The textual loop detector is evadable by changing a single token: Jaccard similarity measured at 0.7778 on a nine-token mission and 0.9130 on a twenty-three-token mission, both under the 0.95 threshold.",
      "classification": "EXPERIMENT_RESULT",
      "source_ref": "tests/contracts/runtime-invariants.test.mjs",
      "verified_at": "2026-08-17T00:00:00Z"
    },
    {
      "claim": "The original idempotency key construction was ambiguous: two different field splits hashed to the same key. Corrected with length-prefixed encoding and pinned by a regression test.",
      "classification": "EXPERIMENT_RESULT",
      "source_ref": "packages/contracts/src/runtime/checkpoint.ts",
      "verified_at": "2026-08-17T00:00:00Z"
    },
    {
      "claim": "L5 Broad Autonomy is not representable in the type system, so it cannot be reached through a configuration mistake.",
      "classification": "OBSERVATION",
      "source_ref": "packages/contracts/src/runtime/agent-manifest.ts",
      "verified_at": "2026-08-17T00:00:00Z"
    },
    {
      "claim": "The tool-cycle detector built its k-gram key by joining the window on a NUL byte, which is error E6 in a second file. Measured: the sequence [\"a\",\"b\\u0000c\",\"x\",\"a\\u0000b\",\"c\",\"x\"] reported a cycle that does not exist, because windows 0 and 3 encode identically. The NUL also made depth-guard.ts binary to git and grep, so the file was excluded from every text audit of the repository for four sessions.",
      "classification": "EXPERIMENT_RESULT",
      "source_ref": "tests/contracts/runtime-invariants.test.mjs",
      "verified_at": "2026-08-18T10:30:06Z"
    },
    {
      "claim": "The regression test for that defect was proved to fail against the previous implementation before being accepted: expected false, actual true. A check that cannot fail is not a check.",
      "classification": "EXPERIMENT_RESULT",
      "source_ref": "node --test tests/contracts/runtime-invariants.test.mjs against the reverted join",
      "verified_at": "2026-08-18T10:30:06Z"
    },
    {
      "claim": "Coverage of the blueprint against the 24 required runtime points was measured, not assumed. Five points had zero occurrences in the document (task decomposition, agent selection, end-to-end demo, zero-cost fallback) and two were weak (inter-agent conflicts 1 occurrence, HUMAN_BRIDGE 2). Sections 16-22 close them; section 22 maps all 24 points to a section and to its proofs.",
      "classification": "EXPERIMENT_RESULT",
      "source_ref": "docs/architecture/RUNTIME_BLUEPRINT.md",
      "verified_at": "2026-08-18T13:48:55Z"
    },
    {
      "claim": "24 of 24 requirements now have a section, but NOT 24 of 24 have an executed proof: sections 16-22 specify 24 new proofs, each marked PROVA DA IMPLEMENTARE, and the remainder rests on the 140 tests that pass today. Reporting specified work as covered would be false progress under section 31.5.",
      "classification": "OBSERVATION",
      "source_ref": "docs/architecture/RUNTIME_BLUEPRINT.md section 22",
      "verified_at": "2026-08-18T13:48:55Z"
    }
  ],
  "assumptions": [
    {
      "statement": "Persistence, transport and artifact storage remain undecided; the contracts are written to survive any of the proposed choices.",
      "validation": "ADR-RUN-01 through ADR-RUN-06 are recorded as proposed, not decided, in RUNTIME_BLUEPRINT.md section 12.",
      "expiry": null
    },
    {
      "statement": "The loop detector is an early-warning signal, not a security control, and must receive no mitigation credit in the risk register.",
      "validation": "The thresholds are pinned by executable tests so a later session cannot retune them silently.",
      "expiry": null
    }
  ],
  "decisions_proposed": [
    {
      "decision_id": "DEC-RUN-001-DEPTHGUARD-DEFAULTS",
      "proposal": "Fix DepthGuard defaults at depth 3, fan-out 5 and 25 active tasks, not modifiable by agents.",
      "owner": "Christian",
      "gate": "owner approval"
    },
    {
      "decision_id": "DEC-RUN-002-NO-L5",
      "proposal": "Keep L5 Broad Autonomy unrepresentable in the type system.",
      "owner": "Christian",
      "gate": "owner approval"
    }
  ],
  "artifacts": [
    {
      "ref": "docs/architecture/RUNTIME_BLUEPRINT.md",
      "sha256": "a0be04069692d89399eefe183d489d8ad8bea472c232444676883331c23c2538",
      "media_type": "text/markdown",
      "data_class": "C1",
      "summary": "Provider-neutral runtime blueprint. Part I (sections 0-15): AgentManifest, TeamSpec, Supervisor, DepthGuard, RunLedger, six proposed ADRs. Part II (sections 16-22, added session 5): task decomposition, agent selection, provider-neutral routing and HUMAN_BRIDGE, inter-agent conflicts, zero-cost local fallback, minimal end-to-end demo, and a traceability map of the 24 required points."
    },
    {
      "ref": "packages/contracts/src/runtime/agent-manifest.ts",
      "sha256": "0401bf8c364cad5e6f8d430c84a4dc1b66e3b5420e7e2834e88e2a891ebb5b26",
      "media_type": "application/typescript",
      "data_class": "C1",
      "summary": "Runtime contract module 'agent-manifest': provider-neutral TypeScript types compiled under strict mode."
    },
    {
      "ref": "packages/contracts/src/runtime/checkpoint.ts",
      "sha256": "21df12f40d2ffe93e672ed95a13d3ca1125fcd0dad05abfd967b41b2d9612fce",
      "media_type": "application/typescript",
      "data_class": "C1",
      "summary": "Runtime contract module 'checkpoint': provider-neutral TypeScript types compiled under strict mode."
    },
    {
      "ref": "packages/contracts/src/runtime/common.ts",
      "sha256": "86baa7e4050a252f5d4650be35753585ae4f1bd3733691a8b4ba31ef70919c51",
      "media_type": "application/typescript",
      "data_class": "C1",
      "summary": "Runtime contract module 'common': provider-neutral TypeScript types compiled under strict mode."
    },
    {
      "ref": "packages/contracts/src/runtime/depth-guard.ts",
      "sha256": "515b8a9f36fa3fae9594552d30a58bc33bf52d155d6b29fe45e7f01bdcca19b7",
      "media_type": "application/typescript",
      "data_class": "C1",
      "summary": "Runtime contract module 'depth-guard': provider-neutral TypeScript types compiled under strict mode."
    },
    {
      "ref": "packages/contracts/src/runtime/envelopes.ts",
      "sha256": "1e3f94558b69abd2852f2c8d5af3691db4d31a9ca947ae7d093581ec4a483b79",
      "media_type": "application/typescript",
      "data_class": "C1",
      "summary": "Runtime contract module 'envelopes': provider-neutral TypeScript types compiled under strict mode."
    },
    {
      "ref": "packages/contracts/src/runtime/index.ts",
      "sha256": "08e06bde8eb51ab1ac9636a1bebfae12c6bd373643ba1c77180b1da64b85de1a",
      "media_type": "application/typescript",
      "data_class": "C1",
      "summary": "Runtime contract module 'index': provider-neutral TypeScript types compiled under strict mode."
    },
    {
      "ref": "packages/contracts/src/runtime/run-ledger.ts",
      "sha256": "e40c5004152b7bdcb150b26effff634f73a9356f45fe25605b8b2d58959314a7",
      "media_type": "application/typescript",
      "data_class": "C1",
      "summary": "Runtime contract module 'run-ledger': provider-neutral TypeScript types compiled under strict mode."
    },
    {
      "ref": "packages/contracts/src/runtime/supervisor.ts",
      "sha256": "d9d4078c69fd1dfede055571c546d0b3ca092bd14a1807eab6eb16d99dd72779",
      "media_type": "application/typescript",
      "data_class": "C1",
      "summary": "Runtime contract module 'supervisor': provider-neutral TypeScript types compiled under strict mode."
    },
    {
      "ref": "packages/contracts/src/runtime/team-spec.ts",
      "sha256": "d5a6e5adb50d0cdff3d920ce7dd20dacbef8d8012659f129723d64411653f9ff",
      "media_type": "application/typescript",
      "data_class": "C1",
      "summary": "Runtime contract module 'team-spec': provider-neutral TypeScript types compiled under strict mode."
    },
    {
      "ref": "packages/contracts/package.json",
      "sha256": "3c085ad42466251192a5ecfa7ee71750bd6825d4f5cb6fa56df0c257c4f3980a",
      "media_type": "application/json",
      "data_class": "C1",
      "summary": "Contracts package manifest used to typecheck and build the runtime contracts."
    },
    {
      "ref": "packages/contracts/tsconfig.json",
      "sha256": "d438c3e078c5acc567c703f7d1c119d17d9b135810acd22cd0b5c8013415a5fe",
      "media_type": "application/json",
      "data_class": "C1",
      "summary": "Strict TypeScript configuration (strict plus six extra flags) for the contracts package."
    },
    {
      "ref": "tests/contracts/runtime-invariants.test.mjs",
      "sha256": "0f9afe37ab686a02d80d0092bf081fcb4daec1195c32d59e55679c91a9cbabf0",
      "media_type": "application/javascript",
      "data_class": "C1",
      "summary": "34 executable invariant tests, including pinned loop-detector similarity measurements and the idempotency-key collision regression."
    },
    {
      "ref": "docs/threat-models/RUNTIME_THREAT_NOTES.md",
      "sha256": "b84a9a721c5544df9ad1b84e48760a2382783eed3556a7b0c60ba2a6d34bdb60",
      "media_type": "text/markdown",
      "data_class": "C1",
      "summary": "Twelve runtime threats recorded as input to UJ-SEC-001."
    },
    {
      "ref": "docs/program/handoffs/HANDOFF-UJ-RUN-001.md",
      "sha256": "5b943a125bddfb70659daadceda7609527fed464d1ff9f1fb26c88887e7c5e45",
      "media_type": "text/markdown",
      "data_class": "C1",
      "summary": "Handoff and resume point for UJ-RUN-001."
    }
  ],
  "verification": {
    "checks_run": [
      "npx tsc -p packages/contracts --noEmit",
      "npx tsc -p packages/contracts",
      "node --test tests/contracts/runtime-invariants.test.mjs",
      "node --test across the full tests/contracts suite",
      "sha256sum of the canonical master prompt",
      "sha256 of every cited artifact recomputed from the bytes at source_commit_sha",
      "vendor-token scan of packages/contracts/src/runtime for provider neutrality",
      "NUL-byte scan of every runtime contract source",
      "negative control: the new injectivity test run against the previous implementation",
      "coverage count of the 24 required runtime points against the blueprint text"
    ],
    "passed": [
      "typecheck exit 0",
      "build exit 0",
      "runtime invariants 36/36",
      "full contract suite 140/140",
      "canonical prompt hash unchanged (a3fcdfc9...a69a87)",
      "15/15 artifact hashes reproduced at source_commit_sha",
      "no vendor identifier in any normative position; the only matches are authorship headers",
      "0 NUL bytes across all runtime contract sources",
      "negative control failed as required (expected false, actual true), so the test can fail",
      "24 of 24 requirements mapped to a section; gaps found and closed rather than declared absent"
    ],
    "failed": [],
    "not_run": [
      "The 24 proofs specified in sections 16-22 (decomposition, selection, routing, conflicts, fallback, end-to-end demo). They are specified, not implemented: no runtime exists yet, and they belong to M2/M3 under UJ-RCV-001.",
      "Runtime implementation tests: UJ-RUN-001 delivers blueprint and contracts only; implementation is M2/M3.",
      "Cross-provider interoperability: no second provider runtime exists yet."
    ]
  },
  "side_effects": [
    {
      "classification": "INTERNAL_WRITE",
      "description": "Artifacts committed to the CLAUDE working branch only. No write to main, no merge, no deployment, no external call.",
      "approval_ref": null,
      "idempotency_key": "UJ-IDEMP-RUN-001-CLAUDE-RESPONSE",
      "proof_ref": "docs/program/handoffs/HANDOFF-UJ-RUN-001.md"
    }
  ],
  "risks": [
    {
      "risk_id": "R-001",
      "event": "CasActiveTaskCounter cannot be implemented as designed.",
      "severity": "MEDIUM",
      "trigger": "UJ-INF-001 selects a datastore without a conditional update or compare-and-set primitive.",
      "mitigation": "Treat compare-and-set as a hard requirement on the storage decision, or rewrite the counter behind the same interface.",
      "owner": "GEMINI"
    },
    {
      "risk_id": "R-002",
      "event": "The loop detector is credited as a security control it cannot provide.",
      "severity": "MEDIUM",
      "trigger": "A risk register counts INTENT_REPEAT or OUTPUT_STAGNATION as mitigation.",
      "mitigation": "Measured evasion is pinned in tests and the detector is documented as early warning only; containment comes from structural limits.",
      "owner": "CLAUDE"
    }
  ],
  "task_ledger_delta": [
    {
      "task_id": "UJ-RUN-001",
      "previous_status": "READY",
      "proposed_status": "REVIEW",
      "weight": 13,
      "accepted_weight_before": 0,
      "proposed_accepted_weight": 0,
      "proof_refs": [
        "docs/architecture/RUNTIME_BLUEPRINT.md",
        "packages/contracts/src/runtime/agent-manifest.ts",
        "packages/contracts/src/runtime/checkpoint.ts",
        "packages/contracts/src/runtime/common.ts",
        "packages/contracts/src/runtime/depth-guard.ts",
        "packages/contracts/src/runtime/envelopes.ts",
        "packages/contracts/src/runtime/index.ts",
        "packages/contracts/src/runtime/run-ledger.ts",
        "packages/contracts/src/runtime/supervisor.ts",
        "packages/contracts/src/runtime/team-spec.ts",
        "packages/contracts/package.json",
        "packages/contracts/tsconfig.json",
        "tests/contracts/runtime-invariants.test.mjs",
        "docs/threat-models/RUNTIME_THREAT_NOTES.md",
        "docs/program/handoffs/HANDOFF-UJ-RUN-001.md"
      ]
    }
  ],
  "remaining_work": {
    "weight": 13,
    "blockers": [
      "Independent review by GEMINI has not been performed.",
      "The 24 proofs specified in blueprint sections 16-22 are not implemented; they require a runtime (M2/M3)."
    ],
    "next_action": "GEMINI reviews the blueprint and contracts against AC-01 through AC-04 and issues a ReviewResult."
  },
  "confidence": {
    "level": "HIGH",
    "reason": "Every cited artifact is committed and hashed from the exact bytes at the stated commit, and every claimed check was executed in this session rather than recalled."
  },
  "policy_attestation": {
    "no_secret_values": true,
    "no_paid_api": true,
    "no_billing_enabled": true,
    "no_consumer_ui_automation": true,
    "no_heavy_local_inference": true,
    "within_data_class": true,
    "within_side_effect_limit": true
  },
  "handoff": {
    "target": "GEMINI",
    "next_action": "Review UJ-RUN-001 against AC-01 through AC-04 and return a ReviewResult; accepted weight stays 0/13 until then.",
    "resume_point": "Artifacts are committed on branch claude/claude-md-resume-point-tvej1u at source_commit_sha 8ed53286ea805118d26c9a27caf4281904cf7fbe. Blueprint part II (sections 16-22) closes the six requirements that previously had no section. AC-05 is satisfied by this packet; AC-01 through AC-04 await the named reviewer. Per-criterion evidence is in docs/program/packets/UJ-RUN-001-AC-EVIDENCE.md, because the response-packet schema has additionalProperties:false and no per-criterion field."
  }
}
=== END RESPONSE PACKET ===

=== REVIEW RESULT: UJ-INT-006 ===
{
  "schema_version": "ultrajarvis.review-result/v1",
  "review_id": "UJ-REVIEW-INT-006-CLAUDE-20260817",
  "created_at": "2026-08-17T11:07:13Z",
  "repository": {
    "full_name": "carnascialichristian-wq/ultraJARVIS",
    "commit_sha": "31f31b99ad7e63bf581161ce9cd12b11f83a945f"
  },
  "task_id": "UJ-INT-006",
  "task_owner": "CHATGPT",
  "reviewer": {
    "ai_id": "CLAUDE",
    "product": "Claude Code"
  },
  "artifacts_reviewed": [
    {
      "ref": "schemas/mission-packet.schema.json",
      "sha256": "fb954f97ea29a3fd2c29a443f88570c3ffe6745bbd8757d6e24d60acf1b9a5f6"
    },
    {
      "ref": "schemas/delegation-card.schema.json",
      "sha256": "68214a339eeca40df2147899927b207e0a1427fba6611d81c520b11c4a40516c"
    },
    {
      "ref": "schemas/response-packet.schema.json",
      "sha256": "ee44e1b7e262bc0817e0b4f65de8830d122687618a59774fdabfddf3b7e69c0a"
    },
    {
      "ref": "schemas/synthesis-packet.schema.json",
      "sha256": "be822ca00d2340fd03a1e7a812af3d31a0b03360ceadf69e0ca3ff5d3438ddf6"
    },
    {
      "ref": "schemas/review-result.schema.json",
      "sha256": "415255ac46ee83ad564c1cacd8df4e5c6f8789a8769fb2a86b5ee5de63c2c03b"
    },
    {
      "ref": "scripts/validate-council-packets.mjs",
      "sha256": "7b88f6819cedccb3baf7cb03a0358f0ec652d99837261db9a4a313c49acdbfb8"
    },
    {
      "ref": "scripts/test-review-result-intake.mjs",
      "sha256": "d0c80de304d57374211527ae5862f4c44f53bc09266c9562f19ae8413deb604c"
    },
    {
      "ref": "scripts/validate-program-os.mjs",
      "sha256": "6b26aafa35c3afce8a9741d8ff6134babce2b2b6fca8a935bdc1bbd402216ca9"
    },
    {
      "ref": "docs/program/COUNCIL_IMPORT_AND_MERGE.md",
      "sha256": "eca043d462f0fa38b02389a14dbd152dd7cab8b44d201301723235919b39e3db"
    },
    {
      "ref": "docs/program/BACKLOG.json",
      "sha256": "4bb1f131592318522e50177c68bd871e96edc306f6f935253c631b969a3004d9"
    },
    {
      "ref": "docs/program/RESUME_POINT.md",
      "sha256": "acdb1cd785e9605f66e266aa6d9be7413d2bd06d1f297764ff57f0b023610d38"
    },
    {
      "ref": "docs/program/STATUS.md",
      "sha256": "4dccf507b609690211dc915f227ad6c5bf8d9a5e8e7eb8ca401beb85a0883a5a"
    },
    {
      "ref": "prompts/council/missions/UJ-MISSION-M0-COUNCIL-001.json",
      "sha256": "af366d043b99b1e71ad926c3b5db8b9845c202d20be3e78cb39f53d4284e09bb"
    },
    {
      "ref": "prompts/delegation-cards/UJ-RUN-001-CLAUDE.json",
      "sha256": "8411f23f3e57e4b4f0263068b68e3f41de7842fe1bef0188aeb3ab88cc8b251e"
    },
    {
      "ref": "prompts/delegation-cards/UJ-CAP-001-GEMINI.json",
      "sha256": "0d33bb27e1afc7a6af67cd79cf29e1a098c47d6788911a99dc3bfcb7a6b82597"
    },
    {
      "ref": "prompts/delegation-cards/UJ-GGL-001-GEMINI.json",
      "sha256": "d6a5faa06362c78a3416cccea89d9842a86ae70bcff718008f550503f1fe4ef5"
    },
    {
      "ref": "prompts/delegation-cards/UJ-RED-001-GROK.json",
      "sha256": "9ff0418a8c0dff4fa107df47f6a203cd75c0fca87ea70b0a540de319d4c5d01e"
    },
    {
      "ref": "prompts/review-requests/UJ-INT-006-CLAUDE.md",
      "sha256": "f257eacd6f0a08665c3e38e0badca22a993542afee109affc6ef152d85eb4582"
    }
  ],
  "outcome": "PASS_WITH_ACTIONS",
  "criteria": [
    {
      "criterion_id": "AC-01",
      "result": "PASS",
      "evidence_refs": [
        "schemas/mission-packet.schema.json",
        "schemas/delegation-card.schema.json",
        "schemas/response-packet.schema.json",
        "schemas/synthesis-packet.schema.json",
        "schemas/review-result.schema.json",
        "prompts/council/missions/UJ-MISSION-M0-COUNCIL-001.json",
        "prompts/delegation-cards/UJ-RUN-001-CLAUDE.json",
        "prompts/delegation-cards/UJ-CAP-001-GEMINI.json",
        "prompts/delegation-cards/UJ-GGL-001-GEMINI.json",
        "prompts/delegation-cards/UJ-RED-001-GROK.json"
      ],
      "note": "All five Council schemas are JSON Schema 2020-12 with stable $id, explicit schema_version and additionalProperties:false at every object node (audited recursively: zero open objects across all 7 schemas in tree). ResponsePacket.status enum is REVIEW|BLOCKED|FAILED, so a specialist self-proposing DONE is unrepresentable rather than merely forbidden - the same irrepresentability technique used for L5 in the runtime contracts. Verified directly on all four cards: HUMAN_BRIDGE-only, incremental_cost_eur 0, direct_main_write false, autonomy L2, task_snapshot.accepted_weight 0, expires_at after created_at, reviewer matching BACKLOG.json. Mission ceilings are C1/L2/INTERNAL_WRITE with billing_allowed and paid_api_allowed false."
    },
    {
      "criterion_id": "AC-02",
      "result": "FAIL",
      "evidence_refs": [
        "scripts/validate-council-packets.mjs",
        "docs/program/COUNCIL_IMPORT_AND_MERGE.md",
        "scripts/test-review-result-intake.mjs"
      ],
      "note": "The criterion text names 'replay' among the regression classes the validator must pass. It does not. COUNCIL_IMPORT_AND_MERGE.md stage 5 requires exact replay to be a no-op and divergent replay to be rejected as REPLAY_DIVERGENCE, and the doc specifies a (packet_id, idempotency_key, sha256, received_at, disposition) store. The validator is stateless: idempotency uniqueness is checked only across the four delegation-card files (lines 412-414), never for imported ReviewResults. Reproduced at this ref: importing review_id UJ-REVIEW-SAME-ID twice byte-identically passed twice, and a third import reusing the same review_id with different bytes also PASSED instead of raising REPLAY_DIVERGENCE. test-review-result-intake.mjs covers 7 cases, none of which is a replay case. Defect is additive and correctable; the rest of AC-02 is strong (19 of 20 adversarial candidates rejected)."
    },
    {
      "criterion_id": "AC-03",
      "result": "PASS",
      "evidence_refs": [
        "docs/program/reviews/UJ-REVIEW-INT-006-CLAUDE.json",
        "docs/program/reviews/UJ-INT-006-CLAUDE-FINDINGS.md"
      ],
      "note": "This document is that evidence-backed PASS_WITH_ACTIONS review, issued by CLAUDE at the verified head 31f31b99. Recorded with a caveat as F-003: the criterion is self-referential - it is satisfied by the act of reviewing rather than by any property of the reviewed artifact, so it conveys no independent information and structurally biases toward acceptance."
    }
  ],
  "findings": [
    {
      "finding_id": "F-001",
      "severity": "HIGH",
      "description": "Evidence sufficiency is never checked, only evidence authenticity. validateImportedReview hashes each entry of artifacts_reviewed (minItems 1) but never requires those entries to intersect the reviewed task's own acceptance_criteria[].proof_refs, and criteria[].evidence_refs are free strings checked only for length>0. Reproduced at this ref: a ReviewResult for UJ-INT-006 citing README.md as its sole artifact - a file unrelated to the task - with evidence_refs 'looks fine' / 'trust me' / '.' and an empty findings array, validated PASS and awarded the full 8 units with proposed_task_status DONE. Every check the importer performs was satisfied; the review was hollow. This is TH-10 (proof fabrication) from THREAT_MODEL.md reappearing in the Council layer: the pipeline proves a reviewer touched a file, not that the reviewer examined the work.",
      "required_action": "Require, for every criterion marked PASS, that artifacts_reviewed covers that criterion's proof_refs from BACKLOG.json (empty proof_refs exempt), and that each evidence_refs entry resolves to an existing repository path through the same resolveRepositoryFile guard already used for artifacts. Add a regression case asserting that a review citing an unrelated file cannot reach DONE."
    },
    {
      "finding_id": "F-002",
      "severity": "MEDIUM",
      "description": "The replay and idempotency ledger specified in COUNCIL_IMPORT_AND_MERGE.md (stage 5, rejection code REPLAY_DIVERGENCE, and the 'Replay and idempotency' section) has no implementation. The validator holds no state across invocations, so a reused review_id carrying different bytes is admitted rather than rejected as tampering, and an exact replay re-runs full admission instead of returning the original disposition. The specification and the executable diverge, and the specification is the artifact a reader will trust.",
      "required_action": "Either implement the disposition store and add divergent-replay and exact-replay regression cases to test-review-result-intake.mjs, or mark stage 5 and REPLAY_DIVERGENCE explicitly as SPECIFIED_NOT_IMPLEMENTED in COUNCIL_IMPORT_AND_MERGE.md and remove 'replay' from the AC-02 text until it is backed."
    },
    {
      "finding_id": "F-003",
      "severity": "MEDIUM",
      "description": "AC-03 of UJ-INT-006 reads 'CLAUDE issues an evidence-backed PASS or PASS_WITH_ACTIONS review.' The task's own acceptance criterion is the reviewer's verdict, not a property of the delivered artifact. It is therefore satisfied by the act of accepting and cannot be evaluated independently: a reviewer inclined to award weight finds one of three criteria pre-satisfied by that decision. It also makes FAIL structurally awkward, since a FAIL verdict falsifies the criterion that requested it. The same shape appears in the validator's own regression expectations, where UJ-INT-001's reviewer is asserted to be GROK.",
      "required_action": "Restate AC-03 as a property of the artifact rather than of the review, for example 'every acceptance criterion carries reproducible proof refs resolvable at the reviewed commit'. Keep the requirement for an independent review as a task transition rule, where it already lives, not as an acceptance criterion of the work."
    },
    {
      "finding_id": "F-004",
      "severity": "MEDIUM",
      "description": "Every safety guarantee of the intake lives in scripts/validate-council-packets.mjs, not in the schemas: reviewer independence from task_owner, accepted_weight_before matching the ledger, the all-or-nothing weight rule, DONE requiring all criteria PASS, and commit pinning are code assertions. review-result.schema.json carries no cross-field allOf/if-then at all, so a consumer validating with any standard JSON Schema tool - a different importer, another AI, a future service - accepts a self-review by the task owner that awards partial weight on a FAIL. The portable artifact is the one that looks authoritative and enforces nothing.",
      "required_action": "Encode the cheap invariants in the schema itself as if/then (FAIL or PASS_WITH_ACTIONS implies accepted_weight_after equals accepted_weight_before; proposed_task_status DONE implies outcome PASS), and state explicitly in COUNCIL_PACKETS.md that schema validity is necessary but not sufficient and that the script is the normative gate."
    },
    {
      "finding_id": "F-005",
      "severity": "LOW",
      "description": "ResponsePacket.policy_attestation requires all seven fields with const:true, so a packet disclosing an actual violation - for instance no_paid_api false after an accidental paid call - cannot be represented and fails schema validation. The attestation is therefore unfalsifiable: every packet that validates attests full compliance, so the field cannot distinguish a compliant sender from a non-compliant one, and an honest disclosure is converted into a parse error, which pressures the sender toward silence or a false attestation.",
      "required_action": "Allow boolean values with a rule that any false attestation forces status BLOCKED or FAILED and routes to quarantine, so a violation is reportable in-band and visibly handled instead of being unrepresentable."
    },
    {
      "finding_id": "F-006",
      "severity": "LOW",
      "description": "The delegation card UJ-CARD-RUN-001-CLAUDE budgets max_model_calls 1 and max_tool_calls 40 for UJ-RUN-001, a 13-unit task. Reported as direct execution evidence rather than as an estimate: this session's portfolio already delivered UJ-RUN-001 (runtime blueprint, 9 contract files, 34 tests) and it required far more than one model call and more than 40 tool calls. The budget as written would halt the card mid-task, and because the card is HUMAN_BRIDGE the halt would surface as an unexplained stop to Christian rather than as a budget event.",
      "required_action": "Recalibrate call_budget against observed effort for comparable tasks, or define the budget as a checkpoint-and-resume threshold rather than a hard ceiling, so exhausting it produces a resumable BLOCKED state instead of an abandoned task."
    }
  ],
  "policy_checks": {
    "zero_cost": "PASS",
    "data_class": "PASS",
    "side_effect": "PASS",
    "secret_handling": "PASS",
    "consumer_ui_automation": "PASS"
  },
  "accepted_weight_before": 0,
  "accepted_weight_after": 0,
  "proposed_task_status": "REVIEW",
  "next_action": "ChatGPT to resolve F-001 and F-002, which are the two that keep UJ-INT-006 from PASS; F-003 requires restating AC-03 before this task can be accepted on evidence rather than on the reviewer's verdict. Accepted weight stays 0/8 until a re-review at the corrected ref confirms the actions."
}
=== END REVIEW RESULT ===

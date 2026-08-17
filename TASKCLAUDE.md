# TASKCLAUDE.md — rapporto di CLAUDE per ChatGPT, Gemini e Grok

> **A chi si rivolge questo file.** Alle altre tre IA del programma ultraJARVIS.
> Non è il mio diario — quello è `CLAUDE.md`. Qui c'è **ciò che dovete sapere per
> lavorare senza duplicare, senza contraddirmi e senza ripetere i miei errori**:
> cosa ho prodotto, dove sta, quali contratti dovete consumare, quali problemi ho
> incontrato e come li ho risolti, e cosa mi serve da voi.
>
> Se leggete una sola sezione, leggete la **§4 — Scoperte che cambiano il vostro lavoro**.

| Metadato | Valore |
|---|---|
| Autore | CLAUDE — Runtime, Security & Skill Architect |
| Destinatari | CHATGPT (Chief Integrator), GEMINI (Google/Capability), GROK (Falsification/Risk) |
| Branch | `claude/ultrajarvis-repo-analysis-li6vvj` |
| Ultimo aggiornamento | 2026-08-17 — sessione 2 |
| File gemello | `CLAUDE.md` (continuità interna di CLAUDE) |

---

## 1. Stato del mio portafoglio in una tabella

| Task | Peso | Stato | Reviewer | Vi riguarda? |
|---|---:|---|---|---|
| UJ-RUN-001 — Runtime blueprint | 13 | **REVIEW** | **GEMINI** | **Gemini deve revisionarlo** |
| UJ-SEC-001 — Threat model, approval policy, critica Costituzione | 13 | **REVIEW** | **GROK** | **Grok deve revisionarlo** |
| UJ-CLD-001 — Verifica Claude Pro/Code/SDK/OAuth | 8 | IN_PROGRESS (2/8) | GEMINI | Gemini incrocia con UJ-CAP-001 |
| UJ-RCV-001 — Checkpoint/retry/recovery | 8 | READY | ChatGPT | — |
| UJ-SKL-001 — Skill Forge | 13 | **READY** (sbloccato) | ChatGPT | — |
| UJ-MCP-001 — ToolManifest e MCP admission | 8 | **READY** (sbloccato) | GEMINI | prossimo che prendo |
| UJ-REV-001 — Review del Program OS | 5 | **BLOCKED: aspetto ChatGPT** | Christian | **ChatGPT mi blocca** |
| UJ-REV-002 — Security review Website Team | 8 | **BLOCKED: aspetto ChatGPT** | GROK | **ChatGPT mi blocca** |

**Progresso onesto:** 0/76 accettato, 24/76 proposto. Nessun task DONE.
`completed_weight` resta 0 finché un reviewer non accetta (§7.3): non mi auto-assegno peso.
**ETA: UNKNOWN** — manca velocity su due cicli (§7.4). Non chiedetemi una data.

---

## 2. Cosa ho prodotto e dove

| File | Cosa contiene | Chi lo deve leggere |
|---|---|---|
| `docs/architecture/RUNTIME_BLUEPRINT.md` | blueprint completo del runtime, 15 sezioni | **tutti** |
| `packages/contracts/src/runtime/` (9 file `.ts`) | contratti TypeScript provider-neutral | ChatGPT, Gemini |
| `tests/contracts/runtime-invariants.test.mjs` | 34 test eseguibili, tutti verdi | Gemini (review), Grok (attacco) |
| `docs/threat-models/RUNTIME_THREAT_NOTES.md` | 12 minacce con rischio residuo esplicito | **Grok** |
| `docs/program/evidence/UJ-CLD-001-SOURCE-MANIFEST.md` | 20 fonti ufficiali candidate | **Gemini** |
| `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` | task delta, handoff, resume point | ChatGPT |
| `docs/threat-models/THREAT_MODEL.md` | 19 minacce, 15 difese con stato reale | **Grok** |
| `docs/constitution/APPROVAL_POLICY.md` | matrice di approvazione, 10 override, anti-fatigue | **tutti** |
| `docs/constitution/CONSTITUTION_CRITIQUE.md` | 3 lacune strutturali, 12 emendamenti proposti | **Grok**, Christian |
| `packages/contracts/src/policy/` | policy engine eseguibile | ChatGPT, Gemini |
| `docs/program/handoffs/HANDOFF-UJ-SEC-001.md` | task delta e handoff di UJ-SEC-001 | ChatGPT |
| `CLAUDE.md` | continuità interna di CLAUDE | nessuno di voi, ma è pubblico |

### Come verificare che il mio lavoro sia vero

Non fidatevi di quello che scrivo. Riproducete:

```bash
cd packages/contracts && npx tsc --noEmit && npx tsc && cd ../..
node --test tests/contracts/runtime-invariants.test.mjs   # atteso 34/34
node --test tests/contracts/approval-policy.test.mjs      # atteso 28/28
```

Atteso: typecheck exit 0, **62 test / 62 pass** in totale. Se non torna, il mio lavoro è
da rifiutare, non da interpretare.

---

## 3. I contratti che dovete consumare

Il livello runtime espone entità tipizzate. Se costruite qualcosa che ci si interfaccia,
**consumate questi tipi invece di reinventarli**, altrimenti divergiamo negli schemi.

| Entità | File | Serve a |
|---|---|---|
| `AgentManifest` | `agent-manifest.ts` | contratto di esistenza di un agente |
| `TeamSpec` | `team-spec.ts` | contratto di un team temporaneo |
| `TaskEnvelope` / `ResultEnvelope` | `envelopes.ts` | comunicazione tipizzata fra agenti |
| `ArtifactRef` | `envelopes.ts` | artifact content-addressed con provenienza |
| `DelegationCard` / `ApprovalCard` | `envelopes.ts` | bridge umano e gate di approvazione |
| `RunEvent` + tassonomia | `run-ledger.ts` | audit append-only con hash chain |
| `Checkpoint`, `RETRY_POLICY` | `checkpoint.ts` | resume, retry, idempotenza |
| `checkSpawn()`, `DEPTH_GUARD_LIMITS` | `depth-guard.ts` | invarianti di ammissione |
| `SupervisorState`, `SUPERVISOR_TRANSITIONS` | `supervisor.ts` | macchina a stati del supervisor |

**Tre proprietà che ho garantito e che vi chiedo di non rompere:**

1. **Nessun nome di provider** compare nei contratti. Se il vostro design richiede che
   il runtime sappia quale IA sta chiamando, è un errore di layering: quella conoscenza
   vive nel Provider Gateway e nel Capability Registry.
2. **Nessun valore di segreto è rappresentabile.** Esistono solo `SecretRef` opachi.
3. **`L5 — Broad Autonomy` non esiste nel type system.** Non è un controllo a runtime
   che si può dimenticare: è irrappresentabile. Se vi serve, serve prima una decisione
   di Christian e una modifica alla Costituzione.

---

## 4. SCOPERTE CHE CAMBIANO IL VOSTRO LAVORO

Questa è la sezione da leggere se ne leggete una sola.

### 4.1 Il loop detector testuale non regge — non attribuitegli mitigazioni

`EXPERIMENT_RESULT`, misurato da me, non ipotizzato:

| Missione | Token cambiati | Similarità Jaccard | Sotto la soglia 0.95? |
|---|---:|---:|---|
| 9 token | 1 | `0.7778` | **sì, evade** |
| 23 token | 1 | `0.9130` | **sì, evade** |

Una singola parola cambiata evade il rilevamento di loop basato sul testo.

**→ GROK:** nel risk register, il loop detector va classificato **early warning**, non
controllo di sicurezza. Se gli assegnate una mitigazione, il register mente. Il
contenimento reale viene dai limiti strutturali (cap 25 task attivi, quota) e da
`TOOL_CYCLE`, che dipende dal comportamento e non dal testo.

**→ CHATGPT:** non contate su questo segnale per la qualità del Program OS.

Ho fissato i numeri in un test proprio perché nessuno possa ritarare la soglia in
silenzio e far sparire il problema.

### 4.2 Bug trovato e corretto — encoding ambiguo della idempotency key

Il costruttore della chiave univa i campi con un separatore grezzo:

```
runId="a b" + taskId="c"    →  stesso materiale hashato
runId="a"   + taskId="b c"  →  stesso materiale hashato
```

Due operazioni **diverse** producevano la **stessa** chiave: la seconda sarebbe stata
scartata come duplicato. È esattamente il guasto che il ledger di idempotenza esiste per
prevenire. Corretto con encoding **length-prefixed**, con test di regressione.

**→ TUTTI:** se progettate una chiave composita — cache, dedup, memoria, artifact id —
usate un encoding **iniettivo** (length-prefix o JSON canonico), mai un separatore
grezzo. È un errore che si nasconde bene e si manifesta come perdita silenziosa di dati.

### 4.3 Il limite che lega davvero non è la profondità

Con depth ≤ 3 e fan-out ≤ 5 l'albero teorico è 156 nodi, ma il cap dei **task atomici
attivi è 25**. Quindi l'ammissione fallisce per saturazione del contatore molto prima
che per profondità.

**Conseguenza implementativa:** il contatore deve essere **atomico** (CAS o transazione),
non read-then-write, altrimenti fan-out concorrenti superano 25 per race condition.
È il punto in cui il DepthGuard si rompe per primo in un'implementazione ingenua.
Test `T-DG-4b`, **non ancora implementato**, priorità **P0**.

### 4.4 Il Supervisor è codice, non un agente-modello

Decisione di design che vi chiedo di contestare adesso se non siete d'accordo, perché
cambiarla dopo costa molto.

> Un supervisor implementato come prompt è manipolabile dagli artifact che deve
> supervisionare. Poiché è l'entità che **applica i limiti**, renderlo influenzabile dal
> contenuto che ispeziona annulla i limiti stessi.

Quindi: state machine deterministica; il modello è un consulente il cui output è un
suggerimento tipizzato, mai un comando.

### 4.5 Due URL ufficiali di supporto sono morti (404)

Durante la raccolta fonti di UJ-CLD-001, due pagine di supporto plausibili sui limiti
d'uso rispondono **404**.

**→ GEMINI:** è la dimostrazione pratica del motivo per cui §4.1 punto 5 vieta di
congelare i limiti numerici nel piano o nel codice. Nel Capability Registry puntate a
fonti **rilette a una data** con `last_verified_at`, non a numeri copiati una volta.
Non reintroducete quegli URL a memoria.

### 4.6 La minaccia peggiore del programma non è un attacco: siamo noi

Da `THREAT_MODEL.md`. **TH-10 — proof fabrication** è `CRITICA` per severità e
**`ALTA` per probabilità**. Non per malizia: produrre un resoconto plausibile di lavoro
non svolto è **il modo di fallire più naturale di un modello linguistico**.

L'effetto è peggiore di quanto sembri: la falsificazione delle prove **disattiva il
controllo umano lasciandolo apparentemente attivo**. Christian continua ad approvare,
ma su dati che non descrivono la realtà.

L'hash chain che ho implementato prova che *un evento è stato registrato*, non che il
fatto registrato sia *vero*. Un agente che scrive `tool.returned` senza aver chiamato
il tool produce una catena **integra e falsa**.

**→ TUTTI, come regola di condotta:** non dichiarate test superati, task DONE,
percentuali o accessi senza prova riproducibile. Io ho tenuto `completed_weight = 0` su
due task consegnati proprio per questo. È scomodo e va fatto lo stesso.

**→ GROK:** questa minaccia va in cima al risk register, sopra ogni rischio tecnico.

### 4.7 Le difese esistenti sono 8 su 15, e le assenti sono le peggiori

Conteggio onesto da `THREAT_MODEL.md` §5: delle 15 difese minime richieste da §17 del
prompt canonico, **8 progettate, 3 parziali, 4 assenti**.

Le quattro assenti — egress deny, sandbox, test di prompt injection, postflight
scanning — sono **tutte concentrate sulle minacce a residuo più alto**. Non è un caso:
sono le difese che richiedono infrastruttura, e l'infrastruttura non è ancora scelta.

**→ GEMINI:** due delle quattro (egress deny, allowlist di rete) dipendono dalla tua
scelta di topologia in `UJ-INF-001`. Non sono un dettaglio operativo: sono difese
mancanti su minacce attive.

### 4.8 La Costituzione è solida nella sostanza e debole nella meccanica

Da `CONSTITUTION_CRITIQUE.md`. Gli articoli 2, 3 e 4 sono scritti come **comportamenti
attesi** dove servirebbero **condizioni verificabili**. L'Articolo 4 usa il verbo
"preferire": è un consiglio, non un vincolo.

Un comportamento atteso da un modello linguistico non è un controllo.

Ho proposto **3 lacune strutturali e 12 emendamenti**, tutti `PROPOSAL` — non ho
modificato nulla, come impone l'Articolo 12. La più importante:

> **Lacuna 1:** se Christian ordina un'azione che viola un articolo, è deroga legittima
> o violazione? Oggi la gerarchia §7.2 mette Costituzione e vincoli del proprietario
> **allo stesso livello 1**, senza ordinarli. Ogni IA deciderà a modo suo — e un
> contenuto ostile che si spaccia per istruzione del proprietario sfrutta esattamente
> questa ambiguità.

**→ TUTTI:** finché Christian non decide, se incontrate questo conflitto **registrate un
`BLOCKER` invece di scegliere da soli**. Una IA che obbedisce e una che rifiuta hanno
entrambe ragione oggi, ed è il problema.

---

## 5. Handoff specifico per ciascuno di voi

### → CHATGPT — Chief Integrator & Program Architect

**Cosa mi serve da te, e mi blocca:**
UJ-REV-001 e UJ-REV-002 (13 unità del mio portafoglio) sono **BLOCKED** perché
dipendono da UJ-INT-001 e UJ-INT-007, che non esistono ancora. Non posso revisionare
un Program OS che non c'è.

**Cosa ti do già pronto:**
- contratti tipizzati e compilanti, utilizzabili come riferimento per UJ-INT-004
  (monorepo foundation): `packages/contracts` è già un package funzionante con
  `typecheck` e `build`;
- tassonomia completa degli eventi RunLedger, se il tuo task ledger deve interoperare;
- `HANDOFF-UJ-RUN-001.md` con task delta già nel formato §7.3.

**Attenzione al confine:** non ho creato PROJECT_STATE, BACKLOG, STATUS, ROADMAP né la
formula di progresso. Sono tuoi. Ho usato la formula §7.4 per il mio delta: **se il tuo
schema differisce, il tuo prevale e mi riallineo**.

**Nota operativa:** il mio branch parte da `main`, non dal branch della tua PR #1, per
non interferire. Cito il prompt canonico per SHA, non lo copio. Quando la PR #1 verrà
mergiata, il mio lavoro non genererà conflitti.

### → GEMINI — Google Ecosystem, Knowledge & Cloud Feasibility

**Compito immediato: sei il reviewer di UJ-RUN-001.**
La checklist è pronta in `RUNTIME_BLUEPRINT.md` §13: 8 controlli di conformità,
14 di completezza, 6 domande dirette in §13.4. Sono binari: un `NO` blocca l'accettazione.

**Dove mi aspetto che tu spinga — e dove pagherei più caro:**
`ADR-RUN-02` (persistenza di ledger e checkpoint) e `ADR-RUN-06` (storage degli artifact
content-addressed) dipendono dalla tua scelta di database in UJ-INF-001/UJ-MEM-001.
Il blueprint è scritto per non dipenderne, ma **se la tua scelta rende impraticabile lo
storage content-addressed degli artifact, dimmelo subito**: è l'assunzione che pagherei
più cara più tardi.

**Ti passo materiale per UJ-CAP-001:**
`docs/program/evidence/UJ-CLD-001-SOURCE-MANIFEST.md` contiene 20 fonti ufficiali
Anthropic già controllate per raggiungibilità, con il template di Capability Record e il
gate di ammissibilità §6.2 pronti da compilare. **Non ho affermato nessun fatto** sui
piani: solo che certi URL rispondono, in data 2026-08-17. Il contenuto va letto.

**Vincolo che rispetto e che ti chiedo di verificare:** il fatto che una sessione Claude
Code operi con accesso a repository **non** prova che un'app ultraJARVIS di terze parti
possa ottenere lo stesso accesso. Sono due Capability Record distinti. Finché Q1–Q4 di
UJ-CLD-001 non hanno risposta documentata, l'accesso automatico Claude resta **BLOCKED**.

### → GROK — Falsification, Risk & Alternatives

**Ti ho già consegnato una mia difesa falsificata** (§4.1): il loop detector testuale è
aggirabile con una parola, misurato. Non trattarlo come mitigazione.

**Input pronto:** `docs/threat-models/RUNTIME_THREAT_NOTES.md`, 12 minacce ciascuna con
il **rischio residuo esplicito** — non ho nascosto i buchi. Più 5 rischi già formulati
con owner: `R-RUN-01` … `R-RUN-05`, di cui tre ad alta severità e **senza mitigazione
implementata**.

**La domanda che ti giro esplicitamente** (threat notes §3.4):

> Il runtime assume che *codice deterministico + limiti verificati all'admission* bastino
> a contenere un modello persuaso. Due punti assottigliano l'assunzione: i limiti sono
> verificati **a un solo istante**, e lo schema garantisce la **forma** ma non la
> **verità** del contenuto.
> **Esiste una catena che, senza violare nessuna invariante, produce un effetto che
> Christian non avrebbe approvato?** Se sì, è più grave di ogni singola minaccia elencata.

**Attacca anche:** §13.4 domande 4 e 6 del blueprint, e sarò il reviewer di UJ-RSK-001.

**AGGIORNAMENTO — sei ora reviewer anche di UJ-SEC-001.** Materiale pronto:

| File | Cosa attaccare |
|---|---|
| `docs/threat-models/THREAT_MODEL.md` | 19 minacce, residui espliciti, 3 affermazioni che ho messo in §7 perché tu le falsifichi |
| `docs/constitution/APPROVAL_POLICY.md` | 10 override eseguibili; §7 elenca 5 limiti che ho dichiarato io |
| `docs/constitution/CONSTITUTION_CRITIQUE.md` | 12 emendamenti proposti; §5 contiene 3 domande dirette a te |

**Tre domande su cui ti chiedo esplicitamente di contraddirmi:**

1. La **clausola di emergenza** che propongo per l'Articolo 12 è un rischio più che una
   difesa? L'ho già segnalata come la più pericolosa delle mie proposte, perché una
   valvola di sfogo è precisamente ciò che un sistema mal allineato userebbe per
   aggirare le regole. **Se hai un percorso di abuso, la ritiro.**
2. Rendere gli Articoli 1 e 2 **non derogabili nemmeno da Christian** è corretto, o
   rende il sistema inutilizzabile in un caso reale che non ho previsto?
3. Diverse mie proposte sanciscono requisiti che il sistema **non sa ancora soddisfare**
   (revoca a cascata, postflight scanning, sandbox). Sanzionare in Costituzione un
   requisito non soddisfacibile crea una violazione permanente e normalizzata. Meglio
   approvarli ora come obiettivo o dopo l'implementazione? Ho una preferenza — ora — ma
   il mio giudizio è **di parte**, perché l'implementazione tocca poi a me.

**Nuovi rischi che ti passo per UJ-RSK-001:** `R-SEC-01` e `R-SEC-02` sono `CRITICA`
senza mitigazione implementata; `R-SEC-03` e `R-SEC-04` sono aperti.

---

## 6. Problemi tecnici che ho incontrato — per non ripeterli

Non sono aneddoti: sono trappole dell'ambiente che colpiranno anche voi.

| Problema | Sintomo | Soluzione |
|---|---|---|
| Working directory di Bash persiste fra chiamate | test "file non trovato" pur essendo presente | usare path assoluti o `cd` esplicito ogni volta |
| Forzare una versione di tool già presente | `npm error could not determine executable to run` | usare il tool dell'ambiente (`npx tsc`) |
| Test runner con directory | `Cannot find module` | passare il path del **file** di test |
| `grep` per i byte NUL | falso positivo: `$'\x00'` in bash diventa stringa vuota e matcha ogni riga | usare `perl -ne 'print if /\x00/'` |
| Sorgente committato come binario | `Bin 0 -> 8349 bytes` nel diff | **fermarsi e indagare**: è un sintomo, non un dettaglio estetico. Nel mio caso nascondeva un bug reale |
| Flag TS strict rivelano import morti | `TS6133` dopo una rimozione | eseguire il typecheck **dopo ogni** modifica, non solo alla fine |

---

## 7. Regole di condotta che applico e che vi propongo

Derivano dal prompt canonico, ma le ho rese operative e le rispetto in modo verificabile:

1. **Nessun peso auto-assegnato.** `completed_weight = 0` finché un reviewer non accetta.
2. **Nessun ETA senza velocity** su due cicli comparabili. Altrimenti `ETA UNKNOWN`.
3. **Nessun test dichiarato superato senza averlo eseguito.** Comando ed esito, non memoria.
4. **Gli errori si scrivono.** Il mio session log in `CLAUDE.md` elenca 7 errori di una
   sola sessione, incluso uno che ha smentito il mio design.
5. **Quando un test smentisce il design, il difetto è nel design.** Non si ritara la
   soglia per far passare l'asserzione.
6. **I confini di portafoglio si rispettano.** Non ho creato artefatti vostri, nemmeno
   quando sarebbe stato comodo.
7. **Niente fatti non verificati** su piani, prezzi, quote o accessi.

---

## 8. Storico degli aggiornamenti di questo file

| Data | Sessione | Cosa è cambiato |
|---|---|---|
| 2026-08-17 | `UJ-CLAUDE-2026-08-17-02` | creazione; consegna di UJ-RUN-001 in REVIEW, scoperte §4.1 e §4.2, handoff alle tre IA |
| 2026-08-17 | `UJ-CLAUDE-2026-08-17-02` | consegna di **UJ-SEC-001** in REVIEW; aggiunte §4.6 (proof fabrication), §4.7 (8 difese su 15), §4.8 (Costituzione); Grok è ora reviewer anche di UJ-SEC-001 con 3 domande dirette; UJ-SKL-001 e UJ-MCP-001 sbloccati; proposto `UJ-SEC-002` a ChatGPT |

*(Regola 2 di `CLAUDE.md`: questo file va esteso a fine di ogni task, non riscritto.)*

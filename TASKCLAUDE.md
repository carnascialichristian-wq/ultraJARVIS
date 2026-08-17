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
| UJ-CLD-001 — Verifica Claude Pro/Code/SDK/OAuth | 8 | **REVIEW** (7/8) | **GEMINI** | **Gemini deve revisionarlo e inglobarlo in UJ-CAP-001** |
| UJ-MCP-001 — ToolManifest e MCP admission | 8 | **REVIEW** | **GEMINI** | **Gemini deve revisionarlo** |
| UJ-RCV-001 — Checkpoint/retry/recovery | 8 | **REVIEW** | **CHATGPT** | **ChatGPT deve revisionarlo** |
| UJ-SKL-001 — Skill Forge | 13 | **REVIEW** | **CHATGPT** | **ChatGPT deve revisionarlo** |
| UJ-REV-001 — Review del Program OS | 5 | **BLOCKED: aspetto ChatGPT** | Christian | **ChatGPT mi blocca** |
| UJ-REV-002 — Security review Website Team | 8 | **BLOCKED: aspetto ChatGPT** | GROK | **ChatGPT mi blocca** |

**Progresso onesto:** 0/76 accettato, 53/76 proposto. Nessun task DONE.

**6 task su 8 sono in REVIEW e aspettano voi.** Il mio portafoglio è **esaurito**:
non c'è altro che io possa iniziare in autonomia. Restano 1 unità di UJ-CLD-001 dietro
un HUMAN_BRIDGE, e 13 unità di review bloccate da deliverable di ChatGPT.

**Tutti e tre i P0 del programma sono chiusi.** Restano due `CRITICA` senza owner
attivo (`R-SEC-01`, `R-SEC-02`): dipendono da `UJ-SEC-002`, che ChatGPT deve accettare.

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
| `docs/architecture/TOOL_PLANE.md` | ToolManifest, 18 regole di admission, ordine P0 | **Gemini** |
| `packages/contracts/src/tools/` | admission eseguibile, P0-1 e P0-2 | Gemini |
| `docs/runbooks/DISASTER_RECOVERY.md` | procedura di ripresa, 9 scenari D1–D9 | **ChatGPT** |
| `packages/contracts/src/recovery/` | contatore atomico e CAS | ChatGPT |
| `docs/architecture/SKILL_FORGE.md` | threat model forge, pipeline 14 stadi, sandbox | **ChatGPT**, Grok |
| `packages/contracts/src/skills/` | Recipe + Skill Forge eseguibili | ChatGPT |
| `docs/program/handoffs/HANDOFF-UJ-MCP-001.md`, `HANDOFF-UJ-RCV-001.md`, `HANDOFF-UJ-SKL-001.md` | task delta | ChatGPT |
| `docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md` | **4 Capability Record verificati su fonte primaria** | **Gemini**, ChatGPT |
| `CLAUDE.md` | continuità interna di CLAUDE | nessuno di voi, ma è pubblico |

### Come verificare che il mio lavoro sia vero

Non fidatevi di quello che scrivo. Riproducete:

```bash
cd packages/contracts && npx tsc --noEmit && npx tsc && cd ../..
node --test tests/contracts/runtime-invariants.test.mjs   # atteso 34/34
node --test tests/contracts/approval-policy.test.mjs      # atteso 28/28
node --test tests/contracts/tool-admission.test.mjs       # atteso 30/30
node --test tests/contracts/recovery.test.mjs             # atteso  9/9
node --test tests/contracts/skill-forge.test.mjs          # atteso 37/37
```

Atteso: typecheck exit 0, **138 test / 138 pass** in totale. Se non torna, il mio lavoro è
da rifiutare, non da interpretare.

> Trappola dell'ambiente: eseguite i test **dalla root del repository**. Se fate `cd` in
> `packages/contracts` prima, il test runner non trova i file. Ci sono cascato due volte.

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

### 4.9 MCP non è una garanzia di sicurezza — e TH-10 non è chiusa

Da `TOOL_PLANE.md` (UJ-MCP-001). Due punti che vi riguardano direttamente.

**Primo: un server MCP è codice di terzi che dichiara cosa sa fare.** La dichiarazione è
**input non fidato**, come una pagina web. Parlare un protocollo standard non dice nulla
sulla condotta. Non esiste corsia preferenziale per "è ufficiale" o "lo usano tutti":
l'Articolo 11 lo vieta. Ogni server, locale o remoto, passa dalla stessa admission a 18
regole.

**Secondo, e più importante per GROK: TH-10 NON è chiusa.**

Ho reso meccanica la mitigazione P0-1 — solo `TOOL_RUNTIME` può emettere
`tool.called/returned/failed`, nemmeno il Supervisor. Questo impedisce a un agente di
**falsificare l'attestazione di aver chiamato un tool**.

Non impedisce a un agente di **gonfiare il proprio `ResultEnvelope`**, cioè di dichiarare
"task completato" quando non lo è.

**→ GROK, nel risk register:** TH-10 va segnata come **coperta parzialmente**. Se le
assegni una mitigazione piena, il register mente. La parte scoperta si chiude solo con
l'emendamento **P-05** (nessuna affermazione di lavoro senza prova riproducibile) e con
la review indipendente, che è processo, non codice.

Lo segnalo io perché è mio interesse che risulti chiusa, ed è esattamente per questo che
va scritto nero su bianco che non lo è.

### 4.10 Per GEMINI: ToolManifest e CapabilityRecord non vanno fusi

Si somigliano, e la tentazione di unificarli sarà forte quando compilerai il Capability
Registry. **Rispondono a domande diverse:**

| | `CapabilityRecord` (tuo, UJ-CAP-001) | `ToolManifest` (mio, UJ-MCP-001) |
|---|---|---|
| Domanda | *l'account può usare questo prodotto?* | *il sistema può chiamare questa funzione?* |
| Cambia quando | cambia il piano o la policy del provider | cambia il codice del tool |

Se li fondiamo, **ogni cambio di piano invalida i tool** e **ogni aggiornamento di tool
richiede una riverifica di piano**: due cicli di vita diversi legati a forza.

Un `ToolManifest` **cita** un `capability_id`, non lo duplica. Se non sei d'accordo, è
il momento di dirlo — dopo costa.

### 4.11 Il limite che vi lega davvero si rompeva in silenzio. Ora no.

Da `DISASTER_RECOVERY.md` (UJ-RCV-001). **`R-RUN-01` è chiuso**, e il modo in cui si
rompeva riguarda chiunque di voi scriva un contatore, una quota o un lock.

Un contatore implementato come *leggi → scrivi* si rompe sotto concorrenza. In Node il
varco è **qualunque `await` fra la lettura e la scrittura**. Con 20 task attivi, tetto
25 e 10 spawn concorrenti:

| Contatore | Ammessi | Contatore finale | Realtà |
|---|---:|---:|---|
| Ingenuo | **10** | **21** | 30 attivi |
| Atomico | **5** | 25 | 25 attivi |

Il danno è doppio, e **la seconda metà è peggiore della prima**:

1. il tetto viene sfondato, e **nessun controllo di invariante fallisce** — ognuno dei
   dieci ha letto 20 e ha risposto correttamente a "20 è sotto 25?";
2. tutti scrivono `osservato + 1` dalla stessa lettura stantia, quindi **9 incrementi su
   10 si perdono**. Il contatore segna 21 mentre i task attivi sono 30, e da lì ogni
   ammissione successiva è giudicata su un dato falso.

**→ TUTTI, regola riutilizzabile:** fra il controllo di un limite e il suo incremento non
deve esistere un `await`. Su database serve un update condizionale
(`UPDATE ... WHERE valore = ?`), mai `SELECT` seguita da `UPDATE`.

**→ GEMINI, vincolo per `UJ-INF-001`:** il contatore distribuito presuppone che il
database offra **compare-and-swap**. Se la tua scelta di storage non lo supporta, la
soluzione va riprogettata. È `R-RCV-01`, e ti serve saperlo **prima** di scegliere.

**→ GROK:** puoi togliere `R-RUN-01` dai P0 aperti, con prova eseguibile. Nuovo:
`R-RCV-01`.

### 4.12 Il rischio operativo più concreto non è tecnico

Lo scenario **D9** del runbook: il container di sessione è **effimero**. Tutto ciò che
non è committato e pushato **non esiste** per la sessione successiva.

Vale per tutte e quattro noi, con qualunque strumento. Il push non è burocrazia: **è il
checkpoint del lavoro umano-IA**, esattamente come `checkpoint.written` lo è per un run.
Per questo la Regola 2 impone commit e push a fine di **ogni task**, non a fine sessione.

### 4.13 Il sandbox non dimostra ciò che sembra dimostrare

Da `SKILL_FORGE.md` (UJ-SKL-001). Riguarda chiunque di voi proponga "lo mettiamo in
sandbox" come risposta a un rischio.

Il sandbox osserva il comportamento **in condizioni di sandbox**. Codice che rilevi di
essere osservato — assenza di credenziali, rete negata, filesystem effimero, limiti di
risorsa insoliti — può comportarsi bene nel test e diversamente dopo la promozione.
Basta un `if` su una variabile d'ambiente.

**Nessun sandbox migliore lo risolve.** Renderlo indistinguibile dalla produzione
significa dargli credenziali e dati veri, cioè eliminarlo. Il compromesso è strutturale,
non un difetto di implementazione.

**Perché il sistema regge comunque:** il contenimento non viene dal sandbox ma dal
**runtime**. Una skill non può chiamare un tool che non possiede, *qualunque cosa il suo
codice voglia fare*, perché l'allowlist è applicata dal tool runtime e non dalla skill.
Il codice consapevole del sandbox può mentire su ciò che **farebbe**; non può ottenere
ciò che non gli è stato concesso.

**→ GROK:** il sandbox è una rete di sicurezza contro il codice sbagliato **per errore**,
non una prova contro il codice sbagliato **di proposito**. Stessa forma del loop detector
(§4.1) e della copertura parziale di TH-10 (§4.9): se gli assegni una mitigazione piena,
il register mente.

**E una seconda, `TH-SF-03`:** la pipeline verifica **come** è fatto il codice — typecheck,
SAST, test, sandbox, review avversariale — ma **nessuno stadio verifica perché esiste**.
Se l'intent proviene da contenuto non fidato, la forge produrrà con diligenza una skill
pulita, testata e firmata **che fa esattamente la cosa sbagliata**, con tutti i gate verdi.

### 4.14 `R-MCP-01` non è chiuso, contrariamente all'aspettativa

Mi aspettavo che il sandbox della Skill Forge chiudesse `R-MCP-01` (un server MCP remoto
che cambia condotta a parità di manifest). **Non lo chiude**, e la distinzione è netta:

| Caso | Coperto dal sandbox? |
|---|---|
| Codice generato **da noi** | ✅ gira nel nostro sandbox |
| Server MCP **di terzi, remoto** | ❌ gira **a casa loro** |

Per il secondo caso il sandbox è irrilevante **per costruzione**. Serve monitoraggio
comportamentale: profilo delle chiamate attese e allarme sulla deviazione.

**→ CHATGPT:** propongo `UJ-MCP-002`, peso stimato 5. È l'unico modo di chiudere
`R-MCP-01`. Come per `UJ-SEC-002` (peso 8), **non l'ho aggiunto alla baseline da solo**:
§7.4 vieta l'espansione di scope senza `BASELINE_CHANGE`. Sono **due decisioni di
baseline in sospeso presso di te**, e insieme coprono i tre rischi non assegnati.

**→ GEMINI:** `R-SKL-03` — la tecnologia di isolamento del sandbox dipende dalla tua
scelta di topologia in `UJ-INF-001`. Insieme a `R-RCV-01` (il DB deve offrire
compare-and-swap), sono **due vincoli che ti servono prima di scegliere, non dopo**.

### 4.15 VERIFICATO: ultraJARVIS non può essere un'app autonoma che chiama Claude

Questa è la scoperta con l'impatto più ampio di tutta la mia sessione, ed è
`VERIFIED_FACT` con citazione, non un'inferenza.

> *"Unless previously approved, Anthropic does not allow third party developers to offer
> claude.ai login or rate limits for their products, including agents built on the Claude
> Agent SDK. Use the API key authentication methods described in the Quickstart instead."*
> — `code.claude.com/docs/en/agent-sdk/overview`, letto il 2026-08-17

E, dai termini consumer letti lo stesso giorno: è vietato *"access the Services through
automated or non-human means, whether through a bot, script, or otherwise"*, salvo chiave
API o permesso esplicito.

**Conseguenza per il programma:**

| Percorso verso Claude | Verdetto |
|---|---|
| App autonoma su Agent SDK | ❌ `PAID_ONLY_DISABLED` — richiede chiave API = pay-per-token = Articolo 5 |
| Automazione della UI di Claude.ai | ❌ `UNAVAILABLE` — vietato dai termini |
| Christian che usa Claude di persona | ✅ `HUMAN_BRIDGE` — **unico percorso a costo zero** |

Gate §6.2 sull'Agent SDK: **4 condizioni negative su 10**. Verdetto definitivo finché il
budget resta zero.

**→ CHATGPT, ha impatto architetturale:** se il Program OS assume un percorso automatico
verso Claude, va corretto. Per Claude, ultraJARVIS è necessariamente un **orchestratore
di `HUMAN_BRIDGE`**, e il bridge non è un ripiego in attesa di qualcosa di meglio: è la
modalità definitiva.

**→ GROK:** una delle tue tesi da falsificare in `UJ-RED-001` — *"zero-card e automatico
sono compatibili?"* — ha ora una risposta documentata per Claude: **no**. Ti consegno il
caso già chiuso, così concentri il lavoro sugli altri provider. E aggiungi al register il
percorso di spesa: al limite di Claude Code viene proposto di abilitare crediti API a
tariffe API standard, opt-in con consenso esplicito. **È l'unico modo in cui il programma
può generare un addebito.**

**→ GEMINI:** i 4 Capability Record sono nel formato §6 e pronti per `UJ-CAP-001`. Il
verdetto su CAP-CLD-002 **non va ammorbidito**: non è "da rivedere più avanti", è chiuso.

### 4.16 Le fonti ufficiali si spostano in 24 ore — dato misurato

L'URL dell'Agent SDK che avevo registrato **il giorno prima** ha prodotto due redirect
consecutivi al momento della lettura:

```
docs.claude.com/en/api/agent-sdk/overview
   → 301 → platform.claude.com/docs/en/api/agent-sdk/overview
   → 307 → code.claude.com/docs/en/agent-sdk/overview
```

Sommato ai due 404 già trovati: **3 URL ufficiali instabili su 20, in 24 ore.**

**→ GEMINI, per il design del Capability Registry:** è la prova empirica del perché §4.1
punto 5 vieta di congelare URL e limiti. Un record senza `last_verified_at` non è
"leggermente datato": è **inattendibile per costruzione**. Progetta la freschezza come
dato di prima classe, verificabile, non come metadato decorativo.

**→ TUTTI:** non rispondete a domande su piani, prezzi o accessi **a memoria**. Io stavo
per farlo e avrei sbagliato, perché il dominio della documentazione era cambiato da meno
di un giorno.

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
| 2026-08-17 | `UJ-CLAUDE-2026-08-17-02` | consegna di **UJ-MCP-001** in REVIEW; aggiunte §4.9 (MCP non è sicurezza; **TH-10 non è chiusa**) e §4.10 (ToolManifest ≠ CapabilityRecord, per Gemini); chiuso `R-RUN-03`, chiuso parzialmente `R-RUN-04`, nuovo `R-MCP-01`; 92 test totali |
| 2026-08-17 | `UJ-CLAUDE-2026-08-17-02` | consegna di **UJ-RCV-001** in REVIEW; aggiunte §4.11 (la race del contatore, con vincolo CAS per Gemini) e §4.12 (D9, il container effimero); **chiuso `R-RUN-01`, ultimo P0**; nuovo `R-RCV-01`; 101 test totali |
| 2026-08-17 | `UJ-CLAUDE-2026-08-17-02` | consegna di **UJ-SKL-001** in REVIEW; aggiunte §4.13 (il sandbox non prova ciò che sembra provare) e §4.14 (`R-MCP-01` NON chiuso, serve `UJ-MCP-002`); nuovi `R-SKL-01/02/03`; 138 test totali |
| 2026-08-17 | `UJ-CLAUDE-2026-08-17-02` | completato **UJ-CLD-001** in REVIEW; aggiunte §4.15 (**VERIFICATO: ultraJARVIS non può essere un'app autonoma che chiama Claude** — Agent SDK `PAID_ONLY_DISABLED`, UI automation vietata dai termini, `HUMAN_BRIDGE` unico percorso a costo zero) e §4.16 (3 URL ufficiali instabili su 20 in 24h); 4 Capability Record su fonte primaria; **portafoglio esaurito: 6 task su 8 in REVIEW** |

*(Regola 2 di `CLAUDE.md`: questo file va esteso a fine di ogni task, non riscritto.)*

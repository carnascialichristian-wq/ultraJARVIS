# THREAT MODEL — ultraJARVIS v0.1

| Metadato | Valore |
|---|---|
| Task ID | UJ-SEC-001 (parte 1 di 3) |
| Milestone | M0 / M1 |
| Owner | CLAUDE |
| Reviewer | GROK |
| Stato | REVIEW |
| Peso del task | 13 (threat model + approval policy + critica Costituzione) |
| Data class | C1 INTERNAL |
| Input | prompt canonico §17, `RUNTIME_THREAT_NOTES.md`, `RUNTIME_BLUEPRINT.md` |
| Documenti gemelli | `docs/constitution/APPROVAL_POLICY.md`, `docs/constitution/CONSTITUTION_CRITIQUE.md` |

---

## 1. Ambito e metodo

### 1.1 Cosa copre

Tutte le 18 categorie di minaccia elencate in §17 del prompt canonico, più quelle
emerse dalla progettazione del runtime. Le 12 minacce specifiche del livello runtime
restano in `RUNTIME_THREAT_NOTES.md` e sono **referenziate**, non duplicate: duplicarle
significherebbe farle divergere alla prima modifica.

### 1.2 Cosa NON copre

- il risk register di programma (rischi economici, di deprecazione, di lock-in) →
  è `UJ-RSK-001`, di GROK;
- la threat surface specifica di Skill Forge → è `UJ-SKL-001`, mio, bloccato da questo task;
- la threat surface specifica dei server MCP → è `UJ-MCP-001`, mio, bloccato da questo task;
- le minacce ai media e ai diritti → è `UJ-MED-RED-001`, di GROK.

### 1.3 Scala di valutazione

| Dimensione | Valori | Significato |
|---|---|---|
| Severità | `BASSA` `MEDIA` `ALTA` `CRITICA` | danno se l'attacco riesce |
| Probabilità | `BASSA` `MEDIA` `ALTA` | verosimiglianza nel contesto reale del programma |
| Rilevabilità | `BUONA` `PARZIALE` `SCARSA` | quanto è probabile accorgersene |

**`CRITICA`** è riservato a: perdita di segreti, spesa non autorizzata, azione esterna
irreversibile non approvata, o falsificazione delle prove su cui Christian decide.

### 1.4 Assunzione di base, e il suo limite

> Il sistema è **single-user, privato, cloud-first, senza budget incrementale**.
> Non c'è un attaccante esterno motivato che punta a questo repository.

Da questo **non** segue che il threat model sia teorico. L'avversario realistico qui
non è un intruso: sono **contenuti non fidati che entrano nel sistema** (web, repository
di terzi, issue, documenti, output MCP) e **il sistema stesso che sbaglia in modo
plausibile**. Le due minacce più probabili di questo programma non sono un attacco, ma:

1. il sistema che **afferma il falso** a Christian, e
2. il sistema che **spende o agisce** dove non doveva.

Il modello è tarato su questo, non su un red team esterno.

---

## 2. Asset da proteggere

Ordinati per danno in caso di compromissione.

| # | Asset | Perché conta | Classe |
|---|---|---|---|
| A1 | Segreti: token, chiavi, recovery code | perdita irreversibile, effetti fuori dal sistema | C3 |
| A2 | Assenza di spesa | vincolo assoluto del proprietario; un addebito viola la Costituzione | — |
| A3 | Integrità delle prove (ledger, test, status) | Christian decide su queste; se mentono, ogni altra difesa è inutile | C1 |
| A4 | Account e identità del proprietario | escalation verso il mondo reale | C3/C4 |
| A5 | Codice proprietario e repository privata | proprietà intellettuale | C2 |
| A6 | Memoria e provenienza | avvelenarla contamina ogni decisione futura | C1/C2 |
| A7 | Capacità di ripresa (checkpoint, run) | perderla significa perdere lavoro, non sicurezza | C1 |
| A8 | Reputazione verso terzi (PR, commit, messaggi) | azioni esterne a nome di Christian | C1/C2 |

**A3 è il più sottovalutato.** In un programma dove quattro IA producono artefatti e un
umano approva, la falsificazione delle prove non è una minaccia fra le altre: è quella
che **disattiva il controllo umano** lasciandolo apparentemente attivo.

---

## 3. Confini di fiducia

```
┌─ ESTERNO NON FIDATO ────────────────────────────────────────────┐
│ web · repository di terzi · issue · email · documenti · output  │
│ di server MCP · risultati incollati da un bridge umano          │
└────────────────────┬────────────────────────────────────────────┘
                     │  ← CONFINE 1: tutto ciò che passa è DATO, mai ISTRUZIONE
┌────────────────────▼────────────────────────────────────────────┐
│ MODELLI (le quattro IA e ausiliarie)                            │
│ non fidati per definizione: possono essere persuasi o sbagliare  │
└────────────────────┬────────────────────────────────────────────┘
                     │  ← CONFINE 2: output validato contro schema prima dell'uso
┌────────────────────▼────────────────────────────────────────────┐
│ RUNTIME DETERMINISTICO                                          │
│ Supervisor · DepthGuard · policy engine · ledger — fidati       │
└────────────────────┬────────────────────────────────────────────┘
                     │  ← CONFINE 3: side effect solo via policy + approval gate
┌────────────────────▼────────────────────────────────────────────┐
│ MONDO ESTERNO: repository, account, servizi, denaro             │
└─────────────────────────────────────────────────────────────────┘
```

**Il principio che tiene insieme i tre confini:**

> Un modello completamente persuaso non deve poter fare più danno di un modello onesto.

Se la sicurezza dipende dal fatto che il modello non venga convinto, non è sicurezza.

---

## 4. Catalogo delle minacce

### Gruppo A — Iniezione e manipolazione del contenuto

#### TH-01 — Prompt injection da contenuto esterno
| | |
|---|---|
| **Vettore** | web, repository di terzi, issue, PR, email, documenti, output di server MCP |
| **Impatto** | il modello esegue istruzioni dell'attaccante credendole del proprietario |
| **Severità / Probabilità / Rilevabilità** | ALTA / **ALTA** / PARZIALE |
| **Controlli** | `originLabel` su ogni artifact; il contenuto `UNTRUSTED_EXTERNAL` non è mai canale di istruzioni; i limiti stanno nel runtime e non nel prompt, quindi la persuasione non produce privilegi |
| **Residuo** | il modello può comunque produrre **contenuto avvelenato conforme allo schema**. Lo schema garantisce la forma, non la verità |
| **Owner / Test** | CLAUDE / `T-SEC-1` ✅ implementata (14 prove, bloccante nel gate); suite completa in `UJ-INJ-001` (GROK) |

> È la minaccia a **probabilità più alta** dell'intero programma, perché non richiede un
> attaccante dedicato: basta che il sistema legga una pagina qualsiasi che contiene testo
> imperativo. Va trattata come condizione normale di esercizio, non come incidente.

#### TH-02 — Tool poisoning e descrizioni malevole
| | |
|---|---|
| **Vettore** | descrizione di un tool MCP che contiene istruzioni; tool che cambia dopo l'admission |
| **Impatto** | esecuzione di operazioni non previste con privilegi già concessi |
| **S/P/R** | ALTA / MEDIA / PARZIALE |
| **Controlli** | grant pinnato a `toolId@version` + `manifestHash` riverificato a ogni chiamata; la descrizione del tool è dato, non istruzione |
| **Residuo** | un server MCP remoto può cambiare **comportamento a parità di manifest**: l'hash attesta la descrizione, non la condotta |
| **Owner / Test** | CLAUDE / `T-TL-1` ⏳; approfondimento in `UJ-MCP-001` |

#### TH-03 — Output schema bypass
| | |
|---|---|
| **Vettore** | output che elude la validazione o sfrutta campi liberi |
| **Impatto** | dati non validati entrano nel flusso a valle |
| **S/P/R** | MEDIA / MEDIA / BUONA |
| **Controlli** | doppia validazione produce-time e consume-time; `SCHEMA_VIOLATION` con una sola riparazione |
| **Residuo** | campi `string` liberi restano un canale: lo schema non vincola la semantica |
| **Owner / Test** | CLAUDE / `T-RT-3` ⏳ |

#### TH-04 — Memory poisoning
| | |
|---|---|
| **Vettore** | promozione a memoria permanente di un contenuto falso o ostile |
| **Impatto** | contamina ogni decisione futura; è **persistente**, a differenza di TH-01 |
| **S/P/R** | **ALTA** / MEDIA / SCARSA |
| **Controlli** | nessun modello scrive direttamente in memoria permanente; pipeline di promozione con provenienza |
| **Residuo** | **la pipeline di promozione non è ancora progettata** — è `UJ-MEM-001` di GEMINI. Fino ad allora la difesa è "non c'è memoria permanente", che regge solo finché non c'è |
| **Owner / Test** | GEMINI / da definire in `UJ-MEM-001` |

> Rilevabilità **SCARSA** e persistenza rendono TH-04 più grave di quanto la probabilità
> media suggerisca. Un fatto falso promosso una volta viene poi citato come precedente.

### Gruppo B — Privilegio e scope

#### TH-05 — Escalation di scope / auto-escalation
| | |
|---|---|
| **Vettore** | un agente si concede tool, autonomia, quota o data class superiori |
| **Impatto** | violazione diretta dell'Articolo 8 |
| **S/P/R** | ALTA / BASSA / BUONA |
| **Controlli** | `checkSpawn()` verifica 11 invarianti e **nomina** quella violata; `L5` irrappresentabile nel tipo |
| **Residuo** | i limiti sono verificati **all'admission**, un solo istante. La revoca a cascata `TA-9` è specificata ma **non implementata** |
| **Owner / Test** | CLAUDE / `T-TA-1`, `T-TA-2` ✅ passano; `T-TA-3` ⏳ |

#### TH-06 — Confused deputy
| | |
|---|---|
| **Vettore** | convincere un componente più privilegiato ad agire per conto di uno meno privilegiato |
| **Impatto** | aggiramento indiretto dei limiti |
| **S/P/R** | ALTA / MEDIA / PARZIALE |
| **Controlli** | il Supervisor è codice deterministico e non esegue lavoro per conto dei membri; assegna solo task già contrattualizzati |
| **Residuo** | se in futuro il Supervisor consulterà un modello per pianificare, l'output va tipizzato in modo che **non possa contenere una concessione di privilegio**. Requisito di progetto, non convenzione |
| **Owner / Test** | CLAUDE / da definire |

#### TH-07 — Cross-tenant / cross-run leakage
| | |
|---|---|
| **Vettore** | dati di un run che finiscono in un altro |
| **Impatto** | contaminazione, perdita di isolamento |
| **S/P/R** | MEDIA / BASSA / PARZIALE |
| **Controlli** | run isolato come unità di checkpoint e audit; token legati a `(runId, agentId, toolId, version)` |
| **Residuo** | il sistema è single-user: l'impatto è contenuto. Diventerebbe ALTA se si passasse a multi-utente, che è escluso nella prima fase lunga |
| **Owner / Test** | CLAUDE / ⏳ |

### Gruppo C — Segreti e dati

#### TH-08 — Secret leakage
| | |
|---|---|
| **Vettore** | segreto in prompt, log, commit, issue, ledger, memoria o artifact |
| **Impatto** | **irreversibile e con effetti fuori dal sistema** |
| **S/P/R** | **CRITICA** / MEDIA / PARZIALE |
| **Controlli** | `SecretRef` opaco: il valore **non è rappresentabile** nei tipi; il ledger porta hash e riferimenti; risoluzione solo nel tool-runtime |
| **Residuo** | **il tipo non protegge dal contenuto**: un modello può ripetere in chiaro una credenziale letta da un file, dentro un artifact perfettamente valido. Serve scanning in postflight prima del sigillo dell'artifact |
| **Owner / Test** | CLAUDE / **P1, da implementare** |

> È la sola minaccia `CRITICA` con residuo non mitigato. Il gap è netto: le difese
> attuali coprono il *canale strutturale* (campi, log, ledger) e non il *contenuto*.

#### TH-09 — Data exfiltration
| | |
|---|---|
| **Vettore** | invio di dati C2+ verso una capacità non ammessa per quella classe |
| **Impatto** | perdita di riservatezza, possibile uso per training di terzi |
| **S/P/R** | ALTA / MEDIA / PARZIALE |
| **Controlli** | data class su ogni artifact e task; preflight di policy; `dataClassWithin` verificato all'admission |
| **Residuo** | la classificazione iniziale è **manuale e fallibile**: un dato C2 etichettato C1 viaggia legittimamente. La regola "in dubbio, classe superiore" è una convenzione, non un controllo |
| **Owner / Test** | CLAUDE + GEMINI (data policy per capability) / ⏳ |

### Gruppo D — Integrità delle prove

#### TH-10 — Proof fabrication
| | |
|---|---|
| **Vettore** | dichiarare test superati, task DONE, percentuali, commit o accessi inesistenti |
| **Impatto** | **disattiva il controllo umano lasciandolo apparentemente attivo** |
| **S/P/R** | **CRITICA** / **ALTA** / PARZIALE |
| **Controlli** | hash chain del ledger (`verifyLedgerChain`, testato); `DONE` richiede acceptance criteria + proof; `completed_weight = 0` senza reviewer; divieto §31.5 |
| **Residuo** | la catena prova che **un evento è stato registrato**, non che il fatto registrato sia **vero**. Un agente che scrive `tool.returned` senza aver chiamato il tool produce una catena integra e falsa |
| **Mitigazione richiesta** | **solo il tool-runtime può emettere eventi `tool.*`**, mai l'agente. Da imporre in `UJ-MCP-001` |
| **Owner / Test** | CLAUDE / `T-LG-1` ✅ (rileva la riscrittura); emissione non autorizzata ⏳ **P0** |

> Probabilità **ALTA** non per malizia: è il modo di fallire più naturale di un modello
> linguistico, che produce volentieri un resoconto plausibile di lavoro non svolto.
> Per questo l'Articolo 2 esiste, e per questo non basta come difesa: serve meccanica.

#### TH-11 — Artifact tampering
| | |
|---|---|
| **Vettore** | modifica di un artifact dopo la produzione |
| **Impatto** | decisioni prese su contenuto alterato |
| **S/P/R** | MEDIA / BASSA / BUONA |
| **Controlli** | artifact content-addressed: l'identità **è** l'hash; `derivedFrom` mantiene la catena |
| **Residuo** | dipende dallo storage scelto (`ADR-RUN-06`, GEMINI) |
| **Owner / Test** | CLAUDE / ⏳ |

### Gruppo E — Risorse e disponibilità

#### TH-12 — Loop, fork bomb e quota exhaustion
| | |
|---|---|
| **Vettore** | delega ricorsiva, ping-pong fra agenti, retry aggressivo |
| **Impatto** | esaurimento quota → il programma si ferma; nessun costo monetario perché il budget è zero |
| **S/P/R** | MEDIA / MEDIA / BUONA |
| **Controlli** | `INV-D1..D4`; cap 25 task attivi; retry classificato; riserva di recovery intoccabile |
| **Residuo** | **contatore non atomico** → fan-out concorrenti superano 25 per race condition (`R-RUN-01`, ALTA). Inoltre il loop detector testuale **è evadibile con una parola** (misurato) |
| **Owner / Test** | CLAUDE / `T-DG-1..4` ✅; **`T-DG-4b` ⏳ P0** |

#### TH-13 — Replay e doppio side effect
| | |
|---|---|
| **Vettore** | crash o retry che riesegue una scrittura esterna già avvenuta |
| **Impatto** | effetti duplicati nel mondo esterno, non annullabili per decreto |
| **S/P/R** | ALTA / MEDIA / PARZIALE |
| **Controlli** | idempotency key length-prefixed e senza numero di tentativo; checkpoint prima di ogni side effect; risoluzione `CONFIRMED / NOT_EXECUTED / NON_IDEMPOTENT` |
| **Residuo** | dipende dal fatto che **il tool esponga lookup per idempotency key**. Senza, l'esito è inconoscibile e l'unica risposta onesta è fermarsi (`R-RUN-03`, ALTA) |
| **Owner / Test** | CLAUDE / `T-ID-1` ✅; `T-CK-1`, `T-CK-2` ⏳ |

### Gruppo F — Supply chain

#### TH-14 — Dependency confusion e typosquatting
| | |
|---|---|
| **Vettore** | pacchetto con nome simile o risolto dal registry sbagliato |
| **Impatto** | esecuzione di codice arbitrario in build |
| **S/P/R** | **CRITICA** / BASSA / PARZIALE |
| **Controlli** | Articolo 11: nessuna fiducia per popolarità; admission, licenza, pinning |
| **Residuo** | **nessun lockfile e nessuna policy di registry esistono ancora**: il monorepo è `UJ-INT-004` di ChatGPT. Oggi il rischio è basso perché non c'è quasi nulla installato; cresce al primo `pnpm install` reale |
| **Owner / Test** | ChatGPT (monorepo) + CLAUDE (policy) / ⏳ |

> Nota deliberata: `packages/contracts` è stato scritto **senza dipendenze runtime**.
> Le funzioni di hash sono iniettate come parametro invece che importate. Non è
> eleganza: riduce la superficie di supply chain del pacchetto più critico a zero.

#### TH-15 — Compromissione di repository, plugin, skill o MCP server
| | |
|---|---|
| **Vettore** | codice di terzi adottato senza review |
| **Impatto** | esecuzione arbitraria, esfiltrazione |
| **S/P/R** | CRITICA / BASSA / SCARSA |
| **Controlli** | Articolo 11; GitHub Intake Pipeline (§24.1); divieto di copia cieca (§3) |
| **Residuo** | la pipeline di intake è descritta ma **non operativa**; la shortlist è di GROK (`UJ-OSS-001`) |
| **Owner / Test** | GROK (intake) + CLAUDE (admission) / ⏳ |

#### TH-16 — Rischio di licenza
| | |
|---|---|
| **Vettore** | adozione di codice con licenza incompatibile con un progetto proprietario privato |
| **Impatto** | legale, non tecnico |
| **S/P/R** | MEDIA / MEDIA / BUONA |
| **Controlli** | verifica licenza in admission |
| **Residuo** | nessuno strumento automatico previsto finora |
| **Owner / Test** | GROK / ⏳ |

### Gruppo G — Confine con il mondo reale

#### TH-17 — Browser automation impropria
| | |
|---|---|
| **Vettore** | automatizzare UI consumer, cookie, sessioni per aggirare l'assenza di API |
| **Impatto** | violazione dei ToS, sospensione degli account di Christian, perdita di accesso |
| **S/P/R** | **CRITICA** / MEDIA / BUONA |
| **Controlli** | §3 e §6.2 punto 6 lo vietano esplicitamente; l'alternativa prevista è `HUMAN_BRIDGE` con DelegationCard |
| **Residuo** | la probabilità è MEDIA non per attacco ma per **tentazione di progetto**: è la scorciatoia ovvia ogni volta che una capacità non ha API. Va rifiutata ogni volta |
| **Owner / Test** | tutte le IA / controllo in review |

> Questa minaccia ha come attaccante **il sistema stesso che cerca di essere utile**.
> È la ragione per cui `HUMAN_BRIDGE` deve essere un cittadino di prima classe e non
> un ripiego: se il bridge è scomodo, qualcuno proporrà di automatizzare la UI.

#### TH-18 — Social engineering verso il proprietario
| | |
|---|---|
| **Vettore** | contenuto che induce Christian ad approvare, incollare o abilitare qualcosa |
| **Impatto** | bypass di **tutti** i controlli tecnici, perché l'umano è l'autorità finale |
| **S/P/R** | **CRITICA** / MEDIA / SCARSA |
| **Controlli** | ApprovalCard con impatto, reversibilità e piano di rollback espliciti; nessun auto-approve |
| **Residuo** | **approval fatigue**: saturare l'umano di richieste finché approva senza leggere. Il runtime da solo non lo mitiga |
| **Mitigazione proposta** | budget di approvazioni per finestra; raggruppamento; evidenziazione delle sole **irreversibili**; una ApprovalCard che non sa dichiarare il rollback **non può essere emessa** |
| **Owner / Test** | CLAUDE (meccanica) + Christian (processo) / ⏳ |

> `SCARSA` rilevabilità: se l'umano approva, il sistema registra un'approvazione valida.
> Non esiste segnale tecnico che distingua un'approvazione consapevole da una stanca.
> Per questo la difesa deve essere **preventiva** (meno richieste, più chiare) e non
> rilevativa.

#### TH-19 — Bridge umano come canale di iniezione
| | |
|---|---|
| **Vettore** | il risultato incollato da un'altra IA contiene istruzioni |
| **Impatto** | injection che entra con l'autorità apparente del proprietario |
| **S/P/R** | ALTA / MEDIA / PARZIALE |
| **Controlli** | il risultato di un bridge è etichettato `HUMAN_PROVIDED` e **validato contro schema** prima dell'uso (guardia della transizione `AWAITING_BRIDGE → COLLECTING`) |
| **Residuo** | `HUMAN_PROVIDED` non significa fidato: significa "passato per un umano". La distinzione va mantenuta anche quando sarà scomodo |
| **Owner / Test** | CLAUDE / ⏳ |

---

## 5. Difese minime — stato reale

Le 15 difese di §17, con lo stato onesto di ciascuna. Non è una lista di intenzioni.

| # | Difesa | Stato | Dove |
|---|---|---|---|
| 1 | separare dato da istruzione | ✅ progettata **e applicata** | `originLabel`, letto dalla guardia `originLabelledHumanProvided` |
| 2 | content origin label | ✅ progettata **e applicata** | `ArtifactRef.originLabel` + `GUARD_REGISTRY` in `supervisor.ts` |
| 3 | allowlist di tool | ✅ progettata e testata | `checkSpawn`, `TA-1..10` |
| 4 | allowlist di rete / egress deny | ❌ **non progettata** | dipende dalla topologia (GEMINI) |
| 5 | schema validation | ✅ progettata | doppia validazione §10.4 |
| 6 | capability token a scadenza | ⚠️ progettata, TTL non fissato | `ADR-RUN-04` |
| 7 | sandbox | ❌ **non progettata** | `UJ-SKL-001`, bloccato da questo task |
| 8 | secret reference | ✅ progettata | `SecretRef` opaco |
| 9 | artifact firmati/hashati | ✅ progettata | content-addressed |
| 10 | review indipendente | ✅ attiva | reviewer ≠ owner, già in uso |
| 11 | audit immutabile | ✅ progettata e testata | hash chain, `T-LG-1` |
| 12 | kill switch | ✅ progettata e testata | `T-KS-1`, 11 stati |
| 13 | canary e rollback | ⚠️ parziale | `rollbackPlan` obbligatorio in `ApprovalCard`, meccanica assente |
| 14 | test di prompt injection | ⚠️ **parziali** | `T-SEC-1` implementata: `tests/threat-model/prompt-injection.test.mjs`, 14 prove, bloccante nel gate. Copre le difese che *questo* deliverable dichiara; la suite completa resta in `UJ-INJ-001` (GROK) |
| 15 | policy preflight e postflight | ⚠️ preflight progettato, **postflight no** | serve per TH-08 |

**Sintesi onesta: 8 su 15 progettate, 4 parziali, 3 assenti.** Due movimenti in sessione 8,
entrambi verso l'alto: la difesa **14** è passata da assente a parziale (`T-SEC-1` esiste), e
le difese **1 e 2** da "progettate" a "progettate e applicate" — `.originLabel` non era letto
da nessuna parte, ed è ora la condizione della guardia che presidia la transizione del
`HUMAN_BRIDGE`. Le tre assenti restano egress deny, sandbox e postflight, tutte dipendenti
dall'infrastruttura non ancora scelta.

> **Avvertenza sul significato di "applicata".** Il pacchetto dei contratti non ha I/O: la
> guardia è una funzione pura e `canTransition` la valuta, ma chi implementerà il kernel deve
> chiamare `canTransition` invece di `nextState`. Ciò che è cambiato è che ora **esiste** una
> controparte che valuta, che una guardia non valutata **blocca** invece di passare, e che un
> refuso nel nome di una guardia è un errore di compilazione. Prima non c'era nulla di tutto
> questo: erano stringhe. Le tre assenti
(egress deny, sandbox, postflight) sono tutte concentrate sulle minacce a residuo
più alto. Non è un caso: sono le difese che richiedono infrastruttura,
e l'infrastruttura non è ancora scelta.

---

## 6. Priorità di remediation

| Priorità | Azione | Chiude / riduce | Owner | Task |
|---|---|---|---|---|
| **P0** | solo il tool-runtime può emettere eventi `tool.*` | TH-10 (CRITICA) | CLAUDE | UJ-MCP-001 |
| **P0** | contatore task attivi atomico | TH-12 (`R-RUN-01`) | CLAUDE | UJ-RCV-001 |
| **P0** | lookup per idempotency key obbligatoria nel `ToolManifest` | TH-13 (`R-RUN-03`) | CLAUDE | UJ-MCP-001 |
| **P1** | scanning dei segreti in postflight sugli artifact | TH-08 (CRITICA) | CLAUDE | UJ-SEC-002 (nuovo) |
| **P1** | TTL del token in funzione del side-effect ceiling | TH-05, TH-07 | CLAUDE | UJ-RCV-001 |
| **P1** | revoca a cascata dei grant (`TA-9`) | TH-05 | CLAUDE | UJ-RCV-001 |
| **P1** | budget di approvazioni + solo irreversibili evidenziate | TH-18 (CRITICA) | CLAUDE + Christian | UJ-SEC-002 |
| **P2** | suite di test di prompt injection | TH-01, TH-19 | GROK | UJ-INJ-001 |
| **P2** | pipeline di promozione della memoria | TH-04 | GEMINI | UJ-MEM-001 |
| **P2** | egress deny e allowlist di rete | TH-09 | GEMINI | UJ-INF-001 |

**Nuovo task proposto: `UJ-SEC-002` — postflight scanning e controllo dell'approval
fatigue.** Peso stimato 8. Copre gli unici due residui `CRITICA` non assegnati.
Richiede accettazione da ChatGPT come integratore prima di entrare nella baseline
(§7.4: nessuna espansione di scope senza `BASELINE_CHANGE`).

---

## 7. Cosa consegno a GROK

Tre affermazioni che voglio siano attaccate, non confermate:

1. **"I limiti verificati all'admission bastano."** Sono verificati in un solo istante.
   TH-05 e TH-06 mostrano dove l'assunzione si assottiglia.
2. **"Lo schema garantisce la correttezza."** Garantisce la forma. TH-01, TH-03 e TH-08
   passano tutti attraverso contenuto formalmente valido.
3. **"Il budget zero elimina il rischio economico."** Elimina la spesa diretta. Non
   elimina il costo di un account sospeso (TH-17), che è più caro di una bolletta.

E la domanda aperta, invariata da `RUNTIME_THREAT_NOTES.md`:

> **Esiste una catena che, senza violare nessuna invariante, produce un effetto che
> Christian non avrebbe approvato?** Se sì, è più grave di ogni singola voce di questo
> catalogo, perché significa che il modello di sicurezza è completo e inefficace insieme.

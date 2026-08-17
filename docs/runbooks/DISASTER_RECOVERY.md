# DISASTER RECOVERY — checkpoint, retry, cancellation, idempotency

| Metadato | Valore |
|---|---|
| Task ID | UJ-RCV-001 |
| Milestone | M2 / M15 |
| Owner | CLAUDE · Reviewer | **CHATGPT** |
| Stato | REVIEW |
| Peso | 8 |
| Dipendenza | UJ-RUN-001 (REVIEW) — soddisfatta |
| Contratti | `packages/contracts/src/recovery/` |
| Test | `tests/contracts/recovery.test.mjs` — 9/9 verdi |

---

## 1. Il risultato principale: `R-RUN-01` è chiuso

Era l'**ultimo P0 aperto** del programma. Non l'ho chiuso descrivendolo: l'ho chiuso
scrivendo prima il test che dimostra che il bug esiste, poi l'implementazione che lo
elimina.

### 1.1 Il difetto, misurato

`DG-3` limita a **25** i task atomici attivi per run, ed è il limite che lega davvero:
l'albero teorico consentito da profondità e fan-out sarebbe di 156 nodi, quindi
l'ammissione fallisce per saturazione del contatore molto prima che per profondità.

Un contatore implementato come *leggi → scrivi* si rompe sotto fan-out concorrente.
In Node il varco è **qualunque `await` fra la lettura e la scrittura**: una query, un
flush di log, una scrittura sul ledger.

Scenario del test `T-DG-4b`, con 20 task già attivi e 10 agenti che tentano lo spawn:

| Contatore | Ammessi | Contatore finale | Realtà |
|---|---:|---:|---|
| Ingenuo (`leggi → await → scrivi`) | **10** | **21** | 30 task attivi |
| Atomico | **5** | 25 | 25 task attivi |

Il danno è doppio, e la seconda metà è peggiore della prima:

1. **Il tetto viene sfondato**: 10 ammessi dove ne restavano 5. Nessun controllo di
   invariante fallisce, perché ognuno dei dieci ha letto 20 e ha risposto correttamente
   alla domanda "20 è sotto 25?".
2. **Il conteggio smette di descrivere la realtà**: tutti scrivono `osservato + 1`
   partendo dalla stessa lettura stantia, quindi nove incrementi su dieci vanno persi.
   Il contatore segna 21 mentre i task realmente attivi sono 30. Da quel momento **ogni
   ammissione successiva viene giudicata su un dato falso**, e il sistema si comporta
   come se avesse 4 slot liberi quando ne ha −5.

Il secondo punto è la ragione per cui questo non è un difetto "di prestazioni sotto
carico": corrompe permanentemente lo stato su cui poggia l'unico limite che regge.

### 1.2 La correzione

Due forme, a seconda di dove vive il contatore:

| Contesto | Classe | Proprietà |
|---|---|---|
| In-process | `AtomicActiveTaskCounter` | check e incremento **senza punti di sospensione** in mezzo |
| Distribuito (DB) | `CasActiveTaskCounter` | compare-and-swap con retry **limitato** |

**La regola, in una frase:** fra il controllo del limite e l'incremento non deve esistere
un `await`. Se il contatore sta su un database, la proprietà deve venire da un update
condizionale (`UPDATE ... WHERE valore = ?`), non da una `SELECT` seguita da una `UPDATE`.

**Due scelte deliberate nel CAS:**

- Il retry è **limitato** (`maxAttempts`). Un loop CAS illimitato sotto contesa è un
  livelock: baratterebbe un bug di correttezza con uno di disponibilità.
- Esaurito il budget, la prenotazione **rifiuta**. Ammettere su un conteggio non
  verificato sarebbe esattamente la violazione che la classe esiste per impedire. Un
  rifiuto è recuperabile; un tetto sfondato in silenzio no.

### 1.3 Il contro-esempio resta nel codice

`NaiveActiveTaskCounter` è mantenuto **apposta**, marcato "WRONG ON PURPOSE" e mai
cablato nel runtime. Serve al test che dimostra il fallimento.

Motivo: una correzione dimostrata contro nessun fallimento non dimostra nulla. Se un
domani qualcuno "semplificasse" il contatore atomico rendendolo asincrono fra check e
incremento, i test (a) e (b) diventerebbero la spiegazione già scritta del perché non
si può.

---

## 2. Runbook di ripresa dopo un'interruzione

Da eseguire in ordine. Ogni passo è verificabile.

### Passo 1 — Stabilire cosa è ancora vero

```
1.1  carica l'ultimo checkpoint con stato VALID
       VALID  ⟺  stateHash verifica  ∧  ogni artifactRef risolve
1.2  se non valido, scendi al precedente valido
1.3  se nessuno è valido → run.failed. NON ripartire alla cieca.
1.4  verifica la hash chain del ledger (verifyLedgerChain)
       se rotta → incidente di integrità, ferma tutto, escala a Christian
```

Il passo 1.3 è una scelta, non una rinuncia: un run che riparte senza sapere cosa ha già
fatto è più pericoloso di un run fallito.

### Passo 2 — Risolvere i side effect in sospeso

Per ogni operazione in `pendingSideEffects`:

| Esito della lookup | Significato | Azione |
|---|---|---|
| `CONFIRMED` | esiste un `tool.returned` con quella idempotency key | **non rieseguire**, adotta il risultato registrato |
| `NOT_EXECUTED` | il tool conferma che non è mai avvenuta | riesecuzione sicura |
| `NON_IDEMPOTENT` | il tool non espone lookup per chiave | **fermati e chiedi a un umano** |

`NON_IDEMPOTENT` non dovrebbe più verificarsi per i tool nuovi: `ADM-13` (UJ-MCP-001)
rifiuta in admission qualunque tool che scrive all'esterno senza lookup. Resta possibile
solo per tool ammessi prima di quella regola, che vanno ricensiti.

### Passo 3 — Ricostruire e verificare

```
3.1  proietta il ledger dagli eventi con seq > checkpoint.ledgerOffset
3.2  ricostruisci il contatore dei task attivi DALLO STATO, non dal valore salvato
3.3  rivaluta TUTTI gli invarianti DepthGuard sullo stato ricostruito
3.4  se un invariante è violato → non riprendere: è la prova di un difetto,
     non una condizione da tollerare
3.5  riparti dal primo step non confermato
```

Il passo 3.2 merita attenzione: se il contatore salvato fosse stato corrotto dalla race
di §1.1, ricaricarlo propagherebbe la corruzione oltre il riavvio. Va **ricalcolato**
contando i task realmente attivi.

### Passo 4 — Riprendere in sicurezza

- riemetti i capability token: quelli vecchi sono scaduti o vanno considerati tali;
- riapri le approvazioni pendenti **come nuove richieste**: un'approvazione concessa
  prima del crash può essere scaduta o riferirsi a un payload diverso;
- registra `checkpoint.restored` con `degraded: true` se sei sceso a un checkpoint
  precedente.

---

## 3. Scenari di guasto e risposta

| # | Scenario | Rilevamento | Risposta | Perdita accettata |
|---|---|---|---|---|
| D1 | Crash pulito fra due step | `pendingSideEffects` vuoto | resume dal checkpoint | nessuna |
| D2 | Crash fra effetto e registrazione | `pendingSideEffects` non vuoto | lookup per idempotency key | nessuna se il tool espone lookup |
| D3 | Checkpoint corrotto | `stateHash` non verifica | scendi al precedente valido | lavoro fra i due checkpoint |
| D4 | Artifact irrisolvibile | `ArtifactRef` non risolve | checkpoint marcato non valido | come D3 |
| D5 | Ledger manomesso | hash chain rotta | **stop totale**, incidente | nessuna: è un problema di fiducia, non di dati |
| D6 | Supervisor morto | heartbeat assenti | i token scadono, i membri decadono | run in corso |
| D7 | Quota esaurita | preflight fallito | la riserva di recovery garantisce il checkpoint | lavoro non svolto |
| D8 | Contatore corrotto | ricalcolo ≠ valore salvato | ricostruisci dallo stato (Passo 3.2) | nessuna |
| D9 | Container riciclato | sessione terminata | tutto ciò che non è committato è perso | **lavoro non pushato** |

### 3.1 D9 è il rischio operativo più concreto, oggi

Il container di sessione è **effimero**. Non è un'ipotesi teorica: è la condizione
normale di questo ambiente. Tutto ciò che non è committato e pushato **non esiste** per
la sessione successiva.

Difesa: `CLAUDE.md` Regola 2 impone commit e push a fine di ogni task, non a fine
sessione. Non è disciplina, è recovery: il push **è** il checkpoint del lavoro umano-IA,
esattamente come `checkpoint.written` lo è per un run.

---

## 4. Politica di retry — nota operativa

La tabella completa è in `packages/contracts/src/runtime/checkpoint.ts` (`RETRY_POLICY`).
Qui i punti che si sbagliano più facilmente:

| Classe | Errore comune | Perché è sbagliato |
|---|---|---|
| `RATE_LIMIT` | riprovare subito con backoff | §6.3 vieta il retry aggressivo: peggiora la posizione con il provider |
| `QUOTA_EXHAUSTED` | riprovare "più tardi" in automatico | richiede una decisione di routing, non attesa. Mai rotazione di account |
| `POLICY_DENIED` | riprovare con parametri diversi | è un tentativo di aggirare la policy, non un retry |
| `TIMEOUT` | riprovare sempre | ammesso **solo** se l'operazione è idempotente: una scrittura andata in timeout può essere atterrata |
| `NON_IDEMPOTENT` | indovinare | l'esito è inconoscibile: serve una persona |

**Il budget di retry è incluso in `quotaBudget`, mai aggiuntivo.** Un agente non può
comprarsi altro lavoro fallendo.

---

## 5. Cancellazione

| Fase | Comportamento |
|---|---|
| `SOFT` | il token si propaga; gli agenti si fermano al prossimo safe point e producono un risultato parziale |
| `HARD` | lo scheduler smette di dispacciare; gli step in volo sono abbandonati |
| `COMPENSATE` | i side effect confermati vengono compensati secondo la loro policy |

Un **safe point** è un momento senza side effect in volo e con stato serializzabile.
La cancellazione non è mai una perdita silenziosa: produce sempre `run.cancelled` con il
punto esatto, e gli artifact parziali si conservano.

**Il kill switch ferma i nuovi step, non annulla il passato.** Uno step già partito verso
un servizio esterno può completare: il rientro dipende dalla compensation policy del
tool, non da un decreto.

---

## 6. Obiettivi di ripresa, adattati al vincolo zero-costo

Non uso RTO/RPO da infrastruttura enterprise: sarebbero numeri senza fonte, vietati da
§4.1 punto 5. Uso obiettivi verificabili:

| Obiettivo | Impegno | Verificabile con |
|---|---|---|
| Nessun side effect esterno duplicato dopo un resume | **assoluto** | `T-CK-1`, `T-CK-2` ⏳ |
| Nessuna ripartenza cieca su stato non verificato | **assoluto** | `T-CK-3` ⏳ |
| Il checkpoint riesce anche a quota esaurita | **assoluto** | riserva di recovery, `T-QT-2` ⏳ |
| Perdita massima di lavoro | fino al checkpoint valido precedente | D3 |
| Rilevamento di manomissione del ledger | `O(n)`, senza fiducia nello scrittore | `T-LG-1` ✅ |

I primi tre sono impegni assoluti perché riguardano la **correttezza**, non la comodità.
I loro test **non sono ancora implementati**: richiedono un runtime che oggi non esiste,
ed è per questo che restano `⏳` invece che dichiarati superati.

---

## 7. Stato dei test di questo task

| ID | Test | Stato |
|---|---|---|
| `T-DG-4b (a)` | il contatore ingenuo ammette 10 dove ne restano 5 | ✅ **il bug è dimostrato** |
| `T-DG-4b (b)` | il contatore ingenuo perde 9 incrementi su 10 | ✅ |
| `T-DG-4b (c)` | il contatore atomico ammette esattamente 5 | ✅ **la correzione è dimostrata** |
| `T-DG-4b (d)` | 200 prenotazioni concorrenti, mai oltre il tetto | ✅ |
| — | release non scende sotto zero | ✅ |
| — | CAS su store concorrente ammette esattamente i posti liberi | ✅ |
| — | CAS rifiuta invece di ammettere su conteggio non verificato | ✅ |
| — | il loop CAS è limitato: contesa → rifiuto, non livelock | ✅ |
| — | CAS con 60 prenotazioni non supera mai il tetto | ✅ |
| `T-CK-1/2/3`, `T-QT-2`, `T-AP-2`, `T-SV-2` | richiedono il runtime | ⏳ **PENDING** — M3 |

## 8. Limiti dichiarati

1. **Il runtime non esiste ancora.** Questo task consegna il contatore corretto e la
   procedura; i test di crash injection restano pendenti perché non c'è ancora un
   processo da far crashare.
2. **`R-SEC-03` resta aperto:** `rollbackPlan` è un campo obbligatorio, ma nessuno
   verifica che il piano funzioni. La meccanica di compensazione non è progettata.
3. **La scelta della persistenza non è mia** (`ADR-RUN-02`, Gemini). `CasActiveTaskCounter`
   presuppone che il database offra un update condizionale: se la scelta cadesse su uno
   storage privo di CAS, questa soluzione non regge e va rifatta.
4. **La riserva di recovery non è ancora collegata** al Quota Governor: i campi esistono,
   l'applicazione no.

## 9. Cosa chiedo a CHATGPT (reviewer)

1. Il punto 3 sopra è una **dipendenza reale su Gemini**: se `UJ-INF-001` sceglie uno
   storage senza update condizionale, `CasActiveTaskCounter` va riscritto. Vale la pena
   segnalarlo come vincolo di selezione del database **prima** che la scelta sia fatta?
2. Ho tenuto un'implementazione volutamente sbagliata nel repository. È una pratica che
   vuoi standardizzare — il contro-esempio eseguibile accanto alla correzione — o
   preferisci che i contro-esempi vivano solo nei test?

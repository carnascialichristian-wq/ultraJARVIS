# HANDOFF — UJ-RCV-001 (CLAUDE)

| Metadato | Valore |
|---|---|
| Task | UJ-RCV-001 — checkpoint, retry, cancellation, idempotency, disaster recovery |
| Peso | 8 · Reviewer: **CHATGPT** |
| Stato | **REVIEW** |
| Data | 2026-08-17 UTC |

---

## 1. Risultato: l'ultimo P0 del programma è chiuso

| Deliverable | File |
|---|---|
| Contatore atomico e CAS | `packages/contracts/src/recovery/active-task-counter.ts` |
| Runbook di ripresa | `docs/runbooks/DISASTER_RECOVERY.md` |
| Test `T-DG-4b` | `tests/contracts/recovery.test.mjs` — **9/9 verdi** |

**`R-RUN-01` è chiuso.** L'ho fatto scrivendo **prima il test che dimostra che il bug
esiste**, poi la correzione.

### 1.1 Il difetto, misurato invece che descritto

20 task già attivi, 10 agenti tentano lo spawn, tetto `DG-3` a 25:

| Contatore | Ammessi | Contatore finale | Realtà |
|---|---:|---:|---|
| Ingenuo (`leggi → await → scrivi`) | **10** | **21** | 30 attivi |
| Atomico | **5** | 25 | 25 attivi |

Il danno è doppio, e la seconda metà è la peggiore:

1. **il tetto viene sfondato** — 10 ammessi dove ne restavano 5, e **nessun controllo di
   invariante fallisce**, perché ognuno dei dieci ha letto 20 e ha risposto correttamente
   a "20 è sotto 25?";
2. **il conteggio smette di descrivere la realtà** — tutti scrivono `osservato + 1` dalla
   stessa lettura stantia, quindi 9 incrementi su 10 si perdono. Il contatore segna 21
   mentre i task attivi sono 30, e da lì **ogni ammissione successiva è giudicata su un
   dato falso**.

Il punto 2 è il motivo per cui non è un difetto "di carico": corrompe in modo permanente
lo stato su cui poggia l'unico limite che regge davvero.

### 1.2 La regola, in una frase

> Fra il controllo del limite e l'incremento non deve esistere un `await`.

Su database: update condizionale (`UPDATE ... WHERE valore = ?`), mai `SELECT` seguita
da `UPDATE`.

Due forme fornite: `AtomicActiveTaskCounter` (in-process, sezione critica sincrona) e
`CasActiveTaskCounter` (distribuito, compare-and-swap con retry **limitato** — un loop
CAS illimitato sotto contesa è un livelock, che baratterebbe un bug di correttezza con
uno di disponibilità). Esaurito il budget, **rifiuta**: ammettere su un conteggio non
verificato sarebbe la violazione stessa che la classe previene.

### 1.3 Ho lasciato apposta un'implementazione sbagliata

`NaiveActiveTaskCounter` resta nel repository, marcato `WRONG ON PURPOSE` e mai cablato
nel runtime. Una correzione dimostrata contro nessun fallimento non dimostra nulla. E se
un domani qualcuno "semplificasse" il contatore atomico rendendolo asincrono fra check e
incremento, i test (a) e (b) sono la spiegazione già scritta del perché non si può.

**È una scelta discutibile e la segnalo come tale al reviewer** (vedi §5.2).

## 2. Runbook

`DISASTER_RECOVERY.md` contiene la procedura in 4 passi, 9 scenari di guasto (D1–D9) e
gli obiettivi di ripresa. Due punti che voglio evidenziare:

**Passo 3.2 — il contatore va ricostruito dallo stato, non ricaricato dal checkpoint.**
Se il valore salvato fosse stato corrotto dalla race, ricaricarlo propagherebbe la
corruzione oltre il riavvio.

**D9 — il rischio operativo più concreto oggi non è tecnico.** Il container di sessione è
effimero: tutto ciò che non è committato e pushato non esiste per la sessione successiva.
La Regola 2 di `CLAUDE.md` (commit e push a fine di **ogni task**, non a fine sessione)
non è disciplina: è recovery. Il push **è** il checkpoint del lavoro umano-IA.

## 3. Task delta

| Task | Stato prima | Stato ora | Accettato | Proposto | Manca |
|---|---|---|---:|---:|---:|
| UJ-RCV-001 | READY | **REVIEW** | 0/8 | 6/8 | 8 |
| UJ-RUN-001 | REVIEW | REVIEW | 0/13 | 11/13 | 13 |
| UJ-SEC-001 | REVIEW | REVIEW | 0/13 | 11/13 | 13 |
| UJ-MCP-001 | REVIEW | REVIEW | 0/8 | 7/8 | 8 |
| UJ-CLD-001 | IN_PROGRESS | IN_PROGRESS | 0/8 | 2/8 | 6 |
| UJ-SKL-001 | READY | READY | 0/13 | — | 13 |
| UJ-REV-001 | BLOCKED | BLOCKED | 0/5 | — | 5 |
| UJ-REV-002 | BLOCKED | BLOCKED | 0/8 | — | 8 |

```
accettato formalmente = 0 / 76  = 0%
proposto in review    = 37 / 76 = 48,7%   11 + 11 + 7 + 6 + 2
```

Perché 6/8 e non di più: i test di crash injection (`T-CK-1/2/3`, `T-QT-2`, `T-AP-2`,
`T-SV-2`) **restano pendenti** perché non esiste ancora un runtime da far crashare.

## 4. Rischi

**Chiuso:** `R-RUN-01`. **Tutti e tre i P0 del programma sono ora chiusi.**

**Nuovo — `R-RCV-01`:** `CasActiveTaskCounter` presuppone che il database offra un update
condizionale. Se `UJ-INF-001` sceglie uno storage privo di CAS, questa soluzione non
regge e va rifatta. Severità MEDIA. **È un vincolo di selezione del database, e va noto
a Gemini prima che la scelta sia fatta, non dopo.**

**Restano `CRITICA`:** `R-SEC-01` e `R-SEC-02`, entrambi in attesa che ChatGPT accetti
`UJ-SEC-002`. **Sono ora gli unici rischi critici del programma senza owner attivo.**

## 5. Handoff

### → CHATGPT (reviewer di UJ-RCV-001)

Due domande, entrambe reali:

1. **`R-RCV-01` è una dipendenza su Gemini.** Vale la pena promuoverlo a vincolo
   esplicito di selezione del database in `UJ-INF-001`, **prima** che la scelta sia
   fatta? Io penso di sì, ma la decisione di far entrare un vincolo nel task di
   qualcun altro è tua, non mia.
2. **Ho tenuto un'implementazione volutamente sbagliata nel repository.** È una pratica
   che vuoi standardizzare — il contro-esempio eseguibile accanto alla correzione — o
   preferisci che i contro-esempi vivano solo nei test? Non ho una posizione forte:
   il beneficio è che il "perché no" resta leggibile, il costo è codice morto che
   qualcuno potrebbe importare per errore.

**E la decisione ancora sospesa: `UJ-SEC-002`.** Sono gli unici due `CRITICA` senza owner.

### → GEMINI
`R-RCV-01` ti riguarda direttamente: la tua scelta di database in `UJ-INF-001` deve
includere il supporto a un update condizionale, altrimenti il contatore distribuito va
riprogettato. Sei ancora reviewer di UJ-RUN-001 e UJ-MCP-001, entrambi non revisionati.

### → GROK
`R-RUN-01` è chiuso con prova eseguibile; puoi rimuoverlo dai P0 aperti. `R-RCV-01` è
nuovo. Ricorda: **TH-10 resta coperta solo parzialmente** (vedi HANDOFF-UJ-MCP-001).

### → CHRISTIAN
Nessuna nuova decisione. Restano aperte quelle già poste.

## 6. RESUME_POINT

```
PROSSIMO  : UJ-SKL-001 — Skill Forge: threat model, pipeline, contratto sandbox.
            Peso 13, il residuo più grande. Reviewer ChatGPT. READY.
            MOTIVO: unico task READY rimasto, e contiene la sandbox che
            chiuderebbe R-MCP-01.
            Alternativa: completare UJ-CLD-001 (6 restanti), in parte bloccato
            da HUMAN_BRIDGE per il login console.

DOPO      : il portafoglio è esaurito salvo attesa reviewer e sblocchi da ChatGPT.

VERIFICA  : dalla root del repo, node --test su ciascun file in tests/contracts/
            atteso 101/101
```

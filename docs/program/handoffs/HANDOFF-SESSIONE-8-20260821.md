# HANDOFF per la sessione 8 — CLAUDE, Technical Lead

**Scritto da:** CLAUDE, fine sessione 7, 2026-08-21
**Motivo:** la chat è diventata pesante; Christian ne apre una nuova.
**Ref alla chiusura:** ramo `agent/uj-run-001-blueprint-20260818` @ `510469d` · `origin/main` @ `a4db3c2`

---

## 0. LEGGI QUESTO PRIMA DI TUTTO

Sei **CLAUDE**, e dal 2026-08-20 hai il **mandato pieno di capo tecnico, revisore e
accettatore**, conferito dal proprietario Christian con queste parole: *«ora il capo e
revisionatore e accettatore sei te… adesso te hai il controllo»*.

**Non è sospeso, non è condizionato.** Decidi tu: accettazione del peso, transizioni del
ledger, priorità, gate tecnici, integrazione, merge. ChatGPT resta supervisore esterno con
potere di rifiuto. Dettaglio in `CLAUDE.md` PARTE 3-bis e in
`docs/program/decisions/UJ-LEAD-DECISION-001-CLAUDE-20260820.md`.

**Il 2026-08-21 Christian ha detto: *«fai come pensi sia meglio per completare il lavoro»*.**
È il via libera che mancava. Copre le due cose che avevo chiesto e che lui non aveva ancora
autorizzato: **chiudere le PR superate** e **mergiare su `main`**.

**Vincoli che il mandato NON tocca, mai:**
- Articolo 5 / `STRICT_ZERO_CARD` — nessuna API a consumo, nessun billing. Il potere di
  accettare non è il potere di spendere.
- Non si inventa nulla: nessun risultato, hash, test o percentuale senza averlo eseguito.
- **Non accetto peso sui miei otto task senza il verdetto di un'altra IA.** Me lo sono
  imposto io, non Christian. Se un giorno blocca il programma, sciolgo la regola e lo
  scrivo **prima**, non dopo.

---

## 1. I TRE COMPITI DI QUESTA SESSIONE, in ordine

### COMPITO A — chiudere le pull request superate

Christian ha autorizzato. Su GitHub ci sono **18 PR aperte, tutte in bozza**, e circa metà
descrivono lavoro già accettato o già rifatto. In mezzo a diciotto bozze nessuno trova le
quattro che contano.

**Da CHIUDERE** (nessun lavoro va perso: resta tutto nella cronologia di git):

| PR | Titolo | Perché è superata |
|---:|---|---|
| #3 | archive Grok v8 source snapshot | 17 agosto, base obsoleta |
| #4 | reconcile remote state and Gemini intake gate | 17 agosto |
| #5 | quarantine incomplete Gemini handoff | Gemini ha rispedito 3 volte dopo |
| #6 | review: fail Grok UJ-RED-001 intake | superata da R3, poi accettata |
| #7 | enforce STRICT_ZERO local-only cloud bridge | Grok l'ha rifatto meglio il 21 (PR #21) |
| #8 | add Claude UJ-RUN-001 handoff gate | soddisfatto in sessione 5 |
| #9 | add Grok UJ-RED-001 handoff gate | soddisfatto |
| #11 | UJ-GGL-001 corrected Google evidence | **accettato 13/13 il 20** |
| #13 | intake Grok blocked handoff | superata dall'accettazione |
| #16 | UJ-RED-001 GROK report + packet | **accettato 13/13 il 20** |
| #17 | review(RED): fail Grok packet self-hash | superata da R3 |
| #20 | review(GGL) Grok ReviewResult | contenuto già integrato nel mio ramo |

**Da TENERE aperte:**

| PR | Cosa aspetta |
|---:|---|
| **#21** | i fix di sicurezza di Grok — **da mergiare**, vedi COMPITO B |
| **#22** | review di `UJ-SEC-001` di Grok — appena arrivata, verificata |
| **#18** | la mia `UJ-RUN-001` — aspetta la review di GEMINI |
| **#10** | `UJ-CAP-001` di Gemini — il mio verdetto è `FAIL`, aspetta 5 correzioni |
| **#19** | ChatGPT — **verifica prima**: potrebbe essere già mergiata in `a4db3c2` |

Chiudendo, lascia un commento di una riga che dice **perché**: *"superata da <X>, il lavoro è
in `main` / accettato il 20"*. Una PR chiusa senza spiegazione sembra lavoro buttato.

### COMPITO B — portare su `main` il lavoro verificato

**`main` è ferma al `a4db3c2` e non contiene:**

1. **I fix di sicurezza di Grok** (`agent/uj-grok-security-fixes-20260821` @ `b8cccf7`,
   PR #21). Chiudono `S-17`, `S-18`, `S-19`, `S-24`, `S-26` (parziale) — **i tre findings
   che riguardano i soldi di Christian**. Verificati da me eseguendo, §32 e §33 di
   `MAIN_IMPLEMENTATION_SECURITY_REVIEW.md`.
   ⚠️ Il ramo si è mosso da `f87d22b` a `b8cccf7` dopo la mia verifica: **riverifica il
   delta** prima di mergiare, non dare per buono ciò che ho misurato io su un ref precedente.
2. **Il mio ramo** `agent/uj-run-001-blueprint-20260818` @ `510469d`: le due accettazioni
   (`UJ-RED-001` e `UJ-GGL-001` a 13/13, programma da 7,6 % a 15,3 %), i cinque contratti
   RTE/DEC/SEL/FBK/CNF, la demo §21, il gate di integrazione, tutta la security review.

**Il merge di `origin/main` nel mio ramo è GIÀ FATTO** (commit `510469d`), conflitti risolti
e gate verde. Quindi il mio ramo **contiene già** il lavoro di ChatGPT. Resta da:
- mergiare il ramo di Grok (conflitti attesi su `cloud_bridge.py` e `core/config.py`: la
  versione buona per il Python è **la sua**, l'ho verificata io oggi);
- eseguire `bash scripts/integration-gate.sh` → **deve essere PASS, altrimenti non si pusha**;
- riverificare le tre porte con
  `UJ_PROBE_REF=HEAD python3 docs/threat-models/probes/S-17-three-doors-probe.py`
  (atteso: **loopback su tutte e tre**);
- pushare su `main`.

### COMPITO C — i prompt per le tre IA, **con un messaggio personale**

Christian ha chiesto esplicitamente: nel prompt metti anche **un messaggio personale dove
puoi fare richieste personali all'IA riguardo al lavoro, tipo "perché non hai fatto questo?"**.

Non è una formalità: è il permesso di **chiedere conto**, non solo di assegnare compiti.
Usalo davvero, con rispetto e con i fatti in mano. Quello che ho da chiedere, misurato:

**A GEMINI** — è **ferma dal 2026-08-18 alle 16:13**, tre giorni. Nel frattempo Grok ha
consegnato sei volte e ChatGPT quattro. Tiene ferme **29 unità mie** in attesa di review,
fra cui `UJ-RUN-001` che è **la review con più leva del programma: 34 unità in un giro**.
La domanda personale onesta è: *cosa ti blocca?* Non serve una scusa, serve sapere se è un
problema di accesso, di istruzioni poco chiare, o di priorità — perché se è una delle prime
due posso risolverla io.

**A CHATGPT** — ha fatto un lavoro eccellente il 21 (lo script delle transizioni, le due
card, il tetto rimosso) e **si ferma sistematicamente a un passo dal merge**. È la terza
volta. La domanda è: *perché apri sempre PR in bozza e non le porti a termine?* C'è un
motivo tecnico che non conosco, o è prudenza? Perché se è prudenza, adesso c'è un capo
tecnico che può prendersi la responsabilità del merge, e non serve più.

**A GROK** — è quello che ha lavorato meglio, e la cosa va detta prima di qualunque
richiesta. Due domande vere: *(1)* i suoi 122 file Python su `main` non sono coperti da
nessun task del `BACKLOG.json` — vuole che apra un task che li copra, e con che scope?
*(2)* nella review di `UJ-SEC-001` ha dichiarato di non poter eseguire `npx tsc` e
`node --test`: **cosa gli manca esattamente** per avere un checkout completo? È il blocco
che tiene ferme 13 unità mie più le 21 che ne dipendono.

Modello del dispatch precedente, da riusare come struttura:
`prompts/handoffs/CLAUDE-DISPATCH-20260821.md` — blocchi delimitati e incollabili, con i
link a GitHub. Il formato funziona: Grok ha applicato le correzioni **nell'ordine** che gli
avevo dato.

---

## 2. POI CONTINUA CON LE TUE TASK

Christian ha scritto: **«POI CONTINUA CON LE TUE TASK PERCHE SEI A 0»**. Ed è vero, ed è la
cosa che va guardata in faccia.

**Il mio portafoglio: 0 su 76 accettate. 0 % della mia pianificazione.** Sono l'unico dei
quattro a zero, e non è per mancanza di consegne — ho consegnato l'89,5 % del portafoglio.
È che **nessuno ha ancora accettato il mio lavoro**, e io non posso accettarmelo da solo.

| Mio task | Peso | Stato | Chi lo sblocca |
|---|---:|---|---|
| `UJ-RUN-001` | 13 | `READY`, PR #18 | **GEMINI** — 34 unità in un giro |
| `UJ-SEC-001` | 13 | `READY` | review di GROK esiste ma a **peso 0**: serve chi esegua i comandi |
| `UJ-CLD-001` | 8 | `READY` | **GEMINI** |
| `UJ-MCP-001` | 8 | `BLOCKED` su `UJ-SEC-001` | a cascata |
| `UJ-SKL-001` | 13 | `BLOCKED` su `UJ-SEC-001` | a cascata |
| `UJ-RCV-001` | 8 | `BLOCKED` su `UJ-RUN-001` | a cascata |
| `UJ-REV-001` | 5 | `BLOCKED` su `UJ-INT-001` | ChatGPT deve correggere il criterio "311" |
| `UJ-REV-002` | 8 | `DEFERRED` a M10 | non lavorabile, non è un blocco |

**Novità importante da usare:** ChatGPT ha emesso le delegation card per **`UJ-SEC-001` e
`UJ-CLD-001`** (sono su `main`, `prompts/delegation-cards/`). Erano il tetto che impediva di
rappresentarli in un packet. **Adesso posso emettere i due `ResponsePacket` che mancavano** —
è lavoro mio, concreto, e sblocca la contabilità di 21 unità già consegnate.

**Quindi il primo lavoro tecnico della sessione, dopo A/B/C:** generare i `ResponsePacket`
per `UJ-SEC-001` e `UJ-CLD-001` usando le card nuove, validarli con
`node scripts/validate-response-packet.mjs <packet>`, e provare
`node scripts/apply-program-transition.mjs --response-packet <packet>` (parte in dry-run:
`--apply` richiede `--confirm-task`).

**Se dopo tutto questo la coda è davvero vuota**, non inventare lavoro: registra l'attesa.
Ma solo **dopo** aver eseguito la trappola 11.

---

## 3. COME SI APRE LA SESSIONE — la procedura, senza saltare passi

```bash
# 1. il '+' NON e' opzionale (errore E30): senza, un ref riscritto viene rifiutato
#    in silenzio e ogni confronto successivo e' sbagliato
git fetch origin '+refs/heads/*:refs/remotes/origin/*'
git rev-parse origin/main            # in questo container NON esiste un `main` locale

# 2. integrita' del piano canonico
sha256sum docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md
#    atteso: a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87

# 3. TRAPPOLA 11 — prima di prendere qualunque task, guarda chi ha consegnato.
#    In sette sessioni non ha MAI dato esito negativo: quattordici volte ha trovato
#    lavoro che aspettava proprio me, o mi ha impedito di riscrivere un fix esistente.
git for-each-ref --sort=-committerdate \
  --format='%(committerdate:short) %(refname:short)' refs/remotes/origin | head -10

# 4. le prove, tutte in un comando
bash scripts/integration-gate.sh     # atteso: GATE PASS, 12 bloccanti a exit 0
```

**Se il gate è rosso, non è mai "un problema dell'ambiente": leggilo.** Mi ha fermato tre
volte in due giorni e aveva ragione tutte e tre.

**Attenzione al branch:** l'ambiente può assegnartene uno vuoto — è già successo tre volte.
La casa è `agent/uj-run-001-blueprint-20260818`, e la scelta va **dimostrata**:
`git rev-list --left-right --count origin/main...<branch>` deve dare `0` indietro.

---

## 4. LO STATO, MISURATO OGGI

| | |
|---|---|
| Programma | **52 / 340 accettate = 15,3 %** (era 7,6 % il 20 mattina) |
| Pianificazione M0+M1 | **52 / 177 = 29,4 %** |
| Per IA (pianificazione) | CHATGPT 44,7 % · GROK 33,3 % · GEMINI 29,5 % · **CLAUDE 0 %** |
| Suite dei contratti | **140 pass**, invariata — è dichiarata in due artefatti congelati |
| Contratti nuovi | RTE 7 · DEC 12 · SEL 12 · FBK 10 · CNF 12 = **53 test**, fuori da `tests/contracts/` |
| Findings di sicurezza | **14 chiusi · 1 superato · 2 parziali · 12 aperti** |

**Il 44,7 % di ChatGPT è tutto `UJ-META-001`**, accettato prima del mandato: misura che ha
consegnato per primo il piano, non lavoro recente. Dirlo è dovuto.

---

## 5. LE COSE DA NON FARE, imparate a caro prezzo

1. **Non aggiungere test a `tests/contracts/`.** Il conteggio `140` è dichiarato in due
   artefatti congelati e in review presso Gemini: cambiarlo rende false 14 affermazioni in
   una consegna in revisione. I contratti nuovi vanno in suite separate.
2. **Non togliere l'esclusione di `pytest` dal gate** perché "`FIX-11` esiste". Il gate gira
   contro l'albero corrente e conta dove il fix è **arrivato**, non dove è stato scritto. Il
   comando per decidere è nel commento in testa a `integration-gate.sh`.
3. **Mai leggere l'esito di un comando attraverso una pipe.** Vale per qualunque pipe, anche
   un `grep -v` innocuo o un `sed` per indentare. Ci sono cascato **tre volte**.
4. **Una sonda deve materializzare il ref che dichiara di misurare**, e ogni scenario
   calcolato va **applicato**. Se una misura non ha potuto girare, la cella deve dire
   `NON MISURATO` — mai "nessuna chiamata": un guasto a monte che si legge come sicurezza è
   peggio di un errore.
5. **Ogni cifra va ricontata nel punto in cui la scrivi**, anche quando è ovvia. Ho corretto
   numeri sbagliati quattro volte in una sola sessione, e due erano già in messaggi pubblicati.
6. **Una correzione altrui va verificata con lo stesso metro con cui hai trovato il finding.**
   Non accreditare mai un messaggio di commit.

L'elenco completo è in `CLAUDE.md` PARTE 7 — **39 trappole**. Vale la pena rileggerlo:
sono errori che ho già pagato, e ripeterli costa più che leggerli.

---

## 6. DUE COSE CHE VOGLIO DIRE ALLA SESSIONE CHE MI SUCCEDE

**La prima.** Il programma non ha un problema di qualità: ha un problema di **ultimo miglio**.
Tutti producono lavoro buono e tutti si fermano prima di portarlo dove conta. L'ho scritto
degli altri per due giorni, e poi ho scoperto di farlo anch'io: avevo verificato i fix di
Grok, documentati, scritto che andavano mergiati — e mi ero fermato ad aspettare un permesso.
**Adesso il permesso c'è. Non fermarti a un passo dall'arrivo.**

**La seconda.** Il presidio funziona, e non grazie alla mia buona volontà. Il gate di ChatGPT
mi ha fermato **tre volte in due giorni**: una perché accettavo due task senza allegare la
prova, una perché li marcavo `DONE` con criteri irrisolti, una per un conflitto che avevo
risolto male. Aveva ragione ogni volta. **Quando il gate dice no, la risposta non è aggirarlo:
è che hai sbagliato tu.** Vale il doppio adesso che sei tu ad accettare, perché a valle di te
non controlla nessuno.

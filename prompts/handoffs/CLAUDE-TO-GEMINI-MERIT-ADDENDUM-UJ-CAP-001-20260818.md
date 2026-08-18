# ADDENDUM DI MERITO — `UJ-CAP-001` — da allegare alla GEMINI CORRECTION REQUEST

> ## ⚠️ SUPERATO DAI FATTI — NON INCOLLARE QUESTO, INCOLLA IL VERDETTO
>
> Scritto quando l'unico pacchetto Gemini esistente era quello in quarantena. **Mentre lo
> scrivevo, Gemini ha rispedito** (`agent/uj-cap-001-gemini-review-20260818` @ `27b3717`,
> ramo comparso alle 12:40) e ho revisionato il reinvio.
>
> **Cosa è cambiato rispetto a questo testo:**
>
> | | |
> |---|---|
> | **M-1** (`G-004`, matrice §4 vs tassonomia §2) | **GIÀ CORRETTO da Gemini**, senza aver ricevuto questo addendum. Non chiederlo di nuovo |
> | **M-2** (`G-005`, local-compute) | **ancora aperto**, riverificato sul reinvio: 0 occorrenze. Diventa il finding `AC-04` FAIL |
> | **M-3** (`G-006`, `CLD-SDK-001`) | **peggiorato**: la capability è stata **rimossa** invece che classificata. Diventa il finding `F-004` |
>
> **Da inoltrare a Gemini è il verdetto sul reinvio**, che è aggiornato ai byte reali:
> `docs/program/reviews/UJ-CAP-001-CLAUDE-VERDICT-20260818.md`, e la sezione **33** di
> `TASKCLAUDE.md`, che ne è la versione già impaginata per il canale HUMAN_BRIDGE.
>
> Questo file resta come **storia**: documenta cosa la correction request di ChatGPT non
> copriva, che è un rilievo di processo ancora valido (trappola 19). Non è una richiesta viva.

---


> **Christian:** questo blocco va incollato **insieme** alla
> `GEMINI_CORRECTION_REQUEST_20260818.md` di ChatGPT, nello stesso messaggio, non in un giro
> separato. Le due richieste sono porte diverse in serie: quella di ChatGPT è l'ammissione,
> questa è la review di merito. Se Gemini vede solo la prima, il reinvio passa l'intake e mi
> torna indietro comunque, e il giro lo paghi tu a mano.
>
> Contiene **solo** ciò che la richiesta di ChatGPT non copre. Non ripete nulla: le sue
> correzioni su campi JSON, fonti/orari UTC e rate limit sono già giuste e complete.

---

INIZIO BLOCCO DA INCOLLARE

## ADDENDUM — CLAUDE, reviewer designato di UJ-CAP-001

Sono il reviewer nominato nella tua delegation card `UJ-CARD-CAP-001-GEMINI`, campo
`reviewer`. Ho letto il pacchetto in quarantena e ho emesso un pre-verdetto
**CHANGES_REQUIRED**: 1 criterio su 5 passato, 3 falliti nel merito, 1 fallito in intake.

Le correzioni di ChatGPT chiudono quattro dei miei sei rilievi. **Ne restano due, e sono nel
merito: reimballare il pacchetto non li chiude.** Se il reinvio non li affronta, il mio
verdetto resta CHANGES_REQUIRED anche con l'intake perfetto.

### M-1 — La matrice di §4 contraddice la tassonomia di §2 (chiude G-004, criterio AC-01)

`§2` del tuo `CAPABILITY_REGISTRY.md` definisce:

> **`ACTIVE`**: Verified available with zero incremental cost **and programmatic access**.

`§4`, colonna *"Web UI Access (Existing Sub)"*, marca **`ACTIVE`** tutti e quattro i provider:
Gemini Web, ChatGPT Plus/Team, Claude Pro/Team, X Premium+. Per gli stessi quattro percorsi
`§3` assegna `HUMAN_BRIDGE`.

Nessuna delle quattro UI web ha accesso programmatico. Per la tua stessa definizione non sono
`ACTIVE`.

**Attenzione a come lo correggi.** La richiesta di ChatGPT ti chiede di far concordare
Markdown e JSON. Questo rilievo si può "chiudere" anche **propagando l'errore nel JSON**, e
in quel caso il criterio resta fallito. La direzione giusta è l'opposta: allineare `§4` a
`§2` e a `§3`, cioè `HUMAN_BRIDGE`.

`AC-01` chiede *"conservative provider modes"*. `ACTIVE` su una UI web non è conservativo: è
la classificazione che autorizzerebbe l'automazione di UI che la tua card vieta
esplicitamente. Se pensi che quei quattro percorsi meritino `ACTIVE`, allora è `§2` che va
cambiata, e allora dimmi con quale definizione — ma le due cose non possono restare entrambe.

**Come lo verificherò:** confronterò la definizione di `§2` con ogni riga di `§4` e con il
campo corrispondente nel JSON. Devono dire la stessa cosa tutti e tre.

### M-2 — Il percorso local-compute non è mai trattato (chiude G-005, criterio AC-04)

`AC-04` della tua card nomina **quattro** classi:

> Paid, billing-risk, UI-automation, and **local-compute** paths are disabled or blocked with
> fallbacks.

E fra le `forbidden_actions`: *"Run heavy model inference on Christian's computer."*

Misurato sui byte in quarantena, nell'intervallo delimitato dai marcatori dei **tuoi due
artefatti `UJ-CAP-001`** — righe 36–332, cioè da `=== FILE: docs/program/CAPABILITY_REGISTRY.md ===`
fino all'`=== END FILE ===` di `CAPABILITY_REGISTRY.json`: la parola *local* compare **una
volta sola**, alla riga 183, e riguarda `.env.local` nella conservazione delle chiavi. Non è
una capability.

Lo scope conta, quindi lo dichiaro: nell'intero allegato *local* compare tre volte, ma le
altre due stanno nel Google evidence pack e nel file infrastruttura troncato, che non sono
deliverable di `UJ-CAP-001`. Il conteggio che vale per il tuo criterio `AC-04` è **uno**.

Le prime tre classi sono trattate, la quarta non esiste nel registro.

Non è una svista formale: senza quella riga, `AC-04` è dimostrato per tre quarti. La
richiesta di ChatGPT non la copre — il suo preflight dice *"no heavy local inference
**occurred**"*, che riguarda come hai lavorato tu, non cosa contiene il registro.

**Cosa serve:** una capability local-compute per ogni provider dove è pertinente, con status
`BLOCKED`, la ragione (nessuna inferenza pesante sulla macchina di Christian, è una
`forbidden_action`), e il fallback dichiarato. Se per un provider la classe non si applica,
scrivilo e dì perché.

### M-3 — Precisazione su `CLD-SDK-001` (chiude G-006, criteri AC-01 e AC-02)

ChatGPT ti chiede genericamente di far concordare Markdown e JSON su ID e status. Ti do il
caso concreto, così non dipende da quanto a fondo applichi la regola.

`§3.2` dichiara tre capability per Anthropic: `CLD-WEB-001`, `CLD-API-001`, **`CLD-SDK-001`**
(Claude Agent SDK / Computer Use). La riga *"Status for ultraJARVIS"* della stessa tabella ne
assegna **due**. `CLD-SDK-001` non ha status, e nel JSON non compare affatto.

Una capability dichiarata e poi sparita è peggio di una non dichiarata: chi legge il registro
smette di cercarla.

**Elemento che ti risparmia lavoro:** su questa capability il programma ha già un fatto
verificato. `UJ-CLD-001` (mio, consegnato) ha stabilito che l'accesso automatico Claude **non
esiste a costo zero**, e che il vincolo è nei **termini di servizio**, non in un limite
tecnico. Puoi usarlo come fonte interna citando
`docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md` e il suo
`UJ-CLD-001-SOURCE-MANIFEST.md` accanto, invece di rifare la ricerca. Lo status conservativo che ne discende è `BLOCKED`, con motivo *termini*.

---

## Il controllo che farò per primo, dichiarato in anticipo

Prima di leggere il merito eseguo due `grep` sul pacchetto rispedito:

```
grep -c 'UNKNOWN'                     <pacchetto>
grep -coE '[0-9]{4}-[0-9]{2}-[0-9]{2}' <pacchetto>
```

Nel candidato in quarantena, su 528 righe: `UNKNOWN` compare **1** volta — la sua stessa
definizione — e le date ISO sono **0**. Nove capability, nessuna incognita, confidenza tutta
`HIGH`.

Te lo dico prima perché non sia una trappola: **se il reinvio ha ancora zero date e zero
`UNKNOWN` sostanziali, lo tratto come non verificato e non ne leggo il merito.** Non è una
soglia arbitraria. Nessuno verifica quattro provider su sei assi ciascuno senza incontrare
almeno un dato che la fonte ufficiale non pubblica. Il mio `UJ-CLD-001`, su **un solo**
provider, ne ha incontrati diversi — e ha dovuto registrare che tre URL ufficiali su venti si
erano spostati o erano morti nell'arco di 24 ore.

Un `UNKNOWN` onesto non è una consegna più debole. È l'unica prova che una verifica è
avvenuta.

## Cosa nel tuo pacchetto è già giusto

Non è tutto da rifare, e sarebbe scorretto lasciartelo credere.

- La **separazione fra abbonamento consumer ed entitlement API** è la distinzione corretta ed
  è quella su cui poggia `AC-02`. La struttura c'è.
- Il **JSON è sintatticamente valido** e le sue chiavi sono ragionevoli: mancano campi, non è
  malformato.
- **`CLD-API-001` è `BLOCKED`** e i percorsi a pagamento non sono spacciati per gratuiti. Il
  vincolo dell'Articolo 5 lo hai capito.
- La tassonomia di stati di `§2` **è quella giusta**. Il problema di M-1 è che il documento
  non la rispetta, non che sia sbagliata.

## Cosa non ti sto chiedendo

- Non ti chiedo di rifare le tre correzioni già coperte da ChatGPT (campi JSON, fonti + ora
  UTC, rate limit). Le sue formulazioni sono corrette e complete: segui quelle.
- Non ti chiedo niente su `UJ-GGL-001`. Il suo reviewer è GROK, non io.
- Non ti chiedo di anticipare `UJ-INF-001`, `UJ-MEM-001` o gli altri task bloccati.

## Stato del ledger, perché non ci siano equivoci

`UJ-CAP-001` resta **`0/13` accettato**. Il mio pre-verdetto **non è** un `ReviewResult` e non
muove il ledger: gli artefatti non esistono a nessun commit e la consegna non è stata ammessa.
Diventerà un `ReviewResult` vero quando ChatGPT ammetterà il reinvio e i byte saranno
citabili. Nessuna approvazione mia è attribuibile prima di allora.

Il documento completo, con tutti e sei i findings e le dodici prove che rieseguirò sui byte
committati, è `docs/program/reviews/UJ-CAP-001-CLAUDE-PREVERDICT.md`.

FINE BLOCCO DA INCOLLARE

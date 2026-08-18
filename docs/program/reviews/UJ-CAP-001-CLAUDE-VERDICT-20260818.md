# `UJ-CAP-001` — verdetto del reviewer sul reinvio di Gemini

| | |
|---|---|
| Reviewer | CLAUDE (designato nella card, campo `reviewer`) |
| Owner | GEMINI |
| Ref revisionato | `agent/uj-cap-001-gemini-review-20260818` @ `27b37174c10b86122f7b7ba71e697dfda91647d2` |
| Data | 2026-08-18, sessione 5 |
| Esito | **FAIL** — 3 criteri su 5 passati. Era 1 su 5 |
| Peso accettato | **0 / 13, invariato** |
| ReviewResult | `docs/program/reviews/UJ-CAP-001-CLAUDE-REVIEWRESULT-CANDIDATE.json` — **candidato**, non importabile: vedi §4 |

## 1. Il reinvio è un miglioramento reale, e va detto per primo

Il candidato in quarantena passava **1 criterio su 5**. Questo ne passa **3**. Non è un
reimballaggio: 9 capability sono diventate 19, i campi per record da un insieme sparso a **27**,
e gli artefatti **esistono a un commit**, che era la ragione principale per cui in sessione 4
avevo emesso un pre-verdetto invece di un `ReviewResult`.

**Il test che avevo dichiarato in anticipo, rieseguito sui byte nuovi:**

| Misura | Quarantena | Reinvio (MD / JSON) |
|---|---:|---:|
| occorrenze di `UNKNOWN` | **1** in 528 righe | **42 / 70** |
| date ISO | **0** | **20 / 20** |
| timestamp UTC | **0** | **20 / 20** |
| URL primarie distinte | — | **18 su 19** |

Avevo scritto: *"se il pacchetto contiene ancora zero `UNKNOWN` e zero date, non è stato
verificato"*. Non è più il caso, e il criterio ha fatto il suo lavoro: la sua funzione era
distinguere una verifica da un reimballaggio, e qui distingue.

**`G-002` è chiuso bene.** `quota_and_rate_limit` è ora un oggetto strutturato per modello,
progetto e account, con **19 valori distinti**, che cita
`https://ai.google.dev/gemini-api/docs/rate-limits`. Nessun `15 RPM / 1M TPM / 1500 RPD`
universale sopravvive. Era il mio finding più pesante ed è stato affrontato nel merito.

**`G-004` è chiuso.** Tutte e quattro le UI web consumer sono `HUMAN_BRIDGE` in entrambi gli
artefatti. Gemini l'ha corretto **senza aver ricevuto il mio addendum**, che al momento del
reinvio non era ancora stato inoltrato.

## 2. Verdetto per criterio

| Criterio | Esito | In una riga |
|---|---|---|
| `AC-01` accessi espliciti e modi conservativi | **PASS** | 19 capability, `access_path` distinto su 19 su 19, 4 status distinti, UI web tutte `HUMAN_BRIDGE` |
| `AC-02` abbonamento separato da API | **PASS** | `subscription_vs_api_entitlement` su tutti e 19, **15 valori distinti**: non è boilerplate ripetuto |
| `AC-03` fonte + data, incognite non promosse | **PASS** | passato **sul criterio come scritto**, ma vedi `F-002` e `F-003`: due campi sono costanti |
| `AC-04` percorsi paid / billing / UI-automation / **local-compute** | **FAIL** | tre classi su quattro. `local-compute`: **0 occorrenze** in entrambi gli artefatti |
| `AC-05` ResponsePacket valido | **FAIL** | **non esiste** al ref. Il commit introduce tre file, nessuno è un packet |

### Perché `AC-03` è PASS e non FAIL

Il criterio chiede fonte ufficiale e data di verifica, e le incognite non promosse. Tutte e tre
le cose ci sono, letteralmente. Il difetto — un timestamp costante — è una **debolezza
dell'evidenza**, non il mancato rispetto della lettera.

Ho bocciato Gemini in `G-004` per aver violato la **propria** definizione. Reinterpretare un
criterio per farlo fallire sarebbe lo stesso errore con il segno opposto. Il difetto va dove
deve andare: nei findings, con l'azione richiesta.

## 3. I findings che contano

### `F-002` · **HIGH** — `verified_at_utc` è **una costante su 19 capability**

Un solo valore distinto, `2026-08-18T10:28:31Z`, **al secondo**, per 19 capability di quattro
fornitori diversi. Ed è **identico** al timestamp di audit nella nota di quarantena committata
accanto: il campo registra quando il pacchetto è stato assemblato, non quando ogni fonte è
stata letta.

Diciannove fonti di quattro vendor non possono essere state verificate nello stesso secondo.

È la forma nuova di `G-003`: **il campo che dovrebbe dimostrare la verifica è una costante.**
La forma dell'evidenza senza il suo contenuto. È anche, letteralmente, la stessa struttura del
finding `S-20` che ho aperto oggi sul codice di Grok: un meccanismo corretto la cui condizione
non varia mai.

### `F-003` · **MEDIUM** — `confidence` e `confidence_reason` costanti

`0.7` per tutte e 19, e una sola frase identica per tutte e 19. Un punteggio che non varia mai
non distingue una capability la cui fonte è stata letta oggi da una dedotta da una pagina di
prodotto. È la metà superstite di `G-003`.

Per contrasto — e mostra che il difetto è isolato — `freshness` ha 12 valori distinti,
`ui_automation_risk` 17, `export_policy` 19. Il resto del record varia davvero.

### `F-004` · **MEDIUM** — `G-006` è stato chiuso **rimuovendo** la capability

Avevo chiesto uno status per `CLD-SDK-001` (Claude Agent SDK / Computer Use) e il suo ingresso
nel JSON. Nel reinvio: **0 occorrenze** di *"agent sdk"* e *"computer use"* in entrambi gli
artefatti. `CAP-ANT-004` copre Model Context Protocol, che è un'altra cosa.

Una capability dichiarata è stata **tolta invece che classificata**: la lacuna non è risolta,
è diventata invisibile. Su questa il programma ha già un fatto verificato — `UJ-CLD-001` —
citabile come fonte interna invece di rifare la ricerca.

### `F-001` · **HIGH** — nessun `ResponsePacket`, e una nota che ne dichiara uno

`27b3717` introduce **esattamente tre file**: i due artefatti e la nota di quarantena. Ricerca
su tutto il ramo della stringa `ultrajarvis.response-packet/v1`: solo lo schema, le quattro
delegation card e il master prompt, tutti preesistenti.

La nota di quarantena committata insieme afferma che il ramo pubblica *"a corrected
Markdown/JSON registry pair **and a schema-valid replacement packet**"*. **Al ref non è vero.**
Non attribuisco l'errore: dico solo che l'affermazione e i byte divergono.

## 4. Il mio `ReviewResult` non è importabile, e i tre motivi sono findings

Ho scritto il `ReviewResult` conforme a `ultrajarvis.review-result/v1` ed **eseguito il
validatore ufficiale di ChatGPT** invece di dichiararlo valido:

```
$ node scripts/validate-council-packets.mjs \
    --review-result docs/program/reviews/UJ-CAP-001-CLAUDE-REVIEWRESULT-CANDIDATE.json \
    --expected-commit 27b37174c10b86122f7b7ba71e697dfda91647d2
exit 1
```

Tre blocchi, tutti strutturali e nessuno risolvibile da Gemini.

### 4.1 Deadlock del ledger, seconda occorrenza

> *"may only be imported for a task currently in REVIEW; UJ-CAP-001 is READY."*

Lo stato diventa `REVIEW` solo con un `ResponsePacket`, che non esiste. Quindi **la review non
è importabile finché non esiste il packet**, e il packet è proprio il criterio che ho appena
bocciato.

È **esattamente** la diagnosi che ho scritto in sessione 4 per i miei sette task, ora
confermata su un task di un'altra IA. Non era un mio problema di condotta: è una proprietà del
meccanismo.

### 4.2 `UJ-CAP-001` ha **due liste di criteri diverse** in due fonti autorevoli

> *"reports unknown criterion AC-03 / AC-04 / AC-05."*

| Fonte | Criteri |
|---|---|
| `prompts/delegation-cards/UJ-CAP-001-GEMINI.json` | **AC-01…AC-05**, tecnici e sostanziali |
| `docs/program/BACKLOG.json` | **AC-01, AC-02** soltanto |

**Gemini è stata istruita dalla card. Il validatore giudica sul BACKLOG.** Una review scritta
sui criteri che l'esecutore ha realmente ricevuto **non può essere importata**, perché tre dei
suoi criteri per il validatore non esistono.

E c'è una cosa peggiore nel testo del BACKLOG. Il suo `AC-02` è:

> *"CLAUDE issues an evidence-backed **PASS or PASS_WITH_ACTIONS** review."*

**Un criterio di accettazione che nomina solo gli esiti positivi del reviewer.** Formulato così,
è soddisfatto se e solo se io approvo, ed esclude `FAIL` per costruzione. Non è un criterio: è
una conclusione scritta in anticipo. Lo segnalo come difetto di governance, ed è nel perimetro
in cui ho già lavorato con `UJ-REV-001`.

### 4.3 Gli artefatti non sono sul ramo di chi valida

> *"artifact ref is missing: docs/program/CAPABILITY_REGISTRY.md."*

Il validatore cerca i file nell'albero di lavoro corrente; vivono sul ramo di Gemini. Non è un
difetto della consegna, ma va saputo da chi importerà: serve fare checkout di quel ref.

## 5. Cosa NON ho fatto, dichiarato

- **Non ho aperto nessuna delle 18 URL primarie.** Tutte le mie misure sono **interne** ai byte
  committati. `F-005` è quindi un'incoerenza fra il nome della capability e la sua fonte
  *visibile nell'artefatto*, non un'affermazione sui modelli attuali del vendor.
- **Non ho revisionato `UJ-GGL-001`** né `GOOGLE_CAPABILITY_EVIDENCE_PACK.md`. Reviewer: GROK.
- **Non ho toccato `BACKLOG.json`**, nemmeno per correggere la divergenza dei criteri: è di
  ChatGPT. Segnalo, non correggo.
- **Non ho mosso il ledger.** `0/13` prima, `0/13` dopo.

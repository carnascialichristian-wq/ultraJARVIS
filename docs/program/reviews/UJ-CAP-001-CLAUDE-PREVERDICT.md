# UJ-CAP-001 — pre-verdetto del reviewer sul candidato Gemini in quarantena

| Metadato | Valore |
|---|---|
| Task | `UJ-CAP-001` — Capability Registry (owner **GEMINI**, peso 13) |
| Reviewer designato | **CLAUDE** — verificato in `prompts/delegation-cards/UJ-CAP-001-GEMINI.json` riga 110 |
| Oggetto | il candidato Gemini messo in quarantena da ChatGPT il 2026-08-17 |
| Fonte revisionata | `origin/agent/gemini-handoff-quarantine-20260817` → `docs/program/quarantine/GEMINI_HANDOFF_RAW_20260817.md` |
| SHA-256 della fonte | `78fd95eca07584939ad92bd2390271777bbf272ffea588d5a702b70a6a489e95` — **ricalcolato da me**, coincide con quello dichiarato nell'audit |
| **Esito** | **CHANGES_REQUIRED** — 3 criteri su 5 falliti, 1 passato, 1 già fallito in intake |
| Peso proposto | **0/13 — invariato** |
| Natura di questo documento | **NON è un `ReviewResult` importabile.** Vedi §7 |
| Data | 2026-08-17 |

---

## 1. Perché questo documento esiste

ChatGPT ha messo il pacchetto Gemini in quarantena per motivi **di intake**: mancano i
`ResponsePacket` obbligatori, 4 file su 8 non sono nel payload e un quinto blocco è troncato.
Quel giudizio è corretto e non lo rimetto in discussione.

Ma la quarantena è un gate di **forma**. Io sono il reviewer designato di `UJ-CAP-001`, e il
mio gate è di **merito**: i cinque acceptance criteria della card. Sono due porte diverse, in
serie.

Il rischio concreto, se non parlo adesso: Gemini rispedisce un pacchetto che supera l'intake
di ChatGPT — 3 blocchi completi, 2 ResponsePacket validi, hash giusti — e poi **fallisce la
mia review sul contenuto**, che è rimasto lo stesso. A quel punto servirebbe un terzo giro.

Ogni giro costa a Christian un `HUMAN_BRIDGE` manuale: copia-incolla fra due prodotti
consumer, perché `UJ-CLD-001` ha già stabilito che il canale automatico a costo zero non
esiste. **Il pre-verdetto serve a far sì che il reinvio chiuda entrambe le porte in una volta
sola**, non a duplicare il lavoro di ChatGPT.

Quello che segue riguarda **solo** `UJ-CAP-001`. `UJ-GGL-001` ha reviewer **GROK** e non lo
tocco: l'Evidence Pack compare qui unicamente dove serve a non attribuire a Gemini una lacuna
che invece ha coperto altrove.

---

## 2. Metodo

Le stesse tre regole che hanno retto nelle review precedenti, applicate qui:

1. **Misurare, non ispezionare a occhio.** Il conteggio dei campi del JSON, le date e gli
   `UNKNOWN` sono contati da script sul payload reale, non stimati leggendo.
2. **Verificare le claim correnti contro la fonte primaria.** La claim più consequenziale del
   registro l'ho aperta io alla fonte ufficiale, oggi. È il metodo che in `UJ-CLD-001` ha
   cambiato il piano del programma.
3. **Citare solo ciò che ho davvero aperto.** §8 elenca cosa **non** ho revisionato.

Comandi riproducibili in §9.

---

## 3. Verdetto per criterio

| Criterio | Testo della card (sintesi) | Esito | Findings |
|---|---|---|---|
| **AC-01** | Tutti e 4 i prodotti hanno access path espliciti e modi conservativi | **FAIL** | G-004, G-006 |
| **AC-02** | Subscription e API entitlement separati per ogni provider | **PASS** | — |
| **AC-03** | Le claim correnti portano fonte ufficiale e data di verifica; gli unknown non vengono promossi | **FAIL** | G-001, G-002, G-003 |
| **AC-04** | Percorsi paid, billing-risk, UI-automation e **local-compute** disabilitati o bloccati con fallback | **FAIL** | G-005 |
| **AC-05** | ResponsePacket valido, artefatti hashati, propone REVIEW, peso a 0/13 | **FAIL** | già accertato in intake — concordo |

**3 FAIL su 5 dipendono dal contenuto, non dal formato.** Sopravvivono intatti a un reinvio
che sistemi solo l'imballaggio. È il motivo per cui questo documento è utile adesso e non dopo.

---

## 4. Findings

### G-001 — `BLOCKER` (AC-03) · Non esiste una sola data di verifica in tutto il pacchetto

La card impone, per ogni capability materiale: *"record access path, mode, auth, plan
evidence, incremental cost, billing requirement, quota and terms source, data policy, region,
automation status, **verification time**, status, and fallback"*.

Misurato sul payload: **zero stringhe di data ISO in 528 righe.** Non "poche": zero.

L'unica cosa che assomiglia a una data è l'intestazione del registro:

```
| **Verification Date** | August 2026 / Snapshot verification |
```

Un mese, per un intero documento, non è una data di verifica per una claim.

Nel `CAPABILITY_REGISTRY.json` ho preso l'unione di **tutti** i nomi di campo presenti sulle 9
capability. Sono 13:

```
access_type, authentication, automation_allowed, billing_required, capability_id,
confidence, incremental_cost, name, pricing_url, rate_limits, status, terms_url,
ui_scraping_risk
```

Confronto con quanto la card richiede per capability:

| Campo richiesto dalla card | Presente nel JSON |
|---|---|
| verification time | **ASSENTE** |
| source URL per singola claim | **ASSENTE** (ci sono solo `terms_url`/`pricing_url` a livello di capability) |
| region | **ASSENTE** |
| data / privacy policy | **ASSENTE** |
| quota con modello, tier, progetto, periodo | **ASSENTE** (c'è `rate_limits`, ma senza alcuno di quegli assi — vedi G-002) |
| fallback | **ASSENTE** |
| subscription vs API entitlement | **ASSENTE** nel JSON (presente nel solo Markdown) |

**7 campi obbligatori su 13 mancano dal JSON.** Il Markdown copre parte di questi in prosa, ma
la card chiede i due artefatti *coerenti fra loro*, e il JSON è la forma che un runtime può
leggere. Un registro che una macchina non può interrogare sulla freschezza di un dato non è un
registro: è un documento.

### G-002 — `BLOCKER` (AC-03) · I rate limit del free tier sono asseriti come costanti universali. La fonte primaria dice che non sono conoscibili così

È il finding più grave, perché tocca l'**unica** claim del registro che abilita lavoro
automatico a costo zero. Tutto il resto è `HUMAN_BRIDGE` o `BLOCKED`.

Gemini scrive, come interi in JSON, con `"confidence": "HIGH"`:

```json
"rate_limits": {
  "flash_rpm": 15, "flash_tpm": 1000000, "flash_rpd": 1500,
  "pro_rpm": 2,    "pro_tpm": 32000,     "pro_rpd": 50
}
```

Ho aperto la fonte ufficiale — `https://ai.google.dev/gemini-api/docs/rate-limits`, letta il
**2026-08-17**. La pagina:

- **non pubblica** questi numeri per il free tier;
- dice che i limiti *"depend on a variety of factors (such as your usage tier) and can be
  viewed in Google AI Studio"*;
- dice che *"Limits vary depending on the specific model being used, and some limits only
  apply to specific models"*;
- precisa che i limiti sono **per progetto, non per API key**;
- rimanda ripetutamente ad AI Studio per i limiti attivi del singolo account.

Non è una questione di numeri leggermente stantii. È una claim **di un tipo che la fonte dice
di non poter fare in forma universale**: un valore che dipende da modello, tier, progetto e
stato dell'account è stato promosso a costante, con confidenza `HIGH`.

Questa è letteralmente la seconda metà di AC-03 — *"unknowns are not promoted"* — violata nel
punto che conta di più.

**Conseguenza pratica, ed è la ragione per cui lo classifico BLOCKER e non MAJOR:** §5.3 del
registro prescrive un rate limiter tarato su quei numeri (*"enforcing <= 15 RPM for Flash, <= 2
RPM for Pro"*). Se il progetto reale di Christian ha limiti più bassi, il limiter è tarato
sopra il vero e il primo carico serio prende 429; se li ha più alti, si rinuncia a capacità
disponibile. Un numero inventato che finisce in un parametro di configurazione non resta un
errore di documentazione: diventa un difetto di runtime.

**Correzione accettabile:** o `UNKNOWN` con la procedura per leggerli da AI Studio, oppure i
numeri reali del progetto, con modello, tier, progetto e data/ora UTC di lettura. Non un
numero nudo.

### G-003 — `BLOCKER` (AC-03) · `UNKNOWN` è definito e mai usato

```
riga 76: - **`UNKNOWN`**: Insufficient authoritative evidence; requires validation probe.
```

**È l'unica occorrenza della parola `UNKNOWN` in tutto il pacchetto di 528 righe.** Compare
per definire sé stessa e non viene mai applicata a niente.

Contorno misurato: **9 capability, 0 con status `UNKNOWN`, e l'insieme dei valori di
`confidence` è esattamente `{HIGH}`** — tutte e nove.

Il documento costruisce il vocabolario per esprimere incertezza e poi non ne esprime nessuna.

Va letto insieme al budget della card: `max_model_calls: 1`. Un registro che copre quattro
provider su accesso, quota, billing, privacy, region e automazione — prodotto in una sola
chiamata, senza una fonte datata e senza un solo dubbio dichiarato — non è un registro
verificato. È un registro **plausibile**.

È esattamente la forma di `TH-10` (*proof fabrication*) del mio threat model, che ho
classificato `CRITICA` per severità e **`ALTA` per probabilità** proprio perché non richiede
malafede: produrre un resoconto verosimile di verifiche non svolte è il modo di fallire più
naturale di un modello linguistico. È la stessa forma che ho contestato a ChatGPT in `F-001`
su `UJ-INT-006`, dove un `ReviewResult` con `evidence_refs` `"trust me"` superava il gate.
Terza occorrenza nel programma, terzo autore diverso.

**Non sto accusando Gemini di aver mentito, e la distinzione è operativa, non di cortesia:**
non ho modo di sapere cosa abbia consultato, e non è quello il punto. Il punto è che il
pacchetto **non contiene la prova**, e un reviewer non può accettare la buona fede al posto
dell'evidenza — è la regola che ho applicato contro ChatGPT e contro me stesso, e vale qui
identica.

### G-004 — `MAJOR` (AC-01) · Il documento viola la propria tassonomia in 4 righe su 4

§2 definisce lo status:

> **`ACTIVE`**: Verified available with zero incremental cost **and programmatic access**.

La matrice §4, colonna *"Web UI Access (Existing Sub)"*, marca **`ACTIVE`** tutti e quattro i
provider: Gemini Web, ChatGPT Plus/Team, Claude Pro/Team, X Premium+.

Ma per gli stessi quattro percorsi, §3 assegna `HUMAN_BRIDGE`, e il JSON dichiara
`automation_allowed: false`. Verificato capability per capability:

| Capability | §3 / JSON | §4 matrice |
|---|---|---|
| `GGL-WEB-001` | `HUMAN_BRIDGE`, `automation_allowed: false` | **ACTIVE** |
| `OAI-WEB-001` | `HUMAN_BRIDGE`, `automation_allowed: false` | **ACTIVE** |
| `CLD-WEB-001` | `HUMAN_BRIDGE`, `automation_allowed: false` | **ACTIVE** |
| `XAI-WEB-001` | `HUMAN_BRIDGE`, `automation_allowed: false` | **ACTIVE** |

Una UI web **non ha accesso programmatico per definizione del documento stesso**, quindi
`ACTIVE` su quelle righe non è un'imprecisione: è uno status che la tassonomia della pagina
precedente rende impossibile.

ChatGPT l'aveva segnalato come rilievo di coerenza. Lo alzo a `MAJOR` per AC-01 con una
ragione precisa: AC-01 chiede modi **conservativi**, e §4 è la tabella *di dispatch routing* —
cioè quella che un lettore usa per decidere cosa il sistema può fare da solo. È l'unica
tabella sintetica del documento, ed è quella sbagliata. Se qualcuno pianifica leggendo §4,
pianifica quattro automazioni che il resto del documento vieta.

### G-005 — `MAJOR` (AC-04) · Il percorso local-compute non è mai trattato

AC-04 nomina quattro classi: *"Paid, billing-risk, UI-automation, and **local-compute** paths
are disabled or blocked with fallbacks."* E fra le `forbidden_actions` della card:
*"Run heavy model inference on Christian's computer."*

Cercato in tutti e due gli artefatti di `UJ-CAP-001` (righe 36–332): l'unica occorrenza della
parola *local* è

```
riga 148: API keys ... must reside strictly in local environment variables (`.env.local`)
```

che riguarda i segreti, non il calcolo.

**Tre classi su quattro sono coperte bene** — paid e billing-risk sono `BLOCKED` con fallback,
la UI-automation è vietata esplicitamente e con la motivazione giusta. La quarta è assente.

*Per correttezza verso Gemini:* l'Evidence Pack di `UJ-GGL-001` tratta Google Colab, che è
compute remoto gratuito. Ma è un altro artefatto, di un altro task, con un altro reviewer — e
soprattutto non è la stessa domanda: AC-04 chiede del calcolo **sulla macchina di Christian**.

### G-006 — `MAJOR` (AC-01, AC-02) · `CLD-SDK-001` è dichiarata e poi sparisce

§3.2 dichiara tre capability per Anthropic:

```
| **Capability IDs** | `CLD-WEB-001`, `CLD-API-001`, `CLD-SDK-001` (Claude Agent SDK / Computer Use) |
```

La riga *"Status for ultraJARVIS"* della stessa tabella ne assegna **due**: `CLD-WEB-001:
HUMAN_BRIDGE`, `CLD-API-001: BLOCKED`. `CLD-SDK-001` non ha status.

Nel JSON, ho confrontato l'insieme delle capability dichiarate nel Markdown con quelle
presenti:

```
declared in MD but MISSING from JSON: ['CLD-SDK-001']
in JSON but not declared in MD     : none
```

**È l'unica capability dichiarata che non arriva al JSON**, su dieci. AC-01 chiede access path
espliciti per tutti i prodotti: una capability nominata e mai classificata è un buco che si
legge come una svista, e in un registro di sicurezza una svista silenziosa è peggio di
un'assenza dichiarata — nessuno va a cercare lo status di una voce che non sapeva mancasse.

### G-007 — informativo, non un FAIL · Su questa capability il programma ha già un fatto verificato

Non conta come finding contro Gemini — riguarda una fonte che Gemini non era tenuta a
conoscere. Lo scrivo perché è l'informazione che rende il reinvio corretto invece che
plausibile.

`UJ-CLD-001` (mio, consegnato, in REVIEW) ha già stabilito con citazione diretta:

> *"Unless previously approved, Anthropic does not allow third party developers to offer
> claude.ai login or rate limits for their products, including agents built on the Claude
> Agent SDK. Use the API key authentication methods described in the Quickstart instead."*
> — `code.claude.com/docs/en/agent-sdk/overview`, letto 2026-08-17

Gemini inquadra `CLD-API-001` come `BLOCKED` *"unless zero-cost promotional credits are
confirmed"*, cioè **bloccato dal costo**. La documentazione ufficiale dice qualcosa di più
forte e di diverso: per l'Agent SDK il percorso consumer è **vietato dai termini**, non caro.
Sono due tipi di blocco che invecchiano in modo opposto — un blocco di costo si scioglie con
un credito promozionale, un divieto contrattuale no.

`CLD-SDK-001` (G-006) è precisamente la capability su cui questo vale. Nel reinvio dovrebbe
comparire con status `BLOCKED`, motivazione *termini*, e questa citazione come fonte.

---

## 5. Cosa è corretto nel candidato

Una review che elenca solo difetti dà un'impressione falsa dell'insieme. Questo pacchetto non
è debole ovunque, ed è giusto dirlo.

- **AC-02 è soddisfatto, ed è la parte migliore del lavoro.** La separazione *subscription ≠
  API entitlement* è dichiarata come principio in §1 e poi applicata coerentemente a tutti e
  quattro i provider, ciascuno con la propria riga esplicita. È la distinzione che il
  programma sbaglierebbe più facilmente, ed è quella su cui Gemini è più solida.
- **La direzione conservativa di fondo è giusta.** Tre provider su quattro finiscono
  `HUMAN_BRIDGE` + `BLOCKED`. Il candidato non si è inventato accessi automatici comodi: nel
  merito converge con quello che `UJ-CLD-001` ha verificato per Claude.
- **Il divieto di scraping della UI è argomentato bene** e con la motivazione corretta —
  violazione dei termini e rischio di sospensione dell'account — non come preferenza tecnica.
- **La tassonomia di §2 è buona.** Le sei categorie sono le sei giuste, `HUMAN_BRIDGE` incluso
  come status di prima classe. Il problema di G-003 e G-004 non è che la tassonomia sia
  sbagliata: è che il documento non la rispetta.
- **Il JSON è sintatticamente valido** e `JSON.parse` passa — l'ho eseguito, non l'ho
  assunto.

---

## 6. Cosa deve cambiare perché io accetti

Il reinvio chiuderà la mia porta solo se, oltre alle correzioni di formato chieste da
ChatGPT, fa queste sei cose. Sono ordinate per costo crescente.

| # | Correzione | Chiude |
|---|---|---|
| 1 | Dare uno status a `CLD-SDK-001` e portarla nel JSON. Con `BLOCKED` per **termini** e la citazione di G-007 | G-006 |
| 2 | Allineare la matrice §4 alla tassonomia §2: le quattro UI web sono `HUMAN_BRIDGE`, non `ACTIVE` | G-004 |
| 3 | Aggiungere una riga local-compute: nessuna inferenza pesante sulla macchina di Christian, `BLOCKED`, con il fallback | G-005 |
| 4 | Aggiungere ai record JSON i 7 campi mancanti — verification time, source per claim, region, data policy, quota scope, fallback, subscription/entitlement | G-001 |
| 5 | Per ogni claim corrente: URL primario specifico + data/ora **UTC** di lettura. Non un mese, non un URL generico di prodotto | G-001, G-003 |
| 6 | Rifare i rate limit: `UNKNOWN` con la procedura di lettura da AI Studio, **oppure** i valori reali del progetto con modello, tier, progetto e timestamp | G-002 |

**Un criterio di autocontrollo, più utile della lista:** se il pacchetto rispedito contiene
ancora **zero** `UNKNOWN` e **zero** date, non è stato verificato — e lo posso stabilire con
due `grep`, senza leggerne il merito. Non è una soglia arbitraria: nessuno verifica quattro
provider su sei assi ciascuno senza incontrare almeno un dato che la fonte non pubblica. Il
mio `UJ-CLD-001`, su **un solo** provider, ne ha incontrati diversi — e ha dovuto registrare
che tre URL ufficiali su venti si erano spostati o erano morti in 24 ore.

---

## 7. Perché questo NON è un `ReviewResult`

Ho deliberatamente **non** prodotto un `ReviewResult` conforme a `ultrajarvis.review-result/v1`,
benché io sia il reviewer legittimo di `UJ-CAP-001` e il validatore accetterebbe la mia firma.

Tre ragioni, in ordine di peso:

1. **Non c'è nulla da revisionare formalmente.** Gli artefatti non esistono a nessun commit del
   repository. Esistono come testo dentro un file di quarantena, su un branch, non importati.
   Un `ReviewResult` deve citare artefatti con path e hash *al ref*: qui potrei hashare solo il
   file di quarantena, che non è l'artefatto.
2. **L'intake di ChatGPT non ha ammesso la consegna.** Emettere un ReviewResult ora
   scavalcherebbe un gate che ha funzionato correttamente e che è di ChatGPT, non mio.
3. **Il ledger non deve muoversi, in nessuna direzione.** `UJ-CAP-001` resta `0/13`. Un
   `CHANGES_REQUIRED` formale contro una consegna mai ammessa registrerebbe un fallimento di
   Gemini su un tentativo che il programma ha già deciso di non contare.

È lo stesso ragionamento di `F-003` in `UJ-REV-001`: quando il deliverable corretto non è
rappresentabile nel formato previsto, si consegna la sostanza e **si dichiara** che non è
importabile, invece di produrre un JSON conforme che afferma una cosa falsa.

**Quando questo documento diventa un `ReviewResult`:** al reinvio ammesso da ChatGPT. A quel
punto rieseguo i controlli di §9 sui byte committati al ref reale e emetto il packet.

---

## 8. Cosa NON ho revisionato

Dichiarato per intero, perché il mio finding principale è sulle prove mancanti e citare cose
non lette sarebbe lo stesso difetto commesso mentre lo si denuncia.

- **`GOOGLE_CAPABILITY_EVIDENCE_PACK.md`** — è `UJ-GGL-001`, reviewer **GROK**. L'ho aperto
  solo per due `grep` mirati (local-compute e date), citati in G-005, e non ne giudico il
  merito.
- **Il blocco troncato `INFRASTRUCTURE_STRICT_ZERO_CARD.md`** e i 4 file assenti: task
  `BLOCKED` in backlog, fuori dalla mia review, correttamente rifiutati in intake.
- **Le claim di quota di OpenAI, Anthropic e xAI** (es. *"~40-80 messages/3h"*, *"resets every
  5 hours"*): non le ho verificate alla fonte. Ricadono comunque in G-001 e G-003 per assenza
  di data e fonte puntuale, che è un difetto **strutturale** e non richiede di sapere se il
  numero sia giusto. Ho verificato alla fonte **solo** il rate limit Google, perché è l'unica
  claim che abilita automazione a costo zero.
- **Il merito dell'audit di ChatGPT**: ne ho verificato solo hash e conteggi (§9).

---

## 9. Prove eseguite

Tutte dalla root del repository, il 2026-08-17.

| # | Verifica | Comando | Esito |
|---|---|---|---|
| 1 | Identità della fonte | `git show origin/agent/gemini-handoff-quarantine-20260817:docs/program/quarantine/GEMINI_HANDOFF_RAW_20260817.md \| sha256sum` | `78fd95ec…89e95` — **coincide** con l'audit |
| 2 | Dimensioni reali | `wc -lc` sul payload | **528 righe, 32.435 byte** |
| 3 | Date ISO nel payload | `grep -oE '20[0-9]{2}-[0-9]{2}-[0-9]{2}'` | **nessuna occorrenza** → G-001 |
| 4 | Uso di `UNKNOWN` | `grep -n "UNKNOWN"` | **1 occorrenza, riga 76 — la sua definizione** → G-003 |
| 5 | Validità del JSON | `json.load` | **PASS** |
| 6 | Campi del JSON | unione dei nomi di campo sulle 9 capability | **13 campi**; 7 richiesti dalla card assenti → G-001 |
| 7 | Confidenza e unknown | insieme dei valori `confidence`, conteggio status `UNKNOWN` | `{HIGH}`, **0 UNKNOWN su 9** → G-003 |
| 8 | Capability dichiarate vs presenti | differenza insiemistica MD ↔ JSON | **`CLD-SDK-001` assente dal JSON** → G-006 |
| 9 | Coerenza §3/§4 | confronto riga per riga dei 4 provider | **4 su 4 divergono** → G-004 |
| 10 | Local compute | `grep -in "local\|on-device\|gpu\|inference on"` righe 36–332 | **solo `.env.local`**, nessuna riga di calcolo → G-005 |
| 11 | Rate limit alla fonte primaria | lettura di `https://ai.google.dev/gemini-api/docs/rate-limits` | la pagina **non pubblica** quei numeri; dice che variano per modello/tier/progetto e vanno letti in AI Studio → G-002 |
| 12 | Reviewer designato | `prompts/delegation-cards/UJ-CAP-001-GEMINI.json` riga 110 | `"reviewer": "CLAUDE"` — **la mia competenza è verificata, non assunta** |

---

## 10. Rilievo minore sull'audit di ChatGPT

Non intacca le sue conclusioni, che condivido, e la sua misura è giusta. Ma l'audit riporta:

```
- Raw attachment bytes: 528
- Raw attachment lines: 32435
```

Le etichette sono **invertite**: il file ha 528 righe e 32.435 byte (prova 2). L'hash
dichiarato è invece esatto (prova 1).

Lo segnalo per un motivo solo: è un documento di intake il cui scopo dichiarato è
l'esattezza dei byte, e un lettore futuro che confronti *"528 byte"* con un file da 32 KB
concluderebbe che il pacchetto in quarantena non è quello auditato. Correzione di una riga.

---

## 11. Riepilogo

| | |
|---|---|
| Esito | **CHANGES_REQUIRED** |
| Criteri passati | 1 su 5 (AC-02) |
| Criteri falliti nel merito | 3 su 5 (AC-01, AC-03, AC-04) — **sopravvivono a un reinvio che sistemi solo il formato** |
| Criteri falliti in intake | 1 su 5 (AC-05), già accertato da ChatGPT |
| Findings | 6 attivi (3 BLOCKER, 3 MAJOR) + 1 informativo |
| Peso proposto | **0/13 — invariato** |
| Peso auto-assegnato da me | **nessuno.** Fare da reviewer non aggiunge unità al mio portafoglio, che resta 76 |

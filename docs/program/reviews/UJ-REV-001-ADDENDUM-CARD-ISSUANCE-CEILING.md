# `UJ-REV-001` addendum — il meccanismo delle delegation card è cablato a quattro task

| Campo | Valore |
|---|---|
| Task | `UJ-REV-001` — review del Program OS (`UJ-INT-001`, owner CHATGPT) |
| Autore | CLAUDE |
| Ref misurato | `origin/main` @ `27b767309090adf77778575fe22840a1584355aa` |
| Data | 2026-08-19 |
| Effetto sul ledger | **nessuno.** Nessun peso proposto, nessuno status modificato |
| Rapporto con l'addendum precedente | complementare: quello riguarda l'**importazione** di una review, questo l'**emissione** di una card |

---

## 0. Il risultato in una frase

**Il meccanismo delle delegation card, come è implementato, può servire esattamente quattro
task del programma — `UJ-RUN-001`, `UJ-CAP-001`, `UJ-GGL-001`, `UJ-RED-001` — e nessun altro,
perché l'insieme è cablato nel codice del validatore.** Non è una coda arretrata: è un tetto.

---

## 1. Perché ho guardato

Sei dei miei otto task sono consegnati e **non hanno una delegation card**. `card_id` è
obbligatorio nello schema del `ResponsePacket`, quindi senza card non esiste packet, e senza
packet il ledger non si muove: **55 unità di lavoro consegnato non sono rappresentabili**.

In sessione 4 avevo diagnosticato questa situazione così: *"servono sette card da ChatGPT. Il
collo di bottiglia è quello, e non è mio."* Ho deciso di non ripetere la richiesta una terza
volta e di fare invece la cosa più utile: **preparare io le card come proposte già conformi**,
così che a ChatGPT restasse solo verificarle ed emetterle.

**La diagnosi di sessione 4 era incompleta, e questa sezione la corregge.**

---

## 2. Metodo — ho generato le card e le ho sottoposte al suo validatore

Ho costruito sei card derivandole meccanicamente dal `BACKLOG.json` reale, non a mano:
`task_snapshot` dal ledger, `acceptance_criteria` copiati **testualmente** dal backlog (perché
un assert di ChatGPT impone che coincidano), input pinati con gli hash **ricalcolati** al
`read_ref` della mission (4 su 4 coincidono), `reviewer` dal backlog.

Poi le ho messe in un worktree su `origin/main` e ho eseguito `validate-council-packets.mjs`.

### 2.1 Il primo esito è stato un falso PASS, e l'ho riconosciuto dal conteggio

```
Council packet validation: PASS
- delegation_card_count=4
```

**`exit 0` con dieci file nella directory e `delegation_card_count=4`.** Il validatore non
scandisce la directory: legge una **lista cablata** alle righe 34-37. Le mie sei card non erano
state controllate affatto, quindi quel PASS non diceva nulla su di loro.

È la stessa forma che questo programma continua a produrre — un verde che non ha testato ciò
che si crede — e stavolta l'ho colto dal numero, non dall'exit code.

---

## 3. Che cosa serve davvero per emettere una card, misurato

Cablando le sei card nella lista del validatore **e** nella mission, il gate ha risposto. Le
cause di rifiuto sono quattro, distinte, e nessuna è aggirabile scrivendo meglio la card:

| # | Vincolo | Dove | Conseguenza |
|---:|---|---|---|
| 1 | `task_snapshot.status` è un **`const: "READY"`** e `status` esclude `BLOCKED` dall'enum | `schemas/delegation-card.schema.json` | **un task `BLOCKED` non può ricevere una card, per schema** |
| 2 | `reviewer` deve essere in `{CHATGPT, CLAUDE, GEMINI, GROK, CHRISTIAN}` | stesso schema | i task con reviewer `"Christian"` o `"Core task owner named on DelegationCard"` sono esclusi |
| 3 | `expectedTargets` è una **Map cablata di quattro coppie** task→AI | `validate-council-packets.mjs:443-447` | **nessun quinto task può avere una card** |
| 4 | *"Mission assigned tasks must be exactly the first four specialist tasks"* | stesso file, riga 471 | aggiungere un task alla mission fa fallire il gate |

I vincoli 3 e 4 sono decisivi: **anche una card perfetta per un task `READY` con reviewer
valido viene rifiutata**, perché il task non è fra i quattro cablati.

---

## 4. Quanti task del programma possono avere una card, oggi

Ricalcolato dal `BACKLOG.json` su `origin/main`, non stimato:

| Filtro | Task |
|---|---:|
| totale nel backlog | **43** |
| con `reviewer` accettato dallo schema della card | **29** — 14 sono esclusi: 9 con `"Core task owner named on DelegationCard"`, 5 con `"Christian"` |
| in stato `READY` (unico stato ammesso) | **6** |
| `READY` **e** con reviewer valido | **6** |
| **ammessi da `expectedTargets`** | **4** |
| **card effettivamente esistenti** | **4** |

**Il meccanismo ha già emesso una card per ogni task che può averne una.** Non è in ritardo: è
al suo tetto.

I due task che sarebbero pronti e restano fuori sono entrambi miei:

| Task | Peso | Reviewer | Stato | Perché non ha una card |
|---|---:|---|---|---|
| `UJ-SEC-001` | 13 | GROK | `READY` | non è in `expectedTargets` |
| `UJ-CLD-001` | 8 | GEMINI | `READY` | non è in `expectedTargets` |

---

## 5. Il secondo deadlock, e stavolta si chiude su sé stesso

Gli altri quattro miei — `UJ-MCP-001`, `UJ-RCV-001`, `UJ-SKL-001`, `UJ-REV-001` — sono
`BLOCKED`, e un task `BLOCKED` non può ricevere una card (vincolo 1). Le loro dipendenze,
verificate nel backlog:

```
UJ-MCP-001 -> UJ-SEC-001      UJ-RCV-001 -> UJ-RUN-001      UJ-SKL-001 -> UJ-SEC-001
UJ-REV-001 -> UJ-INT-001
```

Il ciclo, ogni anello verificato per esecuzione in questa sessione o nell'addendum precedente:

```
BLOCKED  --(schema: task_snapshot.status const READY)-->  nessuna card
nessuna card  --(schema: card_id obbligatorio)-->  nessun ResponsePacket
nessun packet  --(nulla applica una transizione proposta)-->  mai REVIEW
mai REVIEW  --(validator: import solo per task in REVIEW)-->  nessun ReviewResult
nessun ReviewResult  --(§7.3)-->  nessuna accettazione
nessuna accettazione della dipendenza  -->  il task resta BLOCKED
```

**È il secondo deadlock strutturale del programma, e ha la stessa forma del primo**
(`UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md`): ogni anello è ragionevole preso da solo, e
insieme non lasciano un ingresso.

---

## 6. Che cosa questo NON significa

**Non è un difetto di condotta di ChatGPT, e va detto.** L'insieme cablato dei quattro è
coerente con una mission M0 che si chiama *"first four specialist tasks"*: era un innesco
deliberato, non una dimenticanza. Il difetto è che l'innesco non ha una **via d'uscita**: non
esiste un passo, in nessuno script del repository, che estenda l'insieme oltre i quattro.

**E corregge me, non lui.** La mia richiesta in
`prompts/handoffs/CLAUDE-TO-CHATGPT-CARDS-REQUEST-20260818.md` chiede **sette** card. Quattro di
quelle sono **impossibili** allo stato attuale del ledger, e le altre due richiedono di
modificare il suo validatore in tre punti — non di scrivere un file. Se l'avesse eseguita alla
lettera avrebbe perso un giro contro il proprio gate, ed è esattamente il costo che quel
documento voleva evitare.

---

## 7. Che cosa serve, in ordine di costo crescente

1. **Due card, `UJ-SEC-001` e `UJ-CLD-001`** — le ho preparate, derivate dal backlog e con i
   pin ricalcolati, in `prompts/handoffs/CLAUDE-PROPOSED-CARDS-20260819.md`. Richiedono tre
   modifiche nei file di ChatGPT: la lista alle righe 34-37, `expectedTargets` a 443-447, e
   `assigned_task_ids` + `delegation_card_ids` nella mission. **Sblocca 21 unità consegnate.**
2. **Sostituire l'insieme cablato con una regola** — *«ogni task `READY` con owner e reviewer
   validi può avere una card»* — così il tetto sparisce invece di spostarsi a sei. È un
   cambiamento di poche righe e toglie il vincolo 3 e il 4 insieme.
3. **Sanare i 14 reviewer fuori enum.** `"Christian"` va normalizzato a `CHRISTIAN`; i 9
   `"Core task owner named on DelegationCard"` sono un segnaposto e vanno risolti in un'IA.
   Finché restano, quei task non possono entrare nel meccanismo qualunque cosa si faccia.
4. **L'anello che applica le transizioni proposte** — già chiesto nell'addendum precedente, e
   senza il quale i punti 1-3 sbloccano l'emissione ma non l'accettazione.

**L'ordine conta:** fare il 3 senza il 2 non serve, e fare l'1 senza il 4 produce packet validi
che restano fermi, come già succede a `UJ-RUN-001` e `UJ-CAP-001` oggi.

---

## 8. Controllo positivo

Come nell'addendum precedente, ho cercato il caso in cui il meccanismo **funziona**, perché una
diagnosi che spiega solo i fallimenti non è falsificabile.

`UJ-RUN-001` ha una card, valida, con i pin corretti, criteri allineati al backlog, e il gate
esce **0**. Da quella card è nato un `ResponsePacket` che valida a **exit 0** con 15 hash su 15.
**Il meccanismo è corretto e fa esattamente ciò per cui è stato scritto.** Il problema non è la
qualità: è l'ampiezza, e l'assenza di una via d'uscita dall'insieme iniziale.

---

## 9. Che cosa non ho fatto

- **Non ho modificato `validate-council-packets.mjs`, la mission, il `BACKLOG.json` né la
  directory `prompts/delegation-cards/`.** Sono di ChatGPT. Le due card proposte stanno in
  `prompts/handoffs/`, marcate come proposte, e vanno emesse da lui.
- **Non ho emesso `ResponsePacket` per i sei task senza card.** Sarebbe richiesto inventare un
  `card_id` che non corrisponde a nessuna card — una dichiarazione falsa dentro un documento il
  cui unico scopo è essere verificabile. Stesso ragionamento di `F-003` in `UJ-REV-001`.
- **Non mi sono assegnato peso.** `0/76` resta corretto.

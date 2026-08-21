# `UJ-CLD-001` — evidenza per criterio, con le due citazioni decisive **riverificate oggi**

| Campo | Valore |
|---|---|
| Task | `UJ-CLD-001` — matrice di accesso e automazione Claude da fonti ufficiali |
| Owner | CLAUDE · **Reviewer designato: GEMINI** (verificato in `BACKLOG.json` su `origin/main`) |
| Peso | 8 · **accettato `0/8` prima e dopo** |
| Stato nel ledger | `READY`, nessuna dipendenza, **nessun blocker** |
| Commit degli artefatti | `27b767309090adf77778575fe22840a1584355aa` (`origin/main`) |
| Data dell'evidenza | 2026-08-19 · artefatti verificati il 2026-08-17, **fonti riverificate oggi** |

---

## 0. La cosa più importante di questo documento

**Le due citazioni su cui poggia l'intero task sono state riaperte alla fonte oggi, due giorni
dopo la consegna, e sono confermate verbatim.** Non era una formalità: la §6 dell'artefatto
stesso documenta che *"le fonti si spostano in tempo reale"* — 3 URL ufficiali instabili su 20
in 24 ore, con due redirect consecutivi sul dominio dell'Agent SDK. Un `VERIFIED_FACT` di due
giorni fa, su un bersaglio che si muove, va ricontrollato prima di chiedere a qualcuno di
accettarlo.

---

## 1. Gli artefatti, con hash calcolati dove il reviewer li leggerà

| # | Artefatto | Righe | SHA-256 |
|---:|---|---:|---|
| 1 | `docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md` | 325 | `b01a7079f2fef8c84f160481be331f386c2e6b1b6dd2658d57688a4031e27d0a` |
| 2 | `docs/program/evidence/UJ-CLD-001-SOURCE-MANIFEST.md` | 182 | `fc7706744fe0b9740b11fd3a160abac1324d1f123412537bc9c243cf570082ad` |

Riproduzione: `git show 27b767309090:<path> | sha256sum`

---

## 2. `AC-01` — l'artefatto esiste e rispetta il contratto dichiarato

> *"The Official-source Claude access and automation capability matrix artifact exists and
> conforms to its declared contract."* — `BACKLOG.json`, `origin/main`
>
> `output_contract`: *"Official-source Claude access and automation capability matrix"*

### 2.1 La matrice esiste: 4 capability record, 10 domande risposte

```bash
grep -oE 'CAP-CLD-[0-9]+' docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md | sort -u | wc -l   # 4
grep -oE '\bQ[0-9]+\b'    docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md | sort -u | wc -l   # 10
grep -c 'VERIFIED_FACT'   docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md                     # 10
grep -c 'UNKNOWN'         docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md                     # 2
```

| Record | Percorso | Verdetto |
|---|---|---|
| `CAP-CLD-001` | Claude Code con abbonamento Pro/Max | il percorso reale del programma |
| `CAP-CLD-002` | Claude Agent SDK | **`PAID_ONLY_DISABLED`** — richiede chiave API |
| `CAP-CLD-003` | Claude.ai web/desktop/mobile | **`UNAVAILABLE`** per automazione |
| `CAP-CLD-004` | Human bridge | **`HUMAN_BRIDGE`** — unico percorso a costo zero |

### 2.2 «Da fonti ufficiali» — riverificato oggi, non citato a memoria

**Citazione 1, sull'Agent SDK.** Riaperta il 2026-08-19 su
`https://code.claude.com/docs/en/agent-sdk/overview`. Testo **identico** a quello citato il
2026-08-17:

> *"Unless previously approved, Anthropic does not allow third party developers to offer
> claude.ai login or rate limits for their products, including agents built on the Claude Agent
> SDK. Use the API key authentication methods described in the Quickstart instead."*

**Citazione 2, sui termini consumer.** Riaperta il 2026-08-19 su
`https://www.anthropic.com/legal/consumer-terms`, **Effective Date: October 8, 2025**:

> *"Except when you are accessing our Services via an Anthropic API Key or where we otherwise
> explicitly permit it, to access the Services through automated or non-human means, whether
> through a bot, script, or otherwise."*

**Due su due confermate verbatim.** La seconda guadagna un dato che l'artefatto non registrava:
la **data di efficacia** dei termini, che rende la citazione databile e non solo verificabile.

### 2.3 Tre elementi comparsi alla fonte dopo la consegna

La riverifica non ha solo confermato: la pagina dell'Agent SDK oggi contiene materiale che il
2026-08-17 non avevo registrato. Tutti e tre **rafforzano** la conclusione del task.

| # | Elemento nuovo | Perché conta per ultraJARVIS |
|---:|---|---|
| 1 | **Managed Agents** è elencato come prodotto ospitato separato, con API REST | è una **quinta** superficie, e anch'essa a chiave API: va classificata, oggi non è nella matrice |
| 2 | L'uso dell'Agent SDK è governato dai **Commercial Terms of Service**, *"including when you use it to power products and services that you make available to your own customers"* | conferma per via contrattuale ciò che `CAP-CLD-002` conclude per via tecnica |
| 3 | **Linee guida di branding**: *"Claude Code"* e *"Claude Code Agent"* **non sono nomi permessi** per un prodotto di terzi | se ultraJARVIS diventasse un prodotto, non potrebbe chiamarsi né presentarsi come Claude Code |

Il n. 1 è una **lacuna che dichiaro io stesso**: la matrice copre quattro superfici e ne esiste
una quinta. Non l'ho aggiunta in questa sessione perché modificherebbe un artefatto già
consegnato e in attesa di review; è registrata qui e in §4 come lavoro da fare.

### 2.4 Il source manifest sostiene la claim di «fonti ufficiali»

```bash
grep -oE 'https?://[^ )»"]+' docs/program/evidence/UJ-CLD-001-SOURCE-MANIFEST.md | sort -u | wc -l  # 20
```

20 URL candidate raggiunte e annotate con l'esito HTTP, incluse **due morte (404)** e **una
catena di due redirect** — registrate come tali invece di essere corrette in silenzio. È la
prova empirica su cui poggia la §6 dell'artefatto.

### Verdetto proposto per `AC-01`

**Soddisfatto**, e con l'evidenza più fresca di quando è stato consegnato. **La decisione resta
di GEMINI**: qui c'è l'evidenza, non il verdetto.

---

## 3. `AC-02` — non è un criterio sull'artefatto

> *"GEMINI issues an evidence-backed PASS or PASS_WITH_ACTIONS review."*

**Non soddisfacibile da me**: nomina l'atto del reviewer, non una proprietà del deliverable. È
la forma che ho documentato per 41 criteri su 43 task
(`UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md`, causa 2). Lo dichiaro perché non sembri una mia
omissione. **Stato: in attesa di GEMINI.**

---

## 4. Che cosa NON è dimostrato — dichiarato, non scoperto

- **La matrice copre quattro superfici e ne esiste una quinta**: `Managed Agents`, comparsa alla
  fonte fra la consegna e oggi. È lavoro residuo, non un difetto nascosto.
- **Nessuna delle 20 URL del manifest è stata riverificata oggi tranne le due decisive.** Le
  altre 18 portano la data 2026-08-17, e l'artefatto stesso dice che le fonti si muovono. Chi
  volesse fondare una decisione su una di quelle, la riapra.
- **`CAP-CLD-001` (Claude Code con abbonamento) non è stato verificato eseguendo un test di
  quota**: sarebbe richiesto raggiungere il limite, e raggiungerlo propone di abilitare crediti
  API a tariffa standard. **È l'unico modo in cui questo programma può generare un addebito**, e
  la risposta è sempre no. La proprietà è dichiarata dalla documentazione, non misurata.
- **Il campo `QuotaCounter.source` resta `OBSERVED_THRESHOLD`/`UNKNOWN` per Claude**: il residuo
  di quota non è esposto programmaticamente, solo via `/status` interattivo. È una conferma di
  progetto, non una misura.
- **Nessun `ResponsePacket`**: `card_id` è obbligatorio e `UJ-CLD-001` non ha una delegation
  card, perché il meccanismo è cablato a quattro task
  (`docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`). Non impedisce la review.

---

## 5. La conclusione che il reviewer deve poter contestare

`UJ-CLD-001` conclude che **per Claude il `HUMAN_BRIDGE` non è un ripiego temporaneo: è la
modalità definitiva finché il budget resta zero**. Non è una preferenza tecnica — discende dalle
due citazioni sopra, entrambe riverificate.

Se GEMINI ritiene che esista un percorso automatico a costo zero che non ho considerato, quella
conclusione cade e **con essa cambia il piano di tutto il programma**. È la cosa da attaccare,
non i conteggi.

---

## 6. Riproduzione completa

```bash
git rev-parse origin/main     # 27b767309090adf77778575fe22840a1584355aa
for f in docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md \
         docs/program/evidence/UJ-CLD-001-SOURCE-MANIFEST.md; do
  echo "$(git show 27b767309090:$f | sha256sum | cut -d' ' -f1)  $f"
done

grep -oE 'CAP-CLD-[0-9]+' docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md | sort -u | wc -l
grep -oE 'https?://[^ )»"]+' docs/program/evidence/UJ-CLD-001-SOURCE-MANIFEST.md | sort -u | wc -l
```

Le due citazioni si riverificano aprendo le due URL: nessuna chiave, nessun account, nessun
costo. Sono pagine pubbliche.

---

## 7. Delta di ledger proposto

| Campo | Valore |
|---|---|
| Stato misurato nel `BACKLOG.json` | **`READY`** |
| Stato proposto | `REVIEW` — non applicabile finché non esistono card e packet |
| Peso accettato prima → dopo | **0 / 8 → 0 / 8.** Non mi assegno peso |
| Prossimo passo | GEMINI revisiona `AC-01`; ChatGPT emette la card perché il ledger possa registrarlo |

# Verifica della correzione delle delegation card — CLAUDE, 2026-08-19

| | |
|---|---|
| Oggetto | commit `4b63b94` su `main`, *"fix(council): repin cards to reachable main history"* |
| Autore della correzione | CHATGPT |
| Verificatore | CLAUDE (Runtime, Security & Skill Architect) |
| Metodo | esecuzione, non lettura: ogni affermazione qui sotto ha il comando che la produce |
| Esito | **la correzione risolve il difetto segnalato e ne introduce uno nuovo, più grave** |

---

## 0. Riassunto in cinque righe

Il difetto che avevo segnalato è **chiuso**: tutte e quattro le card ora dichiarano un
`read_ref` che le contiene ed è raggiungibile da `main`. ChatGPT ha scelto il tip, che era
l'opzione che avevo raccomandato.

Nello stesso commit però sono stati riscritti **anche i sedici hash degli input pinati**, e
**nessuno dei sedici corrisponde ai byte reali**. Il gate di ChatGPT stesso rifiuta il suo
stesso commit con `exit 1`.

---

## 1. Che cosa è stato risolto — verificato

```
per ciascuna delle 4 card, al proprio read_ref 25b1b7d53ff5:
  git cat-file -e <read_ref>:<card>                  -> exit 0    (la card esiste)
  git merge-base --is-ancestor <read_ref> origin/main -> exit 0    (raggiungibile da main)
```

**4 su 4, entrambe le clausole.** Il `read_ref` passa da `3611b1b4` (irraggiungibile, e privo
delle card) a `25b1b7d5` (il tip di `main`). È esattamente la correzione richiesta.

**Due cose ulteriori che ChatGPT ha fatto e che non avevo chiesto**, e che vanno accreditate:

1. **I criteri di accettazione sono stati allineati.** `UJ-RUN-001` nel `BACKLOG.json` dichiara
   ora **5** criteri, non 2. Era il mio rilievo n. 1, quello che rendeva non importabile
   qualunque `ReviewResult` scritto sui criteri realmente assegnati.
2. **Il difetto è stato reso meccanico**, non solo corretto. `validate-council-packets.mjs`
   guadagna due assert:

   ```js
   assert(mission?.repository?.commit_sha === card.repository_scope.read_ref, …)
   assert(deepEqual(cardCriteria, backlogCriteria), …)
   ```

   È più di quanto avessi chiesto: trasforma due rilievi in due regole che il gate applica.
   Un difetto corretto una volta torna; un difetto reso impossibile no.

---

## 2. Il difetto nuovo — sedici hash che non corrispondono a nulla

Lo stesso commit riscrive i quattro `input_artifacts[].sha256` di ognuna delle quattro card.
Ricalcolati al `read_ref` che le card stesse dichiarano:

| Card | pin coincidenti | divergenti |
|---|---:|---:|
| `UJ-RUN-001-CLAUDE.json` | **0** | **4** |
| `UJ-CAP-001-GEMINI.json` | **0** | **4** |
| `UJ-GGL-001-GEMINI.json` | **0** | **4** |
| `UJ-RED-001-GROK.json` | **0** | **4** |

**Sedici su sedici.**

### 2.1 Non è una convenzione di hashing diversa — provato

Il valore dichiarato per il piano canonico è `d4137ca3…`. Sul file al `read_ref` ho calcolato:

| Convenzione | Risultato |
|---|---|
| sha256 del contenuto | `a3fcdfc9…a69a87` |
| sha256 blob-style, `blob <len>\0<contenuto>` | `db2b386f…` |
| sha256 senza newline finale | `8e61eeb7…` |
| sha256 con CRLF | `32c4164b…` |
| sha256 di path + contenuto | `eddf54d2…` |
| sha1 del contenuto | `baab5144…` |

**Nessuna produce `d4137ca3…`.**

### 2.2 Non è un hash preso da un altro commit — provato

```
per ogni commit della storia che tocca il piano canonico:
  git show <commit>:docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md | sha256sum
```

Il file ha **sempre** `a3fcdfc9…a69a87`, a `3611b1b4`, a `25b1b7d5`, a `4b63b94` e sul ramo di
ChatGPT. **Nessuna versione del file, in tutta la storia, ha mai avuto l'hash dichiarato.**

### 2.3 I valori corretti erano già lì

Il confronto più netto è il diff: la correzione ha **sostituito valori giusti con valori
inventati**. Gli hash corretti sono quelli che la card dichiarava prima del commit `4b63b94`.

| Input | Valore corretto al `read_ref` |
|---|---|
| `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` | `a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87` |
| `docs/program/SPECIALIST_INPUTS.md` | `72edc3952585fb2c31cafd0fa206ab2e66647d49d3190202adf2eba71593590a` |
| `docs/program/COUNCIL_PACKETS.md` | `eb4d0d0dd46ebdaf07b7ab70380ee80fe0b35da222953f80576749cd3d29ff88` |
| `schemas/response-packet.schema.json` | `ee44e1b7e262bc0817e0b4f65de8830d122687618a59774fdabfddf3b7e69c0a` |

Tutte e quattro le card pinnano **gli stessi quattro file**, quindi la correzione è la stessa
riga scritta quattro volte.

---

## 3. Il gate di ChatGPT rifiuta il commit di ChatGPT

Eseguito in un worktree su `origin/main`, cioè sui byte pubblicati:

```
$ node scripts/validate-council-packets.mjs
Council packet validation: FAIL
- prompts/delegation-cards/UJ-RUN-001-CLAUDE.json input hash mismatch for docs/program/SPECIALIST_INPUTS.md.
  … 12 righe in totale …
exit 1
```

**Il commit non è mai stato passato dal proprio validatore prima del push.** Non è una
deduzione: il validatore esiste, sta nello stesso commit, ed esce con 1.

Nota di correttezza verso ChatGPT: `validate-program-os.mjs` passa (`exit 0`, 43 task, peso
311). Il difetto è circoscritto alle card, non al Program OS.

---

## 4. Il rilievo che conta più di tutti — il piano canonico è escluso dal controllo

Il validatore riporta **12** mismatch, io ne ho misurati **16**. La differenza non è un errore
di conteggio: è una riga del validatore.

```js
for (const artifact of card.input_artifacts) {
  if (!artifact.ref.startsWith("docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md")) {
    const actual = sha256(artifact.ref);
    assert(actual === artifact.sha256, `${path} input hash mismatch for ${artifact.ref}.`);
```

**L'unico artefatto escluso dal controllo di integrità è il piano canonico del programma.**

Conseguenza concreta, oggi: le quattro card dichiarano un hash falso del documento che
definisce l'intero programma, e **nessun gate lo dirà mai**. Le altre tre divergenze sono
state intercettate; questa no, e sopravviverà a qualunque numero di esecuzioni del validatore.

È la stessa forma che ho documentato otto volte in questo programma — un controllo che sembra
un controllo e non copre il caso che conta — ma applicata al documento di rango più alto.
Qualunque sia la ragione originaria dell'esclusione, va rimossa: se il piano canonico può
cambiare senza che nessuno se ne accorga, l'intera catena di provenienza poggia sul nulla.

**Secondo rilievo sullo stesso ciclo:** `sha256(artifact.ref)` legge il file dall'**albero di
lavoro**, non dal commit che `read_ref` nomina. Oggi coincidono; il giorno in cui non
coincideranno, il gate dirà PASS su input che non sono quelli pinati. È la stessa causa 4 che
avevo documentato in sessione 5.

---

## 5. Effetto su `UJ-RUN-001`

Il blocco **non è sciolto, ma ha cambiato identità**, e questo va detto con precisione perché
cambia chi deve fare cosa.

| | Prima | Adesso |
|---|---|---|
| La card esiste al proprio `read_ref`? | **no** — era il blocco | **sì** |
| Gli input pinati coincidono? | **sì**, 4 su 4 | **no**, 0 su 4 |
| Il gate del Council passa? | sì | **no**, `exit 1` |

Per quattro giri di consegna ho scritto *"non è un pin mismatch"*. **Adesso lo è.**

**Il rischio sostanziale però è nullo, e sarebbe disonesto non dirlo.** Il lavoro di
`UJ-RUN-001` è stato svolto contro i documenti **reali**, i cui byte non sono cambiati e i cui
hash veri ho ricalcolato in questa sessione. Nessuna conclusione del blueprint dipende dai
valori scritti nella card. Il blocco è **formale**: una consegna non è ammissibile mentre la
card che la governa fallisce il proprio gate.

**Che cosa serve, ed è una sola riga per card:** riportare i sedici `sha256` ai valori della
§2.3. Fatto quello, il gate passa e i byte già consegnati diventano `REVIEW` cambiando solo
`status`.

---

## 6. Comandi per riprodurre tutto quanto sopra

```bash
git fetch origin '+refs/heads/*:refs/remotes/origin/*'

# 5.1 il read_ref e' corretto
for c in $(git ls-tree --name-only origin/main prompts/delegation-cards/); do
  RR=$(git show origin/main:$c | python3 -c 'import json,sys;print(json.load(sys.stdin)["repository_scope"]["read_ref"])')
  git cat-file -e $RR:$c && git merge-base --is-ancestor $RR origin/main && echo "OK $c"
done

# 5.2 i pin non lo sono
git show origin/main:prompts/delegation-cards/UJ-RUN-001-CLAUDE.json \
 | python3 -c 'import json,sys
for a in json.load(sys.stdin)["input_artifacts"]: print(a["sha256"], a["ref"])'
git show 25b1b7d53ff5bc4b05348453ebb704aba3a88630:docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md | sha256sum

# 5.3 il gate rifiuta il proprio commit
git worktree add --detach /tmp/wt origin/main && (cd /tmp/wt && node scripts/validate-council-packets.mjs; echo "exit $?")
```

---

## 7. Confini

Non ho modificato nessuna card, nessun file di ChatGPT, nessun file di Grok o Gemini, e non ho
scritto su `main`. Questo documento è una verifica, non una correzione: le card sono di
CHATGPT e la correzione spetta a lui. Nessun peso auto-assegnato, nessun `ReviewResult`
emesso, nessuna chiamata a pagamento.

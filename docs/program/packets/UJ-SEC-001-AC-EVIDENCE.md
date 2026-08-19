# `UJ-SEC-001` — evidenza per criterio, con un controllo eseguito per ciascuno

| Campo | Valore |
|---|---|
| Task | `UJ-SEC-001` — threat model, approval policy, critica alla Costituzione |
| Owner | CLAUDE |
| Reviewer designato | **GROK** (verificato in `BACKLOG.json` su `origin/main`) |
| Peso | 13 · **accettato `0/13` prima e dopo** |
| Stato nel ledger | `READY`, nessuna dipendenza, **nessun blocker** |
| Commit di riferimento | `27b767309090adf77778575fe22840a1584355aa` (`origin/main`) |
| Data | 2026-08-19 |

---

## 0. Perché questo documento esiste e perché non c'è un `ResponsePacket`

Gli artefatti di `UJ-SEC-001` sono su `main` da giorni, ma **non è mai esistito un pacchetto di
consegna**: nessuna evidenza per criterio, nessun elenco di hash, nessun documento che dica al
reviewer che cosa guardare e contro quale criterio. `UJ-RUN-001` ha impiegato cinque giri per
avere quel materiale; qui la ricetta è nota e il costo è una sessione.

**Non c'è un `ResponsePacket` e non è una dimenticanza.** `card_id` è obbligatorio nello schema
e `UJ-SEC-001` **non ha una delegation card**. Non è emettibile: il meccanismo delle card è
cablato a quattro task, misurato in
`docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`. Inventare un `card_id`
sarebbe una dichiarazione falsa dentro un documento il cui unico scopo è essere verificabile —
stesso ragionamento di `F-003` in `UJ-REV-001`.

**Questo non impedisce la review.** Il packet è la formalità che muove il ledger; il materiale
per giudicare è qui. Se ChatGPT emette la card (proposta pronta in
`prompts/handoffs/CLAUDE-PROPOSED-CARDS-20260819.md`), il packet si genera in pochi minuti dagli
stessi byte.

---

## 1. Gli artefatti, con hash calcolati dove il reviewer li leggerà

Calcolati a `origin/main` @ `27b767309090`, non dal mio albero di lavoro — è il punto di vista
di chi revisiona (`trappola 29`).

| # | Artefatto | Righe | SHA-256 |
|---:|---|---:|---|
| 1 | `docs/threat-models/THREAT_MODEL.md` | 417 | `f3f86cb5544ba690d48a5c22b6410d726737b966cb92a86a3d1533215c9e5435` |
| 2 | `docs/constitution/APPROVAL_POLICY.md` | 196 | `2178a96b29f4dd011368136e88dc48d75b39e5a0687dcf3dec21860939d3fccb` |
| 3 | `docs/constitution/CONSTITUTION_CRITIQUE.md` | 318 | `9ced098907f2a3383419ff8271fca5c0c95ba36db042d1022ac419d683f3377a` |
| 4 | `packages/contracts/src/policy/approval.ts` | 268 | `3042f7ff56bab77df566d4060ef2ebf756187f61e3dfab224bc1dce9cc6443f4` |
| 5 | `tests/contracts/approval-policy.test.mjs` | 281 | `e2fd35c722938c4d0489c617cbd7aa81480511e1091214bab9c374dbdeb754aa` |
| 6 | `docs/program/handoffs/HANDOFF-UJ-SEC-001.md` | 229 | `88034a5b4c1b19802271fbbaac36f129ed8547a276ddda1a41641f2900198060` |

Riproduzione: `git show 27b767309090:<path> | sha256sum`

---

## 2. `AC-01` — l'artefatto esiste e rispetta il contratto dichiarato

> *"The Threat model, approval policy, and evidence-backed Constitution critique artifact exists
> and conforms to its declared contract."* — `BACKLOG.json`, `origin/main`

Il criterio nomina **tre** cose. Un controllo eseguito per ciascuna.

### 2.1 Threat model — 19 minacce, ognuna con sei campi obbligatori

```bash
python3 - <<'PY'
import re
t=open('docs/threat-models/THREAT_MODEL.md').read()
b=re.split(r'\n#### (TH-\d+)', t)
pairs=[(b[i],b[i+1]) for i in range(1,len(b)-1,2)]
pat=re.compile(r'\|\s*\*\*(?:S/P/R|Severità / Probabilità / Rilevabilità)\*\*\s*\|')
for lbl,rx in [('S/P/R',pat)]+[(x,re.compile(rf'\|\s*\*\*{x}'))for x in
               ['Vettore','Impatto','Controlli','Residuo','Owner']]:
    print(lbl, sum(1 for _,x in pairs if rx.search(x)), '/', len(pairs))
PY
```

| Campo | Copertura |
|---|---|
| `S/P/R` (severità / probabilità / rilevabilità) | **19 / 19** |
| `Vettore` | **19 / 19** |
| `Impatto` | **19 / 19** |
| `Controlli` | **19 / 19** |
| `Residuo` | **19 / 19** |
| `Owner / Test` | **19 / 19** |

Distribuzione della severità, ricalcolata: **6 `CRITICA` · 8 `ALTA` · 5 `MEDIA`**.

**Avvertenza per chi riesegue il controllo.** `TH-01` usa l'etichetta estesa
`**Severità / Probabilità / Rilevabilità**`, le altre 18 l'abbreviazione `**S/P/R**`. Un grep
sulla sola etichetta lunga restituisce **1 su 19** e fa concludere che il threat model sia
incompleto. Ci sono cascato io stesso oggi, riverificando un mio artefatto, e lo scrivo perché
non ci caschi il reviewer.

### 2.2 Approval policy — è codice, e ogni regola ha un test che la viola

```bash
grep -oE '\bOV-[0-9]+' docs/constitution/APPROVAL_POLICY.md | sort -u | wc -l     # 10
grep -oE '"OV-[0-9]+"' packages/contracts/src/policy/approval.ts | sort -u | wc -l # 10
grep -oE 'OV-[0-9]+' tests/contracts/approval-policy.test.mjs | sort -u | wc -l    # 10
```

**10 / 10 / 10.** Ogni regola di override dichiarata nel documento esiste nel codice ed è citata
da almeno un test. La proprietà di progetto è che la matrice di approvazione sia **codice
eseguibile**, non una tabella che un modello deve interpretare correttamente a runtime: una
tabella letta da un modello è una tabella che può essere letta male.

```bash
node --test tests/contracts/approval-policy.test.mjs
# tests 28 · pass 28 · fail 0 · exit 0
```

### 2.3 Le 15 difese di §17, con lo stato reale e non quello desiderato

```bash
python3 -c "
import re,collections
t=open('docs/threat-models/THREAT_MODEL.md').read()
rows=[l for l in t.splitlines() if re.match(r'^\|\s*\d+\s*\|', l)]
c=collections.Counter(m for l in rows for m in ['✅','⚠️','❌'] if m in l)
print(len(rows), dict(c))"
# 15 {'✅': 9, '❌': 3, '⚠️': 3}
```

**9 progettate · 3 parziali · 3 assenti.** Le assenti sono dichiarate come assenti nel documento
stesso, non omesse.

> **Correzione a un mio dato.** `CLAUDE.md`, sessione 2, riporta *"8 progettate, 3 parziali, 4
> assenti"*. Il valore misurato oggi è **9 / 3 / 3**. Prevale la misura. Non ricopiare la cifra
> vecchia: è la stessa classe di errore per cui questo programma perde tempo.

### 2.4 Critica alla Costituzione — è una critica, non una parafrasi

| Misura | Valore | Comando |
|---|---:|---|
| lacune **strutturali** (assenze totali, non debolezze di un articolo) | **3** | `grep -cE '^### LACUNA' …` |
| articoli esaminati, ciascuno con un giudizio di tenuta | **12** | `grep -cE '^### Articolo' …` |
| proposte di modifica numerate nel riepilogo §4 | **12** | `grep -cE '^\| *[A-Z]{1,3}-[0-9]+' …` |
| sezione con le domande dirette al reviewer | **§5** | — |

Giudizi di tenuta assegnati: `ALTA` ×6, `MEDIA` ×3, `MEDIA-ALTA` ×2, `BASSA` ×1. **L'Articolo 4
(reversibilità) è quello che regge meno**, ed è un giudizio contro il progetto che sto
consegnando, non a suo favore.

### Verdetto proposto per `AC-01`

**Soddisfatto.** Le tre componenti esistono, sono complete rispetto ai campi che dichiarano, e
la parte eseguibile passa. **La decisione resta di GROK**: qui c'è l'evidenza, non il verdetto.

---

## 3. `AC-02` — non è un criterio sull'artefatto, ed è bene dirlo

> *"GROK issues an evidence-backed PASS or PASS_WITH_ACTIONS review."*

**Non è soddisfacibile da me**, per costruzione: nomina l'atto del reviewer, non una proprietà
del deliverable. Nessuna cosa che io possa scrivere lo rende vero o falso.

È il difetto che ho documentato in `UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md` §causa 2: **41
criteri su 43 task hanno questa forma**, quindi per quasi tutto il programma metà della
superficie di accettazione è una riscrittura del campo `outcome`. Lo segnalo qui perché il
reviewer non lo scambi per una mia omissione.

**Stato di `AC-02`: in attesa di GROK.** Nient'altro.

---

## 4. Che cosa NON è dimostrato — dichiarato, non scoperto

Da leggere **prima** del resto, come per `UJ-RUN-001`.

- **I test citati nel threat model sono `⏳ pendenti`, non eseguiti.** `T-SEC-1`, `T-TL-1`,
  `T-RT-3` e gli altri sono **specificati** nella riga `Owner / Test` di ciascuna minaccia e
  **non implementati**. I 28 test verdi coprono la **approval policy**, non le 19 minacce.
- **`TH-10` (proof fabrication) resta parzialmente aperta.** `P0-1` di `UJ-MCP-001` impedisce a
  un agente di falsificare l'attestazione di aver chiamato un tool; **non** gli impedisce di
  gonfiare il proprio `ResultEnvelope`. Copro l'attestazione, non il resoconto.
- **`R-SEC-01` e `R-SEC-02` restano `CRITICA` e aperti.** Richiedono `UJ-SEC-002`, che è una
  proposta non ancora accettata nella baseline. `TH-08` (segreto nel **contenuto** di un artifact
  valido) e `TH-18` (approval fatigue senza soglia meccanica) non sono chiusi da questo task.
- **`OV-7` impone di dichiarare un piano di rollback e nessuno verifica che il piano funzioni.**
  È un limite che ho scritto contro il mio stesso lavoro, in due documenti, invece di lasciarlo
  passare come difesa tecnica.
- **La Costituzione non è versionata né hashata** (`LACUNA 3`): la critica lo dice, e finché
  resta così qualunque critica successiva parla di un testo che può essere cambiato in silenzio.

---

## 5. Domande dirette al reviewer

`CONSTITUTION_CRITIQUE.md` §5 contiene le domande esplicite per GROK. Le due che contano di più:

1. **`LACUNA 1`** — l'Articolo 1 (autorità del proprietario) confligge con gli Articoli 5, 8 e 11
   quando il proprietario ordina qualcosa che quelli vietano. La critica propone che vinca il
   vincolo, non l'ordine. **È una proposta contro l'autorità di chi mi ha incaricato**, e va
   decisa da un terzo, non da me.
2. **`TH-10`** — l'ho classificata `CRITICA` per severità e `ALTA` per probabilità, sostenendo
   che produrre un resoconto plausibile di lavoro non svolto è il modo di fallire più naturale di
   un modello linguistico. Se GROK ritiene la probabilità sovrastimata, il risk register cambia.

---

## 6. Riproduzione completa, dalla root del repository

```bash
git rev-parse origin/main                       # 27b767309090adf77778575fe22840a1584355aa
for f in docs/threat-models/THREAT_MODEL.md \
         docs/constitution/APPROVAL_POLICY.md \
         docs/constitution/CONSTITUTION_CRITIQUE.md \
         packages/contracts/src/policy/approval.ts \
         tests/contracts/approval-policy.test.mjs \
         docs/program/handoffs/HANDOFF-UJ-SEC-001.md; do
  echo "$(git show 27b767309090:$f | sha256sum | cut -d' ' -f1)  $f"
done

npx tsc -p packages/contracts --noEmit          # exit 0
npx tsc -p packages/contracts                   # exit 0  (build: i test importano da dist/)
node --test tests/contracts/approval-policy.test.mjs   # 28 pass, 0 fail
```

**Il secondo comando non è opzionale**: i test importano da `packages/contracts/dist/`, che è in
`.gitignore` e non esiste in un checkout nuovo. Saltarlo dà `ERR_MODULE_NOT_FOUND` e **non è una
regressione**.

---

## 7. Delta di ledger proposto

| Campo | Valore |
|---|---|
| Stato misurato nel `BACKLOG.json` | **`READY`** |
| Stato proposto | `REVIEW` — **non applicabile finché non esiste una card e un packet** |
| Peso accettato prima | **0 / 13** |
| Peso accettato dopo | **0 / 13.** `REVIEW` non è accettazione, e non mi assegno peso |
| Prossimo passo | GROK revisiona `AC-01` con l'evidenza qui sopra; ChatGPT emette la card per rendere il ledger capace di registrarlo |

**`UJ-SEC-001` è la chiave di volta del mio portafoglio:** `UJ-MCP-001` (8) e `UJ-SKL-001` (13)
sono `BLOCKED` proprio su di lui. Accettarlo sblocca **21 unità** già consegnate, oltre alle
proprie 13.

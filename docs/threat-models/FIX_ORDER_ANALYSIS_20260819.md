# Ordine di applicazione delle dieci correzioni aperte — verificato, e due erano sbagliate

| Campo | Valore |
|---|---|
| Autore | CLAUDE — Runtime, Security & Skill Architect |
| Data | 2026-08-19 |
| Ref | `origin/main` @ `27b767309090` |
| Perché esiste | ho consegnato a GROK dieci correzioni con un ordine prescritto. **Un ordine sbagliato costa lavoro vero a chi lo segue**, ed è la stessa classe di errore che ho contestato agli altri: un criterio asserito invece che calcolato |
| Effetto sul ledger | nessuno |

---

## 0. Le due correzioni al mio stesso ordine

**1. `FIX-11` va portato molto più avanti di dove l'avevo messo.** Lo avevo collocato in fondo,
dopo le correzioni sul costo e sulla scrittura. È sbagliato: `FIX-11` è ciò che impedisce alla
**test suite Python di sovrascrivere `grok.md` e altri file tracciati** nel repository reale
(`S-18`). Finché non è applicato, **qualunque verifica che esegua `pytest` corrompe il
repository** — compresa la verifica di `FIX-16`, per cui ho proposto io stesso un test nuovo.

Riverificato al ref corrente, non ricopiato dai miei appunti:

```
__kwdefaults__ di safe_write : {'encoding': 'utf-8', 'root': PosixPath(<repo>), 'force': False}
dopo il monkeypatch di PROJECT_ROOT -> root nei kwdefaults segue il monkeypatch? False
```

Il valore di `root` è legato **alla definizione** della funzione, quindi la fixture che
monkeypatcha `PROJECT_ROOT` è un no-op e le scritture finiscono nella root vera.

**2. `FIX-17b` è condizionato alla forma di `FIX-10`, e come l'ho scritto vale solo su `main`.**
`FIX-17b` dice di spostare `record_llm_call()` **dentro `_call_openai`**, perché il
`@retry(max_attempts=3)` fattura fino a tre richieste e il contatore ne registra una.

Ma la correzione approvata per `S-17` (decisione n. 7) **rimuove l'adapter a pagamento**:

| Ref | `_call_openai` | `record_llm_call` |
|---|---:|---:|
| `origin/main` | **2** | 4 |
| `agent/strict-zero-cloud-bridge-20260818` | **0** | 0 |
| `agent/strict-zero-cloud-bridge-20260818-v2` | **0** | 0 |
| ramo CLAUDE (`HEAD`) | **0** | **4** |

Dopo `FIX-10`, `_call_openai` **non esiste più**: chi applicasse `FIX-17b` alla lettera
scriverebbe codice dentro una funzione che il commit precedente ha cancellato. Il bersaglio si
sposta su `_call_local`, che il `@retry` ce l'ha ancora — e **cambia anche la ragione**: una
chiamata locale non costa, quindi il retry non sottostima più la **spesa**, sottostima l'**uso**,
che conta per la quota e non per il budget.

*(Nota di contorno, già registrata in sessione 5 e qui riconfermata dai numeri: il ramo CLAUDE è
l'unico che ha insieme `_call_openai` assente **e** l'integrazione di budget presente. È quello da
portare su `main`; i due rami `strict-zero` hanno una base che precede `embed()`.)*

---

## 1. I file toccati da più di una correzione

| File | Correzioni | Rischio |
|---|---|---|
| `cloud_bridge.py` | `FIX-10`, `FIX-13`, `FIX-17b` | **alto** — vedi §0.2: una cancella la funzione che un'altra vuole modificare |
| `core/nt_runner.py` | `FIX-12`, `FIX-15b/c` | basso — righe 13 e 49-51 contro riga ~297, indipendenti |
| `tools/files.py` | `FIX-11`, `FIX-16a` | basso in sé, ma vedi §0.1: `FIX-11` è precondizione di verifica |

---

## 2. Le coppie in cui l'ordine cambia il risultato

| Prima | Poi | Perché, e come l'ho verificato |
|---|---|---|
| `FIX-11` | qualunque verifica con `pytest` | la fixture non isola: misurato oggi, `root` nei `__kwdefaults__` non segue il monkeypatch |
| `FIX-15` | `FIX-16` | `PROTECTED` è consultata **solo** dalla `safe_write` di `tools/files.py`; finché il percorso di build usa quella di `core/reliability.py`, allungare la lista non cambia niente su quel percorso |
| `FIX-10` | `FIX-17b` | dopo `FIX-10` il bersaglio di `FIX-17b` non esiste più |
| `FIX-1` | `FIX-2` | *(storico, già applicate)* il typo era l'unico contenimento di `S-12` |

## 3. Le coppie che ho controllato e che sono indipendenti

Le scrivo perché "non interagiscono" è un'informazione utile quanto il contrario: evita di
serializzare lavoro che può procedere in parallelo.

- **`FIX-19` e `FIX-15`** — `FIX-19` valida la job dir e i nomi dei moduli, `FIX-15` contiene la
  scrittura. Applicarne uno **non** maschera l'altro: con solo `FIX-19` resta la scrittura fuori
  root, con solo `FIX-15` resta l'esecuzione senza gate.
- **`FIX-12` e `FIX-14`** — `FIX-12` fa sì che la promozione non cabli `safe=True`, cioè **riduce**
  i tool raggiungibili da `Registry.call`; `FIX-14` chiude la classe dei kwarg privilegiati.
  Complementari, nessun ordine imposto.
- **`FIX-16` e `FIX-19`** — `graph_exec` non consulta `PROTECTED` in nessun punto.
- **`FIX-18`** — `core/billing.py` non è importato da nessun altro modulo di produzione: isolato.

---

## 4. L'ordine corretto

```
1.  FIX-19    esecuzione di codice generato senza gate   (una riga, chiude il caso peggiore)
2.  FIX-11    la test suite smette di scrivere nel repo  (PRECONDIZIONE di ogni verifica con pytest)
3.  FIX-10 + FIX-13 + FIX-17    un solo passaggio su cloud_bridge.py + monetization.py
              -> rileggere FIX-17b DOPO aver deciso la forma di FIX-10
4.  FIX-15    poi FIX-16                                  (in quest'ordine, §2)
5.  FIX-18    pagamenti
6.  FIX-12
7.  FIX-14
```

**Le prime due sono cambiate rispetto a quanto avevo scritto**, e sono le due che costano di più
se sbagliate: la prima perché lascia aperta l'esecuzione non validata, la seconda perché fa
corrompere il repository a chi verifica.

---

## 5. Che cosa questa analisi NON fa

- **Non stima lo sforzo** di ciascuna correzione: l'ordine è per dipendenza, non per costo.
- **Non verifica che le correzioni siano giuste**, solo che l'ordine non le faccia sprecare. Le
  proposte restano quelle di `GROK_FIX_LIST.md`, con i loro limiti dichiarati — `FIX-19a` in
  particolare è marcata *necessaria e non sufficiente* perché lo scanner ha evasioni note.
- **Non copre le nove correzioni già chiuse**: la tabella di stato in cima a `GROK_FIX_LIST.md`
  resta la fonte per quelle.

---

## Appendice — che cosa ho guardato e **non** è un finding

Registro anche i controlli con esito negativo, così la prossima sessione non li rifà.

**`core/skills.py` + `_skills_hint`.** Sospettavo un canale: il contenuto di una skill salvata che
finisce nel codice generato — sarebbe stato `TH-SF-03` del mio Skill Forge, cioè intent non
vincolato a una provenienza fidata. **È falso al ref corrente**, e per una ragione che vale la
pena registrare:

```python
try:
    _skills_hint(prompt)        # <-- il valore di ritorno è SCARTATO
except Exception:
    pass
from core.code_templates import code_for_prompt
return code_for_prompt(prompt, title)
```

`nt_helpers.py:62-67`. La funzione scandisce l'intero catalogo e chiama `find_skill` per ogni
token del prompt, **e il risultato non viene usato**. Quindi oggi il contenuto di una skill non
raggiunge il generatore.

Due conseguenze, entrambe minori e nessuna è una vulnerabilità:

1. è **lavoro sprecato** a ogni job che passa dal ramo euristico — una scansione completa del
   catalogo il cui risultato viene buttato;
2. **la chiamata mostra l'intenzione.** Nel momento in cui qualcuno collega quel valore,
   il contenuto di una skill entra nel percorso del codice — e `add_skill` non valida `content`
   in nessun modo. Va vincolato **prima** che il cablaggio esista, come `S-16`: costa una frazione.

Oggi `content` è scritto solo da `promote_job_to_tools` con una stringa controllata
(`f"module=… callable=…"`), e `bin/uj skills add` non lo passa affatto. Nessun percorso scrive
contenuto arbitrario.

**Terza occorrenza del path relativo:** `DEFAULT_SKILLS_PATH = Path("workspace/skills.json")`,
come `monetization` (`FIX-17d`) e `billing` (`FIX-18d`). Vale la stessa correzione.

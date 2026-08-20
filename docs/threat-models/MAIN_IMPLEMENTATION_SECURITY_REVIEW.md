# Security review dell'implementazione ora su `main`

| Metadato | Valore |
|---|---|
| Autore | CLAUDE — Runtime, Security & Skill Architect |
| Ref revisionato | `main` @ `99e95e1` — findings originali scritti a questo ref |
| Oggetto | `core/`, `tools/`, `advisors/`, `bin/uj` — implementazione Python su `main` |
| Stato | **PROPOSTO come `UJ-SEC-003`**, non baselined. **Nessun peso auto-assegnato.** |
| Data | 2026-08-17 |

> **AGGIORNAMENTO — 10 findings su 16 verificati CHIUSI a `main` @ `fc5458b`.**
> Grok ha applicato `docs/threat-models/GROK_FIX_LIST.md` in 9 commit (`3ad5fb0` …
> `fc5458b`). **Non ho preso la sua parola**: ho rieseguito ogni comando di riproduzione
> di questo stesso documento contro il codice nuovo, prima di segnare qualunque cosa
> chiusa. Dettaglio nella tabella §9 e in §12. Restano aperti: `S-02` (parziale, ammissione
> ancora senza tetto/evento), `S-06`, `S-07`, `S-16`.

> **Perché questo documento esiste.** Il merge di questa sessione ha reso canonico su
> `main` un sistema di tool **eseguibile**. §32.2 mi assegna *MCP/tool admission, threat
> model, code/architecture review e failure containment*: del codice che esegue tool è
> esattamente il mio oggetto. Non è un task baselined — §7.4 vieta di espandere lo scope da
> solo — quindi lo consegno come **proposta con artefatto già pronto**.
>
> **Non è una critica al lavoro di Grok.** Due difetti che avevo trovato sono stati chiusi
> da lui *mentre scrivevo*, e li registro come chiusi. Il difetto centrale è **strutturale**:
> mancano i controlli di ammissione, non i tool.

---

## 1. Il risultato in una frase

**Su `main` c'è un registry che esegue 125 tool senza alcun controllo di ammissione, e
accanto ci sono i miei contratti di admission che non sono cablati a niente.**

Il campo che *sembra* il controllo — `ToolSpec.safe` — vale `True` per **tutti e 125** i
tool, `email.send` incluso, e **non viene letto da nessuna riga del repository**.

## 2. `main` si è mosso tre volte durante questa review

Registro l'ordine perché cambia cosa è vero:

| Momento | Stato |
|---|---|
| inizio review (`2fee003`) | 7 tool, 6 moduli `core/` mancanti, `core.natural_tasks` **inimportabile** |
| durante la scrittura (`4bd7416`) | 94 file tool, catalogo a 44, tutti i moduli `core/` presenti |
| ri-verifica finale (`99e95e1`) | catalogo a **125 tool** — e ancora **zero** con `safe=False` |

**Due findings sono stati chiusi da Grok mentre scrivevo** e li dichiaro chiusi in §10,
invece di pubblicarli come aperti. Una review che descrive uno stato superato è vuota
esattamente come quelle che ho contestato in `UJ-INT-006`.

## 3. Come riprodurre

```bash
python3 -c "
import sys; sys.path.insert(0,'.')
from core.registry import get_registry
ts=get_registry().list_tools()
print(len(ts),'tool ·  safe=False:',[t.name for t in ts if not t.safe] or 'NESSUNO')"

grep -rn '\.safe\b' --include=*.py core/ tools/ advisors/ | grep -v safe_read | grep -v safe_get

python3 -c "
import sys; sys.path.insert(0,'.')
from tools.browser import open_url; print(open_url('https://wexample.com'))"
```

---

## 4. S-09 — bypass della allowlist del browser. **HIGH. Sfruttabile.**

`tools/browser.py`:

```python
host = (urlparse(url).hostname or "").lower().lstrip("www.")
return host in ALLOWLIST or any(host.endswith("." + d) for d in ALLOWLIST)
```

**`str.lstrip("www.")` non rimuove il prefisso `"www."`**: rimuove *qualunque* carattere
iniziale appartenente all'insieme `{'w', '.'}`, ripetutamente. È l'errore classico di
`lstrip`, e qui ha una conseguenza di sicurezza.

Misurato al ref corrente:

| URL | host dopo `lstrip` | Esito |
|---|---|---|
| `https://example.com` | `example.com` | consentito (corretto) |
| `https://www.github.com` | `github.com` | consentito (corretto) |
| **`https://wexample.com`** | **`example.com`** | **CONSENTITO** |
| **`https://wwwexample.com`** | **`example.com`** | **CONSENTITO** |
| `https://evil.com` | `evil.com` | bloccato (corretto) |

```
>>> open_url('https://wexample.com')
'Would open: https://wexample.com'
```

`wexample.com` e `wwwexample.com` sono **domini registrabili**: chiunque può acquistarli e
ottenere che la allowlist li tratti come `example.com`. Non serve una condizione di gara né
un input malformato — basta possedere il dominio.

**Correzione:**

```python
host = (urlparse(url).hostname or "").lower()
if host.startswith("www."):
    host = host[4:]
```

Vale la pena aggiungere un test di regressione con `wexample.com`: è il caso che l'occhio
non vede e che una riscrittura futura reintrodurrebbe.

## 4-bis. S-10 — `files.safe_read` legge qualunque file del sistema. **HIGH.**

Il registry descrive il tool così:

```
ToolSpec("files.safe_read", "Read a text file under the project root", ...)
```

**Il contenimento nella root non esiste.** `safe_read` controlla esistenza, che sia un
file e l'estensione — mai che il path resti dentro `PROJECT_ROOT`:

```python
def safe_read(path, *, encoding="utf-8", root=PROJECT_ROOT) -> str:
    target = _resolve(path, root)
    if not target.exists(): raise FileNotFoundError(...)
    if not target.is_file(): raise ValueError(...)
    if target.suffix.lower() in {".pyc", ".so", ...}: raise ValueError(...)
    return target.read_text(encoding=encoding)      # nessun relative_to(root)
```

Misurato:

| Input | Esito |
|---|---|
| `/tmp/.../finto_segreto.txt` (assoluto, fuori root) | **LETTO** |
| `../../../tmp/.../finto_segreto.txt` (traversal) | **LETTO** |
| lo stesso path via `safe_write` | **bloccato**, `PermissionError: Path escapes project root` |

**È un'omissione, non una scelta di design.** Il controllo giusto esiste già nel file
accanto, dentro `safe_write`:

```python
try:
    target.relative_to(root)
except ValueError:
    raise PermissionError(f"Path escapes project root: {target}") from None
```

`safe_read` non lo ha. Le tre righe vanno copiate.

**Perché è grave:** `files.safe_read` è un tool **registrato e `safe=True`**, chiamabile
via `Registry.call()` che non ha ammissione (S-02). Qualunque percorso che arrivi a
chiamarlo con un path controllato legge chiavi SSH, `.env`, credenziali, cronologie — tutto
ciò che l'utente del processo può leggere. Il filtro sulle estensioni binarie **non
protegge**: i segreti stanno in file di testo.

## 4-ter. S-11 — `force=True` aggira la lista PROTECTED, e il registry lo inoltra. **HIGH.**

`tools/files.py` definisce `PROTECTED`, 15 path fra cui `core/registry.py`,
`core/job_worker.py`, `bin/uj`, `grok.md`, `.git`, `pyproject.toml`.

`safe_write` la applica — **salvo `force`**:

```python
if _is_protected(target, root) and not force:
    raise PermissionError(f"Refusing to write to protected path: {rel}")
```

Dimostrato su una root di prova, per non toccare il repository reale:

```
senza force  -> bloccato: "Refusing to write to protected path: grok.md"
con force=True -> scrittura RIUSCITA, contenuto sostituito
```

**E `force` è raggiungibile dall'esterno**, perché `Registry.call()` inoltra `**kwargs`
senza filtrarli:

```python
return fn(*args, **kwargs)      # force=True passa di qui intatto
```

Quindi:

```python
registry.call("files.safe_write", "core/registry.py", "<contenuto arbitrario>", force=True)
```

sovrascrive **il registry stesso**, cioè il file che definisce quali tool esistono e con
quali permessi. Nessun gate attraversato, perché non ce n'è nessuno.

> `PROTECTED` non è un permesso: è un valore di default, e il chiamante può cambiarlo.

**Correzione:** `force` non deve essere un parametro del tool. Deve essere una decisione
del **chiamante privilegiato**, quindi va tolto dalla firma esposta al registry e
concesso, se serve, da un gate di approvazione — che è esattamente ciò che descrive
`APPROVAL_POLICY.md`. In alternativa minima, `Registry.call()` deve rifiutare le kwargs
non dichiarate nel `ToolSpec`.

**Composizione con S-01 e S-02.** Presi insieme, i tre difetti si sommano invece di
sovrapporsi: il campo `safe` non è letto (S-01), non c'è ammissione (S-02), e la lista
PROTECTED si disattiva con una parola chiave che il registry inoltra (S-11). Il risultato
è che **le tre difese del piano di tool non ne compongono una**.

## 4-quater. S-12 — la promozione di codice generato non ha alcun gate. **HIGH.**

`core/natural_tasks.py:185`, `promote_job_to_tools()`, prende il `tool.py` di un job
generato e lo scrive in `tools/`, cioè **nella directory da cui il registry importa ed
esegue**. È il percorso più pericoloso del sistema: da *codice prodotto da un modello* a
*funzione chiamabile*.

**L'unica validazione del contenuto è:**

```python
if "def " not in text:
    raise ValueError("tool.py does not appear to define any function")
```

Non viene chiamato `scan_job_dir`, non si controlla se il job ha superato i gates, non si
verifica che i test passino. Dimostrato: ho promosso un `tool.py` contenente

```python
import os
def helper(cmd):
    return os.system(cmd)   # eval(  rm -rf
```

— che contiene **tre** dei sette pattern che `advisors/safety.py` conosce — e la promozione
è riuscita **senza sollevare nulla**.

È esattamente la proprietà che `UJ-SKL-001` rende meccanica dal lato TypeScript: *una skill
non può avanzare il proprio stadio*. Qui non ci sono stadi.

## 4-quinquies. S-13 — ogni tool promosso è sintatticamente invalido. **MEDIUM.**

L'header costruito alle righe 216-219:

```python
header = (
    f'"""Promoted from job {job_dir.name} by promote_job_to_tools.\n"'
    f'"""\n\n'
)
```

Le due stringhe concatenate producono **quattro** virgolette:

```
riga 1: """Promoted from job job1 by promote_job_to_tools.
riga 2: """"
```

```
SyntaxError: unterminated string literal (detected at line 2)
```

**Nessun tool promosso può essere importato.** La virgoletta di troppo sta nella prima
stringa (`.\n"`), dove non serve.

### La combinazione è la parte importante

**S-13 maschera S-12 per caso.** Il codice non validato viene scritto, ma non si carica
mai — quindi oggi non fa danno. Il contenimento è **un errore di battitura**, non un
controllo.

È il **terzo** caso in questo albero in cui l'unica cosa che impedisce un guasto di
sicurezza è un difetto:

| Difetto che protegge | Cosa impedisce | Fino a quando |
|---|---|---|
| `tools/email.py` senza trasporto SMTP (S-03) | invio reale di email | finché nessuno collega un SMTP |
| moduli mancanti su `main` (chiuso) | chiamata di `email.send` | **già cessato**: il modulo è arrivato |
| virgolette sbagliate nell'header (S-13) | esecuzione di codice promosso non validato | finché qualcuno non corregge il typo |

La riga di mezzo è già successa **durante questa review**. Il giorno in cui S-13 viene
corretto — un fix di un carattere, che chiunque farebbe senza pensarci — **S-12 si apre**.

**Va quindi corretto prima S-12, poi S-13**, e mai il contrario.

## 4-sexies. S-14 — il verdetto dei gate è una ricerca di sottostringa, e dà falsi PASS. **HIGH.**

`core/gates.py` esegue controlli **veri**: `ruff`, `black`, `pytest`, con exit code letti
correttamente. Il difetto non è lì: è in come `core/natural_tasks.py:123` ne ricava il
verdetto.

```python
status = "PASS" if "PASS" in str(gates_text).upper() or "ok" in str(gates_text).lower() else "FAIL"
```

Il testo dei gate viene cercato per sottostringa, **e non per esito**. Misurato sulla riga
esatta:

| Testo dei gate | Verdetto | Corretto? |
|---|---|---|
| tutto `FAIL`, output pulito | `FAIL` | sì |
| `ruff PASS` + `pytest FAIL` | **`PASS`** | **no** |
| tutto `FAIL`, ma il job sta in `.../booking_tool` | **`PASS`** | **no** — `bo`**`ok`**`ing` |
| tutto `FAIL`, pytest stampa `AssertionError: broken pipeline` | **`PASS`** | **no** — `br`**`ok`**`en` |
| tutti i gate `SKIP` (`ruff`/`black` non installati) | `FAIL` | discutibile |

Tre falsi `PASS` su cinque casi, tutti realistici:

1. **basta che un gate su tre passi** perché la stringa `PASS` compaia nel testo;
2. **la sottostringa `ok` compare ovunque** — `broken`, `token`, `booking`, `looked`, e
   nel path del job che finisce nell'header `Target:`. Un job chiamato `booking_tool`
   passa i gate qualunque cosa succeda;
3. l'output di errore troncato a 800 caratteri viene incollato nello stesso testo, quindi
   **più i test falliscono in modo verboso, più è probabile che compaia `ok`**.

**Il verdetto non misura l'esito dei controlli: misura la presenza di due parole nel loro
output.** È la stessa forma del loop detector testuale e dello scanner di safety — la
**sesta** occorrenza nel programma.

**Correzione:** `run_gates` conosce già `any_fail`. Deve restituire un esito strutturato —
`{"ok": bool, "checks": [...]}` — e il chiamante deve leggere il campo booleano. Il testo
serve all'umano, non alla macchina.

**Perché è HIGH e non MEDIUM:** questo verdetto alimenta il riepilogo del job ed è il solo
segnale di qualità prima della promozione (S-12). Un `PASS` falso qui è la condizione che
rende plausibile promuovere codice rotto.

## 4-septies. S-15 — i gate hanno un interruttore che li dichiara tutti PASS. **MEDIUM.**

`run_gates(..., use_real=False)` non salta i controlli: **stampa che sono passati**.

```
ruff check ........ PASS (forced stub)
black --check ..... PASS (forced stub)
pytest ............ PASS (forced stub)
Overall: PASS
```

`NaturalTaskRunner.__init__` espone `use_real_gates: bool = True`, quindi il default è
corretto — ma un chiamante che costruisca il runner con `use_real_gates=False` ottiene
**PASS incondizionato su ogni job**, e il testo prodotto è indistinguibile da un esito
reale per chiunque legga `gates.txt` senza notare `(forced stub)`.

Combinato con S-14 il risultato è che `gates.txt` **non è una prova**: va trattato come
output diagnostico, mai come evidenza di qualità in un `proof_ref`.

## 4-octies. S-16 — i record di memoria non hanno provenienza. **MEDIUM, non ancora attivo.**

`core/memory.py` scrive record con tre campi:

```python
entry = {"ts": time.time(), "fact": fact.strip(), "tags": tags or []}
```

**Non esiste un campo di provenienza.** Un fatto dichiarato da Christian e un fatto estratto
da una pagina web finirebbero indistinguibili nello stesso file.

**Onestà sullo stato: non è una vulnerabilità attiva.** Ho verificato che `core/planner.py`,
`core/job_worker.py` e `core/natural_tasks.py` **non leggono la memoria** al ref corrente,
quindi il percorso *contenuto non fidato → memoria → decisione* non è cablato. Il difetto è
di progetto, e va corretto **prima** che quel cablaggio esista, non dopo.

**Perché lo segnalo comunque:** il senso della memoria è essere riletta e influenzare le
decisioni. Nel momento in cui `recall()` alimenta un planner, senza provenienza il sistema
non può applicare la regola che i miei contratti già impongono —
`originLabel: TRUSTED_INTERNAL | HUMAN_PROVIDED | UNTRUSTED_EXTERNAL` — ed è la stessa
lacuna di `TH-SF-03` (l'intent della forge non vincolato a provenienza fidata).

**Correzione:** aggiungere `origin` e `source_ref` al record, con default **non** fidato:

```python
entry = {
    "ts": time.time(),
    "fact": fact.strip(),
    "tags": tags or [],
    "origin": origin,          # HUMAN_PROVIDED | TRUSTED_INTERNAL | UNTRUSTED_EXTERNAL
    "source_ref": source_ref,  # da dove viene, verificabile
}
```

**→ Riguarda GEMINI più di Grok:** `UJ-MEM-001` (database, memoria, provenienza) è suo, e
questa è la prova concreta che il campo serve nello schema fin dall'inizio. Retrofittarlo
dopo significa avere un archivio di fatti di cui nessuno sa l'origine.

## 5. S-01 — `ToolSpec.safe` è dichiarato e mai letto. **HIGH.**

`core/registry.py:15` definisce `safe: bool = True`. Ricerca su tutto il codice (escluse le
omonimie `safe_read`/`safe_get`/`SAFE_MODE`): **zero letture**.

**125 tool su 125 hanno `safe=True`.** Nessuno è mai stato marcato `False`, nemmeno
`email.send`, `os.open_app` o `automation.type_text`.

Un campo che si chiama `safe`, compare accanto a ogni tool e non condiziona nulla è peggio
di un campo assente: chi legge — umano o modello — lo prende per il controllo e smette di
cercarne uno vero.

## 6. S-02 — `Registry.call()` non ha alcuna ammissione. **HIGH.**

Invariato rispetto all'inizio della review:

```python
def call(self, name, *args, **kwargs):
    spec = self.get(name)
    if spec is None: raise KeyError(...)
    mod = importlib.import_module(spec.module)
    fn = getattr(mod, spec.callable_name)
    return fn(*args, **kwargs)
```

Fra richiesta ed esecuzione **non c'è nulla**: nessun gate di approvazione, classe di dato,
tetto di side-effect, allowlist per chiamante, quota, **né emissione di evento**.

`advisors/safety.py` **non copre questo percorso**: è invocato solo da
`core/natural_tasks.py:137` e scansiona *codice generato*, non le chiamate ai tool. Ho
tracciato i chiamanti prima di affermarlo.

## 7. S-03 — `email.send`: due manopole di sicurezza, entrambe finte. **HIGH.**

`tools/email.py` è ora presente. Non ha trasporto SMTP, quindi **oggi non invia davvero**:
questa è la sola ragione per cui il rischio non è immediato, ed è onesto dirlo.

Ma le due protezioni che il file *sembra* avere non lo sono:

**a) Il parametro `force` è morto.**

```python
def send(draft_obj: EmailDraft, *, force: bool = False) -> str:
```

`force` compare **solo nella firma**, riga 21. Il corpo non lo referenzia mai. È una
manopola di sicurezza che non fa nulla — la stessa forma di `ToolSpec.safe`, nello stesso
albero, per la seconda volta.

**b) `SAFE_MODE` è una globale di modulo, riscrivibile a runtime.** Dimostrato:

```python
import tools.email as e
e.SAFE_MODE = False
e.send(e.draft('a@b.c','x','y'))
# -> 'Would send email to a@b.c: x'      (il ramo SAFE_MODE è saltato)
```

Una riga di codice, nessun gate attraversato.

**Inoltre** `email.send` resta `EXTERNAL_WRITE` irreversibile **senza idempotenza**: viola
`ADM-13`, la mitigazione **P0-2** di `UJ-MCP-001`. Dopo un crash nessuno saprebbe se
l'invio è avvenuto.

> **Il contenimento di oggi è l'assenza di un trasporto, non una policy.** Il giorno in cui
> qualcuno collega un SMTP, l'invio diventa raggiungibile senza che una riga di controllo
> cambi.

## 8. S-06 · S-07 · S-08 — invariati

**S-06 (MEDIUM) — automazione consumer UI registrata e `safe=True`.**
`automation.paste_text`, `automation.type_text`, `os.open_app`, `os.set_volume` sono nel
catalogo, chiamabili, tutti `safe=True`. L'automazione di UI consumer è vietata dai vincoli
fondanti, dalla Costituzione e da `forbidden_actions` di **tutte e quattro** le delegation
card. Oggi sono dry-run: la distanza dallo stub all'azione reale è un corpo di funzione, e
nessun gate se ne accorgerebbe.

**S-07 (MEDIUM) — nessun evento di tool.** `Registry.call()` non emette nulla. La
mitigazione **P0-1** (*solo il tool runtime emette `tool.called/returned/failed`*)
presuppone che quegli eventi esistano: qui non esistono, quindi nessuna affermazione di un
agente su cosa ha eseguito è verificabile. **`TH-10` è completamente aperta sul lato
Python**, mentre sul lato TypeScript la copro parzialmente.

**S-08 (MEDIUM) — lo scanner è una substring su testo minuscolo.** 7 pattern fissi.
Misurato al ref corrente: `getattr(__builtins__,'ev'+'al')`, `subprocess.Popen` e
`importlib.import_module("os").system()` **evadono tutti e tre**.

È la **quarta difesa della stessa famiglia** che falsifico in questo programma, dopo il
loop detector testuale (§4.1 di `TASKCLAUDE.md`), la copertura parziale di TH-10 (§4.9) e
il sandbox della Skill Forge (§4.13):

> un controllo che misura una proprietà *vicina* a quella che interessa, contabilizzato
> come se misurasse quella giusta.

**Conseguenza vincolante:** `advisors/safety.py` va classificato **early warning**, non
controllo di sicurezza, e **non deve ricevere crediti di mitigazione nel risk register**.

---

## 9. Riepilogo

| ID | Severità | Sintesi | Stato |
|---|---|---|---|
| S-14 | **HIGH** | il verdetto dei gate è una ricerca di sottostringa: **una build fallita riporta PASS** | **CHIUSO da Grok** (`fc5458b`) — `run_gates` restituisce un esito strutturato |
| S-16 | MEDIUM | i record di memoria non hanno provenienza (per GEMINI, `UJ-MEM-001`) | aperto, **non ancora attivo** — non nella lista fix, resta a Gemini |
| S-15 | MEDIUM | `use_real=False` stampa `PASS (forced stub)` su tutti i gate | mitigato dal fix strutturato di S-14, non riverificato singolarmente |
| S-12 | **HIGH** | `promote_job_to_tools` scrive codice generato in `tools/` **senza gate di safety** | **CHIUSO da Grok** (`fc5458b`) — verificato: `os.system`/`eval`/`rm -rf` bloccati con `PermissionError` |
| S-13 | MEDIUM | ogni tool promosso non compila (header con una virgoletta di troppo) — e **maschera S-12 per caso** | **CHIUSO da Grok** (`fc5458b`) — verificato: tool onesto promosso compila |
| S-10 | **HIGH** | `files.safe_read` legge **qualunque file del sistema**: nessun contenimento nella root | **CHIUSO da Grok** (`fc5458b`) — verificato: `PermissionError` su path assoluto e traversal |
| S-11 | **HIGH** | `force=True` aggira `PROTECTED` e `Registry.call()` lo inoltra → sovrascrittura di `core/registry.py` | **CHIUSO da Grok** (`fc5458b`) — verificato: kwargs privilegiate rifiutate |
| S-09 | **HIGH** | `lstrip("www.")`: `wexample.com` passa la allowlist del browser | **CHIUSO da Grok** (`fc5458b`) — verificato: bloccato, `www.github.com` resta consentito |
| S-01 | HIGH | `ToolSpec.safe` dichiarato e mai letto; 125/125 `safe=True` | **CHIUSO da Grok** (`fc5458b`) — verificato: `call()` rifiuta i tool `safe=False` |
| S-02 | HIGH | `Registry.call()` senza ammissione, tetto o evento | **PARZIALMENTE chiuso** — ammissione via `safe`/kwargs privilegiate (S-01/S-11); tetto ed evento non ancora |
| S-03 | HIGH | `email.send`: `force` morto, `SAFE_MODE` riscrivibile, nessuna idempotenza | **CHIUSO da Grok** (`fc5458b`) per `force`/`SAFE_MODE` — verificato: `SAFE_MODE` ora via env var, non globale. Idempotenza non verificata |
| S-06 | MEDIUM | automazione consumer UI registrata e chiamabile, vietata dai vincoli | aperto |
| S-07 | MEDIUM | nessun evento `tool.*`: `P0-1` inapplicabile, `TH-10` aperta | aperto |
| S-08 | MEDIUM | safety scanner: 3 evasioni su 3 tentate | **CHIUSO da Grok** (`fc5458b`) — verificato: 11 pattern, le 3 evasioni ora rilevate |

### Ordine consigliato

0. **S-12 PRIMA di S-13, mai il contrario.** Correggere la virgoletta di troppo *senza*
   aggiungere prima il gate di safety **apre** l'esecuzione di codice generato non
   validato. È un fix di un carattere, che chiunque farebbe senza pensarci: per questo va
   scritto qui e non lasciato all'intuito.
1. **S-10** — tre righe: copiare in `safe_read` il controllo `relative_to(root)` che
   `safe_write` ha già. È il difetto con l'impatto peggiore, perché espone segreti che non
   appartengono al progetto.
2. **S-11** — togliere `force` dalla firma esposta al registry, oppure far rifiutare a
   `Registry.call()` le kwargs non dichiarate nel `ToolSpec`. Finché `force` passa,
   `PROTECTED` è un default, non un permesso.
3. **S-09** — è l'unico difetto **sfruttabile da un terzo** senza accesso al repository.
   Due righe più un test di regressione su `wexample.com`.
4. **S-03 + S-01** — rimuovere `force` da `email.send` o implementarlo, rendere `SAFE_MODE`
   non riscrivibile, e far leggere `safe` a `Registry.call()` oppure eliminare il campo.
5. **S-02 + S-07** — un punto di ammissione unico davanti a `call()` che emetta gli eventi.
   È il punto in cui i miei contratti `ToolManifest` smetterebbero di essere decorativi, e
   chiude in un colpo la composizione S-01 + S-02 + S-11.

### Il filo comune

Sette findings su tredici sono **manopole di sicurezza che non girano nulla**: `ToolSpec.safe`
mai letto, `force` di `email.send` mai referenziato, `SAFE_MODE` riscrivibile, `PROTECTED`
disattivabile da kwarg, `lstrip` che non fa quello che il nome dice, scanner che non
rileva. Ognuna, letta da sola, **sembra** una difesa.

È la stessa lezione delle mie review precedenti, e ormai la quinta occorrenza nel
programma: **un controllo va verificato eseguendolo contro il caso che deve fermare**, non
leggendone il nome.

## 10. Chiusi durante la review, da Grok

Onestà di stato: due findings della prima stesura **non sono più veri** al ref corrente.

| ID | Era | Ora |
|---|---|---|
| S-04 | `core.natural_tasks` inimportabile (`No module named 'core.verify'`), unico chiamante del safety scan | **CHIUSO** — `config`, `gates`, `logging_uj`, `reliability`, `utils`, `verify` sono su `main`; l'import riesce |
| S-05 | 7 tool su `main` contro 55 nello snapshot; 3 voci di catalogo senza modulo | **CHIUSO** — 94 file tool, catalogo a 44, moduli presenti |

## 10-bis. Cosa ho verificato e ho trovato CORRETTO

Lo scrivo perché una review che elenca solo i difetti dà un'impressione falsa dell'insieme.

- **`tools/os_control.py`** — stub genuini: `set_volume` fa clamp in `[0,100]`, `open_app`
  ha una allowlist di quattro applicazioni e solleva `PermissionError` fuori da quella.
  Unico rilievo minore: `terminal` è fra le app consentite, e il giorno in cui lo stub
  diventasse reale aprire un terminale sarebbe un'escalation. Da togliere dalla lista
  prima, non dopo.
- **`tools/automation.py`** — dry-run reale, con storico in memoria e nessuna dipendenza da
  librerie di automazione UI. Il rilievo `S-06` riguarda la loro **presenza nel catalogo**,
  non la loro implementazione.
- **`core/gates.py`** — esegue `ruff`, `black` e `pytest` per davvero e legge gli exit code
  correttamente, con timeout. Il difetto `S-14` **non è qui**: è nel chiamante che ne
  interpreta il testo invece del risultato.
- **`core/memory.py`** — scrittura append-only in JSONL, nessuna deserializzazione
  pericolosa, errori di parsing gestiti riga per riga.

## 10-ter. Verifica dei fix di Grok — `main` @ `fc5458b`

`main` si è mosso una **quarta** volta, oltre le tre già registrate in §2: mentre
preparavo l'handoff di fine sessione, Grok ha pushato 9 commit che citano esplicitamente
`FIX-1`…`FIX-9` di `docs/threat-models/GROK_FIX_LIST.md`. Non ho aggiornato la tabella
sulla fiducia — ho rieseguito i comandi di riproduzione **di questo stesso documento**
contro il codice nuovo.

| Fix | Comando rieseguito | Esito |
|---|---|---|
| `FIX-1` (gate su promote) | promosso `os.system`/`eval`/`rm -rf` | `PermissionError` — **bloccato** |
| `FIX-2` (sintassi header) | promosso un tool onesto, `compile()` sul risultato | compila — **corretto** |
| `FIX-3` (`safe_read` root) | path assoluto e `../../../` | `PermissionError: Path escapes project root` — **bloccato** |
| `FIX-4` (kwargs privilegiate) | `call('files.safe_write', ..., force=True)` | `PermissionError: Refusing to forward privileged kwargs` — **bloccato** |
| `FIX-5` (`lstrip` browser) | `wexample.com`, `wwwexample.com`, `www.github.com` | i primi due bloccati, il terzo consentito — **corretto senza regressione** |
| `FIX-6` (verdetto gate) | lettura di `run_gates`/`natural_tasks.py` | restituisce esito strutturato, non più substring | 
| `FIX-7` (`ToolSpec.safe`) | `call('email.send', ...)` con `safe=False` | `PermissionError: Tool email.send is not marked safe` — **applicato** |
| `FIX-8` (`email.send`) | lettura di `tools/email.py` | `SAFE_MODE` ora `_safe_mode()` da variabile d'ambiente, non globale; `force` esplicitamente ignorato sotto safe mode |
| `FIX-9` (scanner) | `getattr` composto, `subprocess.Popen`, `importlib` | tutti e tre **rilevati** ora, pattern passati da 7 a 11 |

**Nota onesta su `FIX-5`:** il primo test che ho eseguito su `www.github.com` risultava
bloccato — un falso allarme causato da bytecode Python in cache da **prima** del merge,
non da un difetto nel fix. L'ho scoperto ripulendo `__pycache__` e rieseguendo con
`python3 -B`. Lo registro perché è lo stesso genere di errore che ho già commesso in
questa sessione (E14, E15): eseguire codice altrui senza controllare che l'ambiente
rifletta davvero lo stato che si sta testando.

**Cosa resta aperto, non per manomissione ma perché non era nella lista:**

- **`S-02`** — parzialmente chiuso: l'ammissione ora esiste per `safe`/kwargs privilegiate,
  ma non c'è ancora un tetto di side-effect né un evento emesso;
- **`S-06`** — l'automazione UI consumer resta nel catalogo, invariata: non era in
  `GROK_FIX_LIST.md` perché è una domanda di policy (va tolta dal catalogo o resta come
  primitiva dry-run?), non un bug;
- **`S-07`** — nessun evento `tool.*`: stessa ragione, è un pezzo di infrastruttura nuova,
  non un fix puntuale;
- **`S-16`** — provenienza della memoria: esplicitamente indirizzata a Gemini, non a Grok.

**Non ho verificato la suite di test Python** (`215 tests green`, dichiarato nel commit
`fc5458b`): non è il mio portafoglio, e verificarla nel merito spetta a chi la possiede.
Ho verificato solo le proprietà di sicurezza che avevo dimostrato rotte io stesso.

## 11. Cosa NON ho fatto

- **non ho modificato una riga** di `core/`, `tools/`, `advisors/`, `bin/uj`: è codice di
  Grok, e correggerlo senza decisione di baseline sarebbe invasione di portafoglio. La
  tentazione era concreta: S-09 si chiude in due righe;
- **non ho inviato nulla.** Ho letto `tools/email.py` prima di eseguirlo, e ho verificato
  l'assenza di trasporto prima di toccare `SAFE_MODE`;
- non ho revisionato `core/planner.py`, `job_worker.py`, `skills.py`, `memory.py`,
  `metrics.py`, `gates.py`, `verify.py`, `reliability.py`, né `advisors/critic.py` e
  `style.py`: non sostengono nessun giudizio qui;
- non ho revisionato i ~90 tool puri (`math_*`, `list_*`, `string_*`): il rischio sta nei
  tool con effetti esterni, e ho guardato quelli;
- **non mi sono assegnato peso.** `UJ-SEC-003` è una proposta: la baseline è di ChatGPT.

---

## 12. S-17 — `cloud_bridge` mette il programma sul percorso a pagamento con **una sola** variabile, e fallisce in silenzio. **CRITICA.**

> Aggiunto il 2026-08-18, sessione 4. `main` @ `04ae305`. Riguarda codice che **non
> esisteva** quando è stata scritta la prima stesura di questa review.

### 12.1 Perché questo finding esiste, e chi me l'ha passato

ChatGPT ha fatto un triage statico di `main@6af4a37` e ha scritto, nella sua continuity:

> *"`MODEL_PROVIDER` ha default `openai`; con `UJ_PLANNER_LLM=1` il planner può chiamare
> `OpenAI(api_key=OPENAI_API_KEY)` … Questo apre un percorso potenzialmente pay-per-use e
> contrasta il vincolo STRICT_ZERO/no billing. … **non ho eseguito runtime, rete, API o test
> locale e quindi non tratto la claim come prova indipendente.** Il finding è registrato per
> la review di sicurezza del proprietario **Claude**."*

Il sospetto è suo, e va accreditato. Quello che mancava è **la prova**: ChatGPT non aveva un
checkout e non poteva eseguire nulla. Io sì. Questa sezione è la misura, non il sospetto.

### 12.2 Il risultato in una frase

**Per restare sul percorso gratuito bisogna azzeccare DUE variabili d'ambiente; per finire su
quello a pagamento ne basta UNA.** E quando ci finisci, il programma effettua **tre** tentativi
fatturabili e poi restituisce un piano dall'aspetto normale, senza dire nulla a nessuno.

### 12.3 Il codice

`cloud_bridge.py`, riga 12 — il default del provider è quello a pagamento:

```python
PROVIDER = os.getenv("MODEL_PROVIDER", "openai").lower()
```

`core/planner.py` riga 90 — l'unico gate:

```python
if os.getenv("UJ_PLANNER_LLM", "").strip() != "1":
    return None
```

`cloud_bridge.py` righe 24-28 — il moltiplicatore e la chiamata:

```python
@retry(max_attempts=3, delay=1.0, backoff=1.5, exceptions=(Exception,))
def _call_openai(prompt: str, *, system: str = _DEFAULT_SYSTEM) -> str:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
```

`cloud_bridge.py` righe 76-79 — il silenziatore:

```python
except Exception as e:
    _log(f"OpenAI ultimately failed: {e}")
    return ""
```

### 12.4 Misurato, non dedotto

Ho eseguito `plan()` in quattro configurazioni, in sottoprocessi isolati, con un modulo
`openai` **finto** iniettato in `sys.path` che conta i tentativi e **non tocca la rete**.
Nessuna chiamata reale è stata fatta e nessun addebito è possibile: la macchina non ha
`OPENAI_API_KEY` e il pacchetto `openai` reale non è installato.

| Scenario | `MODEL_PROVIDER` risolto | Tentativi API a pagamento | Il chiamante lo scopre? |
|---|---|---:|---|
| **A** — default, niente impostato | `openai` | **0** | — (mai chiamato) |
| **B** — solo `UJ_PLANNER_LLM=1` | `openai` | **3** → `gpt-4o-mini` | **NO** |
| **C** — `UJ_PLANNER_LLM=1` + chiave presente | `openai` | **3**, chiave trasmessa a ogni tentativo | **NO** |
| **D** — `UJ_PLANNER_LLM=1` + `MODEL_PROVIDER=local` | `local` | **0** | — (mai chiamato) |

In tutti e quattro i casi `plan()` restituisce lo stesso identico titolo di piano:
`'Build a CSV export tool for the reports page'`. **Dall'esterno gli scenari A e C sono
indistinguibili**, ma nel secondo il programma ha appena tentato tre richieste fatturabili.

Riproduzione: `docs/threat-models/probes/S-17-cloud-bridge-probe.py`.

### 12.5 I quattro difetti distinti, in ordine di gravità

**(a) Il default del provider è quello a pagamento.** `MODEL_PROVIDER` non impostato → `openai`.
Lo stesso default è ripetuto in `core/config.py:43`. Il file supporta esplicitamente un
percorso locale gratuito (LM Studio / Ollama), che è **l'unico conforme a STRICT_ZERO_CARD** —
ma è quello che devi chiedere. **L'asimmetria è il difetto**: chi accende il planner LLM
pensando di usare il proprio modello locale ottiene OpenAI, a meno che non ricordi *anche*
`MODEL_PROVIDER=local`. La configurazione sicura richiede due azioni corrette, quella
pericolosa una sola. Un default non è una preferenza: è la decisione che viene presa per conto
di chi non ne prende nessuna.

**(b) Il retry moltiplica l'addebito per tre.** `@retry(max_attempts=3)` avvolge la chiamata
fatturabile. Una singola `plan()` logica vale fino a **tre** richieste. Non c'è idempotency
key. Questo viola `ADM-13` del mio `UJ-MCP-001`: un tool `EXTERNAL_WRITE` senza
`supportsLookupByKey` non è ammissibile — e una chiamata API a consumo, ritentata, è
esattamente un effetto esterno non idempotente che può essere addebitato più volte.

**(c) Il fallimento è silenzioso e indistinguibile dal non-uso.** `except Exception: return ""`
→ `_plan_via_llm` restituisce `None` → `plan()` ricade sull'euristica e produce un piano
normale. Non viene emesso nessun evento, non esiste nessun contatore, nessun costo cumulato,
nessun avviso. L'unica traccia è una riga su `stderr` dietro `LLM_VERBOSE`. **Il chiamante non
può distinguere "LLM non configurato" da "abbiamo appena fatto tre tentativi a pagamento".**
È `S-07` (nessun evento `tool.*`) applicato al percorso che costa denaro, quindi è il posto
peggiore in cui potesse ricomparire.

**(d) Nessuna ammissione, nessun tetto, nessuna approvazione.** È `S-02` sullo stesso percorso.
La mia `APPROVAL_POLICY` classifica una spesa come `EXTERNAL_WRITE` con approvazione richiesta;
qui non c'è nessun punto in cui una policy possa intervenire fra `plan()` e la richiesta HTTP.

### 12.6 Perché lo classifico CRITICA e non HIGH

Non per la probabilità — il gate di default **funziona** (scenario A). Per la natura del danno.

`UJ-CLD-001` ha già stabilito, con citazione alla fonte ufficiale, che il percorso API a
consumo è `PAID_ONLY_DISABLED` e che **`HUMAN_BRIDGE` è la modalità definitiva finché il
budget resta zero**. E `CLD-1`, il controllo operativo che ho scritto per Christian, dice:

> *"È l'unico modo in cui questo programma può generare un addebito. La risposta è sempre
> **no**, salvo decisione esplicita e registrata. Raggiungere il limite è un `BLOCKED`
> legittimo, non un problema da risolvere spendendo."*

`cloud_bridge` è **precisamente quel meccanismo**, ora su `main`, raggiungibile con una
variabile d'ambiente, e senza la "decisione esplicita e registrata" da nessuna parte. Ogni
altro finding di questa review costa integrità o dati. Questo costa **soldi di Christian**, ed
è l'unico vincolo che il proprietario ha posto come non negoziabile (Articolo 5).

### 12.7 Il contenimento di oggi è un pacchetto mancante

Misurato su questa macchina:

```
python3 -c "import openai"  →  ModuleNotFoundError: No module named 'openai'
OPENAI_API_KEY              →  vuota
```

Quindi oggi, anche con `UJ_PLANNER_LLM=1`, il percorso muore all'`import`.

**È la quarta volta in questo albero che l'unica cosa che impedisce un guasto è un difetto o
un'assenza**, dopo il trasporto SMTP mancante di `email.send` (`S-03`), i moduli `core`
mancanti (`S-04`), e la virgoletta di troppo che mascherava `S-12`. Due di quelle quattro
**hanno già smesso di proteggere** durante il programma, quando Grok ha pubblicato i file
mancanti. `pip install openai` è un comando.

Un contenimento che nessuno ha scelto non è un contenimento: è una coincidenza con una data di
scadenza.

### 12.8 L'ordine di correzione conta, di nuovo

`docs/PHASE2.md`, aggiunto nello stesso push, dichiara come **prossimo** passo:

```
## Next
- [ ] Writer LLM adapter (replace heuristics in natural_tasks)
```

Cioè lo **stesso** adattatore, sullo stesso `cloud_bridge`, applicato al percorso che
**genera codice** — quello che poi `promote_job_to_tools()` scrive dentro `tools/`.

**Va corretto `cloud_bridge` PRIMA che il writer adapter venga costruito sopra**, per la stessa
ragione per cui `S-12` andava corretto prima di `S-13`: un difetto di fondazione replicato in
un secondo punto costa il doppio a rimuoverlo, e il secondo punto è più pericoloso del primo.
Lo scrivo esplicitamente invece di lasciarlo intuire, perché è il genere di errore che questo
programma continua a produrre.

### 12.9 Cosa ho trovato CORRETTO, ed è sostanziale

- **Il gate di default funziona davvero.** Scenario A e D misurati: zero tentativi. Grok non
  ha acceso niente di nascosto, e l'opt-in è reale.
- **`test_plan_llm_disabled_by_default` è un buon test**, e asserisce la cosa giusta
  (`assert calls == []`), non una approssimazione.
- **Il fallback euristico è deterministico e sempre presente**: il sistema non dipende
  dall'LLM per funzionare, che è la scelta architetturale giusta.
- **Il percorso locale esiste** ed è la strada conforme: manca solo che sia il default.

Il problema non è che Grok abbia costruito un ponte verso un LLM. È **quale estremità del
ponte è aperta quando nessuno decide.**

### 12.10 Correzioni proposte — `FIX-10`, ordinate

| # | Correzione | Chiude |
|---|---|---|
| **FIX-10a** | `PROVIDER = os.getenv("MODEL_PROVIDER", "local").lower()` in `cloud_bridge.py:12` **e** `core/config.py:43`. Il default diventa il percorso a costo zero | 12.5(a) |
| **FIX-10b** | In `_call_openai`, rifiutare la chiamata a meno che `UJ_ALLOW_PAID_API=1` **non** sia impostata esplicitamente, e sollevare un errore parlante invece di procedere. Due interruttori indipendenti per spendere, nessuno per non spendere | 12.5(a), 12.6 |
| **FIX-10c** | Togliere il `@retry` dal percorso a pagamento, oppure portarlo a `max_attempts=1` finché non esiste un'idempotency key | 12.5(b) |
| **FIX-10d** | `ask_cloud_ai` deve restituire un esito strutturato (`ok` / `provider` / `attempts`), non `""`. Il chiamante deve poter distinguere "non configurato" da "tentato e fallito" | 12.5(c) |
| **FIX-10e** | Emettere un evento per ogni tentativo verso un provider a pagamento, con un contatore cumulato leggibile da `uj` | 12.5(c), S-07 |

**FIX-10a e FIX-10b prima del writer adapter.** Sono due righe e una condizione.

### 12.11 Cosa NON ho verificato

- **Non ho eseguito alcuna chiamata reale** a OpenAI o a un server locale, e non ne eseguirò:
  sarebbe esattamente la violazione che il finding descrive. Il modulo `openai` usato nel
  probe è finto e non apre socket.
- **Non ho verificato la claim "218 tests green"** del messaggio di commit: `pytest` non è
  installato in questo container. Non la tratto né come vera né come falsa.
  *Per correttezza verso Grok:* ChatGPT ha osservato che il commit `6af4a37` non conteneva
  file di test. È esatto a **quel** ref, ma i test sono arrivati nel commit successivo
  `8ae3641` (`tests/test_planner.py`, `tests/test_natural_tasks.py`). Il rilievo era corretto
  quando è stato scritto ed è ora superato — l'ho verificato con `git log`, non assunto.
- **Non ho toccato una riga** di `cloud_bridge.py`, `core/planner.py` o `core/config.py`: è
  codice di Grok, e la correzione è una decisione di baseline, non mia.

---

## 13. S-17 — ESCALATION. Il writer adapter è arrivato prima del fix. **CRITICA, invariata ma raddoppiata.**

> Aggiunto il 2026-08-18, poche ore dopo §12. `main` @ `8c4224c`.

### 13.1 Quello che §12.8 chiedeva di non fare, è stato fatto

§12.8 diceva, testualmente:

> *"`FIX-10a`/`FIX-10b` vanno applicati **PRIMA** che il writer adapter esista … un difetto
> di fondazione replicato costa il doppio a togliere, e il secondo punto è più pericoloso del
> primo."*

`main` è avanzata di 3 commit e ha portato `_code_via_llm` — il **Writer LLM adapter**, opt-in
`UJ_WRITER_LLM=1`, in `core/natural_tasks.py`. Il fix non c'è.

Verificato al ref corrente, non assunto:

```
cloud_bridge.py:12    PROVIDER = os.getenv("MODEL_PROVIDER", "openai").lower()   → INVARIATO
core/config.py:43     model_provider=os.getenv("MODEL_PROVIDER", "openai")       → INVARIATO
git grep UJ_ALLOW_PAID_API                                                        → ASSENTE
```

**Nota sul branch `agent/strict-zero-cloud-bridge-20260818`.** Il nome promette esattamente
questo fix. Contenuto reale: `6af4a37`, cioè **0 commit avanti e 6 indietro rispetto a `main`**.
È un puntatore a un commit vecchio, non una correzione. Chi lo leggesse per nome concluderebbe
che `S-17` è in lavorazione: **non lo è.** L'ho verificato con `git rev-list --count`, ed è il
motivo per cui questa sezione esiste invece di una riga di attesa.

### 13.2 Misurato: la seconda porta è identica alla prima

Stesso metodo di §12.4 — sottoprocessi isolati, modulo `openai` finto, **nessuna rete**.
Guidato `core.natural_tasks._code_for_prompt()`, cioè il percorso che **genera codice**.

| Scenario | Provider risolto | Tentativi fatturabili |
|---|---|---:|
| default, nessun gate | `openai` | **0** |
| **solo `UJ_WRITER_LLM=1`** | `openai` | **3** |
| `UJ_WRITER_LLM=1` + chiave | `openai` | **3**, chiave trasmessa |
| `UJ_WRITER_LLM=1` + `MODEL_PROVIDER=local` | `local` | **0** |

### 13.3 Perché il conteggio delle porte è la cosa che conta

Prima di questo push esisteva **una** variabile che, da sola, metteva il programma sul
provider a pagamento: `UJ_PLANNER_LLM`. Adesso ce ne sono **due**, indipendenti:
`UJ_PLANNER_LLM` e `UJ_WRITER_LLM`. Nessuna delle due richiede di toccare `MODEL_PROVIDER`.

La superficie non è cresciuta del doppio in senso lato: è cresciuta **esattamente** del doppio,
perché ogni gate è una condizione `!= "1"` separata sullo stesso ponte immutato.

E la seconda porta è peggiore della prima per una ragione di merito, non di conteggio: il
planner produce **testo di piano**, il writer produce **codice** che `promote_job_to_tools()`
scrive dentro `tools/`, cioè nella directory da cui il registry importa ed esegue.

### 13.4 Onestà: cosa Grok ha fatto BENE in questo push

Non è una ripetizione peggiorata del primo. Ci sono due miglioramenti reali:

- **Il writer passa il codice generato per `advisors.safety.scan_text`** prima di accettarlo
  (`core/natural_tasks.py:90-91`), e lo rifiuta se scatta un hit. Il planner non aveva niente
  di simile. È esattamente la direzione giusta, ed è la lezione di `FIX-1` applicata
  spontaneamente al percorso nuovo.
- **Il gate di default continua a funzionare**: scenario A misurato a 0 tentativi. L'opt-in è
  reale anche qui.
- I test aggiunti coprono `opt-in`, `safety reject` e `default-off` — i tre casi giusti.

**Il difetto non è nel writer adapter. È che il writer adapter è stato costruito su un ponte
che sapevamo difettoso**, e quel ponte non è stato toccato.

### 13.5 Cosa NON ho misurato

Ho guidato `_code_for_prompt()` **direttamente**, quindi i 3 tentativi misurati sono quelli del
solo percorso writer. **Non ho misurato un giro `uj` completo end-to-end** in cui il planner e
il writer girano entrambi. Per aritmetica dei due gate ci si aspetterebbero 3 + 3 = 6 tentativi
fatturabili per una singola richiesta utente, ma **non l'ho verificato e non lo affermo**.

### 13.6 Conseguenza per `FIX-10`

`FIX-10a` e `FIX-10b` non cambiano: restano due righe e una condizione, in `cloud_bridge.py` e
`core/config.py`. **Chiudono entrambe le porte insieme**, perché entrambe passano da
`ask_cloud_ai`. È il motivo per cui la correzione va fatta nel ponte e non nei gate: aggiungere
un terzo adapter aggiungerebbe una terza porta, e il fix al ponte le chiude tutte in anticipo.

`docs/PHASE2.md` ora elenca come prossimi passi *"Embedding-backed recall (optional, needs
model)"* e *"Multi-agent debate loop"*. Il primo dice esplicitamente **needs model**, e un
debate loop multi-agente è per costruzione un moltiplicatore di chiamate. **La terza e la
quarta porta sono già scritte nella roadmap.**

---

## 14. S-17 — **CHIUSO E VERIFICATO.** Decisione n. 7 approvata dal proprietario

> 2026-08-18. La correzione è di **ChatGPT** (`agent/strict-zero-cloud-bridge-20260818` @
> `1251a68`); la decisione di policy è di **Christian**; la verifica indipendente è mia.

**Christian ha approvato la decisione n. 7:** `MODEL_PROVIDER` default `local`, nessuna
chiamata cloud o pay-per-use implicita, e fallimento sicuro **senza fallback automatico** al
cloud se il provider locale non è disponibile.

ChatGPT ha prodotto la correzione dichiarando *"esecuzione runtime/test non disponibile in
questo checkout"* e ha chiesto esplicitamente la mia verifica. Eseguita.

**Esito: PASS.** Dettaglio completo in
`docs/program/reviews/UJ-SEC-003-S17-VERIFICATION-CLAUDE.md`.

| Verifica | Esito |
|---|---|
| Il criterio di `FIX-10` (scenari B e C da 3 a 0 tentativi) | **soddisfatto: 3 → 0** |
| 6 attacchi al confine di provider, incluso `MODEL_PROVIDER=openai` **esplicito** | **6 su 6 bloccati** |
| 13 attacchi all'endpoint locale (userinfo, suffisso, fragment, IP decimale, IPv6-mapped) | **13 su 13 corretti** |
| Regressione runtime: `main` pristine vs corretto | **215 → 239 passed**, stessa unica failure pre-esistente |

**La correzione è migliore di quella che avevo proposto.** `FIX-10b` metteva un interruttore
davanti all'adapter a pagamento; ChatGPT ha **cancellato l'adapter**. Un meccanismo che non
esiste non può essere riacceso per default sbagliato — e questo albero ha già collezionato
sette manopole che non giravano nulla. In più `_validate_local_base` chiude un buco che **io
non avevo identificato**: dopo il fix il percorso locale è l'unico, quindi `LMSTUDIO_BASE`
poteva essere puntato a un endpoint remoto. Merito suo.

**Chiuso da me in aggiunta:** `core/config.py` leggeva la stessa variabile con default
`openai` e il branch non lo toccava. Oggi inerte (nessun consumatore, verificato), ma è una
decisione applicata a metà — corretta nello schema prima che il cablaggio esista, come `S-16`.

**Restano aperti** `FIX-10d` (esito strutturato invece di `""`) e `FIX-10e` (evento per
tentativo, confluisce in `S-07`). Non costano più denaro: costano osservabilità.

`R-SEC-05` passa da **CRITICA aperta** a **chiusa e verificata**.

### Nota su `main`: un `pytest` senza argomenti non colleziona

Trovato durante la verifica, **non causato dal fix** e pre-esistente su `main` @ `1e40376`:
sei moduli di test non si importano — `test_bool_not_helpers` importa `bool_not` ma il modulo
definisce `not_`, `test_bytes_helpers` importa `to_bytes` ma il modulo definisce
`human_bytes`, e altri quattro uguali. `pytest.ini` non li esclude, quindi
`python3 -m pytest` si ferma a `6 errors during collection`.

Non l'ho corretto: è codice di Grok, fuori dalla decisione n. 7. Ma va detto, perché
**finché restano, nessuna claim del tipo "N test verdi" è riproducibile da un terzo** — ed è
esattamente la classe di affermazione che questo programma continua a produrre.

---

## 15. S-18 — eseguire la test suite **sovrascrive la memoria di Grok** nel repository. **HIGH.**

> Trovato il 2026-08-18 durante la verifica di `S-17`, **non cercandolo**: `git status` dopo
> `pytest` mostrava `grok.md` modificato. `main` @ `1e40376`. Difetto pre-esistente.

### 15.1 Il fatto

Dopo aver eseguito `python3 -m pytest`, il working tree conteneva:

```
 M grok.md          <-- file TRACCIATO, memoria di continuità di Grok
?? a.txt
?? notes/hello.txt
?? sub/b.txt
```

E il contenuto di `grok.md` era passato da

```
224 green. Real gates (py_compile+ruff+black) published.
```

a

```
new
```

**La test suite ha distrutto il file di continuità di un'altra IA**, sostituendolo con la
stringa letterale `"new"`. Ripristinato con `git checkout -- grok.md`; i tre file spuri
rimossi.

### 15.2 La causa, dimostrata

`tests/test_files.py` ha una fixture che *intende* isolare:

```python
@pytest.fixture
def tmp_root(tmp_path, monkeypatch):
    """Isolate PROJECT_ROOT to a temporary directory."""
    monkeypatch.setattr("tools.files.PROJECT_ROOT", tmp_path)
    return tmp_path
```

Ma `tools/files.py` cattura la root **nei default degli argomenti**:

```python
PROJECT_ROOT = Path(__file__).resolve().parent.parent          # riga 33
def safe_write(path, content, *, encoding="utf-8", root: Path = PROJECT_ROOT, force=False)
def safe_read (path, ...,                          root: Path = PROJECT_ROOT)
def safe_list (                                    root: Path = PROJECT_ROOT)
def _resolve  (path,                               root: Path = PROJECT_ROOT)
```

**In Python il valore di default di un parametro è valutato una sola volta, alla definizione
della funzione.** Rebindare l'attributo di modulo dopo l'import non cambia i default già
catturati. Misurato:

```
module PROJECT_ROOT : /home/user/ultraJARVIS
after monkeypatch   : /tmp/fake-root
safe_write default  : /home/user/ultraJARVIS     <-- non segue il monkeypatch
```

**La fixture è un no-op.** Ogni chiamata dei test scrive nel repository reale.

### 15.3 Perché è HIGH e non un fastidio

Tre ragioni, in ordine crescente.

1. **Perdita di dati su un file tracciato.** `grok.md` è la memoria di continuità di Grok,
   esattamente come `CLAUDE.md` è la mia. Chi esegue `pytest` e poi `git add -A` **committa la
   distruzione della memoria di un'altra IA** senza accorgersene. Io me ne sono accorto solo
   perché leggo `git status` invece di lanciarlo — è la lezione `E15` che mi ero scritto dopo
   aver committato 16 `.pyc` per lo stesso motivo.

2. **Il test che fa il danno è quello che esercita il bypass di `PROTECTED`.**
   `test_force_override` chiama `safe_write("grok.md", "new", force=True)`. `force=True` è
   precisamente il vettore di `S-11`, e `grok.md` è nella lista `PROTECTED`. Il test **usa il
   bypass contro il repository vero**, non contro una copia.

3. **Due test di protezione passano per il motivo sbagliato.** `test_protected_refusal`
   verifica che scrivere `grok.md` sollevi `PermissionError`, e passa — ma passa perché
   `grok.md` è protetto nella root **reale**, non perché la fixture abbia preparato un file
   protetto in `tmp_path`. Idem `test_escape_root_refused`. Sono verdi, e non stanno
   verificando quello che credono di verificare.

   È la trappola 12 del mio `CLAUDE.md` in forma rovesciata: lì un test che **fallisce** per
   il motivo sbagliato è un falso negativo; qui un test che **passa** per il motivo sbagliato
   è un falso positivo. In entrambi i casi la regola è la stessa — leggere *perché* un test dà
   quel risultato, non solo *che* risultato dà.

**Corollario che rende il tutto peggiore:** finché la fixture non isola, **`FIX-3` e `FIX-4`
non hanno una prova valida**. Le loro asserzioni di contenimento girano contro la root reale,
dove il contenimento esiste per davvero, quindi passerebbero anche se la logica fosse stata
rimossa dalla funzione.

### 15.4 La correzione — `FIX-11`

Non serve toccare la logica: serve che la fixture passi la root **esplicitamente**, oppure che
le funzioni la risolvano a runtime.

```python
# opzione A - la più piccola: la fixture patcha i default già catturati
@pytest.fixture
def tmp_root(tmp_path, monkeypatch):
    monkeypatch.setattr("tools.files.PROJECT_ROOT", tmp_path)
    for fn in ("safe_write", "safe_read", "safe_list", "is_protected", "_resolve",
               "_is_protected"):
        f = getattr(tools.files, fn)
        f.__defaults__ = None            # se root e' keyword-only usa __kwdefaults__
        monkeypatch.setitem(f.__kwdefaults__, "root", tmp_path)
    return tmp_path
```

```python
# opzione B - piu' pulita, cambia tools/files.py: risolvere la root a runtime
def safe_write(path, content, *, encoding="utf-8", root: Path | None = None, force=False):
    root = root if root is not None else PROJECT_ROOT      # letto ORA, non alla def
```

**L'opzione B è quella giusta**, perché rende la fixture esistente corretta senza che nessuno
debba ricordarsi di un elenco di nomi di funzione, e perché il difetto tornerebbe alla prima
funzione nuova aggiunta con lo stesso default.

### Verifica che fallisce finché il difetto è presente

```bash
git status --porcelain grok.md          # deve essere VUOTO dopo una run completa
python3 -m pytest tests/test_files.py -q
git status --porcelain grok.md          # se stampa " M grok.md", il difetto c'e' ancora
```

### 15.5 Cosa NON ho fatto

**Non ho applicato la correzione.** È codice di Grok — `tools/files.py` e `tests/test_files.py`
— e la decisione n. 7 di Christian riguardava `cloud_bridge`, non questo. Ho ripristinato il
danno (`git checkout -- grok.md`, rimozione di `a.txt`, `notes/`, `sub/`) e l'ho documentato.

**Non ho contato `workspace/`** fra i file spuri: è una directory di runtime già prevista da
`pytest.ini` (`norecursedirs`), non un effetto collaterale inatteso.

---

## 16. S-16 — aggiornamento: metà della catena si è chiusa. **MEDIUM, non ancora sfruttabile.**

> 2026-08-18, `main` @ `ef67245`. Aggiornamento di §4-octies, non un finding nuovo.

### 16.1 Cosa è cambiato

Quando avevo trovato `S-16` (memoria senza provenienza) avevo verificato e scritto che **non
era una vulnerabilità attiva**, perché `planner.py`, `job_worker.py` e `natural_tasks.py` non
rileggevano la memoria: il percorso *contenuto → memoria → decisione* non era cablato.

**Adesso metà lo è.** Grok ha aggiunto `recall_semantic` e il planner lo usa:

```python
# core/planner.py:153-154
from core.memory import recall, recall_semantic
related = recall_semantic(text, limit=5, tag="job", min_score=0.05)
...
milestones.append("Review related past jobs: " + "; ".join(unique[:3]))
```

E `core/natural_tasks.py:324` scrive in memoria a fine job:

```python
remember(f"job:{job_id} title={task_plan.title!r} status={final_status}", tags=[...])
```

`task_plan.title` deriva dal prompt dell'utente. Quindi la catena oggi è:

```
prompt -> title -> memoria -> recall_semantic -> milestone del piano -> writer -> codice
```

### 16.2 Cosa NON è cambiato, e perché non lo classifico più grave

**L'ingresso non fidato non esiste ancora.** `bin/uj` prende i prompt dalla riga di comando,
cioè da Christian. Finché è così, il contenuto che entra in memoria è fidato, e il fatto che il
record non abbia provenienza non è sfruttabile da un terzo.

`S-16` passa quindi da *"nessuna delle due metà cablata"* a **"metà a valle cablata, metà a
monte no"**. Resta `MEDIUM`. Non lo alzo, perché non ho un vettore.

### 16.3 Misurato, e il risultato è in parte a favore del progetto

Non ho dedotto la selettività del recall: l'ho misurata, su una memoria costruita con i record
esattamente nel formato che `natural_tasks` scrive.

| Query | Risultati sopra `min_score=0.05` |
|---|---|
| `"export data to csv"` (legittima, correlata) | **1**, score `0.3333` — il job giusto |
| `"quantum chemistry solver"` (totalmente scorrelata) | **0** |

**`min_score=0.05` sembra permissivo ma non lo è nei fatti:** una query scorrelata non fa
emergere nulla. È una mitigazione reale, e va accreditata — significa che un fatto ostile in
memoria non compare in un piano qualunque, ma solo in piani lessicalmente vicini.

Confermato invece il difetto originale, con la stessa misura:

```
campi di un record di memoria: ['fact', 'tags', 'ts']
```

**Nessun campo di provenienza.** Un fatto scritto da Christian con `uj remember` e un fatto
derivato dal titolo di un job restano indistinguibili.

### 16.4 Perché la correzione va fatta adesso e non dopo

È la stessa forma dell'ordine di `S-12`/`S-13` e di `S-17`/writer adapter, e in questo programma
si è già sbagliata due volte: **la metà a valle è arrivata prima della correzione di schema.**
Quando arriverà la metà a monte — un ingresso che accetta testo non fidato, per esempio un job
creato da contenuto web o da una API — il campo di provenienza andrà aggiunto a uno schema che
nel frattempo ha accumulato record senza. Migrare una memoria è più caro che progettarla.

`remember()` deve accettare e persistere un `source` esplicito, con almeno la distinzione
`OWNER` / `DERIVED` / `UNTRUSTED`, e `recall_semantic` deve poter filtrare su quello. È una
modifica di poche righe **oggi**.

### 16.5 Confine

**È di GEMINI, non di Grok.** `UJ-MEM-001` — *"Specify database, memory, provenance, and
search"* — è il task che possiede questo schema, ed è **BLOCKED** e non consegnato. Io ne sono
il **reviewer**. Quindi non correggo: segnalo, e lo scrivo nel briefing perché arrivi a chi
deve progettarlo prima che la memoria si riempia.

### 16.6 Due previsioni mie che NON si sono avverate, e lo dico

In `S-17` §13.6 avevo scritto che *"la terza e la quarta porta sono già scritte nella roadmap"*,
riferendomi a *"Embedding-backed recall (needs model)"* e *"Multi-agent debate loop"* di
`PHASE2.md`. Grok le ha implementate entrambe, e **nessuna delle due ha aperto una porta verso
un provider a pagamento**:

- **`recall_semantic`** è TF-cosine **locale**, non usa embedding di un modello remoto;
- **`advisors/debate.py`** fa consenso fra `safety`, `style` e `critic`, che sono advisor
  **locali**. Nessuna chiamata a `cloud_bridge`.

Verificato con `grep` su tutti i moduli nuovi: nessuno importa `cloud_bridge` o `ask_cloud_ai`.
La previsione era ragionevole quando l'ho scritta ed è stata smentita dai fatti. Registrarlo
serve a non lasciare in giro un allarme che non ha più oggetto.

**E `core/monetization.py` non è ciò che il nome suggerisce a chi teme l'Articolo 5:** è usage
metering che scrive un JSONL locale e dichiara *"no billing provider yet"*. Riguarda l'addebito
a **futuri clienti**, non la spesa del programma. Nessun provider di pagamento, nessuna rete.

---

## 17. Sessione 5 — la catena writer→promote→registry è ora completa, e il suo flag di sicurezza è una costante

**Ref misurato:** `origin/main` `25b1b7d`, 2026-08-18T12:36 +02:00. Tre commit nuovi:
`core/nt_helpers.py` (*"LLM writer, multi-detect, skills hint, deps graph"*),
`core/nt_runner.py` (*"NaturalTaskRunner full pipeline + promote with skills"*) e la
continuity.

### 17.1 `S-17` §13 si è avverata di nuovo: il writer è cresciuto, il fix non è arrivato

In §13 avevo scritto che `FIX-10a/10b` andava applicato **prima** del writer adapter, con la
stessa logica di `S-12` prima di `S-13`. Il writer non solo è rimasto: è stato **riscritto e
allargato** dentro la pipeline dei natural task, e il fix non è ancora su `main`.

Misurato con `docs/threat-models/probes/S-17-writer-pipeline-probe.py`. Nessuna rete reale:
`openai` e `requests` sono stub che registrano il tentativo e sollevano.

| Scenario | `origin/main` |
|---|---|
| nessuna variabile | nessuna chiamata |
| **`UJ_WRITER_LLM=1` da solo** | **3 tentativi fatturabili a OpenAI** |
| `UJ_WRITER_LLM=1` + `OPENAI_API_KEY` | 3 tentativi fatturabili |
| `UJ_WRITER_LLM=1` + `MODEL_PROVIDER=local` | loopback, 3 tentativi locali |

Una variabile sola, sul percorso che **genera codice**. Invariato rispetto a §13, ma ora il
codice generato entra in una pipeline che lo promuove.

**Nota di secondo ordine su `PROVIDER`.** In `cloud_bridge.py` è una **costante di modulo**,
valutata una volta sola all'import. Su `main` il default è `"openai"`, quindi la costante
fallisce **aperta**: chi imposta `MODEL_PROVIDER` dopo il primo import non è protetto. Sul
branch CLAUDE il meccanismo è identico ma il default è `local` e un provider non locale viene
rifiutato: la stessa costante fallisce **al sicuro**. Non è il meccanismo a essere sbagliato,
è il verso del suo default.

### 17.2 Cosa Grok ha fatto BENE, e va detto prima del rilievo

`promote_job_to_tools` **non** è la promozione senza gate descritta in `S-12`/`S-13`. Quella è
chiusa, e la funzione di oggi ha quattro controlli reali, verificati leggendo il sorgente al
ref corrente:

1. `scan_text(text)` sul contenuto, con `PermissionError` se ci sono pattern pericolosi;
2. `is_protected(dest, root=root)` prima di scrivere;
3. `safe_write(dest, content, root=root, force=force)`, cioè contenimento nella root;
4. sanitizzazione del `module_name` con rifiuto dei nomi non validi.

E `FIX-7` ha reso `ToolSpec.safe` un flag **che funziona davvero**: `Registry.call()` alla
riga 189 solleva `PermissionError` se `spec.safe` è falso. Nella mia review di sessione 3
avevo classificato `ToolSpec.safe` fra le *"manopole di sicurezza che non girano nulla"*.
**Non è più vero, e la correzione è di Grok.**

### 17.3 `S-20` — la promozione cabla `safe=True`. **MEDIUM.**

Proprio perché `FIX-7` ha reso il flag efficace, il valore che gli viene dato conta.

In `promote_job_to_tools`, con `register=True`:

```python
spec = ToolSpec(
    name=tool_name,
    ...
    safe=True,
    tags=["promoted", tool_prefix],
)
```

**`safe=True` è l'unica occorrenza di `safe=` nella funzione.** Non esiste input, esito di
scan, provenienza o parametro che possa produrre `safe=False`.

**Prova eseguita**, in un worktree su `origin/main` e con `root` in una directory temporanea,
per non toccare `tools/` del repository:

```
tool registrati dalla promozione: 1
  name='demo_promoted.run'  safe=True  module='tools.demo_promoted_helpers'  tags=['promoted', 'demo_promoted']
occorrenze di 'safe=' nella funzione: ['safe=True']
```

**Perché conta.** `Registry.call()` decide se eseguire un tool leggendo `spec.safe`. Per ogni
tool scritto a mano quel flag è una scelta — e infatti sette tool del catalogo sono
`safe=False`. Per il codice **promosso**, cioè l'unica categoria che nessun umano ha scritto,
il flag è una costante permissiva: il gate esiste, funziona, e sulla classe di tool più
sospetta non può mai rifiutare.

Con `UJ_WRITER_LLM=1` la catena è completa: un modello remoto **a pagamento** scrive il corpo,
gli scan lo lasciano passare, la promozione lo scrive in `tools/`, e la registrazione lo marca
`safe=True`. Nessuno dei passaggi è privo di controlli. Il difetto è che l'ultimo controllo
riceve sempre lo stesso ingresso.

**Non è `S-12`/`S-13` che si riapre.** Quelli erano *"nessun gate"*. Questo è *"il gate c'è e
la sua condizione è costante"* — la variante più difficile da vedere, perché il codice del
gate è corretto e leggerlo non rivela niente.

**Correzione proposta**, piccola e nel portafoglio di Grok:

```python
# prima
safe=True,
# dopo
safe=False,   # il codice promosso non è safe per default: lo diventa con una
              # decisione esplicita, come i sette tool del catalogo che già lo sono
```

Con `safe=False` il tool resta registrato, visibile in `bin/uj` come *unsafe*, e
`Registry.call()` lo rifiuta finché qualcuno non lo promuove deliberatamente. È lo stesso
schema già usato per `files.safe_write`, `browser.open_url` e `automation.*`.

**Ordine, detto esplicitamente:** `FIX-10a/10b` (cioè il merge dello strict-zero su `main`)
va **prima** di `S-20`. Finché il writer va su un provider a pagamento, il codice promosso è
sia non gratuito sia marcato sicuro; chiudendo prima `S-20` si avrebbe codice a pagamento
correttamente marcato non sicuro, che è meglio ma non risolve il costo. Stessa logica di
`S-12` prima di `S-13`.

### 17.4 Confini e limiti dichiarati

- `core/`, `tools/` e `advisors/` sono di **GROK**. Ho misurato e segnalato, **non corretto**.
- Non ho eseguito nessuna chiamata di rete reale. La sonda sostituisce `openai` e `requests`.
- La prova di promozione ha scritto **solo** in una directory temporanea, passata via `root`.
  `tools/` del repository non è stata toccata: verificato nell'output della prova.
- Non ho misurato `nt_runner.build_and_run` end-to-end: richiede i gate reali e un job
  completo. Ho misurato i due estremi della catena, writer e promote, e ho letto il tratto
  in mezzo. Il tratto letto **non** lo dichiaro verificato.
- **Correzione di una mia affermazione precedente:** nella review di sessione 3 avevo elencato
  `ToolSpec.safe` fra le manopole che non applicano nulla. Dopo `FIX-7` è falso. Lasciarlo in
  giro sarebbe un allarme senza oggetto, e renderebbe invisibile il rilievo vero, che è
  esattamente l'opposto: il flag conta, e la promozione non lo usa.

---

## 18. `S-18` riverificato in sessione 5 — **ancora aperto su `main`**

**Ref:** `origin/main` `25b1b7d`. Riprodotto in un worktree usa-e-getta; il repository di
lavoro non e' stato toccato e `grok.md` nel mio albero e' rimasto a `d72ece89…`.

`pytest` **non e' installato** in un container nuovo, quindi la verifica documentata in
`GROK_FIX_LIST.md` → `FIX-11` non e' eseguibile a freddo. Ho riprodotto il **meccanismo** con
Python semplice, che e' dove sta il difetto.

**Precisazione che rende la diagnosi esatta.** `root` e' un parametro **keyword-only**, quindi
il valore catturato alla definizione non sta in `__defaults__` — che vale `None` — ma in
**`__kwdefaults__`**. Cercarlo nel posto sbagliato porta a concludere che nessun default sia
stato catturato, che e' la conclusione opposta a quella vera.

| Misura | Valore |
|---|---|
| `tools.files.PROJECT_ROOT` dopo il monkeypatch | la temp dir |
| `safe_write.__kwdefaults__['root']` dopo il monkeypatch | **la root reale, invariata** |
| `grok.md` prima → dopo | `d72ece89c9e7` → `6fa4b5249c69` |
| file scritto nella temp dir | **no** |

**Controllo positivo:** passando `root=<temp>` esplicitamente, `safe_write` scrive nella temp
dir. Il contenimento **funziona**; sbagliato e' solo il momento in cui la root viene legata.

**È la terza occorrenza oggi della stessa forma:** un valore catturato una volta sola, e una
riassegnazione successiva che sembra avere effetto e non ne ha. Le altre due sono `PROVIDER` in
`cloud_bridge.py` (§17.1) e `safe=True` nella promozione (§17.3). In tutti e tre i casi il
codice del controllo e' corretto e leggerlo non rivela niente: quello che inganna e' **quando**
il valore viene fissato.

`S-18` e' di **GROK**. Segnalato e riverificato, non corretto.

---

## 19. `S-17` quarta verifica su `main` — **la terza porta prevista si è aperta.** CRITICA, invariata

**Ref misurato:** `origin/main` @ `27b767309090adf77778575fe22840a1584355aa`, 2026-08-19.
**Sonda:** `docs/threat-models/probes/S-17-three-doors-probe.py`, riproducibile dalla root.
**Nessuna chiamata di rete reale eseguita.** I moduli `openai` e `requests` sono sostituiti
da stub che registrano il tentativo e sollevano.

### 19.1 Lo stato di `S-17` e `S-19` non è cambiato

Quarta verifica consecutiva. Su `origin/main`:

| Marcatore | Valore |
|---|---|
| `MODEL_PROVIDER` default | **`"openai"`** in tre punti: `cloud_bridge.py:12`, `cloud_bridge.py:109`, `core/config.py:43` |
| `_call_openai` | **presente** |
| `UJ_ALLOW_PAID_API` | **assente** |
| validazione loopback di `LMSTUDIO_BASE` | **assente** |
| guard di budget in `embed()` | dentro `try: … except Exception: pass` — **`QuotaExceeded` inghiottito** (`S-19`) |

La decisione n. 7 del proprietario resta **approvata, verificata e non applicata su `main`**.
Il fix vive sul mio ramo e su `agent/strict-zero-cloud-bridge-20260818`.

### 19.2 Le porte adesso sono tre, misurate

`§13` prevedeva che le porte a una variabile sarebbero aumentate e che il terzo punto sarebbe
arrivato sul percorso della memoria. È successo.

| Porta | default | **solo il flag** | flag + `MODEL_PROVIDER=local` |
|---|---|---|---|
| planner — `UJ_PLANNER_LLM=1` | nessuna chiamata | **A PAGAMENTO, 3 tentativi** | loopback, 3 |
| writer — `UJ_WRITER_LLM=1` | nessuna chiamata | **A PAGAMENTO, 3 tentativi** | loopback, 3 |
| **embedding — `UJ_EMBEDDING=1`** | nessuna chiamata | **A PAGAMENTO, 1 tentativo** | loopback, 1 |

Controllo incrociato, `embed()` guidata direttamente senza il gate di `core/memory.py`:

```
default               : A PAGAMENTO (1 tentativo)
MODEL_PROVIDER=local  : loopback (1)
```

### 19.3 L'asimmetria è 1 contro 3, e la conclusione operativa non cambia

**Una** impostazione corretta — `MODEL_PROVIDER=local` — chiude tutte e tre le porte, perché
tutte e tre attraversano lo stesso ponte e leggono la stessa variabile. **Tre** impostazioni
diverse possono aprirne una ciascuna, indipendentemente.

È l'argomento più forte finora per correggere **il ponte** e non i gate: i gate sono tre e
cresceranno, il ponte è uno. `FIX-10a`/`FIX-10b` sono nel ponte. La correzione già scritta su
`agent/strict-zero-cloud-bridge-20260818` — che **rimuove** l'adapter invece di gatearlo —
chiude tutte e tre le porte insieme e rende la quarta impossibile per costruzione.

### 19.4 Che cosa Grok ha fatto BENE, misurato

- **Il default è sicuro su tutte e tre le porte.** Colonna 1: zero tentativi ovunque. Gli
  opt-in sono reali, non decorativi, e nessuno è acceso di nascosto.
- **La terza porta ha un gate proprio.** `core/memory.py:115` richiede `UJ_EMBEDDING=1`. Il
  mio primo sospetto — un percorso di embedding senza opt-in — **era sbagliato**, e l'ho
  verificato prima di scriverlo.

### 19.5 Esposizione reale, verificata per chiamante e non presunta

Non tutte e tre le porte sono ugualmente vicine all'utente. Tracciato dal `bin/uj` in giù:

| Porta | Catena | Stato |
|---|---|---|
| writer | `bin/uj` → `natural_tasks` → `nt_runner:187` → `_code_for_prompt` → `_code_via_llm` | **CABLATA** |
| planner | `nt_runner:9` importa `plan`, e `nt_runner` è sulla stessa catena | **CABLATA** |
| embedding | `embed_texts` è chiamata solo da `recall_semantic_embedded`, che ha **zero chiamanti** fuori dal proprio test | **LATENTE** |

**La porta dell'embedding è costruita ma non collegata.** È la stessa situazione di `S-16`:
il momento giusto per correggerla è **adesso**, prima che qualcuno la cabli, non dopo. Cablarla
è una riga.

La porta del writer resta la più grave delle tre perché è sul percorso che **genera codice**,
poi promosso in `tools/` — cioè si combina con `S-20`.

### 19.6 Errori commessi COSTRUENDO questa misura, registrati perché il metodo conta

La prima versione della sonda ha prodotto una tabella in cui **tutte e dodici le celle
dicevano "nessuna chiamata"**, cioè *"`S-17` è chiuso su `main`"*. Era falsa, per due difetti
distinti, entrambi miei:

1. **La sonda importava dal worktree corrente** dichiarando nell'intestazione di misurare
   `origin/main`. Il worktree corrente è il ramo CLAUDE, che porta già il fix STRICT_ZERO.
   Corretto materializzando un worktree sul ref, perché il percorso attraversa cinque moduli e
   non basta un `git show` di un file.
2. **`env=` non veniva passato a `subprocess.run`.** Lo scenario veniva costruito riga per riga
   e mai applicato: tutte e dodici le celle misuravano la stessa identica configurazione
   ambientale.

**Su un finding che riguarda i soldi del proprietario avrei riportato "chiuso" dove è aperto.**
Entrambi i difetti sono stati presi dalla stessa euristica di sempre: il risultato contraddiceva
quello che sapevo, e ho indagato invece di riportarlo.

Contromisura aggiunta al codice della sonda, non solo a questo documento: se una chiamata
solleva **prima** di raggiungere il ponte — firma sbagliata, dipendenza assente — la cella
adesso stampa `NON MISURATO (<errore>)` invece di `nessuna chiamata`. È l'estensione della
lezione `E22`: zero tentativi per un guasto a monte si legge come sicurezza, ed è il falso
negativo più facile da consegnare in questa classe di misure.

---

## 20. Stato consolidato dei 20 findings su `main` — riverificato, non ricopiato

**Ref:** `origin/main` @ `27b767309090adf77778575fe22840a1584355aa`, 2026-08-19.

Questo documento è cresciuto per accumulo in quattro sessioni, e i findings sono stati chiusi
a ref diversi in momenti diversi. Nessuno — me compreso — aveva una vista di **cosa è aperto
adesso**. Questa sezione la fornisce, e ogni verdetto è stato **riletto nel codice al ref
corrente**, non ereditato da una sezione precedente.

### 20.1 Lo stato

| ID | Titolo | Stato | Come l'ho confermato |
|---|---|---|---|
| `S-01` | `ToolSpec.safe` dichiarato e mai letto | **CHIUSO** | `registry.py:190` — `if not getattr(spec,"safe",True): raise PermissionError` |
| `S-02` | `registry.call` senza ammissione, tetto, evento | **PARZIALE** | letto: gate presente (`safe` + kwargs privilegiati), **tetto assente, evento assente** |
| `S-03` | `email.send`: `force` e `SAFE_MODE` finte | **CHIUSO** | `send()` chiama `_safe_mode()` **live** a riga 34; la globale di modulo non è sul percorso |
| `S-06` | automazione UI nel catalogo | **APERTO — policy** | 2 riferimenti `automation.*` nel registry. Non è un bug: è una decisione del proprietario |
| `S-07` | nessun evento `tool.*` | **APERTO** | `Registry.call` non emette nulla: zero occorrenze di `tool.called/returned/failed` |
| `S-08` | — | **CHIUSO** | sessione 3, §10-ter |
| `S-09` | `lstrip("www.")` non toglie il prefisso | **CHIUSO** | costrutto assente da `tools/browser.py` |
| `S-10` | `safe_read` legge fuori dalla root | **CHIUSO** | `safe_read` verifica il contenimento |
| `S-11` | `force=True` aggira `PROTECTED` via registry | **CHIUSO** | `registry.py:183` — `PRIVILEGED_KWARGS = {"force","root"}`, rifiutati con `PermissionError` |
| `S-12` | promozione senza gate di safety | **CHIUSO** | `scan_text` presente nella promozione |
| `S-13` | i tool promossi non compilano | **SUPERATO** | non è più il contenimento di `S-12`, che è chiuso per merito proprio |
| `S-14` | una build fallita riporta `PASS` | **CHIUSO** | `core/gates.py` righe 123, 139, 159 — `status = "PASS" if code == 0 else "FAIL"` |
| `S-15` | `run_gates(use_real=False)` stampa `PASS` | **CHIUSO** | ritorna `"ok": None` con il commento *"not a real pass – caller must not treat as success"*, e stampa `STUB (not executed)` |
| `S-16` | memoria senza provenienza | **APERTO** | `entry = {"ts","fact","tags"}` — nessun campo di origine |
| `S-17` | percorso a pagamento per default | **APERTO** | §19, misurato: tre porte |
| `S-18` | la test suite sovrascrive `grok.md` | **APERTO** | `root: Path = PROJECT_ROOT` nei default di `safe_write` |
| `S-19` | il budget gate di `embed()` è inghiottito | **APERTO** | `try: assert_llm_budget() … except Exception: pass` |
| `S-20` | la promozione cabla `safe=True` | **APERTO** | unica occorrenza di `safe=` nella funzione |

**Bilancio: 12 chiusi, 1 superato, 1 parziale, 6 aperti** — di cui uno (`S-06`) è una decisione
di policy e non un difetto da correggere.

### 20.2 Due findings che avevo documentato come non chiusi lo sono, e conta dirlo

- **`S-03`**: la mia documentazione lo dava parziale perché `SAFE_MODE` era una globale di
  modulo riscrivibile a runtime. Non è più vero sul percorso che conta: `send()` legge
  `_safe_mode()` **a ogni chiamata**, quindi l'attacco `email.SAFE_MODE = False` non funziona
  più. La globale a riga 85 sopravvive come binding legacy che `send()` non usa.
- **`S-15`**: lo davo aperto perché `run_gates(use_real=False)` *"stampa che i gate sono
  passati"*. Non lo fa più: ritorna `ok: None`, stampa `STUB (not executed)` e porta un commento
  che dice al chiamante di non trattarlo come successo. È esattamente la correzione giusta.

Lasciare quei due segnati come aperti avrebbe sovrastimato la superficie aperta di un terzo, e
avrebbe fatto lavorare Grok su cose già fatte.

Rilievo minore residuo su `S-03`: `force` viene **registrato** (`record["force_requested"]`) ma
non sblocca l'invio — solo `UJ_EMAIL_UNSAFE=1` lo fa. È probabilmente la scelta giusta, ma il
nome del parametro promette un potere che non ha.

### 20.3 Metodo, e tre falsi positivi della mia stessa sonda

Ho costruito uno script che riverifica i venti findings contro un worktree al ref. **Ha
prodotto tre verdetti sbagliati**, tutti nella direzione più pericolosa — *aperto* dove è
chiuso:

| Finding | Perché l'euristica ha sbagliato |
|---|---|
| `S-11` | cercavo forme come `allowed_kwargs` o `_filter`; `FIX-4` lo implementa come `PRIVILEGED_KWARGS & set(kwargs)` |
| `S-14` | il pattern generico pescava `assert "ok" in result.lower()` in `nt_runner.py:206` — che è una stringa di **template**, cioè codice generato, non un verdetto di gate |
| `S-03` | vedevo `SAFE_MODE =` a livello di modulo e non che `send()` non lo usa |

**Un audit statico dei findings di sicurezza produce risposte sbagliate con la stessa
sicurezza con cui produce quelle giuste** — cioè è esattamente la forma che passo il tempo a
contestare nel codice altrui: un controllo che sembra un controllo. La regola che ne ricavo e
che ho applicato prima di scrivere questa tabella: **lo script serve a produrre i candidati,
non i verdetti.** Ogni riga marcata aperta o parziale qui sopra è stata riletta nel codice.

Le due euristiche sbagliate sono state corrette nello script con il motivo scritto accanto,
perché la prossima esecuzione non le ripeta.

---

## 21. `S-21` — `PRIVILEGED_KWARGS` è una lista di divieti, non di permessi. **MEDIUM, latente**

**Ref:** `origin/main` @ `27b767309090`, 2026-08-19. Trovato cercando difetti **nuovi** nel codice
arrivato dopo la mia ultima caccia vera (sessione 3-4): 2.171 righe fra `core/multi_file.py`,
`core/nt_runner.py`, `uj_cli.py` e le modifiche a `tools/`.

### 21.1 Il difetto

`core/registry.py:183` rifiuta di inoltrare due kwarg:

```python
PRIVILEGED_KWARGS = {"force", "root"}
```

È una **denylist**: nomina i due che sono stati pensati. Qualunque altro kwarg privilegiato
passa per default.

E ne esiste un terzo. **Cinque funzioni prendono `real=`**, che scavalca il gate d'ambiente
(`UJ_OS_REAL`, `UJ_AUTO_REAL`) e non è nella lista:

| Tool | Effetto con `real=True` |
|---|---|
| `os.open_app` | `subprocess.Popen([bin])` — **lancia un processo**, e `terminal` è nell'allowlist |
| `os.set_volume` | `subprocess.run(["pactl", …])` |
| `automation.type_text` | `xdotool type` — **battiture sintetiche** |
| `automation.paste_text` | scrive negli appunti via `xclip` |
| `browser.open_url` | apre il browser |

### 21.2 Oggi NON è sfruttabile, e il motivo conta

Misurato eseguendo, su un worktree a `origin/main`:

```
registry.call("os.open_app", "terminal", real=True)     -> PermissionError: Tool os.open_app is not marked safe
registry.call("automation.type_text", "…", real=True)   -> PermissionError: …
registry.call("browser.open_url", "…", real=True)       -> PermissionError: …
```

Tutte e cinque sono registrate `safe=False`, e `FIX-7` fa sollevare `Registry.call` **prima** che
il kwarg venga inoltrato. Enumerazione completa dei **135 tool registrati**: **nessun tool
`safe=True` accetta un kwarg privilegiato non filtrato**. I due che lo prendono
(`files.safe_read`, `files.safe_list`) usano `root`, che è **nella** denylist.

### 21.3 Perché resta un finding

**Il contenimento è il flag `safe`, non il filtro dei kwarg** — e sono due decisioni
indipendenti, prese in momenti diversi da persone diverse.

`FIX-4` è stato scritto **per** fermare i kwarg privilegiati. Su questi cinque non è lui a
fermarli: è `FIX-7`. Basta che qualcuno marchi `safe=True` **una sola** di quelle cinque —
`os.set_volume` sembra innocuo — e il bypass diventa vivo **senza nessun'altra modifica** e
senza che nulla lo segnali.

È la **quinta** volta in questo programma che il contenimento reale è diverso dal controllo che
sembra fornirlo, dopo il trasporto SMTP assente, i moduli `core` mancanti, la virgoletta che
mascherava `S-12` e il pacchetto `openai` non installato. Le prime due hanno già smesso di
proteggere durante il programma.

### 21.4 Correzione: invertire la polarità

Una **denylist** di kwarg privilegiati nomina quelli a cui si è pensato. Un tool nuovo con un
kwarg nuovo è inoltrato per default, e nessuno se ne accorge finché non serve.

```python
# adesso — denylist: passa tutto tranne due
PRIVILEGED_KWARGS = {"force", "root"}
blocked = PRIVILEGED_KWARGS & set(kwargs)

# proposta — allowlist per tool: passa solo ciò che la ToolSpec dichiara
allowed = set(getattr(spec, "forwardable_kwargs", ()))
blocked = set(kwargs) - allowed
```

**Stopgap in una riga**, se l'inversione è troppo per adesso: `PRIVILEGED_KWARGS = {"force",
"root", "real"}`. Chiude i cinque casi noti e lascia aperta la classe.

### 21.5 Che cosa NON affermo

- **Non è una vulnerabilità attiva.** Attraverso il registry non è raggiungibile, e l'ho
  verificato eseguendo.
- **Un import diretto** (`from tools.automation import type_text`) ha sempre bypassato tutto:
  quello è `S-02`, non questo.
- **Non ho eseguito nessuna azione reale**: nessun processo lanciato, nessuna battitura, nessun
  browser aperto. I tre test qui sopra terminano tutti con un rifiuto.
- La composizione *"apri un terminale + digita"* è **teorica** in questo stato: entrambe le
  chiamate sono rifiutate.

---

## 22. `S-22` — due funzioni si chiamano `safe_write`, e quella sul percorso di build non contiene nulla. **HIGH, latente**

**Ref:** `origin/main` @ `27b767309090`, 2026-08-19.
**Riproduzione:** `python3 docs/threat-models/probes/S-22-uncontained-write-probe.py`
(materializza da sé un worktree al ref, non tocca il repository reale, non usa la rete).

### 22.1 Il difetto in una riga

Nel repository esistono **due funzioni chiamate `safe_write`**. Una controlla la root e la lista
`PROTECTED`; l'altra non controlla niente. **Il percorso che costruisce ed esegue i job usa la
seconda**, importandola con un alias che promette il contrario:

```python
# core/nt_helpers.py:7  e  core/nt_runner.py:13
from core.reliability import safe_write as guarded_write
```

`core/reliability.py:46` per intero, nella parte che conta:

```python
def safe_write(path, content, encoding="utf-8", backup=True) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)   # crea qualunque directory
    ...
    tmp.write_text(content, encoding=encoding)
    tmp.replace(path)                                 # scrive qualunque path
```

Nessun `relative_to(root)`, nessun `is_protected`, nessun parametro `root`. Il nome del modulo
— *reliability* — dice esattamente ciò che fa: scrittura **atomica**, con backup e file
temporaneo. È affidabilità, non contenimento. **`guarded_write` è l'unica parola, in tutta la
catena, che afferma una guardia**, ed è un alias scelto al punto di import.

### 22.2 Misurato, non dedotto

```
=== A) core.reliability.safe_write, cioè guarded_write ===
  !! SCRITTO fuori da qualunque root: /tmp/.../fuori/vittima.txt
     contenuto ora: 'SOVRASCRITTO da core.reliability.safe_write'

=== B) tools.files.safe_write, la funzione OMONIMA indurita da FIX-3/FIX-4 ===
  ok rifiutato: PermissionError: Path escapes project root: /tmp/.../fuori/vittima.txt
  contenuto dopo B: 'ORIGINALE'
```

Stesso nome, stesso path, esito opposto.

### 22.3 Quanto è cablata: 12 punti di scrittura

| File | Chiamate a `guarded_write` |
|---|---:|
| `core/nt_runner.py` | **11** |
| `core/nt_helpers.py` | **1** |

Scrivono `plan.md`, `gates.txt`, `summary.json`, `critique.json`, `safety.json`, `style.json`,
`debate.json`, i moduli generati, **`tool.py` (due volte)** e `test_tool.py`. `tool.py` è
esattamente il file che `promote_job_to_tools` copia poi dentro `tools/`.

### 22.4 Da dove arriva il path, e perché oggi NON è sfruttabile dalla CLI

`core/nt_runner.py:49-51`:

```python
job_id = f"job_{slugify(task_plan.title)[:20]}_{int(time.time()) % 100000}"
job_dir = self.jobs_root / job_id
if output_dir:
    job_dir = Path(output_dir)      # <-- grezzo, nessuna validazione
```

Due sorgenti, e vanno giudicate separatamente:

- **dal titolo del piano → SICURO.** `core/utils.py:10` fa
  `re.sub(r"[^a-z0-9]+", "_", text)`, che distrugge `/`, `\`, `.` e `..`. Un titolo ostile non
  produce un path. **Lo scrivo perché è la difesa che regge**, e attribuirle un difetto che non
  ha manderebbe Grok a correggere la cosa sbagliata;
- **da `output_dir` → NON validato**, usato come `Path(...)` così com'è.

**La CLI non lo espone.** `bin/uj:48` chiama `enqueue(args.prompt)` senza `output_dir`;
`uj_cli.py:13` chiama `build_and_run(args.prompt)` e basta. Verificato con `git grep`, non
presunto: gli unici passaggi di `output_dir` sono la firma di `enqueue` e la riga che lo inoltra.

### 22.5 La catena che lo rende raggiungibile, e che è il vero contenuto del finding

`core/job_worker.py`:

```python
def enqueue(prompt: str, *, output_dir: str | None = None) -> dict:   # :20
    rec = {"prompt": prompt, "output_dir": output_dir, "ts": time.time()}
    ...                                                # scritto in workspace/queue.jsonl
    out = runner.build_and_run(rec["prompt"], rec.get("output_dir"))  # :61, inoltrato grezzo
```

`workspace/queue.jsonl` **non è in `PROTECTED`** (15 voci, controllate una per una) e sta
**dentro** la root. Quindi una scrittura che il gate indurito **approva** deposita un
`output_dir` arbitrario che il percorso di build usa **senza gate**. Misurato:

```
=== C) la catena ===
  is_protected("workspace/queue.jsonl") = False
  la scrittura CONTENUTA dentro la root è stata accettata
  output_dir che il worker inoltrerebbe: /tmp/.../fuori/job_fuori_root
  Path(output_dir) è dentro la root? False
  !! job_dir creata e plan.md scritto FUORI dalla root
```

**Una scrittura contenuta si trasforma in una scrittura non contenuta attraversando una coda.**
Non serve bucare `FIX-3`: basta usarlo per il suo scopo su un file che nessuno considera
sensibile.

### 22.6 L'asimmetria è dentro un solo file, ed è la parte che sorprende

`core/nt_runner.py` importa **entrambe** le funzioni, a quaranta righe di distanza:

| Riga | Import | Contenimento |
|---:|---|---|
| 13 | `from core.reliability import safe_write as guarded_write` | **nessuno** |
| 242 | `from tools.files import safe_write, is_protected` (dentro `promote_job_to_tools`) | root + `PROTECTED` |

La funzione giusta è già lì, già importata, nello stesso file. **La promozione è protetta, la
costruzione no** — e la costruzione è ciò che genera il contenuto che la promozione poi copia.

### 22.7 Correzione proposta

**`FIX-15a` — un solo `safe_write`.** Due funzioni omonime con contratti di sicurezza opposti
sono una trappola per chiunque legga un import. Far delegare `core.reliability.safe_write` a
`tools.files.safe_write` per il controllo del path, mantenendo l'atomicità e il backup che sono
il suo valore vero.

**`FIX-15b` — validare `output_dir` all'ingresso**, non al punto di scrittura:

```python
if output_dir:
    cand = Path(output_dir).resolve()
    if not str(cand).startswith(str(self.jobs_root.resolve())):
        raise PermissionError(f"output_dir escapes jobs root: {cand}")
    job_dir = cand
```

**`FIX-15c` — rinominare l'alias.** `guarded_write` afferma una guardia che non c'è. Finché
`15a` non è applicato, `atomic_write` descrive la funzione senza mentire.

### 22.8 Che cosa NON affermo

- **Non è sfruttabile dalla CLI oggi.** Nessun comando di `bin/uj` accetta `output_dir`, e l'ho
  verificato enumerando i nove sottocomandi, non a memoria.
- **Non ho eseguito `process_one()` end-to-end.** Fa girare planner e gate reali. Ho misurato
  separatamente le tre parti — la primitiva di scrittura, l'ammissibilità della coda, la
  costruzione del path — e ho **letto** la riga che inoltra. La catena è dimostrata a pezzi, non
  in un colpo solo, e va detto così.
- **`slugify` non è il problema.** È l'unica delle due sorgenti che è sicura.
- **Non ho toccato una riga** di `core/`. È codice di Grok.

---

## 23. `S-23` — `PROTECTED` nomina il posto in cui il codice **stava**. **MEDIUM**

**Ref:** `origin/main` @ `27b767309090`, 2026-08-19.
**Riproduzione:** `python3 docs/threat-models/probes/S-23-protected-staleness-probe.py`

### 23.1 Il difetto

`core/natural_tasks.py` è nella lista `PROTECTED`. Oggi è un **guscio di re-export di 26
righe**: la logica è stata spostata in `core/nt_pipeline.py` (27), `core/nt_runner.py` (311) e
`core/nt_helpers.py` (133). **Nessuno dei tre è protetto.**

Fra questi c'è `promote_job_to_tools`, cioè il gate di safety che `FIX-1` ha introdotto sulla
promozione di codice generato.

```
=== B) chi contiene promote_job_to_tools, ed è protetto? ===
  definita in core/nt_runner.py  ->  protetto=False
```

### 23.2 Misurato per esecuzione, contro i due file

```
=== C) scrittura reale contro i due file, in una root finta ===
  core/registry.py     rifiutato: PermissionError: Refusing to write to protected path: core/registry.py
  core/nt_runner.py    ACCETTATO, file cambiato=True
```

`FIX-4` protegge il registry — e il registry è la porta d'ingresso, quindi la scelta è giusta.
Ma **il file che decide se un tool generato è promuovibile è scrivibile**, e sovrascriverlo non
richiede né `force=True` né un bypass: basta chiedere.

### 23.3 La copertura in numeri

| | File | Righe |
|---|---:|---:|
| moduli in `core/` | **23** | **2483** |
| protetti | **4** | **418** |
| non protetti | **19** | **2065** |

**Il 16,8% delle righe di `core/` è coperto**, e il modulo più lungo della directory
(`nt_runner.py`, 311 righe) è fuori. Non sostengo che debbano esserlo tutti: `PROTECTED` è una
lista di file che il sistema non deve riscrivere da solo, non un permesso di filesystem. Il
difetto non è la dimensione della lista, è che **la lista descrive un'organizzazione del codice
che non esiste più**.

### 23.4 Perché è la stessa forma già vista nove volte

`FIX-1` ha reso la promozione un gate vero. `FIX-4` ha reso `PROTECTED` non aggirabile da un
kwarg. Un refactoring del tutto ordinario — spezzare un modulo lungo in tre — ha spostato il
gate **fuori** dall'insieme protetto, senza toccare né `FIX-1` né `FIX-4` e senza che nulla lo
segnalasse. È la decima occorrenza in questo programma di un controllo che continua a sembrare
un controllo: qui il codice del controllo è intatto e **l'insieme su cui opera è invecchiato**.

### 23.5 Correzione proposta

**`FIX-16a` — aggiungere i tre moduli**: `core/nt_pipeline.py`, `core/nt_runner.py`,
`core/nt_helpers.py`. È la correzione minima ed è di tre righe.

**`FIX-16b` — impedire che si ripresenti.** Un test che fallisce quando un file contenente un
gate non è protetto vale più della lista corretta una volta:

```python
GATE_MARKERS = ("def promote_job_to_tools", "PRIVILEGED_KWARGS", "def _safe_mode")
def test_gate_modules_are_protected():
    for p in (ROOT / "core").glob("*.py"):
        if any(m in p.read_text() for m in GATE_MARKERS):
            assert f"core/{p.name}" in PROTECTED, f"{p.name} contiene un gate e non è PROTECTED"
```

Oggi fallisce su `core/nt_runner.py`. Dopo `FIX-16a` passa, e **fallisce di nuovo** il giorno in
cui un gate viene spostato in un file nuovo. È lo stesso principio del test di regressione
`ADM-11`: la lezione va messa dove la rilegge la macchina, non in un commento.

### 23.6 Che cosa NON affermo

- **Non è una vulnerabilità attiva.** Nessun percorso raggiungibile dalla CLI scrive dentro
  `core/`: `promote_job_to_tools` scrive in `tools/` e rifiuta i path protetti. Diventa
  raggiungibile in combinazione con `S-22` o con un import diretto (`S-02`).
- **Non sostengo che `PROTECTED` debba coprire tutto `core/`.** Il rilievo è sui file che
  contengono gate, non sul conteggio.
- **`core/reliability.py` è protetto**, e resta corretto: è lo stesso file di `S-22`, dove il
  difetto è cosa la funzione fa, non chi può riscriverla.

---

## 24. `S-24` — il contatore che dovrebbe fermare la spesa: spento per default, e quando è acceso perde. **HIGH**

**Ref:** `origin/main` @ `27b767309090`, 2026-08-19.
**Riproduzione:** `python3 docs/threat-models/probes/S-24-quota-meter-probe.py`
(materializza da sé un worktree al ref; `record_llm_call` scrive solo su file, **nessuna
chiamata di rete**).

`core/monetization.py` è il componente il cui mestiere è impedire che il programma spenda. È
arrivato dopo la mia ultima passata e non era mai stato revisionato. Ha **cinque** difetti, e i
primi due si sommano al difetto peggiore già noto.

### 24.1 Le due quote sono SPENTE per default

```python
def check_job_quota(...):
    if os.getenv("UJ_ENFORCE_QUOTA", "").strip() != "1":
        return                      # <-- esce subito
```

Misurato: **50 chiamate registrate contro un limite di 10, e `check_llm_quota()` non solleva
nulla.** Impostando `UJ_ENFORCE_QUOTA=1` solleva correttamente — quindi il codice del controllo
funziona, ed è il suo default a essere spento.

**Sommato a `S-17` il quadro è questo:** il percorso a pagamento è acceso per default
(`MODEL_PROVIDER="openai"`) e il limitatore è spento per default. Le due decisioni sono state
prese in momenti diversi, ognuna difendibile da sola, e insieme fanno un sistema che spende
senza tetto se nessuno configura niente. **È la stessa asimmetria di `S-17`, nel componente che
esiste per impedirla.**

### 24.2 Anche il tetto di budget è spento per default

```python
soft_cap = float(os.environ.get("UJ_LLM_BUDGET_USD", "0") or 0)
...
"ok": soft_cap <= 0 or spent < soft_cap,
```

Con il default `"0"`, `soft_cap <= 0` è vero e `ok` è **sempre** `True`. Misurato: **10.000
chiamate, spesa stimata 10 dollari, `assert_llm_budget()` non solleva.**

Un tetto il cui valore di default lo disattiva non è un tetto conservativo: è un tetto assente
con l'aspetto di uno presente. L'undicesima occorrenza della forma, e qui il soggetto sono i soldi
del proprietario.

### 24.3 Il contatore misura **una** chiamata dove il provider ne fattura **tre**

`ask_cloud_ai` registra il consumo *prima* di dispacciare:

```python
assert_llm_budget()
record_llm_call(meta={"provider": PROVIDER})     # <-- UNA unità
...
return _call_openai(prompt, system=sys_prompt)
```

e `_call_openai` porta `@retry(max_attempts=3, delay=1.0, backoff=1.5, exceptions=(Exception,))`.

**Su una chiamata che fallisce due volte e riesce alla terza, il provider fattura tre richieste
e il contatore ne registra una.** Il rapporto di sottostima è esattamente il numero di tentativi.
È lo stesso difetto di `FIX-10c` visto dal lato della misura invece che da quello della spesa: là
il retry moltiplica l'addebito, qui lo rende invisibile.

### 24.4 Il contatore non è atomico — misurato

`record_llm_call` fa `check_llm_quota()` → `summarize_usage()` legge **tutto** il file → confronta
→ e solo dopo `record_usage()` appende. Fra il controllo e l'incremento non c'è niente che escluda
gli altri.

Otto thread con barriera, limite `free` a 10, registro precaricato a 9 — ne dovrebbe passare
**esattamente uno**:

| Righe di riempimento | Lettura | Ammessi su 5 run | Oltre il limite |
|---:|---:|---|---|
| 0 | 0,1 ms | `[1, 3, 8, 6, 4]` | fino a **+7** |
| 5.000 | 9,6 ms | `[4, 5, 6, 4, 5]` | fino a **+5** |
| 20.000 | 30,5 ms | `[8, 8, 8, 6, 8]` | fino a **+7** |

La distanza dal limite è **fissa** in tutte e tre le righe: cambia solo la lunghezza del registro,
riempito con un evento che la quota non conta. **A tutte e tre le dimensioni passano più chiamate
del limite.**

**Onestà sulla misura:** l'esito varia da run a run e **non** cresce in modo monotono con la
lunghezza del registro — a 5.000 righe è a volte più mite che a 0. Non affermo un andamento che i
numeri non mostrano. Ciò che si ripete è il difetto, non la sua ampiezza.

**È `R-RUN-01`, di nuovo.** Il contatore di task attivi non atomico che ho chiuso in `UJ-RCV-001`
con `AtomicActiveTaskCounter` e il test `T-DG-4b`: stessa forma — `leggi → fai altro → scrivi` —
stessa conseguenza, e stavolta il limite che perde è quello sulla spesa. La regola l'avevo già
scritta: **fra il controllo del limite e l'incremento non deve esistere un'operazione che ceda il
controllo.**

### 24.5 Il registro dei consumi ha un path relativo

```python
DEFAULT_USAGE_PATH = Path("workspace/usage.jsonl")
```

Relativo, quindi risolto contro la **directory di lavoro corrente**. Misurato: 20 chiamate
registrate da una directory fanno scattare la quota; lo stesso identico comando lanciato da
un'altra directory **non la fa scattare**, perché il registro è vuoto lì.

`core/job_worker.py` fa invece `ROOT = Path(__file__).resolve().parent.parent`, cioè un path
assoluto ancorato al modulo. **`monetization` è l'unico modulo di stato che non lo fa**, ed è
quello che conta i soldi. Non serve malizia: basta lanciare `uj` da un'altra cartella.

### 24.6 Il costo è stimato a chiamate, non a token

```python
unit_cost = float(os.environ.get("UJ_LLM_UNIT_COST_USD", "0.001") or 0.001)
spent = calls * unit_cost
```

Una chiamata con un contesto lungo costa ordini di grandezza più di una corta, e il modello lo
ignora. Il numero che il tetto confronta non è la spesa: è il numero di chiamate moltiplicato per
una costante scritta a mano. Va detto perché il campo si chiama `spent_usd_est` e verrà letto come
una spesa.

### 24.7 Correzione proposta — `FIX-17`

Nell'ordine, e il primo è quello che chiude il rischio:

1. **invertire i due default**: quote e tetto attivi salvo disattivazione esplicita, come la
   decisione n. 7 ha fatto per il provider;
2. **registrare il consumo per tentativo**, dentro `_call_openai`, non una volta per invocazione;
3. **rendere atomico il check-then-act**: contatore giornaliero in un file dedicato aggiornato con
   `O_APPEND` + lock, oppure un update condizionale quando arriverà un DB. Non serve inventarlo:
   il contratto è già in `packages/contracts/src/recovery/active-task-counter.ts`;
4. **ancorare `DEFAULT_USAGE_PATH`** al modulo, come fa `job_worker`;
5. **rinominare `spent_usd_est`** in qualcosa che non prometta dollari finché non li misura.

### 24.8 Che cosa NON affermo

- **Non è una vulnerabilità**: nessun terzo può sfruttarla. È un difetto di contenimento del
  costo, e conta perché il costo zero è il vincolo che il proprietario ha posto come non
  negoziabile.
- **Oggi non spende comunque**, perché `import openai` fallisce in questo ambiente. È il
  contenimento per assenza già registrato in `S-17`, non una difesa.
- **Non ho eseguito nessuna chiamata reale** e non ho installato `openai`.
- **Non ho toccato una riga** di `core/monetization.py` né di `cloud_bridge.py`.

---

## 25. `S-25` — il webhook di pagamento non verifica la firma: la **ispeziona**. **HIGH, latente**

**Ref:** `origin/main` @ `27b767309090`, 2026-08-19.
**Riproduzione:** `python3 docs/threat-models/probes/S-25-billing-webhook-probe.py`
(worktree materializzato al ref, **nessuna chiamata a Stripe**: `handle_webhook` non ne fa, e la
sonda non invoca le due funzioni che ne farebbero).

### 25.1 Il difetto, in cinque righe di codice

`core/billing.py:102-105`:

```python
secret = (os.getenv("STRIPE_WEBHOOK_SECRET") or "").strip()
if secret and sig_header:
    if "t=" not in sig_header and "v1=" not in sig_header:
        return {"ok": False, "error": "invalid signature header"}
```

Tre difetti distinti, sovrapposti:

1. **il segreto non entra in nessun calcolo.** È letto alla riga 102 e usato solo nel test di
   verità alla 103. Misurato: `hmac` compare **0 volte** nel file, `compare_digest` **0 volte**;
   `secret` compare a **due sole righe**, 102 e 103;
2. **la condizione è `and`, non `or`:** per essere respinto un header deve mancare di
   **entrambi** i marcatori. `t=1` da solo passa;
3. **se `sig_header` è vuoto il controllo è saltato per intero.** Non serve indovinare una firma:
   basta non mandarne una.

### 25.2 Misurato: quattro contraffazioni su cinque accettate

Con un segreto configurato, e un payload che chiede il tier più alto:

| Header di firma | Esito | Tier concesso |
|---|---|---|
| *(nessuno)* | **ACCETTATO** | `team` |
| `t=1` | **ACCETTATO** | `team` |
| `v1=deadbeef` | **ACCETTATO** | `team` |
| `t=1755600000,v1=000…0` | **ACCETTATO** | `team` |
| `ciao` | rifiutato | — |

**L'unico caso respinto è quello malformato.** Il controllo rifiuta gli header che non
*somigliano* a una firma e accetta tutti quelli che le somigliano, indipendentemente dal loro
valore. È un controllo di **sintassi** travestito da controllo di **autenticità** — la dodicesima
occorrenza della forma in questo programma, e la prima su un percorso di pagamento.

### 25.3 Che cosa otterrebbe la contraffazione

```python
result["suggested_env"] = {"UJ_TIER": tier}
```

`UJ_TIER` è la variabile che `core/monetization.current_tier()` legge per decidere i limiti
giornalieri: `free` 10 chiamate LLM, `team` 20.000. **Un webhook falso è una richiesta di
promozione di tier**, cioè di quota.

**Oggi non produce nulla, e lo dico chiaramente:** `suggested_env` non è consumato da nessuno
(verificato con `git grep`: una sola occorrenza, la sua produzione), e `handle_webhook` non ha
chiamanti fuori dai propri test. Il difetto è **latente**. Ma il campo esiste perché qualcuno lo
applichi, e nel momento in cui un endpoint HTTP viene cablato il difetto diventa **remoto e non
autenticato** — che è la peggiore combinazione possibile, e non richiede nessun'altra modifica al
file.

### 25.4 La correzione ha una trappola, e va detta prima

La correzione ovvia è calcolare l'HMAC. Ma **la firma di Stripe è calcolata sui byte grezzi del
corpo**, non sul dizionario già interpretato:

```
firma_attesa = HMAC-SHA256(secret, f"{t}.{corpo_grezzo}")
```

`handle_webhook(payload: dict, ...)` riceve un dizionario **già interpretato**. Riserializzarlo
non restituisce gli stessi byte — cambiano spaziatura e ordine delle chiavi — quindi qualunque
HMAC calcolato da lì **non coinciderà mai**, e chi corregge concluderà che la firma è sbagliata
invece che il proprio input.

**La correzione richiede quindi un cambio di interfaccia**: la funzione deve ricevere il corpo
grezzo (`bytes`) e interpretarlo **dopo** la verifica. È la stessa forma di `FIX-15` prima di
`FIX-16`: la versione facile applicata per prima produce qualcosa che sembra corretto e non lo è.

Serve inoltre una **tolleranza sul timestamp** (Stripe usa 5 minuti) e `hmac.compare_digest` per
il confronto, altrimenti si sostituisce un difetto di autenticazione con uno di replay.

### 25.5 Altri tre rilievi sullo stesso file, minori

- **`create_customer` verso Stripe non ha idempotency key.** È un `EXTERNAL_WRITE` non idempotente
  verso un provider di pagamento: viola `ADM-13` del mio `UJ-MCP-001`, e un retry crea un cliente
  duplicato. Stripe supporta l'header `Idempotency-Key`, e non è usato.
- **La sola presenza di una chiave abilita la chiamata reale** (`key.startswith("sk_")`). Non c'è
  nessun interruttore d'ambiente dedicato: è la stessa asimmetria di `S-17`, dove la
  configurazione pericolosa richiede una condizione sola.
- **`DEFAULT_CUSTOMERS` e `DEFAULT_EVENTS` sono path relativi**, quindi seguono la directory di
  lavoro. Misurato: il registro finisce sotto la cwd corrente. Stesso difetto di `S-24.5`, e vale
  la stessa correzione.

### 25.6 Che cosa NON affermo

- **Non è sfruttabile oggi.** Nessun endpoint HTTP espone `handle_webhook`, e `suggested_env` non
  è applicato da niente. È un difetto latente in uno skeleton, e va corretto **adesso proprio
  perché è latente**: quando ci sarà un endpoint, correggerlo costerà un cambio di interfaccia
  con chiamanti veri da aggiornare.
- **Non ho eseguito nessuna chiamata a Stripe** e non ho impostato nessuna chiave.
  `create_customer` e `create_checkout_session` non sono state invocate.
- **Non ho toccato una riga** di `core/billing.py`.

---

## 26. `S-26` — il gate di safety è sulla **copia**, non sull'**esecuzione**. **HIGH**

**Ref:** `origin/main` @ `27b767309090`, 2026-08-19.
**Riproduzione:** `python3 docs/threat-models/probes/S-26-graph-exec-probe.py`
(worktree materializzato al ref, tutto dentro directory temporanee, **nessuna rete, nessun
comando di sistema**; il carico delle prove scrive un file marcatore in `/tmp`).

### 26.1 Dove sta il gate, e dove non sta

`FIX-1` ha reso `promote_job_to_tools` un gate vero, e funziona: `nt_runner.py:250-252` legge
`tool.py`, chiama `advisors.safety.scan_text` e **rifiuta** se ci sono hit. È corretto e l'ho
verificato.

Ma `promote_job_to_tools` **copia** un file dentro `tools/`. La funzione che quel codice lo
**esegue** è `core/graph_exec.execute_graph`, e lì il gate **non c'è**:

| Punto | Operazione | `scan_text`? |
|---|---|---|
| `nt_helpers.py:48-53` | genera (solo il corpo del **writer LLM**, e solo con `UJ_WRITER_LLM=1`) | **sì** |
| `nt_runner.py:250` | **copia** in `tools/` (`promote_job_to_tools`) | **sì** |
| `graph_exec.py:64` | **esegue** (`execute_graph` → `spec.loader.exec_module`) | **no** |

Zero occorrenze di `scan_text` o `safety` in tutto `core/graph_exec.py`.

### 26.2 Misurato

```
=== A) modulo con pattern sospetti: viene eseguito? ===
   esito execute_graph : {'ok': True, 'order': ['tool.py'], 'result': 'run() chiamata'}
   marcatore scritto   : True -> il modulo e stato eseguito

=== B) advisors.safety.scan_text riconosce quel codice? ===
   hit dello scanner   : ['rm -rf', 'eval(']
   -> il gate ESISTE, e' solo ASSENTE da execute_graph
```

Un modulo il cui testo contiene **due dei pattern che il vostro stesso scanner riconosce** viene
caricato ed eseguito, e il codice a livello di modulo gira prima ancora che `run()` venga
chiamata (`exec_module`). Lo scanner, interrogato sullo stesso testo, lo rileva.

### 26.3 Ed è esposto direttamente dalla CLI

`uj_cli.py:43-47` e `:57`:

```python
g = sub.add_parser("graph"); g.add_argument("job_dir"); g.set_defaults(func=cmd_graph)
...
out = execute_graph(args.job_dir)
```

**Un sottocomando che prende una directory arbitraria ed esegue ogni `.py` elencato nel suo
`deps.json`.** Nessun contenimento nella root, nessuna ammissione, nessuno scan.

Ed è anche sul percorso **automatico**: `nt_runner.py:61-64` chiama `execute_graph(job_dir)` a
ogni job che produce un `deps.json`, cioè ogni job multi-file.

### 26.4 Path traversal dai nomi in `deps.json`

```python
py_mods = [m for m in modules if m.endswith(".py") and m != "test_tool.py"]
...
path = job_dir / name          # `name` viene dal file deps.json, non validato
```

Il filtro controlla solo il suffisso. `../fuori.py` finisce per `.py` e passa. Misurato:

```
=== C) i nomi dei moduli in deps.json sono validati? ===
   esito               : {'ok': True, 'loaded': ['../fuori.py']}
   marcatore fuori dir : True -> modulo FUORI dalla job dir eseguito
```

**Un file dati dentro la job dir decide quali file eseguire, e può nominarne fuori.** È lo stesso
schema di `S-22`: un dato che il sistema tratta come innocuo governa un'operazione che non lo è.

### 26.5 `sys.path` e `sys.modules`

```python
sys.path.insert(0, str(extra_path))     # la job dir va in TESTA
sys.modules[path.stem] = mod            # registrato con il nome del file
```

Misurato: dopo due esecuzioni `sys.path[:2]` sono le due job dir, e `sys.modules["tool"]` esiste.

Due conseguenze nello stesso processo: un modulo generato che si chiami come uno atteso
(`registry.py`, `memory.py`, `config.py`) **prende il posto** di quello vero per ogni `import`
successivo; e le job dir restano in testa a `sys.path` **anche dopo** che l'esecuzione è finita,
perché nessuno le rimuove.

### 26.6 Correzione proposta — `FIX-19`

1. **Applicare `scan_text` prima di `exec_module`**, sullo stesso testo che si sta per eseguire.
   È una chiamata, ed è già importata altrove nello stesso package;
2. **validare i nomi dei moduli**: rifiutare tutto ciò che contiene un separatore di path o `..`,
   e verificare `path.resolve().is_relative_to(job_dir.resolve())`;
3. **contenere `job_dir`** entro la radice dei job, come `FIX-15b` per `output_dir`;
4. **ripulire `sys.path` e `sys.modules`** in un `finally`, o caricare con un nome qualificato
   (`f"ujjob_{job_id}_{stem}"`) invece dello stem nudo;
5. **chiedere una conferma esplicita** per il sottocomando `graph` su una directory fuori dalla
   radice dei job — è l'unico punto in cui un umano sceglie di eseguire codice arbitrario.

**Ordine:** il punto 1 prima di tutti. È quello che chiude il caso peggiore con una riga.

### 26.7 Che cosa NON affermo

- **Non è un difetto dello scanner**: `scan_text` fa il suo lavoro, e l'ho verificato interrogandolo
  sullo stesso testo. È assente dal percorso, non difettoso. (Resta vero il rilievo di `S-08`: lo
  scanner ha evasioni note — 2 su 4 nel mio test di sessione 3 — quindi il punto 1 è necessario,
  non sufficiente.)
- **Il percorso di generazione un gate ce l'ha**: il corpo del writer LLM è scansionato prima di
  essere restituito. Il buco è fra la generazione e l'esecuzione, e su tutto ciò che entra nella
  job dir per altre vie.
- **Non ho eseguito nulla di dannoso**: il carico delle prove scrive un file di testo in una
  directory temporanea, e la sonda rimuove worktree e temp con `atexit`.
- **Non ho toccato una riga** di `core/graph_exec.py` né di `uj_cli.py`.

---

## 27. `S-16` — terza verifica: **il consumatore è arrivato**, e non è il percorso del codice

**Ref:** `origin/main` @ `27b767309090`, 2026-08-19.

In sessione 3 avevo scritto che il percorso *contenuto non fidato → memoria → decisione* **non
era cablato**, e che `S-16` andava corretto **nello schema, prima** che quel cablaggio esistesse.
In sessione 5 avevo aggiornato: *"metà della catena si è chiusa"*.

**Riverificato oggi: il consumatore esiste.** E la parte utile è che non è quello che temevo.

### 27.1 Che cosa è cablato adesso

```python
# core/nt_runner.py:135-138 — SCRITTURA
remember(f"job:{job_id} title={task_plan.title!r} status={final_status}",
         tags=["job", final_status.lower(), "natural_tasks"])

# core/planner.py:152-167 — LETTURA
related = recall_semantic(text, limit=5, tag="job", min_score=0.05)
...
milestones.append("Review related past jobs: " + "; ".join(unique[:3]))
```

Il planner **rilegge la memoria** e inserisce i fatti **verbatim** dentro le milestone del piano.
Misurato, con un fatto seminato in memoria:

```
milestone prodotta: Review related past jobs: job:job_x title='fattoriale helper — RIGA
                    INIETTATA NEL PIANO' status=PASS
il fatto compare in plan.md: True
```

### 27.2 E dove NON arriva — che è la parte che cambia la gravità

Il messaggio che il writer LLM manda al modello è, alla lettera:

```python
user = f"Task title: {title}\nTask prompt:\n{prompt.strip()[:1500]}\n\nWrite the Python module body now."
```

**Solo `title` e `prompt`.** Zero occorrenze di `milestone` o `to_markdown` in tutta la funzione.
E il `title`, che al modello ci arriva, **non è influenzato dalla memoria**: misurato, resta il
testo del prompt utente.

Quindi la catena chiusa è **memoria → `plan.md`**, cioè un documento che legge un umano. La
catena **memoria → codice generato** resta aperta, e va detto così invece di lasciare intendere
il peggio.

### 27.3 Una proprietà mitigante, misurata per sbaglio

Il primo tentativo di questa misura **è fallito**: il fatto seminato non entrava nel piano. Non
era un difetto della catena — era che `recall_semantic(text, ..., min_score=0.05)` e il fallback
sui token del prompt **filtrano per rilevanza**. Un fatto che non condivide token con il prompt
non viene richiamato.

È un falso negativo del mio test (trappola 12, dal lato di chi lo scrive), e me ne sono accorto
perché il risultato contraddiceva il codice che avevo appena letto. Ma contiene un'informazione
vera e utile: **un fatto non finisce in un piano qualsiasi, solo in uno il cui prompt gli
somiglia.** È una mitigazione reale, e riduce la superficie da "ogni piano futuro" a "i piani su
quell'argomento".

### 27.4 Che cosa resta aperto, e per chi

`bin/uj:97` accetta **tag arbitrari**: `uj memory add --tag job "<qualunque testo>"` semina un
fatto che verrà richiamato verbatim nei piani corrispondenti. Oggi è il proprietario a scrivere,
quindi non è un canale ostile.

Ma il difetto originale di `S-16` resta esattamente quello che era: **i record di memoria non
hanno un campo di provenienza**, quindi un fatto detto da Christian e uno arrivato da altrove
sarebbero indistinguibili — e adesso c'è un consumatore che li inserisce verbatim in un
documento.

**Il fatto che il consumatore sia arrivato prima dello scrittore non fidato è una buona notizia:**
significa che lo schema si può ancora correggere a costo quasi nullo. È esattamente la finestra
che `S-16` diceva di non sprecare.

**Owner della correzione: GEMINI (`UJ-MEM-001`)**, non Grok — lo schema della memoria è suo.
`tools/websearch.py` è ancora uno **stub** e non ha nessun percorso verso `remember()`:
verificato, l'unico scrittore non interattivo è `nt_runner`.

### 27.5 Che cosa NON affermo

- **Non è una vulnerabilità attiva.** Nessun contenuto esterno entra in memoria oggi.
- **La memoria non raggiunge il codice generato**, e l'ho verificato leggendo la riga esatta del
  messaggio inviato al modello, non deducendolo dall'architettura.
- **Non ho toccato `core/memory.py` né `core/planner.py`.**

---

## 28. `S-27` — l'iniezione prompt → codice generato è contenuta solo **per caso**. **MEDIUM**

**Ref:** `origin/main` @ `27b767309090`, 2026-08-19.
**Riproduzione:** `python3 docs/threat-models/probes/S-27-template-injection-probe.py`
(worktree al ref, payload benigni che scrivono un file marcatore in `/tmp`; nessuna rete, nessun
comando di sistema).

### 28.1 Il percorso

Il ramo a template — `code_for_prompt`, cioè quando `UJ_WRITER_LLM` **non** è attivo — incastona
il **prompt** e il **title** nell'header del modulo generato (`nt_runner.py:187-197`):

```python
content = (
    f'"""Auto-generated module for: {task_plan.title}\n\n'
    f"Original prompt:\n{prompt}\n\n"
    'Produced by NaturalTaskRunner (controlled write).\n"""\n\n'
    "from __future__ import annotations\n\n\n"
    f"{body}\n\n" ...
)
```

Il prompt viene interpolato **grezzo** dentro una docstring. Un prompt che contenga `"""` può
chiudere la docstring e provare a far interpretare il resto come codice — e quel modulo viene poi
**eseguito** da `execute_graph` (§26) o promosso in `tools/`.

### 28.2 Misurato: tre tentativi, tre volte contenuto — ma da tre accidenti diversi

| Payload | Compila? | Che cosa l'ha fermato |
|---|---|---|
| `"""` sbilanciato nel prompt | **no** | stringa tripla non terminata (come `S-13`) |
| `"""` bilanciato + codice | **no** | *"`from __future__` imports must occur at the beginning of the file"* |
| iniezione via `title` nel corpo | **no** | stringa non terminata nel `return` |

**Nessuno dei tre esegue.** Ma nessuno dei tre è fermato da un controllo: sono tre proprietà
sintattiche accidentali. La seconda è la più robusta — `from __future__ import annotations` deve
stare in cima, quindi qualunque codice iniettato **prima** rompe la compilazione — e non è lì per
sicurezza: è lì per le type hint. Spostarla, o rimuoverla in un refactor, aprirebbe il vettore.

### 28.3 Perché è un finding e non un "va bene così"

È **la quarta volta** in questo programma che il contenimento è un accidente di sintassi, dopo
`S-13` (la virgoletta che mascherava `S-12`), i moduli mancanti e il pacchetto `openai` assente.
Tre di quei quattro accidenti hanno già smesso di proteggere almeno una volta.

E si combina con `S-26`: `execute_graph` esegue il modulo generato **senza `scan_text`**. Oggi
l'unica cosa che impedisce a un prompt ostile di far eseguire codice arbitrario **è che il file
generato non compili per caso**. Le due difese vere — validare/scansionare prima di eseguire
(`FIX-19a`) e non interpolare input grezzo in sorgente — non ci sono.

### 28.4 Correzione proposta — `FIX-20`

1. **Non interpolare il prompt in sorgente eseguibile.** L'header non ha bisogno del prompt
   *dentro* una docstring: scriverlo in un file `prompt.txt` accanto, oppure passarlo attraverso
   `repr()` così che qualunque `"""` diventi testo inerte e non possa chiudere la docstring;
2. **`FIX-19a` come rete a valle:** anche con l'header ripulito, `scan_text` prima di
   `exec_module` resta necessario, perché il ramo `UJ_WRITER_LLM` produce codice che il template
   non controlla affatto.

**Ordine:** è a valle di `FIX-19`, non urgente da solo — ma va corretto perché il contenimento
attuale è invisibile a chi legge e sparisce al primo refactor dell'header.

### 28.5 Che cosa NON affermo

- **Non è sfruttabile oggi**: i tre payload che ho costruito non compilano, l'ho verificato
  eseguendo `compile()`. Non escludo che una quarta forma più astuta bilanci tutti gli accidenti;
  il punto è proprio che la tenuta dipende da accidenti, non da un controllo.
- **Il ramo `UJ_WRITER_LLM` è un problema diverso e peggiore**: lì il codice non è un template, è
  quello che il modello restituisce. È scansionato alla generazione (`nt_helpers.py:49-51`) ma non
  all'esecuzione — di nuovo `S-26`.
- **Non ho toccato `core/code_templates.py` né `core/nt_runner.py`.**

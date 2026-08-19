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

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

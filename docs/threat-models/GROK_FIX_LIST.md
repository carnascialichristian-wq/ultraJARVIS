# Lista correzioni per GROK — implementazione su `main`

| Metadato | Valore |
|---|---|
| Da | CLAUDE — Runtime, Security & Skill Architect |
| A | **GROK** (owner del codice), per il tramite di Christian |
| Origine | `docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` (proposta `UJ-SEC-003`) |
| Ref verificato | `main` @ `99e95e1` e successivi |

> **Nessuna riga del tuo codice è stata modificata da me.** Qui ci sono le correzioni
> pronte, con il file, la riga, il prima/dopo e il comando per verificare che la
> correzione funzioni. Sono tue: applicale come preferisci.
>
> **L'ordine conta**, e il motivo è spiegato al punto 0. Non è una preferenza di stile.

---

## 0. LEGGI PRIMA QUESTO — l'ordine non è arbitrario

**`FIX-1` va applicato PRIMA di `FIX-2`.**

`FIX-2` è la correzione di **una virgoletta**. È il tipo di cosa che chiunque sistema in
tre secondi senza pensarci. Ma quella virgoletta sbagliata è **l'unica cosa che oggi
impedisce l'esecuzione di codice generato non validato**: i tool promossi non compilano, e
per questo il codice non controllato non viene mai caricato.

> Se correggi solo la virgoletta, **apri** l'esecuzione di codice generato senza gate.

Quindi: prima il gate di safety sulla promozione (`FIX-1`), poi il typo (`FIX-2`).

---

## FIX-1 — `promote_job_to_tools` non valida il codice che promuove · **HIGH**

**File:** `core/natural_tasks.py`, riga ~202

**Cos'è.** La funzione prende il `tool.py` di un job generato e lo scrive in `tools/`, cioè
nella directory da cui il registry **importa ed esegue**. L'unica validazione è:

```python
if "def " not in text:
    raise ValueError("tool.py does not appear to define any function")
```

Non viene chiamato `scan_job_dir`, non si guarda l'esito dei gate, non si richiede che i
test passino.

**Prova.** Ho promosso un `tool.py` contenente:

```python
import os
def helper(cmd):
    return os.system(cmd)   # eval(  rm -rf
```

Tre dei sette pattern che il **tuo** `advisors/safety.py` conosce. La promozione è riuscita
senza sollevare nulla.

**Correzione proposta:**

```python
    text = src.read_text(encoding="utf-8")
    if "def " not in text:
        raise ValueError("tool.py does not appear to define any function")

    # --- AGGIUNGERE: nessuna promozione senza safety scan ---
    from advisors.safety import scan_text
    hits = scan_text(text)
    if hits and not force:
        raise PermissionError(
            f"Refusing to promote: dangerous patterns {hits}. "
            f"Use force=True only with an explicit human decision."
        )
```

**Verifica:**

```bash
python3 - <<'EOF'
import sys, pathlib, tempfile; sys.path.insert(0,'.')
from core.natural_tasks import promote_job_to_tools
root = pathlib.Path(tempfile.mkdtemp()); (root/"tools").mkdir()
job = root/"j"; job.mkdir()
(job/"tool.py").write_text("import os\ndef h(c):\n    return os.system(c)\n")
try:
    promote_job_to_tools(job, "evil", root=root)
    print("ANCORA APERTO: promozione riuscita")
except PermissionError as e:
    print("OK, bloccato:", e)
EOF
```

**Nota onesta:** `scan_text` è aggirabile (vedi `FIX-6`), quindi questo non è un controllo
forte — è il minimo che rende il percorso non *completamente* scoperto. Il controllo vero è
un gate di ammissione (`FIX-5`).

---

## FIX-2 — ogni tool promosso non compila · **MEDIUM** *(applicare DOPO FIX-1)*

**File:** `core/natural_tasks.py`, righe ~216-219

**Cos'è.** L'header prodotto contiene **quattro** virgolette:

```
riga 1: """Promoted from job job1 by promote_job_to_tools.
riga 2: """"
```

→ `SyntaxError: unterminated string literal (detected at line 2)`

**Prima:**

```python
    header = (
        f'"""Promoted from job {job_dir.name} by promote_job_to_tools.\n"'
        f'"""\n\n'
    )
```

**Dopo** (rimuovere la virgoletta in eccesso alla fine della prima stringa):

```python
    header = (
        f'"""Promoted from job {job_dir.name} by promote_job_to_tools.\n'
        f'"""\n\n'
    )
```

**Verifica:**

```bash
python3 -c "
import sys,pathlib,tempfile; sys.path.insert(0,'.')
from core.natural_tasks import promote_job_to_tools
r=pathlib.Path(tempfile.mkdtemp()); (r/'tools').mkdir()
j=r/'j'; j.mkdir(); (j/'tool.py').write_text('def add(a,b):\n    return a+b\n')
d=promote_job_to_tools(j,'mathx',root=r)
compile(d.read_text(), str(d), 'exec'); print('compila OK')"
```

---

## FIX-3 — `files.safe_read` legge qualunque file del sistema · **HIGH**

**File:** `tools/files.py`, funzione `safe_read`

**Cos'è.** Il registry descrive il tool come *"Read a text file under the project root"*,
ma il contenimento nella root **non c'è**. Path assoluti fuori root e `../../../` leggono
entrambi.

**La correzione esiste già nel tuo stesso file**, dentro `safe_write`. Va copiata.

**Dopo `target = _resolve(path, root)` in `safe_read`, aggiungere:**

```python
    try:
        target.relative_to(root)
    except ValueError:
        raise PermissionError(f"Path escapes project root: {target}") from None
```

**Verifica:**

```bash
python3 -c "
import sys; sys.path.insert(0,'.')
from tools.files import safe_read
for p in ['/etc/hostname', '../../../etc/hostname']:
    try: safe_read(p); print('ANCORA APERTO:', p)
    except PermissionError: print('OK, bloccato:', p)
    except FileNotFoundError: print('n/a:', p)"
```

**Perché è il più urgente:** il filtro sulle estensioni binarie non protegge — i segreti
stanno in file di testo (`.env`, chiavi SSH, token, cronologie).

---

## FIX-4 — `force=True` aggira `PROTECTED` e il registry lo inoltra · **HIGH**

**File:** `core/registry.py` (preferibile) oppure `tools/files.py`

**Cos'è.** `safe_write` applica `PROTECTED` *salvo `force`*, e `Registry.call()` inoltra
`**kwargs` senza filtrarli. Quindi:

```python
registry.call("files.safe_write", "core/registry.py", "<arbitrario>", force=True)
```

sovrascrive il file che definisce quali tool esistono. Nessun gate attraversato.

**Correzione preferita** — il registry non deve inoltrare kwargs privilegiate:

```python
PRIVILEGED_KWARGS = {"force", "root"}

def call(self, name: str, *args: Any, **kwargs: Any) -> Any:
    spec = self.get(name)
    if spec is None:
        raise KeyError(f"Unknown tool: {name}")
    blocked = PRIVILEGED_KWARGS & set(kwargs)
    if blocked:
        raise PermissionError(
            f"Refusing to forward privileged kwargs {sorted(blocked)} to {name}"
        )
    ...
```

**Verifica:**

```bash
python3 -c "
import sys; sys.path.insert(0,'.')
from core.registry import get_registry
try:
    get_registry().call('files.safe_write','core/registry.py','x',force=True)
    print('ANCORA APERTO')
except PermissionError as e: print('OK, bloccato:', e)"
```

> `PROTECTED` oggi non è un permesso: è un valore di default che il chiamante può cambiare.

---

## FIX-5 — `browser.open_url`: la allowlist si aggira con un dominio comprabile · **HIGH**

**File:** `tools/browser.py`, funzione `is_allowed`

**Cos'è.** `str.lstrip("www.")` **non rimuove il prefisso** `"www."`: rimuove qualunque
carattere iniziale nell'insieme `{'w', '.'}`. Quindi `wexample.com` → `example.com`.

**Prima:**

```python
host = (urlparse(url).hostname or "").lower().lstrip("www.")
```

**Dopo:**

```python
host = (urlparse(url).hostname or "").lower()
if host.startswith("www."):
    host = host[4:]
```

**Verifica:**

```bash
python3 -c "
import sys; sys.path.insert(0,'.')
from tools.browser import is_allowed
for u in ['https://wexample.com','https://wwwexample.com']:
    print(('ANCORA APERTO' if is_allowed(u) else 'OK, bloccato'), u)
print(('OK' if is_allowed('https://www.github.com') else 'REGRESSIONE'), 'www.github.com')"
```

**È l'unico difetto sfruttabile da un terzo senza accesso al repository:** `wexample.com` e
`wwwexample.com` sono domini registrabili. Aggiungi un test di regressione — è il caso che
l'occhio non vede.

---

## FIX-6 — una build fallita riporta `PASS` · **HIGH**

**File:** `core/natural_tasks.py`, riga ~123

**Cos'è.** `core/gates.py` funziona: esegue `ruff`, `black`, `pytest` e legge gli exit code
correttamente. Il difetto è in come il verdetto viene ricavato dal **testo**:

```python
status = "PASS" if "PASS" in str(gates_text).upper() or "ok" in str(gates_text).lower() else "FAIL"
```

Misurato, tre falsi `PASS` su cinque casi realistici:

| Situazione | Verdetto |
|---|---|
| `ruff PASS` + `pytest FAIL` | **PASS** — basta che uno passi |
| tutto `FAIL`, job in `.../booking_tool` | **PASS** — `bo`**`ok`**`ing` |
| tutto `FAIL`, pytest stampa `broken pipeline` | **PASS** — `br`**`ok`**`en` |

**Correzione.** `run_gates` calcola già `any_fail`: fallo restituire un esito strutturato e
leggi il booleano.

```python
# in core/gates.py, alla fine di run_gates:
return {"ok": not any_fail, "any_real": any_real, "text": "\n".join(lines)}

# in core/natural_tasks.py:
gates = run_gates(job_dir, files=written, use_real=self.use_real_gates)
guarded_write(job_dir / "gates.txt", gates["text"])
status = "PASS" if gates["ok"] else "FAIL"
```

**Il testo serve all'umano, il booleano alla macchina.** Non vanno confusi.

**Collegato — `FIX-6b` (MEDIUM):** `run_gates(use_real=False)` non salta i controlli,
**stampa che sono passati** (`PASS (forced stub)`). Va reso distinguibile a colpo d'occhio,
o meglio va restituito `{"ok": None}` così che il chiamante non possa scambiarlo per un
esito reale.

---

## FIX-7 — `ToolSpec.safe` è dichiarato e mai letto · **HIGH**

**File:** `core/registry.py`

**Cos'è.** `safe: bool = True` compare accanto a ogni tool e **non è letto da nessuna riga
del repository**. Tutti e 125 i tool valgono `safe=True`, `email.send` incluso.

**Due strade, entrambe accettabili — ma non la terza (lasciarlo com'è):**

1. **rimuoverlo**, se non deve fare nulla: un campo che sembra un controllo e non lo è
   fa smettere di cercare il controllo vero;
2. **applicarlo** in `call()`:

```python
if not spec.safe and not allow_unsafe:
    raise PermissionError(f"Tool {name} is not marked safe")
```

e marcare `safe=False` almeno su `email.send`, `os.open_app`, `os.set_volume`,
`automation.paste_text`, `automation.type_text`, `browser.open_url`, `files.safe_write`.

---

## FIX-8 — `email.send`: due manopole finte · **HIGH**

**File:** `tools/email.py`

1. **`force` è morto.** Compare solo nella firma (riga 21), il corpo non lo referenzia mai.
   O si implementa o si toglie.
2. **`SAFE_MODE` è una globale riscrivibile.** `tools.email.SAFE_MODE = False` disattiva la
   protezione con una riga, dimostrato.

**Correzione minima:** leggere la modalità da una funzione con default sicuro invece che da
una globale mutabile, e far sì che l'uscita da SAFE_MODE richieda una decisione esplicita
registrata, non un assegnamento.

**Nota:** oggi non invia davvero perché **non c'è un trasporto SMTP**. Quello è il
contenimento reale, e non è una policy: il giorno in cui colleghi un SMTP, l'invio diventa
raggiungibile senza che una riga di controllo cambi. Aggiungi anche una idempotency key
prima di allora — è `ADM-13` del tool plane.

---

## FIX-9 — `advisors/safety.py` non rileva quasi nulla · **MEDIUM**

**File:** `advisors/safety.py`

7 pattern confrontati come sottostringhe su testo minuscolo. Misurato: `getattr(__builtins__,
'ev'+'al')`, `subprocess.Popen` e `importlib.import_module("os").system()` **evadono tutti
e tre**.

**Non chiedo di renderlo infallibile** — un matcher testuale non contiene un avversario, e
l'ho già dimostrato sul mio stesso loop detector. Chiedo due cose:

1. aggiungere almeno `subprocess.`, `importlib`, `getattr(` ai pattern;
2. **classificarlo come early warning, non come controllo di sicurezza**, e non
   attribuirgli mitigazioni nel risk register.

Il contenimento vero non può venire da qui: viene dall'ammissione (`FIX-4`, `FIX-7`).

---

## Riepilogo operativo

| # | File | Severità | Dimensione |
|---|---|---|---|
| **FIX-1** | `core/natural_tasks.py` | HIGH | ~7 righe · **fare per primo** |
| **FIX-2** | `core/natural_tasks.py` | MEDIUM | 1 carattere · **solo dopo FIX-1** |
| **FIX-3** | `tools/files.py` | HIGH | 4 righe, copiate da `safe_write` |
| **FIX-4** | `core/registry.py` | HIGH | ~6 righe |
| **FIX-5** | `tools/browser.py` | HIGH | 3 righe + test |
| **FIX-6** | `core/gates.py` + `natural_tasks.py` | HIGH | ~5 righe |
| **FIX-7** | `core/registry.py` | HIGH | decisione + 2 righe |
| **FIX-8** | `tools/email.py` | HIGH | decisione di design |
| **FIX-9** | `advisors/safety.py` | MEDIUM | 3 righe + riclassificazione |

**Il filo comune, che vale più dei singoli fix:** sette findings su tredici sono manopole di
sicurezza che non girano nulla. Ognuna, letta da sola, *sembra* una difesa.

> Un controllo va verificato **eseguendolo contro il caso che deve fermare**, non
> leggendone il nome.

Ogni fix qui sopra ha il suo comando di verifica proprio per questo.

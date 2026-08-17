# Security review dell'implementazione ora su `main`

| Metadato | Valore |
|---|---|
| Autore | CLAUDE — Runtime, Security & Skill Architect |
| Ref revisionato | `main` @ `99e95e1` — findings riverificati a questo ref |
| Oggetto | `core/`, `tools/`, `advisors/`, `bin/uj` — implementazione Python su `main` |
| Stato | **PROPOSTO come `UJ-SEC-003`**, non baselined. **Nessun peso auto-assegnato.** |
| Data | 2026-08-17 |

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
| S-12 | **HIGH** | `promote_job_to_tools` scrive codice generato in `tools/` **senza gate di safety** | **aperto** |
| S-13 | MEDIUM | ogni tool promosso non compila (header con una virgoletta di troppo) — e **maschera S-12 per caso** | **aperto** |
| S-10 | **HIGH** | `files.safe_read` legge **qualunque file del sistema**: nessun contenimento nella root | **aperto** |
| S-11 | **HIGH** | `force=True` aggira `PROTECTED` e `Registry.call()` lo inoltra → sovrascrittura di `core/registry.py` | **aperto** |
| S-09 | **HIGH** | `lstrip("www.")`: `wexample.com` passa la allowlist del browser | **aperto, sfruttabile** |
| S-01 | HIGH | `ToolSpec.safe` dichiarato e mai letto; 125/125 `safe=True` | aperto |
| S-02 | HIGH | `Registry.call()` senza ammissione, tetto o evento | aperto |
| S-03 | HIGH | `email.send`: `force` morto, `SAFE_MODE` riscrivibile, nessuna idempotenza | aperto |
| S-06 | MEDIUM | automazione consumer UI registrata e chiamabile, vietata dai vincoli | aperto |
| S-07 | MEDIUM | nessun evento `tool.*`: `P0-1` inapplicabile, `TH-10` aperta | aperto |
| S-08 | MEDIUM | safety scanner: 3 evasioni su 3 tentate | aperto |

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

Sei findings su undici sono **manopole di sicurezza che non girano nulla**: `ToolSpec.safe`
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

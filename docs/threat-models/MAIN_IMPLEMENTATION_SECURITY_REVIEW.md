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
| S-09 | **HIGH** | `lstrip("www.")`: `wexample.com` passa la allowlist del browser | **aperto, sfruttabile** |
| S-01 | HIGH | `ToolSpec.safe` dichiarato e mai letto; 44/44 `safe=True` | aperto |
| S-02 | HIGH | `Registry.call()` senza ammissione, tetto o evento | aperto |
| S-03 | HIGH | `email.send`: `force` morto, `SAFE_MODE` riscrivibile, nessuna idempotenza | aperto |
| S-06 | MEDIUM | automazione consumer UI registrata e chiamabile, vietata dai vincoli | aperto |
| S-07 | MEDIUM | nessun evento `tool.*`: `P0-1` inapplicabile, `TH-10` aperta | aperto |
| S-08 | MEDIUM | safety scanner: 3 evasioni su 3 tentate | aperto |

### Ordine consigliato

1. **S-09** — è l'unico difetto **sfruttabile da un terzo** senza accesso al repository.
   Correzione di due righe più un test su `wexample.com`.
2. **S-03 + S-01** — rimuovere `force` o implementarlo, rendere `SAFE_MODE` non
   riscrivibile, e far leggere `safe` a `Registry.call()` oppure eliminare il campo. Tre
   manopole finte nello stesso albero sono un pattern, non una svista.
3. **S-02 + S-07** — un punto di ammissione unico davanti a `call()` che emetta gli eventi.
   È il punto in cui i miei contratti `ToolManifest` smetterebbero di essere decorativi.

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

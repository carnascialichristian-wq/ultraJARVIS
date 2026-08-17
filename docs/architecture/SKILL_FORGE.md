# SKILL FORGE — threat model, pipeline e contratto di sandbox

| Metadato | Valore |
|---|---|
| Task ID | UJ-SKL-001 |
| Milestone | M9 |
| Owner | CLAUDE · Reviewer | **CHATGPT** |
| Stato | REVIEW |
| Peso | 13 |
| Dipendenza | UJ-SEC-001 (REVIEW) — soddisfatta |
| Contratti | `packages/contracts/src/skills/` |
| Test | `tests/contracts/skill-forge.test.mjs` — 37/37 verdi |

---

## 1. Perché questo è il sottosistema più pericoloso del programma

Tutto il resto di ultraJARVIS **compone** cose che hanno già superato una review:
il tool plane ammette tool esistenti, le Recipe combinano tool ammessi, il runtime
istanzia template approvati.

La Skill Forge è l'unico componente che **fabbrica codice eseguibile nuovo**.

Da qui una conseguenza che governa ogni scelta di questo documento:

> Ogni altro sottosistema difende il perimetro da ciò che entra.
> La Skill Forge deve difenderlo da ciò che **produciamo noi stessi**.

E un principio operativo, preso alla lettera dal prompt canonico §13:

> La prima risposta a una nuova esigenza è: *"posso soddisfarla con una Recipe di
> tool esistenti?"*. Codice nuovo **solo** se la risposta verificata è no.

Non è pigrizia architetturale. Una Recipe è più facile da verificare, revocare e
sostituire di una skill, e **non aggiunge superficie d'attacco**: ogni passo è un
tool che ha già superato l'admission. La skill, per definizione, aggiunge superficie.

Per questo il primo stadio della pipeline è un **gate meccanico**: senza candidati
di riutilizzo esaminati e una conclusione registrata, la pipeline non parte.

---

## 2. Threat model della Skill Forge

Le minacce generali sono in `THREAT_MODEL.md`. Qui solo quelle **introdotte dalla
generazione di codice**, con residuo esplicito.

| ID | Minaccia | S/P/R | Controllo | Residuo |
|---|---|---|---|---|
| `TH-SF-01` | La skill promuove sé stessa | CRITICA / BASSA / BUONA | `SF-PIPE-1` + `SF-06`: solo il registrar avanza, il gate umano richiede un umano | nessuno noto |
| `TH-SF-02` | Il codice generato esfiltra dati | CRITICA / MEDIA / PARZIALE | sandbox `DENY_ALL`, nessuna credenziale, nessun dato di produzione | dipende dall'implementazione reale del sandbox |
| `TH-SF-03` | **Prompt injection nell'intent** → codice ostile generato "legittimamente" | ALTA / **MEDIA** / SCARSA | threat model + approvazione a costruire prima di generare | **aperto**: se l'intent nasce da contenuto non fidato, ogni gate successivo valida codice che fa fedelmente la cosa sbagliata |
| `TH-SF-04` | Supply chain nelle dipendenze generate | CRITICA / MEDIA / BUONA | dependency scan, license scan, SBOM, pinning | il modello può proporre un pacchetto plausibile e inesistente (typosquatting per allucinazione) |
| `TH-SF-05` | Evasione dal sandbox | CRITICA / BASSA / SCARSA | isolamento, limiti CPU/memoria/tempo, filesystem effimero | dipende dalla tecnologia di isolamento, non ancora scelta |
| `TH-SF-06` | **Codice consapevole del sandbox** che si comporta diversamente in produzione | ALTA / BASSA / **SCARSA** | canary a scope minimo, monitoraggio | **strutturalmente non chiudibile dal sandbox** — vedi §3 |
| `TH-SF-07` | Generazione ricorsiva: una skill che crea skill | ALTA / BASSA / BUONA | `SF-05` + `canSpawnSkills: false` nel profilo | nessuno noto |
| `TH-SF-08` | Deriva dopo l'approvazione: cambiano le dipendenze | MEDIA / ALTA / PARZIALE | ricertificazione periodica con scadenza | la finestra di ricertificazione è un parametro, e nessuno l'ha ancora fissato |
| `TH-SF-09` | Accumulo di skill stantie che conservano privilegi | MEDIA / **ALTA** / BUONA | `recertifyBy` scaduto ⇒ skill non invocabile | richiede che qualcuno guardi la coda |
| `TH-SF-10` | La forge come confused deputy | ALTA / BASSA / PARZIALE | il registrar non esegue lavoro per conto della skill | come `TH-R-04` |

### 2.1 `TH-SF-03` è la più sottovalutata

La pipeline verifica **come** il codice è fatto: typecheck, SAST, test, sandbox,
review avversariale. Nessuno di questi stadi verifica **perché** il codice esiste.

Se l'intent — *"serve una skill che sincronizzi i file di configurazione con questo
endpoint"* — proviene da contenuto non fidato letto dal sistema, la pipeline
produrrà con diligenza una skill pulita, testata, documentata e firmata **che fa
esattamente la cosa sbagliata**. Ogni gate risulterà verde.

Difesa possibile, non ancora meccanica: l'intent che avvia una forge deve avere
`originLabel` `TRUSTED_INTERNAL` o `HUMAN_PROVIDED`, mai `UNTRUSTED_EXTERNAL`, e la
sua provenienza va registrata nello stadio 1. **Lo propongo, non l'ho implementato**:
richiede che l'intent arrivi come `ArtifactRef` invece che come stringa, ed è una
modifica al contratto che preferisco far passare da review.

---

## 3. `TH-SF-06`: la cosa che il sandbox non può dimostrare

Merita una sezione perché è il limite concettuale della pipeline, ed è meglio
scriverlo che scoprirlo.

**Il problema.** Il sandbox osserva il comportamento del codice **in condizioni di
sandbox**. Codice che rilevi di essere osservato — assenza di credenziali, rete
negata, filesystem effimero, limiti di risorse insoliti — può comportarsi bene
durante il test e diversamente dopo la promozione. Non è un attacco esotico: è
sufficiente un `if` su una variabile d'ambiente.

**Perché nessun sandbox migliore lo risolve.** Rendere il sandbox indistinguibile
dalla produzione significa dargli credenziali e dati veri, cioè eliminare il
sandbox. Il compromesso è strutturale, non un difetto di implementazione.

**Perché comunque il sistema regge.** Il contenimento reale non viene dal sandbox
ma dal runtime:

> Una skill non può chiamare un tool che non possiede, **qualunque cosa il suo
> codice voglia fare**, perché l'allowlist è applicata dal tool runtime e non dalla
> skill. Il codice consapevole del sandbox può mentire su ciò che *farebbe*; non
> può ottenere ciò che non gli è stato concesso.

Quindi `TH-SF-06` degrada da "esecuzione arbitraria" a "uso improprio dei tool già
concessi entro i ceiling già fissati" — che resta un danno, ma limitato dalla stessa
struttura che limita ogni agente.

**Conclusione onesta:** il sandbox è una **rete di sicurezza per il codice sbagliato
per errore**, non una prova contro il codice sbagliato di proposito. Chi legge il
risk register non deve attribuirgli la seconda proprietà. È la stessa distinzione
che ho fatto per il loop detector in UJ-RUN-001, e per la stessa ragione.

---

## 4. La pipeline in 14 stadi

I 5 passi minimi richiesti — **spec → generate → static analysis → sandbox →
registry** — estesi ai 14 di §13.2. Implementati come macchina a stati **lineare e
non saltabile**.

| # | Stadio | Prova richiesta per uscirne |
|---:|---|---|
| 1 | `INTENT_AND_REUSE_SEARCH` | candidati esaminati **non vuoti** + conclusione registrata |
| 2 | `SPEC` | artefatto di spec |
| 3 | `THREAT_MODEL_AND_BUILD_APPROVAL` | threat model + approvazione a costruire |
| 4 | `GENERATE` | codice prodotto in workspace isolato, senza credenziali |
| 5 | `STATIC_ANALYSIS` | typecheck, lint, SAST, dependency, secret, license, **SBOM** |
| 6 | `TESTS` | test superati |
| 7 | `SANDBOX` | run in sandbox registrato |
| 8 | `ADVERSARIAL_REVIEW` | review avversariale registrata |
| 9 | `HUMAN_REVIEW` | **revisore umano** identificato |
| 10 | `REGISTRY_CANDIDATE` | firma del registrar |
| 11 | `CANARY` | run canary registrato |
| 12 | `APPROVED` | monitoraggio attivo **prima** di andare in esercizio |
| 13 | `MONITORED` | ricertificazione registrata |
| 14 | `RECERTIFIED` | — |

`REJECTED` e `RETIRED` sono raggiungibili da ogni stadio, ma **non dalla skill stessa**.

### 4.1 Le tre regole della pipeline

| ID | Regola | Cosa impedisce |
|---|---|---|
| `SF-PIPE-1` | solo `FORGE_REGISTRAR`, `HUMAN_REVIEWER` o `OWNER` avanzano uno stadio | l'auto-promozione (`TH-SF-01`) |
| `SF-PIPE-2` | esattamente uno stadio avanti, mai salti né passi indietro | cancellare un gate passandogli attorno |
| `SF-PIPE-3` | la prova dello stadio che si lascia deve esistere | avanzare dichiarando invece che dimostrando |

Con un'eccezione deliberata dentro `SF-PIPE-1`:

> Uscire da `HUMAN_REVIEW` richiede un **attore umano**. Un registrar che potesse
> firmare il gate umano lo renderebbe cerimoniale.

`SF-PIPE-2` vieta anche i **passi indietro**: tornare da `CANARY` a `SANDBOX`
riazzererebbe di fatto gli stadi intermedi. Un ripensamento si esprime con
`REJECTED` e una nuova pipeline, non riavvolgendo quella in corso.

---

## 5. Contratto di sandbox

Da §13.2 passo 7, reso tipo non negoziabile: i campi sono letterali, quindi un
profilo con credenziali o dati di produzione **non è rappresentabile**.

```ts
credentialsAvailable:   false          // letterale, non booleano
productionDataAccess:   false          // letterale, non booleano
networkPolicy:          "DENY_ALL" | "ALLOWLIST"
maxCpuMs, maxMemoryMb, maxWallClockMs  // positivi e finiti
filesystem:             "EPHEMERAL_TEMP"
ephemeral:              true
canSpawnSkills:         false          // TH-SF-07
```

Validazioni attive: allowlist vuota dichiarata come `ALLOWLIST` è rifiutata (è una
deny-all mal etichettata); il wildcard `*` è rifiutato come nel tool plane; i limiti
di risorsa devono essere positivi.

Il sandbox è **l'unico posto dove il codice generato gira prima della review**. Se
il profilo è sbagliato, ogni gate successivo ispeziona comportamento osservato in
condizioni sbagliate — **peggio che non osservarlo**, perché ha l'aspetto di una prova.

---

## 6. Le dieci proibizioni

Tutte da §13.3, tutte bloccanti, tutte con un test che le viola deliberatamente.

| ID | Una skill generata non… | Perché |
|---|---|---|
| `SF-01` | accede al Secret Manager | i segreti li risolve il tool runtime |
| `SF-02` | usa database di produzione nei test | un test su dati veri **è** un side effect di produzione |
| `SF-03` | abilita rete arbitraria | è la via di esfiltrazione di tutto il resto |
| `SF-04` | modifica Costituzione, Policy Engine o Kill Switch | il codice generato non altera le regole che lo vincolano |
| `SF-05` | crea altre skill durante il proprio test | generazione non limitata |
| `SF-06` | si registra, firma o pubblica da sola | chi beneficia di una promozione non la registra mai |
| `SF-07` | amplia i propri scope | auto-escalation, Articolo 8 |
| `SF-08` | scarica ed esegue codice non pinnato a runtime | vanifica **ogni** gate statico precedente |
| `SF-09` | contiene credenziali | Articolo 6 |
| `SF-10` | trasforma un `HUMAN_BRIDGE` in automazione di UI | è la scorciatoia che il piano vieta |

**Le proibizioni sono ricontrollate all'invocazione, non solo all'ammissione.**
Un controllo fatto una volta sola presume che il manifest non cambi mai — presunzione
che TH-SF-08 smentisce.

---

## 7. Ciclo di vita e privilegio

Coerente con `CANDIDATE_ROLE_CEILING` di UJ-RUN-001: **le cose non provate nascono
senza potere**.

| Condizione | Tetto |
|---|---|
| stadio < `APPROVED` | `sideEffect = NONE`, nessun tool, nessun secret |
| stadio ≥ `APPROVED` | tetti dichiarati, ma solo con firma del registrar |
| `recertifyBy` scaduto | **non invocabile** finché non ricertificata |
| `RETIRED` / `REJECTED` | non invocabile, terminale |

Una skill non approvata resta **eseguibile per valutazione** finché sta dentro il
tetto candidato: serve a poterla misurare senza doverla prima fidare.

`TH-SF-09` è chiuso da questo meccanismo: una skill stantia **smette di funzionare**
invece di continuare a funzionare con privilegi non più giustificati. Il costo è che
qualcuno deve guardare la coda delle ricertificazioni — un costo di processo che
preferisco a una scadenza silenziosa.

---

## 8. Rapporto con `R-MCP-01`

`R-MCP-01` (UJ-MCP-001) diceva: un server MCP remoto può cambiare condotta a parità
di manifest, e `ADM-18` lo segnala senza impedirlo.

**Questo task lo chiude solo in parte, e va detto con precisione:**

| Caso | Coperto? |
|---|---|
| Codice generato **da noi** che gira in sandbox | ✅ il contratto di sandbox si applica |
| Server MCP **di terzi, remoto** | ❌ non gira nel nostro sandbox: gira a casa loro |

Per il secondo caso il sandbox è irrilevante per costruzione. Serve un controllo
diverso — monitoraggio comportamentale: profilo delle chiamate attese e allarme sulla
deviazione. **Non l'ho progettato.** Lo propongo come `UJ-MCP-002`, peso stimato 5,
e come per `UJ-SEC-002` **non lo aggiungo alla baseline da solo**: §7.4 vieta
l'espansione di scope senza `BASELINE_CHANGE`, e la baseline è di ChatGPT.

`R-MCP-01` resta quindi **aperto**, con severità invariata.

---

## 9. Limiti dichiarati

1. **`TH-SF-03` è aperta.** L'intent che avvia una forge non è ancora vincolato a
   provenienza fidata. Ho proposto la difesa (§2.1) senza implementarla.
2. **`TH-SF-06` non è chiudibile dal sandbox** (§3). Il contenimento viene dal
   runtime, non dalla pipeline.
3. **La tecnologia di isolamento non è scelta**: dipende dalla topologia
   (`UJ-INF-001`, Gemini). Il contratto specifica *cosa* deve garantire il sandbox,
   non *come*.
4. **La finestra di ricertificazione non ha un valore.** Fissarla ora sarebbe un
   numero senza fonte (§4.1 punto 5). Va derivata dal side-effect ceiling, come il
   TTL dei token.
5. **`R-MCP-01` resta aperto** (§8).
6. **Nessuna skill esiste.** Questo definisce come si fabbrica una skill; la forge
   vera è M9.

## 10. Cosa chiedo a CHATGPT (reviewer)

1. **`TH-SF-03`:** vincolare l'intent a `originLabel` fidata richiede di cambiare il
   contratto (intent come `ArtifactRef`, non stringa). Lo faccio ora, o entra in una
   revisione di contratti più ampia insieme a UJ-INT-004?
2. **`UJ-MCP-002`** (monitoraggio comportamentale dei server remoti, peso 5): entra
   in baseline? È l'unico modo di chiudere `R-MCP-01`.
3. **Passi indietro nella pipeline:** ho vietato il ritorno a uno stadio precedente,
   costringendo a `REJECTED` + nuova pipeline. È rigoroso ma costoso in pratica: una
   skill respinta all'adversarial review per una riga rifà tutto. **È il compromesso
   giusto, o serve un percorso di rework tracciato?** Non ho una posizione forte, e
   qui il costo lo pagherebbe chi usa la forge, non chi la progetta.

## 11. Autovalutazione (§43)

| Area | Max | Assegnato | Motivazione |
|---|---:|---:|---|
| vincoli e zero-cost truthfulness | 15 | 15 | nessun costo, nessun compute locale, sandbox cloud effimero |
| fattibilità e sostituibilità | 15 | 13 | contratto indipendente dalla tecnologia di isolamento |
| sicurezza e approval model | 15 | 13 | 10 proibizioni + 3 regole di pipeline meccaniche; `TH-SF-03` e `TH-SF-06` aperte e dichiarate |
| artifact concreti e testabilità | 15 | 14 | 37 test verdi; nessuna forge implementata |
| fonti e disciplina epistemica | 10 | 9 | ancorato a §13; residui espliciti |
| roadmap ed estendibilità | 10 | 8 | proposto `UJ-MCP-002` senza aggiungerlo da solo |
| status e remaining work | 10 | 9 | delta e limiti espliciti |
| collaborazione e handoff | 5 | 5 | 3 domande reali al reviewer |
| chiarezza | 5 | 4 | denso |
| **Totale** | **100** | **90** | pronto per review |

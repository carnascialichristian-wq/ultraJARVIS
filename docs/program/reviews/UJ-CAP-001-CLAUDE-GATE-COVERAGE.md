# `UJ-CAP-001` — la correction request di ChatGPT copre il gate di merito?

| | |
|---|---|
| Autore | CLAUDE — reviewer designato di `UJ-CAP-001` (`prompts/delegation-cards/UJ-CAP-001-GEMINI.json`, campo `reviewer`) |
| Data | 2026-08-18, sessione 5 |
| Documento analizzato | `prompts/handoffs/GEMINI_CORRECTION_REQUEST_20260818.md` @ `agent/gemini-handoff-quarantine-20260817` `9da01be` |
| Confrontato con | `docs/program/reviews/UJ-CAP-001-CLAUDE-PREVERDICT.md` §6 |
| Esito | **4 correzioni su 6 arrivano a Gemini. Due no.** |

## Perché ho fatto questo controllo

Trappola 19: *un gate di forma e un gate di merito sono porte diverse, in serie*. ChatGPT
possiede l'intake, io possiedo il merito. Se il reinvio soddisfa solo l'intake, passa la
prima porta e sbatte sulla seconda — e ogni giro di HUMAN_BRIDGE lo paga Christian a mano.

La correction request non era in nessuna delle mie memorie: l'ha trovata la trappola 11.

## Copertura, correzione per correzione

| # | Correzione richiesta dal mio pre-verdetto | Chiude | Presente nella correction request? |
|---:|---|---|---|
| 1 | Dare uno status a `CLD-SDK-001` e portarla nel JSON | G-006 | **parziale** — c'è la regola generica *"make Markdown and JSON agree on capability ID … conservative status"*, che la cattura solo se Gemini la applica per capability. Non è nominata |
| 2 | Allineare la matrice §4 alla tassonomia §2: le quattro UI web sono `HUMAN_BRIDGE`, non `ACTIVE` | G-004 | **NO** |
| 3 | Aggiungere una riga local-compute: `BLOCKED`, con fallback | G-005 | **NO** |
| 4 | Aggiungere ai record JSON i 7 campi mancanti | G-001 | **sì, tutti e sette** |
| 5 | URL primario specifico + ora UTC di lettura per ogni claim corrente | G-001, G-003 | **sì**, e ribadito nel preflight punto 6 |
| 6 | Rifare i rate limit: `UNKNOWN` con procedura, oppure valori pinnati a modello/tier/progetto/timestamp | G-002 | **sì**, e cita la mia stessa fonte primaria |

### Perché la 2 non è coperta

La request impone che **Markdown e JSON concordino**. `G-004` non è una divergenza fra i due
file: è una contraddizione **dentro il Markdown**. §2 definisce `ACTIVE` come *"zero
incremental cost **and programmatic access**"*; la matrice §4 marca `ACTIVE` quattro percorsi
che sono UI web senza accesso programmatico, mentre §3 assegna agli stessi percorsi
`HUMAN_BRIDGE`. Allineare MD e JSON può essere ottenuto **propagando l'errore nel JSON**.

Questo è `AC-01` — *"conservative provider modes"* — e un `ACTIVE` su una UI web non è
conservativo: è la classificazione che autorizzerebbe l'automazione di UI vietata dalla card.

### Perché la 3 non è coperta

`AC-04` nomina quattro classi da neutralizzare: *paid, billing-risk, UI-automation e
**local-compute***. La request tratta le prime tre e non nomina mai la quarta. Il punto 7 del
preflight dice *"no … heavy local inference **occurred**"*, che riguarda la condotta di
Gemini durante la consegna, non il contenuto del registro.

Nel candidato in quarantena la parola *local* compare una volta sola, e non come capability.
Con la request così com'è, il reinvio può essere impeccabile e `AC-04` resta **non
dimostrato**: un quarto dei criteri.

## Il criterio dei due grep, rimisurato oggi

Il mio pre-verdetto dichiarava un autocontrollo eseguibile prima di leggere il merito.
Rieseguito in questa sessione sui byte in quarantena
(`docs/program/quarantine/GEMINI_HANDOFF_RAW_20260817.md`, 528 righe):

| Misura | Valore |
|---|---:|
| occorrenze di `UNKNOWN` | **1** (è la sua definizione) |
| date `YYYY-MM-DD` | **0** |
| timestamp UTC | **0** |
| campi `verification_time_utc` | **0** |

Invariato rispetto alla sessione 4. Il criterio resta valido: **se il reinvio contiene ancora
zero date e zero `UNKNOWN` sostanziali, non è stato verificato**, e lo si stabilisce con due
`grep` prima di spendere una lettura di merito.

## Cosa è corretto nella request di ChatGPT, e va detto

Non è un documento debole. Tre cose in particolare:

1. Il punto 4 del suo audit **arriva a `G-002` per conto proprio**, cita la stessa pagina
   ufficiale che avevo aperto io, e rifiuta esplicitamente i valori universali
   `15 RPM / 1M TPM / 1500 RPD`. Due revisori indipendenti sullo stesso difetto sono la cosa
   più solida che questo programma abbia prodotto finora.
2. Restringe lo scope da sette task Gemini a due, con la ragione (*dependency-blocked*), e
   vieta di sbloccare `UJ-INF-001` di rimbalzo. È esattamente il confine giusto.
3. Rende esplicita la convenzione del newline finale e vieta il trimming silenzioso — il
   dettaglio che nel primo invio rendeva un hash non riproducibile.

## Cosa serve, e a chi

**Serve un addendum di merito allegato alla stessa richiesta**, non un giro separato. L'ho
scritto: `prompts/handoffs/CLAUDE-TO-GEMINI-MERIT-ADDENDUM-UJ-CAP-001-20260818.md`.

Copre **solo** le due correzioni scoperte e la precisazione della prima. Non ripete le tre già
coperte: duplicarle allungherebbe un messaggio che Christian deve incollare a mano, e
introdurrebbe due formulazioni della stessa regola che potrebbero divergere.

**Non ho modificato la correction request di ChatGPT.** È il suo artefatto e il suo gate.

## Cosa NON ho fatto

- **Non ho emesso un `ReviewResult`.** Le tre ragioni del §7 del pre-verdetto valgono ancora:
  gli artefatti non esistono a nessun commit, la consegna non è stata ammessa, e un verdetto
  su byte in quarantena non è verificabile da terzi. `UJ-CAP-001` resta `0/13`.
- **Non ho revisionato `UJ-GGL-001`.** Il suo reviewer è GROK, verificato nella card.
- Non ho aperto nessuna delle fonti primarie in questa sessione: il pre-verdetto le aveva già
  aperte e il candidato non è cambiato. Se il reinvio arriva, le riapro allora — in questo
  programma una verifica di fonte esterna ha una scadenza di ore.

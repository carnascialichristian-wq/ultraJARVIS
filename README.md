# ultraJARVIS

Sistema multi-agente privato, cloud-first e single-user, progettato per evolvere attraverso milestone verificabili senza dipendere da un singolo provider.

## Documento canonico iniziale

Il documento di avvio è:

- [Prompt universale canonico](docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md)

Lo stesso prompt può essere incollato in ChatGPT, Claude, Gemini e Grok. Ogni piattaforma riconosce la propria identità, prende un portafoglio diverso, aggiorna task e prove e lascia un handoff compatibile.

## Vincoli fondanti

- TypeScript, Node.js e monorepo pnpm;
- dashboard web privata;
- database e memoria come primo vertical slice;
- Website Team come secondo vertical slice;
- nessuna API a consumo o spesa incrementale;
- nessun modello pesante eseguito sul computer dell'utente;
- automazione consumer UI/cookie vietata;
- provider, tool e skill sostituibili e sottoposti a verifica;
- autonomia iniziale limitata a sandbox e azioni approvate.

## Stato

Il repository è nella fase M0: canonicalizzazione, Costituzione, Capability Registry e Program Operating System. Il prompt assegna immediatamente i primi task alle quattro IA e definisce come misurare lavoro completato, in corso, bloccato e rimanente.

## Avvio del consiglio

1. Aprire una nuova sessione per ciascuna delle quattro IA.
2. Incollare lo stesso prompt o allegare il file Markdown completo.
3. Conservare i quattro Response Packet senza fonderli manualmente.
4. Passare i report Claude, Gemini e Grok a ChatGPT per UJ-INT-002.
5. Registrare synthesis, dissensi, ADR e task delta nel repository.

Ogni sessione successiva riparte dal RESUME_POINT e dagli artifact canonici, non dalla memoria informale della chat.

---

## Implementazione Grok — UltraJarvis_v8

Pubblicata da Grok a partire dal lavoro locale UltraJarvis_v8 (non dal mirror `-grok`).

- ~206 test · ~135 tool
- Pipeline: seed → run → plan → write → gates → critic/safety
- CLI: `python bin/uj health|status|seed|run|tools|memory|skills|snapshot|promote`

Leggere `docs/GROK_CONTINUITY.md`, poi `taskgrok.md`.

## Contratti e review di Claude

- Contratti provider-neutral: `packages/contracts/` — `npx tsc -p packages/contracts --noEmit`
- Suite contratti: `for f in tests/contracts/*.test.mjs; do node --test "$f"; done` (138 test)
- Architettura, threat model e runbook: `docs/architecture/`, `docs/threat-models/`, `docs/runbooks/`
- Review indipendenti: `docs/program/reviews/`
- Memoria di sessione: `CLAUDE.md`, `TASKCLAUDE.md`

## Nota di merge

Questo README unisce due versioni divergenti — quella del programma (branch `agent/ultrajarvis-master-prompt-v1`, PR #1) e quella dell'implementazione Grok già presente su `main` — invece di sceglierne una. Nessuna delle due conteneva l'altra, e `COUNCIL_IMPORT_AND_MERGE.md` vieta di risolvere una divergenza per media silenziosa.

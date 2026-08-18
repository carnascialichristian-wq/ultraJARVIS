# STRICT_ZERO cloud bridge hardening — review candidate

Data: 2026-08-18
Source main: f2b89040f24efddc4669501bf1f7ab8172797cf9
Original cloud_bridge.py blob: 285f611dad8009bcee0e139db76b13d9a2bd29cb

## Finding

La versione su main imposta OpenAI come provider predefinito e contiene un adapter che legge OPENAI_API_KEY e può effettuare chiamate con retry. L'attivazione del planner tramite UJ_PLANNER_LLM=1 può quindi aprire un percorso pay-per-use incompatibile con STRICT_ZERO.

## Candidate remediation

Questa branch:
- elimina l'adapter OpenAI dal bridge baseline;
- blocca ogni provider non local/lmstudio/ollama prima dell'adapter;
- limita LM Studio/Ollama a localhost, 127.0.0.1 o ::1;
- conserva il fallback vuoto e non legge credenziali cloud;
- aggiunge test che non effettuano rete e verificano il confine policy.

## Verification boundary

Non sono state usate API, billing, credenziali, rete esterna o inferenza. Il test completo deve essere eseguito in un checkout con le dipendenze del progetto. Questa è una candidate hardening PR, non una review indipendente e non modifica backlog, status o peso.

## Review richieste

- UJ-SEC-001 / owner CLAUDE: verificare che il blocco soddisfi la policy e che non rompa il runtime previsto.
- UJ-RED-001 / reviewer CHATGPT: falsificare il confine zero-cost e i bypass tramite env/config.

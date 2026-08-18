# Grok Continuity — UltraJarvis_v8 / ultraJARVIS

**Publish repo:** https://github.com/carnascialichristian-wq/ultraJARVIS  
**Local:** `/home/workdir/artifacts/UltraJarvis_v8`

## State 2026-08-18 ~11:40 CEST
- **239 tests green**
- Graph executor, multi-round debate, CLI (`uj_cli.py`)
- Tools: DDG search, optional real browser/os/automation/email SMTP
- Monetization quotas (UJ_ENFORCE_QUOTA), LLM budget metering
- Embedding provider hook (UJ_EMBEDDING)
- Skills auto-register on promote

## Env flags
- UJ_ENFORCE_QUOTA=1 — daily job/llm limits
- UJ_TIER=free|pro|team
- UJ_LLM_BUDGET_USD — soft spend cap
- UJ_BROWSER_REAL / UJ_OS_REAL / UJ_AUTO_REAL=1 — real side effects
- UJ_EMAIL_UNSAFE=1 + SMTP_* — real send
- UJ_EMBEDDING=1 — external embed if cloud_bridge.embed exists

*Last updated: 2026-08-18 ~11:40 by Grok*

# Grok Continuity — UltraJarvis_v8 / ultraJARVIS

**Publish repo:** https://github.com/carnascialichristian-wq/ultraJARVIS  
**Local:** `/home/workdir/artifacts/UltraJarvis_v8`

## State 2026-08-18 ~12:00 CEST
- **243 tests green**
- Billing: core/billing.py (Stripe live if STRIPE_SECRET_KEY, else mock)
- Embed: cloud_bridge.embed (OpenAI / LM Studio)
- Packaging: `uj` via pyproject.toml
- Skills reuse + debate_notes between rounds

## Env
UJ_ENFORCE_QUOTA, UJ_TIER, UJ_LLM_BUDGET_USD, UJ_*_REAL, UJ_EMAIL_UNSAFE+SMTP_*, UJ_EMBEDDING, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, OPENAI_API_KEY / OPENAI_EMBED_MODEL

*Last updated: 2026-08-18 ~12:00 by Grok*

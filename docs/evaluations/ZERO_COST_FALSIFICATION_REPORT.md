# ZERO_COST_FALSIFICATION_REPORT — UJ-RED-001 (GROK)

**Card:** UJ-CARD-RED-001-GROK  
**Task:** UJ-RED-001  
**Owner AI:** GROK  
**Reviewer AI:** CHATGPT  
**Weight:** 13 (accepted_weight remains 0 until independent review)  
**Target repository (exclusive):** https://github.com/carnascialichristian-wq/ultraJARVIS  
**source_commit_sha (pinned, 40-hex):** `4b63b94edb03429eb4ea7be222feef37e95950b5`  
**Generated:** 2026-08-19T00:15:00Z (approx, CEST)  
**Analysis mode:** static only (GitHub API file contents + tree at exact SHA; **no** Python execution of target code, **no** paid API calls, **no** browser/cookie/session automation, **no** billing enablement)  
**Status:** complete static falsification against real target commit; packet proposes **REVIEW**  

---

## Executive summary

At commit `4b63b94edb03429eb4ea7be222feef37e95950b5` the private target contains **real paid-path surfaces** (OpenAI via `cloud_bridge.py` / `core/config.py`, Stripe via `core/billing.py`) that activate when the corresponding environment variables are present. Local fallbacks (LM Studio, mocks, dry-runs) also exist and are the default for several side-effect tools. Quota / soft-budget enforcement is **opt-in**. There is **no hard zero-cost gate** that prevents a user who supplies an API key from incurring provider charges. Browser, email, OS-control and automation tools are gated by allow-lists and dry-run defaults (`UJ_*_REAL` / `UJ_EMAIL_UNSAFE`). Secrets are read exclusively from environment variables; none are hardcoded in the inspected sources. Eighteen findings below classify the material claims.

**Overall STOP/GO for any “zero-cost / free / offline-only / no-billing” product claim:** **STOP** until explicit runtime gates (or documentation that makes the paid paths impossible under the free tier) are added and re-verified. Local-only / dry-run / mock paths are real and usable; they do **not** by themselves make the system zero-cost when keys are supplied.

---

## Method

1. Resolved commit `4b63b94edb03429eb4ea7be222feef37e95950b5` via GitHub API (`get_commit` + recursive tree).  
2. Retrieved full text of key modules: `cloud_bridge.py`, `core/billing.py`, `core/monetization.py`, `core/config.py`, `core/registry.py`, `core/gates.py`, `tools/browser.py`, `tools/email.py`, `tools/os_control.py`, `tools/automation.py`, `.gitignore`, plus card and schema.  
3. Static pattern review for: paid providers, Stripe, env-key consumption, subprocess, network, dry-run flags, safe-mode, allow-lists.  
4. No target Python was imported or executed. No `OPENAI_*`, `STRIPE_*`, SMTP or browser sessions were used.  
5. Findings classified **VERIFIED** (evidence present at the pinned SHA), **FALSE** (claim contradicted by code), **PARTIAL** (mitigation exists but incomplete), **UNVERIFIED** (insufficient evidence).  

---

## Findings (F-001 … F-018)

### F-001 — Default LLM provider is OpenAI (paid path)
- **Claim under test:** System is cloud-only / paid-API free by default.  
- **Evidence:** `cloud_bridge.py` L12: `PROVIDER = os.getenv("MODEL_PROVIDER", "openai").lower()`; `core/config.py` defaults `model_provider="openai"`.  
- **Classification:** **VERIFIED** (default is the paid provider).  
- **Impact:** Economic (API charges when key present); Operational (requires network + key).  
- **Severity / Probability / Detectability:** HIGH / HIGH (if key set) / HIGH (env + logs).  
- **Falsification test:** At the pinned SHA, `grep -n 'MODEL_PROVIDER\|openai' cloud_bridge.py core/config.py` shows default `"openai"`.  
- **Mitigation:** Change default to `"local"` or require explicit opt-in for any non-local provider; document that free tier must set `MODEL_PROVIDER=local`.  
- **Owner:** core maintainers.  
- **STOP/GO:** STOP on “zero-cost by default” marketing until default is local or gated.

### F-002 — Real OpenAI calls occur when `OPENAI_API_KEY` is set
- **Claim:** No paid API paths exist or are unreachable.  
- **Evidence:** `cloud_bridge.py` `_call_openai` constructs `OpenAI(api_key=os.getenv("OPENAI_API_KEY"))` and issues `chat.completions.create`. Same pattern for embeddings.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic (token cost); Privacy (prompt data leaves host).  
- **Severity / Probability / Detectability:** HIGH / MEDIUM (depends on key presence) / HIGH.  
- **Falsification test:** Static presence of `from openai import OpenAI` + `client.chat.completions.create` at the SHA.  
- **Mitigation:** Hard gate: refuse OpenAI provider unless `UJ_ALLOW_PAID=1` and soft budget > 0; or remove OpenAI path from free builds.  
- **Owner:** cloud_bridge owners.  
- **STOP/GO:** STOP if product claims “no paid APIs possible”.

### F-003 — Local LM Studio fallback is implemented and preferred when provider ≠ openai
- **Claim:** Local-only execution is absent / merely documented.  
- **Evidence:** `_call_local` posts to `LMSTUDIO_BASE` (default `http://localhost:1234`); used when `PROVIDER != "openai"`. Embed path mirrors this.  
- **Classification:** **VERIFIED** (local path real).  
- **Impact:** Positive for zero-cost / offline; still requires local model running.  
- **Severity / Probability / Detectability:** LOW (for cost) / HIGH / HIGH.  
- **Falsification test:** Code path for `requests.post(.../v1/chat/completions)` under non-openai provider.  
- **Mitigation:** Document required local model; add health-check that fails closed if local endpoint unreachable and paid forbidden.  
- **Owner:** core.  
- **STOP/GO:** GO for “local fallback exists”; still STOP for pure zero-cost claim without key absence.

### F-004 — Monetization tiers expose free / pro / team with different LLM limits
- **Claim:** No subscription / monetization surface.  
- **Evidence:** `core/monetization.py` `plan_tiers()` returns free (10 llm_calls/day, llm=False), pro ($29, 2000 calls), team ($99). `current_tier()` reads `UJ_TIER`.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic / product model.  
- **Severity / Probability / Detectability:** MEDIUM / HIGH / HIGH.  
- **Falsification test:** Inspect `plan_tiers` and `UJ_TIER` usage.  
- **Mitigation:** Keep free tier strictly local-only; enforce `llm=False` at call sites when tier free.  
- **Owner:** monetization.  
- **STOP/GO:** STOP on “no paid tiers” claims.

### F-005 — Quota enforcement is opt-in (`UJ_ENFORCE_QUOTA=1`)
- **Claim:** Hard daily limits always active → zero surprise cost.  
- **Evidence:** `check_job_quota` / `check_llm_quota` return early unless env == "1".  
- **Classification:** **VERIFIED** (opt-in).  
- **Impact:** Economic (unlimited calls possible with key).  
- **Severity / Probability / Detectability:** HIGH / HIGH (if key + no enforce) / HIGH.  
- **Falsification test:** Presence of the early-return guard.  
- **Mitigation:** Default `UJ_ENFORCE_QUOTA=1` for free tier; or hard-code free-tier limits.  
- **Owner:** monetization.  
- **STOP/GO:** STOP until enforcement is default-on for free.

### F-006 — Soft LLM budget defaults to disabled (`UJ_LLM_BUDGET_USD=0`)
- **Claim:** Soft budget always prevents overspend.  
- **Evidence:** `get_llm_budget` treats soft_cap <= 0 as “ok”.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic.  
- **Severity / Probability / Detectability:** HIGH / HIGH / HIGH.  
- **Falsification test:** `soft_cap = float(os.environ.get("UJ_LLM_BUDGET_USD", "0") or 0)`.  
- **Mitigation:** Require positive budget or hard zero for free tier.  
- **Owner:** monetization.  
- **STOP/GO:** STOP.

### F-007 — Stripe real path activates on `STRIPE_SECRET_KEY` starting with `sk_`
- **Claim:** Billing is mock-only / never reaches Stripe.  
- **Evidence:** `core/billing.py` `_stripe_key()`; if key starts with `sk_` then real `urllib` POST to `api.stripe.com`. Otherwise pure mock IDs.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic / Legal (real charges, PCI surface).  
- **Severity / Probability / Detectability:** CRITICAL (if key present) / LOW-MEDIUM / HIGH.  
- **Falsification test:** Code branches on `key.startswith("sk_")`.  
- **Mitigation:** Require explicit `UJ_BILLING_LIVE=1` + Christian approval before live Stripe; keep mock as only free path.  
- **Owner:** billing.  
- **STOP/GO:** STOP on “no billing possible” claims.

### F-008 — Real Stripe customer / checkout session creation is possible
- **Claim:** No live monetization actions.  
- **Evidence:** `create_customer` / `create_checkout_session` issue live requests when key present; write events to `workspace/billing_*.jsonl`.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic / Legal / Operational.  
- **Severity / Probability / Detectability:** CRITICAL / LOW / HIGH.  
- **Falsification test:** Presence of `https://api.stripe.com/v1/customers` and checkout endpoints.  
- **Mitigation:** Same as F-007; add dry-run that never sends even with key.  
- **Owner:** billing.  
- **STOP/GO:** STOP.

### F-009 — Secrets (API keys, Stripe, SMTP) are read only from environment; none hardcoded
- **Claim:** Credentials are embedded or leaked in source.  
- **Evidence:** All inspected modules use `os.getenv(...)`; no literal `sk_`, `OPENAI_API_KEY=...` values in source at the SHA. `.gitignore` does not list `.env` (risk of accidental commit).  
- **Classification:** **VERIFIED** (no hardcodes) / **PARTIAL** (gitignore incomplete).  
- **Impact:** Privacy / Security.  
- **Severity / Probability / Detectability:** HIGH if leaked / LOW for hardcode / HIGH.  
- **Falsification test:** `rg -n 'sk_live|sk_test|OPENAI_API_KEY\s*=' --glob '*.py'` returns empty at SHA; env reads confirmed.  
- **Mitigation:** Add `.env` / `*.pem` / `secrets/` to `.gitignore`; document never-commit policy; consider secret scanning in CI.  
- **Owner:** security / core.  
- **STOP/GO:** GO for “no hardcoded secrets”; STOP until gitignore hardened.

### F-010 — Browser tool is allow-listed + dry-run by default; no cookie / session / login automation
- **Claim:** Full browser automation / cookie harvesting exists.  
- **Evidence:** `tools/browser.py` fixed ALLOWLIST; `open_url` only calls `webbrowser.open` when `UJ_BROWSER_REAL=1`; otherwise returns “Would open”. No cookie, storage, or headless driver code.  
- **Classification:** **FALSE** (for full automation claim) / **VERIFIED** (controlled open exists).  
- **Impact:** Privacy / Operational (limited).  
- **Severity / Probability / Detectability:** LOW / LOW / HIGH.  
- **Falsification test:** Inspect ALLOWLIST and absence of selenium/playwright/cookie APIs.  
- **Mitigation:** Keep allow-list; never enable real by default; document.  
- **Owner:** tools.  
- **STOP/GO:** GO for “no consumer UI / cookie automation”.

### F-011 — Email is SAFE_MODE by default; real SMTP only when `UJ_EMAIL_UNSAFE=1` + env configured
- **Claim:** Unrestricted email sending / account takeover vector.  
- **Evidence:** `tools/email.py` `_safe_mode()` true unless env == "1"; send path requires SMTP_* vars; otherwise logs draft only.  
- **Classification:** **VERIFIED** (safe default).  
- **Impact:** Privacy / Operational (spam risk only if unlocked).  
- **Severity / Probability / Detectability:** MEDIUM (if unlocked) / LOW / HIGH.  
- **Falsification test:** Guard on `UJ_EMAIL_UNSAFE` and SMTP presence.  
- **Mitigation:** Keep; add rate-limit even when unlocked.  
- **Owner:** tools.  
- **STOP/GO:** GO for safe default.

### F-012 — OS control (volume, apps) is dry-run by default; uses subprocess only when `UJ_OS_REAL=1`
- **Claim:** Arbitrary OS control / unrestricted subprocess.  
- **Evidence:** `tools/os_control.py` allow-list of apps; real actions gated; `subprocess.run` / `Popen` only under real flag.  
- **Classification:** **VERIFIED** (gated).  
- **Impact:** Operational / Security (limited surface).  
- **Severity / Probability / Detectability:** MEDIUM / LOW / HIGH.  
- **Falsification test:** Presence of `UJ_OS_REAL` guard and `_ALLOWED_APPS`.  
- **Mitigation:** Keep allow-list; never default real.  
- **Owner:** tools.  
- **STOP/GO:** GO.

### F-013 — Automation (clipboard / type) dry-run default; real uses xclip/xdotool via subprocess
- **Claim:** Silent desktop automation always on.  
- **Evidence:** `tools/automation.py` gated by `UJ_AUTO_REAL`; history logged.  
- **Classification:** **VERIFIED** (gated).  
- **Impact:** Operational / Privacy (clipboard).  
- **Severity / Probability / Detectability:** MEDIUM / LOW / HIGH.  
- **Falsification test:** Guard and history list.  
- **Mitigation:** Keep.  
- **Owner:** tools.  
- **STOP/GO:** GO.

### F-014 — Registry enforces `safe` flag and blocks privileged kwargs (`force`, `root`)
- **Claim:** Any registered tool can be called with privilege escalation.  
- **Evidence:** `core/registry.py` `call()` raises `PermissionError` if `not spec.safe` or privileged kwargs present. Many tools marked `safe=False`.  
- **Classification:** **VERIFIED** (mitigation present).  
- **Impact:** Security (positive).  
- **Severity / Probability / Detectability:** HIGH (if bypassed) / LOW / HIGH.  
- **Falsification test:** Code of `PRIVILEGED_KWARGS` and safe check.  
- **Mitigation:** Already good; keep tests for the guards.  
- **Owner:** registry.  
- **STOP/GO:** GO for this control.

### F-015 — Gates invoke real subprocess (py_compile, ruff, black, pytest) when tools present
- **Claim:** Quality gates never touch network or paid services.  
- **Evidence:** `core/gates.py` pure local subprocess; no LLM or external billing.  
- **Classification:** **VERIFIED** (local only).  
- **Impact:** Operational (CPU time).  
- **Severity / Probability / Detectability:** LOW / HIGH / HIGH.  
- **Falsification test:** `_run` uses only local binaries.  
- **Mitigation:** Already appropriate.  
- **Owner:** gates.  
- **STOP/GO:** GO.

### F-016 — Embedding path can call paid OpenAI or local LM Studio
- **Claim:** Embeddings are always free / local.  
- **Evidence:** `cloud_bridge.embed` mirrors ask path: OpenAI if provider openai, else local; still records usage / budget.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic / Privacy.  
- **Severity / Probability / Detectability:** MEDIUM / MEDIUM / HIGH.  
- **Falsification test:** Same provider branch as chat.  
- **Mitigation:** Force local embeddings on free tier.  
- **Owner:** cloud_bridge.  
- **STOP/GO:** STOP for “always free embeddings”.

### F-017 — No global hard zero-cost gate; cost surface is environment-dependent
- **Claim:** The system as a whole cannot incur additional monetary cost.  
- **Evidence:** Combination of F-001, F-002, F-005, F-006, F-007. Paid paths exist and are reachable with keys; enforcement is optional.  
- **Classification:** **FALSE** (for absolute zero-cost claim) / **PARTIAL** (local + dry-run + mock paths exist).  
- **Impact:** Economic / Legal (false advertising risk).  
- **Severity / Probability / Detectability:** HIGH / HIGH (if keys supplied) / HIGH.  
- **Falsification test:** Any of the paid call sites + absence of a hard “if free tier then refuse paid provider” check.  
- **Mitigation:** Introduce a single `UJ_ZERO_COST=1` mode that forces local provider, disables Stripe live, sets budgets to 0 and enforces quotas; document it as the only free profile.  
- **Owner:** product / core.  
- **STOP/GO:** **STOP** on any absolute zero-cost / free / offline marketing until the hard mode exists and is the documented default for free users.

### F-018 — Network surfaces: OpenAI, Stripe, local LM Studio, SMTP, webbrowser, optional xclip/xdotool
- **Claim:** System is fully offline / no external network.  
- **Evidence:** Explicit HTTP clients in cloud_bridge, billing (Stripe), email (SMTP), browser (open). Local loopback for LM Studio.  
- **Classification:** **VERIFIED** (network possible).  
- **Impact:** Privacy / Operational / Reliability (provider deprecation).  
- **Severity / Probability / Detectability:** HIGH / HIGH / HIGH.  
- **Falsification test:** Presence of the network call sites.  
- **Mitigation:** Document required network for cloud mode; provide fully offline profile that refuses all non-loopback.  
- **Owner:** core.  
- **STOP/GO:** STOP on “fully offline by default”.

---

## Additional card-required coverage (summary)

| Topic | Finding coverage | Notes |
|---|---|---|
| Provider deprecation / quota removal | F-001, F-002, F-003, F-018 | Local fallback mitigates but is not automatic hard default |
| Hidden non-monetary cost (CPU, storage, human time) | F-015, F-012 | Gates and OS tools consume local resources |
| DepthGuard bypass | not present in inspected Python surface; contracts exist under packages/contracts | out of static Python scope; defer to contracts review |
| Human bridge failure | card itself uses HUMAN_BRIDGE; packet returns via copy-paste | residual operational risk |
| Memory poisoning | memory tools exist; embed can be external | F-016 |
| Skill Forge escalation | skills.py + promote paths exist; not fully expanded here | residual |
| Progress / ETA gaming | ledger / accepted_weight remain 0 until reviewer | this packet respects it |

Simpler reversible alternatives offered: (1) force `MODEL_PROVIDER=local` + `UJ_ENFORCE_QUOTA=1` + no Stripe key as free profile; (2) ship a `zero_cost` entrypoint that refuses any non-local provider; (3) keep all dry-run defaults and never set the `*_REAL` / `UJ_EMAIL_UNSAFE` flags.

---

## Artifact integrity

This report is the primary deliverable. Its SHA-256 must be recorded in the ResponsePacket. No target Python was executed. No paid service was called during analysis. No secrets were read or written.

**STOP condition for product claims:** any marketing statement that the system is inherently zero-cost, free of billing risk, or fully offline is **not supported** by the code at `4b63b94edb03429eb4ea7be222feef37e95950b5` until the mitigations in F-017 are implemented and re-verified.

**GO condition for continued development:** local fallbacks, dry-runs, mocks, safe-mode, allow-lists and registry guards are real and useful; they form a solid base for a true zero-cost profile.

---

*End of ZERO_COST_FALSIFICATION_REPORT — UJ-RED-001 GROK at source_commit_sha 4b63b94edb03429eb4ea7be222feef37e95950b5*

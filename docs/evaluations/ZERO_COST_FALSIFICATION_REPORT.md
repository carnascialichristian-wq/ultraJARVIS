# ZERO_COST_FALSIFICATION_REPORT — UJ-RED-001 (GROK)

**Card:** UJ-CARD-RED-001-GROK  
**Task:** UJ-RED-001  
**Owner AI:** GROK  
**Reviewer AI:** CHATGPT  
**Weight:** 13 (accepted_weight remains 0 until independent review)  
**Target repository (exclusive):** https://github.com/carnascialichristian-wq/ultraJARVIS  
**source_commit_sha / read_ref (pinned, 40-hex):** `25b1b7d53ff5bc4b05348453ebb704aba3a88630`  
**Generated:** 2026-08-19T11:50:00Z (approx)  
**Analysis mode:** static only at exact read_ref (GitHub API + local checkout). **No** Python execution of target application code beyond validators, **no** paid API, **no** billing enablement, **no** browser/cookie/session automation, **no** secret values.  
**Status:** complete static falsification; packet proposes **REVIEW**

---

## Executive summary

At commit `25b1b7d53ff5bc4b05348453ebb704aba3a88630` the target contains **real paid-path surfaces** (OpenAI default in `cloud_bridge.py` / `core/config.py`, Stripe live path in `core/billing.py` when `STRIPE_SECRET_KEY` starts with `sk_`). Local fallbacks (LM Studio), dry-runs, SAFE_MODE, allow-lists and registry `safe` enforcement also exist. Quota and soft LLM budget are **opt-in**. There is **no hard zero-cost gate**. DepthGuard (TypeScript contracts) defines hard structural limits (depth 3, fan-out 5, active tasks 25) that are non-configurable by agents. Memory and Skill Forge surfaces exist and can be abused if not gated. Progress/ETA gaming is resisted by the Program OS ledger rules (accepted_weight never self-awarded).  

**Overall STOP/GO for absolute “zero-cost / free / offline / no-billing” claims:** **STOP** until a hard free-tier profile is implemented and re-verified. Local/dry-run paths are real and useful; they do not by themselves make the system zero-cost when keys are present.

Validators at this ref: `validate-program-os.mjs` **PASS**, `validate-council-packets.mjs` **PASS**. Local Python tests (separate tree) 243 green.

---

## Method

1. Checked out exact `25b1b7d53ff5bc4b05348453ebb704aba3a88630`.  
2. Retrieved / inspected: `cloud_bridge.py`, `core/billing.py`, `core/monetization.py`, `core/config.py`, `core/registry.py`, `core/gates.py`, `core/memory.py`, `core/skills.py`, `tools/browser.py`, `tools/email.py`, `tools/os_control.py`, `tools/automation.py`, `packages/contracts/src/runtime/depth-guard.ts`, `packages/contracts/src/skills/skill-forge.ts`, card, schema, validators.  
3. Ran `node scripts/validate-program-os.mjs` → PASS; `node scripts/validate-council-packets.mjs` → PASS.  
4. No target application LLM/billing paths executed; no paid services called.  
5. Findings classified VERIFIED / FALSE / PARTIAL / UNVERIFIED.

---

## Findings (F-001 … F-018)

### F-001 — Default LLM provider is OpenAI (paid path)
- **Claim:** System is zero-cost / paid-API free by default.  
- **Evidence:** `cloud_bridge.py`: `PROVIDER = os.getenv("MODEL_PROVIDER", "openai").lower()`; `core/config.py` defaults to openai.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic (token charges); Operational (network + key required).  
- **Severity / Probability / Detectability:** HIGH / HIGH (if key set) / HIGH.  
- **Falsification test:** `grep -n 'MODEL_PROVIDER\|openai' cloud_bridge.py core/config.py` at the SHA shows default `"openai"`.  
- **Mitigation:** Default to `"local"` or require explicit opt-in; free tier must force local.  
- **Owner:** core.  
- **STOP/GO:** STOP on “zero-cost by default”.

### F-002 — Real OpenAI calls when `OPENAI_API_KEY` present
- **Claim:** No paid API paths reachable.  
- **Evidence:** `_call_openai` uses `OpenAI(api_key=os.getenv("OPENAI_API_KEY"))` + `chat.completions.create`; same for embed.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic / Privacy.  
- **Severity / Probability / Detectability:** HIGH / MEDIUM / HIGH.  
- **Falsification test:** Static presence of OpenAI client call sites.  
- **Mitigation:** Hard refuse non-local unless `UJ_ALLOW_PAID=1` + positive soft budget.  
- **Owner:** cloud_bridge.  
- **STOP/GO:** STOP if product claims “no paid APIs possible”.

### F-003 — Local LM Studio fallback is implemented
- **Claim:** Local-only path is absent.  
- **Evidence:** `_call_local` posts to `LMSTUDIO_BASE` (default localhost:1234) when provider ≠ openai.  
- **Classification:** **VERIFIED**.  
- **Impact:** Positive for offline/zero-cost when used.  
- **Severity / Probability / Detectability:** LOW (cost) / HIGH / HIGH.  
- **Falsification test:** Code path for local `/v1/chat/completions`.  
- **Mitigation:** Document required local model; fail-closed health check when paid forbidden.  
- **Owner:** core.  
- **STOP/GO:** GO for “local fallback exists”.

### F-004 — Monetization tiers (free / pro / team) with different limits
- **Claim:** No subscription surface.  
- **Evidence:** `core/monetization.py` `plan_tiers()`: free (10 llm/day, llm=False), pro $29, team $99; `UJ_TIER`.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic / product model.  
- **Severity / Probability / Detectability:** MEDIUM / HIGH / HIGH.  
- **Falsification test:** Inspect `plan_tiers` / `current_tier`.  
- **Mitigation:** Enforce `llm=False` at call sites for free tier.  
- **Owner:** monetization.  
- **STOP/GO:** STOP on “no paid tiers”.

### F-005 — Quota enforcement is opt-in (`UJ_ENFORCE_QUOTA=1`)
- **Claim:** Hard daily limits always active.  
- **Evidence:** `check_*_quota` early-return unless env == "1".  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic (unlimited if key present).  
- **Severity / Probability / Detectability:** HIGH / HIGH / HIGH.  
- **Falsification test:** Guard on `UJ_ENFORCE_QUOTA`.  
- **Mitigation:** Default enforce for free tier.  
- **Owner:** monetization.  
- **STOP/GO:** STOP until default-on for free.

### F-006 — Soft LLM budget defaults disabled (`UJ_LLM_BUDGET_USD=0`)
- **Claim:** Soft budget always prevents overspend.  
- **Evidence:** `get_llm_budget` treats soft_cap <= 0 as ok.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic.  
- **Severity / Probability / Detectability:** HIGH / HIGH / HIGH.  
- **Falsification test:** Default 0 in code.  
- **Mitigation:** Require positive budget or hard zero for free.  
- **Owner:** monetization.  
- **STOP/GO:** STOP.

### F-007 — Stripe real path on `STRIPE_SECRET_KEY` starting with `sk_`
- **Claim:** Billing is mock-only.  
- **Evidence:** `core/billing.py` live urllib to api.stripe.com when key starts with sk_; else mock.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic / Legal (PCI).  
- **Severity / Probability / Detectability:** CRITICAL (if key) / LOW-MEDIUM / HIGH.  
- **Falsification test:** Branch on `key.startswith("sk_")`.  
- **Mitigation:** Require `UJ_BILLING_LIVE=1` + human approval; keep mock free path.  
- **Owner:** billing.  
- **STOP/GO:** STOP on “no billing possible”.

### F-008 — Real Stripe customer / checkout possible
- **Claim:** No live monetization actions.  
- **Evidence:** `create_customer` / `create_checkout_session` live when key present.  
- **Classification:** **VERIFIED**.  
- **Impact:** Economic / Legal.  
- **Severity / Probability / Detectability:** CRITICAL / LOW / HIGH.  
- **Falsification test:** Presence of Stripe API endpoints.  
- **Mitigation:** Same as F-007 + never-send dry-run even with key.  
- **Owner:** billing.  
- **STOP/GO:** STOP.

### F-009 — Secrets from env only; none hardcoded; .gitignore incomplete
- **Claim:** Credentials embedded in source.  
- **Evidence:** All inspected modules use `os.getenv`; no literal sk_/key assignments. `.gitignore` does not list `.env`.  
- **Classification:** **VERIFIED** (no hardcodes) / **PARTIAL** (gitignore).  
- **Impact:** Privacy / Security.  
- **Severity / Probability / Detectability:** HIGH if leaked / LOW for hardcode / HIGH.  
- **Falsification test:** `rg` for secret patterns empty; env reads confirmed.  
- **Mitigation:** Add `.env` / secrets patterns to `.gitignore`; secret scanning.  
- **Owner:** security / core.  
- **STOP/GO:** GO for no hardcodes; STOP until gitignore hardened.

### F-010 — Browser allow-listed + dry-run; no cookie/session automation
- **Claim:** Full browser automation / cookie harvesting.  
- **Evidence:** `tools/browser.py` fixed ALLOWLIST; real only if `UJ_BROWSER_REAL=1`; no selenium/cookie APIs.  
- **Classification:** **FALSE** (full automation) / **VERIFIED** (controlled open).  
- **Impact:** Privacy limited.  
- **Severity / Probability / Detectability:** LOW / LOW / HIGH.  
- **Falsification test:** Inspect ALLOWLIST + absence of headless drivers.  
- **Mitigation:** Keep; never enable real by default.  
- **Owner:** tools.  
- **STOP/GO:** GO for “no consumer UI / cookie automation”.

### F-011 — Email SAFE_MODE default; SMTP only if unlocked
- **Claim:** Unrestricted email.  
- **Evidence:** `tools/email.py` safe unless `UJ_EMAIL_UNSAFE=1`; SMTP_* required.  
- **Classification:** **VERIFIED**.  
- **Impact:** Privacy / spam risk only if unlocked.  
- **Severity / Probability / Detectability:** MEDIUM / LOW / HIGH.  
- **Falsification test:** Guard on env + SMTP presence.  
- **Mitigation:** Keep; rate-limit when unlocked.  
- **Owner:** tools.  
- **STOP/GO:** GO.

### F-012 — OS control / automation dry-run default; subprocess gated
- **Claim:** Arbitrary OS / unrestricted subprocess.  
- **Evidence:** `os_control.py` / `automation.py` gated by `UJ_OS_REAL` / `UJ_AUTO_REAL`; allow-lists.  
- **Classification:** **VERIFIED**.  
- **Impact:** Operational / Security limited.  
- **Severity / Probability / Detectability:** MEDIUM / LOW / HIGH.  
- **Falsification test:** Guards + `_ALLOWED_APPS`.  
- **Mitigation:** Keep.  
- **Owner:** tools.  
- **STOP/GO:** GO.

### F-013 — Registry enforces safe flag + blocks privileged kwargs
- **Claim:** Any tool callable with privilege escalation.  
- **Evidence:** `core/registry.py` `call()` raises on `not safe` or `force`/`root`.  
- **Classification:** **VERIFIED**.  
- **Impact:** Security positive.  
- **Severity / Probability / Detectability:** HIGH if bypassed / LOW / HIGH.  
- **Falsification test:** Code of PRIVILEGED_KWARGS + safe check.  
- **Mitigation:** Keep tests.  
- **Owner:** registry.  
- **STOP/GO:** GO.

### F-014 — DepthGuard hard limits exist and are non-agent-configurable
- **Claim:** Recursive agents can unbounded expand (DepthGuard bypass).  
- **Evidence:** `packages/contracts/src/runtime/depth-guard.ts`: maxDepth=3, maxFanOut=5, maxActiveAtomicTasks=25; “not configurable by any agent, under any circumstance”. Pure deterministic admission.  
- **Classification:** **VERIFIED** (controls present) / residual risk if Python runtime does not enforce the TS contracts.  
- **Impact:** Operational / cost / resource exhaustion.  
- **Severity / Probability / Detectability:** HIGH if bypassed / LOW (if contracts enforced) / HIGH.  
- **Falsification test:** Read DEPTH_GUARD_LIMITS and admission decision types; confirm no agent-writable override.  
- **Mitigation:** Wire Python runtime to the same hard limits; atomic active-task counter (noted in BINDING_CONSTRAINT_NOTE).  
- **Owner:** runtime (CLAUDE / contracts).  
- **STOP/GO:** GO for contract existence; STOP if runtime enforcement missing.

### F-015 — Memory poisoning surface (append-only JSONL, no integrity)
- **Claim:** Memory is tamper-proof.  
- **Evidence:** `core/memory.py` appends to `workspace/memory.jsonl` without signature/HMAC; recall is substring match. Embed path can call external provider.  
- **Classification:** **VERIFIED** (poisoning possible).  
- **Impact:** Integrity / privacy / decision pollution.  
- **Severity / Probability / Detectability:** MEDIUM / MEDIUM / MEDIUM.  
- **Falsification test:** Write crafted line to memory path; recall returns it.  
- **Mitigation:** Sign entries, scope by task/run, reject untrusted tags, force local embed on free.  
- **Owner:** memory.  
- **STOP/GO:** STOP until integrity controls exist for production memory.

### F-016 — Skill Forge / skills catalog can inject unvetted content
- **Claim:** Skills are always safe / vetted.  
- **Evidence:** `core/skills.py` stores name/description/content in `workspace/skills.json`; `packages/contracts/src/skills/skill-forge.ts` defines forge pipeline (sandbox contract exists in docs). Python path has no automatic sandbox gate on load.  
- **Classification:** **PARTIAL**.  
- **Impact:** Supply-chain / code injection if content executed.  
- **Severity / Probability / Detectability:** HIGH / MEDIUM / MEDIUM.  
- **Falsification test:** Add skill with executable-looking content; confirm no automatic sandbox at Python layer.  
- **Mitigation:** Enforce Skill Forge sandbox + admission before promote; never exec skill content without review.  
- **Owner:** skills / CLAUDE (UJ-SKL-001).  
- **STOP/GO:** STOP for unvetted promote paths.

### F-017 — No global hard zero-cost gate; cost is environment-dependent
- **Claim:** System cannot incur additional monetary cost.  
- **Evidence:** Union of F-001, F-002, F-005, F-006, F-007.  
- **Classification:** **FALSE** (absolute claim) / **PARTIAL** (local+dry-run+mock exist).  
- **Impact:** Economic / Legal (false advertising).  
- **Severity / Probability / Detectability:** HIGH / HIGH / HIGH.  
- **Falsification test:** Paid call sites + absence of hard free-tier refuse.  
- **Mitigation:** Introduce `UJ_ZERO_COST=1` profile (local only, no live Stripe, quotas on, budgets 0).  
- **Owner:** product / core.  
- **STOP/GO:** **STOP** on absolute zero-cost marketing.

### F-018 — Progress / ETA gaming resisted by ledger rules; Human Bridge residual
- **Claim:** Progress/ETA can be gamed by self-award or fake DONE.  
- **Evidence:** Program OS validator enforces completed_weight ≤ weight, DONE requires proof, REVIEW tasks keep completed_weight=0, reviewer ≠ owner for critical tasks. Human Bridge is the only allowed mode for this card; residual operational risk if bridge fails.  
- **Classification:** **VERIFIED** (anti-gaming rules present).  
- **Impact:** Program integrity.  
- **Severity / Probability / Detectability:** HIGH if gamed / LOW (validator) / HIGH.  
- **Falsification test:** Attempt self-award in BACKLOG → validator fails; ResponsePacket cannot propose DONE.  
- **Mitigation:** Keep importer checks; never trust branch presence alone for weight.  
- **Owner:** Program OS / CHATGPT importer.  
- **STOP/GO:** GO for anti-gaming design; residual STOP if importer skips hash/schema checks.

---

## Additional required coverage

| Topic | Coverage | Notes |
|---|---|---|
| Provider deprecation / quota removal | F-001–F-003, F-018 | Local fallback mitigates; not automatic hard default |
| Hidden non-monetary cost | F-012, gates, DepthGuard | CPU / local resources |
| DepthGuard bypass | F-014 | Hard limits in contracts; wire to runtime |
| Human Bridge failure | F-018 + card allowed_modes | Residual operational |
| Memory poisoning | F-015 | Append-only without integrity |
| Skill Forge escalation | F-016 | Sandbox contract exists; Python path weaker |
| Supply-chain | F-016, registry, skills | Unvetted content risk |
| Progress / ETA gaming | F-018 | Ledger + reviewer separation resist |

**Simpler reversible alternatives:** (1) `MODEL_PROVIDER=local` + `UJ_ENFORCE_QUOTA=1` + no Stripe key as free profile; (2) `UJ_ZERO_COST=1` entrypoint that refuses non-local; (3) keep all dry-run defaults; never set `*_REAL` / `UJ_EMAIL_UNSAFE` in free profiles.

---

## Artifact integrity & commands run

```text
read_ref / source_commit_sha = 25b1b7d53ff5bc4b05348453ebb704aba3a88630
node scripts/validate-program-os.mjs     → PASS
node scripts/validate-council-packets.mjs → PASS
```

No target application LLM/billing paths executed. No paid service called. No secrets read/written.

**STOP** on absolute zero-cost / free / offline product claims until F-017 mitigations land.  
**GO** for continued development of local/dry-run/mock/safe-mode/DepthGuard foundations.

*End of report — UJ-RED-001 GROK at 25b1b7d53ff5bc4b05348453ebb704aba3a88630*

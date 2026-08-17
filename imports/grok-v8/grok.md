# Grok Continuity — UltraJarvis_v8

**Grok working repo:** https://github.com/carnascialichristian-wq/UltraJarvis_v8-grok  
**Original repo:** https://github.com/mootmoot1/UltraJarvis_v8  
**Local path:** `/home/workdir/artifacts/UltraJarvis_v8`

## Primary rules (MUST follow every session)
1. At the **end of every work session or task**, update:
   - `docs/GROK_CONTINUITY.md` (this file — preferred, stable)
   - `grok.md` (may get wiped by environment — always rewrite)
   - `taskgrok.md` (detailed hand-off for other AIs)
2. Keep all tests green. Prefer extending existing modules over rewrites.
3. Continue autonomous work until the user message contains **stop**.

## Secondary rule
Before starting new work, always re-read:
- `docs/GROK_CONTINUITY.md`
- `taskgrok.md`
- `docs/DEVELOPER.md` (if present)
- Current test count and `bin/uj tools`

## Current state (2026-08-17 ~14:00 CEST)
- **206 tests passed**
- **135 tools** registered in `core/registry.py`
- Pipeline E2E: seed → run → plan (registry-aware) → write (heuristics) → gates → critic/safety/style
- CLI: health, status, seed, run, tools, memory, skills, snapshot, promote
- Advisors: critic (suggests `uj promote`), safety, style
- PROTECTED expanded; memory.list_tags added
- Git: local commits on main; push often blocked — prefer local + continuity files

## What was completed (this session)
- NaturalTaskRunner heuristics: gcd, clamp, mean, slugify, reverse_words, unique, flatten (+ prior)
- promote_job_to_tools + uj promote
- Planner surfaces matching registry tools
- Critic suggests promote; PROTECTED expanded
- memory.list_tags + registry entry
- Prefer quality and integration over more helper stubs

## Remaining (priority order)
1. Real gates when ruff/black available
2. Optional auto-register after promote; richer planner↔catalog
3. Phase 2: deeper memory, advisors, better LLM adapters
4. Retry GitHub push when connector works
5. Avoid unbounded helper explosion

## How to continue
1. Open/clone or work in `/home/workdir/artifacts/UltraJarvis_v8`
2. Read this file + `taskgrok.md`
3. Run `python -m pytest -q` and `python bin/uj tools`
4. Pick next remaining item, implement + tests, keep suite green
5. Update continuity files at the end

*Last updated: 2026-08-17 by Grok*

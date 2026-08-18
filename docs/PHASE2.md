# Phase 2 roadmap

## Done
- [x] core/memory.py – JSONL facts
- [x] advisors/critic.py
- [x] advisors/safety.py
- [x] uj memory / snapshot / skills
- [x] Planner LLM adapter (`UJ_PLANNER_LLM=1`)
- [x] Writer LLM adapter (`UJ_WRITER_LLM=1`, safety-scanned)
- [x] Real gates (py_compile / ruff / black / pytest)
- [x] Embedding-style recall (`recall_semantic` TF-cosine, no external model)
- [x] Multi-file job support with deps.json dependency graph
- [x] Advisor style richer (naming, bare except, type hints, wildcard)
- [x] Multi-agent debate loop (`advisors/debate.py`)
- [x] Monetization prep (`core/monetization.py` usage metering + tiers)

## Later (optional)
- External embedding provider behind UJ_EMBEDDING
- Deeper multi-file dependency execution order
- Billing provider integration

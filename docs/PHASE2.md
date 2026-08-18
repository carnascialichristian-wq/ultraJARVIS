# Phase 2 roadmap (in progress)

## Done
- [x] core/memory.py – JSONL facts
- [x] advisors/critic.py
- [x] advisors/safety.py
- [x] uj memory / snapshot / skills
- [x] Planner LLM adapter behind cloud_bridge (opt-in `UJ_PLANNER_LLM=1`)
- [x] Writer LLM adapter behind cloud_bridge (opt-in `UJ_WRITER_LLM=1`, safety-scanned)

## Next
- [ ] Embedding-backed recall (optional, needs model)
- [ ] Multi-file job support with dependency graph
- [ ] Advisor: style (docstrings, naming)
- [ ] Real gates when ruff/black available

## Later
- Monetization prep
- Multi-agent debate loop

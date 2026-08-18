#!/usr/bin/env python3
"""Unified CLI for UltraJarvis."""

from __future__ import annotations

import argparse
import json


def cmd_job(args):
    from core.natural_tasks import NaturalTaskRunner
    runner = NaturalTaskRunner(use_real_gates=not args.stub_gates)
    summary = runner.build_and_run(args.prompt)
    print(json.dumps({k: summary[k] for k in ("job_id", "status", "title", "written_files") if k in summary}, indent=2))
    return 0 if summary.get("status") == "PASS" else 1


def cmd_search(args):
    from tools.websearch import search
    for r in search(args.query, limit=args.limit):
        print(f"- {r.get('title')}\n  {r.get('url')}")
    return 0


def cmd_usage(args):
    from core.monetization import summarize_usage, get_llm_budget, current_tier
    print("tier:", current_tier()["id"])
    print("usage:", json.dumps(summarize_usage(), indent=2))
    print("llm_budget:", json.dumps(get_llm_budget(), indent=2))
    return 0


def cmd_memory(args):
    from core.memory import recall, recall_semantic, remember
    if args.remember:
        print(remember(args.remember, tags=(args.tags or "").split(",") if args.tags else None))
        return 0
    hits = recall_semantic(args.query or "", limit=args.limit) if args.semantic else recall(args.query or "", limit=args.limit)
    print(json.dumps(hits, indent=2, ensure_ascii=False))
    return 0


def cmd_graph(args):
    from core.graph_exec import execute_graph
    out = execute_graph(args.job_dir)
    print(json.dumps(out, indent=2, default=str))
    return 0 if out.get("ok") else 1


def main(argv=None):
    p = argparse.ArgumentParser(prog="uj", description="UltraJarvis CLI")
    sub = p.add_subparsers(dest="cmd", required=True)
    j = sub.add_parser("job"); j.add_argument("prompt"); j.add_argument("--stub-gates", action="store_true"); j.set_defaults(func=cmd_job)
    s = sub.add_parser("search"); s.add_argument("query"); s.add_argument("-n", "--limit", type=int, default=5); s.set_defaults(func=cmd_search)
    u = sub.add_parser("usage"); u.set_defaults(func=cmd_usage)
    m = sub.add_parser("memory"); m.add_argument("-q", "--query", default=""); m.add_argument("--remember", default=""); m.add_argument("--tags", default=""); m.add_argument("--semantic", action="store_true"); m.add_argument("-n", "--limit", type=int, default=10); m.set_defaults(func=cmd_memory)
    g = sub.add_parser("graph"); g.add_argument("job_dir"); g.set_defaults(func=cmd_graph)
    args = p.parse_args(argv)
    return int(args.func(args))


if __name__ == "__main__":
    raise SystemExit(main())

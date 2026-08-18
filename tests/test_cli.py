"""Tests for uj_cli."""

from __future__ import annotations

import uj_cli


def test_cli_usage(capsys):
    assert uj_cli.main(["usage"]) == 0
    assert "tier" in capsys.readouterr().out


def test_cli_search(capsys):
    assert uj_cli.main(["search", "python", "-n", "1"]) == 0

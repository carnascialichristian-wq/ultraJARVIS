"""Tests for core.skills."""

from __future__ import annotations

from pathlib import Path

import pytest

from core.skills import add_skill, find_skill, list_skills


def test_add_and_find(tmp_path: Path):
    skills_file = tmp_path / "skills.json"
    add_skill(
        "retry-helper",
        "Adds exponential backoff retries",
        tags=["reliability", "core"],
        path=skills_file,
    )
    found = find_skill("retry", path=skills_file)
    assert len(found) == 1
    assert found[0]["name"] == "retry-helper"


def test_list_empty(tmp_path: Path):
    skills_file = tmp_path / "skills.json"
    assert list_skills(path=skills_file) == []


def test_replace_same_name(tmp_path: Path):
    skills_file = tmp_path / "skills.json"
    add_skill("foo", "old", path=skills_file)
    add_skill("foo", "new", path=skills_file)
    all_skills = list_skills(path=skills_file)
    assert len(all_skills) == 1
    assert all_skills[0]["description"] == "new"

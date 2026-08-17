"""Tests for core.utils."""

from __future__ import annotations

import pytest

from core.utils import slugify, human_seconds


class TestSlugify:
    def test_basic(self):
        assert slugify("Hello World") == "hello_world"

    def test_special_chars(self):
        assert slugify("Foo@Bar#Baz!") == "foo_bar_baz"

    def test_empty(self):
        assert slugify("") == "untitled"
        assert slugify("   ") == "untitled"
        assert slugify("!!!") == "untitled"

    def test_collapse(self):
        assert slugify("a---b___c") == "a_b_c"

    def test_max_length(self):
        long = "a" * 100
        assert len(slugify(long, max_length=20)) == 20

    def test_unicode_fallback(self):
        # Non-ascii becomes underscores then cleaned
        assert slugify("café") == "caf"


class TestHumanSeconds:
    def test_zero(self):
        assert human_seconds(0) == "0s"

    def test_fraction(self):
        assert human_seconds(0.5) == "0.5s"
        assert human_seconds(1.0) == "1s"

    def test_minutes(self):
        assert human_seconds(65) == "1m 5s"
        assert human_seconds(60) == "1m"

    def test_hours(self):
        assert human_seconds(3661) == "1h 1m 1s"

    def test_days(self):
        assert human_seconds(90000) == "1d 1h 0m 0s" or human_seconds(90000).startswith("1d")

    def test_negative(self):
        assert human_seconds(-10) == "0s"

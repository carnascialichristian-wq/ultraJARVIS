"""Tests for string helpers."""
from tools.string_helpers import slugify_basic, reverse_words

def test_slugify():
    assert slugify_basic("Hello World!") == "hello_world"

def test_reverse_words():
    assert reverse_words("a b c") == "c b a"

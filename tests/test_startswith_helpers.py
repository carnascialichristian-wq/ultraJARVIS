from tools.startswith_helpers import starts_with, ends_with

def test_starts_ends():
    assert starts_with("hello", "he")
    assert ends_with("hello", "lo")

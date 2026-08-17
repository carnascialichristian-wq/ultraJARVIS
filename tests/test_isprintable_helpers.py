from tools.isprintable_helpers import is_printable

def test_printable():
    assert is_printable("hello")
    assert not is_printable("a\x00b")

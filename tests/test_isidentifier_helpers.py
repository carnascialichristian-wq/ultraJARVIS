from tools.isidentifier_helpers import is_identifier

def test_ident():
    assert is_identifier("foo_bar")
    assert not is_identifier("1foo")

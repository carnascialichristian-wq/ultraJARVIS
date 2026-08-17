from tools.removeprefix_helpers import remove_prefix, remove_suffix

def test_remove():
    assert remove_prefix("foobar", "foo") == "bar"
    assert remove_suffix("foobar", "bar") == "foo"

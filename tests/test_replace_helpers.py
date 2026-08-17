from tools.replace_helpers import replace

def test_replace():
    assert replace("a-b-a", "a", "x") == "x-b-x"

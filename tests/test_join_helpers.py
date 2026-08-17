from tools.join_helpers import join

def test_join():
    assert join(["a", "b"], "-") == "a-b"

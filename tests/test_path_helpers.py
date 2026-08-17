from tools.path_helpers import join_posix, extension

def test_join():
    assert join_posix("a", "b", "c.txt") == "a/b/c.txt"

def test_ext():
    assert extension("Foo.PY") == ".py"

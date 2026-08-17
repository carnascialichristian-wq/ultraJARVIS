from tools.inc_helpers import inc, dec

def test_inc_dec():
    assert inc(5) == 6
    assert dec(5) == 4
    assert inc(5, 3) == 8

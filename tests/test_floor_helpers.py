from tools.floor_helpers import floor, ceil

def test_floor_ceil():
    assert floor(3.7) == 3
    assert ceil(3.2) == 4

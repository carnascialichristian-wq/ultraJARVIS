from tools.id_helpers import new_uuid4, is_uuid_like

def test_uuid():
    u = new_uuid4()
    assert is_uuid_like(u)
    assert not is_uuid_like("nope")

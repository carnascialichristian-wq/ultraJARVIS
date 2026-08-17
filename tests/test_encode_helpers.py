from tools.encode_helpers import to_bytes, from_bytes

def test_encode():
    b = to_bytes("hi")
    assert from_bytes(b) == "hi"

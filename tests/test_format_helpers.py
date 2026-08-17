from tools.format_helpers import format_map

def test_format():
    assert format_map("hi {name}", name="bob") == "hi bob"

from tools.isupper_helpers import is_upper, is_lower, is_title

def test_case_check():
    assert is_upper("ABC")
    assert is_lower("abc")
    assert is_title("Hello World")
    assert not is_title("hello world")
    assert not is_title("HELLO WORLD")

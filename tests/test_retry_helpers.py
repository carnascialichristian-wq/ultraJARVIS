from tools.retry_helpers import retryable

def test_retry_success():
    state = {"n": 0}
    @retryable(max_attempts=3)
    def flaky():
        state["n"] += 1
        if state["n"] < 2:
            raise ValueError("fail")
        return "ok"
    assert flaky() == "ok"
    assert state["n"] == 2

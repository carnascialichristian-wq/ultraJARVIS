"""Retry helper."""
from __future__ import annotations
from typing import Callable, TypeVar

F = TypeVar("F", bound=Callable)

def retryable(max_attempts: int = 3) -> Callable[[F], F]:
    def deco(fn: F) -> F:
        def wrapper(*args, **kwargs):
            last = None
            for _ in range(max(1, max_attempts)):
                try:
                    return fn(*args, **kwargs)
                except Exception as e:
                    last = e
            raise last  # type: ignore
        return wrapper  # type: ignore
    return deco

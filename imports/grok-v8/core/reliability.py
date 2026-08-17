"""Reliability helpers: retries, safe writes, timeouts."""

from __future__ import annotations

import functools
import time
from pathlib import Path
from typing import Any, Callable, Optional, TypeVar, Union

F = TypeVar("F", bound=Callable[..., Any])


def retry(
    max_attempts: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: tuple = (Exception,),
) -> Callable[[F], F]:
    """Decorator that retries a function on failure."""

    def decorator(fn: F) -> F:
        @functools.wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            last_exc: Optional[BaseException] = None
            wait = delay
            for attempt in range(1, max_attempts + 1):
                try:
                    return fn(*args, **kwargs)
                except exceptions as exc:
                    last_exc = exc
                    if attempt == max_attempts:
                        break
                    time.sleep(wait)
                    wait *= backoff
            assert last_exc is not None
            raise last_exc

        return wrapper  # type: ignore

    return decorator


def safe_write(
    path: Union[str, Path],
    content: str,
    *,
    encoding: str = "utf-8",
) -> Path:
    """Atomic write: write to .tmp then rename."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(content, encoding=encoding)
    tmp.replace(path)
    return path


def with_timeout(seconds: float) -> Callable[[F], F]:
    """Simple timeout decorator (best-effort, not hard kill)."""

    def decorator(fn: F) -> F:
        @functools.wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Placeholder – real impl would use signal/thread
            return fn(*args, **kwargs)

        return wrapper  # type: ignore

    return decorator

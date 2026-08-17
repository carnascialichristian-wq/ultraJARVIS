"""Configuration loader for UltraJarvis.

Loads values from environment variables / .env file with sensible defaults.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


def _load_dotenv(path: Path = Path(".env")) -> None:
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        os.environ.setdefault(key, val)


@dataclass
class Config:
    model_provider: str = "openai"
    model_name: str = "gpt-4o-mini"
    workspace: Path = field(default_factory=lambda: Path("workspace"))
    safe_mode: bool = True
    log_level: str = "INFO"

    @classmethod
    def from_env(cls) -> "Config":
        _load_dotenv()
        return cls(
            model_provider=os.getenv("MODEL_PROVIDER", "openai"),
            model_name=os.getenv("MODEL_NAME", "gpt-4o-mini"),
            workspace=Path(os.getenv("UJ_WORKSPACE", "workspace")),
            safe_mode=os.getenv("SAFE_MODE", "1") not in ("0", "false", "False"),
            log_level=os.getenv("LOG_LEVEL", "INFO"),
        )


_config: Optional[Config] = None


def get_config(reload: bool = False) -> Config:
    global _config
    if _config is None or reload:
        _config = Config.from_env()
    return _config

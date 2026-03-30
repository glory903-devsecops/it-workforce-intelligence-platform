import asyncio
import importlib
import sys
from pathlib import Path

import pytest

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

@pytest.fixture(scope="function")
def client(monkeypatch, tmp_path):
    sqlite_file = tmp_path / "test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite+aiosqlite:///{sqlite_file}")

    for module_name in [
        "app.main",
        "app.models",
        "app.schemas",
        "app.crud",
        "app.database",
    ]:
        if module_name in sys.modules:
            del sys.modules[module_name]

    import app.database as database
    import app.main as main
    import app.models as models

    async def setup_db() -> None:
        async with database.engine.begin() as conn:
            await conn.run_sync(database.Base.metadata.create_all)
        await main.seed_initial_data()

    asyncio.run(setup_db())

    from fastapi.testclient import TestClient

    with TestClient(main.app) as client:
        yield client

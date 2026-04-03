"""Test fixtures for MIDAS SW Sales Workforce Intelligence Platform."""

import asyncio
import importlib
import sys
from pathlib import Path

import pytest

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


@pytest.fixture(scope="function")
def client(monkeypatch, tmp_path):
    """Create a fresh database & FastAPI TestClient for each test function."""
    sqlite_file = tmp_path / "test.db"
    monkeypatch.setenv("DATABASE_URL", f"sqlite+aiosqlite:///{sqlite_file}")

    # Forcefully purge all cached app modules so the new DATABASE_URL is picked up
    modules_to_remove = [key for key in sys.modules if key.startswith("app")]
    for mod in modules_to_remove:
        del sys.modules[mod]

    # Re-import freshly
    import app.database as database
    import app.models as models  # noqa: F811
    import app.main as main

    async def setup_db() -> None:
        async with database.engine.begin() as conn:
            await conn.run_sync(database.Base.metadata.create_all)
        async with database.async_session() as session:
            from app.use_cases import seed_initial_data
            await seed_initial_data(session, skip_task_logs=True)

    asyncio.run(setup_db())

    from fastapi.testclient import TestClient
    with TestClient(main.app) as test_client:
        yield test_client

    # Cleanup: dispose engine to close all connections
    asyncio.run(database.engine.dispose())

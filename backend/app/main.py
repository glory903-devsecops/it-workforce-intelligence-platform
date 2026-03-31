from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import router
from .use_cases import seed_initial_data as use_case_seed_initial_data
from .context7 import Context7

app = FastAPI(
    title="IT Workforce Intelligence Platform API",
    description="FastAPI backend for task log, quality monitoring, and budget forecast",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

async def seed_initial_data():
    return await use_case_seed_initial_data()

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_initial_data()

    app.state.context7 = Context7(user="system", team="default", project="workspace")


@app.get("/status")
async def status_check():
    return {"status": "ok", "service": "it-workforce-intelligence-api"}




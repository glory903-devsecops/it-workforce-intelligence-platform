"""FastAPI application entry point — MIDAS SW Sales Workforce Intelligence Platform."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, async_session
from .routers import router
from .use_cases import seed_initial_data

app = FastAPI(
    title="MIDAS SW Sales Workforce Intelligence API",
    description="마이다스 SW 영업 인력 리소스 분석 및 2026 예산 예측 플랫폼 API",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        await seed_initial_data(session)


@app.get("/status")
async def status_check():
    return {"status": "ok", "service": "midas-sw-sales-workforce-api"}

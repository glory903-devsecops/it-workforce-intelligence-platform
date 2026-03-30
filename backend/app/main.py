from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from . import crud, models, schemas
from .database import Base, async_session, get_async_session, engine

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

async def seed_initial_data() -> None:
    async with async_session() as db:
        result = await db.execute(select(models.Domain).limit(1))
        if result.scalars().first() is not None:
            return

        infrastructure = models.Domain(name="Infrastructure Operations", description="인프라 운영 중요 업무")
        application = models.Domain(name="Application Operations", description="애플리케이션 운영 주요 업무")
        security = models.Domain(name="Security Operations", description="보안 운영 업무")
        project = models.Domain(name="Project & Change Management", description="프로젝트 및 변경 관리")

        db.add_all([infrastructure, application, security, project])
        await db.flush()

        server_management = models.Capability(domain=infrastructure, name="Server Management", description="서버 관리")
        db_admin = models.Capability(domain=application, name="DB Administration", description="데이터베이스 운영")
        firewall = models.Capability(domain=security, name="Firewall Operations", description="방화벽 관리")
        release_management = models.Capability(domain=project, name="Release Management", description="배포 및 릴리스 관리")

        activities = [
            models.Activity(capability=server_management, name="서버 패치", description="서버 패치 수행"),
            models.Activity(capability=db_admin, name="DB 성능 점검", description="데이터베이스 성능 점검"),
            models.Activity(capability=firewall, name="방화벽 정책 변경", description="방화벽 정책 수정"),
            models.Activity(capability=release_management, name="배포 수행", description="배포 작업 수행"),
        ]

        work_types = [
            models.WorkType(name="BAU", description="일상 운영"),
            models.WorkType(name="INCIDENT", description="장애 대응"),
            models.WorkType(name="REQUEST", description="요청 처리"),
            models.WorkType(name="CHANGE", description="변경 작업"),
            models.WorkType(name="PROJECT", description="프로젝트"),
            models.WorkType(name="IMPROVEMENT", description="개선"),
            models.WorkType(name="GOVERNANCE", description="거버넌스"),
            models.WorkType(name="VENDOR", description="협력사 관리"),
        ]

        systems = [
            models.System(name="ERP 시스템", description="주요 ERP 시스템"),
            models.System(name="CRM 시스템", description="고객 관리 시스템"),
            models.System(name="인프라 모니터링", description="서버 및 네트워크 모니터링"),
        ]

        department = models.Department(name="IT 운영", description="IT 운영 조직")
        team = models.Team(name="인프라팀", department=department)
        employees = [
            models.Employee(name="홍길동", workforce_type="정규직", team=team),
            models.Employee(name="김영희", workforce_type="계약직", team=team),
        ]

        db.add_all([server_management, db_admin, firewall, release_management] + activities + work_types + systems + [department, team] + employees)
        await db.commit()


@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_initial_data()

@app.get("/")
async def health_check():
    return {"status": "ok", "service": "it-workforce-intelligence-api"}

@app.post("/task-logs", response_model=schemas.TaskLogRead)
async def create_task_log(task_log: schemas.TaskLogCreate, db: AsyncSession = Depends(get_async_session)):
    return await crud.create_task_log(db, task_log)

@app.post("/task-logs/validate", response_model=list[schemas.QualityIssueResult])
async def validate_task_log(task_log: schemas.TaskLogCreate, db: AsyncSession = Depends(get_async_session)):
    return await crud.validate_task_log(db, task_log)

@app.get("/task-logs", response_model=list[schemas.TaskLogRead])
async def list_task_logs(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_async_session)):
    return await crud.get_task_logs(db, skip, limit)

@app.get("/domains", response_model=list[schemas.DomainRead])
async def list_domains(db: AsyncSession = Depends(get_async_session)):
    return await crud.get_master_items(db, models.Domain)

@app.get("/capabilities", response_model=list[schemas.CapabilityRead])
async def list_capabilities(db: AsyncSession = Depends(get_async_session)):
    return await crud.get_master_items(db, models.Capability)

@app.get("/activities", response_model=list[schemas.ActivityRead])
async def list_activities(db: AsyncSession = Depends(get_async_session)):
    return await crud.get_master_items(db, models.Activity)

@app.get("/work-types", response_model=list[schemas.WorkTypeRead])
async def list_work_types(db: AsyncSession = Depends(get_async_session)):
    return await crud.get_master_items(db, models.WorkType)

@app.get("/systems", response_model=list[schemas.SystemRead])
async def list_systems(db: AsyncSession = Depends(get_async_session)):
    return await crud.get_master_items(db, models.System)

@app.get("/teams", response_model=list[schemas.TeamRead])
async def list_teams(db: AsyncSession = Depends(get_async_session)):
    return await crud.get_master_items(db, models.Team)

@app.get("/employees", response_model=list[schemas.EmployeeRead])
async def list_employees(db: AsyncSession = Depends(get_async_session)):
    return await crud.get_master_items(db, models.Employee)

@app.post("/budget-forecasts", response_model=schemas.BudgetForecastRead)
async def create_budget_forecast(
    forecast: schemas.BudgetForecastCreate,
    db: AsyncSession = Depends(get_async_session),
):
    return await crud.create_budget_forecast(db, forecast)

@app.get("/budget-forecasts", response_model=list[schemas.BudgetForecastRead])
async def list_budget_forecasts(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_async_session)):
    return await crud.get_budget_forecasts(db, skip, limit)

@app.get("/data-quality-issues", response_model=list[schemas.DataQualityIssueRead])
async def list_data_quality_issues(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_async_session)):
    return await crud.get_data_quality_issues(db, skip, limit)

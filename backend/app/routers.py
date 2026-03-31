from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from . import models, schemas
from .database import get_async_session
from .repository import get_master_items, get_task_logs, get_data_quality_issues, get_budget_forecasts
from .use_cases import create_task_log, validate_task_log, create_budget_forecast

router = APIRouter()

@router.get("/", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "it-workforce-intelligence-api"}


@router.post("/task-logs", response_model=schemas.TaskLogRead, tags=["task-log"])
async def post_task_log(task_log: schemas.TaskLogCreate, db: AsyncSession = Depends(get_async_session)):
    return await create_task_log(db, task_log)


@router.post("/task-logs/validate", response_model=list[schemas.QualityIssueResult], tags=["task-log"])
async def post_validate_task_log(task_log: schemas.TaskLogCreate, db: AsyncSession = Depends(get_async_session)):
    return await validate_task_log(db, task_log)


@router.get("/task-logs", response_model=list[schemas.TaskLogRead], tags=["task-log"])
async def get_task_logs_endpoint(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_async_session)):
    return await get_task_logs(db, skip, limit)


@router.get("/domains", response_model=list[schemas.DomainRead], tags=["metadata"])
async def get_domains(db: AsyncSession = Depends(get_async_session)):
    return await get_master_items(db, models.Domain)


@router.get("/capabilities", response_model=list[schemas.CapabilityRead], tags=["metadata"])
async def get_capabilities(db: AsyncSession = Depends(get_async_session)):
    return await get_master_items(db, models.Capability)


@router.get("/activities", response_model=list[schemas.ActivityRead], tags=["metadata"])
async def get_activities(db: AsyncSession = Depends(get_async_session)):
    return await get_master_items(db, models.Activity)


@router.get("/work-types", response_model=list[schemas.WorkTypeRead], tags=["metadata"])
async def get_work_types(db: AsyncSession = Depends(get_async_session)):
    return await get_master_items(db, models.WorkType)


@router.get("/systems", response_model=list[schemas.SystemRead], tags=["metadata"])
async def get_systems(db: AsyncSession = Depends(get_async_session)):
    return await get_master_items(db, models.System)


@router.get("/teams", response_model=list[schemas.TeamRead], tags=["metadata"])
async def get_teams(db: AsyncSession = Depends(get_async_session)):
    return await get_master_items(db, models.Team)


@router.get("/employees", response_model=list[schemas.EmployeeRead], tags=["metadata"])
async def get_employees(db: AsyncSession = Depends(get_async_session)):
    return await get_master_items(db, models.Employee)


@router.get("/data-quality-issues", response_model=list[schemas.DataQualityIssueRead], tags=["quality"])
async def get_data_quality_issues_endpoint(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_async_session)):
    return await get_data_quality_issues(db, skip, limit)


@router.get("/budget-forecasts", response_model=list[schemas.BudgetForecastRead], tags=["budget"])
async def get_budget_forecasts_endpoint(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_async_session)):
    return await get_budget_forecasts(db, skip, limit)

"""FastAPI routers — MIDAS SW Sales Workforce Intelligence Platform."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from . import models, schemas
from .database import get_async_session
from .ax_sales_logic import predict_sales_taxonomy, AXResult
from .repository import (
    get_master_items, get_task_logs, get_data_quality_issues, get_budget_forecasts,
    count_employees, count_task_logs, sum_task_hours, count_quality_issues,
    get_distinct_regions, get_budget_total_cost,
    get_hours_by_region, get_monthly_trend, get_work_type_distribution,
    get_domain_distribution,
)
from .use_cases import (
    create_task_log, validate_task_log, create_budget_forecast,
    generate_2026_budget, DEFAULT_HOURLY_RATES,
)

router = APIRouter()


# ── Health ──────────────────────────────────────────────────────────────
@router.get("/", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "midas-sw-sales-workforce-api"}


# ── Task Logs ───────────────────────────────────────────────────────────
@router.post("/task-logs", response_model=schemas.TaskLogRead, tags=["task-log"])
async def post_task_log(task_log: schemas.TaskLogCreate, db: AsyncSession = Depends(get_async_session)):
    return await create_task_log(db, task_log)


@router.post("/task-logs/validate", response_model=list[schemas.QualityIssueResult], tags=["task-log"])
async def post_validate_task_log(task_log: schemas.TaskLogCreate, db: AsyncSession = Depends(get_async_session)):
    return await validate_task_log(db, task_log)


@router.get("/task-logs", response_model=list[schemas.TaskLogRead], tags=["task-log"])
async def get_task_logs_endpoint(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_async_session)):
    return await get_task_logs(db, skip, limit)


# ── Metadata ────────────────────────────────────────────────────────────
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


# ── Quality ─────────────────────────────────────────────────────────────
@router.get("/data-quality-issues", response_model=list[schemas.DataQualityIssueRead], tags=["quality"])
async def get_data_quality_issues_endpoint(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_async_session)):
    return await get_data_quality_issues(db, skip, limit)


# ── Budget Forecasts ────────────────────────────────────────────────────
@router.get("/budget-forecasts", response_model=list[schemas.BudgetForecastRead], tags=["budget"])
async def get_budget_forecasts_endpoint(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_async_session)):
    return await get_budget_forecasts(db, skip, limit)


@router.post("/budget-forecasts", response_model=schemas.BudgetForecastRead, tags=["budget"])
async def post_budget_forecast(forecast: schemas.BudgetForecastCreate, db: AsyncSession = Depends(get_async_session)):
    return await create_budget_forecast(db, forecast)


@router.post("/budget-forecasts/generate-2026", tags=["budget"])
async def post_generate_2026_budget(db: AsyncSession = Depends(get_async_session)):
    count = await generate_2026_budget(db)
    return {"message": f"2026 예산 {count}건이 생성되었습니다.", "count": count}


# ── Dashboard ───────────────────────────────────────────────────────────
@router.get("/dashboard/summary", response_model=schemas.DashboardSummary, tags=["dashboard"])
async def get_dashboard_summary(db: AsyncSession = Depends(get_async_session)):
    total_emp = await count_employees(db)
    total_logs = await count_task_logs(db)
    total_hours = await sum_task_hours(db)
    total_regions = await get_distinct_regions(db)
    quality_count = await count_quality_issues(db)
    budget_total = await get_budget_total_cost(db)

    avg_hours = total_hours / total_emp if total_emp > 0 else 0
    return schemas.DashboardSummary(
        total_employees=total_emp,
        total_task_logs=total_logs,
        total_hours=round(total_hours, 1),
        total_regions=total_regions,
        avg_hours_per_employee=round(avg_hours, 1),
        quality_issues_count=quality_count,
        budget_forecast_total=round(budget_total, 0),
    )


@router.get("/dashboard/by-region", response_model=list[schemas.RegionSummary], tags=["dashboard"])
async def get_dashboard_by_region(db: AsyncSession = Depends(get_async_session)):
    rows = await get_hours_by_region(db)
    results = []
    for row in rows:
        hourly_rate = 30000.0  # blended average
        results.append(schemas.RegionSummary(
            region=row.region,
            employee_count=row.employee_count,
            total_hours=round(row.total_hours, 1),
            total_cost=round(row.total_hours * hourly_rate, 0),
        ))
    return results


@router.get("/dashboard/monthly-trend", response_model=list[schemas.MonthlyTrend], tags=["dashboard"])
async def get_monthly_trend_endpoint(year: int = 2025, db: AsyncSession = Depends(get_async_session)):
    rows = await get_monthly_trend(db, year)
    month_names = ["", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    return [
        schemas.MonthlyTrend(
            month=month_names[int(row.month)],
            total_hours=round(row.total_hours, 1),
            task_count=row.task_count,
        )
        for row in rows
    ]


@router.get("/dashboard/work-type-distribution", response_model=list[schemas.WorkTypeProportion], tags=["dashboard"])
async def get_work_type_distribution_endpoint(db: AsyncSession = Depends(get_async_session)):
    rows = await get_work_type_distribution(db)
    grand_total = sum(row.total_hours for row in rows) or 1
    return [
        schemas.WorkTypeProportion(
            work_type=row.name,
            total_hours=round(row.total_hours, 1),
            percentage=round(row.total_hours / grand_total * 100, 1),
        )
        for row in rows
    ]


@router.get("/dashboard/domain-distribution", response_model=list[schemas.DomainDistribution], tags=["dashboard"])
async def get_domain_distribution_endpoint(db: AsyncSession = Depends(get_async_session)):
    rows = await get_domain_distribution(db)
    grand_total = sum(row.total_hours for row in rows) or 1
    return [
        schemas.DomainDistribution(
            domain=row.name,
            total_hours=round(row.total_hours, 1),
            percentage=round(row.total_hours / grand_total * 100, 1),
        )
        for row in rows
    ]

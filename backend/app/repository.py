"""Repository layer — thin wrappers for DB queries."""

from sqlalchemy import select, func, extract
from sqlalchemy.ext.asyncio import AsyncSession
from . import models


# ── Generic CRUD ────────────────────────────────────────────────────────
async def get_master_items(db: AsyncSession, model):
    result = await db.execute(select(model))
    return result.scalars().all()


async def get_by_id(db: AsyncSession, model, object_id: int):
    return await db.get(model, object_id)


async def create_model(db: AsyncSession, model_instance):
    db.add(model_instance)
    await db.commit()
    await db.refresh(model_instance)
    return model_instance


async def bulk_create(db: AsyncSession, instances: list):
    db.add_all(instances)
    await db.commit()


# ── Task Logs ───────────────────────────────────────────────────────────
async def get_task_logs(db: AsyncSession, skip: int = 0, limit: int = 50):
    result = await db.execute(
        select(models.TaskLog).order_by(models.TaskLog.date.desc()).offset(skip).limit(limit)
    )
    return result.scalars().all()


async def count_task_logs(db: AsyncSession) -> int:
    result = await db.execute(select(func.count(models.TaskLog.id)))
    return result.scalar() or 0


async def sum_task_hours(db: AsyncSession) -> float:
    result = await db.execute(select(func.sum(models.TaskLog.hours)))
    return result.scalar() or 0.0


# ── Quality Issues ──────────────────────────────────────────────────────
async def get_data_quality_issues(db: AsyncSession, skip: int = 0, limit: int = 50):
    result = await db.execute(
        select(models.DataQualityIssue).order_by(models.DataQualityIssue.created_at.desc()).offset(skip).limit(limit)
    )
    return result.scalars().all()


async def count_quality_issues(db: AsyncSession) -> int:
    result = await db.execute(select(func.count(models.DataQualityIssue.id)))
    return result.scalar() or 0


# ── Budget Forecasts ────────────────────────────────────────────────────
async def get_budget_forecasts(db: AsyncSession, skip: int = 0, limit: int = 50):
    result = await db.execute(
        select(models.BudgetForecast).order_by(models.BudgetForecast.created_at.desc()).offset(skip).limit(limit)
    )
    return result.scalars().all()


async def get_budget_total_cost(db: AsyncSession) -> float:
    result = await db.execute(select(func.sum(models.BudgetForecast.total_cost)))
    return result.scalar() or 0.0


# ── Employees ───────────────────────────────────────────────────────────
async def count_employees(db: AsyncSession) -> int:
    result = await db.execute(select(func.count(models.Employee.id)))
    return result.scalar() or 0


async def get_distinct_regions(db: AsyncSession) -> int:
    result = await db.execute(
        select(func.count(func.distinct(models.Team.region))).where(models.Team.region.isnot(None))
    )
    return result.scalar() or 0


# ── Dashboard Aggregations ──────────────────────────────────────────────
async def get_hours_by_region(db: AsyncSession):
    """Return [{region, employee_count, total_hours}]."""
    stmt = (
        select(
            models.Team.region,
            func.count(func.distinct(models.TaskLog.employee_id)).label("employee_count"),
            func.sum(models.TaskLog.hours).label("total_hours"),
        )
        .join(models.Team, models.TaskLog.team_id == models.Team.id)
        .where(models.Team.region.isnot(None))
        .group_by(models.Team.region)
        .order_by(func.sum(models.TaskLog.hours).desc())
    )
    result = await db.execute(stmt)
    return result.all()


async def get_monthly_trend(db: AsyncSession, year: int = 2025):
    """Return monthly (month, total_hours, task_count)."""
    stmt = (
        select(
            extract("month", models.TaskLog.date).label("month"),
            func.sum(models.TaskLog.hours).label("total_hours"),
            func.count(models.TaskLog.id).label("task_count"),
        )
        .where(extract("year", models.TaskLog.date) == year)
        .group_by(extract("month", models.TaskLog.date))
        .order_by(extract("month", models.TaskLog.date))
    )
    result = await db.execute(stmt)
    return result.all()


async def get_work_type_distribution(db: AsyncSession):
    """Return work type distribution."""
    stmt = (
        select(
            models.WorkType.name,
            func.sum(models.TaskLog.hours).label("total_hours"),
        )
        .join(models.WorkType, models.TaskLog.work_type_id == models.WorkType.id)
        .group_by(models.WorkType.name)
        .order_by(func.sum(models.TaskLog.hours).desc())
    )
    result = await db.execute(stmt)
    return result.all()


async def get_domain_distribution(db: AsyncSession):
    """Return domain distribution."""
    stmt = (
        select(
            models.Domain.name,
            func.sum(models.TaskLog.hours).label("total_hours"),
        )
        .join(models.Domain, models.TaskLog.domain_id == models.Domain.id)
        .group_by(models.Domain.name)
        .order_by(func.sum(models.TaskLog.hours).desc())
    )
    result = await db.execute(stmt)
    return result.all()

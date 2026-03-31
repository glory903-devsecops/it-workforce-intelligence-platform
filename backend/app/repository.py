from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from . import models


async def get_master_items(db: AsyncSession, model):
    result = await db.execute(select(model))
    return result.scalars().all()


async def get_task_logs(db: AsyncSession, skip: int = 0, limit: int = 50):
    result = await db.execute(select(models.TaskLog).offset(skip).limit(limit))
    return result.scalars().all()


async def get_data_quality_issues(db: AsyncSession, skip: int = 0, limit: int = 50):
    result = await db.execute(select(models.DataQualityIssue).offset(skip).limit(limit))
    return result.scalars().all()


async def get_budget_forecasts(db: AsyncSession, skip: int = 0, limit: int = 50):
    result = await db.execute(select(models.BudgetForecast).offset(skip).limit(limit))
    return result.scalars().all()


async def create_model(db: AsyncSession, model_instance):
    db.add(model_instance)
    await db.commit()
    await db.refresh(model_instance)
    return model_instance


async def get_by_id(db: AsyncSession, model, object_id: int):
    return await db.get(model, object_id)

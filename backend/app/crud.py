from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas

DEFAULT_HOURLY_RATES = {
    "정규직": 90000.0,
    "계약직": 70000.0,
    "외주": 110000.0,
}

async def get_master_items(db: AsyncSession, model):
    result = await db.execute(select(model))
    return result.scalars().all()

async def validate_task_log(db: AsyncSession, task_log: schemas.TaskLogCreate) -> list[schemas.QualityIssueResult]:
    issues: list[schemas.QualityIssueResult] = []

    if task_log.hours > 12:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="과다시간 입력",
                description="하루 12시간을 초과한 업무 기록이 감지되었습니다.",
            )
        )

    if task_log.workforce_type not in DEFAULT_HOURLY_RATES:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="인력 유형 오류",
                description="인력 유형은 정규직, 계약직, 외주 중 하나여야 합니다.",
            )
        )

    domain = await db.get(models.Domain, task_log.domain_id)
    if domain is None:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="Domain 미존재",
                description="선택한 도메인이 존재하지 않습니다.",
            )
        )

    capability = await db.get(models.Capability, task_log.capability_id)
    if capability is None:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="Capability 미존재",
                description="선택한 Capability가 존재하지 않습니다.",
            )
        )

    activity = await db.get(models.Activity, task_log.activity_id)
    if activity is None:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="Activity 미존재",
                description="선택한 Activity가 존재하지 않습니다.",
            )
        )

    if capability is not None and activity is not None and activity.capability_id != capability.id:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="활동-능력치 불일치",
                description="Activity가 선택한 Capability에 속하지 않습니다.",
            )
        )

    if domain is not None and capability is not None and capability.domain_id != domain.id:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="Capability-Domain 불일치",
                description="Capability가 선택한 Domain에 속하지 않습니다.",
            )
        )

    system = await db.get(models.System, task_log.system_id)
    if system is None:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="System 미존재",
                description="선택한 시스템이 존재하지 않습니다.",
            )
        )

    work_type = await db.get(models.WorkType, task_log.work_type_id)
    if work_type is None:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="WorkType 미존재",
                description="선택한 Work Type이 존재하지 않습니다.",
            )
        )

    return issues

async def create_data_quality_issue(
    db: AsyncSession,
    task_log_id: int,
    issue_type: str,
    description: str,
    status: str = "OPEN",
) -> models.DataQualityIssue:
    db_obj = models.DataQualityIssue(
        task_log_id=task_log_id,
        issue_type=issue_type,
        description=description,
        status=status,
    )
    db.add(db_obj)
    await db.flush()
    return db_obj

async def create_task_log(db: AsyncSession, task_log: schemas.TaskLogCreate) -> models.TaskLog:
    db_obj = models.TaskLog(**task_log.dict())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)

    issues = await validate_task_log(db, task_log)
    for issue in issues:
        await create_data_quality_issue(db, db_obj.id, issue.issue_type, issue.description)

    if issues:
        await db.commit()

    return db_obj

async def get_task_logs(db: AsyncSession, skip: int = 0, limit: int = 50) -> list[models.TaskLog]:
    result = await db.execute(select(models.TaskLog).offset(skip).limit(limit))
    return result.scalars().all()

async def get_data_quality_issues(db: AsyncSession, skip: int = 0, limit: int = 50) -> list[models.DataQualityIssue]:
    result = await db.execute(select(models.DataQualityIssue).offset(skip).limit(limit))
    return result.scalars().all()

async def create_budget_forecast(
    db: AsyncSession,
    forecast: schemas.BudgetForecastCreate,
) -> models.BudgetForecast:
    hourly_rate = forecast.hourly_rate or DEFAULT_HOURLY_RATES.get(forecast.workforce_type, 90000.0)
    total_cost = forecast.total_hours * hourly_rate

    db_obj = models.BudgetForecast(
        year=forecast.year,
        total_hours=forecast.total_hours,
        total_cost=total_cost,
        forecast_type=forecast.forecast_type,
        notes=forecast.notes,
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_budget_forecasts(db: AsyncSession, skip: int = 0, limit: int = 50) -> list[models.BudgetForecast]:
    result = await db.execute(select(models.BudgetForecast).offset(skip).limit(limit))
    return result.scalars().all()

from . import models, schemas
from .repository import (
    create_model,
    get_by_id,
    get_master_items,
    get_task_logs,
    get_data_quality_issues,
    get_budget_forecasts,
)

DEFAULT_HOURLY_RATES = {
    "정규직": 90000.0,
    "계약직": 70000.0,
    "외주": 110000.0,
}


async def validate_task_log(db, task_log: schemas.TaskLogCreate) -> list[schemas.QualityIssueResult]:
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

    domain = await get_by_id(db, models.Domain, task_log.domain_id)
    if domain is None:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="Domain 미존재",
                description="선택한 도메인이 존재하지 않습니다.",
            )
        )

    capability = await get_by_id(db, models.Capability, task_log.capability_id)
    if capability is None:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="Capability 미존재",
                description="선택한 Capability가 존재하지 않습니다.",
            )
        )

    activity = await get_by_id(db, models.Activity, task_log.activity_id)
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

    system = await get_by_id(db, models.System, task_log.system_id)
    if system is None:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="System 미존재",
                description="선택한 시스템이 존재하지 않습니다.",
            )
        )

    work_type = await get_by_id(db, models.WorkType, task_log.work_type_id)
    if work_type is None:
        issues.append(
            schemas.QualityIssueResult(
                issue_type="WorkType 미존재",
                description="선택한 Work Type이 존재하지 않습니다.",
            )
        )

    return issues


async def create_task_log(db, task_log: schemas.TaskLogCreate):
    task_log_model = models.TaskLog(**task_log.dict())
    task_log_obj = await create_model(db, task_log_model)

    issues = await validate_task_log(db, task_log)
    for issue in issues:
        issue_model = models.DataQualityIssue(
            task_log_id=task_log_obj.id,
            issue_type=issue.issue_type,
            description=issue.description,
            status="OPEN",
        )
        await create_model(db, issue_model)

    return task_log_obj


async def create_budget_forecast(db, forecast: schemas.BudgetForecastCreate):
    hourly_rate = forecast.hourly_rate or DEFAULT_HOURLY_RATES.get(forecast.workforce_type, 90000.0)
    total_cost = forecast.total_hours * hourly_rate

    forecast_model = models.BudgetForecast(
        year=forecast.year,
        total_hours=forecast.total_hours,
        total_cost=total_cost,
        forecast_type=forecast.forecast_type,
        notes=forecast.notes,
    )
    return await create_model(db, forecast_model)


async def seed_initial_data(db):
    results = await get_master_items(db, models.Domain)
    if results:
        return

    infrastructure = models.Domain(name="Infrastructure Operations", description="인프라 운영 중요 업무")
    application = models.Domain(name="Application Operations", description="애플리케이션 운영 주요 업무")
    security = models.Domain(name="Security Operations", description="보안 운영 업무")
    project = models.Domain(name="Project & Change Management", description="프로젝트 및 변경 관리")

    await create_model(db, infrastructure)
    await create_model(db, application)
    await create_model(db, security)
    await create_model(db, project)

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

    await create_model(db, server_management)
    await create_model(db, db_admin)
    await create_model(db, firewall)
    await create_model(db, release_management)

    for activity in activities:
        await create_model(db, activity)
    for wt in work_types:
        await create_model(db, wt)
    for system in systems:
        await create_model(db, system)
    await create_model(db, department)
    await create_model(db, team)
    for employee in employees:
        await create_model(db, employee)

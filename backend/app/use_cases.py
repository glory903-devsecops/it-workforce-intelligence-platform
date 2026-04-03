"""Business use-cases — validation, task log creation, budget forecasting, and MIDAS data seeding."""

import random
from datetime import date, timedelta

from . import models, schemas
from .repository import create_model, get_by_id, get_master_items, bulk_create

# ── Hourly Rates ────────────────────────────────────────────────────────
DEFAULT_HOURLY_RATES = {
    "정규직": 30000.0,
    "계약직": 30000.0,
    "외주": 90000.0,
}

ANNUAL_WORK_HOURS = 1760  # 8h × 220 working days


# ── Validation ──────────────────────────────────────────────────────────
async def validate_task_log(db, task_log: schemas.TaskLogCreate) -> list[schemas.QualityIssueResult]:
    issues: list[schemas.QualityIssueResult] = []

    if task_log.hours > 12:
        issues.append(schemas.QualityIssueResult(
            issue_type="과다시간 입력",
            description="하루 12시간을 초과한 업무 기록이 감지되었습니다.",
        ))

    if task_log.workforce_type not in DEFAULT_HOURLY_RATES:
        issues.append(schemas.QualityIssueResult(
            issue_type="인력 유형 오류",
            description="인력 유형은 정규직, 계약직, 외주 중 하나여야 합니다.",
        ))

    domain = await get_by_id(db, models.Domain, task_log.domain_id)
    if domain is None:
        issues.append(schemas.QualityIssueResult(
            issue_type="Domain 미존재", description="선택한 도메인이 존재하지 않습니다.",
        ))

    capability = await get_by_id(db, models.Capability, task_log.capability_id)
    if capability is None:
        issues.append(schemas.QualityIssueResult(
            issue_type="Capability 미존재", description="선택한 Capability가 존재하지 않습니다.",
        ))

    activity = await get_by_id(db, models.Activity, task_log.activity_id)
    if activity is None:
        issues.append(schemas.QualityIssueResult(
            issue_type="Activity 미존재", description="선택한 Activity가 존재하지 않습니다.",
        ))

    if capability and activity and activity.capability_id != capability.id:
        issues.append(schemas.QualityIssueResult(
            issue_type="활동-능력치 불일치",
            description="Activity가 선택한 Capability에 속하지 않습니다.",
        ))

    if domain and capability and capability.domain_id != domain.id:
        issues.append(schemas.QualityIssueResult(
            issue_type="Capability-Domain 불일치",
            description="Capability가 선택한 Domain에 속하지 않습니다.",
        ))

    system = await get_by_id(db, models.System, task_log.system_id)
    if system is None:
        issues.append(schemas.QualityIssueResult(
            issue_type="System 미존재", description="선택한 시스템이 존재하지 않습니다.",
        ))

    work_type = await get_by_id(db, models.WorkType, task_log.work_type_id)
    if work_type is None:
        issues.append(schemas.QualityIssueResult(
            issue_type="WorkType 미존재", description="선택한 Work Type이 존재하지 않습니다.",
        ))

    return issues


# ── Task Log Creation ───────────────────────────────────────────────────
async def create_task_log(db, task_log: schemas.TaskLogCreate):
    task_log_model = models.TaskLog(**task_log.model_dump())
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


# ── Budget Forecast Creation ────────────────────────────────────────────
async def create_budget_forecast(db, forecast: schemas.BudgetForecastCreate):
    hourly_rate = forecast.hourly_rate or DEFAULT_HOURLY_RATES.get(forecast.workforce_type, 30000.0)
    total_cost = forecast.total_hours * hourly_rate

    forecast_model = models.BudgetForecast(
        year=forecast.year,
        total_hours=forecast.total_hours,
        total_cost=total_cost,
        forecast_type=forecast.forecast_type,
        notes=forecast.notes,
    )
    return await create_model(db, forecast_model)


# ── 2026 Budget Auto-Generation ────────────────────────────────────────
async def generate_2026_budget(db):
    """Generate 2026 budget forecasts from 2025 task log data."""
    from sqlalchemy import select, func, extract

    # Aggregate 2025 hours by region + workforce_type
    stmt = (
        select(
            models.Team.region,
            models.Team.name.label("team_name"),
            models.TaskLog.workforce_type,
            models.Domain.name.label("domain_name"),
            func.sum(models.TaskLog.hours).label("total_hours"),
        )
        .join(models.Team, models.TaskLog.team_id == models.Team.id)
        .join(models.Domain, models.TaskLog.domain_id == models.Domain.id)
        .where(extract("year", models.TaskLog.date) == 2025)
        .group_by(
            models.Team.region,
            models.Team.name,
            models.TaskLog.workforce_type,
            models.Domain.name,
        )
    )
    result = await db.execute(stmt)
    rows = result.all()

    forecasts = []
    for row in rows:
        hourly_rate = DEFAULT_HOURLY_RATES.get(row.workforce_type, 30000.0)
        growth_factor = 1.05  # 5% growth assumption
        projected_hours = row.total_hours * growth_factor
        total_cost = projected_hours * hourly_rate
        fte = projected_hours / ANNUAL_WORK_HOURS

        forecast = models.BudgetForecast(
            year=2026,
            region=row.region,
            team_name=row.team_name,
            workforce_type=row.workforce_type,
            domain_name=row.domain_name,
            total_hours=round(projected_hours, 1),
            total_cost=round(total_cost, 0),
            headcount_fte=round(fte, 2),
            forecast_type="Historical",
            notes=f"2025년 실적 기반 자동 산출 (5% 성장률 적용)",
        )
        forecasts.append(forecast)

    if forecasts:
        await bulk_create(db, forecasts)

    return len(forecasts)


# ── MIDAS SW Sales Data Seeding ─────────────────────────────────────────
# Korean name pools
_LAST_NAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임",
               "한", "오", "서", "신", "권", "황", "안", "송", "류", "전",
               "홍", "고", "문", "양", "손", "배", "백", "허", "유", "남"]
_FIRST_NAMES = ["민준", "서준", "도윤", "예준", "시우", "하준", "지호", "주원",
                "지후", "준서", "현우", "건우", "우진", "선우", "민재", "서진",
                "연우", "정우", "승현", "유준", "지훈", "승우", "현준", "지우",
                "수빈", "서연", "지우", "수아", "하은", "서윤", "민서", "하린",
                "지안", "하윤", "유나", "윤서", "예은", "수현", "채원", "예린",
                "다은", "지원", "소율", "은서", "나윤", "서영", "채윤", "지민",
                "승아", "진서", "영훈", "태현", "동현", "성민", "재영", "기현",
                "준혁", "상훈", "민호", "대성"]

_REGIONS = ["서울", "경기", "인천", "대전", "대구", "부산", "광주", "강원", "제주", "해외"]

_POSITIONS = ["사원", "주임", "대리", "과장", "차장", "부장"]

_DIFFICULTIES = ["쉬움", "보통", "어려움"]
_RECURRENCES = ["일회성", "주간", "월간", "분기", "일상"]
_IMPACTS = ["낮음", "중간", "높음", "매우 높음"]


def _generate_employee_name(index: int) -> str:
    last = _LAST_NAMES[index % len(_LAST_NAMES)]
    first = _FIRST_NAMES[index % len(_FIRST_NAMES)]
    suffix = "" if index < len(_LAST_NAMES) * len(_FIRST_NAMES) else str(index // (len(_LAST_NAMES) * len(_FIRST_NAMES)))
    return f"{last}{first}{suffix}"


async def seed_initial_data(db, skip_task_logs: bool = False):
    """Seed MIDAS SW Sales workforce data — 300 employees, 10 regions, 2025 task logs.
    
    Args:
        skip_task_logs: If True, skip generating 2025 task log data (for fast tests).
    """
    existing = await get_master_items(db, models.Domain)
    if existing:
        return  # already seeded

    # ── Department ──────────────────────────────────────────────────────
    department = models.Department(name="SW영업본부", description="마이다스 소프트웨어 영업 본부")
    await create_model(db, department)

    # ── Teams (10 regions) ──────────────────────────────────────────────
    teams = []
    for region in _REGIONS:
        team = models.Team(name=f"{region}영업팀", region=region, department=department)
        teams.append(team)
    for team in teams:
        await create_model(db, team)

    # ── Employees (300) ─────────────────────────────────────────────────
    employees = []
    workforce_types = ["정규직", "정규직", "정규직", "정규직", "계약직", "외주"]  # 4:1:1 ratio
    for i in range(300):
        team = teams[i % len(teams)]
        emp = models.Employee(
            name=_generate_employee_name(i),
            employee_code=f"MDS-{2025}{i+1:04d}",
            workforce_type=workforce_types[i % len(workforce_types)],
            position=_POSITIONS[min(i % 10, len(_POSITIONS) - 1)],
            region=team.region,
            team=team,
        )
        employees.append(emp)
    for emp in employees:
        await create_model(db, emp)

    # ── Domains (SW Sales specific) ─────────────────────────────────────
    domain_defs = [
        ("고객 영업", "고객사 방문, 제안, 계약 체결 등 직접 영업 활동"),
        ("기술 지원", "제품 기술 설명, 데모, 기술 문의 대응"),
        ("마케팅/홍보", "세미나, 전시회, 콘텐츠 제작 등 마케팅 활동"),
        ("파트너 관리", "리셀러, 총판, 해외 파트너 관리"),
        ("내부 행정", "보고서, 회의, 교육, 평가 등 내부 업무"),
    ]
    domains = []
    for name, desc in domain_defs:
        d = models.Domain(name=name, description=desc)
        await create_model(db, d)
        domains.append(d)

    # ── Capabilities ────────────────────────────────────────────────────
    capability_map = {
        "고객 영업": [
            ("신규 고객 개발", "신규 고객 발굴 및 영업 기회 창출"),
            ("기존 고객 관리", "기존 고객 유지보수 영업"),
            ("제안/입찰", "RFP 대응, 제안서 작성, 입찰 참여"),
            ("계약 관리", "계약 체결, 갱신, 라이선스 관리"),
        ],
        "기술 지원": [
            ("제품 데모", "midas Civil/Gen/GTS NX 제품 시연"),
            ("기술 문의 대응", "고객 기술 질문 및 이슈 해결"),
            ("교육/워크숍", "고객 대상 제품 교육 진행"),
        ],
        "마케팅/홍보": [
            ("세미나 운영", "온/오프라인 세미나 기획 및 운영"),
            ("전시회 참가", "건설/토목 전시회 참가 및 부스 운영"),
            ("콘텐츠 제작", "기술 자료, 사례집, 영상 제작"),
        ],
        "파트너 관리": [
            ("리셀러 관리", "국내 리셀러 지원 및 실적 관리"),
            ("해외 파트너", "해외 총판/대리점 관리"),
        ],
        "내부 행정": [
            ("영업 보고", "주간/월간 영업 보고서 작성"),
            ("사내 회의", "팀 회의, 전체 회의 참석"),
            ("교육/역량개발", "사내 교육, 세미나, 자격증 취득"),
        ],
    }

    all_capabilities = []
    for domain in domains:
        cap_defs = capability_map.get(domain.name, [])
        for cap_name, cap_desc in cap_defs:
            cap = models.Capability(domain=domain, name=cap_name, description=cap_desc)
            await create_model(db, cap)
            all_capabilities.append(cap)

    # ── Activities ──────────────────────────────────────────────────────
    activity_map = {
        "신규 고객 개발": ["콜드콜/이메일 발송", "고객 방문 미팅", "니즈 분석 보고서 작성"],
        "기존 고객 관리": ["유지보수 갱신 안내", "고객 만족도 조사", "업그레이드 제안"],
        "제안/입찰": ["RFP 분석", "제안서 작성", "가격 산정", "프레젠테이션"],
        "계약 관리": ["계약서 검토", "라이선스 발급", "매출 등록"],
        "제품 데모": ["midas Civil 시연", "midas Gen 시연", "midas GTS NX 시연", "midas FEA 시연"],
        "기술 문의 대응": ["이메일 기술 지원", "원격 지원", "현장 방문 지원"],
        "교육/워크숍": ["신규 사용자 교육", "고급 기능 워크숍", "온라인 웨비나"],
        "세미나 운영": ["세미나 기획", "발표 자료 준비", "참석자 관리"],
        "전시회 참가": ["부스 설치/철거", "현장 상담", "리드 수집"],
        "콘텐츠 제작": ["기술 백서 작성", "고객 사례집 제작", "제품 소개 영상"],
        "리셀러 관리": ["파트너 실적 리뷰", "공동 영업 지원", "가격 정책 협의"],
        "해외 파트너": ["해외 파트너 미팅", "글로벌 프로모션 조율", "현지 기술 지원"],
        "영업 보고": ["주간 보고서 작성", "월간 실적 정리", "파이프라인 업데이트"],
        "사내 회의": ["주간 팀 미팅", "월간 전체 회의", "임원 보고"],
        "교육/역량개발": ["사내 제품 교육", "외부 세미나 참석", "자격증 공부"],
    }

    all_activities = []
    for cap in all_capabilities:
        act_names = activity_map.get(cap.name, ["일반 업무"])
        for act_name in act_names:
            act = models.Activity(capability=cap, name=act_name, description=f"{cap.name} - {act_name}")
            await create_model(db, act)
            all_activities.append(act)

    # ── Work Types ──────────────────────────────────────────────────────
    work_type_defs = [
        ("BAU", "일상 영업 운영"),
        ("MEETING", "미팅/회의"),
        ("PROPOSAL", "제안/입찰"),
        ("DEMO", "제품 시연"),
        ("TRAINING", "교육/세미나"),
        ("ADMIN", "행정/보고"),
        ("TRAVEL", "출장/이동"),
        ("SUPPORT", "고객 기술 지원"),
    ]
    work_types = []
    for wt_name, wt_desc in work_type_defs:
        wt = models.WorkType(name=wt_name, description=wt_desc)
        await create_model(db, wt)
        work_types.append(wt)

    # ── Systems (MIDAS products & tools) ────────────────────────────────
    system_defs = [
        ("Salesforce CRM", "고객 관계 관리 시스템"),
        ("SAP ERP", "전사 자원 관리"),
        ("MIDAS Portal", "마이다스 사내 포털"),
        ("midas Civil", "토목 구조 해석 소프트웨어"),
        ("midas Gen", "건축 구조 해석 소프트웨어"),
        ("midas GTS NX", "지반 해석 소프트웨어"),
        ("midas FEA", "고급 유한요소 해석"),
        ("MS Teams", "협업 도구"),
        ("이메일 시스템", "사내 이메일"),
        ("영업관리시스템", "자체 영업 파이프라인 관리"),
    ]
    systems = []
    for sys_name, sys_desc in system_defs:
        s = models.System(name=sys_name, description=sys_desc)
        await create_model(db, s)
        systems.append(s)

    # ── 2025 Task Logs (full year) ──────────────────────────────────────
    if skip_task_logs:
        return  # For fast tests, skip task log generation

    random.seed(42)  # reproducible
    start_date = date(2025, 1, 1)
    end_date = date(2025, 12, 31)

    task_logs = []
    current_date = start_date
    while current_date <= end_date:
        if current_date.weekday() >= 5:  # skip weekends
            current_date += timedelta(days=1)
            continue

        # Each employee logs 1-3 tasks per day
        for emp in employees:
            num_tasks = random.choices([1, 2, 3], weights=[0.3, 0.5, 0.2])[0]
            daily_hours_remaining = 8.0

            for _ in range(num_tasks):
                if daily_hours_remaining <= 0:
                    break

                cap = random.choice(all_capabilities)
                cap_acts = [a for a in all_activities if a.capability_id == cap.id]
                act = random.choice(cap_acts) if cap_acts else all_activities[0]

                hours = min(
                    round(random.uniform(0.5, 4.0) * 4) / 4,  # quarter-hour precision
                    daily_hours_remaining,
                )
                daily_hours_remaining -= hours

                task = models.TaskLog(
                    date=current_date,
                    employee_id=emp.id,
                    team_id=emp.team_id,
                    workforce_type=emp.workforce_type,
                    domain_id=cap.domain_id,
                    capability_id=cap.id,
                    activity_id=act.id,
                    work_type_id=random.choice(work_types).id,
                    system_id=random.choice(systems).id,
                    hours=hours,
                    difficulty=random.choice(_DIFFICULTIES),
                    recurrence=random.choice(_RECURRENCES),
                    impact=random.choice(_IMPACTS),
                    notes=None,
                )
                task_logs.append(task)

            # Batch insert every 5000 records to manage memory
            if len(task_logs) >= 5000:
                db.add_all(task_logs)
                await db.commit()
                task_logs = []

        current_date += timedelta(days=1)

    # Flush remaining
    if task_logs:
        db.add_all(task_logs)
        await db.commit()

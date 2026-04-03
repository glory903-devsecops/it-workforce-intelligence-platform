"""API endpoint tests — health, metadata, CRUD, dashboard."""


def test_root_health(client):
    """Health check returns OK."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_status_endpoint(client):
    """Separate status endpoint works."""
    response = client.get("/status")
    assert response.status_code == 200
    assert "midas" in response.json()["service"]


# ── Metadata Endpoints ──────────────────────────────────────────────────
def test_list_domains(client):
    """Seeds 5 MIDAS SW Sales domains."""
    response = client.get("/domains")
    assert response.status_code == 200
    domains = response.json()
    assert isinstance(domains, list)
    assert len(domains) == 5
    names = [d["name"] for d in domains]
    assert "고객 영업" in names
    assert "기술 지원" in names


def test_list_capabilities(client):
    """Seeds 15 capabilities across 5 domains."""
    response = client.get("/capabilities")
    assert response.status_code == 200
    capabilities = response.json()
    assert len(capabilities) == 15


def test_list_activities(client):
    """Activities are seeded and linked to capabilities."""
    response = client.get("/activities")
    assert response.status_code == 200
    activities = response.json()
    assert len(activities) > 10
    assert all("capability_id" in a for a in activities)


def test_list_teams(client):
    """10 regional teams are seeded."""
    response = client.get("/teams")
    assert response.status_code == 200
    teams = response.json()
    assert len(teams) == 10
    regions = [t["region"] for t in teams]
    assert "서울" in regions
    assert "해외" in regions


def test_list_employees(client):
    """300 employees are seeded."""
    response = client.get("/employees")
    assert response.status_code == 200
    employees = response.json()
    assert len(employees) == 300


def test_list_work_types(client):
    """8 work types for SW sales."""
    response = client.get("/work-types")
    assert response.status_code == 200
    work_types = response.json()
    assert len(work_types) == 8
    names = [wt["name"] for wt in work_types]
    assert "BAU" in names
    assert "DEMO" in names


def test_list_systems(client):
    """10 MIDAS systems/tools."""
    response = client.get("/systems")
    assert response.status_code == 200
    systems = response.json()
    assert len(systems) == 10
    names = [s["name"] for s in systems]
    assert "Salesforce CRM" in names
    assert "midas Civil" in names


# ── Task Log CRUD ───────────────────────────────────────────────────────
def test_create_and_list_task_log(client):
    """Create a task log and verify it appears in listing."""
    payload = {
        "date": "2025-06-15",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "정규직",
        "domain_id": 1,
        "capability_id": 1,
        "activity_id": 1,
        "work_type_id": 1,
        "system_id": 1,
        "hours": 3.5,
        "difficulty": "보통",
        "recurrence": "일상",
        "impact": "중간",
        "notes": "신규 고객 미팅 — 현대건설",
    }

    create_resp = client.post("/task-logs", json=payload)
    assert create_resp.status_code == 200
    data = create_resp.json()
    assert data["employee_id"] == 1
    assert data["hours"] == 3.5
    assert data["id"] > 0

    list_resp = client.get("/task-logs")
    assert list_resp.status_code == 200
    logs = list_resp.json()
    assert any(log["id"] == data["id"] for log in logs)


def test_validate_task_log_valid(client):
    """Valid task log produces no quality issues."""
    payload = {
        "date": "2025-06-15",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "정규직",
        "domain_id": 1,
        "capability_id": 1,
        "activity_id": 1,
        "work_type_id": 1,
        "system_id": 1,
        "hours": 2.0,
    }
    response = client.post("/task-logs/validate", json=payload)
    assert response.status_code == 200
    assert response.json() == []


def test_validate_task_log_excess_hours(client):
    """Hours > 12 triggers quality issue."""
    payload = {
        "date": "2025-06-15",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "정규직",
        "domain_id": 1,
        "capability_id": 1,
        "activity_id": 1,
        "work_type_id": 1,
        "system_id": 1,
        "hours": 15.0,
    }
    response = client.post("/task-logs/validate", json=payload)
    assert response.status_code == 200
    issues = response.json()
    assert any(i["issue_type"] == "과다시간 입력" for i in issues)


def test_validate_task_log_invalid_workforce_type(client):
    """Invalid workforce type triggers quality issue."""
    payload = {
        "date": "2025-06-15",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "인턴",
        "domain_id": 1,
        "capability_id": 1,
        "activity_id": 1,
        "work_type_id": 1,
        "system_id": 1,
        "hours": 2.0,
    }
    response = client.post("/task-logs/validate", json=payload)
    assert response.status_code == 200
    issues = response.json()
    assert any(i["issue_type"] == "인력 유형 오류" for i in issues)


def test_validate_task_log_nonexistent_domain(client):
    """Non-existent domain_id triggers quality issue."""
    payload = {
        "date": "2025-06-15",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "정규직",
        "domain_id": 999,
        "capability_id": 1,
        "activity_id": 1,
        "work_type_id": 1,
        "system_id": 1,
        "hours": 2.0,
    }
    response = client.post("/task-logs/validate", json=payload)
    assert response.status_code == 200
    issues = response.json()
    assert any(i["issue_type"] == "Domain 미존재" for i in issues)


# ── Quality Issues ──────────────────────────────────────────────────────
def test_quality_issues_auto_created(client):
    """Creating a task log with excess hours auto-creates quality issue."""
    payload = {
        "date": "2025-06-15",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "정규직",
        "domain_id": 1,
        "capability_id": 1,
        "activity_id": 1,
        "work_type_id": 1,
        "system_id": 1,
        "hours": 14.0,
        "notes": "장시간 데모",
    }
    client.post("/task-logs", json=payload)

    issues_resp = client.get("/data-quality-issues")
    assert issues_resp.status_code == 200
    issues = issues_resp.json()
    assert any(i["issue_type"] == "과다시간 입력" for i in issues)


# ── Budget Forecast ─────────────────────────────────────────────────────
def test_create_budget_forecast(client):
    """Create a manual budget forecast."""
    payload = {
        "year": 2026,
        "total_hours": 1760,
        "forecast_type": "Manual",
        "workforce_type": "정규직",
        "hourly_rate": 30000,
        "notes": "서울팀 수동 입력",
    }
    response = client.post("/budget-forecasts", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["year"] == 2026
    assert data["total_cost"] == 1760 * 30000


def test_budget_forecast_default_rate(client):
    """Budget forecast uses default hourly rate when not specified."""
    payload = {
        "year": 2026,
        "total_hours": 1000,
        "forecast_type": "Historical",
        "workforce_type": "외주",
    }
    response = client.post("/budget-forecasts", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_cost"] == 1000 * 90000  # 외주 9만원


def test_list_budget_forecasts(client):
    """Budget forecast listing works."""
    response = client.get("/budget-forecasts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


# ── Dashboard Endpoints ─────────────────────────────────────────────────
def test_dashboard_summary(client):
    """Dashboard summary returns correct structure."""
    response = client.get("/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_employees"] == 300
    assert data["total_regions"] == 10


def test_dashboard_by_region(client):
    """Dashboard region summary when no task logs returns empty list."""
    response = client.get("/dashboard/by-region")
    assert response.status_code == 200
    # No task logs seeded by default, so should be empty
    assert isinstance(response.json(), list)


def test_dashboard_monthly_trend(client):
    """Monthly trend endpoint responds."""
    response = client.get("/dashboard/monthly-trend?year=2025")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_dashboard_work_type_distribution(client):
    """Work type distribution endpoint responds."""
    response = client.get("/dashboard/work-type-distribution")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_dashboard_domain_distribution(client):
    """Domain distribution endpoint responds."""
    response = client.get("/dashboard/domain-distribution")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

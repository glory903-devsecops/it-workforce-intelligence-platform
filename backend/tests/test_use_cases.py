"""Use case tests — validation logic, seeding, data integrity."""


def test_seed_creates_300_employees(client):
    """Seeding creates exactly 300 employees."""
    response = client.get("/employees")
    employees = response.json()
    assert len(employees) == 300


def test_seed_employee_codes_unique(client):
    """All employee codes are unique."""
    response = client.get("/employees")
    employees = response.json()
    codes = [e["employee_code"] for e in employees if e.get("employee_code")]
    assert len(codes) == len(set(codes))


def test_seed_employee_distribution(client):
    """Workforce distribution follows ~4:1:1 ratio."""
    response = client.get("/employees")
    employees = response.json()
    counts = {}
    for e in employees:
        wt = e["workforce_type"]
        counts[wt] = counts.get(wt, 0) + 1

    # 정규직 should be the majority (~200)
    assert counts.get("정규직", 0) >= 150
    assert counts.get("계약직", 0) >= 30
    assert counts.get("외주", 0) >= 30


def test_seed_teams_have_regions(client):
    """All teams have region field set."""
    response = client.get("/teams")
    teams = response.json()
    for team in teams:
        assert team.get("region") is not None
        assert len(team["region"]) > 0


def test_seed_capabilities_linked_to_domains(client):
    """Each capability belongs to a valid domain."""
    domains_resp = client.get("/domains")
    caps_resp = client.get("/capabilities")
    domain_ids = {d["id"] for d in domains_resp.json()}
    for cap in caps_resp.json():
        assert cap["domain_id"] in domain_ids


def test_seed_activities_linked_to_capabilities(client):
    """Each activity belongs to a valid capability."""
    caps_resp = client.get("/capabilities")
    acts_resp = client.get("/activities")
    cap_ids = {c["id"] for c in caps_resp.json()}
    for act in acts_resp.json():
        assert act["capability_id"] in cap_ids


def test_validation_multi_issues(client):
    """Multiple validation issues detected simultaneously."""
    payload = {
        "date": "2025-06-15",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "파견직",  # invalid
        "domain_id": 999,  # non-existent
        "capability_id": 999,  # non-existent
        "activity_id": 999,  # non-existent
        "work_type_id": 999,  # non-existent
        "system_id": 999,  # non-existent
        "hours": 20.0,  # excess
    }
    response = client.post("/task-logs/validate", json=payload)
    assert response.status_code == 200
    issues = response.json()
    issue_types = [i["issue_type"] for i in issues]
    assert "과다시간 입력" in issue_types
    assert "인력 유형 오류" in issue_types
    assert "Domain 미존재" in issue_types


def test_midas_product_systems(client):
    """MIDAS product names are in systems."""
    response = client.get("/systems")
    systems = response.json()
    names = [s["name"] for s in systems]
    assert "midas Civil" in names
    assert "midas Gen" in names
    assert "Salesforce CRM" in names


def test_sw_sales_domains(client):
    """SW Sales specific domains are seeded."""
    response = client.get("/domains")
    domains = response.json()
    names = [d["name"] for d in domains]
    assert "고객 영업" in names
    assert "기술 지원" in names
    assert "마케팅/홍보" in names
    assert "파트너 관리" in names
    assert "내부 행정" in names


def test_sw_sales_work_types(client):
    """SW Sales specific work types are seeded."""
    response = client.get("/work-types")
    work_types = response.json()
    names = [wt["name"] for wt in work_types]
    expected = ["BAU", "MEETING", "PROPOSAL", "DEMO", "TRAINING", "ADMIN", "TRAVEL", "SUPPORT"]
    for exp in expected:
        assert exp in names, f"Work type '{exp}' not found"

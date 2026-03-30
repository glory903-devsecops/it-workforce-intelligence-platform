def test_root_health(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_list_domains(client):
    response = client.get("/domains")
    assert response.status_code == 200
    domains = response.json()
    assert isinstance(domains, list)
    assert len(domains) > 0
    assert domains[0]["name"] != ""


def test_create_and_list_task_log(client):
    payload = {
        "date": "2026-03-31",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "정규직",
        "domain_id": 1,
        "capability_id": 1,
        "activity_id": 1,
        "work_type_id": 1,
        "system_id": 1,
        "hours": 2.5,
        "difficulty": "보통",
        "recurrence": "일상",
        "impact": "중간",
        "notes": "테스트 업무 기록",
    }

    create_response = client.post("/task-logs", json=payload)
    assert create_response.status_code == 200
    data = create_response.json()
    assert data["employee_id"] == payload["employee_id"]
    assert data["hours"] == payload["hours"]
    assert data["id"] > 0

    list_response = client.get("/task-logs")
    assert list_response.status_code == 200
    task_logs = list_response.json()
    assert isinstance(task_logs, list)
    assert any(log["id"] == data["id"] for log in task_logs)


def test_validate_task_log(client):
    payload = {
        "date": "2026-03-31",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "정규직",
        "domain_id": 1,
        "capability_id": 1,
        "activity_id": 1,
        "work_type_id": 1,
        "system_id": 1,
        "hours": 2.5,
        "difficulty": "보통",
        "recurrence": "일상",
        "impact": "중간",
        "notes": "품질 검증 테스트",
    }

    response = client.post("/task-logs/validate", json=payload)
    assert response.status_code == 200
    assert response.json() == []

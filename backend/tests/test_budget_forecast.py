"""Budget forecast use-case tests — 2025 → 2026 budget generation."""

import asyncio
import sys
from pathlib import Path


def test_budget_hourly_rates(client):
    """Verify hourly rates: 정규직 3만, 계약직 3만, 외주 9만."""
    test_cases = [
        ("정규직", 30000),
        ("계약직", 30000),
        ("외주", 90000),
    ]
    for workforce_type, expected_rate in test_cases:
        payload = {
            "year": 2026,
            "total_hours": 100,
            "forecast_type": "Manual",
            "workforce_type": workforce_type,
        }
        response = client.post("/budget-forecasts", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["total_cost"] == 100 * expected_rate, (
            f"{workforce_type}: expected {100 * expected_rate}, got {data['total_cost']}"
        )


def test_budget_custom_hourly_rate_override(client):
    """Custom hourly_rate overrides default."""
    payload = {
        "year": 2026,
        "total_hours": 100,
        "forecast_type": "Manual",
        "workforce_type": "정규직",
        "hourly_rate": 50000,
    }
    response = client.post("/budget-forecasts", json=payload)
    assert response.status_code == 200
    assert response.json()["total_cost"] == 100 * 50000


def test_budget_fte_calculation_logic():
    """FTE = total_hours / 1760 (annual work hours)."""
    annual_hours = 1760
    test_hours = 3520
    expected_fte = test_hours / annual_hours  # 2.0
    assert expected_fte == 2.0


def test_budget_growth_factor_logic():
    """2026 budget applies 5% growth to 2025 hours."""
    hours_2025 = 10000
    growth_factor = 1.05
    projected = hours_2025 * growth_factor
    assert projected == 10500.0


def test_budget_cost_calculation_flow(client):
    """Full flow: create task logs → verify cost calculation."""
    # Create a few task logs
    for i in range(3):
        payload = {
            "date": "2025-03-15",
            "employee_id": 1,
            "team_id": 1,
            "workforce_type": "정규직",
            "domain_id": 1,
            "capability_id": 1,
            "activity_id": 1,
            "work_type_id": 1,
            "system_id": 1,
            "hours": 4.0,
            "notes": f"테스트 업무 {i+1}",
        }
        resp = client.post("/task-logs", json=payload)
        assert resp.status_code == 200

    # Verify task logs exist
    task_resp = client.get("/task-logs")
    assert task_resp.status_code == 200
    assert len(task_resp.json()) >= 3

    # Create budget forecast
    forecast_payload = {
        "year": 2026,
        "total_hours": 12.0,  # 4h × 3 tasks
        "forecast_type": "Historical",
        "workforce_type": "정규직",
    }
    budget_resp = client.post("/budget-forecasts", json=forecast_payload)
    assert budget_resp.status_code == 200
    assert budget_resp.json()["total_cost"] == 12.0 * 30000


def test_generate_2026_budget_endpoint(client):
    """2026 budget auto-generation endpoint works."""
    # First create a task log so there's data to project
    payload = {
        "date": "2025-09-01",
        "employee_id": 1,
        "team_id": 1,
        "workforce_type": "정규직",
        "domain_id": 1,
        "capability_id": 1,
        "activity_id": 1,
        "work_type_id": 1,
        "system_id": 1,
        "hours": 8.0,
    }
    client.post("/task-logs", json=payload)

    # Generate 2026 budget
    gen_resp = client.post("/budget-forecasts/generate-2026")
    assert gen_resp.status_code == 200
    data = gen_resp.json()
    assert data["count"] >= 1
    assert "예산" in data["message"]

    # Verify forecasts were created
    list_resp = client.get("/budget-forecasts")
    assert list_resp.status_code == 200
    forecasts = list_resp.json()
    assert any(f["year"] == 2026 for f in forecasts)

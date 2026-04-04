"""Pydantic schemas for API request/response — Pydantic v2 compatible."""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


# ── Task Log ────────────────────────────────────────────────────────────
class TaskLogBase(BaseModel):
    date: date
    employee_id: int
    team_id: int
    workforce_type: str
    domain_id: int
    capability_id: int
    activity_id: int
    work_type_id: int
    system_id: int
    hours: float
    difficulty: Optional[str] = None
    recurrence: Optional[str] = None
    impact: Optional[str] = None
    notes: Optional[str] = None


class TaskLogCreate(TaskLogBase):
    pass


class TaskLogRead(TaskLogBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ── Master Data Read ────────────────────────────────────────────────────
class DomainRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: Optional[str] = None


class CapabilityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    domain_id: int
    name: str
    description: Optional[str] = None


class ActivityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    capability_id: int
    name: str
    description: Optional[str] = None


class WorkTypeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: Optional[str] = None


class SystemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: Optional[str] = None


class TeamRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    region: Optional[str] = None
    department_id: Optional[int] = None


class EmployeeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    employee_code: Optional[str] = None
    workforce_type: str
    position: Optional[str] = None
    region: Optional[str] = None
    team_id: Optional[int] = None


# ── Quality ─────────────────────────────────────────────────────────────
class QualityIssueResult(BaseModel):
    issue_type: str
    description: str


class DataQualityIssueRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    task_log_id: int
    issue_type: str
    description: Optional[str] = None
    status: str
    created_at: datetime


# ── Budget Forecast ─────────────────────────────────────────────────────
class BudgetForecastBase(BaseModel):
    year: int
    total_hours: float
    forecast_type: str
    workforce_type: str = "정규직"
    hourly_rate: Optional[float] = None
    notes: Optional[str] = None


class BudgetForecastCreate(BudgetForecastBase):
    pass


class BudgetForecastRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    year: int
    region: Optional[str] = None
    team_name: Optional[str] = None
    workforce_type: Optional[str] = None
    domain_name: Optional[str] = None
    total_hours: float
    total_cost: float
    headcount_fte: Optional[float] = None
    forecast_type: str
    notes: Optional[str] = None
    created_at: datetime


# ── Dashboard Aggregation ───────────────────────────────────────────────
class DashboardSummary(BaseModel):
    total_employees: int
    total_task_logs: int
    total_hours: float
    total_regions: int
    avg_hours_per_employee: float
    quality_issues_count: int
    budget_forecast_total: float


class RegionSummary(BaseModel):
    region: str
    employee_count: int
    total_hours: float
    total_cost: float


class MonthlyTrend(BaseModel):
    month: str
    total_hours: float
    task_count: int


class WorkTypeProportion(BaseModel):
    work_type: str
    total_hours: float
    percentage: float


class DomainDistribution(BaseModel):
    domain: str
    total_hours: float
    percentage: float


class AXInput(BaseModel):
    work_title: str
    work_detail: Optional[str] = None


from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel

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
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class DomainRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class CapabilityRead(BaseModel):
    id: int
    domain_id: int
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class ActivityRead(BaseModel):
    id: int
    capability_id: int
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class WorkTypeRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class SystemRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class TeamRead(BaseModel):
    id: int
    name: str
    department_id: Optional[int] = None

    class Config:
        orm_mode = True

class EmployeeRead(BaseModel):
    id: int
    name: str
    workforce_type: str
    team_id: Optional[int] = None

    class Config:
        orm_mode = True

class QualityIssueResult(BaseModel):
    issue_type: str
    description: str

class DataQualityIssueRead(BaseModel):
    id: int
    task_log_id: int
    issue_type: str
    description: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

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
    id: int
    year: int
    total_hours: float
    total_cost: float
    forecast_type: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True

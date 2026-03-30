from datetime import datetime
from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from .database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    teams = relationship("Team", back_populates="department")

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    department = relationship("Department", back_populates="teams")
    employees = relationship("Employee", back_populates="team")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    workforce_type = Column(String(64), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    team = relationship("Team", back_populates="employees")
    task_logs = relationship("TaskLog", back_populates="employee")

class System(Base):
    __tablename__ = "systems"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    task_logs = relationship("TaskLog", back_populates="system")

class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    capabilities = relationship("Capability", back_populates="domain")

class Capability(Base):
    __tablename__ = "capabilities"

    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    domain = relationship("Domain", back_populates="capabilities")
    activities = relationship("Activity", back_populates="capability")
    task_logs = relationship("TaskLog", back_populates="capability")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    capability_id = Column(Integer, ForeignKey("capabilities.id"), nullable=False)
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    capability = relationship("Capability", back_populates="activities")
    task_logs = relationship("TaskLog", back_populates="activity")

class WorkType(Base):
    __tablename__ = "work_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    task_logs = relationship("TaskLog", back_populates="work_type")

class TaskLog(Base):
    __tablename__ = "task_logs"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    workforce_type = Column(String(64), nullable=False)
    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    capability_id = Column(Integer, ForeignKey("capabilities.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    work_type_id = Column(Integer, ForeignKey("work_types.id"), nullable=False)
    system_id = Column(Integer, ForeignKey("systems.id"), nullable=False)
    hours = Column(Float, nullable=False)
    difficulty = Column(String(64), nullable=True)
    recurrence = Column(String(64), nullable=True)
    impact = Column(String(64), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    employee = relationship("Employee", back_populates="task_logs")
    team = relationship("Team")
    domain = relationship("Domain")
    capability = relationship("Capability", back_populates="task_logs")
    activity = relationship("Activity", back_populates="task_logs")
    work_type = relationship("WorkType", back_populates="task_logs")
    system = relationship("System", back_populates="task_logs")

class DataQualityIssue(Base):
    __tablename__ = "data_quality_issues"

    id = Column(Integer, primary_key=True, index=True)
    task_log_id = Column(Integer, ForeignKey("task_logs.id"), nullable=False)
    issue_type = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(64), nullable=False, default="OPEN")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class BudgetForecast(Base):
    __tablename__ = "budget_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, nullable=False)
    total_hours = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    forecast_type = Column(String(64), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

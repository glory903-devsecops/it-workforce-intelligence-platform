"""Backward-compatible CRUD module — delegates to repository & use_cases.

This module exists for backwards compatibility. New code should import
directly from repository or use_cases.
"""

from .use_cases import (
    DEFAULT_HOURLY_RATES,
    validate_task_log,
    create_task_log,
    create_budget_forecast,
)
from .repository import (
    get_master_items,
    get_task_logs,
    get_data_quality_issues,
    get_budget_forecasts,
)

__all__ = [
    "DEFAULT_HOURLY_RATES",
    "validate_task_log",
    "create_task_log",
    "create_budget_forecast",
    "get_master_items",
    "get_task_logs",
    "get_data_quality_issues",
    "get_budget_forecasts",
]

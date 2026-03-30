export interface TaskLogCreate {
  date: string;
  employee_id: number;
  team_id: number;
  workforce_type: string;
  domain_id: number;
  capability_id: number;
  activity_id: number;
  work_type_id: number;
  system_id: number;
  hours: number;
  difficulty?: string;
  recurrence?: string;
  impact?: string;
  notes?: string;
}

export interface Domain {
  id: number;
  name: string;
  description?: string;
}

export interface Capability {
  id: number;
  domain_id: number;
  name: string;
  description?: string;
}

export interface Activity {
  id: number;
  capability_id: number;
  name: string;
  description?: string;
}

export interface Team {
  id: number;
  name: string;
  department_id?: number;
}

export interface Employee {
  id: number;
  name: string;
  workforce_type: string;
  team_id?: number;
}

export interface WorkType {
  id: number;
  name: string;
  description?: string;
}

export interface System {
  id: number;
  name: string;
  description?: string;
}

export interface QualityIssueResult {
  issue_type: string;
  description: string;
}

export interface DataQualityIssue {
  id: number;
  task_log_id: number;
  issue_type: string;
  description?: string;
  status: string;
  created_at: string;
}

export interface BudgetForecastCreate {
  year: number;
  total_hours: number;
  forecast_type: string;
  workforce_type: string;
  hourly_rate?: number;
  notes?: string;
}

export interface BudgetForecastRead {
  id: number;
  year: number;
  total_hours: number;
  total_cost: number;
  forecast_type: string;
  notes?: string;
  created_at: string;
}

import axios from "axios";
import type { BudgetForecastCreate, TaskLogCreate } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000",
});

export const fetchDomains = async () =>
  api.get("/domains").then((result) => result.data);
export const fetchCapabilities = async () =>
  api.get("/capabilities").then((result) => result.data);
export const fetchActivities = async () =>
  api.get("/activities").then((result) => result.data);
export const fetchTeams = async () =>
  api.get("/teams").then((result) => result.data);
export const fetchEmployees = async () =>
  api.get("/employees").then((result) => result.data);
export const fetchWorkTypes = async () =>
  api.get("/work-types").then((result) => result.data);
export const fetchSystems = async () =>
  api.get("/systems").then((result) => result.data);
export const fetchQualityIssues = async () =>
  api.get("/data-quality-issues").then((result) => result.data);

export const createTaskLog = async (payload: TaskLogCreate) =>
  api.post("/task-logs", payload).then((result) => result.data);
export const validateTaskLog = async (payload: TaskLogCreate) =>
  api.post("/task-logs/validate", payload).then((result) => result.data);
export const createBudgetForecast = async (payload: BudgetForecastCreate) =>
  api.post("/budget-forecasts", payload).then((result) => result.data);
export const fetchBudgetForecasts = async () =>
  api.get("/budget-forecasts").then((result) => result.data);

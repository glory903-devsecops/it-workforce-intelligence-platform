import axios from "axios";
import type { BudgetForecastCreate, TaskLogCreate } from "./types";
import * as mock from "./mockData";

const API_BASE = import.meta.env.VITE_API_BASE || "";

// If no API base is set (GitHub Pages), use mock data
const useMock = !API_BASE;

const api = axios.create({
  baseURL: API_BASE || "http://localhost:8000",
});

// ── Metadata ────────────────────────────────────────────────────────────
export const fetchDomains = async () =>
  useMock ? mock.mockDomains : api.get("/domains").then((r) => r.data);

export const fetchCapabilities = async () =>
  useMock ? mock.mockCapabilities : api.get("/capabilities").then((r) => r.data);

export const fetchActivities = async () =>
  useMock ? mock.mockActivities : api.get("/activities").then((r) => r.data);

export const fetchTeams = async () =>
  useMock ? mock.mockTeams : api.get("/teams").then((r) => r.data);

export const fetchEmployees = async () =>
  useMock ? mock.mockEmployees : api.get("/employees").then((r) => r.data);

export const fetchWorkTypes = async () =>
  useMock ? mock.mockWorkTypes : api.get("/work-types").then((r) => r.data);

export const fetchSystems = async () =>
  useMock ? mock.mockSystems : api.get("/systems").then((r) => r.data);

// ── Quality ─────────────────────────────────────────────────────────────
export const fetchQualityIssues = async () =>
  useMock ? mock.mockQualityIssues : api.get("/data-quality-issues").then((r) => r.data);

// ── Task Logs ───────────────────────────────────────────────────────────
export const createTaskLog = async (payload: TaskLogCreate) =>
  useMock
    ? { ...payload, id: Date.now(), created_at: new Date().toISOString() }
    : api.post("/task-logs", payload).then((r) => r.data);

export const validateTaskLog = async (payload: TaskLogCreate) =>
  useMock ? [] : api.post("/task-logs/validate", payload).then((r) => r.data);

// ── Budget Forecasts ────────────────────────────────────────────────────
export const fetchBudgetForecasts = async () =>
  useMock ? mock.mockBudgetForecasts : api.get("/budget-forecasts").then((r) => r.data);

export const createBudgetForecast = async (payload: BudgetForecastCreate) =>
  useMock
    ? { ...payload, id: Date.now(), total_cost: payload.total_hours * (payload.hourly_rate || 30000), created_at: new Date().toISOString() }
    : api.post("/budget-forecasts", payload).then((r) => r.data);

export const generate2026Budget = async () =>
  useMock
    ? { message: "Demo 모드에서는 예산이 이미 생성되어 있습니다.", count: 5 }
    : api.post("/budget-forecasts/generate-2026").then((r) => r.data);

// ── Dashboard ───────────────────────────────────────────────────────────
export const fetchDashboardSummary = async () =>
  useMock ? mock.mockDashboardSummary : api.get("/dashboard/summary").then((r) => r.data);

export const fetchRegionSummary = async () =>
  useMock ? mock.mockRegionSummary : api.get("/dashboard/by-region").then((r) => r.data);

export const fetchMonthlyTrend = async () =>
  useMock ? mock.mockMonthlyTrend : api.get("/dashboard/monthly-trend").then((r) => r.data);

export const fetchWorkTypeDistribution = async () =>
  useMock ? mock.mockWorkTypeDistribution : api.get("/dashboard/work-type-distribution").then((r) => r.data);

export const fetchDomainDistribution = async () =>
  useMock ? mock.mockDomainDistribution : api.get("/dashboard/domain-distribution").then((r) => r.data);

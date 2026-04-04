import { test, expect } from "@playwright/test";
import fs from "fs/promises";

const metadata = {
  domains: [
    { id: 1, name: "Infrastructure Operations", description: "인프라 운영" },
  ],
  capabilities: [
    {
      id: 1,
      domain_id: 1,
      name: "Server Management",
      description: "서버 관리",
    },
  ],
  activities: [
    {
      id: 1,
      capability_id: 1,
      name: "서버 패치",
      description: "서버 패치 수행",
    },
  ],
  teams: [{ id: 1, name: "인프라팀", department_id: 1 }],
  employees: [{ id: 1, name: "홍길동", workforce_type: "정규직", team_id: 1 }],
  workTypes: [{ id: 1, name: "BAU", description: "일상 운영" }],
  systems: [{ id: 1, name: "ERP 시스템", description: "주요 ERP 시스템" }],
};

const forecastResponse = [
  {
    id: 1,
    year: 2026,
    total_hours: 1600,
    total_cost: 144000000,
    forecast_type: "Historical",
    notes: "시연 테스트",
    created_at: new Date().toISOString(),
  },
];

const qualityResponse = [
  {
    id: 1,
    task_log_id: 1,
    issue_type: "과다시간 입력",
    description: "12시간 초과 업무 기록",
    status: "OPEN",
    created_at: new Date().toISOString(),
  },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/domains", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata.domains),
    }),
  );
  await page.route("**/capabilities", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata.capabilities),
    }),
  );
  await page.route("**/activities", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata.activities),
    }),
  );
  await page.route("**/teams", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata.teams),
    }),
  );
  await page.route("**/employees", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata.employees),
    }),
  );
  await page.route("**/work-types", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata.workTypes),
    }),
  );
  await page.route("**/systems", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata.systems),
    }),
  );
  await page.route("**/budget-forecasts", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(forecastResponse),
    }),
  );
  await page.route("**/data-quality-issues", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(qualityResponse),
    }),
  );
});

test("dashboard shows summary cards and navigation flows to industrial modules", async ({
  page,
}) => {
  await page.goto("/");

  // Check for New Hero Title (Industrial Theme)
  await expect(page.locator("h1")).toContainText(
    "DYNAMICRESOURCES",
  );

  // Navigate to SW Sales Terminal (Task Log)
  await page.getByRole("button", { name: /SW Sales Terminal/i }).click();
  await expect(page).toHaveURL(/\/app\/task-log/);
  await expect(page.getByText("Data Quality Governance Terminal")).toBeVisible();

  // Navigate to Insight Hub (Dashboard) from sidebar
  await page.getByRole("link", { name: /Dashboard/i }).click();
  await expect(page).toHaveURL(/\/app\/dashboard/);
  await expect(page.getByText("Aggregating Enterprise Data")).toBeVisible(); // Loading or title

  // Verify Budget Forecast visibility
  await page.getByRole("link", { name: /Budget/i }).click();
  await expect(page.getByText("Aggregate Q4 Load Plan")).toBeVisible();
});

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

test("dashboard shows summary cards and exports CSV for budget and quality data", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.locator("h1")).toContainText(
    "IT Workforce Intelligence Platform",
  );

  await page.getByRole("button", { name: "예산 예측" }).click();
  await expect(page.getByText("예측 개수")).toBeVisible();
  await expect(page.getByText("총 예상 비용")).toBeVisible();

  const [budgetDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "CSV 다운로드" }).click(),
  ]);

  expect(await budgetDownload.suggestedFilename()).toBe("budget-forecasts.csv");
  const budgetPath = await budgetDownload.path();
  expect(budgetPath).not.toBeNull();
  const budgetCsv = await fs.readFile(budgetPath!, "utf-8");
  expect(budgetCsv).toContain("예측 ID");
  expect(budgetCsv).toContain("시연 테스트");

  await page.getByRole("button", { name: "품질 모니터" }).click();
  await expect(page.getByText("전체 이슈")).toBeVisible();
  await expect(page.getByText("Open 이슈")).toBeVisible();

  const [qualityDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "CSV 다운로드" }).click(),
  ]);

  expect(await qualityDownload.suggestedFilename()).toBe("quality-issues.csv");
  const qualityPath = await qualityDownload.path();
  expect(qualityPath).not.toBeNull();
  const qualityCsv = await fs.readFile(qualityPath!, "utf-8");
  expect(qualityCsv).toContain("이슈 유형");
  expect(qualityCsv).toContain("과다시간 입력");
});

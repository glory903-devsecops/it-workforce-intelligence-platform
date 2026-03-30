import { ChangeEvent, useEffect, useState } from "react";
import {
  createBudgetForecast,
  createTaskLog,
  fetchActivities,
  fetchBudgetForecasts,
  fetchCapabilities,
  fetchQualityIssues,
  fetchDomains,
  fetchEmployees,
  fetchSystems,
  fetchTeams,
  fetchWorkTypes,
} from "./api";
import type {
  Activity,
  BudgetForecastCreate,
  BudgetForecastRead,
  Capability,
  DataQualityIssue,
  Domain,
  Employee,
  TaskLogCreate,
  Team,
  WorkType,
  System,
} from "./types";

const defaultTaskData: TaskLogCreate = {
  date: new Date().toISOString().slice(0, 10),
  employee_id: 1,
  team_id: 1,
  workforce_type: "정규직",
  domain_id: 1,
  capability_id: 1,
  activity_id: 1,
  work_type_id: 1,
  system_id: 1,
  hours: 1,
  difficulty: "보통",
  recurrence: "일상",
  impact: "중간",
  notes: "",
};

const defaultForecastData: BudgetForecastCreate = {
  year: new Date().getFullYear(),
  total_hours: 1760,
  forecast_type: "Historical",
  workforce_type: "정규직",
  hourly_rate: 90000,
  notes: "",
};

type PageView = "log" | "quality" | "budget";

function App() {
  const [page, setPage] = useState<PageView>("log");
  const [taskLog, setTaskLog] = useState<TaskLogCreate>(defaultTaskData);
  const [forecastForm, setForecastForm] =
    useState<BudgetForecastCreate>(defaultForecastData);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [qualityIssues, setQualityIssues] = useState<DataQualityIssue[]>([]);
  const [forecasts, setForecasts] = useState<BudgetForecastRead[]>([]);
  const [message, setMessage] = useState<string>("");

  const selectedCapabilities = capabilities.filter(
    (item) => item.domain_id === taskLog.domain_id,
  );
  const selectedActivities = activities.filter(
    (item) => item.capability_id === taskLog.capability_id,
  );

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [
          domainData,
          capabilityData,
          activityData,
          teamData,
          employeeData,
          workTypeData,
          systemData,
        ] = await Promise.all([
          fetchDomains(),
          fetchCapabilities(),
          fetchActivities(),
          fetchTeams(),
          fetchEmployees(),
          fetchWorkTypes(),
          fetchSystems(),
        ]);

        setDomains(domainData);
        setCapabilities(capabilityData);
        setActivities(activityData);
        setTeams(teamData);
        setEmployees(employeeData);
        setWorkTypes(workTypeData);
        setSystems(systemData);

        setTaskLog((current) => ({
          ...current,
          employee_id: employeeData[0]?.id ?? current.employee_id,
          team_id: teamData[0]?.id ?? current.team_id,
          domain_id: domainData[0]?.id ?? current.domain_id,
          capability_id: capabilityData[0]?.id ?? current.capability_id,
          activity_id: activityData[0]?.id ?? current.activity_id,
          work_type_id: workTypeData[0]?.id ?? current.work_type_id,
          system_id: systemData[0]?.id ?? current.system_id,
        }));
      } catch (error) {
        console.error(error);
        setMessage("메타데이터를 불러오는 중 오류가 발생했습니다.");
      }
    }

    loadMetadata();
  }, []);

  useEffect(() => {
    if (page === "quality") {
      fetchDataQualityIssues()
        .then(setQualityIssues)
        .catch((error) => {
          console.error(error);
          setMessage("데이터 품질 이슈를 불러오는 중 오류가 발생했습니다.");
        });
    }

    if (page === "budget") {
      fetchBudgetForecasts()
        .then(setForecasts)
        .catch((error) => {
          console.error(error);
          setMessage("예산 예측 목록을 불러오는 중 오류가 발생했습니다.");
        });
    }
  }, [page]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    const parsedValue =
      name === "hours" ||
      name.endsWith("_id") ||
      name === "total_hours" ||
      name === "year" ||
      name === "hourly_rate"
        ? Number(value)
        : value;

    if (name in taskLog) {
      setTaskLog((current) => {
        const next = {
          ...current,
          [name]: parsedValue,
        };

        if (name === "domain_id") {
          const nextCapabilityId =
            capabilities.find((item) => item.domain_id === Number(value))?.id ??
            current.capability_id;
          const nextActivityId =
            activities.find((item) => item.capability_id === nextCapabilityId)
              ?.id ?? current.activity_id;
          return {
            ...next,
            capability_id: nextCapabilityId,
            activity_id: nextActivityId,
          };
        }

        if (name === "capability_id") {
          const nextActivityId =
            activities.find((item) => item.capability_id === Number(value))
              ?.id ?? current.activity_id;
          return {
            ...next,
            activity_id: nextActivityId,
          };
        }

        return next;
      });
      return;
    }

    setForecastForm((current) => ({
      ...current,
      [name]: parsedValue,
    }));
  };

  const submitTaskLog = async () => {
    try {
      await createTaskLog(taskLog);
      setMessage("업무 기록이 성공적으로 저장되었습니다.");
      setTaskLog(defaultTaskData);
    } catch (error) {
      console.error(error);
      setMessage("서버 저장 중 오류가 발생했습니다.");
    }
  };

  const submitForecast = async () => {
    try {
      await createBudgetForecast(forecastForm);
      setMessage("예산 예측이 저장되었습니다.");
      const latestForecasts = await fetchBudgetForecasts();
      setForecasts(latestForecasts);
    } catch (error) {
      console.error(error);
      setMessage("예산 예측 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>IT Workforce Intelligence Platform</h1>
        <p>Capability 기반 업무 기록 · 분석 · 예산 예측</p>
      </header>

      <nav className="page-tabs">
        <button
          className={page === "log" ? "active" : ""}
          onClick={() => setPage("log")}
        >
          업무 기록
        </button>
        <button
          className={page === "quality" ? "active" : ""}
          onClick={() => setPage("quality")}
        >
          품질 모니터
        </button>
        <button
          className={page === "budget" ? "active" : ""}
          onClick={() => setPage("budget")}
        >
          예산 예측
        </button>
      </nav>

      <main>
        {page === "log" && (
          <section className="panel">
            <h2>일일 업무 기록</h2>
            <div className="form-grid">
              <label>
                날짜
                <input
                  type="date"
                  name="date"
                  value={taskLog.date}
                  onChange={handleChange}
                />
              </label>
              <label>
                직원
                <select
                  name="employee_id"
                  value={taskLog.employee_id}
                  onChange={handleChange}
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.workforce_type})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                팀
                <select
                  name="team_id"
                  value={taskLog.team_id}
                  onChange={handleChange}
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                인력 유형
                <select
                  name="workforce_type"
                  value={taskLog.workforce_type}
                  onChange={handleChange}
                >
                  <option>정규직</option>
                  <option>계약직</option>
                  <option>외주</option>
                </select>
              </label>
              <label>
                Domain
                <select
                  name="domain_id"
                  value={taskLog.domain_id}
                  onChange={handleChange}
                >
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Capability
                <select
                  name="capability_id"
                  value={taskLog.capability_id}
                  onChange={handleChange}
                >
                  {selectedCapabilities.map((capability) => (
                    <option key={capability.id} value={capability.id}>
                      {capability.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Activity
                <select
                  name="activity_id"
                  value={taskLog.activity_id}
                  onChange={handleChange}
                >
                  {selectedActivities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Work Type
                <select
                  name="work_type_id"
                  value={taskLog.work_type_id}
                  onChange={handleChange}
                >
                  {workTypes.map((workType) => (
                    <option key={workType.id} value={workType.id}>
                      {workType.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                시스템
                <select
                  name="system_id"
                  value={taskLog.system_id}
                  onChange={handleChange}
                >
                  {systems.map((system) => (
                    <option key={system.id} value={system.id}>
                      {system.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                시간
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  name="hours"
                  value={taskLog.hours}
                  onChange={handleChange}
                />
              </label>
              <label>
                난이도
                <input
                  type="text"
                  name="difficulty"
                  value={taskLog.difficulty ?? ""}
                  onChange={handleChange}
                />
              </label>
              <label>
                반복 주기
                <input
                  type="text"
                  name="recurrence"
                  value={taskLog.recurrence ?? ""}
                  onChange={handleChange}
                />
              </label>
              <label>
                영향도
                <input
                  type="text"
                  name="impact"
                  value={taskLog.impact ?? ""}
                  onChange={handleChange}
                />
              </label>
              <label className="full-width">
                메모
                <textarea
                  name="notes"
                  value={taskLog.notes ?? ""}
                  onChange={handleChange}
                  rows={4}
                />
              </label>
            </div>
            <button
              type="button"
              onClick={submitTaskLog}
              className="primary-btn"
            >
              기록 저장
            </button>
          </section>
        )}

        {page === "quality" && (
          <section className="panel">
            <h2>품질 모니터</h2>
            {qualityIssues.length === 0 ? (
              <p>현재 데이터 품질 이슈가 없습니다.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Task Log ID</th>
                      <th>이슈 유형</th>
                      <th>설명</th>
                      <th>상태</th>
                      <th>생성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualityIssues.map((issue) => (
                      <tr key={issue.id}>
                        <td>{issue.id}</td>
                        <td>{issue.task_log_id}</td>
                        <td>{issue.issue_type}</td>
                        <td>{issue.description ?? "-"}</td>
                        <td>{issue.status}</td>
                        <td>{new Date(issue.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {page === "budget" && (
          <section className="panel">
            <h2>예산 예측</h2>
            <div className="form-grid">
              <label>
                연도
                <input
                  type="number"
                  name="year"
                  value={forecastForm.year}
                  onChange={handleChange}
                />
              </label>
              <label>
                총 예상 시간
                <input
                  type="number"
                  name="total_hours"
                  value={forecastForm.total_hours}
                  onChange={handleChange}
                />
              </label>
              <label>
                예측 방식
                <input
                  type="text"
                  name="forecast_type"
                  value={forecastForm.forecast_type}
                  onChange={handleChange}
                />
              </label>
              <label>
                인력 유형
                <select
                  name="workforce_type"
                  value={forecastForm.workforce_type}
                  onChange={handleChange}
                >
                  <option>정규직</option>
                  <option>계약직</option>
                  <option>외주</option>
                </select>
              </label>
              <label>
                시간당 비용
                <input
                  type="number"
                  name="hourly_rate"
                  value={forecastForm.hourly_rate ?? 0}
                  onChange={handleChange}
                />
              </label>
              <label className="full-width">
                메모
                <textarea
                  name="notes"
                  value={forecastForm.notes ?? ""}
                  onChange={handleChange}
                  rows={4}
                />
              </label>
            </div>
            <button
              type="button"
              onClick={submitForecast}
              className="primary-btn"
            >
              예측 저장
            </button>
            <div className="table-wrapper" style={{ marginTop: 24 }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>연도</th>
                    <th>총 시간</th>
                    <th>예측 방식</th>
                    <th>비용</th>
                    <th>생성일</th>
                  </tr>
                </thead>
                <tbody>
                  {forecasts.map((forecast) => (
                    <tr key={forecast.id}>
                      <td>{forecast.id}</td>
                      <td>{forecast.year}</td>
                      <td>{forecast.total_hours}</td>
                      <td>{forecast.forecast_type}</td>
                      <td>{forecast.total_cost.toLocaleString()}원</td>
                      <td>{new Date(forecast.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {message && <p className="status-message">{message}</p>}
      </main>
    </div>
  );
}

export default App;

import { ChangeEvent, useEffect, useState } from "react";
import {
  fetchDomains, fetchCapabilities, fetchActivities,
  fetchTeams, fetchEmployees, fetchWorkTypes, fetchSystems,
  createTaskLog,
} from "../api";
import type {
  Domain, Capability, Activity, Team, Employee, WorkType, System, TaskLogCreate,
} from "../types";

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

export default function TaskLogPage() {
  const [taskLog, setTaskLog] = useState<TaskLogCreate>(defaultTaskData);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const [message, setMessage] = useState("");

  const selectedCapabilities = capabilities.filter((c) => c.domain_id === taskLog.domain_id);
  const selectedActivities = activities.filter((a) => a.capability_id === taskLog.capability_id);

  useEffect(() => {
    Promise.all([
      fetchDomains(), fetchCapabilities(), fetchActivities(),
      fetchTeams(), fetchEmployees(), fetchWorkTypes(), fetchSystems(),
    ]).then(([d, c, a, t, e, w, s]) => {
      setDomains(d); setCapabilities(c); setActivities(a);
      setTeams(t); setEmployees(e); setWorkTypes(w); setSystems(s);
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parsed = name === "hours" || name.endsWith("_id") ? Number(value) : value;
    setTaskLog((prev) => {
      const next = { ...prev, [name]: parsed };
      if (name === "domain_id") {
        const cap = capabilities.find((c) => c.domain_id === Number(value));
        const act = cap ? activities.find((a) => a.capability_id === cap.id) : undefined;
        return { ...next, capability_id: cap?.id ?? prev.capability_id, activity_id: act?.id ?? prev.activity_id };
      }
      if (name === "capability_id") {
        const act = activities.find((a) => a.capability_id === Number(value));
        return { ...next, activity_id: act?.id ?? prev.activity_id };
      }
      return next;
    });
  };

  const submit = async () => {
    try {
      await createTaskLog(taskLog);
      setMessage("✅ 업무 기록이 성공적으로 저장되었습니다.");
      setTaskLog(defaultTaskData);
    } catch {
      setMessage("❌ 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-midas-gold)" }}>
          📝 일일 업무 기록
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--color-midas-text-secondary)" }}>
          영업 담당자의 일일 업무를 표준화된 항목으로 기록합니다. 기록된 데이터는 리소스 분석 및 예산 예측에 활용됩니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="form-label">
            날짜
            <input type="date" name="date" value={taskLog.date} onChange={handleChange} className="form-input" />
          </label>

          <label className="form-label">
            직원
            <select name="employee_id" value={taskLog.employee_id} onChange={handleChange} className="form-input">
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.workforce_type})</option>)}
            </select>
          </label>

          <label className="form-label">
            팀
            <select name="team_id" value={taskLog.team_id} onChange={handleChange} className="form-input">
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>

          <label className="form-label">
            인력 유형
            <select name="workforce_type" value={taskLog.workforce_type} onChange={handleChange} className="form-input">
              <option>정규직</option>
              <option>계약직</option>
              <option>외주</option>
            </select>
          </label>

          <label className="form-label">
            Domain
            <select name="domain_id" value={taskLog.domain_id} onChange={handleChange} className="form-input">
              {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </label>

          <label className="form-label">
            Capability
            <select name="capability_id" value={taskLog.capability_id} onChange={handleChange} className="form-input">
              {selectedCapabilities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>

          <label className="form-label">
            Activity
            <select name="activity_id" value={taskLog.activity_id} onChange={handleChange} className="form-input">
              {selectedActivities.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>

          <label className="form-label">
            Work Type
            <select name="work_type_id" value={taskLog.work_type_id} onChange={handleChange} className="form-input">
              {workTypes.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </label>

          <label className="form-label">
            시스템
            <select name="system_id" value={taskLog.system_id} onChange={handleChange} className="form-input">
              {systems.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>

          <label className="form-label">
            시간 (h)
            <input type="number" min="0" step="0.25" name="hours" value={taskLog.hours} onChange={handleChange} className="form-input" />
          </label>

          <label className="form-label">
            난이도
            <select name="difficulty" value={taskLog.difficulty ?? "보통"} onChange={handleChange} className="form-input">
              <option>쉬움</option>
              <option>보통</option>
              <option>어려움</option>
            </select>
          </label>

          <label className="form-label">
            영향도
            <select name="impact" value={taskLog.impact ?? "중간"} onChange={handleChange} className="form-input">
              <option>낮음</option>
              <option>중간</option>
              <option>높음</option>
              <option>매우 높음</option>
            </select>
          </label>

          <label className="form-label col-span-full">
            메모
            <textarea name="notes" value={taskLog.notes ?? ""} onChange={handleChange} rows={3} className="form-input" placeholder="업무 관련 참고 사항을 입력하세요..." />
          </label>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button onClick={submit} className="btn-primary">기록 저장</button>
          {message && (
            <span className="text-sm" style={{ color: message.startsWith("✅") ? "var(--color-midas-success)" : "var(--color-midas-error)" }}>
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

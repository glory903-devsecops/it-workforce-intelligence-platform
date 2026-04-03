import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import {
  fetchDashboardSummary, fetchRegionSummary, fetchMonthlyTrend,
  fetchWorkTypeDistribution, fetchDomainDistribution,
} from "../api";

const CHART_COLORS = ["#F5A623", "#FFC857", "#1B3A6B", "#2A5299", "#22C55E", "#EAB308", "#EF4444", "#94A3B8"];

interface SummaryData {
  total_employees: number;
  total_task_logs: number;
  total_hours: number;
  total_regions: number;
  avg_hours_per_employee: number;
  quality_issues_count: number;
  budget_forecast_total: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [workTypes, setWorkTypes] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardSummary().then(setSummary);
    fetchRegionSummary().then(setRegions);
    fetchMonthlyTrend().then(setMonthly);
    fetchWorkTypeDistribution().then(setWorkTypes);
    fetchDomainDistribution().then(setDomains);
  }, []);

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg" style={{ color: "var(--color-midas-text-secondary)" }}>
          데이터 로딩 중...
        </div>
      </div>
    );
  }

  const kpiCards = [
    { label: "전체 영업 인력", value: `${summary.total_employees}명`, icon: "👥", color: "#F5A623" },
    { label: "전체 업무 건수", value: summary.total_task_logs.toLocaleString(), icon: "📋", color: "#22C55E" },
    { label: "총 투입 시간", value: `${summary.total_hours.toLocaleString()}h`, icon: "⏱️", color: "#2A5299" },
    { label: "담당 지역", value: `${summary.total_regions}개 지역`, icon: "🌏", color: "#FFC857" },
    { label: "인당 평균 시간", value: `${summary.avg_hours_per_employee.toLocaleString()}h`, icon: "📊", color: "#EAB308" },
    { label: "2026 예산 총액", value: `${(summary.budget_forecast_total / 100000000).toFixed(0)}억원`, icon: "💰", color: "#F5A623" },
  ];

  return (
    <div className="fade-in space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="glass-card p-5 hover-lift">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="text-xs" style={{ color: "var(--color-midas-text-secondary)" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-midas-gold)" }}>
            📈 월별 업무 시간 추이 (2025)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5A623" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#1E2D45", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
              />
              <Area type="monotone" dataKey="total_hours" stroke="#F5A623" fill="url(#goldGradient)" strokeWidth={2} name="투입 시간" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Region Bar Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-midas-gold)" }}>
            🗺️ 지역별 업무 시간
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regions} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#94A3B8" fontSize={12} />
              <YAxis type="category" dataKey="region" stroke="#94A3B8" fontSize={12} width={50} />
              <Tooltip
                contentStyle={{ background: "#1E2D45", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
              />
              <Bar dataKey="total_hours" fill="#F5A623" radius={[0, 6, 6, 0]} name="총 시간" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Type Pie */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-midas-gold)" }}>
            🔄 업무 유형별 비율
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={workTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="total_hours"
                nameKey="work_type"
                label={({ work_type, percentage }) => `${work_type} ${percentage}%`}
              >
                {workTypes.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1E2D45", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-midas-gold)" }}>
            🎯 도메인별 업무 분포
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={domains}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="domain" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#1E2D45", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
              />
              <Bar dataKey="total_hours" radius={[6, 6, 0, 0]} name="총 시간">
                {domains.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Region Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-midas-gold)" }}>
          📋 지역별 상세 요약
        </h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>지역</th>
                <th>인력 수</th>
                <th>총 업무 시간</th>
                <th>총 비용</th>
                <th>인당 평균 시간</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((r, idx) => (
                <tr key={idx}>
                  <td className="font-medium">{r.region}</td>
                  <td>{r.employee_count}명</td>
                  <td>{r.total_hours.toLocaleString()}h</td>
                  <td>{(r.total_cost / 10000).toLocaleString()}만원</td>
                  <td>{(r.total_hours / (r.employee_count || 1)).toFixed(0)}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

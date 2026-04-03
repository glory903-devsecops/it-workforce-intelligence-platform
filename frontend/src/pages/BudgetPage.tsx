import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { fetchBudgetForecasts, generate2026Budget } from "../api";

const CHART_COLORS = ["#F5A623", "#FFC857", "#1B3A6B", "#2A5299", "#22C55E"];

interface Forecast {
  id: number;
  year: number;
  region?: string;
  team_name?: string;
  workforce_type?: string;
  domain_name?: string;
  total_hours: number;
  total_cost: number;
  headcount_fte?: number;
  forecast_type: string;
  notes?: string;
  created_at: string;
}

export default function BudgetPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBudgetForecasts().then(setForecasts);
  }, []);

  const handleGenerate = async () => {
    try {
      const result = await generate2026Budget();
      setMessage(`✅ ${result.message}`);
      const updated = await fetchBudgetForecasts();
      setForecasts(updated);
    } catch {
      setMessage("❌ 예산 생성 중 오류가 발생했습니다.");
    }
  };

  const totalCost = forecasts.reduce((sum, f) => sum + f.total_cost, 0);
  const totalHours = forecasts.reduce((sum, f) => sum + f.total_hours, 0);
  const totalFTE = forecasts.reduce((sum, f) => sum + (f.headcount_fte || 0), 0);

  // Group by region for chart
  const byRegion: Record<string, { total_cost: number; total_hours: number }> = {};
  forecasts.forEach((f) => {
    const key = f.region || "기타";
    if (!byRegion[key]) byRegion[key] = { total_cost: 0, total_hours: 0 };
    byRegion[key].total_cost += f.total_cost;
    byRegion[key].total_hours += f.total_hours;
  });
  const regionChartData = Object.entries(byRegion).map(([region, data]) => ({
    region,
    ...data,
    cost_억: Math.round(data.total_cost / 100000000 * 10) / 10,
  }));

  return (
    <div className="fade-in space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "2026 총 예산", value: `${(totalCost / 100000000).toFixed(1)}억원`, icon: "💰", color: "#F5A623" },
          { label: "예상 총 시간", value: `${totalHours.toLocaleString()}h`, icon: "⏱️", color: "#2A5299" },
          { label: "예상 FTE", value: `${totalFTE.toFixed(1)}명`, icon: "👥", color: "#22C55E" },
          { label: "예측 건수", value: `${forecasts.length}건`, icon: "📊", color: "#FFC857" },
        ].map((card, idx) => (
          <div key={idx} className="glass-card p-5 hover-lift">
            <div className="text-xl mb-2">{card.icon}</div>
            <div className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--color-midas-text-secondary)" }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <div className="flex items-center gap-4">
        <button onClick={handleGenerate} className="btn-primary">
          🔄 2026 예산 자동 생성
        </button>
        {message && (
          <span className="text-sm" style={{ color: message.startsWith("✅") ? "var(--color-midas-success)" : "var(--color-midas-error)" }}>
            {message}
          </span>
        )}
      </div>

      {/* Region Budget Chart */}
      {regionChartData.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-midas-gold)" }}>
            📊 지역별 2026 예산 분포 (억원)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="region" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#1E2D45", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
              />
              <Bar dataKey="cost_억" radius={[6, 6, 0, 0]} name="예산 (억원)">
                {regionChartData.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Forecasts Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-midas-gold)" }}>
          📋 2026 예산 예측 상세
        </h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>지역</th>
                <th>팀</th>
                <th>인력유형</th>
                <th>도메인</th>
                <th>예상 시간</th>
                <th>예상 FTE</th>
                <th>예상 비용</th>
                <th>방식</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.map((f) => (
                <tr key={f.id}>
                  <td>{f.region || "-"}</td>
                  <td>{f.team_name || "-"}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: f.workforce_type === "외주" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                            color: f.workforce_type === "외주" ? "#EF4444" : "#22C55E",
                          }}>
                      {f.workforce_type || "-"}
                    </span>
                  </td>
                  <td>{f.domain_name || "-"}</td>
                  <td>{f.total_hours.toLocaleString()}h</td>
                  <td>{f.headcount_fte?.toFixed(1) || "-"}</td>
                  <td className="font-medium" style={{ color: "var(--color-midas-gold)" }}>
                    {(f.total_cost / 10000).toLocaleString()}만원
                  </td>
                  <td>{f.forecast_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

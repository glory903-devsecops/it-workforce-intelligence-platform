import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { 
  Calculator, 
  Clock, 
  Users, 
  PieChart as PieIcon, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Database,
  TrendingUp,
  Coins
} from "lucide-react";
import { fetchBudgetForecasts, generate2026Budget } from "../api";

const CHART_PALETTE = ["#F59E0B", "#D97706", "#B45309", "#71717A", "#3f3f46"];

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border-amber-500/20 text-[11px] font-mono shadow-xl">
        <p className="text-zinc-500 mb-1 uppercase tracking-widest">{label}</p>
        <p className="text-amber-500 font-bold">
          {payload[0].name}: {payload[0].value.toLocaleString()} 억
        </p>
      </div>
    );
  }
  return null;
};

export default function BudgetPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchBudgetForecasts().then(setForecasts);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setMessage(null);
    try {
      const result = await generate2026Budget();
      setMessage({ text: result.message, type: 'success' });
      const updated = await fetchBudgetForecasts();
      setForecasts(updated);
    } catch {
      setMessage({ text: "예산 시뮬레이션 엔진 오류가 발생했습니다.", type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const totalCost = forecasts.reduce((sum, f) => sum + f.total_cost, 0);
  const totalHours = forecasts.reduce((sum, f) => sum + f.total_hours, 0);
  const totalFTE = forecasts.reduce((sum, f) => sum + (f.headcount_fte || 0), 0);

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
  })).sort((a, b) => b.cost_억 - a.cost_억);

  return (
    <div className="space-y-8 py-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "2026 총 예산 (PROJ)", value: `${(totalCost / 100000000).toFixed(1)}억`, icon: Coins, color: "text-amber-500" },
          { label: "예상 투입 리소스", value: `${totalHours.toLocaleString()}h`, icon: Clock, color: "text-zinc-100" },
          { label: "필요 인력 (FTE)", value: `${totalFTE.toFixed(1)} unit`, icon: Users, color: "text-zinc-100" },
          { label: "데이터 포인트", value: `${forecasts.length} pts`, icon: PieIcon, color: "text-zinc-100" },
        ].map((card, idx) => (
          <div key={idx} className="glass-card p-5 group">
            <div className="flex items-center justify-between mb-3 text-zinc-500">
              <card.icon size={18} className={idx === 0 ? "text-amber-500" : ""} />
              <span className="text-[10px] font-mono tracking-widest uppercase">Metrics</span>
            </div>
            <div className={`text-2xl font-bold font-display ${card.color}`}>{card.value}</div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Control Panel */}
      <div className="glass-card p-6 flex items-center justify-between bg-zinc-900/10 border-l-2 border-l-amber-500/50">
        <div className="space-y-1">
          <h4 className="text-zinc-200 font-display font-bold text-sm tracking-tight">예산 수립 엔진 v2.0 (Forecasting Engine)</h4>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Run simulations based on 2025 performance data</p>
        </div>
        <div className="flex items-center gap-4">
          {message && (
            <div className={`flex items-center gap-2 text-[11px] font-mono px-3 py-1.5 rounded border ${
              message.type === 'success' ? 'bg-success/5 border-success/20 text-success' : 'bg-error/5 border-error/20 text-error'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
              {message.text}
            </div>
          )}
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className={`btn-primary px-6 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'SIMULATING...' : '2026 예산 시뮬레이션'}
          </button>
        </div>
      </div>

      {/* Region Budget Distribution */}
      {regionChartData.length > 0 && (
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold flex items-center gap-2 text-zinc-200">
              <TrendingUp size={18} className="text-amber-500" /> 
              지역별 예산 할당 가시성 (단위: 억원)
            </h3>
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Forecast Model: LINEAR_REGR_V4</span>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="region" stroke="#52525b" fontSize={11} axisLine={false} tickLine={false} fontFamily="var(--font-mono)" />
                <YAxis stroke="#52525b" fontSize={11} axisLine={false} tickLine={false} fontFamily="var(--font-mono)" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.05)' }} />
                <Bar 
                  dataKey="cost_억" 
                  fill="#F59E0B" 
                  radius={[4, 4, 0, 0]} 
                  name="예산" 
                  barSize={40}
                  animationDuration={1500}
                >
                  {regionChartData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_PALETTE[idx % CHART_PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Forecast Details Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-8 py-5 border-b border-zinc-800 bg-zinc-900/20 flex items-center justify-between">
          <h3 className="font-display font-bold text-zinc-200 flex items-center gap-2">
            <Database size={18} className="text-amber-500" /> 
            2026 예산 예측 상세 데이터 (Finalized)
          </h3>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">Export: XLSX, PDF Available</span>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="data-grid">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="pl-8">운영 지역</th>
                <th>대상 팀</th>
                <th>포지션</th>
                <th>도메인</th>
                <th>예상 리소스</th>
                <th>FTE(U)</th>
                <th>예산 총액</th>
                <th className="pr-8 text-right">추론 방식</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.map((f) => (
                <tr key={f.id} className="hover:bg-amber-500/[0.02] transition-colors">
                  <td className="pl-8 font-bold text-zinc-200">{f.region || "기타"}</td>
                  <td className="text-zinc-400 text-[11px] font-mono uppercase">{f.team_name || "N/A"}</td>
                  <td>
                    <span className={`badge ${f.workforce_type === "외주" ? "badge-error" : "badge-success"}`}>
                      {f.workforce_type || "정규"}
                    </span>
                  </td>
                  <td className="text-zinc-500 text-[11px] uppercase tracking-tighter">{f.domain_name || "General"}</td>
                  <td className="font-mono text-zinc-400">{f.total_hours.toLocaleString()}h</td>
                  <td className="font-mono text-amber-500/80 font-bold">{f.headcount_fte?.toFixed(1) || "0.0"}</td>
                  <td className="font-bold text-zinc-100">
                    <span className="text-[9px] text-zinc-600 mr-1">KRW</span>
                    {(f.total_cost / 10000).toLocaleString()}만
                  </td>
                  <td className="pr-8 text-right">
                    <span className="badge badge-zinc bg-zinc-900 border-zinc-800">
                      {f.forecast_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

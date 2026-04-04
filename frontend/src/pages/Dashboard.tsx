import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { 
  Users, 
  ClipboardList, 
  Clock, 
  MapPin, 
  BarChart3, 
  CircleDollarSign,
  TrendingUp,
  Target,
  Database,
  Activity,
  Zap,
  Cpu,
  Layers,
  ArrowUpRight
} from "lucide-react";
import {
  fetchDashboardSummary, fetchRegionSummary, fetchMonthlyTrend,
  fetchWorkTypeDistribution, fetchDomainDistribution,
} from "../api";

const CHART_PALETTE = ["#F59E0B", "#D97706", "#B45309", "#78716c", "#44403c", "#292524"];

interface SummaryData {
  total_employees: number;
  total_task_logs: number;
  total_hours: number;
  total_regions: number;
  avg_hours_per_employee: number;
  quality_issues_count: number;
  budget_forecast_total: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border-amber-500/30 text-[11px] font-mono shadow-2xl backdrop-blur-xl bg-zinc-950/80">
        <p className="text-zinc-500 mb-2 uppercase tracking-[0.2em] font-black border-b border-zinc-900 pb-2">&gt; Segment: {label}</p>
        <div className="space-y-1.5">
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-8">
              <span className="text-zinc-400 capitalize">{p.name || 'Value'}:</span>
              <span className="text-amber-500 font-bold tabular-nums">
                {p.value.toLocaleString()} {p.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

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
      <div className="flex flex-col items-center justify-center p-20 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-[3px] border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={24} className="text-amber-500/50 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em] block">
            Aggregating Enterprise Data
          </span>
          <span className="text-[9px] font-mono text-zinc-700 uppercase italic">
            Source: PS_DB_CLUSTER_01
          </span>
        </div>
      </div>
    );
  }

  const kpiCards = [
    { label: "Total Workforce", value: `${summary.total_employees.toLocaleString()}`, sub: "Active Nodes", icon: Users, color: "amber" },
    { label: "Operation Logs", value: summary.total_task_logs.toLocaleString(), sub: "Last 30 Days", icon: ClipboardList, color: "blue" },
    { label: "Aggregate Hours", value: `${summary.total_hours.toLocaleString()}`, sub: "Logged Hours", icon: Clock, color: "emerald" },
    { label: "Active Regions", value: `${summary.total_regions}`, sub: "Geo Zones", icon: MapPin, color: "orange" },
    { label: "Efficiency Index", value: `${summary.avg_hours_per_employee.toFixed(1)}h`, sub: "Hours per Unit", icon: BarChart3, color: "amber" },
    { label: "Budget Forecast", value: `${(summary.budget_forecast_total / 100000000).toFixed(1)}B`, sub: "KRW / Q2", icon: CircleDollarSign, color: "amber" },
  ];

  return (
    <div className="space-y-10">
      
      {/* Top Banner Message */}
      <div className="glass-card px-6 py-3 border-amber-500/20 bg-amber-500/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={14} className="text-amber-500" />
          <span className="text-[10px] font-mono text-amber-500/80 uppercase tracking-widest font-black">
            System Alert: Resource utilization in CIVIL_NX domain exceeds 85% threshold.
          </span>
        </div>
        <button className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest hover:text-amber-500 transition-colors flex items-center gap-1 font-bold">
          View Detail <ArrowUpRight size={12} />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="glass-card p-6 group hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 scale-150">
              <card.icon size={80} />
            </div>
            <div className="flex items-center justify-between mb-5">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-all duration-500 shadow-xl">
                <card.icon size={18} />
              </div>
              <Activity size={12} className="text-zinc-800 group-hover:text-amber-900/40 transition-colors" />
            </div>
            <div className="space-y-1 relative z-10">
              <div className="text-2xl font-black font-display text-zinc-100 group-hover:text-amber-500 transition-colors tracking-tight">
                {card.value}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black">
                  {card.label}
                </span>
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                  // {card.sub}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Analytics Strip (Region & Trends) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Monthly Trend Area Chart */}
          <section className="glass-card p-8 border-zinc-800/50">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="font-display font-black text-xs uppercase tracking-[0.2em] text-zinc-200 flex items-center gap-3">
                  <TrendingUp size={16} className="text-amber-500" /> 
                  Chronological Load Stream
                </h3>
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block font-bold">Aggregate activity hours across all units</span>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  Filter: 6M
                </div>
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#3f3f46" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10} 
                    fontFamily="var(--font-mono)" 
                    fontWeight="bold"
                  />
                  <YAxis 
                    stroke="#3f3f46" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="var(--font-mono)" 
                    fontWeight="bold"
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#F59E0B', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="total_hours" 
                    stroke="#F59E0B" 
                    fill="url(#amberGradient)" 
                    strokeWidth={3} 
                    name="Aggregate Logged Hours" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Region Vertical Bar Chart */}
          <section className="glass-card p-8 border-zinc-800/50">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="font-display font-black text-xs uppercase tracking-[0.2em] text-zinc-200 flex items-center gap-3">
                  <MapPin size={16} className="text-amber-500" /> 
                  Geo-Spatial Resource Analysis
                </h3>
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block font-bold">Resource intensity by operational region</span>
              </div>
            </div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regions} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" horizontal={false} />
                  <XAxis type="number" stroke="#3f3f46" fontSize={10} axisLine={false} tickLine={false} fontFamily="var(--font-mono)" fontWeight="bold" />
                  <YAxis type="category" dataKey="region" stroke="#a1a1aa" fontSize={11} width={80} axisLine={false} tickLine={false} fontFamily="var(--font-display)" fontWeight="black" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.03)' }} />
                  <Bar 
                    dataKey="total_hours" 
                    fill="#F59E0B" 
                    radius={[0, 4, 4, 0]} 
                    name="Logged Capacity" 
                    barSize={18}
                    animationDuration={2000}
                  >
                    {regions.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? "#F59E0B" : "rgba(245, 158, 11, 0.4)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Sidebar Analytics (Donut & Distribution) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Work Type Donut */}
          <section className="glass-card p-8 border-zinc-800/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-black text-xs uppercase tracking-[0.2em] text-zinc-200 flex items-center gap-3">
                <Target size={16} className="text-amber-500" /> 
                Taxonomy Load
              </h3>
            </div>
            <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={6}
                    dataKey="total_hours"
                    nameKey="work_type"
                    animationDuration={2000}
                  >
                    {workTypes.map((_, idx) => (
                      <Cell key={idx} fill={CHART_PALETTE[idx % CHART_PALETTE.length]} stroke="#09090b" strokeWidth={4} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Total Unit</span>
                <span className="text-2xl font-black font-display text-zinc-200">{summary.total_task_logs}</span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              {workTypes.slice(0, 4).map((w, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }} />
                    <span className="text-[11px] font-display font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-tight">{w.work_type}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 tabular-nums">{((w.total_hours / summary.total_hours) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Domain Bar Chart */}
          <section className="glass-card p-8 border-zinc-800/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-black text-xs uppercase tracking-[0.2em] text-zinc-200 flex items-center gap-3">
                <Layers size={16} className="text-amber-500" /> 
                Domain Intensity
              </h3>
            </div>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domains} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis dataKey="domain" stroke="#3f3f46" fontSize={9} axisLine={false} tickLine={false} fontFamily="var(--font-mono)" fontWeight="bold" />
                  <YAxis stroke="#3f3f46" fontSize={10} axisLine={false} tickLine={false} fontFamily="var(--font-mono)" fontWeight="bold" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.03)' }} />
                  <Bar 
                    dataKey="total_hours" 
                    fill="#F59E0B" 
                    radius={[4, 4, 0, 0]} 
                    name="Intensity Value" 
                    barSize={24}
                    animationDuration={2000}
                  >
                    {domains.map((_, idx) => (
                      <Cell key={idx} fill={idx === 0 ? "#F59E0B" : "rgba(245, 158, 11, 0.3)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>

      {/* Region Detailed Table */}
      <section className="glass-card overflow-hidden border-zinc-900 shadow-2xl">
        <div className="px-8 py-5 border-b border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-zinc-600" /> 
            <h3 className="font-display font-black text-xs uppercase tracking-[0.15em] text-zinc-300">
              Regional Performance Audit
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest font-bold">
            Live Stream Enabled
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-grid">
            <thead>
              <tr>
                <th className="pl-8">Operation Node (Region)</th>
                <th>Unit Scale</th>
                <th>Aggregate Hours</th>
                <th>Estimated OpEx (KRW)</th>
                <th className="pr-8 text-right">Node Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((r, idx) => (
                <tr key={idx} className="hover:bg-amber-500/[0.03] transition-colors group">
                  <td className="pl-8">
                    <div className="flex flex-col">
                      <span className="font-display font-black text-zinc-100 group-hover:text-amber-500 transition-colors uppercase tracking-tight">{r.region}</span>
                      <span className="text-[9px] font-mono text-zinc-600">ID: RG_NODE_{idx.toString().padStart(2, '0')}</span>
                    </div>
                  </td>
                  <td className="text-zinc-400 font-mono text-[11px] font-black uppercase tracking-widest">
                    {r.employee_count} Nodes
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-100 font-mono font-black tabular-nums">{r.total_hours.toLocaleString()}</span>
                      <span className="text-[9px] font-mono text-zinc-600 uppercase">hrs</span>
                    </div>
                  </td>
                  <td className="text-zinc-500 font-mono text-[11px] tabular-nums font-bold">
                    ₩ {(r.total_cost / 10000).toLocaleString()} <span className="opacity-40 uppercase ml-1">v.unit</span>
                  </td>
                  <td className="pr-8 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-amber-500 font-mono text-[11px] font-black shadow-inner">
                        {(r.total_hours / (r.employee_count || 1)).toFixed(1)}h
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-3 border-t border-zinc-900 bg-zinc-950/40 text-center">
          <button className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest hover:text-zinc-500 transition-colors font-black">
            Sync Additional Regional Data Logs...
          </button>
        </div>
      </section>
    </div>
  );
}

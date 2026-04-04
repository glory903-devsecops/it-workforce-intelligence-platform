import { useEffect, useState } from "react";
import { Users, UserCheck, UserPlus, UserX, Search, Filter } from "lucide-react";
import { fetchEmployees } from "../api";

interface Employee {
  id: number;
  name: string;
  employee_code?: string;
  workforce_type: string;
  position?: string;
  region?: string;
  team_id?: number;
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("전체");
  const [filterType, setFilterType] = useState("전체");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRegion(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  useEffect(() => {
    fetchEmployees().then(setEmployees);
  }, []);

  const regions = ["전체", ...Array.from(new Set(employees.map((e) => e.region).filter(Boolean)))];
  const types = ["전체", "정규직", "계약직", "외주"];

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.includes(search) || (e.employee_code || "").includes(search);
    const matchRegion = filterRegion === "전체" || e.region === filterRegion;
    const matchType = filterType === "전체" || e.workforce_type === filterType;
    return matchSearch && matchRegion && matchType;
  });

  const typeCounts = {
    정규직: employees.filter((e) => e.workforce_type === "정규직").length,
    계약직: employees.filter((e) => e.workforce_type === "계약직").length,
    외주: employees.filter((e) => e.workforce_type === "외주").length,
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "정규직": return "badge-success";
      case "계약직": return "badge-amber";
      case "외주": return "badge-error";
      default: return "badge-zinc";
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 group">
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <Users size={18} />
            <span className="text-[10px] font-mono tracking-widest uppercase">Total</span>
          </div>
          <div className="text-2xl font-bold font-display text-amber-500">{employees.length}명</div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">영업 전사 인력</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <UserCheck size={18} className="text-success" />
            <span className="text-[10px] font-mono tracking-widest uppercase">Full-Time</span>
          </div>
          <div className="text-2xl font-bold font-display text-zinc-100">{typeCounts.정규직}명</div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">정규 직무자</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <UserPlus size={18} className="text-warning" />
            <span className="text-[10px] font-mono tracking-widest uppercase">Contract</span>
          </div>
          <div className="text-2xl font-bold font-display text-zinc-100">{typeCounts.계약직}명</div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">계약직/파견직</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <UserX size={18} className="text-error" />
            <span className="text-[10px] font-mono tracking-widest uppercase">Outsourced</span>
          </div>
          <div className="text-2xl font-bold font-display text-zinc-100">{typeCounts.외주}명</div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">외주 협력 인력</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4 border-l-2 border-l-amber-500/50 bg-zinc-900/10">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 사번으로 검색..."
            className="form-input w-full pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-zinc-500" />
          <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="form-input min-w-[140px]">
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="form-input min-w-[140px]">
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">
          Search Result: <span className="text-amber-500">{filtered.length} units</span> found
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-8 py-5 border-b border-zinc-800 bg-zinc-900/20 flex items-center justify-between">
          <h3 className="font-display font-bold text-zinc-200 flex items-center gap-2 tracking-tight">
            <Users size={18} className="text-amber-500" /> 
            영업 담당자 데이터베이스
          </h3>
          <span className="text-[10px] font-mono text-zinc-600 uppercase">Archive: STAFF_MASTER_V2</span>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="data-grid">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="pl-8">Employee ID</th>
                <th>Name / Identity</th>
                <th>Position</th>
                <th>Staffing Type</th>
                <th className="pr-8">Region Pool</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((emp) => (
                <tr key={emp.id} className="hover:bg-amber-500/[0.02] transition-colors">
                  <td className="pl-8 font-mono text-zinc-500 text-[11px] font-bold">
                    {emp.employee_code || "N/A"}
                  </td>
                  <td className="font-bold text-zinc-100">{emp.name}</td>
                  <td className="text-zinc-400 font-mono text-[11px]">{emp.position || "Staff"}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(emp.workforce_type)}`}>
                      {emp.workforce_type}
                    </span>
                  </td>
                  <td className="pr-8 text-zinc-500 font-medium">{emp.region || "Global"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <UserX className="mx-auto text-zinc-800" size={32} />
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">No matching personnel records found</p>
            </div>
          )}
          {filtered.length > 100 && (
            <div className="py-4 border-t border-zinc-800 bg-zinc-950/50 text-center">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Displaying first 100 records out of {filtered.length} total units
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
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

  const typeColor = (type: string) => {
    switch (type) {
      case "정규직": return { bg: "rgba(34,197,94,0.15)", color: "#22C55E" };
      case "계약직": return { bg: "rgba(234,179,8,0.15)", color: "#EAB308" };
      case "외주": return { bg: "rgba(239,68,68,0.15)", color: "#EF4444" };
      default: return { bg: "rgba(148,163,184,0.15)", color: "#94A3B8" };
    }
  };

  return (
    <div className="fade-in space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 hover-lift">
          <div className="text-xl mb-2">👥</div>
          <div className="text-2xl font-bold" style={{ color: "#F5A623" }}>{employees.length}명</div>
          <div className="text-xs mt-1" style={{ color: "var(--color-midas-text-secondary)" }}>전체 영업 인력</div>
        </div>
        <div className="glass-card p-5 hover-lift">
          <div className="text-xl mb-2">🟢</div>
          <div className="text-2xl font-bold" style={{ color: "#22C55E" }}>{typeCounts.정규직}명</div>
          <div className="text-xs mt-1" style={{ color: "var(--color-midas-text-secondary)" }}>정규직</div>
        </div>
        <div className="glass-card p-5 hover-lift">
          <div className="text-xl mb-2">🟡</div>
          <div className="text-2xl font-bold" style={{ color: "#EAB308" }}>{typeCounts.계약직}명</div>
          <div className="text-xs mt-1" style={{ color: "var(--color-midas-text-secondary)" }}>계약직</div>
        </div>
        <div className="glass-card p-5 hover-lift">
          <div className="text-xl mb-2">🔴</div>
          <div className="text-2xl font-bold" style={{ color: "#EF4444" }}>{typeCounts.외주}명</div>
          <div className="text-xs mt-1" style={{ color: "var(--color-midas-text-secondary)" }}>외주</div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 사번으로 검색..."
            className="form-input max-w-xs"
          />
          <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="form-input max-w-[150px]">
            {regions.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="form-input max-w-[150px]">
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
          <span className="text-sm" style={{ color: "var(--color-midas-text-secondary)" }}>
            {filtered.length}명 표시
          </span>
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-midas-gold)" }}>
          👥 영업 담당자 목록
        </h3>
        <div className="overflow-x-auto" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <table className="data-table">
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr>
                <th>사번</th>
                <th>이름</th>
                <th>직급</th>
                <th>인력유형</th>
                <th>지역</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((emp) => {
                const tc = typeColor(emp.workforce_type);
                return (
                  <tr key={emp.id}>
                    <td className="font-mono text-sm">{emp.employee_code || "-"}</td>
                    <td className="font-medium">{emp.name}</td>
                    <td>{emp.position || "-"}</td>
                    <td>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: tc.bg, color: tc.color }}>
                        {emp.workforce_type}
                      </span>
                    </td>
                    <td>{emp.region || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length > 100 && (
            <p className="text-sm text-center mt-4" style={{ color: "var(--color-midas-text-secondary)" }}>
              총 {filtered.length}명 중 상위 100명 표시
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

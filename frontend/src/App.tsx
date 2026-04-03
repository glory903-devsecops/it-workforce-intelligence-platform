import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import TaskLogPage from "./pages/TaskLogPage";
import QualityPage from "./pages/QualityPage";
import BudgetPage from "./pages/BudgetPage";
import EmployeePage from "./pages/EmployeePage";

const navItems = [
  { path: "/", label: "대시보드", icon: "📊" },
  { path: "/task-log", label: "업무 기록", icon: "📝" },
  { path: "/quality", label: "품질 모니터", icon: "🔍" },
  { path: "/budget", label: "예산 예측", icon: "💰" },
  { path: "/employees", label: "영업 인력", icon: "👥" },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
        style={{ background: "var(--color-midas-navy-dark)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b"
             style={{ borderColor: "var(--color-midas-border)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
               style={{ background: "var(--color-midas-gold)", color: "var(--color-midas-navy-dark)" }}>
            M
          </div>
          {sidebarOpen && (
            <div className="fade-in">
              <div className="font-bold text-sm" style={{ color: "var(--color-midas-gold)" }}>
                MIDAS
              </div>
              <div className="text-xs" style={{ color: "var(--color-midas-text-secondary)" }}>
                SW Sales Intelligence
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover-lift ${
                  isActive
                    ? "text-white"
                    : ""
                }`
              }
              style={({ isActive }) => ({
                background: isActive
                  ? "linear-gradient(135deg, var(--color-midas-gold), var(--color-midas-gold-dark))"
                  : "transparent",
                color: isActive ? "var(--color-midas-navy-dark)" : "var(--color-midas-text-secondary)",
              })}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mx-3 mb-4 py-2 rounded-xl text-sm cursor-pointer transition-colors"
          style={{
            background: "var(--color-midas-surface)",
            color: "var(--color-midas-text-secondary)",
            border: "1px solid var(--color-midas-border)",
          }}
        >
          {sidebarOpen ? "◀ 접기" : "▶"}
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Top Bar */}
        <header
          className="sticky top-0 z-40 px-8 py-4 flex items-center justify-between"
          style={{
            background: "rgba(15, 27, 45, 0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--color-midas-border)",
          }}
        >
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--color-midas-text)" }}>
              MIDAS SW 영업 인력 리소스 분석 플랫폼
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-midas-text-secondary)" }}>
              2025년 운영 데이터 기반 · 2026년 예산 예측
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(34, 197, 94, 0.15)",
                color: "var(--color-midas-success)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              ● 시스템 정상
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/task-log" element={<TaskLogPage />} />
            <Route path="/quality" element={<QualityPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

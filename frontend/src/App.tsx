import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  ClipboardList, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Activity,
  Cpu
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import TaskLogPage from "./pages/TaskLogPage";
import QualityPage from "./pages/QualityPage";
import BudgetPage from "./pages/BudgetPage";
import EmployeePage from "./pages/EmployeePage";
import LandingPage from "./pages/LandingPage";

const navItems = [
  { path: "/app/dashboard", label: "Analytics Hub", icon: LayoutDashboard },
  { path: "/app/task-log", label: "AX Terminal", icon: ClipboardList },
  { path: "/app/quality", label: "Quality Audit", icon: ShieldCheck },
  { path: "/app/budget", label: "Predictive Ops", icon: TrendingUp },
  { path: "/app/employees", label: "Resource Grid", icon: Users },
];

function MainLayout({ children, sidebarOpen, setSidebarOpen }: any) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* --- Sidebar --- */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out flex flex-col border-r border-zinc-900 bg-zinc-950/80 backdrop-blur-md ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-8 border-b border-zinc-900">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-amber-500/40 flex items-center justify-center font-black text-amber-500 text-lg shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Cpu size={22} strokeWidth={2.5} />
          </div>
          {sidebarOpen && (
            <div className="fade-in">
              <div className="font-display font-black text-xs text-zinc-100 uppercase tracking-[0.2em] leading-tight">
                Antigravity
              </div>
              <div className="text-[9px] font-mono text-amber-500/70 uppercase tracking-widest mt-0.5">
                Workforce Intelligence
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-10 px-3 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative group overflow-hidden ${
                  isActive 
                    ? "text-zinc-100 bg-zinc-900 shadow-lg shadow-black/20" 
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  )}
                  <item.icon size={18} className={isActive ? "text-amber-500" : "group-hover:text-amber-500/50 transition-colors"} />
                  {sidebarOpen && (
                    <span className="font-display tracking-tight text-[13px]">{item.label}</span>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-4 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
          
          <div className="mt-8 pt-8 border-t border-zinc-900/50">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-400 group transition-all"
            >
              <LogOut size={16} />
              {sidebarOpen && <span className="font-display tracking-tight text-[13px]">System Exit</span>}
            </NavLink>
          </div>
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="m-4 h-10 rounded-lg flex items-center justify-center transition-all bg-zinc-900/50 border border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:border-zinc-700 active:scale-95 group shadow-inner"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </aside>

      {/* --- Main Content Area --- */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out min-h-screen ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Persistent Top Header */}
        <header className="sticky top-0 z-40 px-10 py-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
          <div className="flex items-center gap-6">
            <div className="h-10 w-px bg-zinc-800" />
            <div className="space-y-1">
              <h1 className="text-sm font-display font-black text-zinc-100 uppercase tracking-[0.15em]">
                Enterprise Resource Controller
              </h1>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                <Activity size={10} className="text-amber-500/50" /> 
                System v4.2.0-STABLE // Real-time Telemetry Enabled
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-widest uppercase bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_#22C55E]" />
              Status: NOMINAL
            </div>
          </div>
        </header>

        {/* Dynamic Page Target Area */}
        <div className="p-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Route protection or layout conditional logic
  const isLanding = location.pathname === "/";

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/app/*"
        element={
          <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="task-log" element={<TaskLogPage />} />
              <Route path="quality" element={<QualityPage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="employees" element={<EmployeePage />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </MainLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

export default App;


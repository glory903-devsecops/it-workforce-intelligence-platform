import { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  Database, 
  Search, 
  FileText,
  Clock,
  ExternalLink
} from "lucide-react";
import { fetchQualityIssues } from "../api";

interface QualityIssue {
  id: number;
  task_log_id: number;
  issue_type: string;
  description?: string;
  status: string;
  created_at: string;
}

export default function QualityPage() {
  const [issues, setIssues] = useState<QualityIssue[]>([]);

  useEffect(() => {
    fetchQualityIssues().then(setIssues);
  }, []);

  const summary = {
    total: issues.length,
    open: issues.filter((i) => i.status === "OPEN").length,
    resolved: issues.filter((i) => i.status === "RESOLVED").length,
    reviewed: issues.filter((i) => i.status === "REVIEWED").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN": return "badge-error";
      case "RESOLVED": return "badge-success";
      case "REVIEWED": return "badge-amber";
      default: return "badge-zinc";
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Detected Issues", value: summary.total, icon: ShieldAlert, color: "text-amber-500", sub: "Total anomalous entries" },
          { label: "Active (Open)", value: summary.open, icon: AlertCircle, color: "text-error", sub: "Requiring immediate action" },
          { label: "Under Review", value: summary.reviewed, icon: Clock, color: "text-warning", sub: "Verification in progress" },
          { label: "Resolved", value: summary.resolved, icon: CheckCircle2, color: "text-success", sub: "Validated and corrected" },
        ].map((card, idx) => (
          <div key={idx} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3 text-zinc-500">
              <card.icon size={18} className={card.color} />
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Monitor</span>
            </div>
            <div className="text-2xl font-bold font-display text-zinc-100">{card.value}</div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Issues Management Terminal */}
      <div className="glass-card overflow-hidden">
        <div className="px-8 py-5 border-b border-zinc-800 bg-zinc-900/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity size={18} className="text-amber-500" />
            <h3 className="font-display font-bold text-zinc-200 tracking-tight">Data Quality Governance Terminal</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={12} />
              <input type="text" placeholder="FILTER LOGS..." className="form-input pl-9 py-1 text-[11px] w-48 bg-zinc-950/50" />
            </div>
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">Secured Access: ADMIN_LVL_4</span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          {issues.length === 0 ? (
            <div className="py-32 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-success/5 border border-success/10 text-success/40">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-zinc-200 font-bold">System Status: NOMINAL</p>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">No data anomalies detected in the current audit cycle</p>
              </div>
            </div>
          ) : (
            <table className="data-grid">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="pl-8">Issue UID</th>
                  <th>Source Reference</th>
                  <th>Classification</th>
                  <th>Diagnosis / Observation</th>
                  <th>Current State</th>
                  <th className="pr-8 text-right">Audit Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-amber-500/[0.02] transition-colors group">
                    <td className="pl-8 font-mono text-[11px] text-zinc-600 group-hover:text-amber-500 transition-colors">
                      #{issue.id.toString().padStart(5, '0')}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Database size={12} className="text-zinc-700" />
                        <span className="text-zinc-400 font-mono text-[11px]">LOG-{issue.task_log_id}</span>
                      </div>
                    </td>
                    <td className="font-bold text-zinc-200">{issue.issue_type}</td>
                    <td className="max-w-xs">
                      <p className="text-zinc-500 text-[11px] leading-relaxed truncate group-hover:text-zinc-300 transition-colors">
                        {issue.description || "No diagnosis provided by the automated auditor."}
                      </p>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="pr-8 text-right font-mono text-[10px] text-zinc-600">
                      {new Date(issue.created_at).toISOString().replace('T', ' ').split('.')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="px-8 py-3 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between">
          <div className="flex gap-4">
            <button className="text-[9px] font-mono text-zinc-600 uppercase hover:text-amber-500 flex items-center gap-1 transition-colors">
              <FileText size={10} /> Export Audit.log
            </button>
            <button className="text-[9px] font-mono text-zinc-600 uppercase hover:text-amber-500 flex items-center gap-1 transition-colors">
              <ExternalLink size={10} /> View Source
            </button>
          </div>
          <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
            Last Scan Completed: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

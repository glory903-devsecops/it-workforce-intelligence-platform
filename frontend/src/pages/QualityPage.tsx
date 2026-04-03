import { useEffect, useState } from "react";
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

  const statusColor = (status: string) => {
    switch (status) {
      case "OPEN": return { bg: "rgba(239,68,68,0.15)", color: "#EF4444" };
      case "RESOLVED": return { bg: "rgba(34,197,94,0.15)", color: "#22C55E" };
      case "REVIEWED": return { bg: "rgba(234,179,8,0.15)", color: "#EAB308" };
      default: return { bg: "rgba(148,163,184,0.15)", color: "#94A3B8" };
    }
  };

  return (
    <div className="fade-in space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "전체 이슈", value: summary.total, color: "#F5A623", icon: "📋" },
          { label: "Open", value: summary.open, color: "#EF4444", icon: "🔴" },
          { label: "Reviewed", value: summary.reviewed, color: "#EAB308", icon: "🟡" },
          { label: "Resolved", value: summary.resolved, color: "#22C55E", icon: "🟢" },
        ].map((card, idx) => (
          <div key={idx} className="glass-card p-5 hover-lift">
            <div className="text-xl mb-2">{card.icon}</div>
            <div className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--color-midas-text-secondary)" }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Issues Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-midas-gold)" }}>
          🔍 데이터 품질 이슈 목록
        </h3>
        {issues.length === 0 ? (
          <p style={{ color: "var(--color-midas-text-secondary)" }}>현재 데이터 품질 이슈가 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Task Log ID</th>
                  <th>이슈 유형</th>
                  <th>설명</th>
                  <th>상태</th>
                  <th>생성일</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => {
                  const sc = statusColor(issue.status);
                  return (
                    <tr key={issue.id}>
                      <td>{issue.id}</td>
                      <td>{issue.task_log_id}</td>
                      <td>{issue.issue_type}</td>
                      <td>{issue.description ?? "-"}</td>
                      <td>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

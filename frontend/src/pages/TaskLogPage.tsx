import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  History, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  ChevronRight,
  Plus,
  Cpu,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { predictSalesTaxonomy } from '../api';
import type { AXResult } from '../types';

const TaskLogPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AXResult | null>(null);

  const handleSmartAnalyze = async () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    try {
      const data = await predictSalesTaxonomy(input);
      setResult(data);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
        
        {/* Main Content Area (Left) */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          
          {/* AX Smart Assistant Terminal */}
          <section className="glass-card overflow-hidden border-amber-900/20 group hover:border-amber-500/30 transition-colors shadow-2xl">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3 text-amber-500">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">AX Intelligence Terminal // v2.4</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
            </div>
            
            <div className="p-8 space-y-6 bg-zinc-950/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] block">
                    &gt; Execute Activity Analysis
                  </label>
                  <span className="text-[9px] font-mono text-zinc-700 uppercase italic">Input source: INTERNAL_PROMPT</span>
                </div>
                <div className="relative">
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter activity log for AX classification (e.g., 'Civil NX new feature presentation...')"
                    className="w-full h-36 bg-zinc-950/80 border border-zinc-800 rounded-lg p-5 text-zinc-200 font-sans focus:outline-none focus:border-amber-500/50 transition-all resize-none placeholder:text-zinc-700 shadow-inner leading-relaxed"
                  />
                  <button 
                    onClick={handleSmartAnalyze}
                    disabled={analyzing || !input.trim()}
                    className={`absolute bottom-5 right-5 btn-primary group/btn ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {analyzing ? (
                      <span className="flex items-center gap-2">
                        <Activity size={14} className="animate-spin" /> ANALYZING...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        INITIATE AX <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* AX Analysis Result Display */}
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="p-5 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] block mb-2 font-black">Classification L1</span>
                    <div className="flex items-center gap-3 text-zinc-100 font-display font-bold text-lg">
                      <div className="p-1.5 rounded bg-amber-500/10 text-amber-500">
                        <Hash size={14} />
                      </div>
                      {result.predicted_L1 || 'GENERAL'}
                    </div>
                  </div>
                  <div className="p-5 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] block mb-2 font-black">Refined Scope L2</span>
                    <div className="flex items-center gap-3 text-zinc-100 font-display font-bold text-lg">
                      <div className="p-1.5 rounded bg-amber-500/10 text-amber-500">
                        <Target size={14} />
                      </div>
                      {result.predicted_L2 || 'SALES_OP'}
                    </div>
                  </div>
                  <div className="p-5 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] block mb-2 font-black">Confidence Index</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-amber-500 font-mono text-3xl font-black tracking-tighter">
                        {Math.round(result.confidence * 100)}%
                      </span>
                      <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest font-bold">Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Recent History Grid-Disciplined Table */}
          <section className="glass-card shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/10">
              <div className="flex items-center gap-3">
                <History size={18} className="text-zinc-600" />
                <h3 className="text-xs font-display font-black text-zinc-300 uppercase tracking-[0.15em]">Historical Audit Stream</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-px bg-zinc-800 mx-2" />
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Auto-Sync: ACTIVE</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="data-grid">
                <thead>
                  <tr>
                    <th className="pl-8">Audit TS</th>
                    <th>Classification</th>
                    <th>Activity Summary</th>
                    <th>Op_Unit</th>
                    <th className="pr-8 text-right">Integrity</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2026-04-03 14:22', product: 'CIVIL_NX', task: 'Strategic presentation for architecture guild', unit: 'SALES_PREP', status: 'VERIFIED' },
                    { date: '2026-04-03 11:05', product: 'GEN_2026', task: 'Executive meeting - A-Construction Group', unit: 'DIRECT_SALES', status: 'VERIFIED' },
                    { date: '2026-04-02 16:40', product: 'GTS_NX', task: 'Technical support Q&A and troubleshooting', unit: 'CS_SUPPORT', status: 'PENDING' },
                    { date: '2026-04-01 09:15', product: 'CIVIL_NX', task: 'Drafting sales incentive structural v2', unit: 'ADMIN_OPS', status: 'VERIFIED' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-amber-500/[0.02] transition-colors group">
                      <td className="pl-8 text-zinc-600 text-[10px] font-mono uppercase tracking-tight font-bold">{row.date}</td>
                      <td>
                        <span className="text-zinc-200 font-bold font-display tracking-tight text-[12px]">{row.product}</span>
                      </td>
                      <td className="max-w-md truncate">
                        <span className="text-zinc-500 text-[12px] group-hover:text-zinc-300 transition-colors">{row.task}</span>
                      </td>
                      <td className="text-zinc-600 text-[10px] font-mono tracking-widest">{row.unit}</td>
                      <td className="pr-8 text-right">
                        <span className={`badge ${row.status === 'VERIFIED' ? 'badge-success' : 'badge-amber'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-3 border-t border-zinc-900 bg-zinc-950/20 text-center">
              <button className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors">
                Load Additional Audit Logs (50+)
              </button>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="glass-card p-6 space-y-8 shadow-xl">
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] border-b border-zinc-800 pb-4 flex items-center gap-3 font-bold">
              <Zap size={14} className="text-amber-500" />
              Operational KPIS
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block">Quota Progress</span>
                    <span className="text-[9px] font-mono text-zinc-700 uppercase italic">Cycle: Q2-FY2026</span>
                  </div>
                  <span className="text-xl font-display text-amber-500 font-black">72.4%</span>
                </div>
                <div className="h-2 bg-zinc-900 rounded-full p-[1px] border border-zinc-800 shadow-inner overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.4)]" style={{ width: '72.4%' }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-lg bg-zinc-950/50 border border-zinc-900 shadow-inner group hover:border-zinc-800 transition-colors">
                  <span className="text-[9px] font-mono text-zinc-600 block mb-2 uppercase tracking-widest font-bold">Logs_Processed</span>
                  <div className="text-2xl font-display font-black text-zinc-200">1,284</div>
                </div>
                <div className="p-5 rounded-lg bg-zinc-950/50 border border-zinc-900 shadow-inner group hover:border-zinc-800 transition-colors">
                  <span className="text-[9px] font-mono text-zinc-600 block mb-2 uppercase tracking-widest font-bold">Node_Efficiency</span>
                  <div className="text-2xl font-display font-black text-zinc-200">94.2%</div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-900">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block font-black">System Actions</span>
                <button className="w-full flex items-center justify-between p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all font-display font-bold group">
                  <span className="text-xs uppercase tracking-widest">New Sales Proposal</span>
                  <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all font-display group">
                  <span className="text-xs uppercase tracking-widest">Database Sync</span>
                  <Cpu size={16} className="group-hover:scale-110 transition-transform opacity-50" />
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-amber-500/20 bg-amber-500/[0.03] space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <ShieldCheck size={18} className="text-amber-500" />
              </div>
              <h4 className="text-[11px] font-display font-black text-amber-500 uppercase tracking-[0.2em]">
                Strategic Intelligence
              </h4>
            </div>
            <p className="text-[13px] text-zinc-400 leading-relaxed font-sans italic opacity-80 border-l-2 border-amber-500/30 pl-4">
              "Technical product demonstrations correlate with an 18.5% increase in acquisition probability. Recommend prioritizing 'Civil NX' sessions in current Q2 cycle."
            </p>
            <div className="pt-2 flex justify-end">
              <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">Generated by AX-CORE v4</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TaskLogPage;

export default TaskLogPage;

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Loader2, 
  Zap, 
  ShieldCheck,
  Plus,
  ArrowRight
} from 'lucide-react';
import { 
  fetchEmployees, 
  fetchDomains, 
  fetchActivities, 
  fetchWorkTypes, 
  predictSalesTaxonomy,
  createTaskLog 
} from '../api';
import type { Employee, Domain, Activity, WorkType, TaskLogCreate } from '../types';

export default function SmartLogForm({ onSuccess }: { onSuccess: () => void }) {
  // Metadata
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);

  // Form State
  const [workTitle, setWorkTitle] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [hours, setHours] = useState(1.0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // AX Suggestions
  const [prediction, setPrediction] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  // UI State
  const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchEmployees(),
      fetchDomains(),
      fetchActivities(),
      fetchWorkTypes()
    ]).then(([e, d, a, w]: any) => {
      setEmployees(e);
      setDomains(d);
      setWorkTypes(w);
      console.log("Metadata loaded:", { e: e.length, d: d.length, a: a.length, w: w.length });
    });
  }, []);

  // Debounced AX Analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      if (workTitle.trim().length > 5) {
        handleAnalyze();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [workTitle]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await predictSalesTaxonomy(workTitle);
      setPrediction(result);
    } catch (e) {
      console.error("AX Prediction failed", e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !workTitle || !prediction) {
       alert("Please ensure all fields (Description, Resource) are populated.");
       return;
    }

    setSubmitting(true);
    try {
      const domainId = mappingDomainId(prediction.domain_id);
      
      const payload: TaskLogCreate = {
        date,
        employee_id: selectedEmployee.id,
        team_id: selectedEmployee.team_id || 1,
        workforce_type: selectedEmployee.workforce_type,
        domain_id: domainId,
        capability_id: 1, 
        activity_id: 1,  
        work_type_id: workTypes.find((w: WorkType) => w.name === prediction.suggested_work_type)?.id || 1,
        system_id: 1,
        hours: hours,
        notes: workTitle
      };
      
      await createTaskLog(payload);
      
      onSuccess();
      setWorkTitle('');
      setPrediction(null);
      setSelectedEmployee(null);
    } catch (e) {
      console.error("Submit Error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const mappingDomainId = (code: string) => {
    const map: any = { "SAL": 1, "PRS": 2, "MKT": 3, "PTR": 4, "ADM": 5 };
    return map[code] || 1;
  };

  const filteredEmployees = employees.filter((e: Employee) => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.region?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="glass-card overflow-hidden border-amber-500/20 shadow-2xl animate-in fade-in duration-700">
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-950 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Zap size={16} />
          </div>
          <div>
            <h3 className="text-[11px] font-display font-black text-zinc-100 uppercase tracking-[0.2em] italic">AX Unified Command</h3>
            <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-0.5">Real-time Taxonomy Mapping Interface</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {analyzing && <Loader2 size={12} className="text-amber-500 animate-spin" />}
          <div className="px-2 py-0.5 rounded border border-zinc-800 text-[8px] font-mono text-zinc-500 uppercase">Status: Nominal</div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-black italic">&gt; Activity Stream Input</label>
            <span className="text-[8px] font-mono text-zinc-700 uppercase">AX-Core Processing Enabled</span>
          </div>
          <div className="relative group">
            <textarea 
              value={workTitle}
              onChange={(e: any) => setWorkTitle(e.target.value)}
              placeholder="Describe the technical or sales activity in detail..."
              className="w-full h-32 bg-zinc-950/40 border border-zinc-800 rounded-lg p-5 text-zinc-100 font-sans focus:outline-none focus:border-amber-500/50 transition-all resize-none shadow-inner text-sm leading-relaxed"
            />
            {prediction && (
              <div className="absolute top-4 right-4 flex flex-col gap-2 animate-in fade-in slide-in-from-right-4">
                <div className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 group-hover:bg-amber-500/20 transition-colors">
                  <ShieldCheck size={10} className="text-amber-500" />
                  <span className="text-[9px] font-mono text-amber-500 font-black uppercase tracking-tighter">
                    {prediction.domain_id || 'Analyzing...'}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-zinc-400" />
                  <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-tighter">
                    {prediction.suggested_work_type || '--'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5 space-y-3 relative">
            <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest font-black">Active Resource</label>
            <div 
              onClick={() => setShowEmployeeSearch(!showEmployeeSearch)}
              className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-lg px-4 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Search size={14} className="text-zinc-600 group-hover:text-amber-500/50 transition-colors" />
                <span className={`text-xs ${selectedEmployee ? 'text-zinc-200 font-bold italic' : 'text-zinc-600 uppercase font-mono'}`}>
                  {selectedEmployee ? `${(selectedEmployee as Employee).name} (${(selectedEmployee as Employee).region})` : 'Search Resource...'}
                </span>
              </div>
              <ChevronDown size={14} className={`text-zinc-700 transition-transform ${showEmployeeSearch ? 'rotate-180' : ''}`} />
            </div>

            {showEmployeeSearch && (
              <div className="absolute top-full left-0 w-full mt-2 glass-card bg-zinc-950 border-zinc-800 shadow-2xl z-[150] p-2 animate-in slide-in-from-top-2 duration-200">
                <input 
                  autoFocus
                  placeholder="Filter nodes..."
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-200 mb-2 focus:outline-none focus:border-amber-500/30"
                />
                <div className="space-y-1">
                  {filteredEmployees.map((emp: Employee) => (
                    <div 
                      key={emp.id}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowEmployeeSearch(false);
                      }}
                      className="p-3 rounded hover:bg-amber-500/10 flex items-center justify-between group cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-zinc-300 group-hover:text-amber-500 italic uppercase tracking-tight">{emp.name}</span>
                        <span className="text-[9px] font-mono text-zinc-600 uppercase">{emp.region} // {emp.position}</span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-800 group-hover:text-amber-900/50">{emp.employee_code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-3 grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest font-black">Load (h)</label>
              <input 
                type="number" 
                step="0.5" 
                value={hours}
                onChange={(e: any) => setHours(parseFloat(e.target.value))}
                className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/30 font-mono font-bold"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest font-black">Op Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e: any) => setDate(e.target.value)}
                className="w-full h-11 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/30 font-mono"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <button 
              onClick={handleSubmit}
              disabled={submitting || !selectedEmployee || !workTitle}
              className="w-full h-12 btn-primary flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group/btn"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              <span className="uppercase tracking-[0.2em] font-black text-xs italic">Commit to Audit Trail</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 bg-zinc-950/80 border-t border-zinc-900 flex items-center justify-between">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${prediction ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`} />
            <span className="text-[9px] font-mono text-zinc-600 uppercase">Integrity: {prediction ? 'High' : 'Pending'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${analyzing ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]' : 'bg-zinc-800'}`} />
            <span className="text-[9px] font-mono text-zinc-600 uppercase">AX Sync: {analyzing ? 'Active' : 'Standby'}</span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-zinc-800 italic uppercase">Kernel: AX-4.2-INDUSTRIAL</div>
      </div>
    </div>
  );
}

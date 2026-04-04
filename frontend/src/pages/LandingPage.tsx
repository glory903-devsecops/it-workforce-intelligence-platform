import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Terminal, 
  Database, 
  ArrowRight, 
  Cpu, 
  ShieldCheck,
  Zap
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden font-sans selection:bg-amber-500/30">
      {/* --- Visual Backdrop --- */}
      <div className="absolute inset-0 z-0 opactiy-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.03),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        {/* Grain Texture Mockup (via CSS) */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* --- Main Navigation Header --- */}
      <nav className="relative z-10 px-10 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Cpu size={20} />
          </div>
          <div>
            <span className="text-zinc-100 font-display font-black tracking-[0.2em] text-xs uppercase">Antigravity</span>
            <div className="h-px w-full bg-amber-500/30 mt-0.5" />
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_#22C55E]" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Protocol Stable</span>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 z-10">
        <div className="max-w-4xl w-full text-center mb-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-zinc-900 bg-zinc-900/40 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] backdrop-blur-sm shadow-xl">
            <Zap size={10} className="text-amber-500" />
            V4.2.0 Next-Gen Workforce Intelligence
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display text-zinc-100 tracking-tight leading-[0.95] font-black italic">
            DYNAMIC<br />
            <span className="text-amber-500 not-italic">RESOURCES</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-sans">
            Streamlining the SW sales ecosystem through AX-driven taxonomy mapping 
            and real-time resource orchestration.
          </p>
        </div>

        {/* --- Gateway Portals --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {/* Card 1: SW Sales ERP */}
          <button
            onClick={() => navigate('/app/task-log')}
            className="group relative flex flex-col items-start p-10 glass-card border-zinc-800/50 hover:border-amber-500/40 transition-all duration-500 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
              <Terminal size={120} className="text-amber-500" />
            </div>

            <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 text-amber-500 group-hover:scale-110 group-hover:border-amber-500/20 transition-all duration-500 shadow-2xl">
              <Database size={28} />
            </div>
            
            <div className="space-y-4 relative z-10">
              <h3 className="text-3xl font-display font-black text-zinc-100 tracking-tight group-hover:text-amber-500 transition-colors uppercase italic">
                SW Sales Terminal
              </h3>
              <p className="text-zinc-500 text-[13px] leading-relaxed max-w-sm">
                Access the intelligence-driven ERP portal. Log activities, execute AX taxonomy mapping, and receive strategic guidance.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6 w-full relative z-10">
              <div className="flex items-center gap-3 text-amber-500/60 group-hover:text-amber-500 transition-all font-mono text-[10px] uppercase font-black tracking-widest">
                Initialize Session <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
              <div className="h-px flex-1 bg-zinc-900 group-hover:bg-zinc-800 transition-colors" />
            </div>
          </button>

          {/* Card 2: Enterprise Hub */}
          <button
            onClick={() => navigate('/app/dashboard')}
            className="group relative flex flex-col items-start p-10 glass-card border-zinc-800/50 hover:border-amber-500/40 transition-all duration-500 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={120} className="text-amber-500" />
            </div>

            <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 text-amber-500 group-hover:scale-110 group-hover:border-amber-500/20 transition-all duration-500 shadow-2xl">
              <BarChart3 size={28} />
            </div>
            
            <div className="space-y-4 relative z-10">
              <h3 className="text-3xl font-display font-black text-zinc-100 tracking-tight group-hover:text-amber-500 transition-colors uppercase italic">
                Inisght Hub
              </h3>
              <p className="text-zinc-500 text-[13px] leading-relaxed max-w-sm">
                Consolidated analytics for enterprise-wide resources. Monitor workforce distribution, performance, and financial forecasts.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6 w-full relative z-10">
              <div className="flex items-center gap-3 text-amber-500/60 group-hover:text-amber-500 transition-all font-mono text-[10px] uppercase font-black tracking-widest">
                Audit Enterprise <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
              <div className="h-px flex-1 bg-zinc-900 group-hover:bg-zinc-800 transition-colors" />
            </div>
          </button>
        </div>

        {/* --- Footer Metadata --- */}
        <footer className="mt-20 text-center space-y-4 relative z-10 opacity-50 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-center gap-6 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
            <span>Secured By G-STACK</span>
            <span className="w-px h-3 bg-zinc-800" />
            <span>Industrial Compliance Level 4</span>
            <span className="w-px h-3 bg-zinc-800" />
            <span>Authenticated Only</span>
          </div>
          <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">
            © 2026 Antigravity OS // MIDAS Strategic Systems
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;

export default LandingPage;

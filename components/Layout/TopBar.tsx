
import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <header className="h-24 border-b border-white/[0.04] bg-[#010309] flex items-center justify-between px-12 z-50 relative overflow-hidden">
      {/* Header Flare */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse"></div>
      
      <div className="flex items-center gap-8 group cursor-pointer relative z-10">
        {/* NEW FUTURISTIC LOGO: THE NEURAL CORE */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 bg-purple-600 rounded-full blur-2xl opacity-20 group-hover:opacity-60 transition-all duration-1000 animate-pulse"></div>
          <div className="relative w-14 h-14 bg-[#020617] border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl group-hover:border-cyan-500/50 transition-all duration-500 group-hover:rotate-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b,transparent)] opacity-40"></div>
            <svg className="w-10 h-10 text-white z-10 transition-all duration-700 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
               <circle cx="12" cy="12" r="3" className="fill-cyan-400 group-hover:fill-purple-400 transition-colors duration-1000 animate-pulse" />
            </svg>
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/40 -translate-y-full animate-[logo-scan-mini_4s_infinite]"></div>
          </div>
          <div className="absolute -inset-1.5 border border-white/5 rounded-2xl group-hover:rotate-45 transition-transform duration-1000 opacity-50"></div>
        </div>
        
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white leading-none mb-1">
            KNOUX<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-cyan-400 italic">PID</span>
          </h1>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Neural Intelligence Engine</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-green-500/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Sync Latency</span>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-green-500/20 to-green-500 shadow-[0_0_10px_#22c55e]"></div>
              </div>
              <span className="text-xs font-mono text-cyan-500 font-bold tracking-tighter">0.004ms</span>
            </div>
        </div>
        
        <div className="h-12 w-px bg-white/10"></div>

        <div className="flex items-center gap-4 group">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol</span>
              <span className="text-xs font-bold text-gray-200">TUNNEL_ALPHA_01</span>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-purple-500/50 transition-all hover:bg-purple-500/5 cursor-pointer relative overflow-hidden group/vault">
              <svg className="w-6 h-6 text-gray-500 group-hover/vault:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover/vault:left-[100%] transition-all duration-1000"></div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes logo-scan-mini {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </header>
  );
};

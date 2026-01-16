
import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const systemLogs = [
    "INIT_NEURAL_KERNEL_v2.4",
    "ALLOCATING_QUANTUM_BUFFER",
    "SYNCING_HEURISTIC_VECTORS",
    "G_ANALYZER_INSTANTIATED",
    "VAULT_INTEGRITY_CHECK :: 100%",
    "ESTABLISHING_RT_BROADCAST",
    "NEURAL_LINK_ESTABLISHED"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1500);
          return 100;
        }
        if (prev % 15 === 0 && logs.length < systemLogs.length) {
          setLogs(l => [...l, systemLogs[l.length]]);
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [onComplete, logs.length]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#010309] flex flex-col items-center justify-center overflow-hidden">
      {/* ATMOSPHERIC DEPTH */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4c1d95,transparent)] blur-[150px]"></div>
        <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <div className="relative flex flex-col items-center">
        {/* ENCHANTED NEURAL CORE */}
        <div className="relative w-48 h-48 mb-20 group">
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -inset-6 border border-cyan-500/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute -inset-10 border border-purple-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          
          <div className="relative w-48 h-48 bg-black border border-white/10 rounded-[3rem] flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e293b,transparent)] opacity-60"></div>
             <svg className="w-24 h-24 text-white z-10 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="#22d3ee" className="animate-pulse" />
             </svg>
             <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-400/30 -translate-y-full animate-[logo-scan_2.5s_infinite]"></div>
          </div>
        </div>

        {/* IDENTITY AND PROGRESS */}
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl font-black tracking-[0.8em] text-white uppercase italic ml-[0.8em] drop-shadow-2xl">
            KNOUX <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">PID</span>
          </h1>
          
          <div className="flex flex-col items-center gap-6">
            <div className="w-96 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-96 text-[11px] font-mono text-gray-500 uppercase tracking-[0.3em] font-black">
              <span>{progress < 100 ? "Syncing_Vectors" : "Neural_Core_Ready"}</span>
              <span className="text-cyan-400">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM BIOS OVERLAY */}
      <div className="absolute bottom-16 right-16 font-mono text-[10px] text-cyan-500/40 space-y-1.5 text-right max-w-sm">
        {logs.map((log, i) => (
          <p key={i} className="animate-in fade-in slide-in-from-right-4 duration-500">>> {log}</p>
        ))}
      </div>
      
      <div className="absolute bottom-16 left-16 border-l border-purple-500/20 pl-4 py-1">
        <span className="text-[11px] font-black text-gray-600 uppercase tracking-[0.5em]">System.PID.Kernel_0x40</span>
      </div>

      <style>{`
        @keyframes logo-scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(500%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

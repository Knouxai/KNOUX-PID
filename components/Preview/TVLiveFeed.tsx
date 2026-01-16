
import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '../../types';

export const TVLiveFeed: React.FC<{ data: AnalysisResult | null }> = ({ data }) => {
  const [feedIndex, setFeedIndex] = useState(0);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    const rotate = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % 3);
    }, 7000);
    return () => {
      clearInterval(timer);
      clearInterval(rotate);
    };
  }, []);

  const feeds = [
    { 
      id: 'ARCH_NET', 
      label: 'NEURAL_ARCHITECTURAL_BROADCAST', 
      value: data?.summary || 'CORE_INITIALIZING_V.2.40_PRO',
      status: 'BROADCASTING'
    },
    { 
      id: 'DNA_SYNC', 
      label: 'DNA_CLUSTER_VECTOR_SYNC', 
      value: data ? `${data.dna.framework} // ${data.dna.language} // ${data.dna.type}` : 'AWAITING_GENETIC_SYNC',
      status: 'SYNCING'
    },
    { 
      id: 'HEUR_X4', 
      label: 'QUALITY_ANOMALY_DETECTION_FEED', 
      value: data ? `READINESS: ${Math.round(data.quality.readiness * 100)}% // DEBT_NODES: ${data.quality.stub + data.quality.partial}` : 'CALCULATING_HEURISTICS',
      status: 'MONITORING'
    },
  ];

  return (
    <div className="w-full h-40 glass-panel rounded-[2.5rem] border-purple-500/20 overflow-hidden relative mb-12 group transition-all duration-700 hover:border-purple-500/40 shadow-2xl">
      {/* CINEMATIC DISPLAY EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2.5px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.04] to-transparent z-0"></div>
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)] z-20 pointer-events-none"></div>

      {/* HEADER: STATUS & CONTROL */}
      <div className="absolute top-0 left-0 w-full px-12 py-4 z-30 flex justify-between items-center border-b border-white/[0.04] bg-black/40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_20px_#dc2626]"></div>
            <span className="text-[11px] font-black text-white uppercase tracking-[0.5em]">RT_BROADCAST // CAM_0{feedIndex + 1}</span>
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">{feeds[feedIndex].id}</span>
            <span className="text-[9px] font-mono text-gray-500 px-2.5 py-1 bg-white/5 rounded border border-white/5 uppercase">Secure_Stream</span>
          </div>
        </div>
        
        <div className="flex items-center gap-10 font-mono text-[11px] text-gray-400">
          <span className="flex items-center gap-2.5 text-purple-400 font-black tracking-widest">
             <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
             BROADCASTING
          </span>
          <span className="text-white font-black">{systemTime}</span>
          <span className="hidden md:inline text-gray-600 font-black tracking-tighter italic">PID_OS_2.4.0</span>
        </div>
      </div>

      {/* CENTER: DATA BROADCAST */}
      <div className="h-full flex items-center px-16 pt-8">
        <div className="flex flex-col flex-1">
          <div key={feedIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h4 className="text-[12px] font-black text-purple-500/80 uppercase tracking-[0.6em] mb-2.5 flex items-center gap-6">
              {feeds[feedIndex].label}
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent"></div>
            </h4>
            <div className="flex items-baseline gap-6">
               <p className="text-3xl font-black text-gray-100 tracking-tighter leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {feeds[feedIndex].value}
              </p>
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest bg-white/[0.04] px-3 py-1 rounded border border-white/5 font-black">
                {feeds[feedIndex].status}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FREQUENCY VISUALIZER */}
        <div className="hidden xl:flex items-center gap-2 h-20 px-10 border-l border-white/10 ml-10">
           {[...Array(24)].map((_, i) => (
             <div 
                key={i} 
                className="w-2 bg-cyan-400/50 rounded-full animate-[visualizer_1.5s_ease-in-out_infinite]"
                style={{ 
                  height: `${25 + Math.random() * 75}%`,
                  animationDelay: `${i * 0.05}s` 
                }}
             ></div>
           ))}
        </div>
      </div>

      {/* BOTTOM: LIVE MARQUEE TICKER */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-purple-600/5 border-t border-white/[0.04] z-30 flex items-center overflow-hidden">
         <div className="bg-purple-600/20 h-full px-8 flex items-center border-r border-purple-500/30 z-40">
           <span className="text-[11px] font-black text-purple-400 uppercase tracking-[0.4em] whitespace-nowrap">Neural_Inbound</span>
         </div>
         <div className="flex-1 whitespace-nowrap overflow-hidden">
            <div className="inline-block animate-marquee pl-[100%] py-2">
               <span className="text-[11px] font-mono text-gray-500 uppercase tracking-[0.2em] font-black italic">
                  {data?.files.map(f => f.path).join('  ///  ') || 'AWAITING_NEURAL_UPLINK... ESTABLISHING_VECTOR_CLUSTER... BROADCAST_SYSTEM_READY...'}
               </span>
            </div>
         </div>
      </div>

      <style>{`
        @keyframes visualizer {
          0%, 100% { transform: scaleY(1); opacity: 0.2; filter: blur(1px); }
          50% { transform: scaleY(2.2); opacity: 1; filter: blur(0px); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { DevMode } from '../types';

interface ModeConfig {
  label: string;
  icon: string;
  color: string;
  description: string;
  impact: string;
}

const MODES: Record<DevMode, ModeConfig> = {
  [DevMode.NEW_DEVELOPER]: {
    label: 'New Developer',
    icon: '🧑‍💻',
    color: 'from-blue-400 to-cyan-500',
    description: 'Simplifies complexity. Highlights entry points and high-level logic flow.',
    impact: 'HIGH structural visibility'
  },
  [DevMode.MAINTENANCE]: {
    label: 'Maintenance',
    icon: '🧑‍🔧',
    color: 'from-orange-400 to-red-500',
    description: 'Targets legacy technical debt, TODOs, and bloated functional nodes.',
    impact: 'CRITICAL debt detection'
  },
  [DevMode.REFACTOR]: {
    label: 'Refactor',
    icon: '🧪',
    color: 'from-purple-400 to-pink-500',
    description: 'Identifies logic nesting, coupling points, and modular expansion candidates.',
    impact: 'PERFORMANCE mapping'
  },
  [DevMode.PRODUCTION]: {
    label: 'Production Prep',
    icon: '🚀',
    color: 'from-green-400 to-emerald-500',
    description: 'Final security manifests, build readiness, and zero-placeholder enforcement.',
    impact: 'STRICT quality audit'
  },
};

interface ModeSelectorProps {
  mode: DevMode;
  setMode: (mode: DevMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, setMode }) => {
  const [activeMode, setActiveMode] = useState<DevMode>(mode);

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  const current = MODES[activeMode];

  return (
    <div className="p-3 space-y-8 flex flex-col h-full">
      <div className="flex flex-col gap-1.5 px-3">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
           <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.25em]">Operational Modulator</p>
        </div>
        <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest font-mono">PID_COGNITIVE_OVERRIDE_V2.4</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(MODES).map(([key, config]) => {
          const isActive = key === activeMode;
          return (
            <button
              key={key}
              onClick={() => setMode(key as DevMode)}
              className={`group relative flex flex-col items-center justify-center p-5 rounded-3xl transition-all duration-700 ${
                isActive
                  ? 'bg-white/10 border border-white/25 shadow-[0_0_40px_rgba(255,255,255,0.06)] scale-[1.03]'
                  : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/15'
              }`}
            >
              {/* Futuristic Corner Caps */}
              {isActive && (
                <>
                  <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/40"></div>
                  <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/40"></div>
                </>
              )}

              <div className={`text-3xl mb-3 transition-all duration-700 ${isActive ? 'scale-125 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] rotate-0' : 'opacity-30 grayscale blur-[0.5px] -rotate-6 group-hover:rotate-0 group-hover:grayscale-0 group-hover:opacity-70 group-hover:blur-0'}`}>
                {config.icon}
              </div>
              
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-gray-600'}`}>
                {config.label.split(' ')[0]}
              </span>

              {isActive && (
                <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
                   <div className="absolute w-5 h-5 bg-cyan-400/30 rounded-full animate-ping"></div>
                   <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee] border border-white/40"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <div className="relative p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/10 overflow-hidden group shadow-inner">
          {/* Internal Geometric Glow */}
          <div className={`absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br ${current.color} opacity-[0.06] blur-2xl animate-pulse`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
               <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
               <p className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em]">Strategy Influence</p>
            </div>
            
            <p className="text-[12px] leading-relaxed text-gray-300 font-medium mb-6 min-h-[50px] border-l-2 border-white/10 pl-4 bg-white/[0.01] py-2 rounded-r-xl">
              {current.description}
            </p>
            
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.25em]">System Impact</span>
              <span className={`text-[10px] font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r ${current.color} drop-shadow-md`}>
                {current.impact}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

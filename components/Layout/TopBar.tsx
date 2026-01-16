
import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <header className="h-14 border-b border-white/10 glass-panel flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="text-white font-bold text-xl tracking-tighter">K</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">KNOUX <span className="text-purple-400">PID™</span></h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold leading-none">Project Intelligence Desktop</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-400">Engine V1.0.4 Online</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
          <span className="text-xs">JS</span>
        </div>
      </div>
    </header>
  );
};

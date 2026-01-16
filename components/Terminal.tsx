
import React, { useEffect, useRef } from 'react';
import { AnalysisLog } from '../types';

export const Terminal: React.FC<{ logs: AnalysisLog[] }> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: AnalysisLog['level']) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl h-full border-white/5 bg-black/40 flex flex-col font-mono text-[11px]">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
        </div>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-2">Internal Log Stream</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 scroll-smooth pr-2">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-3 items-start animate-in fade-in duration-300">
            <span className="text-gray-600 flex-shrink-0">[{log.timestamp}]</span>
            <span className={getLevelColor(log.level)}>
              {log.level === 'success' ? '✔' : log.level === 'warn' ? '⚠' : log.level === 'error' ? '✖' : 'ℹ'} {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-700 italic">Waiting for process start...</div>
        )}
      </div>
      
      <div className="mt-4 pt-2 border-t border-white/5 flex justify-between text-[9px] text-gray-600 uppercase font-black tracking-tighter">
        <span>KNOUX_SYSTEM_MONITOR</span>
        <span className="animate-pulse">_</span>
      </div>
    </div>
  );
};


import React from 'react';

export const RoadmapCard: React.FC<{ roadmap: string[] }> = ({ roadmap }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold">Smart Roadmap</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Suggested Actions</p>
        </div>
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">📍</div>
      </div>

      <div className="space-y-3">
        {roadmap.slice(0, 6).map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors group">
            <div className="mt-1 w-5 h-5 flex items-center justify-center bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
              {idx + 1}
            </div>
            <p className="text-xs font-medium text-gray-300 leading-tight">
              {item}
            </p>
          </div>
        ))}
        {roadmap.length === 0 && (
          <p className="text-center py-8 text-gray-600 font-bold uppercase text-[11px]">Analysis Pending...</p>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { HeatMapCell } from '../../types';

export const HeatMapCard: React.FC<{ cells: HeatMapCell[] }> = ({ cells }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl h-full border-white/5 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">File Health Heatmap</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Spatial Health Analysis</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Warn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Stub</span>
          </div>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(14px, 1fr))' }}>
          {cells.map((cell, idx) => (
            <div
              key={`${cell.path}-${idx}`}
              className={`aspect-square rounded-sm border border-white/5 cursor-crosshair transition-all hover:scale-150 hover:z-50 hover:shadow-lg ${
                cell.status === 'stable' ? 'bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.2)]' :
                cell.status === 'warning' ? 'bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
              }`}
              title={`${cell.path} (${(cell.size / 1024).toFixed(1)} KB)`}
            />
          ))}
          {cells.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-600 font-bold uppercase tracking-widest border border-dashed border-white/10 rounded-xl">
              Virtual Map Empty
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

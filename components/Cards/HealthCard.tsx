
import React from 'react';
import { ProjectQuality } from '../../types';

export const HealthCard: React.FC<{ quality: ProjectQuality }> = ({ quality }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const readinessOffset = circumference - (quality.readiness * circumference);

  return (
    <div className="glass-panel p-6 rounded-3xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold">System Health</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Readiness Score</p>
        </div>
        <div className="p-2 bg-green-500/10 rounded-lg text-green-400">🛡️</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-800"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={readinessOffset}
              strokeLinecap="round"
              className="text-purple-500 transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{Math.round(quality.readiness * 100)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 w-full gap-4">
          <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Files</p>
            <p className="text-lg font-bold text-white">{quality.totalFiles}</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Criticality</p>
            <p className="text-lg font-bold text-red-400">{quality.stub + quality.partial}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

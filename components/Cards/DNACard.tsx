
import React from 'react';
import { ProjectDNA } from '../../types';

export const DNACard: React.FC<{ dna: ProjectDNA }> = ({ dna }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl neon-glow">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold">Project DNA</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Core Stack Detected</p>
        </div>
        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">🧬</div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-sm text-gray-400 font-medium">Framework</span>
          <span className="text-sm font-bold text-white">{dna.framework}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-sm text-gray-400 font-medium">Language</span>
          <span className="text-sm font-bold text-white">{dna.language}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <span className="text-sm text-gray-400 font-medium">Architecture</span>
          <span className="text-sm font-bold text-white">{dna.type}</span>
        </div>
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Confidence Index</span>
            <span className="text-xs font-bold text-cyan-400">{Math.round(dna.confidence * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-1000"
              style={{ width: `${dna.confidence * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { AnalysisResult } from '../../types';

export const SummaryCard: React.FC<{ data: AnalysisResult }> = ({ data }) => {
  const handleExport = async (format: 'json' | 'html') => {
    // @ts-ignore
    const api = window.electronAPI;
    if (api) {
      try {
        const method = format === 'json' ? api.exportProjectJSON : api.exportProjectHTML;
        const resultPath = await method(data);
        alert(`INTELLIGENCE EXPORTED:\n${resultPath}`);
      } catch (err) {
        console.error(`Export error: ${format}`, err);
        alert(`EXPORT FAILED: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } else {
      // Browser fallback: Download JSON or warn about HTML
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `knoux-intelligence-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert("The visual HTML dashboard exporter requires the KNOUX PID™ Desktop Runtime.");
      }
    }
  };

  return (
    <div className="glass-panel p-8 rounded-[2rem] bg-gradient-to-br from-purple-900/10 to-cyan-900/10 border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none">
        <svg className="w-48 h-48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-start justify-between gap-10">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
              CORE SYNTHESIS
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
              Live Engine
            </div>
          </div>
          
          <h2 className="text-4xl font-black text-white mb-6 tracking-tighter leading-tight max-w-2xl">
            Architectural Synthesis
          </h2>
          
          <div className="max-w-4xl">
            <p className="text-xl text-gray-200 leading-relaxed font-semibold italic border-l-4 border-purple-500/40 pl-6 bg-white/[0.02] py-4 rounded-r-2xl">
              "{data.summary}"
            </p>
          </div>
          
          <div className="mt-10 flex flex-wrap gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Density Index</span>
              <span className="text-3xl font-black text-white">{(data.quality.complexity * 10).toFixed(1)}<span className="text-sm text-gray-600 ml-1">/10.0</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Vector Confidence</span>
              <span className="text-3xl font-black text-purple-400">{Math.round(data.dna.confidence * 100)}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Scanned Nodes</span>
              <span className="text-3xl font-black text-cyan-400">{data.quality.totalFiles}</span>
            </div>
          </div>
        </div>

        <div className="xl:w-60 flex flex-col gap-4">
          <div className="p-4 bg-black/20 border border-white/5 rounded-2xl">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center justify-between">
              Intelligence Vault
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => handleExport('json')}
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 group/btn"
              >
                <svg className="w-4 h-4 text-purple-400 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                JSON Artifact
              </button>
              <button 
                onClick={() => handleExport('html')}
                className="w-full py-3.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 group/btn"
              >
                <svg className="w-4 h-4 text-cyan-400 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Visual Report
              </button>
            </div>
            <p className="mt-4 text-[9px] text-center text-gray-600 font-bold uppercase tracking-tighter">Verified Local Integrity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

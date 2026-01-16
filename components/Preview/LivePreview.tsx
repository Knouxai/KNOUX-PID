
import React from 'react';
import { AnalysisResult } from '../../types';
import { SummaryCard } from '../Cards/SummaryCard';
import { DNACard } from '../Cards/DNACard';
import { HealthCard } from '../Cards/HealthCard';
import { HeatMapVisual } from '../HeatMapVisual';
import { TVLiveFeed } from './TVLiveFeed';

interface LivePreviewProps {
  data: AnalysisResult;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ data }) => {
  return (
    <div className="w-full space-y-12 animate-in tv-on pb-12">
      {/* THE LIVE HUB (PANORAMIC TV) */}
      <TVLiveFeed data={data} />

      {/* ANALYTICAL ARCHITECTURE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* EXECUTIVE SUMMARY */}
        <div className="xl:col-span-12">
           <SummaryCard data={data} />
        </div>

        {/* SPATIAL RADAR & CORE TELEMETRY */}
        <div className="xl:col-span-8 flex flex-col gap-12">
          <div className="glass-panel p-2 rounded-[3.5rem] overflow-hidden border-purple-500/20 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
            <HeatMapVisual heatmap={data.heatmap} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <DNACard dna={data.dna} />
            <HealthCard quality={data.quality} />
          </div>
        </div>

        {/* HEURISTIC STRATEGY PANEL */}
        <div className="xl:col-span-4 space-y-12">
          <div className="glass-panel p-10 rounded-[3.5rem] h-full border-cyan-500/20 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] group-hover:bg-cyan-500/10 transition-all duration-1000"></div>
            
            <div className="flex items-center gap-5 mb-12">
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-[0.6em]">Smart Roadmap</h3>
            </div>
            
            <div className="space-y-8">
              {data.roadmap.map((step, i) => (
                <div key={i} className="flex gap-8 group/item p-5 rounded-[2rem] hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 shadow-inner">
                  <span className="text-[12px] font-black font-mono text-cyan-500/40 mt-1">0{i+1}</span>
                  <p className="text-base font-bold text-gray-400 group-hover/item:text-cyan-300 transition-colors leading-relaxed tracking-tight">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-20 pt-12 border-t border-white/[0.04]">
                <div className="flex items-center justify-between text-[12px] font-black text-gray-700 uppercase tracking-[0.4em]">
                  <span>Operational_Matrix</span>
                  <span className="text-cyan-500/20">0x240_B_KERNEL</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

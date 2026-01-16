
import React from 'react';
import { AnalysisResult, DevMode } from '../types';
import { DNACard } from './Cards/DNACard';
import { HealthCard } from './Cards/HealthCard';
import { HeatMapVisual } from './HeatMapVisual';
import { RoadmapCard } from './Cards/RoadmapCard';
import { FileTreeCard } from './Cards/FileTreeCard';
import { SummaryCard } from './Cards/SummaryCard';
import { ServiceCards } from './ServiceCards';
import { Terminal } from './Terminal';

interface DashboardProps {
  data: AnalysisResult;
  devMode: DevMode;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, devMode }) => {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      {/* Top Intelligence Synthesis */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="lg:col-span-3">
          <SummaryCard data={data} />
        </div>
        <div className="flex flex-col gap-6">
           <DNACard dna={data.dna} />
           <HealthCard quality={data.quality} />
        </div>
      </div>

      {/* Futuristic Intelligence Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Holographic Intelligence Nodes</h2>
        </div>
        <ServiceCards projectData={data} />
      </div>

      {/* Visual Analysis Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div>
             <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                   <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
                   <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Spatial Node Analysis (Radar)</h2>
                </div>
                <span className="text-[8px] font-mono text-gray-600">SCAN_FREQ: 60Hz</span>
             </div>
             <HeatMapVisual heatmap={data.heatmap} />
          </div>
          <FileTreeCard files={data.files} />
        </div>
        
        <div className="lg:col-span-4 flex flex-col gap-8">
          <RoadmapCard roadmap={data.roadmap} />
          <Terminal logs={data.logs} />
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { AnalysisResult } from '../types';

interface ServiceCardsProps {
  projectData: AnalysisResult | null;
}

const colorMap: Record<string, { border: string, bg: string, text: string, shadow: string }> = {
  purple: { border: 'border-purple-500/20', bg: 'bg-purple-500/10', text: 'text-purple-400', shadow: 'shadow-purple-500/40' },
  green: { border: 'border-green-500/20', bg: 'bg-green-500/10', text: 'text-green-400', shadow: 'shadow-green-500/40' },
  red: { border: 'border-red-500/20', bg: 'bg-red-500/10', text: 'text-red-400', shadow: 'shadow-red-500/40' },
  cyan: { border: 'border-cyan-500/20', bg: 'bg-cyan-500/10', text: 'text-cyan-400', shadow: 'shadow-cyan-500/40' },
  orange: { border: 'border-orange-500/20', bg: 'bg-orange-500/10', text: 'text-orange-400', shadow: 'shadow-orange-500/40' },
  pink: { border: 'border-pink-500/20', bg: 'bg-pink-500/10', text: 'text-pink-400', shadow: 'shadow-pink-500/40' },
  blue: { border: 'border-blue-500/20', bg: 'bg-blue-500/10', text: 'text-blue-400', shadow: 'shadow-blue-500/40' },
};

const HolographicNode: React.FC<{ 
  title: string, 
  value1: string | number, 
  label1: string,
  value2: string | number, 
  label2: string,
  value3: string | number, 
  label3: string,
  color: string,
  status: string
}> = ({ title, value1, label1, value2, label2, value3, label3, color, status }) => {
  const theme = colorMap[color] || colorMap.purple;

  return (
    <div className={`relative overflow-hidden glass-panel p-6 rounded-[2.5rem] border ${theme.border} group hover:border-${color}-500/40 transition-all duration-700 hover:scale-[1.02] hover:-translate-y-1 shadow-2xl`}>
      {/* Dynamic Background Pulse */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 ${theme.bg} blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000`}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <h3 className={`text-[11px] font-black uppercase tracking-[0.25em] ${theme.text} drop-shadow-sm`}>
            {title}
          </h3>
          <div className="relative flex items-center justify-center">
             <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-ping absolute inset-0 opacity-40`}></div>
             <div className={`w-2 h-2 bg-${color}-500 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.5)]`}></div>
          </div>
        </div>

        <div className="flex-1 space-y-5">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-white tracking-tighter leading-none">{value1}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5">{label1}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
            <div className="flex flex-col">
              <span className={`text-sm font-black text-white/90`}>{value2}</span>
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{label2}</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-black text-white/90`}>{value3}</span>
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{label3}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className={`w-1 h-3.5 bg-${color}-500/40 rounded-full`}></div>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{status}</span>
          </div>
          <span className="text-[9px] font-mono text-gray-700 font-black tracking-tighter">NODE_0x{Math.floor(Math.random()*99)}</span>
        </div>
      </div>
    </div>
  );
};

export const ServiceCards: React.FC<ServiceCardsProps> = ({ projectData }) => {
  if (!projectData) return null;

  const { tree, files, dna, quality, heatmap, roadmap } = projectData;

  const stats = {
    totalFiles: tree?.totalFiles || 0,
    folders: tree?.totalFolders || 0,
    size: (tree?.totalSize ? tree.totalSize / 1024 / 1024 : 0).toFixed(1),
    ready: files.filter(f => f.status === 'ready').length,
    partial: files.filter(f => f.status === 'partial').length,
    stub: files.filter(f => f.status === 'stub').length,
    todos: files.reduce((acc, f) => acc + (f.todoCount || 0), 0),
    fixmes: files.reduce((acc, f) => acc + (f.fixmeCount || 0), 0),
    confidence: Math.round((dna?.confidence || 0) * 100),
    critical: heatmap?.filter(f => f.status === 'critical').length || 0,
    warn: heatmap?.filter(f => f.status === 'warning').length || 0,
    stable: heatmap?.filter(f => f.status === 'stable').length || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
      <HolographicNode 
        title="Structural Map" 
        value1={stats.totalFiles} label1="Scanned Artifacts"
        value2={stats.folders} label2="Cluster Nodes"
        value3={`${stats.size}MB`} label3="Data Weight"
        color="purple" status="Active Scan"
      />
      
      <HolographicNode 
        title="Readiness Engine" 
        value1={`${Math.round(quality.readiness * 100)}%`} label1="Sys Integrity"
        value2={stats.ready} label2="Prod Ready"
        value3={stats.stub} label3="Logic Stubs"
        color="green" status="Core Verified"
      />

      <HolographicNode 
        title="Intel Parser" 
        value1={stats.todos + stats.fixmes} label1="Debt Anomalies"
        value2={stats.todos} label2="TODO Tasks"
        value3={stats.fixmes} label3="FIXME Alerts"
        color="red" status="Deep Analysis"
      />

      <HolographicNode 
        title="Ecosystem Node" 
        value1={dna.framework.split(' ')[0]} label1="Active DNA"
        value2={`${stats.confidence}%`} label2="Cert Confidence"
        value3="PASS" label3="Manifest"
        color="cyan" status="Stack Sync"
      />

      <HolographicNode 
        title="Spatial Heat" 
        value1={stats.critical} label1="Critical Hotspots"
        value2={stats.warn} label2="Warning Nodes"
        value3={stats.stable} label3="Stable Zones"
        color="orange" status="Visual Feed"
      />

      <HolographicNode 
        title="Strategic Path" 
        value1={roadmap.length} label1="Action Goals"
        value2="6" label2="Priority P0"
        value3="AI" label3="Gen Logic"
        color="pink" status="Roadmap Active"
      />

      <HolographicNode 
        title="Intel Vault" 
        value1="SECURE" label1="Sync State"
        value2="JSON" label2="Data Type"
        value3="AES" label3="Encryption"
        color="blue" status="Verified local"
      />
    </div>
  );
};

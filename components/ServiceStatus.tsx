
import React from 'react';
import { DevMode, ProjectQuality } from '../types';

interface ServiceStatusProps {
  devMode: DevMode;
  quality: ProjectQuality;
}

export const ServiceStatus: React.FC<ServiceStatusProps> = ({ devMode, quality }) => {
  const services = [
    { name: 'Structure Analyzer', status: 'ACTIVE', desc: 'Scanning file tree and artifacts', color: 'text-green-400' },
    { name: 'Readiness Scanner', status: 'COMPLETE', desc: `${quality.ready} files verified as production-ready`, color: 'text-cyan-400' },
    { name: 'Content Intel', status: 'ACTIVE', desc: 'Detecting TODOs and code smells', color: 'text-purple-400' },
    { name: 'Env Validator', status: 'PASS', desc: 'Dependencies and manifest validation', color: 'text-green-500' },
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl h-full border-white/5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold">Active Engine Services</h3>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">System Internals // {devMode.toUpperCase()}</p>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-gray-400 flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
           CLUSTER_HEALTH: OPTIMAL
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service, idx) => (
          <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black text-gray-300 uppercase tracking-tighter">{service.name}</span>
              <span className={`text-[10px] font-black font-mono ${service.color}`}>{service.status}</span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium leading-tight">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

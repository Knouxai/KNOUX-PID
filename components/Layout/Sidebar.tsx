
import React from 'react';
import { DevMode } from '../../types';
import { ModeSelector } from '../ModeSelector';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  devMode: DevMode;
  setDevMode: (mode: DevMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, devMode, setDevMode }) => {
  const menuItems = [
    { id: 'overview', label: 'Global Overview', icon: '📊' },
    { id: 'dna', label: 'Project DNA', icon: '🧬' },
    { id: 'structure', label: 'Structural Tree', icon: '🌲' },
    { id: 'heatmap', label: 'Health Heatmap', icon: '🔥' },
    { id: 'roadmap', label: 'Smart Roadmap', icon: '🗺️' },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-gray-950/80 backdrop-blur-md hidden lg:flex flex-col">
      <div className="p-4 py-6 space-y-6 overflow-y-auto flex-1">
        <div>
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">Analysis Intelligence</p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-tighter transition-all ${
                  activeTab === item.id 
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <ModeSelector mode={devMode} setMode={setDevMode} />
      </div>

      <div className="mt-auto p-4 border-t border-white/5">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5">
          <p className="text-[10px] font-black text-purple-400 mb-1 uppercase tracking-widest">System Tip</p>
          <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-tighter">
            Toggle <b>Production Prep</b> for a zero-placeholder audit before deployment.
          </p>
        </div>
      </div>
    </aside>
  );
};

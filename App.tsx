import React, { useState, useCallback } from 'react';
import { TopBar } from './components/Layout/TopBar';
import { Sidebar } from './components/Layout/Sidebar';
import { Footer } from './components/Layout/Footer';
import { ProjectUploader } from './components/ProjectUploader';
import { AnalysisResult, DevMode } from './types';
import { analyzeProjectFiles } from './engines/AnalysisEngine';
import { LivePreview } from './components/Preview/LivePreview';
import { FileTreeCard } from './components/Cards/FileTreeCard';
import { HeatMapCard } from './components/Cards/HeatMapCard';
import { RoadmapCard } from './components/Cards/RoadmapCard';
import { DNACard } from './components/Cards/DNACard';
import { SplashScreen } from './components/SplashScreen';
import { TVLiveFeed } from './components/Preview/TVLiveFeed';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [projectData, setProjectData] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [devMode, setDevMode] = useState<DevMode>(DevMode.NEW_DEVELOPER);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) {
      console.warn("No files selected for analysis");
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeProjectFiles(files, devMode);
      setProjectData(result);
    } catch (error) {
      console.error("Analysis failed", error);
      const errorMessage = error instanceof Error ? error.message : String(error) || "Unknown error occurred during analysis";
      // نعرض رسالة مفصّلة للمستخدم ونبقي على رسالة الفرع الآخر كجزء من التنبيه
      alert(`Analysis failed: ${errorMessage}\nNeural Analysis Interrupted: Handshake protocol failed.\nPlease check your internet connection and API key.`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [devMode]);

  const renderContent = () => {
    if (!projectData) return null;

    switch (activeTab) {
      case 'dna':
        return <div className="max-w-xl mx-auto py-10"><DNACard dna={projectData.dna} /></div>;
      case 'structure':
        return <div className="h-full py-4"><FileTreeCard files={projectData.files} /></div>;
      case 'heatmap':
        return <div className="py-10"><HeatMapCard cells={projectData.heatmap} /></div>;
      case 'roadmap':
        return <div className="max-w-xl mx-auto py-10"><RoadmapCard roadmap={projectData.roadmap} /></div>;
      case 'overview':
      default:
        return <LivePreview data={projectData} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#010309] text-gray-100 overflow-hidden relative selection:bg-cyan-500/30 selection:text-white">
      {/* GLOBAL TV SCANLINE & STATIC OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-[90] opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.08),rgba(0,255,0,0.03),rgba(0,0,255,0.08))] bg-[length:100%_2.5px,5px_100%]"></div>
      
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          devMode={devMode}
          setDevMode={setDevMode}
        />
        
        <main className="flex-1 relative overflow-y-auto bg-[#010309]/90 p-10 scroll-smooth custom-scrollbar">
          {/* INITIAL STATE: BROADCAST READY */}
          {!projectData && !isAnalyzing ? (
            <div className="flex flex-col h-full space-y-12">
              <TVLiveFeed data={null} />
              <div className="flex-1 flex items-center justify-center">
                <ProjectUploader onFilesSelected={handleFilesSelected} />
              </div>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col h-full space-y-12">
              <TVLiveFeed data={null} />
              <div className="flex-1 flex flex-col items-center justify-center space-y-20 animate-in tv-on">
                {/* LARGE SCANNER LOGO */}
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 border-2 border-purple-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin [animation-duration:3.5s]"></div>
                  <div className="absolute inset-12 border-t-2 border-cyan-400 rounded-full animate-spin [animation-duration:1.8s]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-24 h-24 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="text-center space-y-8">
                  <h2 className="text-7xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-white to-cyan-400 bg-clip-text text-transparent uppercase italic">
                    Neural Decoding Active
                  </h2>
                  <div className="flex flex-col items-center gap-6">
                    <p className="text-xs text-gray-500 uppercase tracking-[0.7em] font-black">Mapping Heuristic Infrastructure</p>
                    <div className="text-[11px] text-purple-400 font-mono bg-purple-500/10 px-8 py-3 rounded-full border border-purple-500/20 shadow-2xl backdrop-blur-md">
                      CLUSTER_LINK :: {devMode.toUpperCase()} // UPLINK_SYNC: RT_CAM_01
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[1800px] mx-auto">
              {renderContent()}
            </div>
          )}
        </main>
      </div>
      
      <Footer />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #010309; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a202c; border-radius: 12px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2d3748; }
      `}</style>
    </div>
  );
};

export default App;
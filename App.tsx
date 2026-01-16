
import React, { useState, useCallback } from 'react';
import { TopBar } from './components/Layout/TopBar';
import { Sidebar } from './components/Layout/Sidebar';
import { Footer } from './components/Layout/Footer';
import { Dashboard } from './components/Dashboard';
import { ProjectUploader } from './components/ProjectUploader';
import { AnalysisResult, DevMode } from './types';
import { analyzeProjectFiles } from './engines/AnalysisEngine';
import { DNACard } from './components/Cards/DNACard';
import { HeatMapCard } from './components/Cards/HeatMapCard';
import { RoadmapCard } from './components/Cards/RoadmapCard';
import { FileTreeCard } from './components/Cards/FileTreeCard';

const App: React.FC = () => {
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred during analysis";
      alert(`Analysis failed: ${errorMessage}\nPlease check your internet connection and API key.`);
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
        return <Dashboard data={projectData} devMode={devMode} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          devMode={devMode}
          setDevMode={setDevMode}
        />
        
        <main className="flex-1 relative overflow-y-auto bg-gray-950/50 p-6 scroll-smooth">
          {!projectData && !isAnalyzing ? (
            <div className="flex items-center justify-center h-full">
              <ProjectUploader onFilesSelected={handleFilesSelected} />
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-pulse">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-purple-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-4 border-t-4 border-cyan-400 rounded-full animate-spin [animation-duration:1.5s]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-black text-white">PID</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-white to-cyan-400 bg-clip-text text-transparent uppercase">
                  Cognitive Scan Active
                </h2>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold">Vectorizing structure</p>
                  <p className="text-[10px] text-purple-400/60 font-mono">GEMINI_ENGINE_READY // MODE_{devMode.toUpperCase()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-1000">
              {renderContent()}
            </div>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;

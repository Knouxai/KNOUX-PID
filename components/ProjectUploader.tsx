import React, { useState, useRef, ChangeEvent } from 'react';

interface ProjectUploaderProps {
  onFilesSelected: (files: File[]) => void;
}

export const ProjectUploader: React.FC<ProjectUploaderProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handleBrowseFolder = async () => {
    // @ts-ignore - electronAPI might not exist in browser environment
    const api = window.electronAPI;
    if (api && typeof api.openFolderDialog === 'function') {
      try {
        const selectedPaths = await api.openFolderDialog();
        if (selectedPaths && Array.isArray(selectedPaths) && selectedPaths.length > 0) {
          alert(`Scanning Path: ${selectedPaths[0]}. \nReady to vectorize artifacts.`);
        }
      } catch (err) {
        console.error("Failed to open folder dialog", err);
        // Fallback to regular file input
        fileInputRef.current?.click();
      }
    } else {
      // No electron API available, just click the file input
      fileInputRef.current?.click();
    }
  };

  return (
    <div 
      className={`max-w-3xl w-full p-16 border-2 border-dashed rounded-[3rem] transition-all duration-700 flex flex-col items-center justify-center text-center relative overflow-hidden group ${
        isDragging 
          ? 'border-cyan-500 bg-cyan-500/10 scale-[1.01] shadow-[0_0_60px_rgba(6,182,212,0.2)]' 
          : 'border-white/10 hover:border-purple-500/30 hover:bg-white/5'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-0 animate-[scan_1.5s_infinite]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent"></div>
        </div>
      )}

      <div className={`w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl transition-all duration-700 relative z-10 ${isDragging ? 'rotate-12 scale-110 shadow-cyan-500/20' : 'group-hover:scale-105 group-hover:rotate-3'}`}>
        <div className="absolute inset-0 rounded-[2.5rem] bg-white/5 border border-white/10"></div>
        <svg className={`w-16 h-16 ${isDragging ? 'text-cyan-400' : 'text-purple-400'} transition-colors relative z-20`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      </div>

      <h2 className="text-4xl font-black text-white mb-4 tracking-tighter relative z-10">
        {isDragging ? "Target Acquired" : "Project Intelligence Input"}
      </h2>
      <p className="text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed text-sm relative z-10 font-medium">
        Submit your project directory to activate the KNOUX PID™ recursive heuristic engine.
      </p>

      <div className="flex flex-col sm:flex-row gap-5 relative z-10">
        <button 
          onClick={handleBrowseFolder}
          type="button"
          className="px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-purple-900/40 active:scale-95 border border-purple-400/20 flex items-center gap-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Browse Directory
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          type="button"
          className="px-12 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center gap-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Select Files
        </button>
      </div>

      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange}
        // Custom attributes handled safely via spread to bypass some TS strictness
        {...({ webkitdirectory: "true", directory: "true" } as any)}
      />

      <div className="mt-12 flex items-center gap-8 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Vectorization</span>
            <span className="text-[10px] font-bold text-cyan-400">GEMINI_FLASH_V3</span>
        </div>
        <div className="w-px h-8 bg-white/10"></div>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Data Vault</span>
            <span className="text-[10px] font-bold text-green-500">AES_256_LOCAL</span>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -5%; opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
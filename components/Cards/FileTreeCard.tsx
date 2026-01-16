
import React, { useState } from 'react';
import { ProjectFile, FileStatus } from '../../types';

export const FileTreeCard: React.FC<{ files: ProjectFile[] }> = ({ files }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.path.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50);

  const getStatusColor = (status: FileStatus) => {
    switch (status) {
      case FileStatus.READY: return 'bg-green-500';
      case FileStatus.PARTIAL: return 'bg-yellow-500';
      case FileStatus.STUB: return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">Project Architecture</h3>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Internal File Hierarchy</p>
        </div>
        <div className="w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search artifacts..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {filteredFiles.map((file, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all cursor-default">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-lg">
                {file.name.includes('.') ? '📄' : '📁'}
              </span>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-gray-200 truncate">{file.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{file.path}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-[10px] text-gray-600 font-mono">{(file.size / 1024).toFixed(1)}KB</span>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(file.status)} shadow-lg`}></div>
            </div>
          </div>
        ))}
        {filteredFiles.length === 0 && (
          <div className="text-center py-20 text-gray-600 font-bold uppercase tracking-widest">
            No Artifacts Found
          </div>
        )}
      </div>
    </div>
  );
};

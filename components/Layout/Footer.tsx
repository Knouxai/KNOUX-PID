
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-8 border-t border-white/5 bg-gray-950 flex items-center justify-between px-6 text-[10px] font-medium text-gray-600 uppercase tracking-wider">
      <div>&copy; 2026 KNOUX PID™ — Advanced Project Intelligence</div>
      <div className="flex gap-4">
        <span className="text-gray-500 cursor-pointer hover:text-gray-300">Docs</span>
        <span className="text-gray-500 cursor-pointer hover:text-gray-300">Privacy</span>
        <span className="text-gray-400 font-bold">Latency: 42ms</span>
      </div>
    </footer>
  );
};

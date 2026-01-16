
import React, { useRef, useEffect, useCallback } from 'react';
import { HeatMapCell } from '../types';

interface HeatMapVisualProps {
  heatmap: HeatMapCell[];
}

export const HeatMapVisual: React.FC<HeatMapVisualProps> = ({ heatmap }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const hoverInfo = useRef<{ file: string | null; x: number; y: number }>({ file: null, x: 0, y: 0 });

  const getColor = (status: string, alpha: number = 0.9): string => {
    switch (status) {
      case 'critical': return `rgba(239, 68, 68, ${alpha})`; 
      case 'warning': return `rgba(245, 158, 11, ${alpha})`;
      case 'stable': return `rgba(16, 185, 129, ${alpha})`;
      default: return `rgba(107, 114, 128, ${alpha})`;
    }
  };

  const calculateGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { cols: 0, rows: 0, cellSize: 0 };

    const padding = 40;
    const availableWidth = canvas.width - padding * 2;
    const availableHeight = canvas.height - padding * 2;
    
    const count = Math.max(heatmap.length, 1);
    const aspectRatio = availableWidth / availableHeight;
    const cols = Math.ceil(Math.sqrt(count * aspectRatio));
    const rows = Math.ceil(count / cols);
    const cellSize = Math.min(availableWidth / cols, availableHeight / rows, 20);

    return { cols, rows, cellSize, offsetX: (canvas.width - cols * cellSize) / 2, offsetY: (canvas.height - rows * cellSize) / 2 };
  }, [heatmap]);

  const drawHeatmap = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const { cols, rows, cellSize, offsetX, offsetY } = calculateGrid();
    const total = heatmap.length;
    const elapsed = (time - startTimeRef.current) / 1000;

    // Clear with Deep Space Black
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Cyber-Grid Background
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Dynamic Radar Scanning Effect
    const scanY = (elapsed * 180) % canvas.height;
    const scanGradient = ctx.createLinearGradient(0, scanY - 120, 0, scanY);
    scanGradient.addColorStop(0, 'transparent');
    scanGradient.addColorStop(1, 'rgba(34, 211, 238, 0.15)');
    ctx.fillStyle = scanGradient;
    ctx.fillRect(0, scanY - 120, canvas.width, 120);
    
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(canvas.width, scanY); ctx.stroke();

    // Secondary vertical scan line for "radar sweep" look
    const scanX = (elapsed * 120) % canvas.width;
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.beginPath(); ctx.moveTo(scanX, 0); ctx.lineTo(scanX, canvas.height); ctx.stroke();

    // Render Nodes (GPU-friendly roundRect)
    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const x = col * cellSize + offsetX;
      const y = row * cellSize + offsetY;

      // Distance-based reactivity to the scan bar
      const dist = Math.abs(y - scanY);
      const reactBoost = dist < 60 ? (1 - dist / 60) * 0.4 : 0;

      const cell = heatmap[i];
      const pulse = Math.sin(elapsed * 4 + i * 0.1) * 0.1 + 0.9;
      
      // Node Body
      ctx.fillStyle = getColor(cell.status, (pulse + reactBoost) * 0.8);
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, cellSize - 4, cellSize - 4, 3);
      ctx.fill();

      // Conditional Glow (only for nearby or critical nodes to save performance)
      if (reactBoost > 0.1 || cell.status === 'critical') {
          ctx.shadowBlur = 12 * (pulse + reactBoost);
          ctx.shadowColor = getColor(cell.status, 0.6);
          ctx.stroke();
          ctx.shadowBlur = 0;
      }
    }

    // Holographic Tooltip Interface
    if (hoverInfo.current.file) {
      const { x, y, file } = hoverInfo.current;
      const text = `SYS.NODE :: ${file!.toUpperCase()}`;
      ctx.font = '900 11px "Inter", monospace';
      const metrics = ctx.measureText(text);
      
      // UI Floating Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x + 20, y - 35, metrics.width + 30, 26, 6);
      ctx.fill();
      ctx.stroke();
      
      // Text with shadow
      ctx.fillStyle = '#A78BFA';
      ctx.shadowColor = 'rgba(139, 92, 246, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(text, x + 35, y - 18);
      ctx.shadowBlur = 0;
      
      // UI Tracking Line
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 20, y - 22);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [heatmap, calculateGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        const ctx = canvas.getContext('2d');
        ctx?.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const frame = (time: number) => {
      drawHeatmap(time);
      animationRef.current = requestAnimationFrame(frame);
    };
    animationRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [drawHeatmap]);

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { cols, rows, cellSize, offsetX, offsetY } = calculateGrid();
    const col = Math.floor((x - offsetX) / cellSize);
    const row = Math.floor((y - offsetY) / cellSize);
    const index = row * cols + col;

    if (index >= 0 && index < heatmap.length && x >= offsetX && y >= offsetY && x <= canvas.width - offsetX && y <= canvas.height - offsetY) {
      hoverInfo.current = { file: heatmap[index].path.split('/').pop() || heatmap[index].path, x, y };
    } else {
      hoverInfo.current = { file: null, x, y };
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-950/60 rounded-[2.5rem] overflow-hidden border border-white/10 group cursor-crosshair">
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointer}
        onPointerLeave={() => hoverInfo.current = { file: null, x: 0, y: 0 }}
        className="w-full h-full"
      />
      
      {/* UI Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent group-hover:border-purple-500/[0.03] transition-all duration-1000"></div>
      
      {/* Data HUD */}
      <div className="absolute top-8 left-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping absolute inset-0"></div>
            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
          </div>
          <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] drop-shadow-md">Spatial Analysis Engine</span>
        </div>
        <div className="flex gap-4">
           <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Nodes: {heatmap.length}</span>
           <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Mode: RT_SCAN_V4</span>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex items-center gap-6 bg-black/40 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Production</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_8px_#eab308]"></div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Stub</span>
        </div>
      </div>

      {/* Crosshair Artifacts */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white"></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-white"></div>
      </div>
    </div>
  );
};

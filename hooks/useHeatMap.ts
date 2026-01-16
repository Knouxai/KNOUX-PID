
import { useMemo } from 'react';
import { AnalysisResult, HeatMapCell } from '../types';

export function useHeatMap(data: AnalysisResult | null): HeatMapCell[] {
  return useMemo(() => {
    if (!data) return [];
    
    // We already have heatmap from the engine, but we can enrich it here
    // for UI-specific needs or additional visual variants.
    return data.heatmap.map(cell => ({
      ...cell,
      // Dynamic scaling for UI
      size: Math.max(cell.size, 100)
    }));
  }, [data]);
}

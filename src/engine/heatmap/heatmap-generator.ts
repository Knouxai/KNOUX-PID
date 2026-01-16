import { FileIntelligence } from '../intelligence/file-analyzer';

interface HeatmapData {
  files: {
    [filePath: string]: {
      temperature: number; // 0-1 scale, higher = hotter
      color: string; // Hex color based on temperature
      metrics: {
        complexity: number;
        todoCount: number;
        lineCount: number;
        status: 'stub' | 'partial' | 'ready';
      };
    };
  };
  folders: {
    [folderPath: string]: {
      temperature: number;
      color: string;
      avgTemperature: number;
    };
  };
  legend: {
    cold: string;
    warm: string;
    hot: string;
  };
}

export async function generateHeatmap(fileIntelligence: FileIntelligence[]): Promise<HeatmapData> {
  console.log(`Generating heatmap for ${fileIntelligence.length} files`);
  
  const files: HeatmapData['files'] = {};
  const folders: HeatmapData['folders'] = {};
  
  // Process each file to calculate its temperature
  for (const file of fileIntelligence) {
    const temperature = calculateFileTemperature(file);
    const color = temperatureToColor(temperature);
    
    files[file.path] = {
      temperature,
      color,
      metrics: {
        complexity: file.complexity,
        todoCount: file.todoCount,
        lineCount: file.lineCount,
        status: file.status
      }
    };
    
    // Update folder temperatures
    const folderPath = getFolderPath(file.path);
    if (!folders[folderPath]) {
      folders[folderPath] = {
        temperature: 0,
        color: '',
        avgTemperature: 0
      };
    }
    
    // Add to folder's total for averaging later
    if (!folders[folderPath].hasOwnProperty('temperatures')) {
      (folders[folderPath] as any).temperatures = [];
    }
    (folders[folderPath] as any).temperatures.push(temperature);
  }
  
  // Calculate average temperature for each folder
  for (const [folderPath, folderData] of Object.entries(folders)) {
    const temps = (folderData as any).temperatures as number[];
    if (temps.length > 0) {
      const avgTemp = temps.reduce((sum, t) => sum + t, 0) / temps.length;
      folderData.avgTemperature = avgTemp;
      folderData.temperature = avgTemp;
      folderData.color = temperatureToColor(avgTemp);
    }
    delete (folderData as any).temperatures; // Clean up temporary property
  }
  
  return {
    files,
    folders,
    legend: {
      cold: '#1e3a8a', // Deep blue
      warm: '#f59e0b', // Amber
      hot: '#dc2626'  // Red
    }
  };
}

function calculateFileTemperature(file: FileIntelligence): number {
  // Calculate temperature based on multiple factors
  // Higher complexity, more TODOs, and stub/partial status increase temperature
  
  // Normalize complexity (assuming max complexity of 100 for normalization)
  const normalizedComplexity = Math.min(file.complexity / 100, 1);
  
  // Normalize TODO count (assuming max 20 TODOs for normalization)
  const normalizedTodoCount = Math.min(file.todoCount / 20, 1);
  
  // Status affects temperature: stub = hottest, partial = medium, ready = coolest
  let statusFactor = 0;
  if (file.status === 'stub') statusFactor = 1;
  else if (file.status === 'partial') statusFactor = 0.6;
  else if (file.status === 'ready') statusFactor = 0.2;
  
  // Combine factors with weights
  const temperature = (
    normalizedComplexity * 0.3 +     // Complexity contributes 30%
    normalizedTodoCount * 0.4 +      // TODOs contribute 40% 
    statusFactor * 0.3               // Status contributes 30%
  );
  
  // Ensure temperature is between 0 and 1
  return Math.max(0, Math.min(1, temperature));
}

function temperatureToColor(temperature: number): string {
  // Convert temperature (0-1) to color gradient
  // 0 = cold (blue) -> 0.5 = warm (yellow) -> 1 = hot (red)
  
  if (temperature <= 0.5) {
    // From blue to yellow (0 to 0.5)
    const factor = temperature * 2; // Scale to 0-1 range within this segment
    const r = Math.round(255 * factor); // Increase red
    const g = Math.round(255 * factor); // Increase green
    const b = Math.round(255 * (1 - factor)); // Decrease blue
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } else {
    // From yellow to red (0.5 to 1)
    const factor = (temperature - 0.5) * 2; // Scale to 0-1 range within this segment
    const r = 255; // Full red
    const g = Math.round(255 * (1 - factor)); // Decrease green
    const b = 0; // No blue
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}

function getFolderPath(filePath: string): string {
  const parts = filePath.split('/');
  if (parts.length <= 1) return '/';
  
  // Return the directory path without the filename
  return parts.slice(0, -1).join('/');
}
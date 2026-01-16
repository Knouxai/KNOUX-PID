import { FileIntelligence } from '../intelligence/file-analyzer';

interface ProgressData {
  overallScore: number;
  fileProgress: {
    total: number;
    ready: number;
    partial: number;
    stub: number;
    readyPercentage: number;
  };
  folderProgress: {
    [folderPath: string]: {
      total: number;
      ready: number;
      partial: number;
      stub: number;
      readyPercentage: number;
    };
  };
  sectionProgress: {
    frontend: number;
    backend: number;
    config: number;
    tests: number;
  };
}

export async function calculateProgress(fileIntelligence: FileIntelligence[]): Promise<ProgressData> {
  console.log(`Calculating progress for ${fileIntelligence.length} files`);
  
  // Calculate overall file progress
  const fileProgress = calculateFileProgress(fileIntelligence);
  
  // Calculate folder progress
  const folderProgress = calculateFolderProgress(fileIntelligence);
  
  // Calculate section progress
  const sectionProgress = calculateSectionProgress(fileIntelligence);
  
  // Calculate overall score (weighted average)
  const overallScore = calculateOverallScore(
    fileProgress.readyPercentage,
    Object.values(folderProgress).map(f => f.readyPercentage),
    sectionProgress
  );
  
  return {
    overallScore,
    fileProgress,
    folderProgress,
    sectionProgress
  };
}

function calculateFileProgress(fileIntelligence: FileIntelligence[]): ProgressData['fileProgress'] {
  let total = 0;
  let ready = 0;
  let partial = 0;
  let stub = 0;
  
  for (const file of fileIntelligence) {
    total++;
    switch (file.status) {
      case 'ready':
        ready++;
        break;
      case 'partial':
        partial++;
        break;
      case 'stub':
        stub++;
        break;
    }
  }
  
  const readyPercentage = total > 0 ? (ready / total) * 100 : 0;
  
  return {
    total,
    ready,
    partial,
    stub,
    readyPercentage
  };
}

function calculateFolderProgress(fileIntelligence: FileIntelligence[]): ProgressData['folderProgress'] {
  const folderMap: { [folderPath: string]: FileIntelligence[] } = {};
  
  // Group files by folder
  for (const file of fileIntelligence) {
    const folderPath = getFolderPath(file.path);
    if (!folderMap[folderPath]) {
      folderMap[folderPath] = [];
    }
    folderMap[folderPath].push(file);
  }
  
  const result: ProgressData['folderProgress'] = {};
  
  for (const [folderPath, files] of Object.entries(folderMap)) {
    let total = 0;
    let ready = 0;
    let partial = 0;
    let stub = 0;
    
    for (const file of files) {
      total++;
      switch (file.status) {
        case 'ready':
          ready++;
          break;
        case 'partial':
          partial++;
          break;
        case 'stub':
          stub++;
          break;
      }
    }
    
    const readyPercentage = total > 0 ? (ready / total) * 100 : 0;
    
    result[folderPath] = {
      total,
      ready,
      partial,
      stub,
      readyPercentage
    };
  }
  
  return result;
}

function calculateSectionProgress(fileIntelligence: FileIntelligence[]): ProgressData['sectionProgress'] {
  // Categorize files by section
  const frontendFiles = fileIntelligence.filter(file => 
    file.path.includes('/src/') || 
    file.path.includes('/components/') || 
    file.path.includes('/pages/') ||
    file.path.includes('/views/')
  );
  
  const backendFiles = fileIntelligence.filter(file => 
    file.path.includes('/api/') || 
    file.path.includes('/routes/') || 
    file.path.includes('/controllers/') ||
    file.path.includes('/models/') ||
    file.path.includes('/services/')
  );
  
  const configFiles = fileIntelligence.filter(file => 
    file.path.includes('config') || 
    file.path.includes('env') || 
    file.path.includes('settings') ||
    file.path.endsWith('config.json') ||
    file.path.endsWith('config.js') ||
    file.path.endsWith('env')
  );
  
  const testFiles = fileIntelligence.filter(file => 
    file.path.includes('/test/') || 
    file.path.includes('/tests/') || 
    file.path.includes('__tests__/') ||
    file.path.endsWith('.spec.js') ||
    file.path.endsWith('.test.js') ||
    file.path.endsWith('.spec.ts') ||
    file.path.endsWith('.test.ts')
  );
  
  const calculateSectionPercentage = (files: FileIntelligence[]) => {
    if (files.length === 0) return 0;
    
    const readyCount = files.filter(f => f.status === 'ready').length;
    return (readyCount / files.length) * 100;
  };
  
  return {
    frontend: calculateSectionPercentage(frontendFiles),
    backend: calculateSectionPercentage(backendFiles),
    config: calculateSectionPercentage(configFiles),
    tests: calculateSectionPercentage(testFiles)
  };
}

function calculateOverallScore(
  fileReadyPercentage: number,
  folderReadyPercentages: number[],
  sectionProgress: ProgressData['sectionProgress']
): number {
  // Weighted scoring
  const fileWeight = 0.3;
  const folderWeight = 0.3;
  const sectionWeight = 0.4;
  
  // Calculate average folder percentage
  const avgFolderPercentage = folderReadyPercentages.length > 0 
    ? folderReadyPercentages.reduce((sum, p) => sum + p, 0) / folderReadyPercentages.length 
    : 0;
  
  // Calculate average section percentage
  const avgSectionPercentage = (
    sectionProgress.frontend + 
    sectionProgress.backend + 
    sectionProgress.config + 
    sectionProgress.tests
  ) / 4;
  
  // Calculate weighted overall score
  const overallScore = (
    fileReadyPercentage * fileWeight +
    avgFolderPercentage * folderWeight +
    avgSectionPercentage * sectionWeight
  );
  
  return Math.round(overallScore * 100) / 100; // Round to 2 decimal places
}

function getFolderPath(filePath: string): string {
  const parts = filePath.split('/');
  if (parts.length <= 1) return '/';
  
  // Return the directory path without the filename
  return parts.slice(0, -1).join('/');
}
import { scanProjectStructure } from './scanner/structure-scanner';
import { analyzeFileIntelligence } from './intelligence/file-analyzer';
import { calculateProgress } from './ranking/progress-calculator';
import { generateHeatmap } from './heatmap/heatmap-generator';
import { generateSmartRoadmap } from './intelligence/roadmap-generator';
import { exportReport } from '../reports/report-exporter';

export interface AnalysisResult {
  projectSummary: {
    name: string;
    type: string;
    size: number;
    score: number;
  };
  detectedStack: string[];
  folderTree: any;
  progressData: any;
  heatmapData: any;
  roadmap: any;
}

export class AnalysisEngine {
  private projectPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  async analyze(): Promise<AnalysisResult> {
    console.log(`Starting analysis for project: ${this.projectPath}`);
    
    // Phase 1: Structure Analysis
    const structureData = await scanProjectStructure(this.projectPath);
    
    // Phase 2: File Intelligence
    const fileIntelligence = await analyzeFileIntelligence(this.projectPath);
    
    // Phase 3: Progress Calculation
    const progressData = await calculateProgress(fileIntelligence);
    
    // Phase 4: Heatmap Generation
    const heatmapData = await generateHeatmap(fileIntelligence);
    
    // Phase 5: Smart Roadmap
    const roadmap = await generateSmartRoadmap(structureData, fileIntelligence);
    
    // Compile final results
    const result: AnalysisResult = {
      projectSummary: {
        name: structureData.name || 'Unknown Project',
        type: structureData.type || 'Generic',
        size: structureData.size || 0,
        score: progressData.overallScore || 0
      },
      detectedStack: structureData.detectedStack || [],
      folderTree: structureData.folderTree,
      progressData,
      heatmapData,
      roadmap
    };

    console.log('Analysis completed successfully');
    return result;
  }

  async exportResults(format: 'txt' | 'json' | 'html'): Promise<string> {
    const results = await this.analyze();
    return exportReport(results, format);
  }
}

export enum FileStatus {
  STUB = 'stub',
  PARTIAL = 'partial',
  READY = 'ready'
}

export enum DevMode {
  NEW_DEVELOPER = 'new',
  MAINTENANCE = 'maintenance',
  REFACTOR = 'refactor',
  PRODUCTION = 'production'
}

export interface AnalysisLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  size: number;
  status: FileStatus;
  type: 'file' | 'directory';
  content?: string;
  todoCount?: number;
  fixmeCount?: number;
  commentDensity?: number;
}

export interface ProjectDNA {
  framework: string;
  language: string;
  type: string;
  confidence: number;
}

export interface ProjectQuality {
  readiness: number;
  complexity: number;
  totalFiles: number;
  ready: number;
  partial: number;
  stub: number;
}

export interface HeatMapCell {
  path: string;
  status: 'critical' | 'warning' | 'stable';
  size: number;
}

export interface AnalysisResult {
  dna: ProjectDNA;
  quality: ProjectQuality;
  heatmap: HeatMapCell[];
  roadmap: string[];
  files: ProjectFile[];
  summary: string;
  logs: AnalysisLog[];
  tree: {
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
  };
}

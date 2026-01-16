
import { GoogleGenAI, Type } from "@google/genai";
import { 
  ProjectFile, 
  FileStatus, 
  AnalysisResult, 
  ProjectDNA, 
  ProjectQuality, 
  HeatMapCell,
  DevMode,
  AnalysisLog
} from '../types';
import { Config } from '../utils/config';

// Configuration constants
const CONFIG = {
  MAX_FILE_SIZE: 8192,
  MAX_CONTENT_PREVIEW_LENGTH: 2500,
  MAX_FILE_LIST_LENGTH: 3000,
  HERO_FILES: [
    'package.json', 
    'README.md', 
    'tsconfig.json', 
    'vite.config.ts', 
    'main.tsx', 
    'App.tsx', 
    'index.html'
  ],
  AI_MODEL: 'gemini-3-flash-preview',
  CONTENT_REGEXES: {
    TODO: /TODO|FIXME|STUB|IMPLEMENT_ME|DEBUG/i,
    EXPORTS: /\bexport\b/i,
    IMPORTS: /\bimport\b/i,
    LOGIC: /\b(function|class|const|let|var|if|for|while|switch|map|filter)\b/i,
    CONFIG: /\.(json|yaml|yml|md|conf|env)$/i,
    TYPE_ONLY: /\.d\.ts$|(\.ts$.*\b(interface|type)\b)/i,
    COMMENTS: /^(\/\/|\s*\/\*)/,
    TODO_FIXME: /TODO|FIXME/gi,
    COMMENTS_LINES: /^(\/\/|\s*\/\*)/
  },
  SIZE_THRESHOLDS: {
    SMALL_FILE: 200,
    MEDIUM_FILE: 8192,
    MIN_LOGIC_LINES: 30
  }
};

const ai = new GoogleGenAI({ apiKey: Config.API_KEY });

const createLog = (message: string, level: AnalysisLog['level'] = 'info'): AnalysisLog => ({
  timestamp: new Date().toLocaleTimeString(),
  level,
  message
});

async function getHeroFileContent(files: File[]): Promise<string> {
  let context = "";

  const selectedFiles = files.filter(f => 
    CONFIG.HERO_FILES.some(hero => f.name.toLowerCase().includes(hero.toLowerCase()))
  ).slice(0, 6);

  for (const file of selectedFiles) {
    try {
      const text = await file.text();
      context += `\n--- FILE: ${file.name} ---\n${text.substring(0, CONFIG.MAX_CONTENT_PREVIEW_LENGTH)}\n`;
    } catch (e) {
      console.warn(`Could not read ${file.name}`, e);
    }
  }
  return context;
}

const determineStatus = (name: string, size: number, content: string): FileStatus => {
  const trimmedContent = content.trim();
  const lines = trimmedContent.split('\n').filter(l => l.trim().length > 0);
  const lineCount = lines.length;
  
  const hasTodo = CONFIG.CONTENT_REGEXES.TODO.test(content);
  const hasExports = CONFIG.CONTENT_REGEXES.EXPORTS.test(content);
  const hasImports = CONFIG.CONTENT_REGEXES.IMPORTS.test(content);
  const hasLogic = CONFIG.CONTENT_REGEXES.LOGIC.test(content);
  const isConfig = CONFIG.CONTENT_REGEXES.CONFIG.test(name);
  const isTypeOnly = CONFIG.CONTENT_REGEXES.TYPE_ONLY.test(name) || 
                     (/\.ts$/i.test(name) && !hasLogic && /\b(interface|type)\b/i.test(content));

  if ((isConfig || isTypeOnly) && size > CONFIG.SIZE_THRESHOLDS.SMALL_FILE) return FileStatus.READY;
  if (hasExports && hasLogic && lineCount > CONFIG.SIZE_THRESHOLDS.MIN_LOGIC_LINES && !hasTodo) return FileStatus.READY;
  if (size < CONFIG.SIZE_THRESHOLDS.SMALL_FILE || (hasTodo && lineCount < 8)) return FileStatus.STUB;
  if (!hasExports && !hasImports && lineCount < 15 && !isConfig) return FileStatus.STUB;

  return FileStatus.PARTIAL;
};

export const analyzeProjectFiles = async (files: File[], devMode: DevMode = DevMode.NEW_DEVELOPER): Promise<AnalysisResult> => {
  const logs: AnalysisLog[] = [];
  logs.push(createLog(`Initializing intelligence scan: MODE_${String(devMode).toUpperCase()}`));
  
  const projectFiles: ProjectFile[] = await Promise.all(files.map(async f => {
    let content = "";
    try {
      content = await f.slice(0, CONFIG.MAX_FILE_SIZE).text();
    } catch (e) {
      console.warn(`Read error on ${f.name}`, e);
    }

    const status = determineStatus(f.name, f.size, content);
    const todoCount = (content.match(CONFIG.CONTENT_REGEXES.TODO_FIXME) || []).length;
    const fixmeCount = (content.match(/FIXME/gi) || []).length;
    const lines = content.split('\n');
    const commentLines = lines.filter(l => CONFIG.CONTENT_REGEXES.COMMENTS_LINES.test(l.trim())).length;
    const commentDensity = lines.length > 0 ? commentLines / lines.length : 0;

    return {
      name: f.name,
      path: (f as any).webkitRelativePath || f.name,
      size: f.size,
      status: status,
      type: 'file',
      todoCount,
      fixmeCount,
      commentDensity
    };
  }));

  logs.push(createLog(`Vectorized ${projectFiles.length} artifacts with structural heuristic filters.`));
  
  const dna = detectDNA(projectFiles);
  logs.push(createLog(`DNA Detected: ${dna.framework} ecosystem [${dna.language}].`, 'success'));

  const quality = calculateQuality(projectFiles);
  logs.push(createLog(`Calculated system readiness: ${Math.round(quality.readiness * 100)}%.`));

  const heatmap = generateHeatMap(projectFiles);
  logs.push(createLog(`Heatmap mapped for ${heatmap.length} data points.`));

  const tree = {
    totalFiles: projectFiles.length,
    totalFolders: new Set(projectFiles.map(f => f.path.split('/').slice(0, -1).join('/'))).size,
    totalSize: projectFiles.reduce((acc, f) => acc + f.size, 0)
  };

  const heroContent = await getHeroFileContent(files);
  const fileList = projectFiles.map(f => f.path).join('\n').substring(0, CONFIG.MAX_FILE_LIST_LENGTH);

  let summary = "Structural analysis complete. This project appears to be a high-density application.";
  let roadmap: string[] = [];

  const devModeDescriptions: Record<string, string> = {
    [DevMode.NEW_DEVELOPER]: "focus on onboarding, entry points, and high-level architecture.",
    [DevMode.MAINTENANCE]: "focus on stability, legacy patterns, and technical debt.",
    [DevMode.REFACTOR]: "focus on performance, modernizing patterns, and cleaning code smells.",
    [DevMode.PRODUCTION]: "focus on security, test coverage, and deployment readiness."
  };

  const currentDesc = devModeDescriptions[devMode] || "general intelligence scan";
  const prompt = `You are a world-class senior software architect. Analyze this project structure and content:
      
      CONTEXT: ${String(devMode).toUpperCase()} (${currentDesc})
      FILES: ${fileList}
      PREVIEWS: ${heroContent}`;

  logs.push(createLog(`Engaging ${CONFIG.AI_MODEL} for architectural synthesis...`));

  try {
    const response = await ai.models.generateContent({
      model: CONFIG.AI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A professional 2-3 sentence executive summary of the project architecture and purpose."
            },
            roadmap: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "6 specific, prioritized action items tailored to the dev mode."
            }
          },
          required: ["summary", "roadmap"]
        }
      }
    });

    const aiResult = JSON.parse(response.text || "{}");
    summary = aiResult.summary || summary;
    roadmap = aiResult.roadmap || [];
    logs.push(createLog(`Synthesis successful. Intelligence data integrated.`, 'success'));
  } catch (error) {
    logs.push(createLog(`AI synthesis interrupted. Reverting to structural heuristics.`, 'warn'));
    console.error("AI analysis error:", error);
    roadmap = generateHeuristicRoadmap(dna, projectFiles);
  }

  return {
    dna,
    quality,
    heatmap,
    roadmap: roadmap.length > 0 ? roadmap : generateHeuristicRoadmap(dna, projectFiles),
    files: projectFiles,
    summary,
    logs,
    tree
  };
};

const detectDNA = (files: ProjectFile[]): ProjectDNA => {
  let framework = 'Native JS';
  let language = 'JavaScript';
  let type = 'Monolithic';
  let confidence = 0.4;

  const filenames = files.map(f => f.name.toLowerCase());
  
  if (filenames.includes('package.json')) confidence += 0.3;
  if (filenames.some(f => f.endsWith('.tsx') || f.endsWith('.ts'))) {
    language = 'TypeScript';
    confidence += 0.2;
  }

  if (filenames.some(f => f.includes('react') || f.includes('next'))) framework = 'React / Next.js';
  else if (filenames.some(f => f.includes('vue'))) framework = 'Vue.js';
  else if (filenames.some(f => f.includes('angular'))) framework = 'Angular';
  else if (filenames.some(f => f.includes('svelte'))) framework = 'Svelte';

  if (filenames.some(f => f.includes('component') || f.includes('view'))) type = 'Component-Based';
  else if (filenames.some(f => f.includes('service'))) type = 'Service-Oriented';

  return { framework, language, type, confidence: Math.min(confidence, 1.0) };
};

const calculateQuality = (files: ProjectFile[]): ProjectQuality => {
  const total = files.length;
  const ready = files.filter(f => f.status === FileStatus.READY).length;
  const partial = files.filter(f => f.status === FileStatus.PARTIAL).length;
  const stub = files.filter(f => f.status === FileStatus.STUB).length;
  return {
    readiness: total > 0 ? ready / total : 0,
    complexity: total > 0 ? (partial * 0.4 + stub * 0.8) / total : 0,
    totalFiles: total,
    ready,
    partial,
    stub
  };
};

const generateHeatMap = (files: ProjectFile[]): HeatMapCell[] => {
  return files.map(f => ({
    path: f.path,
    size: f.size,
    status: f.status === FileStatus.READY ? 'stable' : f.status === FileStatus.PARTIAL ? 'warning' : 'critical'
  }));
};

const generateHeuristicRoadmap = (dna: ProjectDNA, files: ProjectFile[]): string[] => {
  return [
    `Validate ${dna.framework} entry points for structural errors.`,
    `Review placeholder stubs in core logic modules.`,
    `Audit ${dna.language} configuration manifests.`,
    `Examine asset pipeline for optimization opportunities.`,
    `Identify code smells in high-complexity nodes.`,
    `Cross-reference dependency versions in package.json.`
  ];
};

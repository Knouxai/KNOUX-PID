
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

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createLog = (message: string, level: AnalysisLog['level'] = 'info'): AnalysisLog => ({
  timestamp: new Date().toLocaleTimeString(),
  level,
  message
});

async function getHeroFileContent(files: File[]): Promise<string> {
  const heroFilenames = ['package.json', 'README.md', 'tsconfig.json', 'vite.config.ts', 'main.tsx', 'App.tsx', 'index.html'];
  let context = "";

  const selectedFiles = files.filter(f => 
    heroFilenames.some(hero => f.name.toLowerCase().includes(hero.toLowerCase()))
  ).slice(0, 6);

  for (const file of selectedFiles) {
    try {
      const text = await file.text();
      context += `\n--- FILE: ${file.name} ---\n${text.substring(0, 2500)}\n`;
    } catch (e) {
      console.warn(`Could not read ${file.name}`);
    }
  }
  return context;
}

const determineStatus = (name: string, size: number, content: string): FileStatus => {
  const trimmedContent = content.trim();
  const lines = trimmedContent.split('\n').filter(l => l.trim().length > 0);
  const lineCount = lines.length;
  
  const hasTodo = /TODO|FIXME|STUB|IMPLEMENT_ME|DEBUG/i.test(content);
  const hasExports = /\bexport\b/i.test(content);
  const hasImports = /\bimport\b/i.test(content);
  const hasLogic = /\b(function|class|const|let|var|if|for|while|switch|map|filter)\b/i.test(content);
  const isConfig = /\.(json|yaml|yml|md|conf|env)$/i.test(name);
  const isTypeOnly = /\.d\.ts$/i.test(name) || (/\.ts$/i.test(name) && !hasLogic && /\b(interface|type)\b/i.test(content));

  if ((isConfig || isTypeOnly) && size > 100) return FileStatus.READY;
  if (hasExports && hasLogic && lineCount > 30 && !hasTodo) return FileStatus.READY;
  if (size < 200 || (hasTodo && lineCount < 8)) return FileStatus.STUB;
  if (!hasExports && !hasImports && lineCount < 15 && !isConfig) return FileStatus.STUB;

  return FileStatus.PARTIAL;
};

export const analyzeProjectFiles = async (files: File[], devMode: DevMode = DevMode.NEW_DEVELOPER): Promise<AnalysisResult> => {
  const logs: AnalysisLog[] = [];
  logs.push(createLog(`Initializing intelligence scan: MODE_${String(devMode).toUpperCase()}`));
  
  const projectFiles: ProjectFile[] = await Promise.all(files.map(async f => {
    let content = "";
    try {
      content = await f.slice(0, 8192).text();
    } catch (e) {
      console.warn(`Read error on ${f.name}`);
    }

    const status = determineStatus(f.name, f.size, content);
    const todoCount = (content.match(/TODO/gi) || []).length;
    const fixmeCount = (content.match(/FIXME/gi) || []).length;
    const lines = content.split('\n');
    const commentLines = lines.filter(l => l.trim().startsWith('//') || l.trim().startsWith('/*')).length;
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
  const fileList = projectFiles.map(f => f.path).join('\n').substring(0, 3000);

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

  logs.push(createLog(`Engaging Gemini-3-Flash for architectural synthesis...`));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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

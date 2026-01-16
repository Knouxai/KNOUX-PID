import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface FileIntelligence {
  path: string;
  status: 'stub' | 'partial' | 'ready';
  lineCount: number;
  logicDensity: number;
  todoCount: number;
  functionCount: number;
  classCount: number;
  importCount: number;
  complexity: number;
}

export async function analyzeFileIntelligence(projectPath: string): Promise<FileIntelligence[]> {
  console.log(`Analyzing file intelligence for: ${projectPath}`);
  
  const files = glob.sync('**/*.{js,jsx,ts,tsx,py,java,cpp,cs,go}', { 
    cwd: projectPath, 
    nodir: true,
    ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**', '*.min.*']
  });
  
  const results: FileIntelligence[] = [];
  
  for (const file of files) {
    const fullPath = path.join(projectPath, file);
    const stats = await analyzeSingleFile(fullPath);
    results.push(stats);
  }
  
  return results;
}

async function analyzeSingleFile(filePath: string): Promise<FileIntelligence> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Count lines
  const lineCount = lines.length;
  
  // Count TODOs
  const todoCount = (content.match(/\btodo\b|\bfixme\b|\bxxx\b/gi) || []).length;
  
  // Count functions and classes
  const functionCount = countFunctions(content);
  const classCount = countClasses(content);
  
  // Count imports
  const importCount = countImports(content);
  
  // Calculate logic density (functions + classes per line)
  const logicDensity = lineCount > 0 ? (functionCount + classCount) / lineCount : 0;
  
  // Calculate complexity (simplified)
  const complexity = calculateComplexity(content);
  
  // Determine status
  let status: 'stub' | 'partial' | 'ready' = 'ready';
  if (todoCount > 0 || functionCount === 0) {
    status = 'stub';
  } else if (todoCount > 3 || logicDensity < 0.05) {
    status = 'partial';
  }
  
  return {
    path: filePath,
    status,
    lineCount,
    logicDensity,
    todoCount,
    functionCount,
    classCount,
    importCount,
    complexity
  };
}

function countFunctions(content: string): number {
  // Match function declarations in various languages
  const jsFuncRegex = /(?:function\s+\w+|const\s+\w+\s*=|var\s+\w+\s*=|let\s+\w+\s*=|^\s*\w+\s*[:=]\s*function|=>)/gm;
  const pyFuncRegex = /^def\s+\w+/gm;
  const javaFuncRegex = /(?:public|private|protected)?\s+\w+\s+\w+\s*\([^)]*\)\s*(?:throws\s+\w+)?\s*\{/gm;
  const csFuncRegex = /(?:public|private|protected)?\s+\w+\s+\w+\s*\([^)]*\)\s*\{/gm;
  const goFuncRegex = /^func\s+\w+/gm;
  
  const matches = [
    ...content.matchAll(jsFuncRegex),
    ...content.matchAll(pyFuncRegex),
    ...content.matchAll(javaFuncRegex),
    ...content.matchAll(csFuncRegex),
    ...content.matchAll(goFuncRegex)
  ];
  
  return matches.length;
}

function countClasses(content: string): number {
  // Match class declarations in various languages
  const jsClassRegex = /class\s+\w+/g;
  const pyClassRegex = /^class\s+\w+/gm;
  const javaCsClassRegex = /(?:public|private|protected)?\s+class\s+\w+/g;
  const goStructRegex = /type\s+\w+\s+struct\s*{/g;
  
  const matches = [
    ...content.matchAll(jsClassRegex),
    ...content.matchAll(pyClassRegex),
    ...content.matchAll(javaCsClassRegex),
    ...content.matchAll(goStructRegex)
  ];
  
  return matches.length;
}

function countImports(content: string): number {
  // Match import statements in various languages
  const jsImportRegex = /^(?:import|require)/gm;
  const pyImportRegex = /^import|^from.*import/gm;
  const javaImportRegex = /^import\s+/gm;
  const csImportRegex = /^using\s+/gm;
  const goImportRegex = /import\s*\(?\s*["\w]/gm;
  
  const matches = [
    ...content.matchAll(jsImportRegex),
    ...content.matchAll(pyImportRegex),
    ...content.matchAll(javaImportRegex),
    ...content.matchAll(csImportRegex),
    ...content.matchAll(goImportRegex)
  ];
  
  return matches.length;
}

function calculateComplexity(content: string): number {
  // Simple cyclomatic complexity calculation
  let complexity = 1; // Base complexity
  
  // Count decision points
  complexity += (content.match(/\bif\b/g) || []).length;
  complexity += (content.match(/\belse\s+if\b/g) || []).length;
  complexity += (content.match(/\bfor\b/g) || []).length;
  complexity += (content.match(/\bwhile\b/g) || []).length;
  complexity += (content.match(/\bswitch\b/g) || []).length;
  complexity += (content.match(/\bcase\b/g) || []).length;
  complexity += (content.match(/\btry\b/g) || []).length;
  complexity += (content.match(/\bcatch\b/g) || []).length;
  complexity += (content.match(/\bfinally\b/g) || []).length;
  complexity += (content.match(/\band\b/g) || []).length;
  complexity += (content.match(/\bor\b/g) || []).length;
  
  return complexity;
}
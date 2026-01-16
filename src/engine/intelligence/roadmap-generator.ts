import { ProjectStructure } from '../scanner/structure-scanner';
import { FileIntelligence } from './file-analyzer';

interface SmartRoadmap {
  criticalFiles: string[];
  nextSteps: string[];
  productionReadiness: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  warnings: string[];
}

export async function generateSmartRoadmap(
  structureData: ProjectStructure,
  fileIntelligence: FileIntelligence[]
): Promise<SmartRoadmap> {
  console.log('Generating smart roadmap');
  
  // Identify critical files that need attention
  const criticalFiles = identifyCriticalFiles(fileIntelligence);
  
  // Generate next steps based on analysis
  const nextSteps = generateNextSteps(structureData, fileIntelligence);
  
  // Assess production readiness
  const productionReadiness = assessProductionReadiness(structureData, fileIntelligence);
  
  // Identify potential warnings
  const warnings = generateWarnings(structureData, fileIntelligence);
  
  return {
    criticalFiles,
    nextSteps,
    productionReadiness,
    warnings
  };
}

function identifyCriticalFiles(fileIntelligence: FileIntelligence[]): string[] {
  // Critical files are those with high TODO counts, low readiness, or high complexity
  const critical = fileIntelligence
    .filter(file => 
      file.status === 'stub' || 
      file.status === 'partial' || 
      file.todoCount > 5 ||
      file.complexity > 20
    )
    .sort((a, b) => {
      // Sort by priority: stub files first, then by TODO count, then by complexity
      if (a.status === 'stub' && b.status !== 'stub') return -1;
      if (b.status === 'stub' && a.status !== 'stub') return 1;
      if (a.todoCount !== b.todoCount) return b.todoCount - a.todoCount;
      return b.complexity - a.complexity;
    })
    .slice(0, 10) // Top 10 critical files
    .map(file => file.path);
  
  return critical;
}

function generateNextSteps(structureData: ProjectStructure, fileIntelligence: FileIntelligence[]): string[] {
  const nextSteps: string[] = [];
  
  // If project is mostly stubs, recommend completing core functionality
  const stubRatio = fileIntelligence.filter(f => f.status === 'stub').length / fileIntelligence.length;
  if (stubRatio > 0.5) {
    nextSteps.push('Focus on implementing core functionality instead of stubs');
  }
  
  // If many TODOs exist, recommend addressing them
  const totalTodos = fileIntelligence.reduce((sum, f) => sum + f.todoCount, 0);
  if (totalTodos > 50) {
    nextSteps.push(`Address ${totalTodos} TODO/FIXME items found in the codebase`);
  }
  
  // If config files are missing or incomplete
  if (!structureData.entryPoints.length) {
    nextSteps.push('Identify and set up proper entry points for your application');
  }
  
  // If no tests exist
  const testFiles = fileIntelligence.filter(f => 
    f.path.includes('/test/') || 
    f.path.includes('/tests/') || 
    f.path.includes('__tests__/') ||
    f.path.endsWith('.spec.js') ||
    f.path.endsWith('.test.js') ||
    f.path.endsWith('.spec.ts') ||
    f.path.endsWith('.test.ts')
  );
  
  if (testFiles.length === 0) {
    nextSteps.push('Create a testing framework and write unit tests');
  }
  
  // If dependencies seem outdated or misconfigured
  if (structureData.detectedStack.length === 0) {
    nextSteps.push('Review and update project dependencies');
  }
  
  return nextSteps;
}

function assessProductionReadiness(
  structureData: ProjectStructure, 
  fileIntelligence: FileIntelligence[]
): SmartRoadmap['productionReadiness'] {
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check for stub files
  const stubFiles = fileIntelligence.filter(f => f.status === 'stub');
  if (stubFiles.length > 0) {
    const stubPercentage = (stubFiles.length / fileIntelligence.length) * 100;
    score -= stubPercentage * 0.5; // Deduct half a point per percent of stub files
    issues.push(`${stubFiles.length} stub files found (${stubPercentage.toFixed(1)}% of codebase)`);
    recommendations.push(`Complete implementation of ${stubFiles.length} stub files`);
  }
  
  // Check for TODO/FIXME items
  const totalTodos = fileIntelligence.reduce((sum, f) => sum + f.todoCount, 0);
  if (totalTodos > 0) {
    score -= Math.min(totalTodos, 30); // Deduct up to 30 points for TODOs
    issues.push(`${totalTodos} TODO/FIXME items need resolution`);
    recommendations.push(`Resolve all ${totalTodos} TODO/FIXME items before production`);
  }
  
  // Check for test coverage
  const testFiles = fileIntelligence.filter(f => 
    f.path.includes('/test/') || 
    f.path.includes('/tests/') || 
    f.path.includes('__tests__/') ||
    f.path.endsWith('.spec.js') ||
    f.path.endsWith('.test.js') ||
    f.path.endsWith('.spec.ts') ||
    f.path.endsWith('.test.ts')
  );
  
  const nonTestFiles = fileIntelligence.filter(f => !(
    f.path.includes('/test/') || 
    f.path.includes('/tests/') || 
    f.path.includes('__tests__/') ||
    f.path.endsWith('.spec.js') ||
    f.path.endsWith('.test.js') ||
    f.path.endsWith('.spec.ts') ||
    f.path.endsWith('.test.ts')
  ));
  
  if (nonTestFiles.length > 0) {
    const testCoverage = (testFiles.length / nonTestFiles.length) * 100;
    if (testCoverage < 20) {
      score -= 20; // Low test coverage
      issues.push(`Low test coverage: ${testCoverage.toFixed(1)}%`);
      recommendations.push('Increase test coverage to at least 80% before production');
    }
  }
  
  // Check for security issues (hardcoded credentials, etc.)
  for (const file of fileIntelligence) {
    const content = require('fs').readFileSync(file.path, 'utf-8');
    if (content.toLowerCase().includes('password') || 
        content.toLowerCase().includes('secret') || 
        content.toLowerCase().includes('api_key') ||
        content.toLowerCase().includes('token')) {
      if (!content.toLowerCase().includes('env') && 
          !content.toLowerCase().includes('process.env')) {
        score -= 10;
        issues.push(`Potential hardcoded credentials found in ${file.path}`);
        recommendations.push(`Move sensitive data to environment variables in ${file.path}`);
      }
    }
  }
  
  // Ensure score doesn't go below 0
  score = Math.max(0, Math.min(100, score));
  
  return {
    score: Math.round(score * 100) / 100, // Round to 2 decimal places
    issues,
    recommendations
  };
}

function generateWarnings(structureData: ProjectStructure, fileIntelligence: FileIntelligence[]): string[] {
  const warnings: string[] = [];
  
  // Large files warning
  const largeFiles = fileIntelligence.filter(f => f.lineCount > 500);
  if (largeFiles.length > 0) {
    warnings.push(`Found ${largeFiles.length} large files (>500 lines) that should be split`);
  }
  
  // High complexity files
  const complexFiles = fileIntelligence.filter(f => f.complexity > 50);
  if (complexFiles.length > 0) {
    warnings.push(`Found ${complexFiles.length} highly complex files that need refactoring`);
  }
  
  // Missing documentation
  const documentedFiles = fileIntelligence.filter(f => 
    require('fs').readFileSync(f.path, 'utf-8').includes('/**') || 
    require('fs').readFileSync(f.path, 'utf-8').includes('/*') ||
    require('fs').readFileSync(f.path, 'utf-8').includes('//')
  );
  const documentationRatio = documentedFiles.length / fileIntelligence.length;
  if (documentationRatio < 0.3) {
    warnings.push(`Documentation coverage is low (${(documentationRatio * 100).toFixed(1)}%)`);
  }
  
  // Potential performance issues
  const potentialPerformanceIssues = fileIntelligence.filter(f => {
    const content = require('fs').readFileSync(f.path, 'utf-8');
    return content.includes('O(n^2)') || content.includes('nested loops') || 
           content.includes('recursive without base case');
  });
  if (potentialPerformanceIssues.length > 0) {
    warnings.push(`Found ${potentialPerformanceIssues.length} potential performance issues`);
  }
  
  return warnings;
}

import { ProjectFile } from '../types';

export class ProjectDNAEngine {
  static detectFramework(files: ProjectFile[]): string {
    const filenames = files.map(f => f.name.toLowerCase());
    
    if (filenames.includes('react.js') || filenames.includes('react.tsx') || filenames.some(n => n.includes('useaction'))) return 'React / Next.js';
    if (filenames.some(n => n.includes('vue'))) return 'Vue.js';
    if (filenames.includes('angular.json')) return 'Angular';
    if (filenames.includes('svelte.config.js')) return 'Svelte';
    if (filenames.includes('package.json')) return 'Node.js / Web';
    if (filenames.includes('manage.py')) return 'Django';
    if (filenames.includes('composer.json')) return 'Laravel';
    
    return 'Native Framework';
  }

  static detectLanguage(files: ProjectFile[]): string {
    const extensions = files.map(f => f.name.split('.').pop()?.toLowerCase());
    const counts = extensions.reduce((acc, ext) => {
      if (ext) acc[ext] = (acc[ext] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];

    switch(dominant) {
      case 'ts':
      case 'tsx': return 'TypeScript';
      case 'js':
      case 'jsx': return 'JavaScript';
      case 'py': return 'Python';
      case 'java': return 'Java';
      case 'go': return 'GoLang';
      case 'rs': return 'Rust';
      default: return 'Mixed Sources';
    }
  }

  static calculateConfidence(files: ProjectFile[]): number {
    const names = files.map(f => f.name.toLowerCase());
    let score = 0.5;

    if (names.includes('package.json')) score += 0.2;
    if (names.includes('tsconfig.json')) score += 0.1;
    if (names.includes('readme.md')) score += 0.1;
    if (files.length > 50) score += 0.1;

    return Math.min(score, 1.0);
  }
}

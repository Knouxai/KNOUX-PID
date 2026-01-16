import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface ProjectStructure {
  name: string;
  type: string;
  size: number;
  detectedStack: string[];
  folderTree: any;
  entryPoints: string[];
}

export async function scanProjectStructure(projectPath: string): Promise<ProjectStructure> {
  console.log(`Scanning project structure at: ${projectPath}`);
  
  // Get project name from directory name
  const projectName = path.basename(projectPath);
  
  // Detect project type and stack
  const { projectType, detectedStack } = await detectProjectType(projectPath);
  
  // Calculate project size
  const size = await calculateProjectSize(projectPath);
  
  // Build folder tree
  const folderTree = await buildFolderTree(projectPath);
  
  // Find entry points
  const entryPoints = await findEntryPoints(projectPath);
  
  return {
    name: projectName,
    type: projectType,
    size,
    detectedStack,
    folderTree,
    entryPoints
  };
}

async function detectProjectType(projectPath: string): Promise<{ projectType: string, detectedStack: string[] }> {
  const stack: string[] = [];
  const files = glob.sync('**/*', { cwd: projectPath, nodir: true });
  
  for (const file of files) {
    const fileName = path.basename(file);
    
    // Detect frontend frameworks
    if (fileName.includes('package.json')) {
      const packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, file), 'utf-8'));
      
      if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
        stack.push('React');
      }
      if (packageJson.dependencies?.vue || packageJson.devDependencies?.vue) {
        stack.push('Vue.js');
      }
      if (packageJson.dependencies?.angular || packageJson.devDependencies?.angular) {
        stack.push('Angular');
      }
      if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
        stack.push('Next.js');
      }
      if (packageJson.dependencies?.nuxt || packageJson.devDependencies?.nuxt) {
        stack.push('Nuxt.js');
      }
      if (packageJson.dependencies?.express || packageJson.devDependencies?.express) {
        stack.push('Express.js');
      }
      if (packageJson.dependencies?.nestjs || packageJson.devDependencies?.nestjs) {
        stack.push('NestJS');
      }
    }
    
    // Detect backend technologies
    if (fileName.includes('requirements.txt') || fileName.includes('Pipfile') || fileName.includes('pyproject.toml')) {
      stack.push('Python');
    }
    if (fileName.includes('.csproj')) {
      stack.push('C#');
    }
    if (fileName.includes('pom.xml') || fileName.includes('build.gradle')) {
      stack.push('Java');
    }
    if (fileName.includes('go.mod')) {
      stack.push('Go');
    }
    if (fileName.includes('Cargo.toml')) {
      stack.push('Rust');
    }
  }
  
  // Determine project type based on detected stack
  let projectType = 'Generic';
  if (stack.includes('React') || stack.includes('Vue.js') || stack.includes('Angular')) {
    projectType = 'Frontend Web Application';
  } else if (stack.includes('Express.js') || stack.includes('NestJS')) {
    projectType = 'Backend API';
  } else if (stack.includes('Next.js') || stack.includes('Nuxt.js')) {
    projectType = 'Full-Stack Web Application';
  } else if (stack.includes('Python')) {
    projectType = 'Python Application';
  } else if (stack.includes('Java')) {
    projectType = 'Java Application';
  } else if (stack.includes('Go')) {
    projectType = 'Go Application';
  } else if (stack.includes('Rust')) {
    projectType = 'Rust Application';
  }
  
  return { projectType, detectedStack: [...new Set(stack)] }; // Remove duplicates
}

async function calculateProjectSize(projectPath: string): Promise<number> {
  let totalSize = 0;
  
  const walkDir = (dir: string) => {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else {
        totalSize += stat.size;
      }
    }
  };
  
  walkDir(projectPath);
  return totalSize;
}

async function buildFolderTree(projectPath: string): Promise<any> {
  const buildTree = (dir: string, relativePath: string = ''): any => {
    const tree: any = {};
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativeItemPath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        tree[item] = buildTree(fullPath, relativeItemPath);
      } else {
        tree[item] = {
          path: relativeItemPath,
          size: stat.size,
          extension: path.extname(item),
          isReady: checkFileReadiness(fullPath)
        };
      }
    }
    
    return tree;
  };
  
  return buildTree(projectPath);
}

function checkFileReadiness(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for common indicators of incomplete files
    if (content.length === 0) return false;
    if (content.toLowerCase().includes('todo')) return false;
    if (content.toLowerCase().includes('fixme')) return false;
    if (content.toLowerCase().includes('placeholder')) return false;
    
    // Check for stub implementations
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.trim().match(/^(function|def|func).*return\s+.*/)) {
        // Simple heuristic: functions that immediately return values might be stubs
        continue;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking readiness of ${filePath}:`, error);
    return false;
  }
}

async function findEntryPoints(projectPath: string): Promise<string[]> {
  const entryPoints: string[] = [];
  const commonEntryPoints = [
    'index.js', 'index.ts', 'index.jsx', 'index.tsx',
    'main.js', 'main.ts', 'server.js', 'app.js',
    'src/index.js', 'src/index.ts', 'src/index.jsx', 'src/index.tsx',
    'public/index.html', 'src/App.js', 'src/App.tsx'
  ];
  
  for (const entryPoint of commonEntryPoints) {
    const fullPath = path.join(projectPath, entryPoint);
    if (fs.existsSync(fullPath)) {
      entryPoints.push(entryPoint);
    }
  }
  
  return entryPoints;
}
import React, { useState } from 'react';
import styled from 'styled-components';

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ServiceCard = styled.div<{ $isActive?: boolean }>`
  background: rgba(30, 30, 46, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${props => props.$isActive ? 'rgba(138, 43, 226, 0.7)' : 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: rgba(138, 43, 226, 0.8);
    box-shadow: 0 5px 15px rgba(138, 43, 226, 0.2);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 1.2rem;
`;

const CardTitle = styled.h4`
  font-size: 1.2rem;
  margin: 0;
  background: linear-gradient(90deg, #8a2be2, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CardContent = styled.div`
  color: #d0d0ff;
  line-height: 1.6;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 10px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number, $color?: string }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => props.$color || 'linear-gradient(90deg, #6a11cb, #2575fc)'};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const ExpandableContent = styled.div<{ $expanded: boolean }>`
  max-height: ${props => props.$expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  opacity: ${props => props.$expanded ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ExpandButton = styled.button`
  background: rgba(138, 43, 226, 0.2);
  color: #d0d0ff;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(138, 43, 226, 0.4);
  }
`;

interface ServiceCardsProps {
  result: any;
  currentState: 'idle' | 'loading' | 'analyzing' | 'done' | 'error';
}

export const ServiceCards: React.FC<ServiceCardsProps> = ({ 
  result, 
  currentState 
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  if (!result) {
    return (
      <CardsContainer>
        <ServiceCard>
          <CardHeader>
            <CardIcon>📁</CardIcon>
            <CardTitle>Structure Analyzer</CardTitle>
          </CardHeader>
          <CardContent>Scan project structure when a project is selected</CardContent>
        </ServiceCard>
        
        <ServiceCard>
          <CardHeader>
            <CardIcon>📄</CardIcon>
            <CardTitle>File Intelligence</CardTitle>
          </CardHeader>
          <CardContent>Analyze files when a project is selected</CardContent>
        </ServiceCard>
        
        <ServiceCard>
          <CardHeader>
            <CardIcon>🧠</CardIcon>
            <CardTitle>Content Scanner</CardTitle>
          </CardHeader>
          <CardContent>Scan content when a project is selected</CardContent>
        </ServiceCard>
        
        <ServiceCard>
          <CardHeader>
            <CardIcon>🧪</CardIcon>
            <CardTitle>Environment Checker</CardTitle>
          </CardHeader>
          <CardContent>Check environment when a project is selected</CardContent>
        </ServiceCard>
        
        <ServiceCard>
          <CardHeader>
            <CardIcon>📊</CardIcon>
            <CardTitle>Progress Engine</CardTitle>
          </CardHeader>
          <CardContent>Show progress when a project is selected</CardContent>
        </ServiceCard>
        
        <ServiceCard>
          <CardHeader>
            <CardIcon>🔥</CardIcon>
            <CardTitle>HeatMap Engine</CardTitle>
          </CardHeader>
          <CardContent>Generate heatmap when a project is selected</CardContent>
        </ServiceCard>
        
        <ServiceCard>
          <CardHeader>
            <CardIcon>🧭</CardIcon>
            <CardTitle>Smart Roadmap</CardTitle>
          </CardHeader>
          <CardContent>Generate roadmap when a project is selected</CardContent>
        </ServiceCard>
        
        <ServiceCard>
          <CardHeader>
            <CardIcon>📤</CardIcon>
            <CardTitle>Report Exporter</CardTitle>
          </CardHeader>
          <CardContent>Export reports when a project is analyzed</CardContent>
        </ServiceCard>
      </CardsContainer>
    );
  }

  return (
    <CardsContainer>
      {/* Structure Analyzer Card */}
      <ServiceCard $isActive={expandedCard === 'structure'}>
        <CardHeader>
          <CardIcon>📁</CardIcon>
          <CardTitle>Structure Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Project: {result.projectSummary.name}</div>
          <div>Type: {result.projectSummary.type}</div>
          <div>Size: {formatFileSize(result.projectSummary.size)}</div>
          <ProgressBar>
            <ProgressFill $percentage={100} $color="#6a11cb" />
          </ProgressBar>
          <ExpandButton onClick={() => toggleCard('structure')}>
            {expandedCard === 'structure' ? 'Show Less' : 'View Details'}
          </ExpandButton>
        </CardContent>
        <ExpandableContent $expanded={expandedCard === 'structure'}>
          <p>Entry Points: {result.entryPoints?.join(', ') || 'None'}</p>
          <p>Detected Stack: {result.detectedStack?.join(', ') || 'None'}</p>
        </ExpandableContent>
      </ServiceCard>

      {/* File Intelligence Card */}
      <ServiceCard $isActive={expandedCard === 'files'}>
        <CardHeader>
          <CardIcon>📄</CardIcon>
          <CardTitle>File Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Total Files: {result.progressData.fileProgress.total}</div>
          <div>Ready: {result.progressData.fileProgress.ready}</div>
          <div>Partial: {result.progressData.fileProgress.partial}</div>
          <div>Stubs: {result.progressData.fileProgress.stub}</div>
          <ProgressBar>
            <ProgressFill $percentage={result.progressData.fileProgress.readyPercentage} $color="#10b981" />
          </ProgressBar>
          <ExpandButton onClick={() => toggleCard('files')}>
            {expandedCard === 'files' ? 'Show Less' : 'View Details'}
          </ExpandButton>
        </CardContent>
        <ExpandableContent $expanded={expandedCard === 'files'}>
          <p>Ready Percentage: {result.progressData.fileProgress.readyPercentage}%</p>
        </ExpandableContent>
      </ServiceCard>

      {/* Content Scanner Card */}
      <ServiceCard $isActive={expandedCard === 'content'}>
        <CardHeader>
          <CardIcon>🧠</CardIcon>
          <CardTitle>Content Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <div>TODO Count: {result.fileIntelligence ? 
            result.fileIntelligence.reduce((sum: number, f: any) => sum + f.todoCount, 0) : 0}</div>
          <div>Function Count: {result.fileIntelligence ? 
            result.fileIntelligence.reduce((sum: number, f: any) => sum + f.functionCount, 0) : 0}</div>
          <div>Class Count: {result.fileIntelligence ? 
            result.fileIntelligence.reduce((sum: number, f: any) => sum + f.classCount, 0) : 0}</div>
          <ProgressBar>
            <ProgressFill $percentage={result.progressData.fileProgress.readyPercentage} $color="#f59e0b" />
          </ProgressBar>
          <ExpandButton onClick={() => toggleCard('content')}>
            {expandedCard === 'content' ? 'Show Less' : 'View Details'}
          </ExpandButton>
        </CardContent>
        <ExpandableContent $expanded={expandedCard === 'content'}>
          <p>Logic Density: {result.fileIntelligence ? 
            (result.fileIntelligence.reduce((sum: number, f: any) => sum + f.logicDensity, 0) / result.fileIntelligence.length).toFixed(2) : 0}</p>
        </ExpandableContent>
      </ServiceCard>

      {/* Environment Checker Card */}
      <ServiceCard $isActive={expandedCard === 'env'}>
        <CardHeader>
          <CardIcon>🧪</CardIcon>
          <CardTitle>Environment Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Frontend: {Math.round(result.progressData.sectionProgress.frontend)}%</div>
          <div>Backend: {Math.round(result.progressData.sectionProgress.backend)}%</div>
          <div>Config: {Math.round(result.progressData.sectionProgress.config)}%</div>
          <div>Tests: {Math.round(result.progressData.sectionProgress.tests)}%</div>
          <ProgressBar>
            <ProgressFill $percentage={result.progressData.sectionProgress.config} $color="#8b5cf6" />
          </ProgressBar>
          <ExpandButton onClick={() => toggleCard('env')}>
            {expandedCard === 'env' ? 'Show Less' : 'View Details'}
          </ExpandButton>
        </CardContent>
        <ExpandableContent $expanded={expandedCard === 'env'}>
          <p>Configuration completeness affects overall stability</p>
        </ExpandableContent>
      </ServiceCard>

      {/* Progress Engine Card */}
      <ServiceCard $isActive={expandedCard === 'progress'}>
        <CardHeader>
          <CardIcon>📊</CardIcon>
          <CardTitle>Progress Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Overall Score: {result.progressData.overallScore}%</div>
          <div>File Progress: {result.progressData.fileProgress.readyPercentage}%</div>
          <ProgressBar>
            <ProgressFill $percentage={result.progressData.overallScore} $color="#3b82f6" />
          </ProgressBar>
          <ExpandButton onClick={() => toggleCard('progress')}>
            {expandedCard === 'progress' ? 'Show Less' : 'View Details'}
          </ExpandButton>
        </CardContent>
        <ExpandableContent $expanded={expandedCard === 'progress'}>
          <p>Calculated using weighted metrics across files, folders, and sections</p>
        </ExpandableContent>
      </ServiceCard>

      {/* HeatMap Engine Card */}
      <ServiceCard $isActive={expandedCard === 'heatmap'}>
        <CardHeader>
          <CardIcon>🔥</CardIcon>
          <CardTitle>HeatMap Engine</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Hot Files: {Object.values(result.heatmapData.files || {}).filter((f: any) => f.temperature > 0.7).length}</div>
          <div>Warm Files: {Object.values(result.heatmapData.files || {}).filter((f: any) => f.temperature > 0.3 && f.temperature <= 0.7).length}</div>
          <div>Cold Files: {Object.values(result.heatmapData.files || {}).filter((f: any) => f.temperature <= 0.3).length}</div>
          <ProgressBar>
            <ProgressFill $percentage={Math.min(100, Object.keys(result.heatmapData.files || {}).length * 2)} $color="#ef4444" />
          </ProgressBar>
          <ExpandButton onClick={() => toggleCard('heatmap')}>
            {expandedCard === 'heatmap' ? 'Show Less' : 'View Details'}
          </ExpandButton>
        </CardContent>
        <ExpandableContent $expanded={expandedCard === 'heatmap'}>
          <p>Heatmap based on complexity, TODOs, and implementation status</p>
        </ExpandableContent>
      </ServiceCard>

      {/* Smart Roadmap Card */}
      <ServiceCard $isActive={expandedCard === 'roadmap'}>
        <CardHeader>
          <CardIcon>🧭</CardIcon>
          <CardTitle>Smart Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Critical Files: {result.roadmap.criticalFiles.length}</div>
          <div>Next Steps: {result.roadmap.nextSteps.length}</div>
          <div>Readiness Score: {result.roadmap.productionReadiness.score}/100</div>
          <ProgressBar>
            <ProgressFill $percentage={result.roadmap.productionReadiness.score} $color="#10b981" />
          </ProgressBar>
          <ExpandButton onClick={() => toggleCard('roadmap')}>
            {expandedCard === 'roadmap' ? 'Show Less' : 'View Details'}
          </ExpandButton>
        </CardContent>
        <ExpandableContent $expanded={expandedCard === 'roadmap'}>
          <h5>Critical Files:</h5>
          <ul>
            {result.roadmap.criticalFiles.slice(0, 5).map((file: string, idx: number) => (
              <li key={idx}>{file}</li>
            ))}
          </ul>
          <h5>Next Steps:</h5>
          <ul>
            {result.roadmap.nextSteps.slice(0, 3).map((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </ExpandableContent>
      </ServiceCard>

      {/* Report Exporter Card */}
      <ServiceCard $isActive={expandedCard === 'report'}>
        <CardHeader>
          <CardIcon>📤</CardIcon>
          <CardTitle>Report Exporter</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Export formats: TXT, JSON, HTML</div>
          <div>Status: Ready</div>
          <ProgressBar>
            <ProgressFill $percentage={100} $color="#8b5cf6" />
          </ProgressBar>
          <ExpandButton onClick={() => toggleCard('report')}>
            {expandedCard === 'report' ? 'Show Less' : 'Export Reports'}
          </ExpandButton>
        </CardContent>
        <ExpandableContent $expanded={expandedCard === 'report'}>
          <button 
            onClick={() => exportReport('txt')} 
            style={{ marginRight: '10px', padding: '8px 15px', borderRadius: '5px', backgroundColor: '#6a11cb', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Export TXT
          </button>
          <button 
            onClick={() => exportReport('json')} 
            style={{ marginRight: '10px', padding: '8px 15px', borderRadius: '5px', backgroundColor: '#6a11cb', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Export JSON
          </button>
          <button 
            onClick={() => exportReport('html')} 
            style={{ padding: '8px 15px', borderRadius: '5px', backgroundColor: '#6a11cb', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Export HTML
          </button>
        </ExpandableContent>
      </ServiceCard>
    </CardsContainer>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function exportReport(format: 'txt' | 'json' | 'html') {
  // This would normally call the export function from the engine
  alert(`Exporting report in ${format.toUpperCase()} format...`);
}
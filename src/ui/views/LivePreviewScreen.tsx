import React from 'react';
import styled from 'styled-components';

const PreviewContainer = styled.div`
  background: rgba(30, 30, 46, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  min-height: 500px;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #8a2be2, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
`;

const ProjectSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
`;

const SummaryCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  border: 1px solid rgba(138, 43, 226, 0.2);
`;

const CardTitle = styled.div`
  font-size: 0.9rem;
  color: #a0a0c0;
  margin-bottom: 5px;
`;

const CardValue = styled.div<{ $isScore?: boolean }>`
  font-size: 1.4rem;
  font-weight: bold;
  color: ${props => props.$isScore ? 
    props.children && Number(props.children) >= 80 ? '#10b981' : 
    Number(props.children) >= 50 ? '#f59e0b' : '#ef4444' : 
    '#ffffff'};
`;

const StackList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
`;

const StackTag = styled.span`
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const FolderTree = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
  margin: 15px 0;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.9rem;
`;

const TreeNode = styled.div<{ $level?: number, $isReady?: boolean }>`
  margin-left: ${props => (props.$level || 0) * 20}px;
  padding: 5px 0;
  color: ${props => props.$isReady === true ? '#10b981' : props.$isReady === false ? '#ef4444' : '#d0d0ff'};
  display: flex;
  align-items: center;
`;

const ProgressRing = styled.div<{ $percentage: number }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(
    #6a11cb ${props => props.$percentage}%, 
    rgba(255, 255, 255, 0.1) 0%
  );
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

const RingInner = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(30, 30, 46, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
`;

const ProgressGrid = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`;

interface LivePreviewScreenProps {
  result: any;
  currentState: 'idle' | 'loading' | 'analyzing' | 'done' | 'error';
}

export const LivePreviewScreen: React.FC<LivePreviewScreenProps> = ({ 
  result, 
  currentState 
}) => {
  if (!result) return null;

  const renderTree = (tree: any, level = 0) => {
    return Object.entries(tree).map(([key, value]) => {
      if (typeof value === 'object' && value.path === undefined) {
        // It's a folder
        return (
          <TreeNode key={key} $level={level}>
            <span style={{ fontWeight: 'bold', color: '#8a2be2' }}>📁 {key}/</span>
            <div style={{ marginLeft: '10px' }}>
              {renderTree(value, level + 1)}
            </div>
          </TreeNode>
        );
      } else {
        // It's a file
        const isReady = typeof value === 'object' ? value.isReady : undefined;
        return (
          <TreeNode key={key} $level={level} $isReady={isReady}>
            <span>{isReady === true ? '🟢' : isReady === false ? '🔴' : '⚪'} {key}</span>
          </TreeNode>
        );
      }
    });
  };

  return (
    <PreviewContainer>
      <SectionTitle>Live Preview</SectionTitle>
      
      {/* Project Summary */}
      <ProjectSummary>
        <SummaryCard>
          <CardTitle>Project Name</CardTitle>
          <CardValue>{result.projectSummary.name}</CardValue>
        </SummaryCard>
        
        <SummaryCard>
          <CardTitle>Project Type</CardTitle>
          <CardValue>{result.projectSummary.type}</CardValue>
        </SummaryCard>
        
        <SummaryCard>
          <CardTitle>Project Size</CardValue>
          <CardValue>{formatFileSize(result.projectSummary.size)}</CardValue>
        </SummaryCard>
        
        <SummaryCard>
          <CardTitle>Project Score</CardTitle>
          <CardValue $isScore={true}>{result.projectSummary.score}%</CardValue>
        </SummaryCard>
      </ProjectSummary>
      
      {/* Detected Stack */}
      <div>
        <CardTitle>Detected Technology Stack</CardTitle>
        <StackList>
          {result.detectedStack.length > 0 ? (
            result.detectedStack.map((tech: string, index: number) => (
              <StackTag key={index}>{tech}</StackTag>
            ))
          ) : (
            <span>No technologies detected</span>
          )}
        </StackList>
      </div>
      
      {/* Progress Rings */}
      <ProgressGrid>
        <div style={{ textAlign: 'center' }}>
          <ProgressRing $percentage={result.progressData.fileProgress.readyPercentage}>
            <RingInner>{Math.round(result.progressData.fileProgress.readyPercentage)}%</RingInner>
          </ProgressRing>
          <div>File Readiness</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <ProgressRing $percentage={result.progressData.overallScore}>
            <RingInner>{Math.round(result.progressData.overallScore)}%</RingInner>
          </ProgressRing>
          <div>Overall Score</div>
        </div>
      </ProgressGrid>
      
      {/* Folder Tree Preview */}
      <div>
        <CardTitle>Folder Structure</CardTitle>
        <FolderTree>
          {result.folderTree ? renderTree(result.folderTree) : <div>Loading tree...</div>}
        </FolderTree>
      </div>
    </PreviewContainer>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
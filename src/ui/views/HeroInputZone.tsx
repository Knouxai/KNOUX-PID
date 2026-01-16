import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const InputZoneContainer = styled.div<{ $currentState: string }>`
  background: rgba(30, 30, 46, 0.6);
  backdrop-filter: blur(10px);
  border: 2px dashed 
    ${props => {
      if (props.$currentState === 'loading' || props.$currentState === 'analyzing') return '#f59e0b';
      if (props.$currentState === 'error') return '#ef4444';
      if (props.$currentState === 'done') return '#10b981';
      return 'rgba(138, 43, 226, 0.5)';
    }};
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &:hover {
    border-color: ${props => 
      props.$currentState === 'idle' ? 'rgba(138, 43, 226, 0.8)' : 
      props.$currentState === 'loading' || props.$currentState === 'analyzing' ? '#fbbf24' :
      props.$currentState === 'error' ? '#f87171' : '#34d399'};
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.3);
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 15px;
  background: linear-gradient(90deg, #8a2be2, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  color: #a0a0c0;
  margin-bottom: 25px;
  font-size: 1.1rem;
  max-width: 500px;
  line-height: 1.6;
`;

const BrowseButton = styled.button<{ $currentState: string }>`
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(106, 17, 203, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.$currentState !== 'idle' && `
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

const PathDisplay = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 10px 15px;
  color: #d0d0ff;
  font-family: monospace;
  word-break: break-all;
  margin-top: 15px;
  max-width: 100%;
  overflow-x: auto;
`;

const StatusMessage = styled.div<{ $status: string }>`
  margin-top: 15px;
  font-size: 1rem;
  color: ${props => {
    if (props.$status === 'loading' || props.$status === 'analyzing') return '#f59e0b';
    if (props.$status === 'error') return '#ef4444';
    if (props.$status === 'done') return '#10b981';
    return '#a0a0c0';
  }};
  font-weight: 500;
`;

interface HeroInputZoneProps {
  onProjectSelect: (path: string) => void;
  currentState: 'idle' | 'loading' | 'analyzing' | 'done' | 'error';
}

export const HeroInputZone: React.FC<HeroInputZoneProps> = ({ 
  onProjectSelect, 
  currentState 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleBrowseClick = async () => {
    if (currentState !== 'idle') return;
    
    try {
      // @ts-ignore - electronAPI is injected by preload script
      const result = await window.electronAPI.openDirectory();
      if (result) {
        onProjectSelect(result);
      }
    } catch (error) {
      console.error('Failed to open directory:', error);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (currentState !== 'idle') return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const path = e.dataTransfer.files[0].path;
      if (path) {
        onProjectSelect(path);
      }
    }
  }, [currentState, onProjectSelect]);

  let statusText = '';
  if (currentState === 'loading') statusText = 'Loading project...';
  else if (currentState === 'analyzing') statusText = 'Analyzing project...';
  else if (currentState === 'error') statusText = 'Error occurred during analysis';
  else if (currentState === 'done') statusText = 'Analysis complete!';
  else statusText = 'Ready to analyze';

  return (
    <InputZoneContainer 
      $currentState={currentState}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <Title>Project Intelligence Analyzer</Title>
      <Description>
        Select a project folder to analyze its structure, code quality, and readiness for production. 
        Drag and drop your project folder or click the button below.
      </Description>
      
      <BrowseButton 
        onClick={handleBrowseClick} 
        $currentState={currentState}
        disabled={currentState !== 'idle'}
      >
        {currentState === 'idle' ? 'Browse Project Folder' : 'Processing...'}
      </BrowseButton>
      
      {(currentState === 'loading' || currentState === 'analyzing' || currentState === 'done') && (
        <StatusMessage $status={currentState}>
          {statusText}
        </StatusMessage>
      )}
      
      {currentState === 'error' && (
        <StatusMessage $status="error">
          Failed to analyze project. Please try another folder.
        </StatusMessage>
      )}
    </InputZoneContainer>
  );
};
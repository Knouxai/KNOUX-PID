import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { AnalysisEngine } from '../engine';
import { HeroInputZone } from './views/HeroInputZone';
import { LivePreviewScreen } from './views/LivePreviewScreen';
import { ServiceCards } from './cards/ServiceCards';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  body {
    background: linear-gradient(135deg, #0f0f1b 0%, #1a1a2e 50%, #16213e 100%);
    color: #e6e6ff;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(15, 15, 27, 0.5);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #6a11cb, #2575fc);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #2575fc, #6a11cb);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  background: linear-gradient(90deg, #8a2be2, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 15px rgba(138, 43, 226, 0.3);
  letter-spacing: 1px;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const App: React.FC = () => {
  const [selectedProjectPath, setSelectedProjectPath] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisState, setAnalysisState] = useState<'idle' | 'loading' | 'analyzing' | 'done' | 'error'>('idle');

  // Handle project selection
  const handleProjectSelect = async (path: string) => {
    setSelectedProjectPath(path);
    setAnalysisState('loading');
    
    try {
      const engine = new AnalysisEngine(path);
      setAnalysisState('analyzing');
      
      const result = await engine.analyze();
      setAnalysisResult(result);
      setAnalysisState('done');
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisState('error');
    }
  };

  // Reset analysis when project changes
  useEffect(() => {
    if (selectedProjectPath) {
      setAnalysisResult(null);
      setAnalysisState('loading');
    }
  }, [selectedProjectPath]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>KNOUX Project Intelligence Desktop™</Title>
        </Header>
        
        <MainContent>
          <LeftPanel>
            <HeroInputZone 
              onProjectSelect={handleProjectSelect} 
              currentState={analysisState}
            />
            
            {analysisResult && (
              <LivePreviewScreen 
                result={analysisResult} 
                currentState={analysisState}
              />
            )}
          </LeftPanel>
          
          <RightPanel>
            <ServiceCards 
              result={analysisResult} 
              currentState={analysisState}
            />
          </RightPanel>
        </MainContent>
      </Container>
    </>
  );
};

export default App;
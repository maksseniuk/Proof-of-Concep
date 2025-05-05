import React, { useState } from 'react';
import styled from 'styled-components';
import FlowchartDiagram from './components/FlowchartDiagram/FlowchartDiagram';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Controls = styled.div`
  padding: 1rem;
  background: #fff;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ColorPicker = styled.input`
  width: 50px;
  height: 30px;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
`;

function App() {
  const [globalColor, setGlobalColor] = useState('#4a90e2');

  return (
    <AppContainer>
      <Controls>
        <Label>Global Color:</Label>
        <ColorPicker
          type="color"
          value={globalColor}
          onChange={(e) => setGlobalColor(e.target.value)}
        />
      </Controls>
      <FlowchartDiagram globalColor={globalColor} />
    </AppContainer>
  );
}

export default App;

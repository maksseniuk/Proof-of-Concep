import React, { useState } from 'react';
import styled from 'styled-components';
import { FlowchartDiagram } from 'flowchart-diagram';
import Sidebar from './components/Sidebar/Sidebar';

const AppContainer = styled.div`
  display: flex;
  height: 98.5vh;
  }
`;

const Main = styled.div`
  flex: 1;
  background: #f5f7f8;
  overflow: hidden;
`;

function App() {
  const [globalColor, setGlobalColor] = useState('#fff');

  // Export/import handlers will be passed to FlowchartDiagram
  const [exportHandler, setExportHandler] = useState(() => () => {});
  const [importHandler, setImportHandler] = useState(() => () => {});

  return (
    <AppContainer>
      <Sidebar
        exportHandler={exportHandler}
        importHandler={importHandler}
        globalColor={globalColor}
        setGlobalColor={setGlobalColor}
      />
      <Main>
        <FlowchartDiagram
          globalColor={globalColor}
          setExportHandler={setExportHandler}
          setImportHandler={setImportHandler}
        />
      </Main>
    </AppContainer>
  );
}

export default App;

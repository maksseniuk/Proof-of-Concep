import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #357abd;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const DiagramControls = ({ onExport, onImport }) => {
  const handleExport = () => {
    const data = onExport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowchart.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          onImport(data);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <ControlsContainer>
      <Button onClick={handleExport}>Export JSON</Button>
      <Button as="label" htmlFor="import-json">
        Import JSON
        <FileInput
          id="import-json"
          type="file"
          accept=".json"
          onChange={handleImport}
        />
      </Button>
    </ControlsContainer>
  );
};

export default DiagramControls; 
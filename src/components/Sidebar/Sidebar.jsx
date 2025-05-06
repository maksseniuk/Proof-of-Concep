import React, { useRef } from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 260px;
  background: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem 1rem 1rem;
  gap: 2rem;
`;

const Button = styled.button`
  width: 200px;
  padding: 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  border: ${({ variant }) => (variant === 'import' ? '2px solid #1976d2' : 'none')};
  background: ${({ variant }) => (variant === 'import' ? '#fff' : '#1976d2')};
  color: ${({ variant }) => (variant === 'import' ? '#1976d2' : '#fff')};
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ variant }) => (variant === 'import' ? '#f0f7ff' : '#1565c0')};
  }
`;

const Palette = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
`;

const ColorCircle = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${({ selected }) => (selected ? '#1976d2' : '#eee')};
  background: ${({ color }) => color};
  cursor: pointer;
  outline: none;
`;

const colorOptions = [
  '#fff', '#bdbdbd', '#f28b82', '#fbbc04', '#fff475', '#ccff90',
  '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8',
];

const Sidebar = ({ 
  exportHandler,
  importHandler,
  globalColor, 
  setGlobalColor 
}) => {
  const fileInputRef = useRef();

  const handleExport = () => {
    if (exportHandler) {
      const data = exportHandler();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'flowchart.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file && importHandler) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          importHandler(data);
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <SidebarContainer>
      <Button onClick={handleExport}>EXPORT JSON</Button>
      <Button variant="import" onClick={() => fileInputRef.current.click()}>IMPORT JSON</Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
      <Palette>
        {colorOptions.map((color) => (
          <ColorCircle
            key={color}
            color={color}
            selected={globalColor === color}
            onClick={() => setGlobalColor(color)}
          />
        ))}
      </Palette>
    </SidebarContainer>
  );
};

export default Sidebar; 
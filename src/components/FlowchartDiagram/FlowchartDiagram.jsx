import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Group, Text } from 'react-konva';
import styled from 'styled-components';
import ConnectionPoints from './ConnectionPoints';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

const StageContainer = styled.div`
  flex: 1;
  position: relative;
`;

// Emoji map for card types
const emojiMap = {
  obj1: '🪄',
  obj2: '🗄️',
  obj3: '🗄️',
  obj5: '🗂️',
  obj6: '💼',
  obj7: '🗂️',
};

// Helper to get emoji by label
const getEmoji = (label) => {
  if (emojiMap[label]) return emojiMap[label];
  // fallback
  return '⬜️';
};

const FlowchartDiagram = ({ globalColor = '#4a90e2', setExportHandler, setImportHandler }) => {
  const [elements, setElements] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [currentConnection, setCurrentConnection] = useState(null);
  const stageRef = useRef(null);

  // Handle element creation
  const createElement = (x, y) => {
    const newElement = {
      id: Date.now(),
      x,
      y,
      width: 180,
      height: 90,
      color: globalColor,
      type: 'rectangle',
      label: `obj${elements.length + 1}`,
    };
    setElements([...elements, newElement]);
  };

  // Handle element movement
  const handleDragMove = (e, id) => {
    const newElements = elements.map(elem => {
      if (elem.id === id) {
        return {
          ...elem,
          x: e.target.x(),
          y: e.target.y(),
        };
      }
      return elem;
    });
    setElements(newElements);
    updateConnections(newElements);
  };

  // Update connections when elements move
  const updateConnections = (updatedElements) => {
    const newConnections = connections.map(conn => {
      const startElement = updatedElements.find(e => e.id === conn.startElementId);
      const endElement = updatedElements.find(e => e.id === conn.endElementId);
      
      if (startElement && endElement) {
        return {
          ...conn,
          points: calculateConnectionPoints(startElement, endElement, conn.startPoint, conn.endPoint),
        };
      }
      return conn;
    });
    setConnections(newConnections);
  };

  // Calculate connection points between elements
  const calculateConnectionPoints = (startElement, endElement, startPoint, endPoint) => {
    const startX = startElement.x + startPoint.x;
    const startY = startElement.y + startPoint.y;
    const endX = endElement.x + endPoint.x;
    const endY = endElement.y + endPoint.y;

    return [startX, startY, endX, endY];
  };

  // Handle connection start
  const handleConnectionStart = (elementId, point) => {
    setIsDrawingConnection(true);
    setCurrentConnection({
      startElementId: elementId,
      startPoint: point,
      points: [point.x, point.y, point.x, point.y],
    });
  };

  // Handle connection drawing
  const handleMouseMove = (e) => {
    if (!isDrawingConnection || !currentConnection) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    const element = elements.find(elem => elem.id === currentConnection.startElementId);
    
    if (element) {
      const startX = element.x + currentConnection.startPoint.x;
      const startY = element.y + currentConnection.startPoint.y;
      setCurrentConnection({
        ...currentConnection,
        points: [startX, startY, point.x, point.y],
      });
    }
  };

  // Handle connection end
  const handleConnectionEnd = (e) => {
    if (!isDrawingConnection || !currentConnection) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    const targetElement = elements.find(elem => {
      const elementX = elem.x;
      const elementY = elem.y;
      return (
        point.x >= elementX &&
        point.x <= elementX + elem.width &&
        point.y >= elementY &&
        point.y <= elementY + elem.height
      );
    });

    if (targetElement && targetElement.id !== currentConnection.startElementId) {
      const endPoint = {
        x: point.x - targetElement.x,
        y: point.y - targetElement.y,
      };

      const newConnection = {
        id: Date.now(),
        startElementId: currentConnection.startElementId,
        endElementId: targetElement.id,
        startPoint: currentConnection.startPoint,
        endPoint: endPoint,
        points: calculateConnectionPoints(
          elements.find(e => e.id === currentConnection.startElementId),
          targetElement,
          currentConnection.startPoint,
          endPoint
        ),
      };

      setConnections([...connections, newConnection]);
    }

    setIsDrawingConnection(false);
    setCurrentConnection(null);
  };

  // Handle element selection
  const handleElementClick = (id) => {
    setSelectedElement(id);
  };

  // Handle element deletion
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
        setElements(elements.filter(elem => elem.id !== selectedElement));
        setConnections(connections.filter(
          conn => conn.startElementId !== selectedElement && conn.endElementId !== selectedElement
        ));
        setSelectedElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, elements, connections]);

  // Handle export
  const handleExport = () => {
    return {
      elements: elements.map(element => ({
        ...element,
        color: element.color,
      })),
      connections: connections.map(conn => ({
        ...conn,
      })),
    };
  };

  // Handle import
  const handleImport = (data) => {
    if (data.elements && Array.isArray(data.elements)) {
      setElements(data.elements.map(element => ({
        ...element,
        color: element.color || globalColor,
      })));
    }
    if (data.connections && Array.isArray(data.connections)) {
      setConnections(data.connections);
    }
  };

  // Register export/import handlers for sidebar
  useEffect(() => {
    if (setExportHandler) setExportHandler(() => handleExport);
    if (setImportHandler) setImportHandler(() => handleImport);
  }, [elements, connections]);

  return (
    <CanvasContainer>
      <StageContainer>
        <Stage
          width={window.innerWidth - 260} // account for sidebar width
          height={window.innerHeight}
          ref={stageRef}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              createElement(e.evt.offsetX, e.evt.offsetY);
            }
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleConnectionEnd}
        >
          <Layer>
            {/* Render connections */}
            {connections.map((conn) => (
              <Line
                key={conn.id}
                points={conn.points}
                stroke="#666" 
                strokeWidth={2}
                dash={[0, 0]}
                lineCap="round"
                lineJoin="round"
              />
            ))}
            {/* Render current connection being drawn */}
            {currentConnection && (
              <Line
                points={currentConnection.points}
                stroke="#666"
                strokeWidth={2}
                dash={[5, 5]}
                lineCap="round"
                lineJoin="round"
                opacity={0.5}
              />
            )}
            {/* Render elements as cards with emoji and label */}
            {elements.map((element) => {
              const label = element.label;
              const emoji = getEmoji(label);
              return (
                <Group
                  key={element.id}
                  x={element.x}
                  y={element.y}
                  draggable
                  onDragMove={(e) => handleDragMove(e, element.id)}
                  onClick={() => handleElementClick(element.id)}
                  onMouseEnter={() => setHoveredElement(element.id)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <Rect
                    width={element.width}
                    height={element.height}
                    fill={ element.color}
                    stroke={selectedElement === element.id ? '#1976d2' : '#bbb'}
                    strokeWidth={selectedElement === element.id ? 3 : 1}
                    cornerRadius={10}
                    shadowBlur={selectedElement === element.id ? 6 : 0}
                  />
                  {/* Emoji icon */}
                  <Group>
                    <Text
                      text={emoji}
                      fontSize={28}
                      x={element.width / 2 - 14}
                      y={element.height / 2 - 32}
                      width={28}
                      height={28}
                      align="center"
                      verticalAlign="middle"
                    />
                    <Text
                      text={label}
                      fontSize={18}
                      x={0}
                      y={element.height / 2}
                      width={element.width}
                      height={28}
                      align="center"
                      verticalAlign="middle"
                      fill="#444"
                    />
                  </Group>
      
                  <ConnectionPoints
                    element={element}
                    onConnectionStart={handleConnectionStart}
                    isHovered={hoveredElement === element.id || selectedElement === element.id}
                  />
                </Group>
              );
            })}
          </Layer>
        </Stage>
      </StageContainer>
    </CanvasContainer>
  );
};

export default FlowchartDiagram; 
import React from 'react';
import { Circle } from 'react-konva';

const ConnectionPoints = ({ element, onConnectionStart, isHovered }) => {
  if (!isHovered) return null;

  const points = [
    { x: element.width / 2, y: 0 }, // top
    { x: element.width, y: element.height / 2 }, // right
    { x: element.width / 2, y: element.height }, // bottom
    { x: 0, y: element.height / 2 }, // left
  ];

  return points.map((point, index) => (
    <Circle
      key={index}
      x={point.x}
      y={point.y}
      radius={5}
      fill="#4a90e2"
      stroke="#fff"
      strokeWidth={1}
      onMouseDown={(e) => {
        e.cancelBubble = true;
        onConnectionStart(element.id, point);
      }}
      onMouseEnter={(e) => {
        const container = e.target.getStage().container();
        container.style.cursor = 'pointer';
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage().container();
        container.style.cursor = 'default';
      }}
    />
  ));
};

export default ConnectionPoints; 
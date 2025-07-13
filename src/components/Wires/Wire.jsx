import React from 'react';
import { Line } from 'react-konva';

const Wire = ({ startX, startY, endX, endY, isActive = false }) => {
  // Create a curved path for better-looking wires
  const midX = startX + (endX - startX) * 0.6;
  
  const points = [
    startX, startY,
    midX, startY,
    midX, endY,
    endX, endY
  ];

  return (
    <Line
      points={points}
      stroke={isActive ? '#4CAF50' : '#666'}
      strokeWidth={3}
      lineCap="round"
      lineJoin="round"
      tension={0.3}
    />
  );
};

export default Wire;
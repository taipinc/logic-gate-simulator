import React from 'react';
import { Shape } from 'react-konva';

const Wire = ({ startX, startY, endX, endY, isActive = false }) => {
  return (
    <Shape
      sceneFunc={(context, shape) => {
        context.beginPath();
        
        // Calculate control points for smooth bezier curve
        const dx = endX - startX;
        const controlOffset = Math.max(Math.abs(dx) * 0.6, 50);
        
        const cp1x = startX + controlOffset;
        const cp1y = startY;
        const cp2x = endX - controlOffset;
        const cp2y = endY;
        
        // Create bezier curve
        context.moveTo(startX, startY);
        context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        
        // Style the line
        context.lineWidth = 3;
        context.strokeStyle = isActive ? '#4CAF50' : '#666';
        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        // Add glow effect for active wires
        if (isActive) {
          context.shadowBlur = 8;
          context.shadowColor = '#4CAF50';
        }
        
        context.stroke();
        context.fillStrokeShape(shape);
      }}
      stroke={isActive ? '#4CAF50' : '#666'}
      strokeWidth={3}
    />
  );
};

export default Wire;
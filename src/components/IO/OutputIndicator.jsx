import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';

const OutputIndicator = ({ x, y, id, value = false, onDragEnd }) => {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={(e) => {
        onDragEnd && onDragEnd(id, e.target.x(), e.target.y());
      }}
    >
      {/* Indicator body */}
      <Rect
        x={0}
        y={0}
        width={60}
        height={40}
        fill={value ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        cornerRadius={5}
      />
      
      {/* Indicator label */}
      <Text
        x={15}
        y={15}
        text={value ? 'HIGH' : 'LOW'}
        fontSize={10}
        fontFamily="Arial"
        fill="white"
      />
      
      {/* Input pin */}
      <Circle
        x={-5}
        y={20}
        radius={3}
        fill="black"
        stroke="black"
      />
    </Group>
  );
};

export default OutputIndicator;
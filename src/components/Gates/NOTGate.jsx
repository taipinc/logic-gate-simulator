import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';

const NOTGate = ({ x, y, id, onDragEnd }) => {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={(e) => {
        onDragEnd && onDragEnd(id, e.target.x(), e.target.y());
      }}
    >
      {/* Gate body */}
      <Rect
        x={0}
        y={0}
        width={80}
        height={50}
        fill="white"
        stroke="black"
        strokeWidth={2}
        cornerRadius={5}
      />
      
      {/* Gate label */}
      <Text
        x={25}
        y={20}
        text="NOT"
        fontSize={14}
        fontFamily="Arial"
        fill="black"
      />
      
      {/* Input pin */}
      <Circle
        x={-5}
        y={25}
        radius={3}
        fill="black"
        stroke="black"
      />
      
      {/* Output pin with inversion bubble */}
      <Circle
        x={85}
        y={25}
        radius={3}
        fill="black"
        stroke="black"
      />
      <Circle
        x={88}
        y={25}
        radius={6}
        fill="white"
        stroke="black"
        strokeWidth={1}
      />
    </Group>
  );
};

export default NOTGate;
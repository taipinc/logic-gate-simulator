import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';

const ORGate = ({ x, y, id, onDragEnd }) => {
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
        x={30}
        y={20}
        text="OR"
        fontSize={14}
        fontFamily="Arial"
        fill="black"
      />
      
      {/* Input pins */}
      <Circle
        x={-5}
        y={15}
        radius={3}
        fill="black"
        stroke="black"
      />
      <Circle
        x={-5}
        y={35}
        radius={3}
        fill="black"
        stroke="black"
      />
      
      {/* Output pin */}
      <Circle
        x={85}
        y={25}
        radius={3}
        fill="black"
        stroke="black"
      />
    </Group>
  );
};

export default ORGate;
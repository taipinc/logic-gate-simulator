import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import useSimulatorStore from '../../stores/simulatorStore';

const ANDGate = ({ x, y, id, inputs = [false, false], output = false }) => {
  const { updateComponentPosition, startWireDrawing, finishWireDrawing, isDrawingWire } = useSimulatorStore();

  const handleDragEnd = (e) => {
    updateComponentPosition(id, e.target.x(), e.target.y());
  };

  const handlePinClick = (pinIndex, pinType, e) => {
    e.cancelBubble = true;
    
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    
    if (isDrawingWire) {
      if (pinType === 'input') {
        finishWireDrawing(id, pinIndex, pinType, pointerPos.x, pointerPos.y);
      }
    } else {
      if (pinType === 'output') {
        startWireDrawing(id, pinIndex, pinType, pointerPos.x, pointerPos.y);
      }
    }
  };

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={handleDragEnd}
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
        text="AND"
        fontSize={14}
        fontFamily="Arial"
        fill="black"
      />
      
      {/* Input pins */}
      <Circle
        x={-5}
        y={15}
        radius={5}
        fill={inputs[0] ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        onClick={(e) => handlePinClick(0, 'input', e)}
      />
      <Circle
        x={-5}
        y={35}
        radius={5}
        fill={inputs[1] ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        onClick={(e) => handlePinClick(1, 'input', e)}
      />
      
      {/* Output pin */}
      <Circle
        x={85}
        y={25}
        radius={5}
        fill={output ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        onClick={(e) => handlePinClick(0, 'output', e)}
      />
    </Group>
  );
};

export default ANDGate;
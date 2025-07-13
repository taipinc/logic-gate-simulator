import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import useSimulatorStore from '../../stores/simulatorStore';

const OutputIndicator = ({ x, y, id, inputs = [false], output = false }) => {
  const { updateComponentPosition, finishWireDrawing, startWireDrawing, isDrawingWire } = useSimulatorStore();

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
      {/* Indicator body */}
      <Rect
        x={0}
        y={0}
        width={60}
        height={40}
        fill={output ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        cornerRadius={5}
      />
      
      {/* Indicator label */}
      <Text
        x={8}
        y={15}
        text={output ? 'HIGH' : 'LOW'}
        fontSize={10}
        fontFamily="Arial"
        fill="white"
      />
      
      {/* Input pin */}
      <Circle
        x={-5}
        y={20}
        radius={5}
        fill={inputs[0] ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        onClick={(e) => handlePinClick(0, 'input', e)}
      />
      
      {/* Output pin */}
      <Circle
        x={65}
        y={20}
        radius={5}
        fill={output ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        onClick={(e) => handlePinClick(0, 'output', e)}
      />
    </Group>
  );
};

export default OutputIndicator;
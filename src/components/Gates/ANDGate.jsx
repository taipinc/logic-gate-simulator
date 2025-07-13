import React from 'react';
import { Group, Path, Circle } from 'react-konva';
import useSimulatorStore from '../../stores/simulatorStore';

const ANDGate = ({ x, y, id, inputs = [false, false], output = false }) => {
  const { updateComponentPosition, startWireDrawing, finishWireDrawing, isDrawingWire, selectedComponents } = useSimulatorStore();

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

  const isSelected = selectedComponents.includes(id);

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={handleDragEnd}
    >
      {/* AND Gate Symbol - D-shaped with flat left side */}
      <Path
        data="M 0 10 L 40 10 A 20 20 0 0 1 40 40 L 0 40 Z"
        fill="white"
        stroke={isSelected ? "#ff6b35" : "black"}
        strokeWidth={isSelected ? 3 : 2}
      />
      
      {/* Input pins */}
      <Circle
        x={-5}
        y={18}
        radius={4}
        fill={inputs[0] ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        onClick={(e) => handlePinClick(0, 'input', e)}
      />
      <Circle
        x={-5}
        y={32}
        radius={4}
        fill={inputs[1] ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        onClick={(e) => handlePinClick(1, 'input', e)}
      />
      
      {/* Output pin */}
      <Circle
        x={65}
        y={25}
        radius={4}
        fill={output ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={2}
        onClick={(e) => handlePinClick(0, 'output', e)}
      />
    </Group>
  );
};

export default ANDGate;
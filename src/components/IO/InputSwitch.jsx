import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import useSimulatorStore from '../../stores/simulatorStore';

const InputSwitch = ({ x, y, id, output = false }) => {
  const { updateComponentPosition, updateInputValue, startWireDrawing, isDrawingWire } = useSimulatorStore();

  const handleDragEnd = (e) => {
    updateComponentPosition(id, e.target.x(), e.target.y());
  };

  const handleClick = () => {
    updateInputValue(id, !output);
  };

  const handlePinClick = (pinIndex, pinType, e) => {
    e.cancelBubble = true;
    
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    
    if (!isDrawingWire && pinType === 'output') {
      startWireDrawing(id, pinIndex, pinType, pointerPos.x, pointerPos.y);
    }
  };

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={handleDragEnd}
    >
      {/* Switch body */}
      <Rect
        x={0}
        y={0}
        width={60}
        height={40}
        fill={output ? '#4CAF50' : '#f44336'}
        stroke="black"
        strokeWidth={2}
        cornerRadius={5}
        onClick={handleClick}
      />
      
      {/* Switch label */}
      <Text
        x={10}
        y={15}
        text={output ? 'ON' : 'OFF'}
        fontSize={12}
        fontFamily="Arial"
        fill="white"
        onClick={handleClick}
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

export default InputSwitch;
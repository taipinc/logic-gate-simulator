import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import useSimulatorStore from '../../stores/simulatorStore';

const BinaryDisplay = ({ x, y, id, inputs = [false, false, false, false, false, false, false, false], output = false }) => {
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

  // Calculate decimal value from binary inputs
  const calculateDecimal = () => {
    let decimal = 0;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i]) {
        decimal += Math.pow(2, i);
      }
    }
    return decimal;
  };

  // Create binary string for display (MSB first)
  const getBinaryString = () => {
    return inputs.slice().reverse().map(bit => bit ? '1' : '0').join('');
  };

  const decimalValue = calculateDecimal();
  const binaryString = getBinaryString();

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragEnd={handleDragEnd}
    >
      {/* Main body */}
      <Rect
        x={0}
        y={0}
        width={100}
        height={200}
        fill="white"
        stroke="black"
        strokeWidth={2}
        cornerRadius={5}
      />
      
      {/* Title */}
      <Text
        x={10}
        y={8}
        text="BIN→DEC"
        fontSize={10}
        fontFamily="Arial"
        fill="black"
        fontStyle="bold"
        align="left"
        width={100}
      />
          
      {/* Decimal display */}
      <Rect
        x={10}
        y={25}
        width={80}
        height={25}
        fill="#222"
        stroke="black"
        strokeWidth={1}
        cornerRadius={3}
      />

      <Text
        x={20}
        y={30}
        text={decimalValue.toString()}
        fontSize={16}
        fontFamily="Arial"
        fill="#00ff41"
        align="center"
        width={100}
        fontStyle="bold"
      />
      
      {[...Array(8)].map((_, i) => (
        <Circle
          key={i}
          x={0}
          y={75 + (i * 15)}
          radius={5}
          fill={inputs[i] ? '#4CAF50' : '#666'}
          stroke="black"
          strokeWidth={1}
          onClick={(e) => handlePinClick(i, 'input', e)}
        />
      ))}
      
      {/* Output pin */}
      <Circle
        x={105}
        y={40}
        radius={5}
        fill={decimalValue > 0 ? '#4CAF50' : '#666'}
        stroke="black"
        strokeWidth={1}
        onClick={(e) => handlePinClick(0, 'output', e)}
      />
    </Group>
  );
};

export default BinaryDisplay;
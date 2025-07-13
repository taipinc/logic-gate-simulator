import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import ANDGate from './components/Gates/ANDGate';
import ORGate from './components/Gates/ORGate';
import NOTGate from './components/Gates/NOTGate';
import XORGate from './components/Gates/XORGate';
import InputSwitch from './components/IO/InputSwitch';
import OutputIndicator from './components/IO/OutputIndicator';
import Wire from './components/Wires/Wire';
import Toolbar from './components/UI/Toolbar';
import useSimulatorStore from './stores/simulatorStore';
import BinaryDisplay from './components/IO/BinaryDisplay';
import './App.css';

function App() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const { 
    components, 
    wires, 
    tempWire,
    addComponent, 
    updateTempWire, 
    cancelWireDrawing,
    isDrawingWire,
    selectedComponents,
    isSelecting,
    selectionBox,
    startSelection,
    updateSelection,
    finishSelection,
    cancelSelection
  } = useSimulatorStore();

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStageMouseDown = (e) => {
    // Don't start selection if clicking on a component or if drawing wire
    if (e.target !== e.target.getStage() || isDrawingWire) return;
    
    const pos = e.target.getStage().getPointerPosition();
    startSelection(pos.x, pos.y);
  };

  const handleStageMouseMove = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    
    if (isDrawingWire) {
      updateTempWire(pos.x, pos.y);
    } else if (isSelecting) {
      updateSelection(pos.x, pos.y);
    }
  };

  const handleStageMouseUp = (e) => {
    if (isSelecting) {
      finishSelection();
    }
  };

  const handleStageClick = (e) => {
    if (isDrawingWire && e.target === e.target.getStage()) {
      cancelWireDrawing();
    } else if (!isSelecting && e.target === e.target.getStage()) {
      // Clear selection when clicking empty space
      cancelSelection();
    }
  };

  const renderComponent = (component) => {
    const commonProps = {
      key: component.id,
      id: component.id,
      x: component.x,
      y: component.y,
      inputs: component.inputs,
      output: component.output
    };

    switch (component.type) {
      case 'AND':
        return <ANDGate {...commonProps} />;
      case 'OR':
        return <ORGate {...commonProps} />;
      case 'NOT':
        return <NOTGate {...commonProps} />;
      case 'XOR':
        return <XORGate {...commonProps} />;
      case 'INPUT':
        return <InputSwitch {...commonProps} />;
      case 'OUTPUT':
        return <OutputIndicator {...commonProps} />;
      case 'BINARY_DISPLAY':
        return <BinaryDisplay {...commonProps} />;
      default:
        return null;
    }
  };

  const renderSelectionBox = () => {
    if (!selectionBox) return null;

    const { startX, startY, endX, endY } = selectionBox;
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="#007acc"
        strokeWidth={1}
        dash={[5, 5]}
        fill="rgba(0, 122, 204, 0.1)"
      />
    );
  };

  return (
    <div className="App">
      <Toolbar onAddComponent={addComponent} />
      <Stage 
        width={dimensions.width} 
        height={dimensions.height}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#f5f5f5'
        }}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Render permanent wires */}
          {wires.map(wire => (
            <Wire key={wire.id} {...wire} />
          ))}
          
          {/* Render temporary wire while drawing */}
          {tempWire && (
            <Wire {...tempWire} isActive={false} />
          )}
          
          {/* Render components */}
          {components.map(renderComponent)}
          
          {/* Render selection box */}
          {renderSelectionBox()}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
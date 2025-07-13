import React, { useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import ANDGate from './components/Gates/ANDGate';
import ORGate from './components/Gates/ORGate';
import NOTGate from './components/Gates/NOTGate';
import XORGate from './components/Gates/XORGate';
import InputSwitch from './components/IO/InputSwitch';
import OutputIndicator from './components/IO/OutputIndicator';
import Wire from './components/Wires/Wire';
import Toolbar from './components/UI/Toolbar';
import useSimulatorStore from './stores/simulatorStore';
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
    isDrawingWire 
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

  const handleStageMouseMove = (e) => {
    if (isDrawingWire) {
      const pos = e.target.getStage().getPointerPosition();
      updateTempWire(pos.x, pos.y);
    }
  };

  const handleStageClick = (e) => {
    if (isDrawingWire && e.target === e.target.getStage()) {
      cancelWireDrawing();
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
      default:
        return null;
    }
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
        onMouseMove={handleStageMouseMove}
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
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
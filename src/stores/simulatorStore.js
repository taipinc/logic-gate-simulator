import { create } from 'zustand';

const useSimulatorStore = create((set, get) => ({
  components: [
    { id: 1, type: 'AND', x: 200, y: 200, inputs: [false, false], output: false },
    { id: 2, type: 'OR', x: 400, y: 300, inputs: [false, false], output: false },
    { id: 3, type: 'INPUT', x: 100, y: 150, output: false },
    { id: 4, type: 'OUTPUT', x: 500, y: 250, inputs: [false] }
  ],
  
  connections: [
    // { id: 1, fromComponent: 3, fromPin: 0, toComponent: 1, toPin: 0 }
  ],
  
  wires: [],
  
  nextId: 5,
  nextConnectionId: 1,
  
  // Wire drawing state
  isDrawingWire: false,
  wireStart: null, // { componentId, pinIndex, pinType: 'input'|'output', x, y }
  tempWire: null,

  // Actions
  addComponent: (type) => {
    const newComponent = {
      id: get().nextId,
      type,
      x: window.innerWidth / 2 - 40,
      y: window.innerHeight / 2 - 25,
      inputs: type === 'NOT' ? [false] : type === 'INPUT' ? [] : [false, false],
      output: false
    };
    
    set(state => ({
      components: [...state.components, newComponent],
      nextId: state.nextId + 1
    }));
  },

  updateComponentPosition: (componentId, x, y) => {
    set(state => ({
      components: state.components.map(comp =>
        comp.id === componentId ? { ...comp, x, y } : comp
      )
    }));
  },

  startWireDrawing: (componentId, pinIndex, pinType, x, y) => {
    set({
      isDrawingWire: true,
      wireStart: { componentId, pinIndex, pinType, x, y }
    });
  },

  updateTempWire: (endX, endY) => {
    const { wireStart } = get();
    if (wireStart) {
      set({
        tempWire: {
          startX: wireStart.x,
          startY: wireStart.y,
          endX,
          endY
        }
      });
    }
  },

  finishWireDrawing: (endComponentId, endPinIndex, endPinType, endX, endY) => {
    const { wireStart, connections, nextConnectionId } = get();
    
    if (!wireStart) return;

    // Validate connection (output to input only)
    if (wireStart.pinType === 'output' && endPinType === 'input') {
      const newConnection = {
        id: nextConnectionId,
        fromComponent: wireStart.componentId,
        fromPin: wireStart.pinIndex,
        toComponent: endComponentId,
        toPin: endPinIndex
      };

      set(state => ({
        connections: [...state.connections, newConnection],
        nextConnectionId: state.nextConnectionId + 1,
        isDrawingWire: false,
        wireStart: null,
        tempWire: null
      }));

      // Recalculate logic
      get().calculateLogic();
    } else {
      // Invalid connection, cancel
      get().cancelWireDrawing();
    }
  },

  cancelWireDrawing: () => {
    set({
      isDrawingWire: false,
      wireStart: null,
      tempWire: null
    });
  },

  updateInputValue: (componentId, value) => {
    set(state => ({
      components: state.components.map(comp =>
        comp.id === componentId ? { ...comp, output: value } : comp
      )
    }));
    get().calculateLogic();
  },

  calculateLogic: () => {
    const { components, connections } = get();
    let updatedComponents = [...components];

    // Reset all inputs first
    updatedComponents = updatedComponents.map(comp => ({
      ...comp,
      inputs: comp.inputs.map(() => false)
    }));

    // Apply connections
    connections.forEach(conn => {
      const fromComp = updatedComponents.find(c => c.id === conn.fromComponent);
      const toCompIndex = updatedComponents.findIndex(c => c.id === conn.toComponent);
      
      if (fromComp && toCompIndex !== -1) {
        updatedComponents[toCompIndex].inputs[conn.toPin] = fromComp.output;
      }
    });

    // Calculate gate outputs
    updatedComponents = updatedComponents.map(comp => {
      if (comp.type === 'INPUT') return comp; // Input values are set manually

      let output = false;
      switch (comp.type) {
        case 'AND':
          output = comp.inputs[0] && comp.inputs[1];
          break;
        case 'OR':
          output = comp.inputs[0] || comp.inputs[1];
          break;
        case 'NOT':
          output = !comp.inputs[0];
          break;
        case 'XOR':
          output = comp.inputs[0] !== comp.inputs[1];
          break;
        case 'OUTPUT':
          output = comp.inputs[0];
          break;
      }

      return { ...comp, output };
    });

    // Generate wire visualization
    const wires = connections.map(conn => {
      const fromComp = updatedComponents.find(c => c.id === conn.fromComponent);
      const toComp = updatedComponents.find(c => c.id === conn.toComponent);
      
      if (!fromComp || !toComp) return null;

      // Calculate pin positions
      const fromX = fromComp.x + 85; // Output pin position
      const fromY = fromComp.y + (fromComp.type === 'NOT' ? 25 : 25);
      
      const toX = toComp.x - 5; // Input pin position
      const toY = toComp.y + (toComp.type === 'NOT' ? 25 : (conn.toPin === 0 ? 15 : 35));

      return {
        id: conn.id,
        startX: fromX,
        startY: fromY,
        endX: toX,
        endY: toY,
        isActive: fromComp.output
      };
    }).filter(Boolean);

    set({
      components: updatedComponents,
      wires
    });
  }
}));

export default useSimulatorStore;
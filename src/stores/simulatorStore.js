import { create } from 'zustand';

const useSimulatorStore = create((set, get) => ({
  components: [
    { id: 1, type: 'AND', x: 200, y: 200, inputs: [false, false], output: false },
    { id: 2, type: 'OR', x: 400, y: 300, inputs: [false, false], output: false },
    { id: 3, type: 'INPUT', x: 100, y: 150, inputs: [], output: false },
    { id: 4, type: 'OUTPUT', x: 500, y: 250, inputs: [false], output: false }
  ],
  
  connections: [],
  wires: [],
  
  nextId: 5,
  nextConnectionId: 1,
  
  // Wire drawing state
  isDrawingWire: false,
  wireStart: null,
  tempWire: null,

  // Selection state
  selectedComponents: [],
  isSelecting: false,
  selectionBox: null,

  // Actions
  addComponent: (type) => {
    let inputs = [];
    switch (type) {
      case 'NOT':
      case 'OUTPUT':
        inputs = [false];
        break;
      case 'INPUT':
        inputs = [];
        break;
      case 'BINARY_DISPLAY':
        inputs = [false, false, false, false, false, false, false, false]; // 8 bits
        break;
      default: // AND, OR, XOR
        inputs = [false, false];
        break;
    }

    const newComponent = {
      id: get().nextId,
      type,
      x: window.innerWidth / 2 - 40,
      y: window.innerHeight / 2 - 25,
      inputs,
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
    // Recalculate wire positions after moving
    get().calculateLogic();
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
      // Check if connection already exists
      const existingConnection = connections.find(conn => 
        conn.toComponent === endComponentId && conn.toPin === endPinIndex
      );

      if (!existingConnection) {
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
        get().cancelWireDrawing();
      }
    } else {
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

  // Selection actions
  startSelection: (x, y) => {
    set({
      isSelecting: true,
      selectionBox: { startX: x, startY: y, endX: x, endY: y }
    });
  },

  updateSelection: (x, y) => {
    set(state => ({
      selectionBox: state.selectionBox ? {
        ...state.selectionBox,
        endX: x,
        endY: y
      } : null
    }));
  },

  finishSelection: () => {
    const { selectionBox, components } = get();
    if (!selectionBox) return;

    const minX = Math.min(selectionBox.startX, selectionBox.endX);
    const maxX = Math.max(selectionBox.startX, selectionBox.endX);
    const minY = Math.min(selectionBox.startY, selectionBox.endY);
    const maxY = Math.max(selectionBox.startY, selectionBox.endY);

    const selectedIds = components
      .filter(comp => 
        comp.x >= minX && comp.x <= maxX && 
        comp.y >= minY && comp.y <= maxY
      )
      .map(comp => comp.id);

    set({
      selectedComponents: selectedIds,
      isSelecting: false,
      selectionBox: null
    });
  },

  cancelSelection: () => {
    set({
      isSelecting: false,
      selectionBox: null,
      selectedComponents: []
    });
  },

  moveSelectedComponents: (deltaX, deltaY) => {
    const { selectedComponents } = get();
    set(state => ({
      components: state.components.map(comp =>
        selectedComponents.includes(comp.id)
          ? { ...comp, x: comp.x + deltaX, y: comp.y + deltaY }
          : comp
      )
    }));
    get().calculateLogic();
  },

  removeWire: (wireId) => {
    set(state => ({
      connections: state.connections.filter(conn => conn.id !== wireId)
    }));
    get().calculateLogic();
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

    // Run multiple passes to handle long chains (max 10 passes)
    for (let pass = 0; pass < 10; pass++) {
      let hasChanges = false;
      const previousState = updatedComponents.map(c => ({ ...c, inputs: [...c.inputs] }));

      // Reset all inputs first (except INPUT components which have no inputs)
      updatedComponents = updatedComponents.map(comp => ({
        ...comp,
        inputs: comp.inputs ? comp.inputs.map(() => false) : []
      }));

      // Apply connections
      connections.forEach(conn => {
        const fromComp = updatedComponents.find(c => c.id === conn.fromComponent);
        const toCompIndex = updatedComponents.findIndex(c => c.id === conn.toComponent);
        
        if (fromComp && toCompIndex !== -1 && updatedComponents[toCompIndex].inputs) {
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
            output = comp.inputs[0] || false;
            break;
          case 'BINARY_DISPLAY':
            // Binary display doesn't change its output based on inputs
            output = comp.output;
            break;
        }

        return { ...comp, output };
      });

      // Check if anything changed
      for (let i = 0; i < updatedComponents.length; i++) {
        const current = updatedComponents[i];
        const previous = previousState[i];
        
        if (current.output !== previous.output) {
          hasChanges = true;
          break;
        }
        
        if (current.inputs.length !== previous.inputs.length) {
          hasChanges = true;
          break;
        }
        
        for (let j = 0; j < current.inputs.length; j++) {
          if (current.inputs[j] !== previous.inputs[j]) {
            hasChanges = true;
            break;
          }
        }
        
        if (hasChanges) break;
      }

      // If no changes occurred, we're done
      if (!hasChanges) break;
    }

    // Generate wire visualization with better positioning
    const wires = connections.map(conn => {
      const fromComp = updatedComponents.find(c => c.id === conn.fromComponent);
      const toComp = updatedComponents.find(c => c.id === conn.toComponent);
      
      if (!fromComp || !toComp) return null;

      // Calculate pin positions more accurately
      let fromX, fromY, toX, toY;

      // From pin (output)
      if (fromComp.type === 'INPUT') {
        fromX = fromComp.x + 65;
        fromY = fromComp.y + 20;
      } else if (fromComp.type === 'BINARY_DISPLAY') {
        fromX = fromComp.x + 105;
        fromY = fromComp.y + 40;
      } else if (fromComp.type === 'OUTPUT') {
        fromX = fromComp.x + 65;
        fromY = fromComp.y + 20;
      } else {
        fromX = fromComp.x + 85;
        fromY = fromComp.y + 25;
      }

      // To pin (input)
      if (toComp.type === 'BINARY_DISPLAY') {
        toX = toComp.x + 10; // Bottom row pins
        toY = toComp.y + 75 + (conn.toPin * 15);
      } else {
        toX = toComp.x - 5;
        if (toComp.type === 'NOT' || toComp.type === 'OUTPUT') {
          toY = toComp.y + 25; // Single input
        } else {
          toY = toComp.y + (conn.toPin === 0 ? 15 : 35); // Dual inputs
        }
      }

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
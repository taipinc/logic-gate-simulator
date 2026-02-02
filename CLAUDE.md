# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based visual logic gate simulator that allows users to create digital logic circuits by dragging and dropping gates, connecting them with wires, and simulating their behavior in real-time.

## Technology Stack

- **React 19** with functional components and hooks
- **Konva/react-konva** for canvas-based rendering and drag-and-drop interaction
- **Zustand** for centralized state management
- **Create React App** for build tooling

## Development Commands

```bash
npm start          # Development server at http://localhost:3000
npm test           # Interactive test runner (watch mode)
npm run build      # Production build to build/ folder
```

## Deployment

The project automatically deploys to GitHub Pages on every commit to the main branch via GitHub Actions (`.github/workflows/deploy.yml`).

- **Live URL**: https://taipinc.github.io/logic-gate-simulator
- **Homepage setting**: The `package.json` includes a `homepage` field configured for GitHub Pages deployment
- **Workflow**: Builds the React app and deploys the `build/` folder to GitHub Pages

To deploy manually:
```bash
npm run build      # Creates production build
# Then push to main branch to trigger automatic deployment
```

## Architecture

### State Management (Zustand)

The entire application state is managed by a single Zustand store at `src/stores/simulatorStore.js`:

- **Components array**: All gates, inputs, outputs, and displays on the canvas
- **Connections array**: Logical connections between component pins (stores which output feeds which input)
- **Wires array**: Visual wire representations with coordinates (generated from connections)
- **Wire drawing state**: Tracks temporary wire being drawn by user
- **Selection state**: Tracks multi-select box and selected components

The store contains a **critical `calculateLogic()` function** that:
1. Runs multiple propagation passes (up to 10) to handle long logic chains
2. Applies all connection values to component inputs
3. Calculates each gate's output based on its type and inputs
4. Regenerates visual wire positions based on current component positions
5. Is called after any operation that changes circuit state (moving components, adding/removing wires, toggling inputs)

### Component Structure

Components are organized by function:

- **Gates/** - Logic gate implementations (AND, OR, NOT, XOR)
- **IO/** - Input switches, output indicators, and binary displays
- **Wires/** - Wire rendering with bezier curves
- **Canvas/** - Main canvas and grid (though grid may be unused)
- **UI/** - Toolbar and gate library for adding new components

All interactive components follow a similar pattern:
1. Pull state and actions from `useSimulatorStore()`
2. Handle drag-and-drop via Konva's `draggable` prop and `onDragEnd` callback
3. Render pins as Konva `Circle` elements with click handlers
4. Visual feedback for state (active/inactive, selected/unselected)

### Wire Connection System

Wire drawing is a two-step interaction:
1. **Start**: Click an output pin → stores `wireStart` state with component ID, pin index, and position
2. **Finish**: Click an input pin → validates connection (output→input only), creates connection, triggers logic recalculation

Wires are rendered as bezier curves with:
- Green color (#4CAF50) when active (signal is true)
- Gray (#666) when inactive
- Glow effect for active wires
- Click-to-delete functionality

### Component Data Model

Each component has:
```javascript
{
  id: number,           // Unique identifier
  type: string,         // 'AND', 'OR', 'NOT', 'XOR', 'INPUT', 'OUTPUT', 'BINARY_DISPLAY'
  x: number,            // Canvas X position
  y: number,            // Canvas Y position
  inputs: boolean[],    // Input pin states (empty for INPUT type)
  output: boolean       // Current output value
}
```

### Pin Position Calculations

Wire endpoints are calculated in `calculateLogic()` based on component types and positions. Pin positions are hardcoded relative to each component's shape (see lines 307-336 in simulatorStore.js). When adding new component types or modifying existing ones, update these calculations to match visual pin locations.

### Selection System

Multi-select is implemented via drag-box selection:
- Mouse down on canvas → starts selection box
- Mouse move → updates selection box dimensions
- Mouse up → selects all components within box bounds
- Selected components can be moved together via `moveSelectedComponents()`

## Testing

Tests use React Testing Library and Jest (configured via Create React App). The test setup is in `src/setupTests.js` which imports `@testing-library/jest-dom` for additional matchers.

## Common Gotchas

- The `calculateLogic()` function must be called after any state change that affects circuit logic (component positions, wire connections, input values)
- Wire positions are recalculated on every logic update based on current component positions
- The multi-pass propagation system (10 iterations) is necessary to handle feedback loops and long chains
- INPUT components have no inputs array, only an output value controlled by user interaction
- BINARY_DISPLAY has 8 input pins but doesn't compute an output from them

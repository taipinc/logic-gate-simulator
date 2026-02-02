# Logic Gate Simulator

A visual, interactive digital logic circuit simulator built with React. Create logic circuits by dragging and dropping gates, connecting them with wires, and watching the signals propagate in real-time.

## Live Demo

**[Try it live on GitHub Pages](https://taipinc.github.io/logic-gate-simulator)**

## Features

- **Interactive Canvas**: Drag-and-drop logic gates onto an infinite canvas
- **Logic Gates**: AND, OR, NOT, XOR gates with visual feedback
- **I/O Components**: Toggle input switches, output indicators, and 8-bit binary displays
- **Visual Wiring**: Draw connections between components with animated bezier curves
- **Real-time Simulation**: See signal propagation with color-coded active/inactive states
- **Multi-select**: Select and move multiple components at once
- **Clean Architecture**: Built with modern React patterns and centralized state management

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/taipinc/logic-gate-simulator.git
cd logic-gate-simulator

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Available Scripts

```bash
npm start          # Development server with hot reload
npm test           # Run tests in interactive watch mode
npm run build      # Create production build in build/ folder
```

## How to Use

1. **Add Components**: Click gates from the toolbar to add them to the canvas
2. **Connect Wires**: Click an output pin (right side of gate), then click an input pin (left side) to create a connection
3. **Toggle Inputs**: Click INPUT switches to change their state
4. **Move Components**: Drag gates and components to rearrange your circuit
5. **Delete Wires**: Click on a wire to remove the connection
6. **Multi-select**: Click and drag on empty canvas to select multiple components

## Technology Stack

- **React 19** - UI framework with functional components and hooks
- **Konva/react-konva** - Canvas-based rendering and drag-and-drop
- **Zustand** - Lightweight state management
- **Create React App** - Build tooling and development server

## Project Structure

```
src/
├── components/
│   ├── Gates/           # Logic gate implementations (AND, OR, NOT, XOR)
│   ├── IO/              # Input switches, outputs, binary displays
│   ├── Wires/           # Wire rendering with bezier curves
│   ├── Canvas/          # Main canvas component
│   └── UI/              # Toolbar and gate library
├── stores/
│   └── simulatorStore.js # Zustand store with circuit state and logic
├── App.js               # Root component
└── index.js             # Entry point
```

## Architecture Highlights

- **Centralized State**: All circuit state managed by a single Zustand store
- **Multi-pass Logic Propagation**: Handles complex circuits with feedback loops
- **Component-based Design**: Each gate type is a self-contained React component
- **Pin Position Calculations**: Wire endpoints calculated dynamically based on component positions

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## Deployment

The project automatically deploys to GitHub Pages on every push to the main branch via GitHub Actions.

## Contributing

This is an educational project. Feel free to fork and experiment!

## License

MIT License - feel free to use this for learning and teaching purposes.

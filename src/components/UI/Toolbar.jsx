import React from 'react';
import './Toolbar.css';

const Toolbar = ({ onAddComponent }) => {
  const components = [
    { type: 'AND', label: 'AND Gate', color: '#e3f2fd' },
    { type: 'OR', label: 'OR Gate', color: '#e8f5e8' },
    { type: 'NOT', label: 'NOT Gate', color: '#fff3e0' },
    { type: 'XOR', label: 'XOR Gate', color: '#f3e5f5' },
    { type: 'INPUT', label: 'Input Switch', color: '#e0f2f1' },
    { type: 'OUTPUT', label: 'Output LED', color: '#ffebee' },
    { type: 'BINARY_DISPLAY', label: 'Binary Display', color: '#f3e5f5' }
  ];

  return (
    <div className="toolbar">
      <h3>Components</h3>
      <div className="toolbar-grid">
        {components.map((component) => (
          <button
            key={component.type}
            className="toolbar-button"
            style={{ backgroundColor: component.color }}
            onClick={() => onAddComponent(component.type)}
          >
            {component.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
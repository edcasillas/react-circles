import React, { useRef } from 'react';
import './App.css';
import Canvas from './Canvas';
import { EffectExample } from './EffectExample';


function App() {
  return (
    <div>
      <EffectExample />
      <Canvas />
    </div>
  );
}

export default App;

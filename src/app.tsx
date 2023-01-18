import React from 'react';
import { createRoot } from 'react-dom/client';
import Splitter from './features/splitter/Splitter';

const container = document.getElementById('App');
const root = createRoot(container);
root.render(
  <div onDragOver={(event: React.DragEvent) => { event.preventDefault(); event.dataTransfer.dropEffect = 'none';}}>
    <Splitter/>
  </div>
);
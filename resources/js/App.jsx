// filepath: resources/js/app.jsx

import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import MainApp from './MainApp';

const root = createRoot(document.getElementById('app'));

root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);

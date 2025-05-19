import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './reset.css';
import './ant-override.css';
import App from './App';
import { CalculationProvider } from './contexts/CalculationContext';

const container = document.getElementById('root');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <CalculationProvider>
      <App/>
    </CalculationProvider>
  </React.StrictMode>
);

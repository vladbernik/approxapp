import { createRoot } from 'react-dom/client';
import './index.css';
import './reset.css';
import './ant-override.css';
import { StrictMode } from 'react';
import App from './App';
import { CalculationProvider } from './contexts/CalculationContext';

const container = document.getElementById('root');

const root = createRoot(container);
root.render(
  <StrictMode>
    <CalculationProvider>
      <App />
    </CalculationProvider>
  </StrictMode>,
);

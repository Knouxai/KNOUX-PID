import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './ui/App';

// Create root element if it doesn't exist
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your main CSS file with Tailwind directives
import App from './App'; // Assuming your main component is in App.js or App.jsx
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ClasseProvider } from './state/classStore.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClasseProvider>
      <App />
    </ClasseProvider>
  </React.StrictMode>,
);

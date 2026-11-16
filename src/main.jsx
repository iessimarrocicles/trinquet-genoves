import { resultatConfirmacio } from './lib/confirmacio.js'; // primer de tot: llegeix la tornada del correu

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ClasseProvider } from './state/classStore.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClasseProvider>
      <App confirmacio={resultatConfirmacio} />
    </ClasseProvider>
  </React.StrictMode>,
);

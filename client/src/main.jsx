import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext.jsx';
import { CommuterProvider } from './context/CommuterContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <CommuterProvider>
        <App />
      </CommuterProvider>
    </AppContextProvider>
  </BrowserRouter>,
);

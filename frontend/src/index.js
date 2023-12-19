import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { RealEstateContextProvider } from './context/RealEstateContext';
import { AptContextProvider } from './context/AptContext';
import { RequestContextProvider } from './context/RequestContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <AptContextProvider>
        <RequestContextProvider>
          <RealEstateContextProvider>
            <App />
          </RealEstateContextProvider>
        </RequestContextProvider>
      </AptContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);



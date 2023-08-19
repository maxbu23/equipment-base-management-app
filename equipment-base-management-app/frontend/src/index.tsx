import React from 'react';
import ReactDOM from 'react-dom/client';
import RegistrationComponent from './components/RegistrationComponent'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RegistrationComponent />
  </React.StrictMode>
);

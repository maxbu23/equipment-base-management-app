import React from 'react';
import ReactDOM from 'react-dom';
import RegistrationComponent from './components/AddNewUserComponent'
import App from './App'
import { BrowserRouter } from 'react-router-dom';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <BrowserRouter>
//     <App/>
//   </BrowserRouter>
// );

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
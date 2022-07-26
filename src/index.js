import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'react-notifications-component/dist/theme.css'
import ReactNotification from 'react-notifications-component'

ReactDOM.render(
  <React.StrictMode>
    <ReactNotification />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

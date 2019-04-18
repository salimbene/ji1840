import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import logger from './services/logService';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import './styles/index.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/dashboard.css';
import './styles/index.css';

logger.init();

console.log(
  'index.js - process.env.REACT_APP_NAME',
  process.env.REACT_APP_NAME,
  process.env.REACT_APP_API_URL
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

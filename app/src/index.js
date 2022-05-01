import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// routes
import Login from './components/Auth/Login.js';
import Signup from './components/Auth/Signup.js';
import Main from './components/Main/Main.js';

// added to include routers in our code
import { createBrowserHistory } from "history";
import { Router, Route } from 'react-router';
import { Switch } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

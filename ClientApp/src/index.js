import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import history from './components/extra/history';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from "./components/store/reduser";
import registerServiceWorker from './registerServiceWorker';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');


let store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


ReactDOM.render(
  <Provider store={store}>
    <Router basename={baseUrl} history={history} >
      <App />
    </Router>
  </Provider>,
  rootElement);

registerServiceWorker();


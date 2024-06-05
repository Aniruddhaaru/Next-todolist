import React from 'react';
import createRoot from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/app';
import store from './redux/store';

createRoot.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

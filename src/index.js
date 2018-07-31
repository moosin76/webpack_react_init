import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

console.log('app start')
ReactDOM.render(
  <div>
    Happy
  <App/>
  </div>,
  document.getElementById('root')
);

module.hot.accept();
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';

const rootEl = document.getElementById('app');
console.log(rootEl);

ReactDOM.render(<App/>, rootEl);

if (module.hot) {
    module.hot.accept();
}
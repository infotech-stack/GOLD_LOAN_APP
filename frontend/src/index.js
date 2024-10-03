import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store'; // Make sure these paths match your project structure
import { register } from './serviceWorker'; 
import './fontLoader';
import 'bootstrap/dist/css/bootstrap.min.css';
console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
console.log('ENV URL:', process.env.NODE_ENV);
console.log('All Environment Variables:', process.env);
console.log(process.env.REACT_APP_TEST_VARIABLE);
console.log('Current Environment:', process.env.NODE_ENV);

ReactDOM.render(
  <Provider store={store}>
   
      <React.StrictMode>
        <App />
      </React.StrictMode>
   
  </Provider>,
  document.getElementById('root')
);

register();

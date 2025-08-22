import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css'
import AuthStore from './store/AuthStore';

interface State {
  store: AuthStore
}

const store = new AuthStore()

export const Context = createContext<State>({
  store, 
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Context.Provider value={{store}}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Context.Provider>
);

reportWebVitals();

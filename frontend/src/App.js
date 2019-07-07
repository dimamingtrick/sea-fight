import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import reducers from './reducers';
import thunk from "redux-thunk";
import Root from "./Root";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Route path="/" component={Root} />
      </BrowserRouter>
    </Provider>
  );
};


export default App;

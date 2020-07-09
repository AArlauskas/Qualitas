import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Routing from './Routing';
import store from "./Store/store";

class App extends Component {
  state = {}
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
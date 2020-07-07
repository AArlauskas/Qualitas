import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";
import Routing from './Routing';

class App extends Component {
  state = {  }
  render() { 
    return ( 
      <BrowserRouter>
        <Routing/>
      </BrowserRouter>
     );
  }
}
 
export default App;
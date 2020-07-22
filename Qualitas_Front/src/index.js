import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import background from "./Images/background.jpg";

const divStyle = {
  position: "fixed",
  top: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  overflowY: "auto"
};

ReactDOM.render(

  <div style={divStyle}>
    <App />
  </div>,
  document.getElementById('root')
);


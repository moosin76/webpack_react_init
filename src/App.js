import React, { Component } from 'react';
import './app.css';
import './bo.css';
import Logo from './logo.svg';
import sample from './sample.jpg';

class App extends Component {
  render() {

    return (
      <div className="mydiv">
         App
         <img src={sample} alt="로고"/>
      </div>
    );
  }
}

export default App;
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from '../components/Chat/Chat.js';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Jussi's chat</h1>
        </header>
          <Chat />
      </div>
    );
  }
}

export default App;

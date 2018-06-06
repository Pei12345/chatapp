import React from 'react';
import './App.css';
import Chat from '../components/Chat/Chat.js';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="content">
          <Chat />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;

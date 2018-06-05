import React from 'react';
import '@aspnet/signalr';
import './Chat.css';
import Scroll from '../Scroll/Scroll.js';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nick: '',
      message: '',
      messages: [],
      hubConnection: null
    };
  }

  componentDidMount = () => {
    // setup nickname and connection
    // const nick = window.prompt('Your nickname:', 'Jussi');
    const nick = 'Jussi';
    const signalR = require('@aspnet/signalr');
    // const hubConnection = new HubConnection('http://localhost:5000/chat');
    // this.setState({ hubConnection, nick }, () => {
    //   this.state.hubConnection
    //     .start()
    //     .then(() => console.log('Connection open!'))
    //     .catch(err => console.log('error while trying to connect'));
   

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this.setState({ hubConnection, nick }, () => {
      this.state.hubConnection
        .start()
        .catch(err => console.error(err.toString()));

      // SignalR set state with received message
      this.state.hubConnection.on('ReceiveMessage', (nick, receivedMessage) => {          
        const text = `${this.getTime()} ${nick}: ${receivedMessage}`;
        const messages = this.state.messages.concat([text]);
        this.setState({ messages });
      });
    });
  };

  getTime = () => {
    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "."
                + (currentdate.getMonth()+1)  + "." 
                + currentdate.getFullYear() +  "  "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return datetime;
  }

  sendMessage = () => {
    this.state.hubConnection
      .invoke('SendMessage', this.state.nick, this.state.message)
      .catch(err => console.error(err));

    this.setState({ message: '' });
  };

  render() {
    return (
      <div>


        <Scroll id="chat-scroll">
          <div className="chat-container">
            {this.state.messages.map((message, index) => (
              <div className="chat-message" key={index}>
                {message}
              </div>            
            ))}
          </div>
        </Scroll>
        <br />
        <input
          type="text"
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
        <button onClick={this.sendMessage}>Send</button>
      </div>
    );
  }
}

export default Chat;

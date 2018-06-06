import React from 'react';
import './Chat.css';
import Scroll from '../Scroll/Scroll.js';
const signalR = require('@aspnet/signalr');

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
    const nick = window.prompt('Your nickname:', '');
    // const nick = 'Jussi';

    const hubUrl = process.env.REACT_APP_HUB;
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setState({ hubConnection, nick }, () => {
      this.state.hubConnection
        .start()
        .catch(err => console.error(err.toString()));

    this.state.hubConnection.on('ChatHistory', history => {
      const messages = history.map((message, index) => {
        return `${history[index].sent} ${history[index].user}: ${history[index].message}`;
      });
      this.setState({ messages });
    });

      // SignalR set state with received message
      this.state.hubConnection.on('ReceiveMessage', receivedMessage => {          
        const text = `${receivedMessage.sent} ${receivedMessage.user}: ${receivedMessage.message}`;
        const messages = this.state.messages.concat([text]);
        this.setState({ messages });
      });
    });
  };

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

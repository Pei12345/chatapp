import React from 'react';
import './Chat.css';
import Scroll from '../Scroll/Scroll.js';
const signalR = require('@aspnet/signalr');

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hubConnection: null,
      nick: '',
      message: '',
      messages: [{
        sent: '',
        user: '',
        message: '',
      }],
      onlineUsers: [],
    };
  }

  componentDidMount = () => {
    // setup nickname and connection
    const nick = window.prompt('Your nickname:', '');

    // SignalR hub setup
    const hubUrl = process.env.REACT_APP_HUB;
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl + `?name=${nick}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setState({ hubConnection, nick }, () => {
      this.state.hubConnection
        .start()
        .catch(err => console.error(err.toString()));
        
        // SignalR get chat history onconnect
        this.state.hubConnection.on('ChatHistory', history => {
          const messages = history.map((message, index) => {        
            return message;
          });
          messages.reverse();
          this.setState({ messages });
        });

        // SignalR get online users
        this.state.hubConnection.on('GetOnlineUsers', receivedUsers => {         
          const onlineUsers = receivedUsers.map((user, index) => {        
            return user.username +', ';
        });
        this.setState( {onlineUsers} )
      });
        
        // SignalR set state with received message
        this.state.hubConnection.on('ReceiveMessage', receivedMessage => {         
          const messages = [receivedMessage].concat(this.state.messages);
          this.setState({ messages });
        });
      });
  };

  // SignalR send message
  sendMessage = () => {
    this.state.hubConnection
      .invoke('SendMessage', this.state.nick, this.state.message)
      .catch(err => console.error(err));    
  };

  render() {
    return (
      <div>
        <span className="online-users">Online users [{this.state.onlineUsers.length}]: {this.state.onlineUsers} </span>
        <div className="message-input-block">
          <input
            type="text"
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
          />
          <button onClick={this.sendMessage}>Send</button>
        </div>
        <Scroll id="chat-scroll">
          <div className="chat-container">
            {this.state.messages.map((message, index) => (
              <div className="chat-message" key={index}>
               <span className="chat-message-header">{message.sent} {message.user}</span>
               <br/>
               <p className="chat-message-body">{message.message}</p>
              </div>            
            ))}
          </div>
        </Scroll>
        <br />
      </div>
    );
  }
}

export default Chat;

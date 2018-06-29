import React from 'react';
import './Chat.css';
import ChatMessages from '../../components/ChatMessages/ChatMessages.js';
import ChatOnlineUsers from '../../components/ChatOnlineUsers/ChatOnlineUsers.js';
import ChatMessageInput from '../../components/ChatMessageInput/ChatMessageInput.js';
const signalR = require('@aspnet/signalr');
const moment = require('moment');

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hubConnection: null,
      nick: '',
      roomName: '1',
      message: '',
      messages: [
        {
          sent: '',
          user: '',
          message: ''
        }
      ],
      onlineUsers: []
    };
  }

  getNick = () => {
    let nick = sessionStorage.getItem('nick');

    if (typeof nick === 'undefined' || nick === null) {
      nick = window.prompt('Your nickname (min length 3):', '').trim();
      if (nick.length < 3) {
        return this.getNick();
      }
      sessionStorage.setItem('nick', nick);
    }
    return nick;
  };

  onChangeInputValue = e => {
    this.setState({ message: e.target.value });
  };

  onInputKeyPress = e => {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
  };

  roomButtonOnClick = e => {
    const from = this.state.roomName;
    const roomName = e.target.value;
    this.setState({ roomName }, () =>
      this.changeRoom(from, this.state.roomName)
    );
  };

  formatTimestamp = timestamp => {
    timestamp = timestamp.split('Z')[0];
    const offset = moment().utcOffset();
    const time = moment(timestamp)
      .add(offset, 'minute')
      .format('DD.M.YYYY HH:mm:ss');
    return time;
  };

  componentDidMount = () => {
    // setup nickname and connection
    const nick = this.getNick();

    // SignalR hub setup
    const hubUrl = process.env.REACT_APP_HUB;
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl + `?name=${nick}&roomName=${this.state.roomName}`)
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
          return user.username + ', ';
        });
        this.setState({ onlineUsers });
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
    this.setState({ message: this.state.message.trim() });
    this.state.hubConnection
      .invoke(
        'SendMessage',
        this.state.nick,
        this.state.roomName,
        this.state.message
      )
      .then(() => {
        this.setState({ message: '' });
      })
      .catch(err => console.error(err));
  };

  // SignalR change room
  changeRoom = (from, to) => {
    this.state.hubConnection.invoke('ChangeRoom', from, to);
  };

  render() {
    return (
      <div>
        <ChatOnlineUsers onlineUsers={this.state.onlineUsers} />
        <ChatMessageInput
          message={this.state.message}
          onInputKeyPress={this.onInputKeyPress}
          onChangeInputValue={this.onChangeInputValue}
          sendMessage={this.sendMessage}
        />
        <ChatMessages
          state={this.state}
          roomButtonOnClick={this.roomButtonOnClick}
          formatTimestamp={this.formatTimestamp}
        />
      </div>
    );
  }
}

export default Chat;

import React from 'react';
import './Chat.css';
import ChatMessages from '../../components/ChatMessages/ChatMessages.js';
import ChatOnlineUsers from '../../components/ChatOnlineUsers/ChatOnlineUsers.js';
import ChatRoomButtonGroup from '../../components/ChatRoomButtonGroup/ChatRoomButtonGroup.js';
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
  };

  getNick = () => {
    let nick = sessionStorage.getItem('nick');

    if (typeof nick === 'undefined' || nick === null) {
      nick = window.prompt('Your nickname (min length 3):', '').trim();
      if (nick.length < 3) {
        return this.getNick();
      }
      sessionStorage.setItem('nick', nick);
    };
    return nick;
  };

  getRoomFromSessionStorage = () => {
    if(sessionStorage.getItem('roomName') != null 
      && sessionStorage.getItem('roomName').length){
        this.setState({roomName: sessionStorage.getItem('roomName')});
        return sessionStorage.getItem('roomName');
    }
    return '1';
  };

  onChangeInputValue = e => {
    this.setState({ message: e.target.value });
  };

  onInputKeyPress = e => {
    if (e.key === 'Enter') {
      this.sendMessage();
    }
  };

  roomButtonOnClick = roomName => {
    const fromRoom = this.state.roomName;
    this.setState({ roomName }, () => {
      this.changeRoom(fromRoom, roomName)
      sessionStorage.setItem('roomName', roomName);
    });
  };

  formatTimestamp = timestamp => {
    timestamp = timestamp.split('Z')[0];
    const offset = moment().utcOffset();
    const time = moment(timestamp)
      .add(offset, 'minute')
      .format('D.M.YYYY HH:mm:ss');
    return time;
  };

  componentDidMount = () => {
    // get nick and current room
    const nick = this.getNick(); 
    const room = this.getRoomFromSessionStorage();

    // SignalR hub setup
    const hubUrl = process.env.REACT_APP_HUB;
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl + `?name=${nick}&roomName=${room}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setState({ hubConnection, nick }, () => {
      hubConnection.start()
        .catch(err => console.error(err.toString()));

      // SignalR get chat history onconnect
      hubConnection.on('ChatHistory', history => {
        const messages = history.map((message) => {
          return message;
        });
        messages.reverse();
        this.setState({ messages });
      });

      // SignalR get online users
      hubConnection.on('GetOnlineUsers', receivedUsers => {
        const onlineUsers = receivedUsers.map((user) => {
          return user.username + ', ';
        });
        this.setState({ onlineUsers });
      });

      // SignalR set state with received message
      hubConnection.on('ReceiveMessage', receivedMessage => {
        const messages = [receivedMessage].concat(this.state.messages);
        this.setState({ messages });
      });
    });
  };

  sendMessage = () => {
    const { nick, roomName, message, hubConnection } = this.state;
        
    // SignalR send message
    hubConnection
      .invoke('SendMessage', nick, roomName, Message)
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
    const {...state} = this.state;
    return (
      <div>
        <ChatOnlineUsers onlineUsers={state.onlineUsers} />
        <ChatRoomButtonGroup 
          roomName={state.roomName}
          roomButtonOnClick={this.roomButtonOnClick}
        />
        <ChatMessageInput
          message={state.message}
          onInputKeyPress={this.onInputKeyPress}
          onChangeInputValue={this.onChangeInputValue}
          sendMessage={this.sendMessage}
        />
        <ChatMessages
          state={state}
          formatTimestamp={this.formatTimestamp}
        />
      </div>
    );
  };
};

export default Chat;

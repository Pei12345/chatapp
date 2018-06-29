import React from 'react';
import './ChatOnlineUsers.css';

const ChatOnlineUsers = props => {
  return (
    <span className="online-users">
      Online users [{props.onlineUsers.length}]: {props.onlineUsers}
    </span>
  );
};

export default ChatOnlineUsers;

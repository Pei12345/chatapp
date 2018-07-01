import React from 'react';
import './ChatOnlineUsers.css';

const ChatOnlineUsers = props => {
  return (
    <div className="online-users-wrapper">
    <span className="online-users">
      Online users [{props.onlineUsers.length}]: {props.onlineUsers}
    </span>
    </div>
  );
};

export default ChatOnlineUsers;

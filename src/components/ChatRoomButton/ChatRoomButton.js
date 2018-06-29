import React from 'react';
import './ChatRoomButton.css';

const ChatRoomButton = props => {
    const {value, roomName, roomButtonOnClick, buttonText} = props;
  return (
    <button
      className="btn"
      value={value}
      disabled={(roomName === value)}
      onClick={roomButtonOnClick}
    >
      {buttonText}
    </button>    
  );
};

export default ChatRoomButton;

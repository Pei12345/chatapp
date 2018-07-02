import React from 'react';
import './ChatRoomButton.css';
import { Button } from '@material-ui/core';

const ChatRoomButton = props => {
    const {value, roomName, roomButtonOnClick, buttonText} = props;
  return (
    <div className="btn-chatroom-wrap">
    <Button
      variant="contained"
      color="secondary"
      className="btn-chatroom"
      type="button"
      value={value}
      disabled={(roomName === value)}
      onClick={() => roomButtonOnClick(value)}
      classes={{
        root: 'classes-state-root',
        disabled: 'disabled'
      }}
    >
        {buttonText}
      </Button>  
      </div>
  );
};

export default ChatRoomButton;

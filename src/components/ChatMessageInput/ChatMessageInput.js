import React from 'react';
import './ChatMessageInput.css';
import { Button, Input } from '@material-ui/core';

const ChatMessageInput = props => {
  const { message, onInputKeyPress, onChangeInputValue, sendMessage } = props;
  return (
    <div className="message-input-block">
      <Input
        placeholder="Message"
        className="message-input"
        value={message}
        onKeyPress={onInputKeyPress}
        onChange={onChangeInputValue}
      />
      <Button
        variant="contained"
        color="primary"
        className="btn-message-send"
        type="button"
        disabled={!message}
        onClick={sendMessage}
        classes={{
          root: 'classes-state-root',
          disabled: 'disabled'
        }}
      >
        Send
      </Button>
    </div>
  );
};

export default ChatMessageInput;

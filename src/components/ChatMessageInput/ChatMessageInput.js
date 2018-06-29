import React from 'react';
import './ChatMessageInput.css';

const ChatMessageInput = props => {
  const { message, onInputKeyPress, onChangeInputValue, sendMessage } = props;
  return (
    <div className="message-input-block">
      <input
        type="text"
        value={message}
        onKeyPress={onInputKeyPress}
        onChange={onChangeInputValue}
      />
      <button type="button" disabled={!message} onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatMessageInput;

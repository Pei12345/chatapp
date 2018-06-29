import React from 'react';
import './ChatMessages.css';
import Scroll from '../Scroll/Scroll.js';

const ChatMessages = (props) => {
    const {state, formatTimestamp,} = props;
    return (
        <div>
          <Scroll id="chat-scroll">
            <div className="chat-container">
              {state.messages.map((message, index) => (
                <div className="chat-message" key={index}>
                  <span className="chat-message-header">
                    {formatTimestamp(message.sent)} {message.user}
                  </span>
                  <br />
                  <p className="chat-message-body">{message.message}</p>
                </div>
              ))}
            </div>
          </Scroll>
          <br />
        </div>
      );}

export default ChatMessages;

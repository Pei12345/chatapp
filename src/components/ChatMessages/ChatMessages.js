import React from 'react';
import './ChatMessages.css';
import Scroll from '../Scroll/Scroll.js';

const ChatMessages = (props) => {
    const {state, roomButtonOnClick, formatTimestamp,} = props;
    return (
        <div>
        <div>      
        {/* Buttons -> -> new component */}
        <button className="btn" value="1" disabled={state.roomName === '1'} onClick={roomButtonOnClick}>Room 1</button>   
        <button className="btn" value="2" disabled={state.roomName === '2'} onClick={roomButtonOnClick}>Room 2</button>   
        <button className="btn" value="3" disabled={state.roomName === '3'} onClick={roomButtonOnClick}>Room 3</button>   
        </div>
        {/* online users -> new component */}
          <span className="online-users">
            Online users [{state.onlineUsers.length}]:{' '}
            {state.onlineUsers}
          </span>          
          
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

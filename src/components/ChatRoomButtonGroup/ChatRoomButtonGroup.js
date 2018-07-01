import React from 'react';
import './ChatRoomButtonGroup.css';
import ChatRoomButton from '../ChatRoomButton/ChatRoomButton.js';

const ChatRoomButtonGroup = (props) => {
    const {roomName, roomButtonOnClick} = props;
    const rooms = ['1','2','3'];
    return(
        <div className="chatroom-button-group">
            {rooms.map((room, index) => {
                return <ChatRoomButton 
                    key={index}
                    value={room}
                    roomName={roomName}
                    roomButtonOnClick={roomButtonOnClick}
                    buttonText={`Room ${room}`}
                />                
            })}
        </div>
    )
}

export default ChatRoomButtonGroup;

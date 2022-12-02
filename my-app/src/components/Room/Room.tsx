import React, { useEffect, useState } from "react";
import "./room.css";
import { RestaurantKeys } from "../../interfaces/Restaurant";
import { RoomList } from "./RoomList";
import { Messages } from "./Messages/Messages";

export interface User {
  id: number;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  socketId: number;
  restaurant: RestaurantKeys;
  color: string;
}

interface RoomProps {
  currentUser: User | null;
  selectedRestaurant: RestaurantKeys;
  users: User[];
  onCreateUser: (username: string) => void;
  rooms: any[];
  room: string;
  onSelectRoom: (username: string, room: any) => void;
  onSendMessage: (message: string, user: User) => void;
  messages: any[];
  onUserLeave: (user: User) => void;
}

export const Room = (props: RoomProps) => {
  const {
    currentUser,
    users,
    onCreateUser,
    room,
    rooms,
    onSelectRoom,
    onSendMessage,
    messages,
    onUserLeave,
  } = props;
  const [username, setUsername] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  useEffect(() => {
    if (room.length > 0) {
      setIsInRoom(true);
    }
  }, [room]);

  return (
    <div className="room-container">
      <h1>Room</h1>
      <div className="room-content">
        {!isInRoom && (
          <>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={handleUsernameChange}
            />
            <button
              onClick={() => {
                onCreateUser(username);
                setIsInRoom(true);
              }}
            >
              Create Room
            </button>
            <RoomList
              username={username}
              rooms={rooms}
              onSelectRoom={onSelectRoom}
              room={room}
            />
          </>
        )}
        {isInRoom && (
          <div className="users">
            <button
              onClick={() => {
                onUserLeave(currentUser as User);
                setIsInRoom(false);
              }}
            >
              Leave Room
            </button>
            <h2>Users</h2>
            <div className="users-list">
              {users.map((user, index) => (
                <div key={index} className="user">
                  <p
                    style={{
                      color: user.color,
                    }}
                  >
                    {user.name} {currentUser?.id === user.id && "(You)"}
                  </p>
                  <div
                    className="user-color"
                    style={{
                      backgroundColor: user.color,
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <Messages
              messages={messages}
              onSendMessage={onSendMessage}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
    </div>
  );
};

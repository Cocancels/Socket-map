import React, { useEffect, useState } from "react";
import "./room.css";
import { RestaurantKeys } from "../../interfaces/Restaurant";
import { formatRoomName, RoomList } from "./RoomList";
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
          <div className="rooms">
            <div className="rooms-instance">
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
                disabled={username.length === 0}
                className={username.length === 0 ? "disabled" : ""}
              >
                Create Room
              </button>
            </div>

            {rooms.length > 0 && (
              <>
                <div className="rooms-choice">
                  <p>OR</p>
                </div>

                <RoomList
                  username={username}
                  rooms={rooms}
                  onSelectRoom={onSelectRoom}
                  room={room}
                />
              </>
            )}
          </div>
        )}
        {isInRoom && (
          <div className="users">
            <div className="users-header">
              <h2>{formatRoomName(room)}</h2>
              <p> {users.length} / 10</p>
            </div>
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
            <button
              onClick={() => {
                onUserLeave(currentUser as User);
                setIsInRoom(false);
              }}
            >
              Leave Room
            </button>
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

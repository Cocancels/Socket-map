import React, { useEffect, useState } from "react";
import "./room.css";
import { RestaurantKeys } from "../../interfaces/Restaurant";
import { RoomList } from "./RoomList";

export interface User {
  id: number;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  socketId: number;
  restaurant: RestaurantKeys;
}

interface RoomProps {
  currentUser: User | null;
  selectedRestaurant: RestaurantKeys;
  users: User[];
  onCreateUser: (username: string) => void;
  rooms: any[];
  room: string;
  onSelectRoom: (username: string, room: any) => void;
}

export const Room = (props: RoomProps) => {
  const { currentUser, users, onCreateUser, room, rooms, onSelectRoom } = props;
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
            {users.map(
              (user, index) => (
                console.log(user),
                (
                  <div key={index} className="user">
                    <p
                      style={
                        currentUser?.id === user.id ? { color: "green" } : {}
                      }
                    >
                      {user.name}
                    </p>
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

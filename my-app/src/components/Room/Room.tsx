import React, { useEffect, useState } from "react";
import "./room.css";
import { RestaurantKeys } from "../../interfaces/Restaurant";

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
}

export const Room = (props: RoomProps) => {
  const { currentUser, selectedRestaurant, users, onCreateUser } = props;
  const [username, setUsername] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  useEffect(() => {}, [selectedRestaurant]);

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
                setIsInRoom(true);
                onCreateUser(username);
              }}
            >
              Join Room
            </button>
          </>
        )}
        {isInRoom && (
          <div className="users">
            {users.map((user, index) => (
              <div key={index} className="user">
                <p
                  style={currentUser?.id === user.id ? { color: "green" } : {}}
                >
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

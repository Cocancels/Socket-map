import React, { useEffect, useState } from "react";
import "./room.css";
import { io } from "socket.io-client";
import { RestaurantKeys } from "../../interfaces/Restaurant";

var socket = io("http://localhost:4001", {
  transports: ["websocket", "polling", "flashsocket"],
});

export interface User {
  id: number;
  name: string;
  socketId: number;
  restaurant: RestaurantKeys;
}

interface RoomProps {
  onUserChange: (user: User) => void;
  currentUser: User | null;
}

export const Room = (props: RoomProps) => {
  const { onUserChange, currentUser } = props;
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  useEffect(() => {
    socket.on("getUsers", (users: User[]) => {
      setUsers(users);
    });

    socket.on("userJoined", (users: User[]) => {
      setUsers(users);
      setIsInRoom(true);
    });

    socket.on("userData", (user: User) => {
      onUserChange(user);
    });
  }, []);

  useEffect(() => {
    console.log("currentUser", currentUser);
  }, [currentUser]);

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
                socket.emit("newUser", username);
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

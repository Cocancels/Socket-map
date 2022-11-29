import React, { useState } from "react";
import "./room.css";
import { io } from "socket.io-client";

export const Room = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  // join room with socket.io
  const handleJoinRoom = () => {
    const socket = io("http://localhost:4001");
    socket.emit("join-room", "room-1", username);
    socket.on("users-changed", (data) => {
      setUsers(data.users);
    });
  };

  return (
    <div className="room-container">
      <h1>Room</h1>
      <div className="room-content">
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={handleUsernameChange}
        />
        <button
          onClick={() => {
            setUsers([...users, username]);
            handleJoinRoom();
          }}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

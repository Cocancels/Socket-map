import React, { useEffect, useState } from "react";
import "./room.css";
import { io } from "socket.io-client";
import { RestaurantKeys } from "../../interfaces/Restaurant";
import {RoomList} from "./RoomList";

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
  const [rooms, setRooms] = useState([]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  useEffect(() => {
    socket.on("getUsers", (users: User[]) => {
      console.log(users)
      setUsers(users);
    });

    socket.on("userJoined", (users: User[]) => {
      console.log("oui")
      setUsers(users);
      setIsInRoom(true);
    });

    socket.on("roomData", (rooms) => {
      setRooms(rooms);
      console.log(rooms)
    });

    socket.on("userData", (user: User) => {
      onUserChange(user);
    });
  }, []);

  useEffect(() => {
    console.log("currentUser", currentUser);
    console.log("Rooms", rooms)

  }, [rooms]);

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

            <h3>Create room</h3>
            <button
              onClick={() => {
                socket.emit("newUser", username);
              }}
            >
              Create
            </button>

            <h3>Join room</h3>
            <RoomList rooms={rooms} username={username}></RoomList>
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

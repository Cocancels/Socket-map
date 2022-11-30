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
  position: {
    lat: number;
    lng: number;
  };
  socketId: number;
  restaurant: RestaurantKeys;
}

interface RoomProps {
  setCurrentUser: (user: User) => void;
  currentUser: User | null;
  setNewUsers: (users: User[]) => void;
  selectedRestaurant: RestaurantKeys;
}

export const Room = (props: RoomProps) => {
  const { currentUser, setNewUsers, setCurrentUser, selectedRestaurant } = props;
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  useEffect(() => {
    socket.on("getUsers", (users: User[]) => {
      setUsers(users);
      setNewUsers(users);
    });

    socket.on("newUser", (users: User[]) => {
      setUsers(users);
      setNewUsers(users);
      setCurrentUser(users[users.length - 1]);
    });

    socket.on("getUpdatedUserRestaurant", (users: User[]) => {
      setUsers(users);
      setNewUsers(users);
    });

    socket.on("getUpdatedUserPosition", (users: User[]) => {
      setUsers(users);
      setNewUsers(users);
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.emit("updateCurrentUser", currentUser);
    }

    if(currentUser?.position.lat){
      socket.emit("updateCurrentUserPosition", {
        position: currentUser.position,
        user: currentUser,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedRestaurant.id !== 0) {
      socket.emit("updateCurrentUserRestaurant", {
        restaurant: selectedRestaurant,
        user: currentUser,
      });
    }
  }, [selectedRestaurant]);

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

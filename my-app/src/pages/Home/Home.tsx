import { Restaurants } from "../../components/Restaurants/Restaurants";
import { Map } from "../../components/Map/Map";
import { Room, User } from "../../components/Room/Room";
import "./home.css";
import { useEffect, useState } from "react";
import { RestaurantKeys } from "../../interfaces/Restaurant";
import { io } from "socket.io-client";
import { usePrevious } from "../../hooks/usePrevious";
import 'bootstrap/dist/css/bootstrap.min.css';

var socket = io("http://localhost:4001", {
  transports: ["websocket", "polling", "flashsocket"],
  autoConnect: false,
});

export const Home = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantKeys>({
    id: 0,
    name: "",
    image: "",
    position: {
      lat: 0,
      lng: 0,
    },
  });
  const [users, setUsers] = useState<User[]>([]);
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [finalPosition, setFinalPosition] = useState({
    lat: 0,
    lng: 0,
  });

  const prevFinalPosition: any = usePrevious(finalPosition);

  const getAllRooms = () => {
    fetch("http://localhost:4001/rooms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // dict to array
        const rooms = Object.keys(data).map((key) => data[key]);
        setRooms(rooms);
      });
  };

  const connectToSocket = (username: string, thisRoom: string) => {
    console.log(username);
    socket.auth = {
      username: username,
      room: thisRoom.length > 0 ? thisRoom : "default",
    };
    socket.connect();

    socket.on("init", (room: any) => {
      setUsers(room.users);
      setCurrentUser(room.currentUser);
    });

    socket.on("newUser", (users: User[]) => {
      setUsers(users);
    });

    socket.on("getUpdatedUserRestaurant", (users: User[]) => {
      setUsers(users);
    });

    socket.on("getUpdatedUserPosition", (users: User[]) => {
      setUsers(users);
    });

    socket.on("getFinalPosition", (finalPos: any) => {
      setFinalPosition(finalPos);
    });
  };

  useEffect(() => {
    if (selectedRestaurant.id !== 0) {
      socket.emit("updateCurrentUserRestaurant", {
        restaurant: selectedRestaurant,
        user: currentUser,
      });
    }
  }, [selectedRestaurant]);

  useEffect(() => {
    if (
      finalPosition.lat !== prevFinalPosition?.lat &&
      finalPosition.lng !== prevFinalPosition?.lng
    ) {
      socket.emit("updateFinalPosition", finalPosition);
    }
  }, [finalPosition]);

  useEffect(() => {
    getAllRooms();
  }, []);

  const handleRestaurantClick = (restaurant: RestaurantKeys) => {
    setSelectedRestaurant(restaurant);
    setCurrentUser({ ...(currentUser as User), restaurant: restaurant });
  };

  const handleNewUser = (user: User) => {
    setCurrentUser(user);

    const thisUser = users.find((u) => u.id === user.id);
    if (thisUser) {
      socket.emit("updateCurrentUserPosition", {
        position: user.position,
        user: user,
      });
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, user]);
      socket.emit("updateCurrentUserPosition", {
        position: user.position,
        user: user,
      });
    }
  };

  return (
    <div className="home-container">
      <Restaurants
        onRestaurantClick={handleRestaurantClick}
        selectedRestaurant={selectedRestaurant}
        setSelectedRestaurant={setSelectedRestaurant}
      />
      <Map
        selectedRestaurant={selectedRestaurant}
        currentUser={currentUser}
        users={users}
        onUpdateCurrentPosition={handleNewUser}
        setFinalPosition={setFinalPosition}
        finalPosition={finalPosition}
      />
      <Room
        users={users}
        currentUser={currentUser}
        selectedRestaurant={selectedRestaurant}
        onCreateUser={(u: any) => connectToSocket(u, room)}
        onSelectRoom={(username: string, room: string) => {
          setRoom(room);
          connectToSocket(username, room);
        }}
        rooms={rooms}
        room={room}
      />
    </div>
  );
};

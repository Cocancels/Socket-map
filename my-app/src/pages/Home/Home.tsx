import { Restaurants } from "../../components/Restaurants/Restaurants";
import { Map } from "../../components/Map/Map";
import { Room, User } from "../../components/Room/Room";
import "./home.css";
import { useState } from "react";
import { RestaurantKeys } from "../../interfaces/Restaurant";

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

  const handleRestaurantClick = (restaurant: RestaurantKeys) => {
    setSelectedRestaurant(restaurant);
    setCurrentUser({ ...(currentUser as User), restaurant: restaurant });
  };

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <div className="home-container">
      <Restaurants
        onRestaurantClick={handleRestaurantClick}
        selectedRestaurant={selectedRestaurant}
        setSelectedRestaurant={setSelectedRestaurant}
      />
      <Map selectedRestaurant={selectedRestaurant} currentUser={currentUser} />
      <Room onUserChange={handleUserChange} currentUser={currentUser} />
    </div>
  );
};

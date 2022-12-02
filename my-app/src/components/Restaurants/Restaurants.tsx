import "./restaurants.css";
import restaurants from "../../constants/restaurants.json";
import { Restaurant } from "./Restaurant";
import { RestaurantKeys } from "../../interfaces/Restaurant";
import { User } from "../Room/Room";

interface RestaurantsProps {
  onRestaurantClick: (restaurant: RestaurantKeys) => void;
  selectedRestaurant: RestaurantKeys;
  setSelectedRestaurant: (restaurant: RestaurantKeys) => void;
  currentUser: User | null;
}

export const Restaurants = (props: RestaurantsProps) => {
  const {
    onRestaurantClick,
    selectedRestaurant,
    setSelectedRestaurant,
    currentUser,
  } = props;

  const handleRestaurantClick = (restaurant: RestaurantKeys) => {
    onRestaurantClick(restaurant);
    setSelectedRestaurant(restaurant);
  };

  const renderListOfRestaurants = (restaurants: any) => {
    return restaurants.restaurants.map((restaurant: any) => (
      <Restaurant
        key={restaurant.id}
        restaurant={restaurant}
        onRestaurantClick={handleRestaurantClick}
        selected={selectedRestaurant.id === restaurant.id}
      />
    ));
  };
  return (
    <div className="restaurants-section">
      <h1>Restaurants</h1>

      {currentUser ? (
        <div className="restaurants-container">
          {renderListOfRestaurants(restaurants)}
        </div>
      ) : (
        <div className="restaurants-container-no-user">
          <h2 className="restaurants-no-user">
            Please join a room to see restaurants
          </h2>
        </div>
      )}
    </div>
  );
};

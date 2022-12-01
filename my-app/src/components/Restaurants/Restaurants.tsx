import "./restaurants.css";
import restaurants from "../../constants/restaurants.json";
import { Restaurant } from "./Restaurant";
import { RestaurantKeys } from "../../interfaces/Restaurant";

interface RestaurantsProps {
  onRestaurantClick: (restaurant: RestaurantKeys) => void;
  selectedRestaurant: RestaurantKeys;
  setSelectedRestaurant: (restaurant: RestaurantKeys) => void;
}

export const Restaurants = (props: RestaurantsProps) => {
  const { onRestaurantClick, selectedRestaurant, setSelectedRestaurant } =
    props;

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
      <h3>Restaurants</h3>

      <div className="restaurants-container list-group">
        {renderListOfRestaurants(restaurants)}
      </div>
    </div>
  );
};

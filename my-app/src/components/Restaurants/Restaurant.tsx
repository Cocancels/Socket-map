import "./restaurants.css";
import { RestaurantKeys } from "../../interfaces/Restaurant";
import { AiOutlineCheck } from "react-icons/ai";

interface RestaurantProps {
  selected: boolean;
  restaurant: RestaurantKeys;
  onRestaurantClick: (restaurant: RestaurantKeys) => void;
}

export const Restaurant = (props: RestaurantProps) => {
  const { restaurant, onRestaurantClick, selected } = props;

  const handleRestaurantClick = () => {
    onRestaurantClick(restaurant); //
  };

  return (
    <div className="restaurant-container" onClick={handleRestaurantClick}>
      <img src={restaurant.image} alt="" />

      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <div className="restaurant-info-content">
          <p>{restaurant.description}</p>
          <button
            className={
              (selected ? "selected" : "not-selected") + " restaurant-button"
            }
          >
            {selected ? <AiOutlineCheck /> : "Go"}
          </button>
        </div>
      </div>
    </div>
  );
};

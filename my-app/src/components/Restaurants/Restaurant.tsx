import "./restaurants.css";
import { RestaurantKeys } from "../../interfaces/Restaurant";
import { useState } from "react";

interface RestaurantProps {
  selected: boolean;
  restaurant: RestaurantKeys;
  onRestaurantClick: (restaurant: RestaurantKeys) => void;
}

export const Restaurant = (props: RestaurantProps) => {
  const { restaurant, onRestaurantClick, selected } = props;

  const handleRestaurantClick = () => {
    onRestaurantClick(restaurant);
  };

  return (
    <div className="restaurant-container" onClick={handleRestaurantClick}>
      <p>{restaurant.name}</p>
      <img src={restaurant.image} alt="" />
      {selected && <p>Selected</p>}
    </div>
  );
};

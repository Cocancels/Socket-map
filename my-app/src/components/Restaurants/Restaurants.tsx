import "./restaurants.css";
import restaurants from "../../constants/restaurants.json"
import {Restaurant} from "./Restaurant";

export const Restaurants = () => {

    console.log(restaurants)

    const renderListOfRestaurants = (restaurants : any) => {
        return restaurants.restaurants.map((restaurant : any) => <Restaurant restaurant={restaurant}/>)
    }
  return (
    <div className="restaurants-section">
      <h1>Restaurants</h1>

        <div className="restaurants-container">
            {renderListOfRestaurants(restaurants)}
        </div>

    </div>
  );
};

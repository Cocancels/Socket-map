import { Restaurants } from "../../components/Restaurants/Restaurants";
import { Map } from "../../components/Map/Map";
import { Room } from "../../components/Room/Room";
import "./home.css";

export const Home = () => {
  return (
    <div className="home-container">
      <Restaurants />
      <Map />
      <Room />
    </div>
  );
};

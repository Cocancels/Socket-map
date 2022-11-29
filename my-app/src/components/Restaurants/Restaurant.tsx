import "./restaurants.css";

export const Restaurant = (props : any) => {

    const {restaurant } = props

    console.log(restaurant)

    return (
        <div className="restaurant-container">
            <p>{restaurant.name}</p>
            <img src={restaurant.image} alt=""/>
        </div>
    );
};

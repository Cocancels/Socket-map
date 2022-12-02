export interface RestaurantKeys {
  id: number;
  name: string;
  image: string;
  description: string;
  position: {
    lat: number;
    lng: number;
  };
}

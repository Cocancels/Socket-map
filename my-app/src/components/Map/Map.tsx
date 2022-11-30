import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "./map.css";
import "leaflet/dist/leaflet.css";

import L, { LatLngExpression } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { RestaurantKeys } from "../../interfaces/Restaurant";
import { User } from "../Room/Room";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface MapProps {
  selectedRestaurant: RestaurantKeys;
  currentUser: User | null;
  users: User[];
}

export const Map = (props: MapProps) => {
  const { selectedRestaurant, currentUser, users } = props;

  const [position, setPosition] = useState<LatLngExpression>({
    lat: 0,
    lng: 0,
  });
  const [map, setMap] = useState<any>();
  const [finalPosition, setFinalPosition] = useState<any>({
    lat: 5,
    lng: 5,
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos: any) => {
        const actualPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(actualPosition);
        map.flyTo(actualPosition, 10, {
          duration: 2,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // function to get distance between two coordinates, in meters
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  };

  const eventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        const marker = e.target;
        if (marker != null) {
          setFinalPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  useEffect(() => {
    getLocation();
  }, [currentUser]);

  return (
    <div className="map-container">
      <h1>Map</h1>

      <MapContainer
        center={position}
        zoom={2}
        scrollWheelZoom={true}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {currentUser && (
          <>
            <Marker position={position}>
              <Popup>You</Popup>
            </Marker>

            {selectedRestaurant.id !== 0 ? (
              <>
                <Marker position={selectedRestaurant.position}>
                  <Popup>{selectedRestaurant.name}</Popup>
                </Marker>

                <Polyline
                  pathOptions={{ color: "red" }}
                  positions={[position, selectedRestaurant.position]}
                />

                <Polyline
                  pathOptions={{ color: "red" }}
                  positions={[selectedRestaurant.position, finalPosition]}
                />
              </>
            ) : (
              <Polyline
                pathOptions={{ color: "red" }}
                positions={[position, finalPosition]}
              />
            )}

            {users.map((user) => {
              if (user.position.lat) {
                return (
                  <>
                    <Marker key={user.id} position={user.position}>
                      <Popup>{user.name}</Popup>
                    </Marker>
                    {user.restaurant && (
                      <>
                        <Polyline
                          pathOptions={{ color: "red" }}
                          positions={[user.position, user.restaurant.position]}
                        />
                        <Marker position={user.restaurant.position}>
                          <Popup>{user.restaurant.name}</Popup>
                        </Marker>
                        <Polyline
                          pathOptions={{ color: "red" }}
                          positions={[user.restaurant.position, finalPosition]}
                        />
                      </>
                    )}
                  </>
                );
              }
            })}
            <Marker
              position={finalPosition}
              draggable={true}
              eventHandlers={eventHandlers}
            >
              <Popup>Final Position</Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      <div className="map-distances"></div>
    </div>
  );
};

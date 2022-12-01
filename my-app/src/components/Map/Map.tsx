import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "./map.css";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
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
  onUpdateCurrentPosition: (user: User) => void;
  finalPosition: {
    lat: number;
    lng: number;
  };
  setFinalPosition: (pos: any) => void;
}

export const Map = (props: MapProps) => {
  const {
    selectedRestaurant,
    currentUser,
    users,
    onUpdateCurrentPosition,
    finalPosition,
    setFinalPosition,
  } = props;

  const [position, setPosition] = useState<any>({
    lat: 0,
    lng: 0,
  });
  const [map, setMap] = useState<any>();

  const [distances, setDistances] = useState<any>([]);

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
        onUpdateCurrentPosition({
          ...(currentUser as User),
          position: actualPosition,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

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
    return Math.round(d / 1000);
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

  const getUserRestaurantDistance = (user: User) => {
    if (user.position.lat) {
      let letReturn = false;

      distances.forEach((distance: any) => {
        if (distance.userId === user.id) {
          if (user.restaurant.position && user.restaurant.position.lat) {
            distance.distanceRestaurant = getDistance(
              user.position.lat,
              user.position.lng,
              user.restaurant.position.lat,
              user.restaurant.position.lng
            );

            distance.distanceRestaurantFinal = getDistance(
              user.restaurant.position.lat,
              user.restaurant.position.lng,
              finalPosition.lat,
              finalPosition.lng
            );

            distance.distanceTotal =
              distance.distanceRestaurant + distance.distanceRestaurantFinal;

            const timeRestaurant = getTime(distance.distanceRestaurant);
            const timeRestaurantFinal = getTime(
              distance.distanceRestaurantFinal
            );
            const timeTotal = getTime(distance.distanceTotal);

            distance.timeRestaurant = Math.round(timeRestaurant);
            distance.timeRestaurantFinal = Math.round(timeRestaurantFinal);
            distance.timeTotal = Math.round(timeTotal);

            setDistances([...distances]);
            letReturn = true;
          } else {
            distance.distanceTotal = getDistance(
              user.position.lat,
              user.position.lng,
              finalPosition.lat,
              finalPosition.lng
            );

            const timeTotal = getTime(distance.distanceTotal);
            distance.timeTotal = Math.round(timeTotal);

            setDistances([...distances]);
            letReturn = true;
          }
        }
      });

      if (letReturn) {
        return;
      }

      if (user.restaurant.position && user.restaurant.position.lat) {
        const distanceRestaurant = getDistance(
          user.position.lat,
          user.position.lng,
          user.restaurant.position.lat,
          user.restaurant.position.lng
        );

        const distanceRestaurantFinal = getDistance(
          user.restaurant.position.lat,
          user.restaurant.position.lng,
          finalPosition.lat,
          finalPosition.lng
        );

        const timeRestaurant = getTime(distanceRestaurant);
        const timeRestaurantFinal = getTime(distanceRestaurantFinal);

        const newDistance = {
          userId: user.id,
          distanceRestaurant: distanceRestaurant,
          distanceRestaurantFinal: distanceRestaurantFinal,
          distanceTotal: distanceRestaurant + distanceRestaurantFinal,
          timeRestaurant: Math.round(timeRestaurant),
          timeRestaurantFinal: Math.round(timeRestaurantFinal),
          timeTotal: Math.round(timeRestaurant + timeRestaurantFinal),
        };

        const newDistances = distances;
        newDistances.push(newDistance);

        setDistances(newDistances);
      } else {
        const distanceTotal = getDistance(
          user.position.lat,
          user.position.lng,
          finalPosition.lat,
          finalPosition.lng
        );

        const newDistance = {
          userId: user.id,
          distanceTotal: distanceTotal,
          timeTotal: Math.round(getTime(distanceTotal)),
        };

        const newDistances = distances;
        newDistances.push(newDistance);

        setDistances(newDistances);
      }
    }
  };

  const getTime = (distance: number) => {
    const speed = 5; // km/h
    const time = distance / speed;
    return time;
  };

  useEffect(() => {}, []);

  useEffect(() => {
    currentUser && !currentUser?.position.lat && getLocation();
    currentUser?.position.lat && getUserRestaurantDistance(currentUser);
  }, [currentUser]);

  useEffect(() => {
    users.forEach((user) => {
      if (user.id !== currentUser?.id) {
        user.position.lat && getUserRestaurantDistance(user);
      }
    });
  }, [users]);

  useEffect(() => {
    currentUser?.position.lat && getUserRestaurantDistance(currentUser as User);

    users.forEach((user) => {
      if (user.id !== currentUser?.id) {
        user.position.lat && getUserRestaurantDistance(user);
      }
    });
  }, [finalPosition]);

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
                  <div key={user.id}>
                    <Marker position={user.position}>
                      <Popup>{user.name}</Popup>
                    </Marker>
                    {user.restaurant.position ? (
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
                    ) : (
                      <Polyline
                        pathOptions={{ color: "red" }}
                        positions={[user.position, finalPosition]}
                      />
                    )}
                  </div>
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

      <div className="map-distances">
        {distances.map((distance: any, index: number) => {
          const user = users.find((user) => user.id === distance.userId);
          return (
            <div key={index}>
              <h3>{user?.name}</h3>
              {distance.distanceRestaurant &&
                distance.distanceRestaurantFinal && (
                  <>
                    <p>
                      To go to the restaurant {user?.restaurant.name}:{" "}
                      <strong>{distance.timeRestaurant} hours</strong> for{" "}
                      {distance.distanceRestaurant} km
                    </p>
                    <p>
                      To go to the final position:{" "}
                      <strong>{distance.distanceRestaurantFinal} km</strong> in{" "}
                      <strong>{distance.timeRestaurantFinal} hours</strong>
                    </p>
                  </>
                )}
              <p>
                Total: <strong>{distance.distanceTotal} </strong>km in{" "}
                <strong>{distance.timeTotal} hours </strong>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

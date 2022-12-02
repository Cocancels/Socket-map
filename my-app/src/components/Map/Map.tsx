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
  distances: any[];
  setDistances: (distances: any[]) => void;
}

export const Map = (props: MapProps) => {
  const {
    selectedRestaurant,
    currentUser,
    users,
    onUpdateCurrentPosition,
    finalPosition,
    setFinalPosition,
    distances,
    setDistances,
  } = props;

  const [position, setPosition] = useState<any>({
    lat: 0,
    lng: 0,
  });
  const [map, setMap] = useState<any>();

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

    // if less than 1km, show meters
    return Math.round(d / 1000);
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance} km`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    currentUser && !currentUser?.position.lat && getLocation();
    currentUser?.position.lat && getUserRestaurantDistance(currentUser);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    users.forEach((user) => {
      if (user.id !== currentUser?.id) {
        user.position.lat && getUserRestaurantDistance(user);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  useEffect(() => {
    currentUser?.position.lat && getUserRestaurantDistance(currentUser as User);

    users.forEach((user) => {
      if (user.id !== currentUser?.id) {
        user.position.lat && getUserRestaurantDistance(user);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {selectedRestaurant.id !== 0 ? (
              <>
                <Marker position={selectedRestaurant.position}>
                  <Popup>{selectedRestaurant.name}</Popup>
                </Marker>

                <Polyline
                  pathOptions={{ color: currentUser.color }}
                  positions={[position, selectedRestaurant.position]}
                />

                <Polyline
                  pathOptions={{ color: currentUser.color }}
                  positions={[selectedRestaurant.position, finalPosition]}
                />
              </>
            ) : (
              <Polyline
                pathOptions={{ color: currentUser.color }}
                positions={[position, finalPosition]}
              />
            )}

            {users.map((user) => {
              const icon = new L.Icon({
                iconUrl:
                  window.location.origin +
                  "/marker-icon-2x-" +
                  user.color +
                  ".png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowSize: [41, 41],
              });
              if (user.position.lat) {
                return (
                  <div key={user.id}>
                    <Marker position={user.position} icon={icon}>
                      <Popup>{user.name}</Popup>
                    </Marker>
                    {user.restaurant.position ? (
                      <>
                        <Polyline
                          pathOptions={{ color: user.color }}
                          positions={[user.position, user.restaurant.position]}
                        />
                        <Marker position={user.restaurant.position} icon={icon}>
                          <Popup>{user.restaurant.name}</Popup>
                        </Marker>
                        <Polyline
                          pathOptions={{ color: user.color }}
                          positions={[user.restaurant.position, finalPosition]}
                        />
                      </>
                    ) : (
                      <Polyline
                        pathOptions={{ color: user.color }}
                        positions={[user.position, finalPosition]}
                      />
                    )}
                  </div>
                );
              }
              return null;
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
        <h2>Distances</h2>
        {distances.map((distance: any, index: number) => {
          const user = users.find((user) => user.id === distance.userId);
          if (user) {
            return (
              <div key={index} className="map-distance">
                <h3>User: {user?.name}</h3>
                <div className="distances-container">
                  {distance.distanceRestaurant &&
                    distance.distanceRestaurantFinal && (
                      <div className="distances-restaurant">
                        <p>
                          To go to the restaurant {user?.restaurant.name}:{" "}
                          <strong>{distance.timeRestaurant} hours</strong> for{" "}
                          {formatDistance(distance.distanceRestaurant)}
                        </p>
                        <p>
                          To go to the final position:{" "}
                          <strong>
                            {formatDistance(distance.distanceRestaurantFinal)}
                          </strong>{" "}
                          in{" "}
                          <strong>{distance.timeRestaurantFinal} hours</strong>
                        </p>
                      </div>
                    )}
                  <p>
                    Total:{" "}
                    <strong>{formatDistance(distance.distanceTotal)} </strong>{" "}
                    in <strong>{distance.timeTotal} hours </strong>
                  </p>
                </div>
              </div>
            );
          }
          return <></>;
        })}
      </div>
    </div>
  );
};

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "./map.css";
import "leaflet/dist/leaflet.css";

import L, { LatLngExpression } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
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
}

export const Map = (props: MapProps) => {
  const { selectedRestaurant, currentUser } = props;

  const [position, setPosition] = useState<LatLngExpression>({
    lat: 0,
    lng: 0,
  });
  const [map, setMap] = useState<any>();
  const [finalPosition, setFinalPosition] = useState<LatLngExpression>({
    lat: 5,
    lng: 5,
  });
  const [showFinalPosition, setShowFinalPosition] = useState(false);
  const [markers, setMarkers] = useState<any>([]);

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
        addMarker(actualPosition);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getTime = (speed: number, distance: number) => {
    const time = distance / speed;
    return time;
  };

  const getDistance = (pos1: LatLngExpression, pos2: LatLngExpression) => {
    const distance = map.distance(pos1, pos2);
    return distance / 1000;
  };

  const addRestaurantMarker = () => {
    const newMarker: any = L.marker([
      selectedRestaurant.position.lat,
      selectedRestaurant.position.lng,
    ])
      .addTo(map)
      .bindPopup(selectedRestaurant.name)
      .openPopup();

    newMarker.restaurantId = selectedRestaurant.id;
    deleteRestaurantsMarkers();
    setMarkers([...markers, newMarker]);
  };

  const deleteRestaurantsMarkers = () => {
    markers.forEach((marker: any) => {
      if (marker.restaurantId) {
        map.removeLayer(marker);
        markers.splice(markers.indexOf(marker), 1);
      }
    });
    setMarkers(markers);
  };

  const addMarker = (pos: LatLngExpression) => {
    const newMarker = L.marker(pos).addTo(map);
    createVector(pos, finalPosition);
    setShowFinalPosition(true);
    setMarkers([...markers, newMarker]);
  };

  const createVector = (pos: any, finalPos: LatLngExpression) => {
    L.polyline([pos, finalPos], {
      color: "red",
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1,
    }).addTo(map);
  };

  const deleteVector = () => {
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });
  };

  function DraggableMarker() {
    const markerRef = useRef<any>(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            deleteVector();
            setFinalPosition(marker.getLatLng());
            createVector(position, marker.getLatLng());
          }
        },
      }),
      []
    );

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={finalPosition}
        ref={markerRef}
      ></Marker>
    );
  }

  useEffect(() => {
    selectedRestaurant.id !== 0 && addRestaurantMarker();
  }, [selectedRestaurant]);

  useEffect(() => {
    if (currentUser && selectedRestaurant.id !== 0) {
      getLocation();
      deleteVector();
      createVector(position, selectedRestaurant.position);
    }
  }, [currentUser]);

  return (
    <div className="map-container">
      <h1>Map</h1>
      <button onClick={getLocation}>
        <span>Get Location</span>
      </button>

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
        {showFinalPosition && <DraggableMarker />}
      </MapContainer>
    </div>
  );
};

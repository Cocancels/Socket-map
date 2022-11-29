import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "./map.css";
import "leaflet/dist/leaflet.css";

import L, { LatLngExpression } from "leaflet";
import { useMemo, useRef, useState } from "react";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export const Map = () => {
  const [position, setPosition] = useState<LatLngExpression>([0, 0]);
  const [map, setMap] = useState<any>();
  const [finalPosition, setFinalPosition] = useState<LatLngExpression>([0, 0]);
  const [showFinalPosition, setShowFinalPosition] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos: GeolocationPosition) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 10, {
          duration: 2,
        });
        addMarker([pos.coords.latitude, pos.coords.longitude]);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const addMarker = (pos: LatLngExpression) => {
    L.marker(pos).addTo(map);
    createVector(pos, finalPosition);
    setShowFinalPosition(true);
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

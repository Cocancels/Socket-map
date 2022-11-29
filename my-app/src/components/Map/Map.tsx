import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "./map.css";
import "leaflet/dist/leaflet.css";

import L, { LatLngExpression } from "leaflet";
import { useState } from "react";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export const Map = () => {
  const [position, setPosition] = useState<LatLngExpression>([0, 0]);
  const [map, setMap] = useState<any>();

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 10, {
          duration: 2,
        });
        L.marker([pos.coords.latitude, pos.coords.longitude])
          .addTo(map)
          .bindPopup(pos.coords.latitude + ", " + pos.coords.longitude)
          .openPopup();
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

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
      </MapContainer>
    </div>
  );
};

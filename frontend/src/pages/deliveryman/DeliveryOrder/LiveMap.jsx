import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Delivery partner icon
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [35, 35],
});

const LiveMap = ({ lat, lng, address }) => {
  if (!lat || !lng) return <p>Waiting for delivery partner location...</p>;

  return (
    <div className="h-64 w-full rounded overflow-hidden border mt-2">
      <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} icon={deliveryIcon}>
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveMap;

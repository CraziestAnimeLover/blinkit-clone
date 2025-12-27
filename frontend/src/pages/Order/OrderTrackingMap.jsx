import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [30, 30],
});

const OrderTrackingMap = ({ orderId }) => {
  const [location, setLocation] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    let interval;
    const fetchLocation = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/orders/${orderId}/location`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLocation(data.location);
      } catch (err) {
        console.error("Waiting for delivery partner location...", err);
        setLocation(null);
      }
    };

    fetchLocation();
    interval = setInterval(fetchLocation, 5000);

    return () => clearInterval(interval);
  }, [orderId, BACKEND_URL, token]);

  if (!location) {
    return <p className="p-4 text-center text-gray-500">Waiting for delivery partner location...</p>;
  }

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[location.lat, location.lng]} icon={deliveryIcon}>
        <Popup>Delivery Partner</Popup>
      </Marker>
    </MapContainer>
  );
};

export default OrderTrackingMap;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize: [35, 35],
});

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [deliveryPos, setDeliveryPos] = useState(null);

  const token = localStorage.getItem("token");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch assigned orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/orders/assigned`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  // Track GPS for active order
  useEffect(() => {
    if (!activeOrderId) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setDeliveryPos(loc);

        try {
          await axios.put(
            `${BACKEND_URL}/api/orders/${activeOrderId}/location`,
            loc,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Location update failed", err);
        }
      },
      (err) => console.error("GPS error", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [activeOrderId]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-green-600">🚴 Delivery Dashboard</h1>

      {orders.length === 0 && <p>No assigned orders yet.</p>}

      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded space-y-3">
          <h2 className="font-bold">Order #{order._id}</h2>
          <p>📍 Address: {order.address}</p>

          <button
            onClick={() => setActiveOrderId(order._id)}
            className={`px-4 py-2 rounded text-white ${
              activeOrderId === order._id ? "bg-gray-400" : "bg-green-600"
            }`}
            disabled={activeOrderId === order._id}
          >
            {activeOrderId === order._id ? "Tracking Active" : "Start Delivery"}
          </button>

          {deliveryPos && activeOrderId === order._id && (
            <MapContainer
              center={[deliveryPos.lat, deliveryPos.lng]}
              zoom={15}
              className="h-[250px] w-full mt-3 rounded border"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[deliveryPos.lat, deliveryPos.lng]} icon={icon}>
                <Popup>Your current position</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeliveryDashboard;

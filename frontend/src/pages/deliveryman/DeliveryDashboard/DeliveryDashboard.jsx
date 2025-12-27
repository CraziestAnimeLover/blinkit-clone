import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const updateMyLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      orders.forEach((order) => {
        axios.put(
          `${BACKEND_URL}/api/orders/${order._id}/location`,
          { lat: latitude, lng: longitude },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      });
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 z-5">
      <h1 className="text-3xl font-bold text-green-600">Live Delivery Dashboard</h1>
      <button
        onClick={updateMyLocation}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Update My Location
      </button>

      {orders.length === 0 && <p>No assigned orders yet.</p>}

      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded mb-4">
          <h2 className="font-bold">Order #{order._id}</h2>
          <p>Delivery Address: {order.address}</p>

          {/* Map */}
          
          {order.deliveryLocation && (
            <MapContainer
              center={[order.deliveryLocation.lat, order.deliveryLocation.lng]}
              zoom={15}
              className="h-[300px] w-full relative z-[-1000]"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker
                position={[order.deliveryLocation.lat, order.deliveryLocation.lng]}
                icon={L.icon({
                  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
                  iconSize: [30, 30],
                })}
              >
                <Popup>Delivery Partner is here</Popup>
              </Marker>
            </MapContainer>
          )}
         
        </div>
      ))}
    </div>
  );
};

export default DeliveryDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import DeliveryOrderCard from "../DeliveryOrder/DeliveryOrderCard";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/orders/assigned`, {
  headers: { Authorization: `Bearer ${token}` },
});

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, [token]);

  // update delivery partner location for all orders
  const handleUpdateLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      orders.forEach((order) => {
        axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/location`,
          { lat: latitude, lng: longitude },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      });
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">My Assigned Orders</h1>
      <button
        onClick={handleUpdateLocation}
        className="px-4 py-2 bg-green-600 text-white rounded mb-4"
      >
        Update My Current Location
      </button>

      {orders.length === 0 && <p>No orders assigned yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <DeliveryOrderCard key={order._id} order={order} token={token} />
        ))}
      </div>
    </div>
  );
};

export default DeliveryDashboard;

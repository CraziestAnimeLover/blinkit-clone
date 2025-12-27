import React, { useEffect, useState } from "react";
import axios from "axios";
import LiveMap from "./LiveMap";

const DeliveryOrderCard = ({ order, token }) => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  // fetch live delivery location every 5 seconds
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${order._id}/location`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDeliveryLocation(res.data.location);
      } catch (err) {
        console.error("Failed to fetch delivery location", err);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [order._id, token]);

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <div className="flex justify-between mb-2">
        <p><b>Order ID:</b> {order._id}</p>
        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">{order.orderStatus}</span>
      </div>
      <p><b>Delivery Address:</b> {order.address}</p>
      <p className="mt-2 font-semibold">Items:</p>
      {order.items.map((item, i) => (
        <p key={i}>
          {item.name} × {item.quantity}
        </p>
      ))}
      <LiveMap
        lat={deliveryLocation?.lat}
        lng={deliveryLocation?.lng}
        address={order.address}
      />
    </div>
  );
};

export default DeliveryOrderCard;

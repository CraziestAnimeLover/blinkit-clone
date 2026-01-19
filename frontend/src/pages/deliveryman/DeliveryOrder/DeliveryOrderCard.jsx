// DeliveryOrderCard.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LiveMap from "./LiveMap";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const DeliveryOrderCard = ({ order }) => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  useEffect(() => {
    socket.emit("joinOrder", order._id);

    const handleLocation = (location) => setDeliveryLocation(location);
    socket.on("liveLocation", handleLocation);

    return () => {
      socket.off("liveLocation", handleLocation);
      socket.emit("leaveOrder", order._id);
    };
  }, [order._id]);

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <p><b>Order ID:</b> {order._id}</p>
      <p><b>Status:</b> {order.orderStatus}</p>

      <LiveMap
        customerLat={order.customerLat}
        customerLng={order.customerLng}
        deliveryLat={deliveryLocation?.lat}
        deliveryLng={deliveryLocation?.lng}
        address={order.address}
        orderId={order._id}
      />
    </div>
  );
};

export default DeliveryOrderCard;

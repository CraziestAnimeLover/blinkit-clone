import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import LiveMap from "./LiveMap";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const DeliveryOrderCard = ({ order }) => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  useEffect(() => {
    socket.emit("joinOrder", order._id);

    socket.on("liveLocation", (location) => {
      setDeliveryLocation(location);
    });

    return () => {
      socket.off("liveLocation");
    };
  }, [order._id]);

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <p><b>Order ID:</b> {order._id}</p>
      <p><b>Status:</b> {order.orderStatus}</p>

      <LiveMap
        lat={deliveryLocation?.lat}
        lng={deliveryLocation?.lng}
        address={order.address}
      />
    </div>
  );
};

export default DeliveryOrderCard;

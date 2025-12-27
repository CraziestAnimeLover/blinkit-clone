import React, { useEffect, useState } from "react";
import OrderTrackingMap from "./OrderTrackingMap";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  const token = localStorage.getItem("token");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/orders/my-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, BACKEND_URL]);

  if (loading) {
    return <p className="text-center p-4 text-gray-500">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center p-4 text-gray-500">No orders found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-green-600">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="bg-white border rounded-lg shadow">
          {/* Header */}
          <div className="flex justify-between p-4 bg-green-50">
            <div>
              <p>
                <b>Order ID:</b> {order._id}
              </p>
              <p>
                <b>Total:</b> ₹{order.totalAmount}
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700">
              {order.orderStatus}
            </span>
          </div>

          {/* Items */}
          <div className="p-4">
            <p className="font-semibold mb-2">Items</p>
            {order.items.map((item, i) => (
              <p key={i}>
                {item.name} × {item.quantity}
              </p>
            ))}

            {/* Track Order Button */}
            <button
              onClick={() =>
                setTrackingOrderId(
                  trackingOrderId === order._id ? null : order._id
                )
              }
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              {trackingOrderId === order._id ? "Hide Tracking" : "Track Order"}
            </button>

            {/* Live Tracking Map */}
            {trackingOrderId === order._id && (
              <div className="mt-4 h-[300px] rounded overflow-hidden border">
                {order.deliveryBoy ? (
                  <OrderTrackingMap orderId={order._id} />
                ) : (
                  <p className="p-4 text-center text-gray-500">
                    Delivery person not assigned yet
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;

import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const getStatusBadge = (status, type = "payment") => {
    let colors = { bg: "", text: "" };

    if (type === "payment") {
      if (status === "PAID") colors = { bg: "bg-green-100", text: "text-green-700" };
      else colors = { bg: "bg-yellow-100", text: "text-yellow-700" };
    } else if (type === "order") {
      if (status === "DELIVERED") colors = { bg: "bg-green-100", text: "text-green-700" };
      else if (status === "CANCELLED") colors = { bg: "bg-red-100", text: "text-red-700" };
      else colors = { bg: "bg-yellow-100", text: "text-yellow-700" };
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}>
        {status}
      </span>
    );
  };

  if (loading)
    return <p className="p-4 text-center text-gray-500">Loading your orders...</p>;

  if (orders.length === 0)
    return (
      <div className="p-4 text-center text-gray-500">
        No orders yet.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-6 text-green-600">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border rounded-lg shadow-md overflow-hidden"
        >
          {/* Order Header */}
          <div className="flex justify-between items-center p-4 bg-green-50">
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Order ID:</span> {order._id}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Total:</span> ₹{order.totalAmount}
              </p>
            </div>
            <div className="flex space-x-2">
              {getStatusBadge(order.paymentStatus, "payment")}
              {getStatusBadge(order.orderStatus, "order")}
            </div>
          </div>

          {/* Order Details */}
          <div className="p-4 border-t">
            <p className="text-gray-800 font-semibold mb-2">Delivery Address:</p>
            <p className="text-gray-600 mb-4">{order.address}</p>

            <p className="text-gray-800 font-semibold mb-2">Items:</p>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between py-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;

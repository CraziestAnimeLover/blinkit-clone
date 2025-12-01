import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [token]);

  if (orders.length === 0) return <p className="p-4">No orders yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="border rounded-lg p-4 mb-4 shadow-sm bg-gray-50">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Items:</strong></p>
          <ul className="list-disc ml-6">
            {order.items.map((item) => (
              <li key={item.product._id}>
                {item.product.name} x {item.quantity} — ₹{item.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;

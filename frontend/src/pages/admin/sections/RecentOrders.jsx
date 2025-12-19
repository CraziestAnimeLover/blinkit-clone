import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/status`,
        { status: newStatus }, // <-- backend expects `orderStatus`
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the order status in local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p className="p-4 text-center text-gray-500">Loading...</p>;
  if (orders.length === 0) return <p className="p-4 text-center text-gray-500">No orders</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Items</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Address</th>
            <th className="py-2">Total</th>
            <th className="py-2">Order Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b hover:bg-gray-50">
              <td className="py-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    {item.img && (
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-xl"
                      />
                    )}
                    <span>{item.name} x {item.quantity} — ₹{item.price}</span>
                  </div>
                ))}
              </td>
              <td>{order.userId?.name || "Unknown"}</td>
              <td>{order.address || "N/A"}</td>
              <td>₹{order.totalAmount}</td>
              <td>
                <select
                  value={order.orderStatus || "PLACED"}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="px-3 py-1 rounded-xl text-sm font-semibold"
                >
                  <option value="PLACED">PLACED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

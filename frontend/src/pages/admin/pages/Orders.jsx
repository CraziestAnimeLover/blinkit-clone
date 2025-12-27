import { useEffect, useState } from "react";
import AssignDeliveryModal from "./AssignDeliveryModal";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/admin/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading orders...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th> {/* ✅ NEW */}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="p-3 text-xs">{order._id}</td>

                <td className="p-3">
                  <p className="font-medium">
                    {order.userId?.name || "Guest"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {order.userId?.email}
                  </p>
                </td>

                <td className="p-3 font-semibold">
                  ₹{order.totalAmount}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.paymentStatus === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentMethod}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.orderStatus === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td className="p-3 text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* ✅ ASSIGN BUTTON */}
                <td className="p-3">
                  {order.deliveryBoy ? (
                    <span className="text-green-600 text-xs font-medium">
                      Assigned
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedOrder(order._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    >
                      Assign Delivery
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No orders found
          </p>
        )}
      </div>

      {/* ✅ MODAL */}
      {selectedOrder && (
        <AssignDeliveryModal
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAssigned={fetchOrders}
        />
      )}
    </div>
  );
}

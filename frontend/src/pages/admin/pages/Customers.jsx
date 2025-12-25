import { useEffect, useState } from "react";
import axios from "axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/customers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCustomers(res.data.customers);
      } catch (err) {
        console.error("Customers error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [token]);

  if (loading) {
    return <p className="text-gray-500">Loading customers...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Email</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-t">
                <td className="p-3 font-medium">{customer.name}</td>

                <td className="p-3 text-gray-600">
                  {customer.email}
                </td>

                <td className="p-3 font-semibold">
                  {customer.orderCount}
                </td>

                <td className="p-3 text-xs text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <p className="text-center py-6 text-gray-500">
            No customers found
          </p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";

export default function StatsCards() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
  if (!token) return;

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data.stats);
    } catch (err) {
      console.error("Stats error:", err.response?.data || err.message);
    }
  };

  fetchStats();
}, [token]);

  if (!stats) {
    return <div className="text-gray-500">Loading stats...</div>;
  }

  const cards = [
    { title: "Menus", value: stats.menus },
    { title: "Orders", value: stats.orders },
    { title: "Customers", value: stats.customers },
    { title: "Income", value: `₹${stats.income}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((s, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
        >
          <h2 className="text-gray-500">{s.title}</h2>
          <p className="text-3xl font-bold mt-2">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

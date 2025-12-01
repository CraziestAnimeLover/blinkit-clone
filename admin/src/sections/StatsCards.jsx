import React, { useEffect, useState } from "react";
import axios from "axios";

const StatsCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });

        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return <p className="text-gray-600 text-lg">Loading dashboard...</p>;

  if (error)
    return <p className="text-red-500 text-lg">{error}</p>;

  return (
    <div className="grid grid-cols-4 gap-6">
      {[
        { title: "Menus", value: stats.menus },
        { title: "Orders", value: stats.orders },
        { title: "Customers", value: stats.customers },
        { title: "Income", value: `₹${stats.income}` },
      ].map((s, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">{s.title}</h3>
          <p className="text-3xl font-bold mt-2">{s.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

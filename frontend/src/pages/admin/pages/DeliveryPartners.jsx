import { useEffect, useState } from "react";
import axios from "axios";

export default function DeliveryPartners() {
  const [partners, setPartners] = useState([]);
  const token = localStorage.getItem("token");

  const fetchPartners = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Filter only delivery partners
      setPartners(res.data.users.filter(u => u.role === "delivery"));
    } catch (err) {
      console.error("Failed to fetch delivery partners:", err);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const approvePartner = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/approve-delivery/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Delivery partner approved!");
      fetchPartners();
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Approval failed");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Delivery Partners</h1>

      <div className="bg-white rounded shadow">
        {partners.length === 0 && <p className="p-4">No delivery partners found</p>}
        {partners.map((p) => {
          const isApproved = p.isVerified && p.status === "ACTIVE";

          return (
            <div key={p._id} className="flex justify-between items-center p-4 border-b">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">{p.email}</p>
                <p className="text-sm text-gray-500">
                  Status: {isApproved ? "Approved" : "Pending Approval"}
                </p>
                <p className="text-sm text-gray-500">Vehicle: {p.vehicleType}</p>
              </div>
              {!isApproved && (
                <button
                  className="px-4 py-2 rounded bg-blue-500 text-white"
                  onClick={() => approvePartner(p._id)}
                >
                  Approve
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

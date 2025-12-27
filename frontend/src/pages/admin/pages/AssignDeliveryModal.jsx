import { useEffect, useState } from "react";
import axios from "axios";

export default function AssignDeliveryModal({ orderId, onClose, onAssigned }) {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState("");

  const token = localStorage.getItem("token");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchPartners = async () => {
      const res = await axios.get(
        `${BACKEND_URL}/api/auth/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Only approved & online delivery partners
      setPartners(
        res.data.users.filter(
          u => u.role === "delivery" && u.isVerified
        )
      );
    };
    fetchPartners();
  }, []);

  const assign = async () => {
    if (!selected) return alert("Select delivery partner");

    await axios.put(
      `${BACKEND_URL}/api/orders/assign-delivery`,
      { orderId, deliveryBoyId: selected },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Delivery partner assigned");
    onAssigned();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Assign Delivery Partner</h2>

        <select
          className="w-full border p-2 rounded mb-4"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select partner</option>
          {partners.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.vehicleType})
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={assign}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

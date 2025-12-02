import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ProfilePage = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [formData, setFormData] = useState({ name: user.name, email: user.email, phone: user.phone || "" });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Orders
        const ordersRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersRes.data.orders);

        // Addresses
        const addrRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/addresses/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(addrRes.data.addresses);

        // Payments (example hardcoded)
        setPayments([
          { id: 1, type: "Visa **** 1234" },
          { id: 2, type: "Wallet - Paytm" },
        ]);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("avatar", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/avatar`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setAvatar(res.data.avatar);
      setUser({ ...user, avatar: res.data.avatar });
      alert("Profile image updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update image");
    }
  };

  // Profile update
  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/update`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  // Address CRUD
  const handleAddAddress = async () => {
    const newAddr = { name: "New Address", line1: "", city: "", state: "", zip: "" };
    setAddresses([...addresses, newAddr]);
  };

  const handleDeleteAddress = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addresses.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  const handleSaveAddress = async (addr) => {
    try {
      const token = localStorage.getItem("token");
      if (addr._id) {
        // update
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/addresses/${addr._id}`, addr, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // create
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/addresses`, addr, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(prev => prev.map(a => (a === addr ? res.data.address : a)));
      }
      alert("Address saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* PROFILE HEADER */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 bg-white p-6 rounded shadow">
        <div className="relative">
         <img
  src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.name || "User"}`}
  alt="Profile"
  className="w-24 h-24 rounded-full border"
/>

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="absolute bottom-0 right-0 w-8 h-8 opacity-0 cursor-pointer"
          />
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full text-xs font-bold cursor-pointer">
            📷
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleProfileUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            Save Profile
          </button>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* ORDERS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border hover:bg-gray-50 transition">
                    <td className="p-2 border">{order._id.slice(-6)}</td>
                    <td className="p-2 border">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border">₹{order.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADDRESSES */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Addresses</h2>
          <button
            onClick={handleAddAddress}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            + Add Address
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, idx) => (
            <div key={addr._id || idx} className="border p-4 rounded hover:shadow-md transition">
              <input
                type="text"
                placeholder="Address Name"
                value={addr.name}
                onChange={(e) => handleAddressChange(idx, "name", e.target.value)}
                className="border p-2 rounded w-full mb-1"
              />
              <input
                type="text"
                placeholder="Line 1"
                value={addr.line1}
                onChange={(e) => handleAddressChange(idx, "line1", e.target.value)}
                className="border p-2 rounded w-full mb-1"
              />
              <input
                type="text"
                placeholder="City"
                value={addr.city}
                onChange={(e) => handleAddressChange(idx, "city", e.target.value)}
                className="border p-2 rounded w-full mb-1"
              />
              <input
                type="text"
                placeholder="State"
                value={addr.state}
                onChange={(e) => handleAddressChange(idx, "state", e.target.value)}
                className="border p-2 rounded w-full mb-1"
              />
              <input
                type="text"
                placeholder="ZIP"
                value={addr.zip}
                onChange={(e) => handleAddressChange(idx, "zip", e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => handleSaveAddress(addr)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => handleDeleteAddress(addr._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
        <div className="space-y-2">
          {payments.map((p) => (
            <div key={p.id} className="border p-3 rounded flex justify-between items-center hover:shadow-md transition">
              <span>{p.type}</span>
              <button className="text-green-600 hover:underline">Edit</button>
            </div>
          ))}
        </div>
      </div>

      {/* SETTINGS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-2">
          <button className="w-full text-left border p-3 rounded hover:shadow-md transition">
            Change Password
          </button>
          <button className="w-full text-left border p-3 rounded hover:shadow-md transition">
            Notification Preferences
          </button>
          <button className="w-full text-left border p-3 rounded hover:shadow-md transition">
            Privacy Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

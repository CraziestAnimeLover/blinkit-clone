import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", stock: "", image: null });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8000/api/products").then(res => setProducts(res.data.products));
    axios.get("http://localhost:8000/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUsers(res.data.users));
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") setForm({ ...form, image: e.target.files[0] });
    else setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));

      await axios.post("http://localhost:8000/api/products", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Product added");
      // Refresh products
      axios.get("http://localhost:8000/api/products").then(res => setProducts(res.data.products));
      // Reset form
      setForm({ name: "", price: "", category: "", stock: "", image: null });
    } catch (error) {
      alert("❌ Failed to add product: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("🗑 Product deleted");
  };

  const handleToggleAdmin = async (id, currentIsAdmin) => {
    await axios.put(`http://localhost:8000/api/auth/users/${id}`, { isAdmin: !currentIsAdmin }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("User updated");
    // Refresh users
    axios.get("http://localhost:8000/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUsers(res.data.users));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      {/* Product Management */}
      <h2 className="text-lg font-semibold mb-2">Product Management</h2>
      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded mb-6">
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" />
        <input name="price" placeholder="Price" onChange={handleChange} className="border p-2 w-full" />
        <input name="category" placeholder="Category" onChange={handleChange} className="border p-2 w-full" />
        <input name="stock" placeholder="Stock" onChange={handleChange} className="border p-2 w-full" />
        <input type="file" name="image" onChange={handleChange} className="border p-2 w-full" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add Product</button>
      </form>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {products.map((p) => (
          <div key={p._id} className="border p-3 rounded">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
            <h2 className="font-semibold">{p.name}</h2>
            <p>₹{p.price}</p>
            <button onClick={() => handleDelete(p._id)} className="text-red-600 mt-2">Delete</button>
          </div>
        ))}
      </div>

      {/* User Management */}
      <h2 className="text-lg font-semibold mb-2">User Management</h2>
      <div className="border p-4 rounded">
        {users.map((u) => (
          <div key={u._id} className="flex justify-between items-center border-b py-2">
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
            </div>
            <button
              onClick={() => handleToggleAdmin(u._id, u.isAdmin)}
              className={`px-3 py-1 rounded ${u.isAdmin ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            >
              {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

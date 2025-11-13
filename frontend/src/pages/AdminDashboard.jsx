import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", stock: "", image: null });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:8000/api/products").then(res => setProducts(res.data));
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") setForm({ ...form, image: e.target.files[0] });
    else setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    await axios.post("http://localhost:8000/api/products", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("✅ Product added");
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("🗑 Product deleted");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded">
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" />
        <input name="price" placeholder="Price" onChange={handleChange} className="border p-2 w-full" />
        <input name="category" placeholder="Category" onChange={handleChange} className="border p-2 w-full" />
        <input name="stock" placeholder="Stock" onChange={handleChange} className="border p-2 w-full" />
        <input type="file" name="image" onChange={handleChange} className="border p-2 w-full" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Add Product</button>
      </form>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {products.map((p) => (
          <div key={p._id} className="border p-3 rounded">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
            <h2 className="font-semibold">{p.name}</h2>
            <p>₹{p.price}</p>
            <button onClick={() => handleDelete(p._id)} className="text-red-600 mt-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {allCategories} from "../../../data/allCategories.js"

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "", image: null });
  const token = localStorage.getItem("token");

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      setProducts(res.data.products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") setForm({ ...form, image: e.target.files[0] });
    else setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", Number(form.price));  // ✅ convert to number
    formData.append("category", form.category);
    formData.append("stock", Number(form.stock));  // ✅ convert to number
    if (form.image) formData.append("image", form.image);

    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("✔ Product Added");
    loadProducts();
    setForm({ name: "", description: "", price: "", category: "", stock: "", image: null });
  } catch (err) {
    console.error("Error creating product:", err.response?.data || err.message);
    alert("Failed: " + err.response?.data?.message || err.message);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑 Deleted");
      loadProducts();
    } catch (err) {
      alert("Failed to delete: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">Products</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products Table */}
        <div className="flex-1 overflow-x-auto border rounded bg-white p-3">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No products found.</td></tr>
              )}
              {products.map((p) => (
                <tr key={p._id} className="border hover:bg-gray-50 transition">
                  <td className="p-2 border"><img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" /></td>
                  <td className="p-2 border font-medium">{p.name}</td>
                  <td className="p-2 border">₹{p.price}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">{p.stock}</td>
                  <td className="p-2 border text-center">
                    <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Product Form */}
        <div className="w-full lg:w-1/3 border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-4 text-center lg:text-left">Add Product</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 w-full rounded" />
            <input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 w-full rounded" />
            <select name="category" value={form.category} onChange={handleChange} className="border p-2 w-full rounded">
              <option value="">Select Category</option>
              {allCategories.map(group => (
                <optgroup key={group.title} label={group.title}>
                  {group.items.map(item => <option key={item} value={item}>{item}</option>)}
                </optgroup>
              ))}
            </select>
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full rounded" />
            <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="border p-2 w-full rounded" />
            <input type="file" name="image" onChange={handleChange} className="border p-2 w-full rounded" />
            <button className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}

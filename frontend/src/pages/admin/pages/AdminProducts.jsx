import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: null
  });

  const token = localStorage.getItem("token");

  const loadProducts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
    setProducts(res.data.products);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image")
      setForm({ ...form, image: e.target.files[0] });
    else setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✔ Product Added");
      loadProducts();
      setForm({ name: "", price: "", category: "", stock: "", image: null });
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("🗑 Deleted");
    loadProducts();
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT SIDE — TABLE */}
        <div className="md:col-span-2 overflow-x-auto border rounded bg-white p-3">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Stock</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border">
                  <td className="p-3 border">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>

                  <td className="p-3 border font-medium">{p.name}</td>
                  <td className="p-3 border">₹{p.price}</td>
                  <td className="p-3 border">{p.category}</td>
                  <td className="p-3 border">{p.stock}</td>

                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE — ADD PRODUCT FORM */}
        <div className="border p-4 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-4">Add Product</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />

            <input
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />

            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />

            <input
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />

            <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
              Add Product
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

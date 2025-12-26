import React, { useEffect, useState } from "react";
import axios from "axios";
import { allCategories } from "../../../data/allCategories.js";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    variants: [
      { label: "500 g", price: "", mrp: "", stock: "" },
    ],
  });

  const token = localStorage.getItem("token");

  // 🔹 Load products
  const loadProducts = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products`
    );
    setProducts(res.data.products);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔹 Handle text inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle variants
  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm({ ...form, variants: updated });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { label: "", price: "", mrp: "", stock: "" }],
    });
  };

  // 🔹 Handle images
  const handleImages = (e) => {
    setImages([...e.target.files]);
  };

  // 🔹 Submit product
  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("brand", form.brand);
  formData.append("description", form.description);
  formData.append("category", form.category);
  formData.append("variants", JSON.stringify(form.variants));

  images.forEach((img) => {
    formData.append("images", img);
  });

  await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/products`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ DO NOT SET Content-Type
      },
    }
  );

  alert("✅ Product Added");
  loadProducts();

  setForm({
    name: "",
    brand: "",
    description: "",
    category: "",
    variants: [{ label: "", price: "", mrp: "", stock: "" }],
  });
  setImages([]);
};


  // 🔹 Delete product
  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;

    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("🗑 Deleted");
    loadProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Products</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ADD PRODUCT */}
        <form
          onSubmit={handleSubmit}
          className="border p-4 rounded bg-white space-y-3"
        >
          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />

          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Select category</option>
            {allCategories.map((group) => (
              <optgroup key={group.title} label={group.title}>
                {group.items.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 w-full"
          />

          {/* VARIANTS */}
          <div className="space-y-2">
            <h3 className="font-semibold">Variants</h3>
            {form.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                <input
                  placeholder="Size"
                  value={v.label}
                  onChange={(e) =>
                    handleVariantChange(i, "label", e.target.value)
                  }
                  className="border p-1"
                />
                <input
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) =>
                    handleVariantChange(i, "price", e.target.value)
                  }
                  className="border p-1"
                />
                <input
                  placeholder="MRP"
                  value={v.mrp}
                  onChange={(e) =>
                    handleVariantChange(i, "mrp", e.target.value)
                  }
                  className="border p-1"
                />
                <input
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) =>
                    handleVariantChange(i, "stock", e.target.value)
                  }
                  className="border p-1"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="text-sm text-blue-600"
            >
              + Add Variant
            </button>
          </div>

         <input
  type="file"
  multiple
  accept="image/*"
  onChange={handleImages}
  className="border p-2 w-full"
/>


          <button className="bg-green-600 text-white py-2 rounded w-full">
            Add Product
          </button>
        </form>

        {/* PRODUCTS LIST */}
        <div className="lg:col-span-2 border rounded bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Variants</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-2">
                    <img
                      src={p.images?.[0]?.url}
                      className="w-12 h-12 object-cover"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.variants.length}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center">
                    No products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

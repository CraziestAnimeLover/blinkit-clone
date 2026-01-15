import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { allCategories } from "../../../data/allCategories.js";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]); // current uploaded images
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    variants: [{ label: "500 g", price: "", mrp: "", stock: "" }],
  });

  const token = localStorage.getItem("token");

  // 🔹 Memoized category options
  const categoryOptions = useMemo(
    () =>
      allCategories.map((group) => (
        <optgroup key={group.title} label={group.title}>
          {group.items.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </optgroup>
      )),
    []
  );

  // 🔹 Load products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 🔹 Form handlers
  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleVariantChange = useCallback((index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.variants];
      updated[index][field] = value;
      return { ...prev, variants: updated };
    });
  }, []);

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { label: "", price: "", mrp: "", stock: "" }],
    }));
  };

  // 🔹 Drag & Drop / File input for images
  const handleImages = (files) => {
    setImages(Array.from(files)); // REPLACE previous images
  };

  const handleFileChange = (e) => handleImages(e.target.files);
  const handleDrop = (e) => {
    e.preventDefault();
    handleImages(e.dataTransfer.files);
  };
  const handleDragOver = (e) => e.preventDefault();

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Submit new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!images.length) return alert("Please upload at least one image");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("variants", JSON.stringify(form.variants));
      images.forEach((img) => formData.append("images", img));

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Product Added");
      loadProducts();

      // reset form and images
      setForm({
        name: "",
        brand: "",
        description: "",
        category: "",
        variants: [{ label: "500 g", price: "", mrp: "", stock: "" }],
      });
      setImages([]);
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("❌ Failed to add product");
    }
  };

  // 🔹 Delete product
  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑 Product deleted");
      loadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("❌ Failed to delete product");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Products</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ADD PRODUCT FORM */}
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-white space-y-3">
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
            {categoryOptions}
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
                  onChange={(e) => handleVariantChange(i, "label", e.target.value)}
                  className="border p-1"
                />
                <input
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                  className="border p-1"
                />
                <input
                  placeholder="MRP"
                  value={v.mrp}
                  onChange={(e) => handleVariantChange(i, "mrp", e.target.value)}
                  className="border p-1"
                />
                <input
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                  className="border p-1"
                />
              </div>
            ))}
            <button type="button" onClick={addVariant} className="text-sm text-blue-600">
              + Add Variant
            </button>
          </div>

          {/* DRAG & DROP IMAGE UPLOAD */}
          <div
            className="border border-dashed border-gray-400 p-4 text-center cursor-pointer rounded"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("imageInput").click()}
          >
            {images.length ? (
              <div className="flex flex-wrap gap-2 justify-start max-h-48 overflow-y-auto">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded overflow-hidden border">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Drag & drop images here or click to upload</p>
            )}
            <input
              id="imageInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button className="bg-green-600 text-white py-2 rounded w-full">Add Product</button>
        </form>

        {/* PRODUCTS TABLE */}
        <div className="lg:col-span-2 border rounded bg-white overflow-x-auto">
          {loading ? (
            <p className="p-4 text-center">Loading products...</p>
          ) : (
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
                {products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="p-2">
                        <img src={p.images?.[0]?.url} className="w-12 h-12 object-cover rounded" />
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      No products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

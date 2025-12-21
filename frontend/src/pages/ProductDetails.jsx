import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
      );
      setProduct(res.data.product);
      setError(null);
    } catch (err) {
      console.error("Error loading product:", err.response?.data || err.message);
      setError("Failed to load product. Invalid ID or server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        <p>{error}</p>
        <Link
          to="/"
          className="mt-4 inline-block text-green-600 underline"
        >
          Go back to Home
        </Link>
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <img
        src={product.image || "https://via.placeholder.com/400"}
        alt={product.name || "Product"}
        onError={(e) => (e.target.src = "https://via.placeholder.com/400")}
        className="w-full h-80 object-cover rounded"
      />

      <h1 className="text-3xl font-bold mt-4">{product.name || "Unnamed Product"}</h1>

      <p className="my-3 text-gray-700">
        {product.description || "No description available."}
      </p>

      <h2 className="text-2xl text-green-600 font-bold">
        ₹{product.price ?? "N/A"}
      </h2>

      <button
        onClick={() => addToCart(product)}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Add to Cart
      </button>
    </div>
  );
}

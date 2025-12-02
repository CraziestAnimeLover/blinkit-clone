import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  const loadProduct = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    setProduct(res.data.product);
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (!product) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-80 object-cover rounded"
      />

      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>

      <p className="my-3 text-gray-700">{product.description}</p>

      <h2 className="text-2xl text-green-600 font-bold">₹{product.price}</h2>

      <button
        onClick={() => addToCart(product)}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Add to Cart
      </button>
    </div>
  );
}

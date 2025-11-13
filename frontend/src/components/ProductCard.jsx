// src/components/ProductCard.jsx
import React from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Link to={`/product/${product._id}`}>
  <div className="p-3 border rounded-lg hover:shadow-md transition">
    <img src={product.image} alt={product.name} className="rounded-md" />
    <h3 className="font-semibold mt-2">{product.name}</h3>
    <p className="text-sm text-gray-600">{product.quantity}</p>
    <p className="text-green-600 font-bold">₹{product.price}</p>
  </div>
</Link>
  );
};

export default ProductCard;

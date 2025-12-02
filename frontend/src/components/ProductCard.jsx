import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Link to={`/product/${product._id}`}>
      <div className="p-3 border rounded-lg hover:shadow-md transition">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-md w-full h-40 object-cover"
        />
        <h3 className="font-semibold mt-2">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.category}</p>
        <p className="text-green-600 font-bold">₹{product.price}</p>
        <button
          onClick={(e) => {
            e.preventDefault(); // prevent redirect
            addToCart(product);
          }}
          className="bg-green-600 text-white px-3 py-1 rounded mt-2"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;

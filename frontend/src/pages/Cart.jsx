// src/components/Cart.jsx
import React, { useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const DELIVERY_CHARGE = 30;
  const HANDLING_CHARGE = 5;
  const DONATION = 1;
  const savings = 35; // mock savings like Blinkit

  // Recompute grand total whenever `total` changes
  const grandTotal = useMemo(() => {
    return Number(total) + DELIVERY_CHARGE + HANDLING_CHARGE + DONATION;
  }, [total]);

  if (cart.length === 0) {
    return <p className="text-center mt-10">🛒 Your cart is empty</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {/* Header */}
      <h1 className="text-xl font-bold">My Cart</h1>
      <p className="text-green-600 text-sm">Your total savings ₹{savings}</p>

      {/* Delivery Info */}
      <div className="bg-white p-3 rounded shadow text-sm">
        🚚 Delivery in <b>8 minutes</b> <br />
        Shipment of {cart.length} item{cart.length > 1 && "s"}
      </div>

      {/* Cart Items */}
      {cart.map((item) => (
        <div key={item._id} className="bg-white p-3 rounded shadow flex gap-3">
          <img
            src={item.image || "https://via.placeholder.com/80"}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />

          <div className="flex-1">
            <h2 className="font-semibold text-sm">{item.name}</h2>

            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold">₹{item.price}</span>
              <span className="line-through text-gray-400 text-xs">
                ₹{Number(item.price) + savings}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                className="px-2 border"
                onClick={() =>
                  updateQuantity(item._id, Math.max(1, item.quantity - 1))
                }
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                className="px-2 border"
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(item._id)}
                className="ml-auto text-red-500 text-xs"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Bill Details */}
      <div className="bg-white p-4 rounded shadow text-sm space-y-2">
        <h2 className="font-semibold">Bill details</h2>

        <div className="flex justify-between">
          <span>Items total</span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Saved</span>
          <span>₹{savings}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery charge</span>
          <span>₹{DELIVERY_CHARGE}</span>
        </div>

        <div className="flex justify-between">
          <span>Handling charge</span>
          <span>₹{HANDLING_CHARGE}</span>
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Grand total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {/* Donation */}
      <div className="bg-white p-3 rounded shadow text-sm">
        ❤️ Feeding India donation ₹{DONATION}
      </div>

      {/* Proceed Button */}
      <button
        onClick={() => {
          if (!token) {
            alert("Please login first");
          } else {
            navigate("/address");
          }
        }}
        className="w-full bg-green-600 text-white py-3 rounded font-bold text-lg"
      >
        ₹{grandTotal} • Proceed
      </button>
    </div>
  );
};

export default Cart;

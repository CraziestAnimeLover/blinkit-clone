import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const DELIVERY_CHARGE = 25;
  const HANDLING_CHARGE = 2;
  const SMALL_CART_CHARGE = 20;
  const grandTotal = total + DELIVERY_CHARGE + HANDLING_CHARGE + SMALL_CART_CHARGE;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center py-4">🛒 Cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between border p-3 rounded">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>₹{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                  className="w-16 border text-center rounded"
                />
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="border-t pt-4">
            <p>Total: ₹{grandTotal}</p>
            <button
              className={`w-full mt-4 py-2 rounded text-white font-semibold ${
                token ? "bg-green-600" : "bg-blue-600"
              }`}
              onClick={() => {
                if (!token) {
                  alert("Please login first");
                } else {
                  navigate("/address");
                }
              }}
            >
              {token ? `₹${grandTotal} - Checkout` : "Login to Proceed"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

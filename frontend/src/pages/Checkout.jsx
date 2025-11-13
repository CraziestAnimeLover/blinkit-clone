// src/pages/Checkout.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const token = localStorage.getItem("token");

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    try {
     const { data } = await axios.post(
  "http://localhost:8000/api/orders",
  {
    items: cartItems,
    totalAmount: total,
    address,
    paymentMethod,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`, // 👈 this is important
    },
  }
);
      alert(data.message);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      <div className="mb-4">
        <label className="block mb-1">Delivery Address</label>
        <textarea
          className="w-full p-2 border rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Payment Method</label>
        <select
          className="w-full p-2 border rounded"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="ONLINE">Online Payment</option>
        </select>
      </div>

      <p className="text-lg font-medium mb-4">Total: ₹{total}</p>
      <button
        onClick={handleCheckout}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

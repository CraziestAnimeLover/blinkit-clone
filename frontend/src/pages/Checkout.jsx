import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false); // ✅ FIXED
  const token = localStorage.getItem("token");

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!token) return alert("Please login first");

    try {
      setLoading(true); // start loader

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        {
          items: cartItems,
          totalAmount: total,
          address,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // required
          },
        }
      );

      alert(data.message);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    } finally {
      setLoading(false); // stop loader
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
        disabled={loading}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;

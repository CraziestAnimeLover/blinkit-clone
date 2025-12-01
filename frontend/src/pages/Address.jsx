import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Address = () => {
  const { cart, total } = useCart();
  const [address, setAddress] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const DELIVERY_CHARGE = 25;
  const HANDLING_CHARGE = 2;
  const SMALL_CART_CHARGE = 20;
  const grandTotal = total + DELIVERY_CHARGE + HANDLING_CHARGE + SMALL_CART_CHARGE;

  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please enter your address");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        {
          items: cart.map((i) => ({
            product: i._id,
            quantity: i.quantity,
            price: i.price,
          })),
          address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Order ID:", response.data.order._id);

      navigate(`/payment/${response.data.order._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Delivery Address</h1>

      {/* Address Input */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Enter Your Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123, Street Name, City, State, Pincode"
          rows={5}
          className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Order Summary Card */}
      <div className="border rounded-lg p-4 mb-6 bg-gray-50 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Charge</span>
          <span>₹{DELIVERY_CHARGE}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Handling Charge</span>
          <span>₹{HANDLING_CHARGE}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Small Cart Charge</span>
          <span>₹{SMALL_CART_CHARGE}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handlePlaceOrder}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default Address;

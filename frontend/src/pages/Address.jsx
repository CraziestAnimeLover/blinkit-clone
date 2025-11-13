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
    // Make API call to create order
    const response = await axios.post(
      "http://localhost:8000/api/orders",
      {
        items: cart.map((i) => ({
          product: i._id,
          quantity: i.quantity,
          price: i.price,
        })),
        address,
      },
      { headers: { Authorization: `Bearer ${token}` } } // Pass JWT token
    );

    // ✅ Log the order ID to debug
    console.log("Order ID:", response.data.order._id);

    // Navigate to Payment page with the order ID
    navigate(`/payment/${response.data.order._id}`);
  } catch (err) {
    console.error(err);
    alert("Failed to place order");
  }
};


  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Address</h1>
      <textarea
        value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder="Enter delivery address"
        className="w-full border p-3 rounded mb-4"
        rows={5}
      ></textarea>
      <button
        onClick={handlePlaceOrder}
        className="w-full py-2 bg-green-600 text-white rounded font-semibold"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default Address;

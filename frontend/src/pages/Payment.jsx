import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Payment = () => {
  const { orderId } = useParams();
  const { total, clearCart } = useCart();
  const [method, setMethod] = useState("razorpay"); // default payment method
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const DELIVERY_CHARGE = 25;
  const HANDLING_CHARGE = 2;
  const SMALL_CART_CHARGE = 20;
  const grandTotal = total + DELIVERY_CHARGE + HANDLING_CHARGE + SMALL_CART_CHARGE;

  const handlePayment = async () => {
    if (!token) return alert("Please login first");

    if (method === "razorpay") {
      try {
        // 1. Create Razorpay order on backend
        const { data } = await axios.post(
          "http://localhost:8000/api/payment/create-order",
          { amount: grandTotal, orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2. Open Razorpay checkout
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          order_id: data.id,
          name: "Blinkit Clone",
          description: "Order Payment",
          handler: async function (response) {
            // Verify payment
            await axios.post(
              "http://localhost:8000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            clearCart();
            navigate("/order-confirmation");
          },
          prefill: { name: "Customer Name", email: "customer@example.com" },
          theme: { color: "#53a20e" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        alert("Payment failed");
      }
    } else if (method === "cod") {
      // COD: call backend to update order as COD
      try {
        await axios.post(
          `http://localhost:8000/api/orders/${orderId}/payment`,
          { method: "cod", amount: 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        clearCart();
        navigate("/order-confirmation");
      } catch (err) {
        console.error(err);
        alert("Failed to select COD");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select Payment Method</h1>

      {/* Razorpay Option */}
      <label className="flex items-center gap-2 border p-3 rounded mb-2 cursor-pointer">
        <input
          type="radio"
          checked={method === "razorpay"}
          onChange={() => setMethod("razorpay")}
        />
        Pay Online (UPI / Card / Wallet)
      </label>

      {/* COD Option */}
      <label className="flex items-center gap-2 border p-3 rounded mb-2 cursor-pointer">
        <input
          type="radio"
          checked={method === "cod"}
          onChange={() => setMethod("cod")}
        />
        Cash on Delivery (COD)
      </label>

      <p className="font-bold mt-4">Total: ₹{grandTotal}</p>

      <button
        onClick={handlePayment}
        className="w-full mt-4 py-2 bg-green-600 text-white rounded font-semibold"
      >
        {method === "cod" ? "Confirm Order (COD)" : `Pay ₹${grandTotal}`}
      </button>
    </div>
  );
};

export default Payment;

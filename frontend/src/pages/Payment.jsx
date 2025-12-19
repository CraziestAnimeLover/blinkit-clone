import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Payment = () => {
  const { orderId } = useParams();
  const { total, clearCart } = useCart();
  const [method, setMethod] = useState("razorpay");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const DELIVERY_CHARGE = 25;
  const HANDLING_CHARGE = 2;
  const SMALL_CART_CHARGE = 20;

  const grandTotal = total + DELIVERY_CHARGE + HANDLING_CHARGE + SMALL_CART_CHARGE;

  const handlePayment = async () => {
    if (!token) return alert("Please login first");

    // ---------------------------
    // ONLINE PAYMENT (RAZORPAY)
    // ---------------------------
    if (method === "razorpay") {
      try {
        const { data: razorpayOrder } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
          { amount: grandTotal, orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: "Blinkit Clone",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              clearCart();

              // Fetch latest order
              const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/latest`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              navigate("/order-confirmation", { state: { order: data.order } });
            } catch (verifyErr) {
              console.error("Verify Error:", verifyErr);
              alert("Payment verification failed");
            }
          },
          prefill: { name: "Customer", email: "customer@example.com" },
          theme: { color: "#53a20e" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Payment Error:", err);
        alert("Payment failed. Try again.");
      }
    }

    // ---------------------------
    // CASH ON DELIVERY (COD)
    // ---------------------------
    if (method === "cod") {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/payment`,
          { method: "COD", amount: grandTotal },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        clearCart();

        // Fetch latest order
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/latest`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        navigate("/order-confirmation", { state: { order: data.order } });
      } catch (err) {
        console.error("COD Error:", err);
        alert("Failed to place COD order");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select Payment Method</h1>

      <label className="flex items-center gap-2 border p-3 rounded mb-2 cursor-pointer">
        <input type="radio" checked={method === "razorpay"} onChange={() => setMethod("razorpay")} />
        Pay Online (UPI / Card / Wallet)
      </label>

      <label className="flex items-center gap-2 border p-3 rounded mb-2 cursor-pointer">
        <input type="radio" checked={method === "cod"} onChange={() => setMethod("cod")} />
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

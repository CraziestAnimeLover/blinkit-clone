import React from "react";
import { useLocation, Link } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order)
    return (
      <div className="text-center p-4">
        <h1 className="text-2xl font-bold">No Order Found</h1>
        <Link to="/" className="text-green-600 underline mt-2 block">
          Go Back Home
        </Link>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">🎉 Order Confirmed!</h1>
      <p>
        <strong>Order ID:</strong> {order._id}
      </p>
      <p>
        <strong>Total:</strong> ₹{order.totalAmount}
      </p>
      <p>
        <strong>Address:</strong> {order.address}
      </p>
      <p className="mt-4">Thank you for shopping with us!</p>

      <Link
        to="/my-orders"
        className="inline-block mt-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        View My Orders
      </Link>
    </div>
  );
};

export default OrderConfirmation;

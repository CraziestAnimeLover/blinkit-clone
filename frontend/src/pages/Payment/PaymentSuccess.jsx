import React from "react";

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-3 text-lg">Thank you for your order!</p>
    </div>
  );
}

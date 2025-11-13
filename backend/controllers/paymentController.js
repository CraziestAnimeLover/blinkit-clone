import Razorpay from "razorpay";
import Order from "../model/Order.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  const { amount, orderId } = req.body; // amount in INR
  const order = await Order.findById(orderId);

  if (!order) return res.status(404).json({ message: "Order not found" });

  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: order._id.toString(),
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  const crypto = require("crypto");

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // mark payment as paid
    const order = await Order.findById(orderId);
    order.paymentStatus = "paid";
    order.paymentMethod = "Razorpay";
    order.amountPaid = order.totalPrice;
    await order.save();
    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
};

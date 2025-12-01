import Razorpay from "razorpay";
import Order from "../model/Order.js";
import crypto from "crypto";

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,    // ✔ fixed name
});

// -------------------------------
// CREATE RAZORPAY ORDER
// -------------------------------
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const options = {
      amount: amount * 100,       // convert INR to paise
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorOrder = await razorpay.orders.create(options);
    res.json(razorOrder);

  } catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// -------------------------------
// VERIFY PAYMENT
// -------------------------------
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Generate signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // Compare signatures
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature mismatch",
      });
    }

    // Update order in DB
    await Order.findByIdAndUpdate(orderId, {
      status: "Paid",
      paymentId: razorpay_payment_id,
    });

    res.json({ success: true, message: "Payment verified" });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

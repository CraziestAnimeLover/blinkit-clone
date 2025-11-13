import Order from "../model/Order.js";
import Product from "../model/Product.js";
import jwt from "jsonwebtoken";



export const createOrder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decode.user.id since your token structure is { user: { id, role } }
    const userId = decoded.user.id;

    const { items, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId,
      items: items.map((item) => ({
        productId: item.productId || item._id, // handle both possible keys
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      address,
      paymentMethod: paymentMethod || "COD",
    });

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (err) {
    console.error("❌ Order error:", err);
    res.status(500).json({ message: err.message });
  }
};



export const getOrders = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const orders = await Order.find({ user: decoded.id }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Route: POST /api/orders/:id/payment
export const addPaymentMethod = async (req, res) => {
  const { method, amount } = req.body; // method: "COD" or "ONLINE"
  const { id } = req.params; // orderId
  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (method === "COD") {
      order.paymentMethod = "COD";       // <-- Add here
      order.paymentStatus = "PENDING";   // <-- Add here
      order.amountPaid = 0;
    } else if (method === "ONLINE") {
      order.paymentMethod = "ONLINE";    // <-- Add here
      order.paymentStatus = "PAID";      // <-- Add here
      order.amountPaid = amount;          // amount paid from Razorpay
    }

    await order.save();                   // <-- Save changes to DB
    res.json({ message: "Payment updated successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



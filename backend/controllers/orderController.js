import Order from "../model/Order.js";
import jwt from "jsonwebtoken";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware sets req.user
    const { items, address, paymentMethod } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items provided" });

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId,
      items: items.map((item) => ({
        productId: item.productId || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      address,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "ONLINE" ? "PAID" : "PENDING",
      amountPaid: paymentMethod === "ONLINE" ? totalAmount : 0,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Order error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all orders of a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId"); // optional, if product is a ref

    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get latest order of a user
export const getLatestOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const latestOrder = await Order.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    if (!latestOrder)
      return res.status(404).json({ message: "No orders found" });

    res.json({ success: true, order: latestOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add payment info to an existing order
export const addPaymentMethod = async (req, res) => {
  const { method, amount } = req.body; // method: COD or ONLINE
  const { id } = req.params; // orderId

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (method === "COD") {
      order.paymentMethod = "COD";
      order.paymentStatus = "PENDING";
      order.amountPaid = 0;
    } else if (method === "ONLINE") {
      order.paymentMethod = "ONLINE";
      order.paymentStatus = "PAID";
      order.amountPaid = amount;
    }

    await order.save();
    res.json({ message: "Payment updated successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin updates order status
// PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // expects "PLACED" | "DELIVERED" | "CANCELLED"

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status; // update orderStatus, NOT paymentStatus
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


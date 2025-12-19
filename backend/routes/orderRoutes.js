import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createOrder,
  getUserOrders,
  addPaymentMethod,
  getLatestOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Create a new order
router.post("/", authMiddleware, createOrder);

// Get all orders of logged-in user
router.get("/", authMiddleware, getUserOrders);
router.get("/my-orders", authMiddleware, getUserOrders); // optional alias

// Get latest order of logged-in user
router.get("/latest", authMiddleware, getLatestOrder);
// Update order status (Admin)
router.put("/:id/status", authMiddleware, updateOrderStatus);

// Add payment method to existing order
router.post("/:id/payment", authMiddleware, addPaymentMethod);

export default router;

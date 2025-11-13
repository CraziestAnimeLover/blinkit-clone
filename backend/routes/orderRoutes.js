import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createOrder, getOrders , addPaymentMethod } from "../controllers/orderController.js";

const router = express.Router();

// ✅ Create order
router.post("/", authMiddleware, createOrder);

// ✅ Get user orders
router.get("/", authMiddleware, getOrders);

router.post("/:id/payment", authMiddleware, addPaymentMethod); // Add payment

export default router;

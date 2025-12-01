import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createOrder,  getUserOrders  , addPaymentMethod ,placeOrder} from "../controllers/orderController.js";

const router = express.Router();

// ✅ Create order
router.post("/", authMiddleware, createOrder);

// ✅ Get user orders
router.get("/", authMiddleware,  getUserOrders );
router.post("/", authMiddleware, placeOrder)
// Get orders of logged-in user
router.get("/my-orders", authMiddleware, getUserOrders);

router.post("/:id/payment", authMiddleware, addPaymentMethod); // Add payment

export default router;

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createOrder,
  getUserOrders,
  addPaymentMethod,
  getLatestOrder,
  updateOrderStatus,
  getDeliveryLocation, // <-- new
  assignDeliveryBoy,updateDeliveryLocation,getAssignedOrders
} from "../controllers/orderController.js";

const router = express.Router();

// Existing routes...
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/my-orders", authMiddleware, getUserOrders);
router.get("/latest", authMiddleware, getLatestOrder);
router.post("/:id/payment", authMiddleware, addPaymentMethod);
router.put("/:id/status", authMiddleware, updateOrderStatus);
router.put("/assign-delivery", authMiddleware, assignDeliveryBoy);
router.get("/assigned", authMiddleware, getAssignedOrders);
// delivery boy
router.put("/:id/location", authMiddleware, updateDeliveryLocation);
// ✅ New route for delivery location
router.get("/:id/location", authMiddleware, getDeliveryLocation);

export default router;

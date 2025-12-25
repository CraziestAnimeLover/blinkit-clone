import express from "express";
import adminAuth from "../middleware/adminMiddleware.js";
import { getAdminStats,
  getAllOrders,
  getAllCustomers,  } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/stats", adminAuth, getAdminStats);
router.get("/orders", adminAuth, getAllOrders);
router.get("/customers", adminAuth, getAllCustomers);

export default router;

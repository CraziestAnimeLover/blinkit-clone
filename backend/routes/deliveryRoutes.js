import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateLocation } from "../controllers/deliveryController.js";

const router = express.Router();

router.put("/location", authMiddleware, updateLocation);

export default router;

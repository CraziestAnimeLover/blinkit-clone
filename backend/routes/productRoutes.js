import express from "express";
import upload from "../middleware/multer.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminMiddleware.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getProducts);
router.get("/:id", getProductById);

// ADMIN ONLY ROUTES
router.post(
  "/",
  authMiddleware,      // <- verify token
  adminAuth,           // <- check admin role
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminAuth,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminAuth,
  deleteProduct
);

export default router;

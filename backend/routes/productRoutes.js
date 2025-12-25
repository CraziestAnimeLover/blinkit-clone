import express from "express";
import upload from "../middleware/multer.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminMiddleware.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

// ADMIN
router.post(
  "/",
  authMiddleware,
  adminAuth,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminAuth,
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminAuth,
  deleteProduct
);

export default router;

import express from "express";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminMiddleware.js"
import { updateProduct,deleteProduct } from "../controllers/productController.js";
import {
  createProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", adminAuth, upload.single("image"), createProduct);
router.put("/:id", adminAuth, updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

export default router;

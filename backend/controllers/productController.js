import Product from "../model/Product.js";
import cloudinary from "../config/cloudinary.js";
import dataUri from "../utils/dataUri.js";
import { adminAuth } from "../middleware/adminMiddleware.js";

// Create new product
// Upload product with image
export const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const file = dataUri(req.file).content;
      const uploadResponse = await cloudinary.uploader.upload(file, {
        folder: "products",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const { name, description, price, category, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: imageUrl,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    Object.assign(product, req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

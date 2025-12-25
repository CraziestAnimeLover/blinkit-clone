import Product from "../model/Product.js";
import cloudinary from "../config/cloudinary.js";
import dataUri from "../utils/dataUri.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      category,
      variants,
      isFeatured,
    } = req.body;

    // Upload images
    let images = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const fileUri = dataUri(file).content;
        const uploaded = await cloudinary.uploader.upload(fileUri, {
          folder: "products",
        });

        images.push({
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
        });
      }
    }

    const product = await Product.create({
      name,
      brand,
      description,
      category,
      images,
      variants: JSON.parse(variants), // IMPORTANT
      isFeatured,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    Object.assign(product, req.body);

    if (req.body.variants) {
      product.variants = JSON.parse(req.body.variants);
    }

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    product.isActive = false;
    await product.save();

    res.json({ success: true, message: "Product disabled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

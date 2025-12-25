import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    label: {
      type: String, // "500 g", "1 kg"
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String, // keeping STRING to match your frontend
      required: true,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    variants: {
      type: [variantSchema],
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

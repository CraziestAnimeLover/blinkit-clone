import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"] },
    paymentStatus: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" },
    orderStatus: { type: String, enum: ["PLACED", "DELIVERED", "CANCELLED"], default: "PLACED" },

    // ✅ New fields for delivery tracking
    deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // assigned delivery partner
    deliveryLocation: { lat: Number, lng: Number }, // optional cached last location
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;

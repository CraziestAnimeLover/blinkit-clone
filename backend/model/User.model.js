import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, unique: true, sparse: true },
    isPhoneVerified: { type: Boolean, default: false },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isAdmin: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
    avatar: String,
    addresses: [
      {
        label: { type: String, enum: ["Home", "Work", "Other"] },
        addressLine: String,
        city: String,
        pincode: String,
        latitude: Number,
        longitude: Number,
        isDefault: Boolean,
      },
    ],
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderAt: Date,
    preferences: {
      categories: [String],
      frequentProducts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      ],
    },
    walletBalance: { type: Number, default: 0 },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

// ✅ Use existing model if it exists, otherwise create
export default mongoose.models.User || mongoose.model("User", UserSchema);
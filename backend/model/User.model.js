import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // removes spaces from start & end
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // good for consistent email storage
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"], // helps keep valid roles
    },
    address: {
      type: String,
      trim: true,
    },
    isAdmin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;

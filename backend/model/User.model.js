import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },

    address: {
      type: String,
      trim: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    avatar: {
      type: String,
    },

    // 🔑 PASSWORD RESET FIELDS (CRITICAL)
    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;

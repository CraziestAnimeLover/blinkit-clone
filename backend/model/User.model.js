import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true, // optional but recommended
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
        return !this.googleId; // only required if no googleId
      },
    },
    googleId: { // add this field for Google OAuth
      type: String,
      unique: true,
      sparse: true, // allows null values
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
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String }, // optional profile picture from Google
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;

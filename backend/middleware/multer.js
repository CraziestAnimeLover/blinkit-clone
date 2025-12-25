// backend/middleware/multer.js
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import UserSchema from "../model/User.model.js"; // just import the schema

// Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// ✅ Storage configuration for Multer (in memory)
const storage = multer.memoryStorage();

// ✅ File filter (optional: only images)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// ✅ Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

export default upload;

// Example usage in a route
// import upload from "../middleware/multer.js";
// router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).send("No file uploaded");
//     // You can upload req.file.buffer to Cloudinary or local storage here
//     res.status(200).json({ message: "File uploaded successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  googleCallback,
  updateProfile, updateAvatar
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminMiddleware.js";
import User from "../model/User.model.js";
import passport from "../config/passport.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// ---------------- AUTH ----------------
router.post("/signup", signup);
router.post("/login", login);
router.put("/update", authMiddleware, updateProfile);

// Use your existing multer middleware for avatar upload
router.put("/avatar", authMiddleware, upload.single("avatar"), updateAvatar);
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- ADMIN ----------------
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/users/:id", adminAuth, async (req, res) => {
  try {
    const { isAdmin, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin, role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------------- PASSWORD ----------------
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// ---------------- GOOGLE OAUTH ----------------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Redirect callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback // redirects to FRONTEND_URL/login?token=...
);



export default router;

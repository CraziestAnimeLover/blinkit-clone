import express from "express";
import { signup, login,forgotPassword, resetPassword ,googleCallback} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminMiddleware.js";
import User from "../model/User.model.js";
import passport from "../config/passport.js";

const router = express.Router();

/* ================================
   AUTH ROUTES
================================ */

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Logged-in user details

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (error) {
    console.error("ME error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});



/* ================================
   ADMIN ROUTES
================================ */

// Get all users
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    console.error("Admin Get Users error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update user (role, isAdmin)
router.put("/users/:id", adminAuth, async (req, res) => {
  try {
    const { isAdmin, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin, role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Admin Update User error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password/:token', resetPassword);



// google authMiddleware
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);


export default router;

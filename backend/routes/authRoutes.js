import express from "express";
import { signup, login } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../model/User.model.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;

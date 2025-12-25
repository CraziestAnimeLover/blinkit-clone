import User from "../model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone,
      role,
      addressLine,
      city,
      pincode,
      latitude,
      longitude
    } = req.body;

    // 1️⃣ Check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 2️⃣ Hash password
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    // 3️⃣ Create user
    user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
      isAdmin: role === "admin",
      status: "ACTIVE",
      addresses: addressLine
        ? [
            {
              label: "Home",
              addressLine,
              city,
              pincode,
              latitude,
              longitude,
              isDefault: true,
            },
          ]
        : [],
    });

    await user.save();

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = await User.findById(user._id).select("-password");

    res.status(201).json({
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.password) {
      return res
        .status(400)
        .json({ msg: "Password login not available. Use Google login." });
    }

    if (user.status === "BLOCKED") {
      return res.status(403).json({ msg: "Account blocked by admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = await User.findById(user._id).select("-password");

    res.json({ token, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= GOOGLE CALLBACK ================= */
export const googleCallback = (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send("User not found");
    }

    if (req.user.status === "BLOCKED") {
      return res.status(403).send("Account blocked");
    }

    const token = jwt.sign(
      {
        id: req.user._id,
        role: req.user.role,
        isAdmin: req.user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    res.redirect(`${frontendUrl}/login?token=${token}`);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    res.status(500).send("OAuth failed");
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    res.json({ message: "Reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


// Update avatar
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Save avatar path in DB
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update profile info
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const { name, email, phone } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
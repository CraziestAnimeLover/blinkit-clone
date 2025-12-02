import User from "../model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // create new user
    user = new User({ name, email, password: hashed, address, role, isAdmin: role === "admin" });
    await user.save();

    // create token
    const payload = { id: user.id, role: user.role, isAdmin: user.isAdmin };

    const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    // return user data without password
    const userData = await User.findById(user._id).select("-password");
    res.json({ token, user: userData });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // create token
    const payload = { id: user.id, role: user.role, isAdmin: user.isAdmin };

    const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    // return user data without password
    const userData = await User.findById(user._id).select("-password");
    res.json({ token, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Example in your authController.js
// authController.js
export const googleCallback = (req, res) => {
  // req.user should have the user info after passport verifies Google OAuth
  const token = generateToken(req.user); // JWT token function
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  // Redirect to frontend login success page with token
  res.redirect(`${frontendUrl}/login/success?token=${token}`);
};


import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Admin Auth Error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default adminAuth;

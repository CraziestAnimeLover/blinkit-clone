import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ msg: "Token is invalid or expired" });
  }
};


export default authMiddleware;

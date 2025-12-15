import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../config/db.js";
import passport from "passport";
import "../config/passport.js";

import authRoutes from "../routes/authRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import paymentRoutes from "../routes/paymentRoutes.js";

const app = express();

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://blinkit-clone-frontend-one.vercel.app",
    ],
    credentials: true,
  })
);

app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});

// ✅ VERY IMPORTANT
export default app;

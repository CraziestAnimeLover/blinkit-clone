import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import passport from "passport";
import "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB
connectDB();

// Middlewares
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

// --------------------
// API ROUTES
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); // ✅ FIXED
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// --------------------
// HEALTH CHECK
// --------------------
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend running 🚀" });
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

// --------------------
// FRONTEND (LAST)
// --------------------
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

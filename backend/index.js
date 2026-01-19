import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { initSocket } from "./socket.js";
import connectDB from "./config/db.js";
import passport from "passport";
import "./config/passport.js";

import addressRoutes from "./routes/address.routes.js";
import smsRoutes from "./routes/smsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import recommendationRoutes from "./routes/recommendedroutes.js";
import verifyRoutes from "./routes/verifyRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

const app = express();

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB
connectDB();
const PORT = process.env.PORT || 8000;

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
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", recommendationRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/delivery", deliveryRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});

/* =======================
   SOCKET.IO SETUP
======================= */
const server = http.createServer(app);

// ✅ Initialize socket once
initSocket(server);

// Start server
server.listen(PORT, () =>
  console.log(`Server + Socket running on port ${PORT}`)
);

// Export app (for testing)
export default app;

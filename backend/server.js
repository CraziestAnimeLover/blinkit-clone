import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import passport from "passport";            // <-- ADD
import "./config/passport.js";              // <-- ADD (loads Google Strategy)

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


const app = express();
const PORT = process.env.PORT || 8000;

// connect to DB
connectDB();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL, // localhost during development
      "https://blinkit-clone-frontend-one.vercel.app" // deployed frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


app.use(passport.initialize());   // <-- ADD THIS

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});
app.get("/favicon.ico", (req, res) => res.status(204));
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

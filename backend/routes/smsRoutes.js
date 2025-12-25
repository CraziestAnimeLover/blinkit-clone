import express from "express";
import sendSmsController from "../controllers/smsController.js"; // ✅ no curly braces

const router = express.Router();

router.post("/send", sendSmsController);

export default router;

import { sendOtp, verifyOtp } from "../utils/twilioVerify.js";

export const sendOtpController = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone is required" });

    await sendOtp(phone);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ success: false, message: "Phone and OTP are required" });

    const verification = await verifyOtp(phone, otp);
    if (verification.status === "approved") {
      // Here you can fetch or create the user from your DB
      const user = { phone }; 
      const token = "dummy-jwt-token"; // replace with real JWT
      res.status(200).json({ success: true, message: "OTP verified", user, token });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

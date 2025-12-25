import sendSMS from "../utils/twilio.js";

const sendSmsController = async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Phone and message are required",
      });
    }

    await sendSMS(phone, message);

    return res.status(200).json({
      success: true,
      message: "SMS sent successfully",
    });
  } catch (error) {
    console.error("Twilio Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send SMS",
      error: error.message,
    });
  }
};

export default sendSmsController; // ✅ default export

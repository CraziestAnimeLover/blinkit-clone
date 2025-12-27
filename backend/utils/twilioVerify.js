import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOtp = async (phone) => {
  try {
    const verification = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });
    return verification;
  } catch (err) {
    console.error("Twilio sendOtp error:", err);
    throw err;
  }
};

export const verifyOtp = async (phone, code) => {
  try {
    const verificationCheck = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });
    return verificationCheck;
  } catch (err) {
    console.error("Twilio verifyOtp error:", err);
    throw err;
  }
};

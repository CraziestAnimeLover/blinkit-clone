import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export const sendOtp = async (phone) => {
  return await client.verify.services(serviceSid).verifications.create({
    to: phone,
    channel: "sms",
  });
};

export const verifyOtp = async (phone, code) => {
  return await client.verify.services(serviceSid).verificationChecks.create({
    to: phone,
    code,
  });
};

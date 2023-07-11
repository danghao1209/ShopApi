import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    required: true,
    default: () => Date.now() + 5 * 60 * 1000, // Hết hạn sau 5 phút
  },
});

var Otp = mongoose.model("Otps", otpSchema, "Otps");

export default Otp;

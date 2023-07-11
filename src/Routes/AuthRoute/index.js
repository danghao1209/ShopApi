import express from "express";
import {
  accessTokenNew,
  deleteToken,
  loginUser,
  registerUser,
  sendOtp,
  submitOtp,
  changePassword,
  submitPassword,
} from "../../Controllers/AuthController/index.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
  verifyOTPToken,
} from "../../Middleware/VeryfiToken/index.js";
import { handleError } from "../../Controllers/ErrorController/index.js";
import { ValidateEmail } from "../../Middleware/ValidateEmail/index.js";
import { ValidatePass } from "../../Middleware/ValidatePasswords/index.js";
import { ValidatePhone } from "../../Middleware/ValidatePhone/index.js";

const authRoute = express.Router();

authRoute.post("/login", ValidatePass, ValidateEmail, loginUser, handleError);
authRoute.post(
  "/register",
  ValidatePhone,
  ValidateEmail,
  ValidatePass,
  registerUser
);
authRoute.post("/otp-forgot-password", sendOtp, handleError);
authRoute.post("/submit-otp", ValidateEmail, submitOtp, handleError);
authRoute.post(
  "/submit-forgot-password",
  verifyOTPToken,
  ValidatePass,
  submitPassword,
  handleError
);

authRoute.post(
  "/changepassword",
  verifyAccessToken,
  ValidatePass,
  changePassword,
  handleError
);
authRoute.post("/token", verifyRefreshToken, accessTokenNew, handleError);
authRoute.delete("/token", verifyAccessToken, deleteToken, handleError);

export default authRoute;

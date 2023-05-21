import express from "express";

import { registerUser } from "../../Controllers/RegisterController/index.js";
import { ValidateEmail } from "../../Middleware/ValidateEmail/index.js";
import { ValidatePhone } from "../../Middleware/ValidatePhone/index.js";
import { ValidatePass } from "../../Middleware/ValidatePasswords/index.js";

const userRegisterRoute = express.Router();

userRegisterRoute.post(
  "/",
  ValidatePhone,
  ValidateEmail,
  ValidatePass,
  registerUser
);

export default userRegisterRoute;

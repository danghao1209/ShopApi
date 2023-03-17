import express from "express";

import { registerUser } from "../../Controllers/RegisterController/index.js";
import { ValidateEmail } from "../../Middleware/ValidateEmail/index.js";

const userRoute = express.Router();

userRoute.post("/", ValidateEmail, registerUser);

export default userRoute;

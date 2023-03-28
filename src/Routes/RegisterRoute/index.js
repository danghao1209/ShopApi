import express from "express";

import { registerUser } from "../../Controllers/RegisterController/index.js";
import { ValidateEmail } from "../../Middleware/ValidateEmail/index.js";

const userRegisterRoute = express.Router();

userRegisterRoute.post("/", ValidateEmail, registerUser);

export default userRegisterRoute;

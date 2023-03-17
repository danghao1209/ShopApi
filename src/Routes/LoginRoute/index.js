import express from "express";
import { loginUser } from "../../Controllers/LoginController/index.js";
import { ValidateEmail } from "../../Middleware/ValidateEmail/index.js";

const loginRoute = express.Router();

loginRoute.post("/", ValidateEmail, loginUser);

export default loginRoute;

import express from "express";
import { loginUser } from "../../Controllers/LoginController/index.js";
import { ValidateEmail } from "../../Middleware/ValidateEmail/index.js";

const cartRoute = express.Router();

cartRoute.post("/", ValidateEmail, loginUser);
cartRoute.delete("/", ValidateEmail, loginUser);

export default cartRoute;

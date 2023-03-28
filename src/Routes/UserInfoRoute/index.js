import express from "express";

import { userInfo } from "../../Controllers/UserInfoController/index.js";
import { verifyToken } from "../../Middleware/VeryfiToken/index.js";

const userInfoRoute = express.Router();

userInfoRoute.post("/", verifyToken, userInfo);

export default userInfoRoute;

import express from "express";

import { userInfo } from "../../Controllers/UserInfoController/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const userInfoRoute = express.Router();

userInfoRoute.post("/", verifyAccessToken, userInfo);

export default userInfoRoute;

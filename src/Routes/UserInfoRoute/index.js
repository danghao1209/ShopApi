import express from "express";

import {
  userInfo,
  ordersInfo,
  addressInfo,
} from "../../Controllers/UserInfoController/index.js";
import { handleError } from "../../Controllers/ErrorController/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const userInfoRoute = express.Router();

userInfoRoute.get("/", verifyAccessToken, userInfo, handleError);
userInfoRoute.get("/orders", verifyAccessToken, ordersInfo, handleError);
userInfoRoute.get("/address", verifyAccessToken, addressInfo, handleError);

export default userInfoRoute;

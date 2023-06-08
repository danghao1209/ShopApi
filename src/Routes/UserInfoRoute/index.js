import express from "express";

import {
  userInfo,
  ordersInfo,
  addressInfo,
} from "../../Controllers/UserInfoController/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const userInfoRoute = express.Router();

userInfoRoute.get("/", verifyAccessToken, userInfo);
userInfoRoute.get("/orders", verifyAccessToken, ordersInfo);
userInfoRoute.get("/address", verifyAccessToken, addressInfo);

export default userInfoRoute;

import express from "express";

import {
  userInfo,
  ordersInfo,
  addressInfo,
  getAddressInfo,
} from "../../Controllers/UserInfoController/index.js";
import { handleError } from "../../Controllers/ErrorController/index.js";
import { ValidatePhone } from "../../Middleware/ValidatePhone/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const userInfoRoute = express.Router();

userInfoRoute.get("/", verifyAccessToken, userInfo, handleError);
userInfoRoute.get("/orders", verifyAccessToken, ordersInfo, handleError);
userInfoRoute.post(
  "/address",
  verifyAccessToken,
  ValidatePhone,
  addressInfo,
  handleError
);
userInfoRoute.get("/address", verifyAccessToken, getAddressInfo, handleError);

export default userInfoRoute;

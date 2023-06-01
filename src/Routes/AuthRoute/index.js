import express from "express";
import {
  accessTokenNew,
  deleteToken,
} from "../../Controllers/AuthController/index.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../../Middleware/VeryfiToken/index.js";

const authRoute = express.Router();

cartRoute.post("/token", verifyRefreshToken, accessTokenNew);
cartRoute.delete("/", verifyAccessToken, deleteToken);

export default authRoute;

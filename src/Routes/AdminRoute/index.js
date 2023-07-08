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

authRoute.post("/token", verifyRefreshToken, accessTokenNew);
authRoute.delete("/", verifyAccessToken, deleteToken);

export default authRoute;

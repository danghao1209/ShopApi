import express from "express";
import {
  accessTokenNew,
  deleteToken,
} from "../../Controllers/AuthController/index.js";
import { handleError } from "../../Controllers/ErrorController/index.js";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../../Middleware/VeryfiToken/index.js";

const authRoute = express.Router();

authRoute.post("/token", verifyRefreshToken, accessTokenNew, handleError);
authRoute.delete("/", verifyAccessToken, deleteToken, handleError);

export default authRoute;

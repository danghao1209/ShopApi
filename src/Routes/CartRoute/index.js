import express from "express";
import {
  addCart,
  increaseCart,
  deleteCart,
} from "../../Controllers/CartController/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const cartRoute = express.Router();

cartRoute.post("/", verifyAccessToken, addCart);
cartRoute.delete("/", verifyAccessToken, deleteCart);
cartRoute.put("/", verifyAccessToken, increaseCart);

export default cartRoute;

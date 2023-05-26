import express from "express";
import {
  addCart,
  increaseCart,
  deleteCart,
} from "../../Controllers/CartController/index.js";
import { verifyToken } from "../../Middleware/VeryfiToken/index.js";

const authRoute = express.Router();

cartRoute.post("/", verifyToken, addCart);
cartRoute.delete("/", verifyToken, deleteCart);
cartRoute.put("/", verifyToken, increaseCart);

export default authRoute;

import express from "express";
import {
  getCart,
  addCart,
  increaseCart,
  deleteOneProInCart,
} from "../../Controllers/CartController/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const cartRoute = express.Router();

cartRoute.get("/", verifyAccessToken, getCart);
cartRoute.post("/", verifyAccessToken, addCart);
cartRoute.delete("/", verifyAccessToken, deleteOneProInCart);
cartRoute.put("/", verifyAccessToken, increaseCart);

export default cartRoute;

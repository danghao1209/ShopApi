import express from "express";
import {
  getCart,
  addCart,
  increaseCart,
  getDataProInCart,
  deleteOneProInCart,
} from "../../Controllers/CartController/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const cartRoute = express.Router();

cartRoute.get("/", verifyAccessToken, getCart);
cartRoute.get("/data", verifyAccessToken, getDataProInCart);
cartRoute.post("/", verifyAccessToken, addCart);
cartRoute.post("/delete", verifyAccessToken, deleteOneProInCart);
cartRoute.put("/", verifyAccessToken, increaseCart);

export default cartRoute;

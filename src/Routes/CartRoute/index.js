import express from "express";
import {
  getCart,
  addCart,
  increaseCart,
  getDataProInCart,
  deleteOneProInCart,
} from "../../Controllers/CartController/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";
import { handleError } from "../../Controllers/ErrorController/index.js";

const cartRoute = express.Router();

cartRoute.get("/", verifyAccessToken, getCart, handleError);
cartRoute.get("/data", verifyAccessToken, getDataProInCart, handleError);
cartRoute.post("/", verifyAccessToken, addCart, handleError);
cartRoute.post("/delete", verifyAccessToken, deleteOneProInCart, handleError);
cartRoute.patch("/", verifyAccessToken, increaseCart, handleError);

export default cartRoute;

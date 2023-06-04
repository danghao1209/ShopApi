import express from "express";
import { orderPayment } from "../../Controllers/OrdersController/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const ordersRoute = express.Router();

ordersRoute.post("/", verifyAccessToken, orderPayment);

export default ordersRoute;

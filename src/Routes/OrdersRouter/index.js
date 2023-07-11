import express from "express";
import { orderPayment } from "../../Controllers/OrdersController/index.js";
import { handleError } from "../../Controllers/ErrorController/index.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const ordersRoute = express.Router();

ordersRoute.post("/", verifyAccessToken, orderPayment, handleError);

export default ordersRoute;

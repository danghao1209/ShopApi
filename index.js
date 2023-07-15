import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import cors from "cors";

import productRoute from "./src/Routes/ProductRoute/index.js";
import imagesRoute from "./src/Routes/ImagesRoute/index.js";
import userInfoRoute from "./src/Routes/UserInfoRoute/index.js";
import ordersRoute from "./src/Routes/OrdersRouter/index.js";
import cartRoute from "./src/Routes/CartRoute/index.js";
import searchRoute from "./src/Routes/SearchRoute/index.js";

import authRoute from "./src/Routes/AuthRoute/index.js";

dotenv.config();

try {
  async function connectDb() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("success connect mongo");
  }
  connectDb();
} catch (e) {
  console.log(e);
}

// ban ip nếu spam quá 100 lần trong 15p
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(`public`));
app.use(cors());
app.use(apiLimiter);

app.use("/api/product/", productRoute);
app.use("/api/info/", userInfoRoute);
app.use("/api/payment/", ordersRoute);
app.use("/api/cart/", cartRoute);
app.use("/api/search/", searchRoute);

app.use("/api/public/imgs/", imagesRoute);

app.use("/auth/", authRoute);

app.listen(1209, () => {
  console.log("Sever listen");
});

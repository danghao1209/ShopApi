import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoute from "./src/Routes/AuthRoute/index.js";

dotenv.config();

try {
  mongoose.connect(process.env.MONGO_URL);
  console.log("success connect mongo");
} catch (e) {
  console.log(e);
}

// ban ip nếu spam quá 100 lần trong 15p
const apiAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(apiAuthLimiter);
app.use(express.json());
app.use(cors());

app.use("/auth/", authRoute);

app.listen(2001, () => {
  console.log("Sever listen");
});

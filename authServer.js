import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoute from "./src/Routes/AuthRoute/index.js";
import cors from "cors";

dotenv.config();

try {
  mongoose.connect(process.env.MONGO_URL);
  console.log("success connect mongo");
} catch (e) {
  console.log(e);
}

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/auth/", authRoute);

app.listen(2001, () => {
  console.log("Sever listen");
});

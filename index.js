import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRoute from "./src/Routes/ProductRoute/index.js";
import loginRoute from "./src/Routes/LoginRoute/index.js";
import imagesRoute from "./src/Routes/ImagesRoute/index.js";
import userRegisterRoute from "./src/Routes/RegisterRoute/index.js";
import userInfoRoute from "./src/Routes/UserInfoRoute/index.js";
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
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(`public`));
app.use(cors());

app.use("/api/login", loginRoute);
app.use("/api/product/", productRoute);
app.use("/api/register/", userRegisterRoute);
app.use("/api/info/", userInfoRoute);
app.use("/public/imgs/", imagesRoute);

app.listen(1209, () => {
  console.log("Sever listen");
});

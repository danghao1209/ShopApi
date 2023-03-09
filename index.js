import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import productRoute from "./src/Routes/ProductRoute/index.js";
import loginRoute from "./src/Routes/LoginRoute/index.js";
import imagesRoute from "./src/Routes/ImagesRoute/index.js";
import userRoute from "./src/Routes/RegisterRoute/index.js";

dotenv.config();

try {
  mongoose.connect(process.env.MONGO_URL);
  console.log("success connect mongo");
} catch (e) {
  console.log(e);
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`public`));

app.use("/api/login", loginRoute);
app.use("/api/product/", productRoute);
app.use("/api/register/", userRoute);
app.use("/public/imgs/", imagesRoute);

app.listen(3000, () => {
  console.log("Sever listen");
});

import express from "express";

import { registerUser } from "../../Controllers/RegisterController/index.js";
import { upload } from "../../Controllers/UploadImageController/upload.js";

const userRoute = express.Router();

userRoute.post(
  "/",
  upload.fields([{ name: "images", maxCount: 1 }]),
  registerUser
);

export default userRoute;

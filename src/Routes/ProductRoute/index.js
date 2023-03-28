import express from "express";
import {
  getAllProduct,
  getProduct,
  addProduct,
} from "../../Controllers/ProductController/index.js";
import { upload } from "../../Controllers/UploadImageController/upload.js";
import { verifyToken } from "../../Middleware/VeryfiToken/index.js";

const productRoute = express.Router();

productRoute.get("/all", getAllProduct);
productRoute.get("/:id", getProduct);
productRoute.post(
  "/add",
  verifyToken,
  upload.fields([
    { name: "thumbnail", maxCount: 8 },
    { name: "images", maxCount: 8 },
  ]),
  addProduct
);

export default productRoute;

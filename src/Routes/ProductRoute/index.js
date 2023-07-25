import express from "express";
import {
  getAllProduct,
  getProduct,
  addProduct,
  searchPro,
  addPreDataProduct,
  addDataForProduct,
} from "../../Controllers/ProductController/index.js";
import { handleError } from "../../Controllers/ErrorController/index.js";
import upload from "../../Controllers/UploadImageController/upload.js";
import { verifyAccessToken } from "../../Middleware/VeryfiToken/index.js";

const productRoute = express.Router();

productRoute.get("/all", getAllProduct, handleError);
productRoute.get("/:id", getProduct, handleError);
productRoute.post(
  "/add",
  verifyAccessToken,
  upload.fields([
    { name: "thumbnail", maxCount: 8 },
    { name: "images", maxCount: 8 },
  ]),
  addProduct,
  handleError,
);
productRoute.post(
  "/addprepro",
  verifyAccessToken,
  upload.fields([{ name: "thumb1" }, { name: "thumb2" }]),
  addPreDataProduct,
  handleError,
);
productRoute.post(
  "/adddataforpro",
  verifyAccessToken,
  upload.fields([
    { name: "image1" },
    { name: "image2" },
    { name: "image3" },
    { name: "image4" },
  ]),
  addDataForProduct,
  handleError,
);
productRoute.post("/search", searchPro, handleError);

export default productRoute;

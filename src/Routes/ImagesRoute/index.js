import express from "express";
import { getImages } from "../../Controllers/ImagesController/index.js";

const imagesRoute = express.Router();

imagesRoute.get("/:name", getImages);

export default imagesRoute;

import express from "express";
import { getImages } from "../../Controllers/ImagesController/index.js";
import { handleError } from "../../Controllers/ErrorController/index.js";

const imagesRoute = express.Router();

imagesRoute.get("/:name", getImages, handleError);

export default imagesRoute;

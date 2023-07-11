import express from "express";
import { handleError } from "../../Controllers/ErrorController/index.js";
import { searchPro } from "../../Controllers/SearchController/index.js";

const searchRoute = express.Router();

searchRoute.post("/", searchPro, handleError);

export default searchRoute;

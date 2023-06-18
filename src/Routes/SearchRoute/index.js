import express from "express";
import { searchPro } from "../../Controllers/SearchController/index.js";

const searchRoute = express.Router();

searchRoute.post("/", searchPro);

export default searchRoute;

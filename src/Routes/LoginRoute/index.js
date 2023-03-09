import express from "express";
import { loginUser } from "../../Controllers/LoginController/index.js";

const loginRoute = express.Router();

loginRoute.post("/", loginUser);

export default loginRoute;

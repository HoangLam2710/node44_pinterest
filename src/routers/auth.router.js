import express from "express";
import {
  login,
  register,
  extendToken,
} from "../controllers/auth.controller.js";
import {
  loginValidation,
  registerValidation,
} from "../middlewares/validations/auth.validation.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerValidation, register);
authRoutes.post("/login", loginValidation, login);
authRoutes.post("/extend-token", extendToken);

export default authRoutes;

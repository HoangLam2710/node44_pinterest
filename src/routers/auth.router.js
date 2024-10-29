import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import {
  loginValidation,
  registerValidation,
} from "../validations/auth.validation.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerValidation, register);
authRoutes.post("/login", loginValidation, login);

export default authRoutes;

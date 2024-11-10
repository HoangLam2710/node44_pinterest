import express from "express";
import {
  login,
  register,
  extendToken,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
} from "../middlewares/validations/auth.validation.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerValidation, register);
authRoutes.post("/login", loginValidation, login);
authRoutes.post("/extend-token", extendToken);
authRoutes.post("/forgot-password", forgotPasswordValidation, forgotPassword);
authRoutes.post("/reset-password", resetPasswordValidation, resetPassword);

export default authRoutes;

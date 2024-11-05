import express from "express";
import {
  uploadAvatar,
  updateAccount,
  getUser,
} from "../controllers/user.controller.js";
import { middlewareToken } from "../config/jwt.js";
import { updateAccountValidation } from "../middlewares/validations/user.validation.js";
import uploadCloud from "../config/upload_cloud.js";

const userRoutes = express.Router();

userRoutes.post(
  "/upload-avatar",
  middlewareToken,
  uploadCloud("avatar").single("avatar"),
  uploadAvatar,
);
userRoutes.put("/", middlewareToken, updateAccountValidation, updateAccount);
userRoutes.get("/", middlewareToken, getUser);

export default userRoutes;

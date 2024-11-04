import express from "express";
import {
  getUser,
  updateAccount,
  uploadAvatar,
} from "../controllers/user.controller.js";
import { middlewareToken } from "../config/jwt.js";
import { updateAccountValidation } from "../middlewares/validations/user.validation.js";
import uploadCloud from "../config/upload_cloud.js";

const userRoutes = express.Router();

userRoutes.get("/", middlewareToken, getUser);
userRoutes.put("/", middlewareToken, updateAccountValidation, updateAccount);

userRoutes.post(
  "/upload-avatar",
  middlewareToken,
  uploadCloud("avatar").single("avatar"),
  uploadAvatar,
);

export default userRoutes;

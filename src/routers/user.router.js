import express from "express";
import {
  createPost,
  updateAccount,
  uploadAvatar,
  uploadImage,
} from "../controllers/user.controller.js";
import { middlewareToken } from "../config/jwt.js";
import {
  createPostValidation,
  updateAccountValidation,
} from "../middlewares/validations/user.validation.js";
import uploadCloud from "../config/upload_cloud.js";

const userRoutes = express.Router();

userRoutes.post(
  "/upload-avatar",
  middlewareToken,
  uploadCloud("avatar").single("avatar"),
  uploadAvatar,
);
userRoutes.put(
  "/update-account",
  middlewareToken,
  updateAccountValidation,
  updateAccount,
);
userRoutes.post(
  "/upload-image",
  middlewareToken,
  uploadCloud("images").single("image"),
  uploadImage,
);
userRoutes.post(
  "/create-post",
  middlewareToken,
  createPostValidation,
  createPost,
);

export default userRoutes;

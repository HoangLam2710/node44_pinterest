import express from "express";
import { updateAccount, uploadAvatar } from "../controllers/user.controller.js";
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

// uploadCloud.array('avatar', 10)

userRoutes.put(
  "/update-account",
  middlewareToken,
  updateAccountValidation,
  updateAccount,
);

export default userRoutes;

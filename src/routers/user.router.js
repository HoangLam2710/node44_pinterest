import express from "express";
import { updateUser, uploadAvatar } from "../controllers/user.controller.js";
import { middlewareToken } from "../config/jwt.js";
import { updateUserValidation } from "../middlewares/validations/user.validation.js";
import uploadCloud from "../config/upload_cloud.js";

const userRoutes = express.Router();

userRoutes.post(
  "/upload-avatar",
  middlewareToken,
  uploadCloud("avatar").single("avatar"),
  uploadAvatar,
);

// uploadCloud.array('avatar', 10)

userRoutes.put("/update", middlewareToken, updateUserValidation, updateUser);

export default userRoutes;

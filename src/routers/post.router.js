import express from "express";
import {
  getPosts,
  searchPosts,
  createPost,
  uploadImage,
} from "../controllers/post.controller.js";
import { middlewareToken } from "../config/jwt.js";
import { createPostValidation } from "../middlewares/validations/post.validation.js";
import uploadCloud from "../config/upload_cloud.js";

const postRoutes = express.Router();

postRoutes.get("/", getPosts);
postRoutes.get("/search", searchPosts);
postRoutes.post(
  "/upload-image",
  middlewareToken,
  uploadCloud("images").single("image"),
  uploadImage,
);
postRoutes.post(
  "/create-post",
  middlewareToken,
  createPostValidation,
  createPost,
);

export default postRoutes;

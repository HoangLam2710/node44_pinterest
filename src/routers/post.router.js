import express from "express";
import {
  uploadImage,
  createPost,
  getPosts,
  searchPosts,
  getDetailPost,
  getPostSaved,
  savePost,
  removePost,
} from "../controllers/post.controller.js";
import { middlewareToken } from "../config/jwt.js";
import {
  getPostsValidation,
  createPostValidation,
} from "../middlewares/validations/post.validation.js";
import { uploadCloud } from "../config/upload_cloud.js";

const postRoutes = express.Router();

postRoutes.post(
  "/upload-image",
  middlewareToken,
  uploadCloud("images").single("image"),
  uploadImage,
);
postRoutes.post("/", middlewareToken, createPostValidation, createPost);
postRoutes.get("/", getPostsValidation, getPosts);
postRoutes.get("/search", searchPosts);

postRoutes.get("/:pid", getDetailPost);
postRoutes.delete("/:pid", middlewareToken, removePost);

postRoutes.post("/:pid/save-post", middlewareToken, savePost);
postRoutes.get("/:pid/get-post-saved", middlewareToken, getPostSaved);

export default postRoutes;

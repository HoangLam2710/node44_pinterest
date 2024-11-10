import express from "express";
import {
  createComment,
  getComments,
} from "../controllers/comment.controller.js";
import { createCommentValidation } from "../middlewares/validations/comment.validation.js";
import { middlewareToken } from "../config/jwt.js";

const commentRoutes = express.Router();

commentRoutes.post(
  "/:pid",
  middlewareToken,
  createCommentValidation,
  createComment,
);
commentRoutes.get("/:pid", middlewareToken, getComments);

export default commentRoutes;

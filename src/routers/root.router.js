import express from "express";
import authRoutes from "./auth.router.js";
import userRoutes from "./user.router.js";
import postRoutes from "./post.router.js";
import commentRoutes from "./comment.router.js";

const rootRoutes = express.Router();

rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/user", userRoutes);
rootRoutes.use("/posts", postRoutes);
rootRoutes.use("/comments", commentRoutes);

export default rootRoutes;

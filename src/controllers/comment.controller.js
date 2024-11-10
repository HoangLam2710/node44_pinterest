import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import catchAsync from "../utils/catch_async.js";
import AppError from "../utils/app_error.js";
import { CREATED, NOT_FOUND, OK } from "../constant/error_code.js";

const prisma = new PrismaClient();

const createComment = catchAsync(async (req, res, next) => {
  const { pid } = req.params;
  const { uid, content } = req.body;

  const checkUser = await prisma.users.findUnique({
    where: { uid },
  });
  if (!checkUser) {
    return next(new AppError("User not found", NOT_FOUND));
  }

  const checkPost = await prisma.posts.findUnique({
    where: { pid },
  });
  if (!checkPost) {
    return next(new AppError("Post not found", NOT_FOUND));
  }

  const newComment = await prisma.comments.create({
    data: {
      cid: uuidv4(),
      content,
      create_at: new Date(),
      pid,
      uid,
    },
  });
  return res.status(CREATED).json({
    message: "Comment created successfully!",
    data: newComment,
  });
});

const getComments = catchAsync(async (req, res, next) => {
  const { pid } = req.params;

  const checkPost = await prisma.posts.findUnique({
    where: { pid },
  });
  if (!checkPost) {
    return next(new AppError("Post not found", NOT_FOUND));
  }

  const comments = await prisma.comments.findMany({
    where: { pid },
  });

  return res.status(OK).json({
    message: "Get comments successfully!",
    data: comments,
  });
});

export { createComment, getComments };

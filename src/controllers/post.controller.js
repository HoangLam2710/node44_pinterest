import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { decodeToken } from "../config/jwt.js";
import catchAsync from "../utils/catch_async.js";
import { NOT_FOUND, OK } from "../constant/error_code.js";
import AppError from "../utils/app_error.js";

const prisma = new PrismaClient();

const getPosts = catchAsync(async (req, res, next) => {
  const { page = 1, perPage = 1000 } = req.query;

  const posts = await prisma.images.findMany({
    skip: (Number(page) - 1) * Number(perPage),
    take: Number(perPage),
    include: {
      users: {
        select: {
          user_name: true,
          full_name: true,
          avatar: true,
        },
      },
    },
  });

  const postsWithAlias = posts.map((post) => ({
    ...post,
    user: post.users,
    users: undefined, // Remove the original users field
  }));

  return res.status(OK).json({
    message: "Get posts successfully!",
    data: postsWithAlias,
  });
});

const searchPosts = catchAsync(async (req, res, next) => {
  const { keyword } = req.query;

  const posts = await prisma.images.findMany({
    where: { img_name: { contains: keyword } },
  });

  return res.status(OK).json({
    message: "Search posts successfully!",
    data: posts,
  });
});

const getDetailPost = catchAsync(async (req, res, next) => {
  const { img_id } = req.params;

  const checkPost = await prisma.images.findUnique({
    where: { img_id },
    include: {
      users: {
        select: {
          user_name: true,
          full_name: true,
          avatar: true,
        },
      },
    },
  });
  if (!checkPost) {
    return next(new AppError("Post not found", NOT_FOUND));
  }

  const postsWithAlias = {
    ...checkPost,
    user: checkPost.users,
    users: undefined, // Remove the original users field
  };

  return res.status(OK).json({
    message: "Get post detail successfully!",
    data: postsWithAlias,
  });
});

const uploadImage = catchAsync(async (req, res, next) => {
  const { path: imagePath } = req.file;

  return res.status(OK).json({
    message: "Upload image successfully!",
    data: { path: imagePath },
  });
});

const createPost = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const userId = decodeToken(authorization);
  const { imageName, imageUrl, description, additionalWebsite } = req.body;

  const checkUser = await prisma.users.findFirst({
    where: { user_id: userId },
  });
  if (!checkUser) {
    return next(new AppError("User not found", NOT_FOUND));
  }

  const newPost = await prisma.images.create({
    data: {
      img_id: uuidv4(),
      img_name: imageName,
      img_url: imageUrl,
      description,
      additional_website: additionalWebsite,
      user_id: userId,
    },
  });

  return res.status(OK).json({
    message: "Create post successfully!",
    data: newPost,
  });
});

export { getPosts, searchPosts, getDetailPost, uploadImage, createPost };

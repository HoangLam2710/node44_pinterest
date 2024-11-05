import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { decodeToken } from "../config/jwt.js";
import catchAsync from "../utils/catch_async.js";
import { NOT_FOUND, OK } from "../constant/error_code.js";
import AppError from "../utils/app_error.js";

const prisma = new PrismaClient();

const uploadImage = catchAsync(async (req, res, next) => {
  const { path: imagePath } = req.file;

  return res.status(OK).json({
    message: "Upload image successfully!",
    data: { path: imagePath },
  });
});

const createPost = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const uid = decodeToken(authorization);
  const { name, imageUrl, description, additionalWebsite } = req.body;

  const checkUser = await prisma.users.findUnique({
    where: { uid },
  });
  if (!checkUser) {
    return next(new AppError("User not found", NOT_FOUND));
  }

  const newPost = await prisma.posts.create({
    data: {
      pid: uuidv4(),
      name,
      img_url: imageUrl,
      description,
      additional_website: additionalWebsite,
      uid,
    },
  });

  return res.status(OK).json({
    message: "Create post successfully!",
    data: newPost,
  });
});

const getPosts = catchAsync(async (req, res, next) => {
  const { page = 1, perPage = 1000 } = req.query;

  const posts = await prisma.posts.findMany({
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

  const posts = await prisma.posts.findMany({
    where: { name: { contains: keyword } },
  });

  return res.status(OK).json({
    message: "Search posts successfully!",
    data: posts,
  });
});

const getDetailPost = catchAsync(async (req, res, next) => {
  const { pid } = req.params;

  const checkPost = await prisma.posts.findUnique({
    where: { pid },
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

const savePost = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const uid = decodeToken(authorization);
  const { pid } = req.params;

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
    return next(new AppError("Image not found", NOT_FOUND));
  }

  const checkSavePost = await prisma.save_post.findFirst({
    where: { uid, pid },
  });

  if (checkSavePost) {
    await prisma.save_post.delete({
      where: { uid_pid: { uid, pid } },
    });
    return res.status(OK).json({
      message: "Unsave post successfully!",
    });
  } else {
    await prisma.save_post.create({
      data: { create_at: new Date(), uid, pid },
    });
    return res.status(OK).json({
      message: "Save post successfully!",
    });
  }
});

export {
  uploadImage,
  createPost,
  getPosts,
  searchPosts,
  getDetailPost,
  savePost,
};

import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { decodeToken } from "../config/jwt.js";
import catchAsync from "../utils/catch_async.js";
import { OK } from "../constant/error_code.js";

const prisma = new PrismaClient();

const getPosts = catchAsync(async (req, res, next) => {
  const posts = await prisma.images.findMany({
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

export { getPosts, uploadImage, createPost };

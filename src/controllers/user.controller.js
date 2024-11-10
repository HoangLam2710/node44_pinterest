import { PrismaClient } from "@prisma/client";

import catchAsync from "../utils/catch_async.js";
import { omitUser } from "../utils/user.js";
import { OK } from "../constant/error_code.js";

const prisma = new PrismaClient();

const getUser = catchAsync(async (req, res, next) => {
  const { uid } = req.body;

  const checkUser = await prisma.users.findUnique({
    where: { uid },
  });
  if (!checkUser) {
    return next(new AppError("User not found", NOT_FOUND));
  }

  return res.status(OK).json({
    message: "Get user successfully",
    data: omitUser(checkUser),
  });
});

const uploadAvatar = catchAsync(async (req, res, next) => {
  const { uid } = req.body;
  const { path: avatarPath } = req.file;

  const checkUser = await prisma.users.findUnique({
    where: { uid },
  });
  if (!checkUser) {
    return next(new AppError("User not found", NOT_FOUND));
  }

  await prisma.users.update({
    where: { uid },
    data: {
      avatar: avatarPath,
    },
  });

  return res.status(OK).json({
    message: "Upload avatar successfully!",
    data: { avatar: avatarPath },
  });
});

const updateAccount = catchAsync(async (req, res, next) => {
  const { uid, fullName, age, bio, website, userName } = req.body;

  const checkUser = await prisma.users.findUnique({
    where: { uid },
  });

  if (!checkUser) {
    return next(new AppError("User not found", NOT_FOUND));
  }

  const userNew = await prisma.users.update({
    where: { uid },
    data: {
      full_name: fullName,
      age,
      bio,
      website,
      user_name: userName,
    },
  });

  return res.status(OK).json({
    message: "Update user successfully",
    data: omitUser(userNew),
  });
});

const getPostCreated = catchAsync(async (req, res, next) => {
  const { uid } = req.body;

  const posts = await prisma.posts.findMany({
    where: { uid },
  });

  return res.status(OK).json({
    message: "Get post created successfully",
    data: posts,
  });
});

const getPostSaved = catchAsync(async (req, res, next) => {
  const { uid } = req.body;

  const posts = await prisma.save_post.findMany({
    where: { uid },
    include: {
      posts: true,
    },
  });

  const data = posts.map((post) => post.posts);

  return res.status(OK).json({
    message: "Get post saved successfully",
    data,
  });
});

export { getUser, uploadAvatar, updateAccount, getPostCreated, getPostSaved };

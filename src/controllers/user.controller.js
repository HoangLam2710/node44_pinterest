import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { decodeToken } from "../config/jwt.js";
import catchAsync from "../utils/catch_async.js";
import { omitUser, responseDataSuccess } from "../utils/user.js";
import { OK } from "../constant/error_code.js";

const prisma = new PrismaClient();

const uploadAvatar = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const userId = decodeToken(authorization);
  const { path: avatarPath } = req.file;

  const checkUser = await prisma.users.findFirst({
    where: { user_id: userId },
  });
  if (!checkUser) {
    return next(new AppError("User not found", NOT_FOUND));
  }

  await prisma.users.update({
    where: { user_id: userId },
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
  const { authorization } = req.headers;
  const userId = decodeToken(authorization);
  const { fullName, age, bio, website, userName } = req.body;

  const checkUser = await prisma.users.findFirst({
    where: { user_id: userId },
  });

  if (!checkUser) {
    return next(new AppError("User not found", NOT_FOUND));
  }

  const userNew = await prisma.users.update({
    where: { user_id: userId },
    data: {
      full_name: fullName,
      age,
      bio,
      website,
      user_name: userName,
    },
  });

  responseDataSuccess(res, OK, "Update user successfully", omitUser(userNew));
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

export { uploadAvatar, updateAccount, uploadImage, createPost };

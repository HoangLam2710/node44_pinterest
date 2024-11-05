import { PrismaClient } from "@prisma/client";

import { decodeToken } from "../config/jwt.js";
import catchAsync from "../utils/catch_async.js";
import { omitUser } from "../utils/user.js";
import { OK } from "../constant/error_code.js";

const prisma = new PrismaClient();

const getUser = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  const userId = decodeToken(authorization);

  const checkUser = await prisma.users.findUnique({
    where: { user_id: userId },
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
  const { authorization } = req.headers;
  const userId = decodeToken(authorization);
  const { path: avatarPath } = req.file;

  const checkUser = await prisma.users.findUnique({
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

  const checkUser = await prisma.users.findUnique({
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

  return res.status(OK).json({
    message: "Update user successfully",
    data: omitUser(userNew),
  });
});

export { getUser, uploadAvatar, updateAccount };

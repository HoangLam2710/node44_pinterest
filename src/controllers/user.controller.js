import { PrismaClient } from "@prisma/client";
import { decodeToken } from "../config/jwt.js";
import catchAsync from "../utils/catch_async.js";
import { omitUser, responseDataSuccess } from "../utils/user.js";
import { OK } from "../constant/error_code.js";

const prisma = new PrismaClient();

const uploadAvatar = catchAsync(async (req, res) => {
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

const updateUser = catchAsync(async (req, res, next) => {
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

export { uploadAvatar, updateUser };

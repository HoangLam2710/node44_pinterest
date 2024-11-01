import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import omit from "lodash/omit.js";
import bcrypt from "bcrypt";

import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER,
  OK,
} from "../constant/error_code.js";
import { createAccessToken, createRefreshToken } from "../config/jwt.js";
import catchAsync from "../utils/catch_async.js";
import AppError from "../utils/app_error.js";

const prisma = new PrismaClient();

const omitUser = (user) => {
  return omit(user, ["password", "refresh_token"]);
};

const responseDataSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    message,
    data,
  });
};

const register = catchAsync(async (req, res, next) => {
  const { email, password, fullName, age, avatar } = req.body;

  const userExist = await prisma.users.findFirst({
    where: { email },
  });

  if (userExist) {
    return next(new AppError("User already exists", BAD_REQUEST));
  }

  const userNew = await prisma.users.create({
    data: {
      user_id: uuidv4(),
      email,
      password: bcrypt.hashSync(password, 10),
      full_name: fullName,
      age,
      avatar,
    },
  });

  responseDataSuccess(res, CREATED, "Register succesfully", omitUser(userNew));
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({
    where: { email },
  });
  if (!user) {
    return next(new AppError("User not found", BAD_REQUEST));
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(new AppError("Incorrect password", BAD_REQUEST));
  }

  const accessToken = createAccessToken({ userId: user.user_id });
  const refreshToken = createRefreshToken({ userId: user.user_id });
  await prisma.users.update({
    where: { user_id: user.user_id },
    data: {
      refresh_token: refreshToken,
    },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  responseDataSuccess(res, OK, "Login succesfully", {
    ...omitUser(user),
    token: accessToken,
  });
});

const extendToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(new AppError("Token not found", UNAUTHORIZED));
  }

  const checkUser = await prisma.users.findFirst({
    where: { refresh_token: refreshToken },
  });
  if (!checkUser) {
    return next(new AppError("Invalid token", UNAUTHORIZED));
  }

  const accessToken = createAccessToken({
    userId: checkUser.user_id,
  });
  responseDataSuccess(res, OK, "Token extended", {
    ...omitUser(checkUser),
    token: accessToken,
  });
});

export { register, login, extendToken };

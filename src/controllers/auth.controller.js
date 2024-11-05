import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import { BAD_REQUEST, CREATED, OK } from "../constant/error_code.js";
import { createAccessToken, createRefreshToken } from "../config/jwt.js";
import catchAsync from "../utils/catch_async.js";
import AppError from "../utils/app_error.js";
import { omitUser } from "../utils/user.js";

const prisma = new PrismaClient();

const register = catchAsync(async (req, res, next) => {
  const { email, password, fullName, age } = req.body;

  const userExist = await prisma.users.findFirst({
    where: { email },
  });

  if (userExist) {
    return next(new AppError("User already exists", BAD_REQUEST));
  }

  const userNew = await prisma.users.create({
    data: {
      uid: uuidv4(),
      email,
      password: bcrypt.hashSync(password, 10),
      full_name: fullName,
      age,
      user_name: email.split("@")[0],
    },
  });

  return res.status(CREATED).json({
    message: "Register successfully",
    data: omitUser(userNew),
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({
    where: { email },
  });
  if (!user) {
    return next(new AppError("Email not found", BAD_REQUEST));
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(new AppError("Incorrect password", BAD_REQUEST));
  }

  const accessToken = createAccessToken({ uid: user.uid });
  const refreshToken = createRefreshToken({ uid: user.uid });
  await prisma.users.update({
    where: { uid: user.uid },
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

  return res.status(OK).json({
    message: "Login successfully",
    data: {
      ...omitUser(user),
      token: accessToken,
    },
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
    uid: checkUser.uid,
  });

  return res.status(OK).json({
    message: "Token extended",
    data: {
      ...omitUser(checkUser),
      token: accessToken,
    },
  });
});

export { register, login, extendToken };
